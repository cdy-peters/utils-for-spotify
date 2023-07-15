<template>
  <button
    :class="
      type == label ? 'bg-white text-black' : 'bg-gray-600 hover:bg-gray-650'
    "
    class="text-sm rounded-full py-1 px-3"
    @click="typeHandler(label)"
  >
    {{ label.charAt(0).toUpperCase() + label.slice(1) }}
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  type: string;
  typeHandler: (type: string) => void;
}>();
</script>
