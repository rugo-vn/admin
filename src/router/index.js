import { createRouter, createWebHashHistory } from "vue-router";

export const routes = [
  { path: "/", redirect: "/auth/signin" },
  {
    path: "/auth",
    component: () => import("../layouts/AuthLayout.vue"),
    children: [
      {
        name: "SignInView",
        path: "signin",
        component: () => import("../views/auth/SignInView.vue"),
      },
    ],
  },
  {
    path: "/dashboard",
    component: () => import("../layouts/DashboardLayout.vue"),
    children: [
      { path: "", redirect: "/dashboard/overview" },
      {
        name: "OverviewView",
        path: "overview",
        component: () => import("../views/dashboard/OverviewView.vue"),
      },
      {
        path: "models/:model",
        component: () => import("../views/dashboard/ModelView.vue"),
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});
