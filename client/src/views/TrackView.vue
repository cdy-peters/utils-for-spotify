<template>
  <div class="lg:flex flex-row gap-x-16 justify-center px-6">
    <div
      v-if="track && trackFeatures"
      class="sm:flex flex-row gap-x-4 lg:w-1/2 max-lg:max-w-lg"
    >
      <div class="mb-4">
        <img
          :src="getLargestImage(track.album.images).url"
          class="w-56 h-56 mb-4"
        />
        <a
          class="max-sm:hidden block text-center w-56 text-md font-semibold leading-6 px-3 py-2 rounded-md bg-green text-black hover:bg-green-hover hover:text-white"
          :href="track.external_urls.spotify"
          >Open in Spotify</a
        >
      </div>

      <div class="mb-4">
        <div class="mb-4">
          <p class="text-xl">{{ track.name }}</p>
          <div class="flex flex-row items-center">
            <svg
              v-if="track.explicit"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="text-gray-200 mr-2"
              viewBox="0 0 16 16"
            >
              <path
                d="M2.5 0A2.5 2.5 0 0 0 0 2.5v11A2.5 2.5 0 0 0 2.5 16h11a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 13.5 0h-11Zm4.326 10.88H10.5V12h-5V4.002h5v1.12H6.826V7.4h3.457v1.073H6.826v2.408Z"
              />
            </svg>

            <p
              class="text-lg text-gray-300"
              v-html="getArtistString(track.artists, true)"
            ></p>
          </div>
          <a
            class="sm:hidden block text-center w-56 mt-1 text-md font-semibold leading-6 px-3 py-2 rounded-md bg-green text-black hover:bg-green-hover hover:text-white"
            :href="track.external_urls.spotify"
            >Open in Spotify</a
          >

          <div v-if="track.album.album_type === 'album'">
            <a
              class="text-md text-gray-300 hover:text-gray-100 cursor-pointer"
              :href="`/album/${track.album.id}`"
            >
              Track {{ track.track_number }} on {{ track.album.name }}
            </a>
          </div>
        </div>

        <div>
          <p class="text-md">
            <span class="font-semibold">Release date:</span>
            {{ dateToString(track.album.release_date) }}
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
        </div>
      </div>
    </div>

    <VFeatures v-if="trackFeatures" label="Track features" :trackFeatures="trackFeatures" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { getTrack, getTrackFeatures } from "@/utils/api";
import {
  getLargestImage,
  getArtistString,
  durationToString,
  keyToPitch,
  dateToString,
} from "@/utils/spotify";
import VFeatures from "@/components/VFeatures.vue";

const authStore = useAuthStore();

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const track = ref<any>(null);
const trackFeatures = ref<any>(null);

onMounted(async () => {
  track.value = await getTrack(authStore.getAccessToken, props.id);
  trackFeatures.value = await getTrackFeatures(
    authStore.getAccessToken,
    props.id
  );
});
</script>
