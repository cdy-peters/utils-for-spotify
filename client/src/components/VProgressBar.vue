<template>
  <div class="w-full bg-gray-700 rounded-md">
    <div :style="{ width: `${value}%` }" class="bg-green text-white rounded-md">
      <p class="px-2">{{ value }}%</p>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
};
</script>
