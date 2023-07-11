<template>
  <header class="bg-black">
    <nav
      class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      aria-label="Global"
    >
      <div class="flex lg:flex-1">
        <NavbarLogo />
      </div>
      <div class="flex lg:hidden">
        <button
          type="button"
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-100"
          @click="mobileMenuOpen = true"
        >
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <PopoverGroup
        class="hidden lg:flex lg:gap-x-12"
        v-if="authStore.isLoggedIn()"
      >
        <template v-for="item in navigation" :key="item.name">
          <a
            v-if="!item.dropdown"
            :href="item.href"
            class="text-sm font-semibold leading-6 text-gray-100"
            >{{ item.name }}</a
          >

          <NavbarDropdown v-else :item="item" />
        </template>
      </PopoverGroup>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end">
        <button
          v-if="authStore.isLoggedIn()"
          @click="logout"
          class="text-sm font-semibold leading-6 text-gray-100"
        >
          Log out
        </button>
        <button
          v-else
          @click="login"
          class="text-sm font-semibold leading-6 text-gray-100"
        >
          Log in <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </nav>

    <Dialog
      as="div"
      class="lg:hidden"
      @close="mobileMenuOpen = false"
      :open="mobileMenuOpen"
    >
      <div class="fixed inset-0 z-10" />
      <DialogPanel
        class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
      >
        <div class="flex items-center justify-between">
          <NavbarLogo />
          <button
            type="button"
            class="-m-2.5 rounded-md p-2.5 text-gray-100"
            @click="mobileMenuOpen = false"
          >
            <span class="sr-only">Close menu</span>
            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6" v-if="authStore.isLoggedIn()">
              <template v-for="item in navigation" :key="item.name">
                <a
                  v-if="!item.dropdown"
                  :href="item.href"
                  class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-100 hover:bg-green-hover hover:text-black"
                  >{{ item.name }}</a
                >

                <MobileNavbarDropdown v-else :item="item" />
              </template>
            </div>
            <div class="py-6">
              <button
                v-if="authStore.isLoggedIn()"
                @click="logout"
                class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-100 hover:bg-green-hover hover:text-black"
              >
                Log out
              </button>
              <button
                v-else
                @click="login"
                class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-100 hover:bg-green-hover hover:text-black"
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Dialog, DialogPanel, PopoverGroup } from "@headlessui/vue";
import { Bars3Icon, HeartIcon, XMarkIcon } from "@heroicons/vue/24/outline";

import { useAuthStore } from "@/stores/auth";
import router from "@/router";

import NavbarDropdown from "./NavbarDropdown.vue";
import MobileNavbarDropdown from "./MobileNavbarDropdown.vue";
import NavbarLogo from "./NavbarLogo.vue";

const products = [
  {
    name: "Unadded Tracks",
    description:
      "Get your liked tracks that haven't been added to a playlist yet.",
    href: "#",
    icon: HeartIcon,
  },
];

const navigation = [
  { name: "Dashboard", href: "/dashboard", active: true },
  { name: "Tools", active: false, dropdown: products },
];

const mobileMenuOpen = ref(false);

const authStore = useAuthStore();
const login = () => {
  authStore.login();
};
const logout = () => {
  authStore.logout();
  router.push("/");
};
</script>
