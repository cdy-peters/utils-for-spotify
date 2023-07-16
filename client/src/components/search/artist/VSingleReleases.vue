<template>
  <router-link
    v-for="single in singles"
    :key="single.id"
    :to="`/album/${single.id}`"
    class="flex flex-row items-center rounded-md px-3 py-1 hover:bg-gray-700 cursor-pointer"
  >
    <img
      :src="getSmallestImage(single.images).url"
      class="w-10 h-10 mr-3"
      alt="Album cover"
      loading="lazy"
    />
    <div>
      <p class="text-lg">{{ single.name }}</p>
      <div class="flex flex-row items-center">
        <svg
          v-if="single.explicit"
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
          {{ getArtistString(single.artists) }}
        </p>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { getArtistString, getSmallestImage } from "@/utils/spotify";

defineProps<{
  singles: any;
}>();
</script>
