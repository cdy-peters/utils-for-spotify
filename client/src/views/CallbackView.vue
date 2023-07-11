<template>
  <h2>Callback</h2>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import router from "@/router";

const authStore = useAuthStore();

onMounted(() => {
  authenticationHandler();
});

const authenticationHandler = async () => {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  if (code) {
    await authStore.setAccessToken(code);
  }
  router.push("/dashboard");
};
</script>
