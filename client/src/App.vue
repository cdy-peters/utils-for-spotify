<script setup lang="ts">
import { RouterView } from "vue-router";

import TheNavbar from "@/components/navbar/TheNavbar.vue";
</script>

<template>
  <div class="min-h-full">
    <TheNavbar />

    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <RouterView />
    </div>
  </div>
</template>
