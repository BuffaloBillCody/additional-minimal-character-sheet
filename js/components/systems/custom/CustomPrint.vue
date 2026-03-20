<template>
  <div class="print-sheet custom-print">
    <h1 class="character-name text-left">{{ characterName }}</h1>
    <p class="muted mb-md">System: Custom Layout</p>

    <div v-for="(section, sIndex) in layout" :key="sIndex" class="section mt-md">
       <p class="header">{{ section.title }}</p>
       <div v-for="(field, fIndex) in section.fields" :key="fIndex" class="field-row mt-sm mb-sm border-bottom pb-xs">
          <div class="flex justify-content-between align-items-end">
            <span class="print-field-label caps">{{ field.label }}</span>
            <span class="print-field-value">{{ fields[field.key] || '_________' }}</span>
          </div>
       </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'CustomPrint',
  computed: {
    ...mapState(['characterName', 'layout', 'fields']),
  }
};
</script>

<style scoped>
.field-row {
  min-height: 1.5rem;
}
.print-field-value {
  font-family: var(--font-mono, monospace);
  flex-grow: 1;
  text-align: right;
  margin-left: 1rem;
}
</style>
