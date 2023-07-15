<template>
  <div class="lg:flex flex-row gap-x-16 justify-center px-6">
    <div
      v-if="artist && albums"
      class="sm:flex flex-row gap-x-4 lg:w-1/2 max-lg:max-w-lg"
    >
      <div class="mb-4">
        <div
          class="w-56 h-56 mb-4 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center"
        >
          <img
            v-if="artist.images.length"
            :src="getLargestImage(artist.images).url"
          />
          <svg
            v-else
            role="img"
            height="46"
            width="46"
            viewBox="0 0 24 24"
            class="fill-gray-200"
          >
            <path
              d="m13.363 10.474-.521.625a2.499 2.499 0 0 0 .67 3.766l.285.164a5.998 5.998 0 0 1 1.288-1.565l-.573-.33a.5.5 0 0 1-.134-.754l.52-.624a7.372 7.372 0 0 0 1.837-4.355 7.221 7.221 0 0 0-.29-2.489 5.644 5.644 0 0 0-3.116-3.424A5.771 5.771 0 0 0 6.753 2.87a5.7 5.7 0 0 0-1.19 2.047 7.22 7.22 0 0 0-.29 2.49 7.373 7.373 0 0 0 1.838 4.355l.518.622a.5.5 0 0 1-.134.753L3.5 15.444a5 5 0 0 0-2.5 4.33v2.231h13.54a5.981 5.981 0 0 1-1.19-2H3v-.23a3 3 0 0 1 1.5-2.6l3.995-2.308a2.5 2.5 0 0 0 .67-3.766l-.521-.625a5.146 5.146 0 0 1-1.188-4.918 3.71 3.71 0 0 1 .769-1.334 3.769 3.769 0 0 1 5.556 0c.346.386.608.84.768 1.334.157.562.22 1.146.187 1.728a5.379 5.379 0 0 1-1.373 3.188zm7.641-1.173a1 1 0 0 0-1 1v4.666h-1a3 3 0 1 0 3 3v-7.666a.999.999 0 0 0-1.003-1h.003zm-1 8.666a1 1 0 1 1-1-1h1v1z"
            ></path>
          </svg>
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
          <p class="text-md" v-if="artist.genres.length">
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
