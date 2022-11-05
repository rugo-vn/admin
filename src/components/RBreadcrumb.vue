<script setup>
import HomeIcon from "@rugo-vn/vue/dist/ionicons/HomeIcon.vue";
import ChevronForwardIcon from "@rugo-vn/vue/dist/ionicons/ChevronForwardIcon.vue";

defineProps(["items"]);
defineEmits(["navigate"]);
</script>

<template>
  <div class="inline-flex items-center">
    <component
      v-for="(item, index) in items"
      :is="item.href ? 'RouterLink' : 'a'"
      class="text-sm inline-flex items-center mactive:text-stone-400 dark:mactive:text-stone-500 cursor-pointer"
      :to="item.href"
      :active="item.active || null"
      :key="item.text"
      @click="$emit('navigate', item)"
    >
      <HomeIcon v-if="index === 0" class="mr-2" />

      <ChevronForwardIcon v-else class="mr-2" />

      <span v-if="item.text" class="mr-2">{{ item.text }}</span>
    </component>
  </div>
</template>
