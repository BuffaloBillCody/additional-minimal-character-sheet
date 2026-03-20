<template>
  <div class="print-container">
    <component :is="printComponent"></component>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Dnd5ePrint from './systems/dnd5e/Dnd5ePrint';
import CustomPrint from './systems/custom/CustomPrint';
import SwnPrint from './systems/swn/SwnPrint';
import WwnPrint from './systems/wwn/WwnPrint';

export default {
  name: 'Print',

  computed: {
    ...mapState(['system']),
    printComponent() {
      if (this.system && this.system.startsWith('dnd5e')) {
        return 'dnd5e-print';
      }
      if (this.system === 'swn') {
        return 'swn-print';
      }
      if (this.system === 'wwn') {
        return 'wwn-print';
      }
      if (this.system === 'custom') {
        return 'custom-print';
      }
      return 'dnd5e-print'; // Default fallback
    }
  },

  created() {
    // Initialize the Vuex store with character data from the server
    if (typeof window.sheet !== 'undefined') {
      this.$store.dispatch('initializeState', {
        sheet: window.sheet,
      });
    }
  },

  components: {
    'dnd5e-print': Dnd5ePrint,
    'custom-print': CustomPrint,
    'swn-print': SwnPrint,
    'wwn-print': WwnPrint,
  },
};
</script>
