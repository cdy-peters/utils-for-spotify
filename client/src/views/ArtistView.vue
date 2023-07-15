<template>
  <div class="lg:flex flex-row gap-x-16 justify-center px-6">
    <div
      v-if="artist && albums"
      class="sm:flex flex-row gap-x-4 lg:w-1/2 max-lg:max-w-lg"
    >
      <div class="mb-4">
        <div class="w-56 h-56 mb-4 rounded-full overflow-hidden">
          <img :src="getLargestImage(artist.images).url" />
        </div>
        <a
          class="max-sm:hidden block text-center w-56 text-md font-semibold leading-6 px-3 py-2 rounded-md bg-green text-black hover:bg-green-hover hover:text-white"
          :href="artist.external_urls.spotify"
          >Open in Spotify</a
        >
      </div>

      <div class="mb-4">
        <div class="mb-4">
          <p class="text-xl">{{ artist.name }}</p>
          <p class="text-lg text-gray-300">
            {{ formatNumber(artist.followers.total) }} followers
          </p>
          <a
            class="sm:hidden block text-center w-56 mt-1 text-md font-semibold leading-6 px-3 py-2 rounded-md bg-green text-black hover:bg-green-hover hover:text-white"
            :href="artist.external_urls.spotify"
            >Open in Spotify</a
          >
        </div>

        <div>
          <p class="text-md">
            <span class="font-semibold">Genres:</span>
            {{ genresToString(artist.genres) }}
          </p>
          <p class="text-md">
            <span class="font-semibold">Albums:</span>
            {{ albums.length }}
          </p>
          <p class="text-md">
            <span class="font-semibold">Singles:</span>
            {{ singles.length }}
          </p>
        </div>
      </div>
    </div>

    <VFeatures
      v-if="averageTrackFeatures"
      label="Average features of top tracks"
      :trackFeatures="averageTrackFeatures"
    />
  </div>

  <!-- TODO: Add tracks -->
  <!-- <div v-if="tracks">
    <div v-for="track in tracks" :key="track.id">
      <p>{{ track.id }}</p>
    </div>
  </div> -->
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import {
  getArtist,
  getArtistAlbums,
  getArtistTopTracks,
  getTracksFeatures,
} from "@/utils/api";
import {
  getLargestImage,
  getArtistString,
  getAverageFeatures,
  formatNumber,
  genresToString,
} from "@/utils/spotify";
import VFeatures from "@/components/VFeatures.vue";

const authStore = useAuthStore();

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const artist = ref<any>(null);
const singles = ref<any>(null);
const albums = ref<any>(null);
const topTracks = ref<any>(null);
const tracksFeatures = ref<{ id: string; features: any }[]>([]);
const averageTrackFeatures = ref<any>(null);

onMounted(async () => {
  let data: any;
  data = await getArtist(authStore.getAccessToken, props.id);
  artist.value = data;

  let i = 0;
  do {
    data = await getArtistAlbums(
      authStore.getAccessToken,
      props.id,
      ["single"],
      i
    );
    singles.value = singles.value
      ? singles.value.concat(data.items)
      : data.items;
    i++;
  } while (data.next);

  i = 0;
  do {
    data = await getArtistAlbums(
      authStore.getAccessToken,
      props.id,
      ["album"],
      i
    );
    albums.value = albums.value ? albums.value.concat(data.items) : data.items;
    i++;
  } while (data.next);

  topTracks.value = await getArtistTopTracks(
    authStore.getAccessToken,
    props.id
  );
  const features = await getTracksFeatures(
    authStore.getAccessToken,
    topTracks.value.tracks.map((track: any) => track.id)
  );
  tracksFeatures.value = features.audio_features.map((feature: any) => ({
    id: feature.id,
    features: feature,
  }));
  averageTrackFeatures.value = getAverageFeatures(tracksFeatures.value);
});
</script>
