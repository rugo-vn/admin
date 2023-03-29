<script setup>
import { ref, watch } from "vue";
import { PrismEditor } from "vue-prism-editor";

import "vue-prism-editor/dist/prismeditor.min.css";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";

const props = defineProps(["modelValue", "lang"]);
const emit = defineEmits(["update:modelValue"]);

const localValue = ref("");

const highlighter = (code) => {
  return highlight(code, languages[props.lang || "js"]);
};

const syncValue = () => {
  localValue.value = props.modelValue || "";
};

const updateValue = (newValue) => {
  if (newValue === localValue.value) return;
  localValue.value = newValue;

  emit("update:modelValue", newValue);
};

watch(() => [props.modelValue], syncValue, { deep: true });

syncValue();
</script>

<template>
  <div class="relative">
    <PrismEditor
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
