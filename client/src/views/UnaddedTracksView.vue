<template>
  <h1 class="mb-3 text-3xl font-bold">Unadded tracks</h1>
  <br />
  <p>Playlists retrieved: {{ playlists.length }}</p>
  <br />
  <p>Saved tracks retrieved: {{ savedTracks.length }}</p>
  <br />
  <p>Playlist tracks retrieved: {{ playlistTracks.size }}</p>
  <br />
  <p>Unadded tracks: {{ unaddedTracks.length }}</p>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  getCurrentUserPlaylists,
  getCurrentUserSavedTracks,
  getPlaylistItems,
  getNextPlaylistItems,
} from "@/utils/api";
import { useAuthStore } from "@/stores/auth";
import { useSpotifyStore } from "@/stores/spotify";

const authStore = useAuthStore();
const spotifyStore = useSpotifyStore();

const accessToken = authStore.getAccessToken;
const user = spotifyStore.user;

const playlists = ref<string[]>([]);
const savedTracks = ref<string[]>([]);
const playlistTracks = ref(new Set());
const unaddedTracks = ref<string[]>([]);

onMounted(async () => {
  await fetchPlaylists();
  fetchSavedTracks();
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
      .map((item: any) => item.id);

    playlists.value.push(...filteredPlaylists);

    i++;
  } while (data.next);
};

let next: string | null = null;
let currPlaylist = 0;

const fetchSavedTracks = async () => {
  let i = 0;
  let data;

  do {
    data = await getCurrentUserSavedTracks(accessToken, i);

    for (const item of data.items) {
      const trackId = item.track.id;
      savedTracks.value.push(trackId);

      if (playlistTracks.value.has(trackId)) {
        // playlistTracks.value.delete(trackId);
      } else if (currPlaylist < playlists.value.length) {
        await fetchPlaylistTracks(trackId);
      } else {
        unaddedTracks.value.push(trackId);
      }
    }

    i++;
  } while (data.next);
};

const fetchPlaylistTracks = async (trackId: string) => {
  if (!next) {
    const data = await getPlaylistItems(accessToken, playlists.value[currPlaylist], 0);
    currPlaylist++;

    const trackIds = data.items.map((item: any) => item.track.id);
    playlistTracks.value = new Set([...playlistTracks.value, ...trackIds]);

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
    playlistTracks.value = new Set([...playlistTracks.value, ...trackIds]);

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

</script>
