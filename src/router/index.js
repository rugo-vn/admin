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
        path: "tables/:tableName",
        component: () => import("../views/dashboard/TableView.vue"),
      },
      {
        path: "drives/:driveName",
        component: () => import("../views/dashboard/DriveView.vue"),
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});
