<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    default: 'open'
  }
});

const info = computed(() => {
  const map = {
    open: { label: 'Open', className: 'bg-green-100 text-green-800' },
    in_progress: { label: 'In Progress', className: 'bg-amber-100 text-amber-800' },
    closed: { label: 'Closed', className: 'bg-gray-100 text-gray-700' }
  };
  return map[props.status] || map.open;
});
</script>


<template>
  <span :class="`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${info.className}`">
    {{ info.label }}
  </span>
</template>