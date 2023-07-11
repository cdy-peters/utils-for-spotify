<template>
  <Disclosure as="div" class="-mx-3" v-slot="{ open }">
    <DisclosureButton :class="getMobileNavItemClass(item.dropdown)">
      {{ item.name }}
      <ChevronDownIcon
        :class="[open ? 'rotate-180' : '', 'h-5 w-5 flex-none']"
        aria-hidden="true"
      />
    </DisclosureButton>
    <DisclosurePanel class="mt-2 space-y-2">
      <DisclosureButton
        v-for="subItem in item.dropdown"
        :key="subItem.name"
        as="a"
        :href="subItem.href"
        class="block rounded-lg py-2 ml-3 pl-3 pr-3 text-sm font-semibold leading-7"
        :class="
          subItem.name.toLowerCase() == router.currentRoute.value.name
            ? 'bg-green text-black'
            : 'text-gray-100 hover:bg-green-hover hover:text-white'
        "
        >{{ subItem.name }}</DisclosureButton
      >
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup lang="ts">
import router from "@/router";

import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";

const getMobileNavItemClass = (dropdown: any) => {
  const dropdownNames = dropdown.map((item: any) => item.name.toLowerCase());

  return [
    "flex",
    "w-full",
    "items-center",
    "justify-between",
    "rounded-lg",
    "py-2",
    "pl-3",
    "pr-3.5",
    "text-base",
    "font-semibold",
    "leading-7",
    dropdownNames.includes(router.currentRoute.value.name)
      ? "bg-green text-black"
      : "text-gray-100 hover:bg-green-hover hover:text-white",
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
