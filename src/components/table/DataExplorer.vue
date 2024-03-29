<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";

import { useSchemaStore } from "../../stores/schema.js";
import { useSelectionStore } from "../../stores/selection.js";
import { DEFAULT_ID_FIELD } from "../../constants.js";
import { formatLabel } from "../../utils.js";

import AutoInput from "../inputs/AutoInput.vue";
import { useApiStore } from "../../stores/api.js";
import DropDown from "../DropDown.vue";
import DataForm from "./DataForm.vue";
import { useRouter } from "vue-router";
import RPagination from "../RPagination.vue";
import { useAppStore } from "../../stores/app";

const props = defineProps(["tableName", "open"]);
const emit = defineEmits(["remove"]);

const selectionStore = useSelectionStore();
const schemaStore = useSchemaStore();
const apiStore = useApiStore();
const appStore = useAppStore();
const router = useRouter();

const data = ref([]);
const localLables = ref([]);
const localSchema = ref({});
const dataTable = ref(null);
const dataFormId = ref(null);
const dataForm = ref(null);
const dataFormMode = ref("view");
const total = ref(0);
const skip = ref(0);
const limit = ref(0);

const syncValue = async () => {
  localSchema.value = schemaStore.getSchema(props.tableName, "");

  if (!localSchema.value)
    throw new Error(`Could not find schema for ${props.tableName}`);

  localLables.value = [DEFAULT_ID_FIELD];
  for (let name in localSchema.value.properties) {
    localLables.value.push(name);
    break;
  }
  autoLabel();

  const { data: result, meta } = await apiStore.table.find(props.tableName, {
    skip: skip.value,
    sort: { createdAt: -1 },
  });

  data.value = result;
  total.value = meta.total;
  skip.value = meta.skip;
  limit.value = meta.limit;

  selectionStore.clear();
};

const autoLabel = () => {
  if (!dataTable.value) return;

  const customizeColumnName = `tables.${props.tableName}.columns`;
  const prevColumns = appStore.getCustomize(customizeColumnName);

  const dataTableWidth = dataTable.value.offsetWidth;

  localLables.value = [DEFAULT_ID_FIELD];

  for (let name of prevColumns || Object.keys(localSchema.value.properties)) {
    localLables.value.push(name);

    if ((localLables.value.length - 1) * 500 > dataTableWidth) break;
  }

  // appStore.setCustomize(
  //   customizeColumnName,
  //   new Array(...localLables.value).slice(1)
  // );
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

const handleAction = (name, item) => {
  switch (name) {
    case "open":
      handleClick(item);
      break;

    case "details":
      dataFormId.value = item.id;
      dataFormMode.value = "view";
      dataForm.value.show();
      break;

    case "edit":
      dataFormId.value = item.id;
      dataFormMode.value = "edit";
      dataForm.value.show();
      break;

    case "remove":
      selectionStore.clear();
      selectionStore.select(item.id);
      emit("remove");
      break;
  }
};

const handleClick = (item) => {
  if (!props.open || typeof props.open !== "function") {
    return toggleSelect(item.id, !isSelected(item.id));
  }

  router.push(props.open(item));
};

const updateDataForm = () => {
  dataForm.value.hide();
  syncValue();
};

const updateSkip = (val) => {
  skip.value = val;
  syncValue();
};

watch(() => [props.tableName], syncValue);

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
    <RDialog :label="false" ref="dataForm">
      <DataForm
        :id="dataFormId"
        :mode="dataFormMode"
        :tableName="tableName"
        @update:value="updateDataForm"
      />
    </RDialog>

    <table class="m-table table-fixed w-full">
      <thead class="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
        <th
          :class="`head-${label} py-2 px-4 font-normal text-xs text-left uppercase`"
          v-for="label in localLables"
          :key="`head-${label}`"
        >
          <RCheckbox
            variant="primary"
            :indeterminate="selectionStore.isAnySelected(data.length)"
            :modelValue="selectionStore.isAllSelected(data.length)"
            @update:modelValue="toggleSelectAll($event)"
            v-if="label === 'id'"
          />

          <div v-else>
            {{ formatLabel(label, true) }}
          </div>
        </th>

        <th class="head-_tool font-normal text-xs text-left uppercase">
          <div class="relative">
            <button class="cursor-pointer peer">
              <EllipsisVerticalIcon class="text-base" />
            </button>

            <div
              class="hidden peer-focus:block bg-white drop-shadow rounded absolute mx-2 z-10 overflow-hidden right-0 w-fit"
            >
              <div
                v-for="name in Object.keys(localSchema.properties)"
                :key="`column-picker.${name}`"
              >
                {{ name }}
              </div>
            </div>
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
            :key="`cell-${label}`"
            v-for="label in localLables"
          >
            <RCheckbox
              variant="primary"
              class="h-full flex"
              v-if="label === 'id'"
              type="checkbox"
              :modelValue="isSelected(row[DEFAULT_ID_FIELD])"
              @update:modelValue="toggleSelect(row[DEFAULT_ID_FIELD], $event)"
            />
            <slot v-else name="cell()" v-bind="{ row, label }">
              <AutoInput
                class="cursor-pointer select-none"
                :schema="localSchema.properties[label]"
                :value="row[label]"
                :inline="true"
              />
            </slot>
          </td>

          <td class="cell-_tool">
            <DropDown
              :actions="[
                ...(open && typeof open === 'function' ? ['open'] : []),
                'edit',
                'details',
                'remove',
              ]"
              @do:action="handleAction($event, row)"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-if="data.length === 0"
      class="text-center italic text-gray-300 py-2 px-3 bg-secondary-50 border-b"
    >
      Empty!
    </div>

    <RPagination
      class="mt-4"
      :modelValue="skip"
      :limit="limit"
      :total="total"
      @update:modelValue="updateSkip"
    />
  </div>
</template>

<style lang="scss">
.data-table {
  .head-id {
    width: 0;
  }

  .cell-id {
    width: 0;
  }

  .head-_tool,
  .cell-_tool {
    width: 1.75rem;
  }
}
</style>
