<script setup>
import EllipsisVerticalIcon from "@rugo-vn/vue/dist/ionicons/EllipsisVerticalIcon.vue";

defineProps(["actions"]);
defineEmits(["do:action"]);
</script>

<template>
  <RDropdown boxAlign="right">
    <template #open="{ click }">
      <div class="relative">
        <button class="cursor-pointer" @click="click">
          <EllipsisVerticalIcon class="text-base" />
        </button>
      </div>
    </template>
    <template v-slot="{ click }">
      <button
        class="px-3 py-2 border-b last:border-none capitalize w-full text-left"
        v-for="action in actions"
        :key="action"
        @mousedown="
          click();
          $emit('do:action', action);
        "
      >
        {{ action }}
      </button>
    </template>
  </RDropdown>
</template>
