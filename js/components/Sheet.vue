<template>
  <div id="sheet" class="sheet">
    <tabs
      :has-unsaved-changes="hasUnsavedChanges"
      :is-error="isError"
      :is-retrying="isRetrying"
      :is-saving="isSaving"
      :retry-count="retryCount"
      :retry-max="retryMax"
      :view="view"
      :system="system"
      @manual-save="manualSave"
      @update-view="view = $event"
    ></tabs>

    <component :is="layoutComponent" :view="view"></component>
  </div>
</template>

<script>
import { Notyf } from 'notyf';
import { mapState } from 'vuex';
import { throttle } from '../utils';
import Tabs from './Tabs';
import Dnd5eLayout from './systems/dnd5e/Dnd5eLayout';
import CustomLayout from './systems/custom/CustomLayout';
import SwnLayout from './systems/swn/SwnLayout';
import WwnLayout from './systems/wwn/WwnLayout';

export default {
  name: 'Sheet',

  data() {
    return {
      hasUnsavedChanges: false,
      isError: false,
      isPublic: false,
      isRetrying: false,
      isSaving: false,
      notyf: new Notyf({ ripple: false, dismissible: true }),
      retryCount: 0,
      retryMax: 3,
      retryTimer: null,
      view: 'main',
    };
  },

  computed: {
    ...mapState(['is_2024', 'readOnly', 'system']),
    layoutComponent() {
      if (this.system && this.system.startsWith('dnd5e')) {
        return 'dnd5e-layout';
      }
      if (this.system === 'swn') {
        return 'swn-layout';
      }
      if (this.system === 'wwn') {
        return 'wwn-layout';
      }
      if (this.system === 'custom') {
        return 'custom-layout';
      }
      return 'dnd5e-layout'; // Default fallback
    }
  },

  watch: {
    // Watch for view changes and update URL hash
    view(newView) {
      // Update the URL hash without triggering a page reload
      const newUrl = `${window.location.pathname}${window.location.search}#${newView}`;
      window.history.pushState(null, '', newUrl);
    },
  },

  methods: {
    autosaveLoop() {
      if (this.isPublic) {
        return;
      }

      // trigger a quick autosave upon every store mutation
      this.$store.subscribe((mutation, state) => {
        window.sheetEvent.$emit('autosave');
      });

      // when this event fires, schedule a save
      window.sheetEvent.$on('autosave', () => {
        this.resetRetryState();
        this.hasUnsavedChanges = true;
        this.throttledSave();
      });

      // go ahead and trigger the first autosave
      window.sheetEvent.$emit('autosave');
    },

    async manualSave() {
      this.resetRetryState();
      const result = await this.saveSheetState();

      if (result) {
        this.notyf.success({
          duration: 2000,
          message: 'Character sheet saved.',
        });
      }
    },

    async saveSheetState() {
      // Don't save if this is a public sheet (view-only mode)
      if (this.isPublic) {
        return false;
      }

      // Prevent concurrent saves - exit early if already saving
      if (this.isSaving) {
        return false;
      }

      // Set saving state and clear unsaved changes flag optimistically
      this.isSaving = true;
      this.hasUnsavedChanges = false;

      // Step 1: Get the current sheet data as JSON from the Vuex store
      try {
        var json = await this.$store.dispatch('getJSON');
      } catch (error) {
        // If we can't serialize the data, mark as error and stop
        console.error('Caught error', error);
        this.isError = true;
        this.isSaving = false;

        this.notyf.error({
          duration: 0,
          message:
            'Character sheet data is not valid. Please reload the page and try again.',
        });
        return false;
      }

      // Step 2: Prepare the POST request data
      const sheetSlug = document.querySelector('#sheet-slug').value; // Unique sheet identifier from hidden form field
      const csrf = document.querySelector('#csrf').value; // CSRF token for security
      const formBody = new URLSearchParams();

      // Encode the character name and sheet data for form submission
      formBody.set('name', this.$store.state.characterName);
      formBody.set('data', json);
      const formBodyString = formBody.toString();

      // Step 3: Send the save request to the server
      try {
        var response = await fetch(`/sheet/${sheetSlug}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-AJAX-CSRF': csrf, // Include CSRF token in header
          },
          body: formBodyString,
        });

        var respData = await response.json();

        // Update CSRF token if server provides a new one (for subsequent requests)
        if ('csrf' in respData) {
          document.querySelector('#csrf').value = respData.csrf;
        }

        this.isSaving = false;

        // Check if the server reports the save was unsuccessful
        if (!respData.success) {
          const error = new Error(respData.reason);
          error.status = response.status;
          throw error;
        }
      } catch (error) {
        // Step 4: Handle save errors with retry logic
        console.error(error);
        this.isSaving = false;
        this.isError = true;

        // If user is not authenticated, redirect to login
        if (error.status === 403) {
          window.location.href = '/login';
        }

        // For retryable errors (network issues, server errors), implement exponential backoff
        if (this.isRetryableError(error)) {
          this.isRetrying = true;
          this.retryCount++;

          // Give up after max retries and show user notification
          if (this.retryCount > this.retryMax) {
            this.resetRetryState();
            this.notyf.error({
              duration: 0, // Persistent notification until dismissed
              message:
                'Failed to save character sheet. Try a manual save by clicking the save button.',
            });
            return false;
          }

          // Exponential backoff: 1s, 3s, 6s delays
          const delay =
            this.retryCount === 1 ? 1000 : this.retryCount === 2 ? 3000 : 6000;

          // Schedule a retry after the delay
          this.retryTimer = setTimeout(() => {
            this.saveSheetState();
          }, delay);
        }

        return false;
      }

      // Step 5: Save was successful - clean up retry state
      this.resetRetryState();
      this.isError = false;
      this.notyf.dismissAll();

      // Check if more changes occurred while we were saving
      // If so, schedule another save to catch those changes
      if (this.hasUnsavedChanges) {
        this.hasUnsavedChanges = true;
        this.resetRetryState();
        this.throttledSave(); // Use throttled save to avoid rapid-fire saves
      }

      return true;
    },

    isRetryableError(error) {
      // Check HTTP status codes first (most reliable)
      if (error.status) {
        // 5xx server errors are retryable
        if (error.status >= 500 && error.status < 600) {
          return true;
        }
        // 429 Too Many Requests (rate limiting) - could be retryable with backoff
        if (error.status === 429) {
          return true;
        }
        // 4xx client errors are generally not retryable
        if (error.status >= 400 && error.status < 500) {
          return false;
        }
      }

      // Fallback to message checking for network errors without status codes
      const errorMessage = error.message || error.toString();
      const retryableErrors = [
        'networkerror',
        'fetch error',
        'timeout',
        'failed to fetch',
        'network request failed',
        'csrf_failed',
        'test_retry',
      ];

      const lowerError = errorMessage.toLowerCase();
      return retryableErrors.some((errorType) =>
        lowerError.includes(errorType)
      );
    },

    resetRetryState() {
      if (this.retryTimer) {
        clearTimeout(this.retryTimer);
        this.retryTimer = null;
      }
      this.isRetrying = false;
      this.retryCount = 0;
    },

    refreshLoop() {
      var sheetSlug = document.querySelector('#sheet-slug').value;

      fetch(`/sheet-data/${sheetSlug}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            this.$store
              .dispatch('updateState', { sheet: data.sheet })
              .catch((reason) => console.log(reason));
          }
        })
        .catch((reason) => console.error(reason));
    },

    // Get the current view from URL hash
    getViewFromHash() {
      const hash = window.location.hash.substring(1); // Remove the # symbol
      const validViews = ['main', 'spells', 'abilities', 'inventory', 'details', 'notes'];
      return validViews.includes(hash) ? hash : 'main';
    },

    // Handle browser navigation (back/forward buttons)
    handleHashChange() {
      const newView = this.getViewFromHash();
      if (newView !== this.view) {
        this.view = newView;
      }
    },
  },

  components: {
    tabs: Tabs,
    'dnd5e-layout': Dnd5eLayout,
    'custom-layout': CustomLayout,
    'swn-layout': SwnLayout,
    'wwn-layout': WwnLayout,
  },

  mounted() {
    const parsedSheet = JSON.parse(sheet);
    if (parsedSheet.is_public && parsedSheet.email === null) {
      this.isPublic = true;
      setInterval(() => this.refreshLoop(), 5000);
    }

    if (!this.isPublic) {
      this.autosaveLoop();
    }

    // Initialize view from URL hash
    this.view = this.getViewFromHash();
    window.addEventListener('hashchange', this.handleHashChange);
  },

  created() {
    // initialize state with the "sheet" global
    this.$store
      .dispatch('initializeState', { sheet: window.sheet })
      .catch((reason) => console.log(reason));

    this.throttledSave = throttle(this.saveSheetState, 5000, {
      leading: false,
      trailing: true,
      trailingWait: 1000,
    });
  },

  beforeDestroy() {
    window.removeEventListener('hashchange', this.handleHashChange);
  },
};
</script>
