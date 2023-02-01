<script setup>
import ScreenLoader from "./components/ScreenLoader.vue";
import NoticeDisplayer from "./components/NoticeDisplayer.vue";
import { useApiStore } from "./stores/api.js";
import { ref } from "vue";
import RLoader from "./components/RLoader.vue";

const apiStore = useApiStore();
const isFirstLoad = ref(true);

apiStore.http.init();

const startLoad = async () => {
  await apiStore.load();
  isFirstLoad.value = false;
};

startLoad();
</script>

<template>
  <RouterView v-if="!isFirstLoad" />
  <div
    v-else
    class="w-full h-full fixed flex justify-center items-center pointer-events-none z-40"
  >
    <RLoader class="w-[4rem] h-[4rem]" />
  </div>
  <ScreenLoader v-if="apiStore.http.isLoading" />
  <NoticeDisplayer :notices="apiStore.http.notices" />
</template>
