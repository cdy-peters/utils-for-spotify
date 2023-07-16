<template>
  <p class="text-md">
    <span class="font-semibold">Release date:</span>
    {{ dateToString(album.release_date) }}
  </p>
  <p class="text-md">
    <span class="font-semibold">Duration:</span>
    {{ durationToString(totalDuration) }}
  </p>
</template>

<script setup lang="ts">
import { durationToString, dateToString } from "@/utils/spotify";

defineProps({
  album: {
    type: Object,
    required: true,
  },
  totalDuration: {
    type: Number,
    required: true,
  },
});
</script>
