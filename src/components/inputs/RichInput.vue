<script setup>
import { ref } from "vue";

import BaseInput from "./BaseInput.vue";
import UploadInput from "./UploadInput.vue";

const uploadForm = ref(null);

let quill;
const prepareInsertion = (q) => {
  quill = q;

  if (!uploadForm.value.isFocus()) {
    setTimeout(() => {
      uploadForm.value.show();
    }, 0);
  }
};

const insertImage = (value) => {
  if (!value) return;

  quill(value);
};
</script>

<template>
  <BaseInput v-slot="{ value, updateValue }">
    <div class="rich-input-editor relative">
      <!-- <FileInput
        v-if="localSchema.image"
        ref="uploadForm"
        class="absolute w-full upload-form"
        :model="model"
        :path="`${path}.image`"
        :inline="true"
        :edit="true"
        @update:value="insertImage"
      /> -->

      <UploadInput
        ref="uploadForm"
        @updateValue="insertImage"
        class="absolute w-full upload-form"
      />

      <RRichEditor
        class="my-0"
        :modelValue="value"
        @update:modelValue="updateValue"
        @insertImage="prepareInsertion"
      />
    </div>
  </BaseInput>
</template>

<style lang="scss">
.rich-input-editor {
  .upload-input {
    input {
      z-index: 0;
      height: 2rem;
      opacity: 0;
    }

    button {
      display: none;
    }
  }

  .ql-toolbar {
    position: relative;
    z-index: 1;
  }
}
</style>
