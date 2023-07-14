<template>
  <div class="lg:w-3/5 m-auto">
    <div class="relative mb-2 mx-2">
      <div
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
      >
        <MagnifyingGlassIcon class="w-5 h-5 text-gray-300" />
      </div>
      <input
        type="text"
        name="search-item"
        id="search-item"
        class="block w-full rounded-full border-0 py-2 pl-10 pr-20 bg-gray-600 hover:bg-gray-650 text-gray-100 ring-1 ring-inset ring-none placeholder:text-gray-300 sm:text-sm sm:leading-6"
        placeholder="Search tracks"
        v-model="searchQuery"
      />
    </div>

    <div v-if="results.length > 0" class="bg-gray-900 sm:rounded-md p-3">
      <a
        v-for="result in results"
        :key="result.id"
        :href="`/${result.type}/${result.id}`"
        class="flex flex-row items-center rounded-md px-2 py-1 hover:bg-gray-800 cursor-pointer"
      >
        <img
          :src="result.image"
          class="w-10 h-10 mr-3"
          alt="Album cover"
          loading="lazy"
        />
        <div>
          <p class="text-xl">{{ result.name }}</p>
          <p class="text-md text-gray-300">
            {{ result.artists }}
          </p>
        </div>
      </a>
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
import { getSmallestImage, getArtistString } from "@/utils/spotify";
import VSpinner from "@/components/VSpinner.vue";

const authStore = useAuthStore();

const searchQuery = ref("");
const results = ref<
  { id: string; type: string; image: string; name: string; artists: string }[]
>([]);
const isLoading = ref(false);

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
    "track"
  );
  console.log(data);

  isLoading.value = false;

  results.value = data.tracks.items.map((item: any) => ({
    id: item.id,
    type: item.type,
    image: getSmallestImage(item.album.images).url,
    name: item.name,
    artists: getArtistString(item.artists),
  }));
};

const debouncedSearch = debounce(search, 500);

watch(searchQuery, () => {
  if (!searchQuery.value) {
    results.value = [];
    return;
  }

  isLoading.value = true;
  debouncedSearch();
});

if (searchQuery.value) {
  search();
}
</script>
