<script setup>
import objectPath from "object-path";
import { onMounted, onUnmounted, ref, watch } from "vue";

import CloseIcon from "@rugo-vn/vue/dist/ionicons/CloseIcon.vue";

import { useSchemaStore } from "../../stores/schema.js";
import { formatLabel, FsId } from "../../utils.js";

import FileExplorer from "../tree/FileExplorer.vue";
import UploadForm from "../tree/UploadForm.vue";

const props = defineProps([
  "label",
  "value",
  "path",
  "model",
  "inline",
  "edit",
  "disabled",
]);
const emit = defineEmits(["update:value"]);

const schemaStore = useSchemaStore();

const localValue = ref("");
const localSchema = ref({});
const localLabel = ref("");
const inputBox = ref(null);
const fileExplorer = ref(null);
const isFocus = ref(false);

const parent = ref(
  "/" + new Date().toISOString().substring(0, 10).replace(/-/g, "/")
);

let refSchema = null;

const syncValue = async () => {
  localValue.value = objectPath.get(props.value, props.path);
  localSchema.value = schemaStore.getSchema(props.model, props.path);
  localLabel.value = props.path.split(".").slice(-1)[0];

  if (localSchema.value.ref) {
    refSchema = schemaStore.getSchema(localSchema.value.ref);
  }
};

const updateValue = (newValue) => {
  emit("update:value", (o) =>
    objectPath.set(o, props.path, newValue || undefined)
  );
};

const updateItem = (item) => {
  if (!item) return updateValue(undefined);

  updateValue(
    (localSchema.value.prefix ? localSchema.value.prefix : "") +
      FsId(item._id).toPath()
  );
  fileExplorer.value.sync();
  isFocus.value = false;
  syncValue();
};

const updateParent = (value) => {
  parent.value = value;
};

const fileInputFocus = (e) => {
  if (!inputBox.value) return;

  let elm = e.target;
  while (elm) {
    elm = elm.parentElement;
    if (inputBox.value === elm) {
      return (isFocus.value = true);
    }
  }

  isFocus.value = false;
};

onMounted(() => {
  window.addEventListener("click", fileInputFocus);
});

onUnmounted(() => {
  window.removeEventListener("click", fileInputFocus);
});

watch(() => [props.value, props.path, props.model], syncValue, { deep: true });

defineExpose({
  show(){ isFocus.value = true; },
  hide(){ isFocus.value = false; },
  isFocus(){ return isFocus.value; },
});

syncValue();
</script>

<template>
  <div>
    <label v-if="!inline && localLabel" class="block uppercase mb-2">{{
      formatLabel(localLabel)
    }}</label>
    <div v-if="edit">
      <div v-if="localSchema.ref" ref="inputBox" class="relative">
        <input
          class="block border w-full p-3 rounded-lg outline-none focus:border-black dark:bg-gray-900 dark:border-gray-500 dark:focus:border-primary-500"
          placeholder="Select a file"
          readonly
        />

        <div
          class="bg-white drop-shadow rounded absolute w-[calc(100%-1rem)] top-10 mx-2 z-10 overflow-hidden"
          v-if="isFocus"
        >
          <div class="p-3">
            <UploadForm
              mode="single"
              :model="refSchema._name"
              :parent="parent"
              @update:value="updateItem"
            />
          </div>

          <FileExplorer
            ref="fileExplorer"
            class="mt-1 mb-[-1px]"
            mode="single"
            :model="refSchema._name"
            :parent="parent"
            @update:parent="updateParent"
            @update:value="updateItem"
          />
        </div>

        <button
          v-if="localValue"
          class="rounded-full bg-primary-500 text-white py-1 px-3 absolute top-2 left-2 inline-flex items-center whitespace-nowrap max-w-[calc(100%-1rem)] overflow-hidden block"
          @click="updateItem()"
        >
          <span class="text-ellipsis overflow-hidden max-w-[calc(100%-1rem)]">
            {{ localValue }}
          </span>
          <CloseIcon class="text-base ml-2" />
        </button>
      </div>

      <RInput
        v-else
        class="my-0"
        :modelValue="localValue"
        :disabled="disabled"
        @update:modelValue="updateValue"
      />
    </div>
    <div v-else>
      {{ localValue }}
    </div>
  </div>
</template>
