<script setup>
import ScreenLoader from "./components/ScreenLoader.vue";
import NoticeDisplayer from "./components/NoticeDisplayer.vue";
import { useApiStore } from "./stores/api.js";

const apiStore = useApiStore();

apiStore.http.init();
</script>

<template>
  <RouterView />
  <ScreenLoader v-if="apiStore.http.isLoading" />
  <NoticeDisplayer :notices="apiStore.http.notices" />
</template>
