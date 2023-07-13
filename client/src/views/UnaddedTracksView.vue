<template>
  <div
    class="lg:w-3/5 bg-gray-900 mb-4 p-4 sm:rounded-lg justify-between m-auto"
  >
    <div>
      <p class="text-xl font-semibold">{{ stateMessage }}</p>
      <div v-if="state === State.SEARCHING">
        <p class="text-lg truncate">
          {{
            savedTracks[savedTracks.length - 1]
              ? savedTracks[savedTracks.length - 1].name
              : ""
          }}
        </p>
        <p class="text-md text-gray-300 truncate">
          {{
            savedTracks[savedTracks.length - 1]
              ? savedTracks[savedTracks.length - 1].artists
              : ""
          }}
        </p>
      </div>
      <VProgressBar :value="percentCompletion" class="mt-4" />
    </div>
  </div>

  <div
    class="lg:w-3/5 bg-gray-900 px-4 sm:rounded-lg divide-y divide-gray-700 m-auto"
  >
    <div class="flex flex-row items-center justify-between py-4">
      <p class="text-xl font-semibold">Unadded Tracks</p>
      <p class="text-lg">{{ unaddedTracks.length }} tracks</p>
    </div>
    <div
      class="divide-y divide-gray-700/20 py-2 px-2 overflow-y-auto"
      :class="
        state === State.SEARCHING
          ? 'h-[calc(100vh-437px)]'
          : 'h-[calc(100vh-385px)]'
      "
    >
      <template v-if="unaddedTracks.length">
        <div v-for="track in unaddedTracks" :key="track.id">
          <p class="text-lg">{{ track.name }}</p>
          <p class="text-md text-gray-300">{{ track.artists }}</p>
        </div>
      </template>
      <div v-else-if="state === State.DONE">
        <p class="text-lg text-center">
          All saved tracks were found in playlists
        </p>
      </div>
      <div v-else class="flex items-center justify-center h-full">
        <VSpinner />
      </div>
    </div>
    <div class="py-4 max-[425px]:text-center">
      <button
        :disabled="
          state !== State.DONE || unaddedTracks.length === 0 || tracksAdded || addingTracks
        "
        class="bg-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:bg-green flex items-center"
        @click="addTracks"
      >
        <template v-if="!addingTracks">
          {{ !tracksAdded ? "Add tracks to a new playlist" : "Tracks added" }}
        </template>
        <template v-else>
          Adding tracks <VSpinner class="ml-3 [&>svg]:fill-white" :button="true" />
        </template>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import {
  getCurrentUserPlaylists,
  getCurrentUserSavedTracks,
  getPlaylistItems,
  getNextPlaylistItems,
  createPlaylist,
  addItemsToPlaylist,
} from "@/utils/api";
import { useAuthStore } from "@/stores/auth";
import { useSpotifyStore } from "@/stores/spotify";
import { getArtistString } from "@/utils/spotify";

import VProgressBar from "@/components/VProgressBar.vue";
import VSpinner from "@/components/VSpinner.vue";

enum State {
  GETTING_PLAYLISTS = "GETTING_PLAYLISTS",
  SEARCHING = "SEARCHING",
  DONE = "DONE",
}

const authStore = useAuthStore();
const spotifyStore = useSpotifyStore();

const user = spotifyStore.user;

const state = ref(State.GETTING_PLAYLISTS);
const stateMessage = ref("Getting your playlists");

const percentCompletion = ref(0);

const totalSavedTracks = ref(0);
const totalPlaylistTracks = ref(0);

const playlists = ref<string[]>([]);
const savedTracks = ref<{ id: string; name: string; artists: string }[]>([]);
const playlistTracks = ref(new Set());
const unaddedTracks = ref<{ id: string; name: string; artists: string }[]>([]);

const tracksAdded = ref(false);
const addingTracks = ref(false);

let next: string | null = null;
let currPlaylist = 0;

onMounted(async () => {
  await fetchPlaylists();
  state.value = State.SEARCHING;

  await fetchSavedTracks();
  state.value = State.DONE;
});

