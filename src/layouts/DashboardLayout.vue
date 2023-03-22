<script setup>
import { reactive, ref, watch, markRaw } from "vue";

import MenuIcon from "@rugo-vn/vue/dist/ionicons/MenuIcon.vue";
import SettingsIcon from "@rugo-vn/vue/dist/ionicons/SettingsIcon.vue";

import IconLockup from "../components/IconLockup.vue";
import { VIEW } from "../constants.js";
import { useAppStore } from "../stores/app.js";
import { useSchemaStore } from "../stores/schema.js";
import { formatLabel } from "../utils.js";

const appStore = useAppStore();
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

  const { schemas, drives } = schemaStore;

  const tableItems = Object.entries(schemas)
    .filter(([_, schema]) => !schema.hidden)
    .map(([tableName, schema]) => ({
      name: formatLabel(tableName),
      href: `/dashboard/tables/${tableName}`,
      icon: schema.icon || "server",
    }));

  const driveItems = Object.entries(drives)
    .filter(([_, config]) => !config.hidden)
    .map(([driveName, config]) => ({
      name: formatLabel(driveName),
      href: `/dashboard/drives/${driveName}`,
      icon: config.icon || "file-tray",
    }));

  navigations.push(
    ...[
      { type: "label", name: "Dashboard" },
      { name: "Overview", href: VIEW.OverviewView, icon: "home" },
      { name: "API Explorer", href: VIEW.DocumentView, icon: "search" },
      ...(tableItems.length ? [{ type: "label", name: "Tables" }] : []),
      ...tableItems,
      ...(driveItems.length ? [{ type: "label", name: "Drives" }] : []),
      ...driveItems,
      { type: "label", name: "Account" },
      { name: "Change Password", icon: "lock-closed" },
      { name: "Sign out", href: VIEW.SignOutView, icon: "log-out" },
    ]
  );

  for (const item of navigations) {
    item.icon = [markRaw(IconLockup), item.icon];
  }

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

      <div class="p-4 h-[calc(100vh-4rem)] overflow-auto" v-if="isLoad">
        <RouterView />
      </div>
    </div>
  </div>
</template>
