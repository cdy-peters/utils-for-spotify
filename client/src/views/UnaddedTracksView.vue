<template>
  <div
    class="lg:w-3/5 bg-gray-900 mb-4 p-4 sm:rounded-lg flex flex-row justify-between gap-x-4 m-auto"
  >
    <div class="w-5/12">
      <p class="text-xl font-semibold">Searching playlists for:</p>
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

    <div>
      <p class="text-lg">
        {{ currPlaylist }} of {{ playlists.length }} playlists searched
      </p>
      <p class="text-lg">
        {{ savedTracks.length }} of {{ totalSavedTracks }} saved tracks searched
      </p>
      <p class="text-lg">
        {{ playlistTracks.size }} of {{ totalPlaylistTracks }} unique playlist
        tracks retrieved
      </p>
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
      class="divide-y divide-gray-700/20 py-2 px-2 max-h-[calc(100vh-401px)] overflow-y-auto"
    >
      <div v-for="track in unaddedTracks" :key="track.id">
        <p class="text-lg">{{ track.name }}</p>
        <p class="text-md text-gray-300">{{ track.artists }}</p>
      </div>
    </div>
    <div class="py-4">
      <button
        :disabled="state !== State.DONE"
        class="bg-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:bg-green"
        @click="addTracks"
      >
        Add tracks to a new playlist
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
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

const State = {
  SEARCHING: "SEARCHING",
  DONE: "DONE",
};

const authStore = useAuthStore();
const spotifyStore = useSpotifyStore();

const accessToken = authStore.getAccessToken;
const user = spotifyStore.user;

const state = ref(State.SEARCHING);

const totalSavedTracks = ref(0);
const totalPlaylistTracks = ref(0);

const playlists = ref<string[]>([]);
const savedTracks = ref<{ id: string; name: string; artists: string }[]>([]);
const playlistTracks = ref(new Set());
const unaddedTracks = ref<{ id: string; name: string; artists: string }[]>([]);

let next: string | null = null;
let currPlaylist = 0;

onMounted(async () => {
  await fetchPlaylists();
  await fetchSavedTracks();
  state.value = State.DONE;
});

const fetchPlaylists = async () => {
  let i = 0;
  let data;

  do {
    data = await getCurrentUserPlaylists(accessToken, i);

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
    data = await getCurrentUserSavedTracks(accessToken, i);

    if (i === 0) totalSavedTracks.value = data.total;

    for (const item of data.items) {
      const track = {
        id: item.track.id,
        name: item.track.name,
        artists: getArtistString(item.track.artists),
      };
      savedTracks.value.push(track);

      if (playlistTracks.value.has(track.id)) {
        continue;
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
      accessToken,
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
    const data = await getNextPlaylistItems(accessToken, next);
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
  const trackIds = unaddedTracks.value.map(
    (track) => `spotify:track:${track.id}`
  );
  const playlist = await createPlaylist(accessToken, user.id, "Unadded Tracks");

  await addItemsToPlaylist(accessToken, playlist.id, trackIds);
};
</script>