watch(state, (newState) => {
  switch (newState) {
    case State.GETTING_PLAYLISTS:
      stateMessage.value = "Getting your playlists";
      break;
    case State.SEARCHING:
      stateMessage.value = "Searching for saved tracks in playlists";
      break;
    case State.DONE:
      stateMessage.value = "Finished searching for saved tracks";
      break;
  }
});

watch([savedTracks, playlistTracks, totalPlaylistTracks], () => {
  percentCompletion.value = Math.round(
    ((savedTracks.value.length + playlistTracks.value.size) /
      (totalSavedTracks.value + totalPlaylistTracks.value)) *
      100
  );
});

const fetchPlaylists = async () => {
  let i = 0;
  let data;

  do {
    data = await getCurrentUserPlaylists(authStore.getAccessToken, i);

    const filteredPlaylists = data.items
      .filter((item: any) => {
        if (item.owner.id !== user.id) return false;
        if (item.collaborative) return false;
        if (item.tracks.total === 0) return false;
        return true;
      })
      .map((item: any) => {
        totalPlaylistTracks.value += item.tracks.total;
        return item.id;
      });

    playlists.value.push(...filteredPlaylists);

    i++;
  } while (data.next);
};

const fetchSavedTracks = async () => {
  let i = 0;
  let data;

  do {
    data = await getCurrentUserSavedTracks(authStore.getAccessToken, i);

    if (i === 0) totalSavedTracks.value = data.total;

    for (const item of data.items) {
      const track = {
        id: item.track.id,
        name: item.track.name,
        artists: getArtistString(item.track.artists),
      };
      savedTracks.value = [...savedTracks.value, track];

      if (playlistTracks.value.has(track.id)) {
        playlistTracks.value.delete(track.id);
        totalPlaylistTracks.value--;
      } else if (currPlaylist < playlists.value.length) {
        await fetchPlaylistTracks(track.id);
      } else {
        unaddedTracks.value.push(track);
      }
    }

    i++;
  } while (data.next);
};

const fetchPlaylistTracks = async (trackId: string) => {
  if (!next) {
    const data = await getPlaylistItems(
      authStore.getAccessToken,
      playlists.value[currPlaylist],
      0
    );
    currPlaylist++;

    const trackIds = data.items.map((item: any) => item.track.id);
    const temp = playlistTracks.value.size;
    playlistTracks.value = new Set([...playlistTracks.value, ...trackIds]);
    if (temp + trackIds.length !== playlistTracks.value.size) {
      totalPlaylistTracks.value -=
        temp + trackIds.length - playlistTracks.value.size;
    }

    if (checkPlaylistTracks(trackId, trackIds)) {
      playlistTracks.value.delete(trackId);
      next = data.next || null;
      return;
    }

    next = data.next;
  }

  while (next) {
    const data = await getNextPlaylistItems(authStore.getAccessToken, next);
    const trackIds = data.items.map((item: any) => item.track.id);
    const temp = playlistTracks.value.size;
    playlistTracks.value = new Set([...playlistTracks.value, ...trackIds]);
    if (temp + trackIds.length !== playlistTracks.value.size) {
      totalPlaylistTracks.value -=
        temp + trackIds.length - playlistTracks.value.size;
    }

    if (checkPlaylistTracks(trackId, trackIds)) {
      playlistTracks.value.delete(trackId);
      next = data.next || null;
      return;
    }

    next = data.next;
  }

  next = null;

  if (currPlaylist < playlists.value.length) {
    await fetchPlaylistTracks(trackId);
  }
};

const checkPlaylistTracks = (trackId: string, tracks: string[]) => {
  return tracks.includes(trackId);
};

const addTracks = async () => {
  addingTracks.value = true;

  const trackIds = unaddedTracks.value.map(
    (track) => `spotify:track:${track.id}`
  );
  const playlist = await createPlaylist(
    authStore.getAccessToken,
    user.id,
    "Unadded Tracks"
  );

  await addItemsToPlaylist(authStore.getAccessToken, playlist.id, trackIds);

  addingTracks.value = false;
  tracksAdded.value = true;
};
</script>
