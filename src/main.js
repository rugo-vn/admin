import RugoVue from "@rugo-vn/vue";
import { createApp } from "vue";
import { createPinia } from "pinia";
import * as Icons from "@rugo-vn/vue/dist/ionicons";
import { setupCalendar } from "v-calendar";
import katex from "katex";

import App from "./App.vue";
import { router } from "./router";

import "@rugo-vn/vue/dist/index.css";
import "v-calendar/style.css";
import "katex/dist/katex.min.css";
import "./index.css";

window.katex = katex;

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(setupCalendar, {});

for (const name in Icons) {
  app.component(name, Icons[name]);
}

app.use(RugoVue);

app.mount("#app");
