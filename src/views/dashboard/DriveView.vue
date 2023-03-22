<script setup>
import { nextTick, ref, watch } from "vue";
import { useRoute } from "vue-router";
import TreeData from "../../components/tree/TreeData.vue";

import { useAppStore } from "../../stores/app.js";
import { useSchemaStore } from "../../stores/schema.js";
import { formatLabel } from "../../utils.js";

const route = useRoute();
const appStore = useAppStore();
const schemaStore = useSchemaStore();

const driveName = ref("");
const driveConfig = ref({});

const syncValue = async () => {
  if (!route.params.driveName) return;

  driveName.value = null;

  nextTick(() => {
    driveName.value = route.params.driveName;
    driveConfig.value = schemaStore.getDrive(driveName.value);
    appStore.view = formatLabel(driveName.value);
  });
};

watch(() => route.params.driveName, syncValue);

syncValue();
</script>

<template>
  <div v-if="driveName">
    <RHeading>{{ appStore.view }}</RHeading>

    <RPanel>
      <TreeData v-if="driveConfig" :driveName="driveName" />

      <div v-else class="text-center italic">Drive is not found.</div>
    </RPanel>
  </div>
</template>
