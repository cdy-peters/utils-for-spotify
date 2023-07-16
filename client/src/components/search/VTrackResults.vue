<template>
  <router-link
    v-for="track in tracks"
    :key="track.id"
    :to="`/album/${track.album.id}?track=${track.id}`"
    class="flex flex-row items-center rounded-md px-2 py-1 hover:bg-gray-700 cursor-pointer"
  >
    <img
      :src="track.image"
      class="w-10 h-10 mr-3"
      alt="Album cover"
      loading="lazy"
    />
    <div>
      <p class="text-lg">{{ track.name }}</p>
      <div class="flex flex-row items-center">
        <svg
          v-if="track.explicit"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="text-gray-300 mr-2"
          viewBox="0 0 16 16"
        >
          <path
            d="M2.5 0A2.5 2.5 0 0 0 0 2.5v11A2.5 2.5 0 0 0 2.5 16h11a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 13.5 0h-11Zm4.326 10.88H10.5V12h-5V4.002h5v1.12H6.826V7.4h3.457v1.073H6.826v2.408Z"
          />
        </svg>

        <p class="text-md text-gray-200">
          {{ track.artists }}
        </p>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { getSmallestImage, getArtistString } from "@/utils/spotify";

const props = defineProps<{
  results: any[];
}>();

const tracks = ref<any[]>([]);

onMounted(async () => {
  updateTracks(props.results);
});

watch(
  () => props.results,
  (results) => updateTracks(results)
);

const updateTracks = (results: any[]) => {
  tracks.value = results.map((track) => ({
    id: track.id,
    album: track.album,
    type: track.type,
    image: getSmallestImage(track.album.images).url,
    name: track.name,
    artists: getArtistString(track.artists),
    explicit: track.explicit,
  }));
};
</script>
