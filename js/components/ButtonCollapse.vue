<template>
  <button
    :title="collapsed ? (expandTitle || 'Expand content') : (collapseTitle || 'Collapse content')"
    @click="$emit('click')"
    class="button button-collapse"
    type="button"
  >
    <i
      :class="
        collapsed
          ? 'fa-solid fa-folder-open'
          : 'fa-solid fa-folder'
      "
      role="presentation"
    ></i>
    <div class="sr-only">
      {{ collapsed ? (expandTitle || 'Expand content') : (collapseTitle || 'Collapse content') }}
    </div>
  </button>
</template>

<script>
export default {
  name: 'ButtonCollapse',

  props: ['collapsed', 'collapseTitle', 'expandTitle'],
};
</script>
