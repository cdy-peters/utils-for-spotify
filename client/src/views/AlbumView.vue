<template>
  <div class="lg:flex flex-row gap-x-16 justify-center px-6 mb-8">
    <div
      v-if="album && averageTrackFeatures"
      class="sm:flex flex-row gap-x-4 lg:w-1/2 max-lg:max-w-lg"
    >
      <div class="mb-4">
        <img :src="getLargestImage(album.images).url" class="w-56 h-56 mb-4" />
        <a
          class="max-sm:hidden block text-center w-56 text-md font-semibold leading-6 px-3 py-2 rounded-md bg-green text-black hover:bg-green-hover hover:text-white"
          :href="album.external_urls.spotify"
          >Open in Spotify</a
        >
      </div>

      <div class="mb-8">
        <div class="mb-4">
          <p class="text-xl">{{ album.name }}</p>
          <div class="flex flex-row items-center">
            <p
              class="text-lg text-gray-200"
              v-html="getArtistString(album.artists, true)"
            ></p>
          </div>
          <a
            class="sm:hidden block text-center w-56 mt-1 text-md font-semibold leading-6 px-3 py-2 rounded-md bg-green text-black hover:bg-green-hover hover:text-white"
            :href="album.external_urls.spotify"
            >Open in Spotify</a
          >
        </div>

        <div>
          <p class="text-md">
            <span class="font-semibold">Release date:</span>
            {{ dateToString(album.release_date) }}
          </p>
          <p class="text-md">
            <span class="font-semibold">Tracks:</span>
            {{ album.total_tracks }}
          </p>
          <p class="text-md">
            <span class="font-semibold">Duration:</span>
            {{ durationToString(totalDuration) }}
          </p>
        </div>
      </div>
    </div>

    <VFeatures
      v-if="averageTrackFeatures"
      label="Average features of album tracks"
      :trackFeatures="averageTrackFeatures"
    />
  </div>

  <div v-if="tracks" class="lg:mx-8 px-6">
    <p class="text-xl font-semibold">Track List</p>
    <table class="w-full">
      <tr>
        <th class="w-12"></th>
        <th></th>
      </tr>
      <tr
        v-for="track in tracks"
        :key="track.id"
        class="hover:bg-gray-700 cursor-pointer"
        @click="$router.push(`/track/${track.id}`)"
      >
        <td class="text-lg text-gray-200 text-center rounded-s-md">
          {{ track.track_number }}
        </td>
        <td class="rounded-e-md">
          <p class="text-lg">{{ track.name }}</p>
          <div class="flex items-center">
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
              {{ getArtistString(track.artists) }}
            </p>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { getAlbum, getNextAlbumTracks, getTracksFeatures } from "@/utils/api";
import {
  getLargestImage,
  getArtistString,
  durationToString,
  dateToString,
  getAverageFeatures,
} from "@/utils/spotify";
import VFeatures from "@/components/VFeatures.vue";

const authStore = useAuthStore();

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const album = ref<any>(null);
const tracks = ref<any>(null);
const totalDuration = ref<number>(0);
const tracksFeatures = ref<{ id: string; features: any }[]>([]);
const averageTrackFeatures = ref<any>(null);

onMounted(async () => {
  const data = await getAlbum(authStore.getAccessToken, props.id);
  album.value = data;
  tracks.value = data.tracks.items;

  while (data.tracks.next) {
    const nextData = await getNextAlbumTracks(
      authStore.getAccessToken,
      data.tracks.next
    );
    tracks.value = tracks.value.concat(nextData.items);
    data.tracks.next = nextData.next;
  }

  let i = 0;
  while (i < tracks.value.length) {
    const currentBatch = tracks.value.slice(i, i + 100).map((track: any) => {
      totalDuration.value += track.duration_ms;
      return track.id;
    });
    const features = await getTracksFeatures(
      authStore.getAccessToken,
      currentBatch
    );

    tracksFeatures.value = tracksFeatures.value.concat(
      features.audio_features.map((feature: any) => ({
        id: feature.id,
        features: feature,
      }))
    );

    i += 100;
  }

  averageTrackFeatures.value = getAverageFeatures(tracksFeatures.value);
});
</script>
