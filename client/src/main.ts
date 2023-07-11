import "./assets/main.css";

import { createApp } from "vue";
import piniaPluginPersistedState from "pinia-plugin-persistedstate"
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

const app = createApp(App);

app.use(router);

app.use(pinia);
app.mount("#app");
