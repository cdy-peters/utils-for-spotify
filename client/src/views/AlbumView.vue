<template>
  <div class="lg:flex flex-row gap-x-16 justify-center px-6 mb-8">
    <div
      v-if="album && averageTrackFeatures"
      class="sm:flex flex-row gap-x-4 lg:w-1/2 max-lg:max-w-lg"
    >
      <div class="mb-4">
        <img :src="getLargestImage(album.images).url" class="w-56 h-56 mb-4" />
        <a
          class="block text-center w-56 text-md font-semibold leading-6 px-3 py-2 rounded-md bg-green text-black hover:bg-green-hover hover:text-white"
          :href="
            selectedTrack
              ? selectedTrack.external_urls.spotify
              : album.external_urls.spotify
          "
          >Open in Spotify</a
        >
      </div>

      <div class="mb-8">
        <div class="mb-4">
          <template v-if="selectedTrack">
            <p class="text-xl">{{ selectedTrack.name }}</p>
            <div class="flex flex-row items-center">
              <svg
                v-if="selectedTrack.explicit"
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

              <p
                class="text-lg text-gray-200"
                v-html="getArtistString(selectedTrack.artists, true)"
              ></p>
            </div>
          </template>
          <template v-else>
            <p class="text-xl">{{ album.name }}</p>

            <div class="flex flex-row items-center">
              <p
                class="text-lg text-gray-200"
                v-html="getArtistString(album.artists, true)"
              ></p>
            </div>
          </template>
        </div>

        <VTrackInfo
          v-if="selectedTrack"
          :album="album"
          :track="selectedTrack"
          :trackFeatures="selectedTrack.features"
        />
        <VAlbumInfo v-else :album="album" :total-duration="totalDuration" />
      </div>
    </div>

    <VFeatures
      v-if="averageTrackFeatures"
      :label="
        selectedTrack ? 'Track features' : 'Average features of album tracks'
      "
      :trackFeatures="
        selectedTrack ? selectedTrack.features : averageTrackFeatures
      "
    />
  </div>

  <div v-if="tracks" class="lg:mx-8 px-6">
    <p v-if="album.album_type === 'album'" class="text-sm">Album</p>
    <p v-else-if="album.album_type === 'compilation'" class="text-sm">
      Compilation
    </p>
    <p v-else class="text-sm">Single</p>
    <p
      class="text-xl font-semibold hover:underline hover:cursor-pointer"
      @click="selectedTrack = null"
    >
      {{ album.name }}
    </p>
    <table class="w-full">
      <tr>
        <th class="w-12"></th>
        <th></th>
      </tr>
      <tr
        v-for="track in tracks"
        :key="track.id"
        :class="
          selectedTrack && selectedTrack.id === track.id
            ? 'bg-gray-700'
            : 'hover:bg-gray-700 cursor-pointer'
        "
        @click="setSelectedTrack(track.id)"
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
  getAverageFeatures,
} from "@/utils/spotify";
import VFeatures from "@/components/VFeatures.vue";
import VTrackInfo from "@/components/search/album/VTrackInfo.vue";
import VAlbumInfo from "@/components/search/album/VAlbumInfo.vue";

const authStore = useAuthStore();

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  track: {
    type: String,
    default: null,
  },
});

const album = ref<any>(null);
const tracks = ref<any>(null);
const totalDuration = ref<number>(0);
const tracksFeatures = ref<{ id: string; features: any }[]>([]);
const averageTrackFeatures = ref<any>(null);
const selectedTrack = ref<any>(null);

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

  if (props.track) {
    const trackId = props.track;
    setSelectedTrack(trackId!);
  }
});

const setSelectedTrack = (id: string) => {
  selectedTrack.value = tracks.value.find((track: any) => track.id === id);
  const trackFeatures = tracksFeatures.value.find(
    (track: any) => track.id === id
  );
  if (trackFeatures) {
    selectedTrack.value.features = trackFeatures.features;
  }
};
</script>
