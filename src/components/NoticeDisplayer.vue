<script setup>
import { DEFAULT_ID_FIELD } from "../constants.js";
import { formatLabel } from "../utils.js";

defineProps(["notices"]);
</script>

<template>
  <div
    class="fixed bottom-6 right-6 z-40 mactive:block text-white w-full max-w-xs pointer-events-none"
  >
    <TransitionGroup name="notice" tag="div">
      <div
        :class="`r-alert ${noti.type} px-4 py-2 mt-4 w-fit max-w-full ml-auto rounded`"
        v-for="noti in notices"
        :key="noti[DEFAULT_ID_FIELD]"
      >
        <div class="font-semibold text-xs mb-1">
          {{ formatLabel(noti.title) }}
        </div>
        <div>
          {{ noti.detail }}
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style>
.notice-enter-active,
.notice-leave-active {
  transition: all 0.5s ease;
}
.notice-enter-from,
.notice-leave-to {
  opacity: 0;
  -webkit-transform: translate3d(100%, 0, 0);
  transform: translate3d(100%, 0, 0);
}
</style>
