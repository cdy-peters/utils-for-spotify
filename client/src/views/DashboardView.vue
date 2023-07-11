<template>
  <h2>Dashboard</h2>
  <p>{{ authStore.getAccessToken }}</p>

  <button @click="logout">Logout</button>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import router from "@/router";

const authStore = useAuthStore();

const logout = () => {
  authStore.logout();
  router.push("/");
};
</script>
