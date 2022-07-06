import { createApp } from "vue";
import { createPinia } from "pinia";
import { dragscrollNext } from "vue-dragscroll";

import logoOnly from "./assets/images/logo-only.svg";
import textOnly from "./assets/images/text-only.svg";

import App from "./App.vue";
import router from "./router";

import {
  MNotificationPlugin,
  MDialogPlugin,
  createAdminPlugin,
} from "@rugo-vn/vue";
import ApiPlugin from "./plugins/api";

import "./index.css";
import "@rugo-vn/vue/dist/style.css";

// rugo
const admin = createAdminPlugin({
  logo: {
    icon: logoOnly,
    text: textOnly,
  },
});

// mocks
// eslint-disable-next-line
if (process.env.NODE_ENV === 'development') {
  (async () => {
    const { worker } = await import("./mocks/browser");
    worker.start();
  })();
}

// app
const app = createApp(App);

app.use(createPinia());
app.use(admin);
app.use(router);

app.use(ApiPlugin);
app.use(MNotificationPlugin);
app.use(MDialogPlugin);

app.directive("dragscroll", dragscrollNext);

app.mount("#app");
