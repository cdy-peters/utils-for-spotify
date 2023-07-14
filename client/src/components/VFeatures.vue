<template>
  <div>
    <div class="flex justify-between mb-2">
      <p class="text-md font-medium text-gray-100">Feature</p>
      <p class="text-sm font-medium text-gray-100">Value (0 - 1)</p>
    </div>
    <VRangeBar
      label="Acousticness"
      :value="trackFeatures.acousticness"
      :min="0"
      :max="1"
      color="bg-beige"
    />
    <VRangeBar
      label="Danceability"
      :value="trackFeatures.danceability"
      :min="0"
      :max="1"
      color="bg-orange-600"
    />
    <VRangeBar
      label="Energy"
      :value="trackFeatures.energy"
      :min="0"
      :max="1"
      color="bg-yellow-400"
    />
    <VRangeBar
      label="Instrumentalness"
      :value="trackFeatures.instrumentalness"
      :min="0"
      :max="1"
      color="bg-sky-400"
    />
    <VRangeBar
      label="Liveness"
      :value="trackFeatures.liveness"
      :min="0"
      :max="1"
      color="bg-green"
    />
    <VRangeBar
      label="Speechiness"
      :value="trackFeatures.speechiness"
      :min="0"
      :max="1"
      color="bg-stone-50"
    />
    <VRangeBar
      label="Valence"
      :value="trackFeatures.valence"
      :min="0"
      :max="1"
      color="bg-purple-500"
    />
  </div>
</template>

<script setup lang="ts">
import VRangeBar from "@/components/VRangeBar.vue";

defineProps({
  trackFeatures: {
    type: Object,
    required: true,
  },
});
</script>
