<script setup>
import objectPath from "object-path";
import { ref, watch } from "vue";
import { PrismEditor } from "vue-prism-editor";
import { useSchemaStore } from "../../stores/schema.js";
import { formatLabel } from "../../utils.js";

import "vue-prism-editor/dist/prismeditor.min.css";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";

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
const isJson = ref(null);
let jsonValue;

const highlighter = (code) => {
  return highlight(code, languages.json);
};

const syncValue = () => {
  localSchema.value = schemaStore.getSchema(props.model, props.path);
  localLabel.value = props.path.split(".").slice(-1)[0];

  const nextValue = objectPath.get(props.value, props.path);

  if (JSON.stringify(jsonValue) !== JSON.stringify(nextValue)) {
    if (!nextValue) {
      localValue.value = "";
    } else {
      localValue.value = JSON.stringify(nextValue, 0, 2);
    }
  }
};

const updateValue = (newValue) => {
  localValue.value = newValue;

  jsonValue = undefined;
  if (!newValue) {
    isJson.value = null;
  } else {
    try {
      jsonValue = JSON.parse(newValue);
      isJson.value = true;
    } catch (_) {
      isJson.value = false;
    }

    if (typeof jsonValue !== "object") isJson.value = false;
  }

  if (isJson.value === false) return;

  emit("update:value", (o) =>
    objectPath.set(o, props.path, jsonValue || undefined)
  );
};

watch(() => [props.value, props.path, props.model], syncValue, { deep: true });

syncValue();
</script>

<template>
  <div>
    <label v-if="!inline && localLabel" class="block uppercase mb-2">{{
      formatLabel(localLabel)
    }}</label>

    <div v-if="edit" class="relative">
      <PrismEditor
        :class="`${
          isJson === null ? '' : isJson ? `border-green-500` : `border-red-500`
        }`"
        :highlight="highlighter"
        :modelValue="localValue"
        @update:modelValue="updateValue($event)"
      />
    </div>

    <span
      v-else-if="inline"
      class="bg-secondary-400 text-white px-2 py-1 rounded text-xs"
    >
      Complex
    </span>

    <div v-else v-html="localValue" />
  </div>
</template>

<style lang="scss">
.prism-editor-wrapper {
  @apply bg-white block border w-full p-3 rounded-lg outline-none focus:border-black dark:bg-gray-900 dark:border-gray-500 dark:focus:border-primary-500;

  font-family: monospace;

  .prism-editor__textarea {
    &:focus-visible {
      outline: none;
    }
  }
}
</style>
