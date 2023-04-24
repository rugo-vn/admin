<script setup>
import objectPath from "object-path";
import { ref, watch } from "vue";
import { PrismEditor } from "vue-prism-editor";

import "vue-prism-editor/dist/prismeditor.min.css";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";

const props = defineProps(["value", "modelValue"]);
const emit = defineEmits(["update:value", "update:modelValue"]);

const localValue = ref("");
const isJson = ref(null);
let jsonValue;

const highlighter = (code) => {
  return highlight(code, languages.json);
};

const syncValue = () => {
  const nextValue = objectPath.get(props.value, props.path) || props.modelValue;

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

  emit("update:value", jsonValue || undefined);
  emit("update:modelValue", jsonValue || undefined);
};

watch(() => [props.value, props.modelValue], syncValue, { deep: true });

syncValue();
</script>

<template>
  <div class="relative">
    <PrismEditor
      :class="`${
        isJson === null ? '' : isJson ? `border-green-500` : `border-red-500`
      }`"
      :highlight="highlighter"
      :modelValue="localValue"
      @update:modelValue="updateValue($event)"
    />
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
