<script setup>
import { computed, ref, watch } from "vue";

import FolderIcon from "@rugo-vn/vue/dist/ionicons/FolderIcon.vue";
import DocumentTextIcon from "@rugo-vn/vue/dist/ionicons/DocumentTextIcon.vue";
import ImageIcon from "@rugo-vn/vue/dist/ionicons/ImageIcon.vue";

import { useApiStore } from "../../stores/api.js";
import { useSelectionStore } from "../../stores/selection.js";
import { DIRECTORY_MIME, EDITABLE_MIMES } from "../../constants.js";
import { download } from "../../utils.js";
import RBreadcrumb from "../RBreadcrumb.vue";
import { join, basename, dirname, parse } from "path-browserify";
import DropDown from "../DropDown.vue";

const props = defineProps(["mode", "driveName", "parent"]);
const emit = defineEmits(["update:parent", "update:value", "edit"]);

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
  const pp = parse(item.path);

  let res;
  let newName;

  switch (name) {
    case "edit":
      emit("edit", item.path);
      break;

    case "download":
      res = await apiStore.drive.download(props.driveName, item.path);
      download(res, item.name);

      break;

    case "rename":
      newName = window.prompt("Enter new name: ", basename(item.path));
      if (!newName) break;

      res = await apiStore.drive.move(
        props.driveName,
        item.path,
        join(dirname(item.path), newName)
      );
      apiStore.http.pushNotice({
        type: "success",
        title: `Renamed`,
        detail: "You renamed an entry",
      });
      syncValue();
      break;

    case "compress":
      newName = window.prompt(
        "Enter compressed file name: ",
        basename(item.path) + ".zip"
      );
      if (!newName) break;

      res = await apiStore.drive.compress(
        props.driveName,
        item.path,
        join(dirname(item.path), newName)
      );
      apiStore.http.pushNotice({
        type: "success",
        title: `Compressed`,
        detail: "You compressed an entry",
      });
      syncValue();

      break;

    case "extract":
      newName = window.prompt("Extract file to new directory: ", pp.name);
      if (!newName) break;

      res = await apiStore.drive.extract(
        props.driveName,
        item.path,
        join(dirname(item.path), newName)
      );
      apiStore.http.pushNotice({
        type: "success",
        title: `Extracted`,
        detail: "You extracted an entry",
      });
      syncValue();

      break;

    case "remove":
      if (!window.confirm(`You you want to remove 1 item(s)?`)) return;
      await apiStore.drive.remove(props.driveName, item.path);
      apiStore.http.pushNotice({
        type: "success",
        title: "Removed",
        detail: `Removed 1 item(s).`,
      });
      syncValue();
      break;
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
            variant="primary"
            :indeterminate="selectionStore.isAnySelected(data.length)"
            :modelValue="selectionStore.isAllSelected(data.length)"
            @update:modelValue="toggleSelectAll($event)"
          />
        </th>
        <th class="py-2 px-4 font-normal text-xs text-left uppercase">Name</th>
        <th
          class="py-2 px-4 font-normal text-xs uppercase w-40 text-right hidden md:table-cell"
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
              variant="primary"
              class="h-full flex"
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
                  item.mime === DIRECTORY_MIME
                    ? FolderIcon
                    : (item.mime || '').indexOf('image') === 0
                    ? ImageIcon
                    : DocumentTextIcon
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
            class="py-2 px-4 text-xs text-gray-500 w-40 text-right hidden md:table-cell"
          >
            {{ item.mime }}
          </td>

          <td class="w-[1.75rem]" v-if="mode !== 'single'">
            <DropDown
              :actions="[
                ...(EDITABLE_MIMES.indexOf(item.mime) !== -1 ? ['edit'] : []),
                ...(item.mime === 'application/zip' ? ['extract'] : []),
                ...(item.mime !== DIRECTORY_MIME ? ['download'] : []),
                'compress',
                'rename',
                'remove',
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
