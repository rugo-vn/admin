<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

import TableData from "../../components/table/TableData.vue";
import TreeData from "../../components/tree/TreeData.vue";

import { useAppStore } from "../../stores/app.js";
import { useSchemaStore } from "../../stores/schema.js";
import { formatLabel } from "../../utils.js";

const route = useRoute();
const appStore = useAppStore();
const schemaStore = useSchemaStore();

const DATA_SELECTION = {
  mem: TableData,
  mongo: TableData,
  fs: TreeData,
};

const model = ref("");
const localSchema = ref({});

const syncValue = async () => {
  if (!route.params.model) return;

  model.value = route.params.model;
  localSchema.value = schemaStore.getSchema(model.value, "");
  appStore.view = formatLabel(model.value);
};

watch(() => route.params.model, syncValue);

syncValue();
</script>

<template>
  <RHeading>{{ appStore.view }}</RHeading>

  <RPanel v-if="localSchema">
    <component
      v-if="DATA_SELECTION[localSchema.driver]"
      :is="DATA_SELECTION[localSchema.driver]"
      :model="model"
    />

    <div v-else class="text-center italic">
      Cannot find data displayer for {{ localSchema.driver }} driver.
    </div>
  </RPanel>
</template>
