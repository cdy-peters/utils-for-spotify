<template>
  <div class="lg:w-3/5 m-auto">
    <div class="relative mb-2 mx-2">
      <div
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
      >
        <MagnifyingGlassIcon class="w-5 h-5 text-gray-200" />
      </div>
      <input
        type="text"
        name="search-item"
        id="search-item"
        class="block w-full rounded-full border-0 py-2 pl-10 pr-20 bg-gray-800 hover:bg-gray-600 text-gray-100 ring-1 ring-inset ring-none placeholder:text-gray-200 sm:text-sm sm:leading-6"
        placeholder="Search tracks"
        v-model="searchQuery"
      />
    </div>

    <div class="flex flex-row gap-x-3 mx-2 mb-2">
      <VTypeButton label="track" :type="type" :typeHandler="typeHandler" />
      <VTypeButton label="album" :type="type" :typeHandler="typeHandler" />
      <VTypeButton label="artist" :type="type" :typeHandler="typeHandler" />
    </div>

    <div v-if="results.length > 0" class="bg-gray-900 sm:rounded-md p-3">
      <VTrackList v-if="type === 'track'" :results="results" />
      <VAlbumList v-else-if="type === 'album'" :results="results" />
      <VArtistList v-else-if="type === 'artist'" :results="results" />
    </div>

    <p v-else-if="searchQuery && !isLoading" class="text-md text-center mt-10">
      No results found.
    </p>

    <div v-if="isLoading" class="flex items-center justify-center mt-10">
      <VSpinner />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { MagnifyingGlassIcon } from "@heroicons/vue/20/solid";
import { searchForItem } from "@/utils/api";
import { useAuthStore } from "@/stores/auth";
import VSpinner from "@/components/VSpinner.vue";
import VTypeButton from "@/components/search/VTypeButton.vue";
import VTrackList from "@/components/search/VTrackResults.vue";
import VAlbumList from "@/components/search//album/VAlbumResults.vue";
import VArtistList from "@/components/search/artist/VArtistResults.vue";

const authStore = useAuthStore();

const searchQuery = ref("");
const type = ref("track");
const results = ref<any>([]);
const isLoading = ref(false);
const debounceDelay = 500;

const debounce = (func: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const search = async () => {
  isLoading.value = true;

  const data = await searchForItem(
    authStore.getAccessToken,
    searchQuery.value,
    type.value
  );

  switch (type.value) {
    case "track":
      results.value = data.tracks.items;
      break;
    case "album":
      results.value = data.albums.items;
      break;
    case "artist":
      results.value = data.artists.items;
      break;
  }

  isLoading.value = false;
};

const debouncedSearch = debounce(search, debounceDelay);

const typeHandler = (newType: string) => {
  if (newType === type.value) return;
  if (searchQuery.value) {
    results.value = [];
    isLoading.value = true;
  }
  type.value = newType;
};

const searchQueryWatcher = () => {
  if (!searchQuery.value) {
    results.value = [];
    return;
  }

  isLoading.value = true;
  debouncedSearch();
};

watch(searchQuery, searchQueryWatcher);
watch(type, searchQueryWatcher);

if (searchQuery.value) {
  search();
}
</script>
