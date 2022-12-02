<script setup>
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";

import MenuIcon from "@rugo-vn/vue/dist/ionicons/MenuIcon.vue";
import SettingsIcon from "@rugo-vn/vue/dist/ionicons/SettingsIcon.vue";

import { VIEW } from "../constants.js";
import { useAppStore } from "../stores/app.js";
import { useApiStore } from "../stores/api.js";
import { useSchemaStore } from "../stores/schema.js";
import { formatLabel } from "../utils.js";
import RSideNav from "../components/RSideNav.vue";

const router = useRouter();
const appStore = useAppStore();
const apiStore = useApiStore();
const schemaStore = useSchemaStore();

const navControl = ref(false);
const navigations = reactive([]);
const isLoad = ref(false);

const handleAction = (type) => {
  if (type === "left") {
    navControl.value = !navControl.value;
  }
};

const loadData = async () => {
  isLoad.value = false;

  const data = await apiStore.getInfo();

  if (!data) return router.push(VIEW.SignInView);

  const { schemas } = data;
  schemaStore.setSchemas(schemas);

  navigations.push(
    ...[
      { type: "label", name: "Dashboard" },
      { name: "Overview", href: VIEW.OverviewView, icon: "home" },
      { type: "label", name: "Models" },
      ...schemas.map((schema) => ({
        name: formatLabel(schema.name),
        href: `/dashboard/models/${schema.name}`,
        icon: schema.icon,
      })),
      { type: "label", name: "Account" },
      { name: "Change Password", icon: "lock-closed" },
      { name: "Sign out", href: VIEW.SignInView, icon: "log-out" },
    ]
  );

  changeView();
  isLoad.value = true;
};

const changeView = () => {
  for (let item of navigations) {
    if (item.name === appStore.view) item.active = true;
    else item.active = false;
  }
};

watch(() => appStore.view, changeView);

loadData();
</script>

<template>
  <div class="flex">
    <RSideNav :items="navigations" v-model="navControl" />

    <div class="flex-1">
      <RTopBar
        @action="handleAction"
        :leftIcon="MenuIcon"
        :rightIcon="SettingsIcon"
      />
      <div class="p-4" v-if="isLoad">
        <RouterView />
      </div>
    </div>
  </div>
</template>
