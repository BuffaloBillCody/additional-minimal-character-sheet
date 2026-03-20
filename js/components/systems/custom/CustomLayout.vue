<template>
  <div class="custom-layout page container">
    <h2>Custom Character Sheet Layout</h2>
    <p>This is a custom character sheet. You can define your own fields and layout in the future.</p>
    
    <div class="bio mt-md mb-md">
      <label class="block">Character Name:</label>
      <input type="text" class="field field-visible size-full" v-model="characterName">
    </div>

    <div v-if="layout.length === 0" class="announcement mt-md">
      <p>No layout defined yet. Add fields below.</p>
    </div>

    <div v-for="(section, sIndex) in layout" :key="sIndex" class="section mt-md">
       <h3>{{ section.title }}</h3>
       <div v-for="(field, fIndex) in section.fields" :key="fIndex" class="field-row mt-sm">
          <label class="block">{{ field.label }}</label>
          <input 
            v-if="field.type === 'text'" 
            type="text" 
            class="field field-visible size-full"
            v-model="fields[field.key]"
          >
          <textarea 
            v-if="field.type === 'textarea'" 
            class="field field-visible size-full"
            v-model="fields[field.key]"
          ></textarea>
       </div>
    </div>

    <div class="layout-builder mt-xl pt-md border-top" v-if="!readOnly">
      <h3>Layout Builder (Preview)</h3>
      <p>Add fields to your sheet:</p>
      <div class="row">
         <input type="text" v-model="newFieldLabel" placeholder="Field Label" class="field">
         <select v-model="newFieldType" class="field">
           <option value="text">Text Input</option>
           <option value="textarea">Multi-line Text</option>
         </select>
         <button @click="addField" class="button-primary">Add Field</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'CustomLayout',
  props: {
    view: {
      type: String,
      default: 'main',
    },
  },
  data() {
    return {
      newFieldLabel: '',
      newFieldType: 'text',
    };
  },
  computed: {
    ...mapState(['readOnly', 'layout', 'fields']),
    characterName: {
      get() { return this.$store.state.characterName; },
      set(val) { this.$store.commit('updateTextField', { field: 'characterName', val }); }
    }
  },
  methods: {
    addField() {
      if (!this.newFieldLabel) return;
      
      const key = this.newFieldLabel.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const newField = {
        label: this.newFieldLabel,
        type: this.newFieldType,
        key,
      };

      let newLayout = [...this.layout];
      if (newLayout.length === 0) {
        newLayout.push({ title: 'General', fields: [] });
      }
      newLayout[0].fields.push(newField);
      
      this.$store.commit('updateTextField', { field: 'layout', val: newLayout });
      
      // Initialize field data if not present
      if (!this.fields[key]) {
        let newFields = { ...this.fields };
        newFields[key] = '';
        this.$store.commit('updateTextField', { field: 'fields', val: newFields });
      }

      this.newFieldLabel = '';
    }
  }
};
</script>
