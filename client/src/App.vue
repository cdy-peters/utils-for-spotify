<script setup lang="ts">
import { RouterView } from "vue-router";

import TheNavbar from "@/components/navbar/TheNavbar.vue";
import TheFooter from "@/components/TheFooter.vue";
</script>

<template>
  <div class="flex flex-col h-screen justify-between">
    <div>
      <TheNavbar />

      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <RouterView />
      </div>
    </div>

    <TheFooter class="max-lg:hidden" />
  </div>
</template>
