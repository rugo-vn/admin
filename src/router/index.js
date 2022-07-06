import { createRouter, createWebHashHistory } from "vue-router";
import { MAuthLayout } from "@rugo-vn/vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", redirect: "/signin" },
    { path: "/signout", redirect: "/signin" },
    {
      path: "/signin",
      component: MAuthLayout,
      children: [
        {
          path: "",
          component: () => import("../views/SignInView.vue"),
        },
      ],
    },
    {
      name: "dashboard",
      path: "/dashboard",
      component: () => import("../layouts/DashboardLayout.vue"),
      children: [
        {
          path: "",
          name: "Home",
          component: () => import("../views/dashboard/HomeView.vue"),
        },

        {
          name: "MemTableCollection",
          path: "mem/:collectionName",
          component: () =>
            import("../views/dashboard/collection/TableView.vue"),
        },

        {
          name: "MongoTableCollection",
          path: "mongo/:collectionName",
          component: () =>
            import("../views/dashboard/collection/TableView.vue"),
        },

        {
          name: "FsCollection",
          path: "fs/:collectionName",
          component: () => import("../views/dashboard/collection/FsView.vue"),
        },
      ],
    },
  ],
});

export default router;
