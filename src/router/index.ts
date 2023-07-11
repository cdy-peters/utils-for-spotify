import { createRouter, createWebHistory } from "vue-router";

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
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
    },
    {
      path: "/callback",
      name: "callback",
      component: CallbackView,
    },
  ],
});

export default router;
