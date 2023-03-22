<script setup>
import objectPath from "object-path";
import { nextTick, ref, watch } from "vue";
import { FileInput } from ".";
import { useApiStore } from "../../stores/api.js";

import { useSchemaStore } from "../../stores/schema.js";
import { formatLabel } from "../../utils.js";
import RichEditor from "../RichEditor.vue";
import ComplexValue from "../values/ComplexValue.vue";

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
const apiStore = useApiStore();

const localValue = ref("");
const localSchema = ref({});
const localLabel = ref("");
const uploadForm = ref(null);

const syncValue = () => {
  localValue.value = objectPath.get(props.value, props.path);
  localSchema.value = schemaStore.getSchema(props.model, props.path);

  localLabel.value = props.path.split(".").slice(-1)[0];
};

const updateValue = (newValue) => {
  emit("update:value", (o) =>
    objectPath.set(o, props.path, newValue || undefined)
  );
};

let quill;
const prepareInsertion = (q) => {
  if (!localSchema.value.image) {
    apiStore.pushNotice({
      type: "warn",
      title: "Invalid Config",
      detail: "No image config for rich text",
    });
    return;
  }

  quill = q;

  if (!uploadForm.value.isFocus()) {
    setTimeout(() => {
      uploadForm.value.show();
    }, 0);
  }
};

const insertImage = (set) => {
  const o = {};
  const baseURL = import.meta.env.ADMIN_API;

  set(o);

  const value = objectPath.get(o, `${props.path}.image`);

  quill.focus();
  nextTick(() => {
    const selection = quill.getSelection();
    quill.insertEmbed(
      selection ? selection.index : 0,
      "image",
      `${baseURL}${value}`
    );
  });
};

watch(() => [props.value, props.path, props.model], syncValue, { deep: true });

syncValue();
</script>

<template>
  <div>
    <label v-if="!inline && localLabel" class="block uppercase mb-2">{{
      formatLabel(localLabel, true)
    }}</label>

    <div v-if="edit" class="rich-input-editor relative">
      <FileInput
        v-if="localSchema.image"
        ref="uploadForm"
        class="absolute w-full upload-form"
        :model="model"
        :path="`${path}.image`"
        :inline="true"
        :edit="true"
        @update:value="insertImage"
      />

      <RichEditor
        class="my-0"
        :modelValue="localValue"
        @update:modelValue="updateValue"
        @insertImage="prepareInsertion"
      />
    </div>

    <ComplexValue v-else-if="inline" />

    <div v-else v-html="localValue"></div>
  </div>
</template>

<style lang="scss">
.rich-input-editor {
  .upload-form {
    > div > div > input {
      z-index: 0;
      height: 2rem;
      opacity: 0;
    }
  }

  .ql-toolbar {
    position: relative;
    z-index: 1;
  }
}
</style>
