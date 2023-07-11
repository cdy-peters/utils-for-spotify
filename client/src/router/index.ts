import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

import LandingView from "@/views/LandingView.vue";
import DashboardView from "@/views/DashboardView.vue";
import CallbackView from "@/views/CallbackView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "landing",
      component: LandingView,
      meta: { requiresAuth: false },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: "/callback",
      name: "callback",
      component: CallbackView,
      meta: { requiresAuth: false },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.accessToken) {
    next("/");
  } else {
    next();
  }
});

export default router;