<template>
  <a
    v-for="track in tracks"
    :key="track.id"
    :href="`/track/${track.id}`"
    class="flex flex-row items-center rounded-md px-2 py-1 hover:bg-gray-800 cursor-pointer"
  >
    <img
      :src="track.image"
      class="w-10 h-10 mr-3"
      alt="Album cover"
      loading="lazy"
    />
    <div>
      <p class="text-xl">{{ track.name }}</p>
      <p class="text-md text-gray-300">
        {{ track.artists }}
      </p>
    </div>
  </a>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getSmallestImage, getArtistString } from "@/utils/spotify";

const props = defineProps<{
  results: any[];
}>();

const tracks = ref<any[]>([]);

onMounted(async () => {
  tracks.value = props.results.map((track) => ({
    id: track.id,
    type: track.type,
    image: getSmallestImage(track.album.images).url,
    name: track.name,
    artists: getArtistString(track.artists),
  }));
});
</script>
