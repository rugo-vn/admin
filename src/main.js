import RugoVue from "@rugo-vn/vue";
import { createApp } from "vue";
import { createPinia } from "pinia";
import * as Icons from "@rugo-vn/vue/dist/ionicons";

import App from "./App.vue";
import { router } from "./router";

import "@rugo-vn/vue/dist/index.css";
import "./index.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

for (const name in Icons) {
  app.component(name, Icons[name]);
}

app.use(RugoVue);

app.mount("#app");
