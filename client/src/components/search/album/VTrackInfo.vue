<template>
  <p class="text-md">
    <span class="font-semibold">Release date:</span>
    {{ dateToString(album.release_date) }}
  </p>
  <p class="text-md">
    <span class="font-semibold">Duration:</span>
    {{ durationToString(track.duration_ms) }}
  </p>
  <p class="text-md">
    <span class="font-semibold">Tempo:</span>
    {{ Math.round(trackFeatures.tempo) }} BPM
  </p>
  <p class="text-md">
    <span class="font-semibold">Pitch:</span>
    {{ keyToPitch(trackFeatures.key) }}
  </p>
  <p class="text-md">
    <span class="font-semibold">Time signature:</span>
    {{ trackFeatures.time_signature }}
  </p>
  <p class="text-md">
    <span class="font-semibold">Modality:</span>
    {{ trackFeatures.mode ? "Major" : "Minor" }}
  </p>
</template>

<script setup lang="ts">
import { durationToString, dateToString, keyToPitch } from "@/utils/spotify";

defineProps({
  album: {
    type: Object,
    required: true,
  },
  track: {
    type: Object,
    required: true,
  },
  trackFeatures: {
    type: Object,
    required: true,
  },
});
</script>
