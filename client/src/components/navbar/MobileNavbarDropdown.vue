<template>
  <Disclosure as="div" class="-mx-3" v-slot="{ open }">
    <DisclosureButton
      class="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
    >
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
        class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
        >{{ subItem.name }}</DisclosureButton
      >
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
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
