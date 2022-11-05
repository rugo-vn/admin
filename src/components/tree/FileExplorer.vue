<script setup>
import FolderIcon from "@rugo-vn/vue/dist/ionicons/FolderIcon.vue";
import DocumentTextIcon from "@rugo-vn/vue/dist/ionicons/DocumentTextIcon.vue";
import { computed, ref, watch } from "vue";
import { useApiStore } from "../../stores/api.js";
import { useSelectionStore } from "../../stores/selection.js";
import { DIRECTORY_MIME } from "../../constants.js";
import RCheckbox from "../RCheckbox.vue";
import { FsId } from "../../utils.js";
import RBreadcrumb from "../RBreadcrumb.vue";
import { join } from "path-browserify";

const props = defineProps(["model", "parent"]);
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
  localParent.value = props.parent;
  selectionStore.clear();

  const { data: result } = await apiStore.find(props.model, {
    query: {
      parent: FsId.fromPath(localParent.value).toString(),
    },
  });

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

  for (let item of data.value) selectionStore.select(item._id);
};

const open = (item) => {
  if (item.mime === DIRECTORY_MIME) {
    return updateParent(FsId(item._id).toPath());
  }

  emit("update:value", item);
};

const updateParent = (value) => {
  localParent.value = value;
  syncValue();
  emit("update:parent", value);
};

watch(() => [props.model, props.parent], syncValue);

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
        <th class="py-2 px-4 font-normal text-xs text-left uppercase w-0">
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
      </thead>

      <tbody>
        <tr
          class="border-b dark:border-gray-700"
          v-for="item in data"
          :key="item._id"
        >
          <td class="py-2 px-4 break-words">
            <RCheckbox
              class="block h-full flex"
              type="checkbox"
              :modelValue="isSelected(item._id)"
              @update:modelValue="toggleSelect(item._id, $event)"
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
