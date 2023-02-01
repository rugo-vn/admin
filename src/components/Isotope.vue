<script setup>
import Isotope from "isotope-layout";
import { onMounted, onUnmounted, ref } from "vue";

const isotopeElm = ref(null);
let isotope;

onMounted(() => {
  isotope = new Isotope(isotopeElm.value, {
    layoutMode: "masonry",
  });
});

onUnmounted(() => {
  isotope = null;
});
</script>

<template>
  <div ref="isotopeElm">
    <slot></slot>
  </div>
</template>
