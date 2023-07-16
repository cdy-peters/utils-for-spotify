<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-none px-3 py-2 text-sm font-semibold text-gray-200 hover:text-gray-100"
      >
        {{ shownReleases }}
        <ChevronDownIcon
          class="-mr-1 h-5 w-5 text-inherit"
          aria-hidden="true"
        />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute right-0 z-10 w-40 origin-top-right rounded-sm p-1 bg-gray-700 focus:outline-none"
      >
        <div v-for="option in options" :key="option.name">
          <MenuItem>
            <a
              :class="[
                option.name == shownReleases ? 'text-green' : '',
                'block px-4 py-2 text-sm text-gray-100 hover:bg-gray-500 rounded-sm cursor-default',
              ]"
              @click="dropdownHandler(option.name)"
            >
              {{ option.name }}
            </a>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";

const options = [
  { name: "Top Tracks" },
  { name: "Singles and EPs" },
  { name: "Albums" },
];

defineProps({
  shownReleases: {
    type: String,
    required: true,
  },
  dropdownHandler: {
    type: Function,
    required: true,
  },
});
</script>
