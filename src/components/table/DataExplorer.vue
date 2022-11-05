<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";

import { useSchemaStore } from "../../stores/schema.js";
import { useSelectionStore } from "../../stores/selection.js";
import { DEFAULT_ID_FIELD } from "../../constants.js";
import { formatLabel } from "../../utils.js";

import RCheckbox from "../RCheckbox.vue";
import AutoInput from "../inputs/AutoInput.vue";
import { useApiStore } from "../../stores/api.js";

const props = defineProps(["model"]);

const selectionStore = useSelectionStore();
const schemaStore = useSchemaStore();
const apiStore = useApiStore();

const data = ref([]);
const localLables = ref([]);
const localSchema = ref({});
const dataTable = ref(null);

const syncValue = async () => {
  localSchema.value = schemaStore.getSchema(props.model, "");

  if (!localSchema.value)
    throw new Error(`Could not find schema for ${props.model}`);

  localLables.value = [DEFAULT_ID_FIELD];
  for (let name in localSchema.value.properties) {
    localLables.value.push(name);
    break;
  }
  autoLabel();

  const { data: result } = await apiStore.find(props.model);
  data.value = result;

  selectionStore.clear();
};

const autoLabel = () => {
  if (!dataTable.value) return;

  const dataTableWidth = dataTable.value.offsetWidth;

  localLables.value = [DEFAULT_ID_FIELD];

  for (let name in localSchema.value.properties) {
    localLables.value.push(name);

    if ((localLables.value.length - 1) * 500 > dataTableWidth) break;
  }
};

const toggleSelect = (id, val) => {
  return val ? selectionStore.select(id) : selectionStore.unselect(id);
};

const toggleSelectAll = (val) => {
  if (!val) return selectionStore.clear();

  for (let item of data.value) selectionStore.select(item[DEFAULT_ID_FIELD]);
};

const isSelected = (id) => {
  return selectionStore.selected.indexOf(id) !== -1;
};

watch(() => [props.model], syncValue);

const dataTableResize = () => {
  autoLabel();
};

onMounted(() => {
  window.addEventListener("resize", dataTableResize);

  dataTableResize();
});

onUnmounted(() => {
  window.removeEventListener("resize", dataTableResize);
});

defineExpose({ sync: syncValue });
syncValue();
</script>

<template>
  <div class="data-table" ref="dataTable">
    <table class="m-table table-fixed w-full">
      <thead class="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
        <th
          :class="`head-${label} py-2 px-4 font-normal text-xs text-left uppercase`"
          v-for="label in localLables"
          :key="`head-${label}`"
        >
          <RCheckbox
            :indeterminate="selectionStore.isAnySelected(data.length)"
            :modelValue="selectionStore.isAllSelected(data.length)"
            @update:modelValue="toggleSelectAll($event)"
            v-if="label === '_id'"
          />

          <div v-else>
            {{ formatLabel(label) }}
          </div>
        </th>
      </thead>

      <tbody>
        <tr
          class="border-b dark:border-gray-700"
          v-for="row of data"
          :key="row[DEFAULT_ID_FIELD]"
        >
          <td
            :class="`cell-${label} py-2 px-4 break-words`"
            v-for="label in localLables"
          >
            <RCheckbox
              class="block h-full flex"
              v-if="label === '_id'"
              type="checkbox"
              :modelValue="isSelected(row[DEFAULT_ID_FIELD])"
              @update:modelValue="toggleSelect(row[DEFAULT_ID_FIELD], $event)"
            />
            <slot v-else name="cell()" v-bind="{ row, label }">
              <AutoInput
                :value="row"
                :model="model"
                :path="label"
                :inline="true"
                :edit="false"
              />
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss">
.data-table {
  .head-_id {
    width: 0;
  }

  .cell-_id {
    width: 0;
  }
}
</style>
