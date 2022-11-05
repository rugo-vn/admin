import RugoVue from "@rugo-vn/vue";
import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import { router } from "./router";

import "@rugo-vn/vue/dist/index.css";
import "./index.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(RugoVue);

app.mount("#app");
