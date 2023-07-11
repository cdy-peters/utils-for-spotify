<template>
  <h2>Landing</h2>

  <button @click="login">Login</button>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const login = () => {
  authStore.login();
};
</script>
