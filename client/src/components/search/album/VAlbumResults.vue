<template>
  <router-link
    v-for="album in albums"
    :key="album.id"
    :to="`/album/${album.id}`"
    class="flex flex-row items-center rounded-md px-2 py-1 hover:bg-gray-700 cursor-pointer"
  >
    <img
      :src="album.image"
      class="w-10 h-10 mr-3"
      alt="Album cover"
      loading="lazy"
    />
    <div>
      <p class="text-xl">{{ album.name }}</p>
      <p class="text-md text-gray-200">
        {{ album.artists }}
      </p>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { getSmallestImage, getArtistString } from "@/utils/spotify";

const props = defineProps<{
  results: any[];
}>();

const albums = ref<any[]>([]);

onMounted(async () => {
  updateAlbums(props.results);
});

watch(
  () => props.results,
  (results) => updateAlbums(results)
);

const updateAlbums = (results: any[]) => {
  albums.value = results.map((album) => ({
    id: album.id,
    type: album.type,
    image: getSmallestImage(album.images).url,
    name: album.name,
    artists: getArtistString(album.artists),
  }));
};
</script>
