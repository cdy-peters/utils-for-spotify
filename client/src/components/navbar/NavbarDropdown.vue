<template>
  <Popover class="relative">
    <PopoverButton :class="getNavItemClass(item.dropdown)">
      {{ item.name }}
      <ChevronDownIcon
        class="h-5 w-5 flex-none text-inherit"
        aria-hidden="true"
      />
    </PopoverButton>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <PopoverPanel
        class="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-black shadow-lg ring-1 ring-gray-900/5"
      >
        <div class="p-4">
          <div
            v-for="subItem in item.dropdown"
            :key="subItem.name"
            class="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-900"
          >
            <div
              class="flex h-11 w-11 flex-none items-center justify-center rounded-lg"
              :class="
                subItem.name.toLowerCase() == router.currentRoute.value.name
                  ? 'bg-green text-black'
                  : 'bg-gray-700 text-gray-100 group-hover:bg-green-hover'
              "
            >
              <component
                :is="subItem.icon"
                class="h-6 w-6 group-hover:text-black text-inherit"
                aria-hidden="true"
              />
            </div>
            <div class="flex-auto">
              <a :href="subItem.href" class="block font-semibold">
                {{ subItem.name }}
                <span class="absolute inset-0" />
              </a>
              <p class="mt-1 text-gray-300">
                {{ subItem.description }}
              </p>
            </div>
          </div>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script setup lang="ts">
import router from "@/router";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";

const getNavItemClass = (dropdown: any) => {
  const dropdownNames = dropdown.map((item: any) => item.name.toLowerCase());

  return [
    "flex",
    "items-center",
    "gap-x-1",
    "rounded-md",
    "px-3",
    "py-2",
    "text-sm",
    "font-semibold",
    "leading-6",
    dropdownNames.includes(router.currentRoute.value.name)
      ? "bg-green text-black"
      : "text-gray-300 hover:bg-green-hover hover:text-white",
  ];
};
</script>

<script lang="ts">
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
