<script setup>
import Isotope from '../../components/Isotope.vue';
import LinkIcon from "@rugo-vn/vue/dist/ionicons/LinkIcon.vue";
import { useAppStore } from "../../stores/app.js";
import { useSchemaStore } from "../../stores/schema";

const appStore = useAppStore();
const schemaStore = useSchemaStore();

appStore.view = "Overview";
</script>

<template>
  <RHeading>{{ appStore.view }}</RHeading>

  <Isotope
    class="m-[-0.5rem]"
  >
    <div
      v-for="item in schemaStore.overviews"
      class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:x-1/5 p-2"
    >
      <a
        v-if="item.type === 'external'"
        :href="item.link"
        target="_blank"
        class="block bg-primary-500 text-white rounded-lg p-4 inline-flex items-center w-full justify-center text-base"
      >
        <LinkIcon class="text-2xl rotate-[-45deg]"/>
        <span class="ml-2">
          {{ item.title }}
        </span>
      </a>
    </div>
  </Isotope>
</template>
