<template>
  <p class="text-md" v-if="artist.genres.length">
    <span class="font-semibold">Genres:</span>
    {{ genresToString(artist.genres) }}
  </p>
  <p class="text-md">
    <span class="font-semibold">Singles/EPs:</span>
    {{ singles.length }}
  </p>
  <p class="text-md">
    <span class="font-semibold">Albums:</span>
    {{ albums.length }}
  </p>
</template>

<script setup lang="ts">
import { genresToString } from "@/utils/spotify";

defineProps({
  artist: {
    type: Object,
    required: true,
  },
  albums: {
    type: Array,
    required: true,
  },
  singles: {
    type: Array,
    required: true,
  },
});
</script>
