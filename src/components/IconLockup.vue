<script setup>
import { computed, defineAsyncComponent } from "vue";
import { icons } from "@rugo-vn/vue/dist/icon-names";

const props = defineProps(["name"]);

const view = computed(() => {
  let originName = props.name;

  if (icons.indexOf(originName) === -1) originName = "document";

  const name = (originName || "")
    .replace(/[^a-z0-9]+/gi, " ")
    .replace(/(\b[a-z0-9](?!\s))/gi, function (x) {
      return x.toUpperCase();
    })
    .trim()
    .replace(/\s/g, "");

  return defineAsyncComponent(() =>
    import(`../../node_modules/@rugo-vn/vue/dist/ionicons/${name}Icon.vue`)
  );
});
</script>

<template>
  <component :is="view"></component>
</template>
