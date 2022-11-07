<script setup>
import EllipsisVerticalIcon from "@rugo-vn/vue/dist/ionicons/EllipsisVerticalIcon.vue";

defineProps(['actions']);
defineEmits(['do:action']);
</script>

<template>
  <div class="relative">
    <button
      class="cursor-pointer peer"
    >
      <EllipsisVerticalIcon class="text-base" />
    </button>

    <div
      class="hidden peer-focus:block bg-white drop-shadow rounded absolute mx-2 z-10 overflow-hidden right-0 w-fit"
    >
      <button
        class="px-3 py-2 border-b last:border-none capitalize"
        v-for="action in actions"
        :key="action"
        @mousedown="$emit('do:action', action)"
      >
        {{ action }}
      </button>
    </div>
  </div>
</template>