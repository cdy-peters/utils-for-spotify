<template>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div
      class="bg-gray-900 p-4 sm:rounded-lg flex flex-row items-center"
      v-if="user"
    >
      <img
        :src="getLargestImage(user.images).url"
        class="w-24 h-24 rounded-full"
        alt="Profile picture"
      />
      <div class="flex flex-col ml-4">
        <p class="text-xl">{{ user.name }}</p>
        <p class="text-lg text-gray-300">{{ user.id }}</p>
      </div>
    </div>

    <div class="bg-gray-900 p-4 sm:rounded-lg" v-if="playback">
      <p class="mb-3 text-xl font-semibold">
        {{ playback.is_playing ? "Currently playing: " : "Recently played: " }}
      </p>

      <div className="flex flex-row">
        <img
          :src="getLargestImage(playback.item.album.images).url"
          class="w-24 h-24 rounded"
          alt="Album cover"
        />
        <div class="flex flex-col ml-4">
          <p class="text-xl">{{ playback.item.name }}</p>
          <p class="text-md text-gray-300">
            {{ getArtistString(playback.item.artists) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useSpotifyStore } from "@/stores/spotify";
import { getLargestImage, getArtistString } from "@/utils/spotify";
import { getCurrentUserPlayback } from "@/utils/api";

const authStore = useAuthStore();
const spotifyStore = useSpotifyStore();

const accessToken = authStore.getAccessToken;
const user = spotifyStore.user;

let playback: any = ref(null);

onMounted(async () => {
  playback.value = await getCurrentUserPlayback(accessToken);
});
</script>
