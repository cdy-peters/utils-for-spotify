<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useSpotifyStore } from "@/stores/spotify";
import router from "@/router";

const authStore = useAuthStore();
const spotifyStore = useSpotifyStore();

onMounted(() => {
  authenticationHandler();
});

const authenticationHandler = async () => {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  if (code) {
    await authStore.setAccessToken(code);
    spotifyStore.setUser(authStore.accessToken);
  }
  router.push("/dashboard");
};
</script>
