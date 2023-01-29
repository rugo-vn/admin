<script setup>
import FolderIcon from "@rugo-vn/vue/dist/ionicons/FolderIcon.vue";
import DocumentTextIcon from "@rugo-vn/vue/dist/ionicons/DocumentTextIcon.vue";
import { computed, ref, watch } from "vue";
import { useApiStore } from "../../stores/api.js";
import { useSelectionStore } from "../../stores/selection.js";
import { DIRECTORY_MIME } from "../../constants.js";
import RCheckbox from "../RCheckbox.vue";
import { FsId, download } from "../../utils.js";
import RBreadcrumb from "../RBreadcrumb.vue";
import { join } from "path-browserify";
import DropDown from "../DropDown.vue";

const props = defineProps(["mode", "driveName", "parent"]);
const emit = defineEmits(["update:parent", "update:value"]);

const selectionStore = useSelectionStore();
const apiStore = useApiStore();

const data = ref([]);
const localParent = ref("/");

const addresses = computed(() => {
  const splits = (localParent.value || "").split("/").filter((i) => i);

  const result = [{ value: "/" }];

  for (let name of splits) {
    let lastItem = result[result.length - 1];
    let nextPath = join(lastItem.value, name);
    result.push({
      text: name,
      value: nextPath,
    });
  }

  return result;
});

const syncValue = async () => {
  if (props.parent) localParent.value = props.parent;

  selectionStore.clear();

  const result = await apiStore.drive.list(props.driveName, localParent.value);

  result.sort((a, b) => {
    if (a.mime === DIRECTORY_MIME && b.mime !== DIRECTORY_MIME) return -1;

    if (a.mime !== DIRECTORY_MIME && b.mime === DIRECTORY_MIME) return 1;

    return a.name.localeCompare(b.name);
  });

  data.value = result;

  selectionStore.clear();
};

const isSelected = (id) => {
  return selectionStore.selected.indexOf(id) !== -1;
};

const toggleSelect = (id, val) => {
  return val ? selectionStore.select(id) : selectionStore.unselect(id);
};

const toggleSelectAll = (val) => {
  if (!val) return selectionStore.clear();

  for (let item of data.value) selectionStore.select(item.path);
};

const open = (item) => {
  if (item.mime === DIRECTORY_MIME) {
    return updateParent(item.path);
  }

  emit("update:value", item);
};

const updateParent = (value) => {
  localParent.value = value;
  syncValue();
  emit("update:parent", value);
};

const handleAction = async (name, item) => {
  let res;
  switch (name) {
    case "download":
      res = await apiStore.download(props.driveName, item.path);
      download(res, item.name);

      break;
    default:
      res = await apiStore.x(name, props.driveName, item.path);
      apiStore.pushNotice({
        type: "primary",
        title: `${name}`,
        detail: res.data,
      });
      syncValue();
  }
};

watch(() => [props.driveName, props.parent], syncValue);

defineExpose({ sync: syncValue });
syncValue();
</script>

<template>
  <div>
    <RBreadcrumb
      class="mb-4 h-4 px-[1.14rem]"
      :items="addresses"
      @navigate="updateParent($event.value)"
    />

    <table class="m-table table-fixed w-full">
      <thead class="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
        <th
          class="py-2 px-4 font-normal text-xs text-left uppercase w-0"
          v-if="mode !== 'single'"
        >
          <RCheckbox
            :indeterminate="selectionStore.isAnySelected(data.length)"
            :modelValue="selectionStore.isAllSelected(data.length)"
            @update:modelValue="toggleSelectAll($event)"
          />
        </th>
        <th class="py-2 px-4 font-normal text-xs text-left uppercase">Name</th>
        <th
          class="py-2 px-4 font-normal text-xs text-left uppercase w-32 text-right hidden md:table-cell"
        >
          Mime
        </th>

        <th class="w-[1.75rem]" v-if="mode !== 'single'"></th>
      </thead>

      <tbody>
        <tr
          class="border-b dark:border-gray-700"
          v-for="item in data"
          :key="item.path"
        >
          <td class="py-2 px-4 break-words" v-if="mode !== 'single'">
            <RCheckbox
              class="block h-full flex"
              type="checkbox"
              :modelValue="isSelected(item.path)"
              @update:modelValue="toggleSelect(item.path, $event)"
            />
          </td>

          <td
            class="py-2 px-4 break-words overflow-hidden cursor-pointer"
            @click="open(item)"
          >
            <button class="flex items-center">
              <component
                :is="
                  item.mime === DIRECTORY_MIME ? FolderIcon : DocumentTextIcon
                "
                class="mr-3 text-lg"
                type="outline"
              />

              <div
                :class="`${
                  item.mime === DIRECTORY_MIME ? 'font-semibold' : ''
                } flex-1`"
              >
                {{ item.name }}
              </div>
            </button>
          </td>

          <td
            class="py-2 px-4 text-xs text-gray-500 w-32 text-right hidden md:table-cell"
          >
            {{ item.mime }}
          </td>

          <td class="w-[1.75rem]" v-if="mode !== 'single'">
            <DropDown
              :actions="[
                'compress',
                ...(item.mime === 'application/zip' ? ['extract'] : []),
                ...(item.mime !== DIRECTORY_MIME ? ['download'] : []),
              ]"
              @do:action="handleAction($event, item)"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-if="data.length === 0"
      class="text-center italic text-gray-500 py-2 px-3"
    >
      Empty!
    </div>
  </div>

  <!-- <div class="px-4 h-10 bg-gray-50 border-b flex items-center">
      <RCheckbox class="mt-[-.4rem]" />

      <span class="text-xs">NAME</span>
    </div>
    
    
  </div> -->
</template>
