<template>
  <div class="mb-2">
    <div class="flex justify-between mb-1">
      <span class="text-md font-medium text-gray-100">{{ label }}</span>
      <span class="text-sm font-medium text-gray-100">{{
        parseFloat(value.toFixed(5))
      }}</span>
    </div>
    <div
      class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden"
    >
      <div
        :style="{ width: widthPercentage }"
        class="h-2.5 rounded-full"
        :class="color"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: false,
    default: "bg-green",
  },
  value: {
    type: Number,
    required: true,
  },
  min: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
});

const widthPercentage = computed(() => {
  const range = props.max - props.min;
  const normalizedValue = props.value - props.min;
  return `${(normalizedValue / range) * 100}%`;
});
</script>
