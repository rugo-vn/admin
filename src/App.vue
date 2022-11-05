<script setup>
import ScreenLoader from "./components/ScreenLoader.vue";
import NoticeDisplayer from "./components/NoticeDisplayer.vue";
import { useApiStore } from "./stores/api.js";

const apiStore = useApiStore();

apiStore.init();
</script>

<template>
  <RouterView />
  <ScreenLoader v-if="apiStore.isLoading" />
  <NoticeDisplayer :notices="apiStore.notices" />
</template>
