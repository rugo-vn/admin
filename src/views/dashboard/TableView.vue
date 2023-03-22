<script setup>
import { nextTick, ref, watch } from "vue";
import { useRoute } from "vue-router";

import TableData from "../../components/table/TableData.vue";

import { useAppStore } from "../../stores/app.js";
import { useSchemaStore } from "../../stores/schema.js";
import { formatLabel } from "../../utils.js";

const route = useRoute();
const appStore = useAppStore();
const schemaStore = useSchemaStore();

const tableName = ref("");
const localSchema = ref({});

const syncValue = async () => {
  if (!route.params.tableName) return;

  tableName.value = null;

  nextTick(() => {
    tableName.value = route.params.tableName;
    localSchema.value = schemaStore.getSchema(tableName.value, "");
    appStore.view = formatLabel(tableName.value);
  });
};

watch(() => route.params.tableName, syncValue);

syncValue();
</script>

<template>
  <div v-if="tableName">
    <RHeading>{{ appStore.view }}</RHeading>

    <RPanel>
      <TableData v-if="localSchema" :tableName="tableName" />

      <div v-else class="text-center italic">Table is not found.</div>
    </RPanel>
  </div>
</template>
