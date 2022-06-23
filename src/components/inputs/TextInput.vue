<script setup>
import { computed, inject, nextTick, ref } from "vue";
import { MInput, MRichEditor, MDropdown, MList, MListItem, MDialog } from "../../../lib";
import UploadInput from "./UploadInput.vue";

const props = defineProps(['label', 'modelValue', 'schema']);
defineEmits(['update:modelValue']);

const noti = inject('mnoti');
const dialog = ref(null);
let quill;

const prepareInsertion = q => {
  quill = q;

  if (!props.schema.upload)
    return noti.push('warn', 'Do not have upload config!');

  dialog.value.show();
}

const insertImage = filePath => {
  const baseURL = import.meta.env.ADMIN_API_BASE_URL;
  dialog.value.hide();
  
  quill.focus();
  nextTick(() => {
    const selection = quill.getSelection();
    quill.insertEmbed(selection ? selection.index : 0, 'image', `${baseURL}${filePath}`);
  });
}

const valueLength = computed(() => (props.modelValue ? props.modelValue.length : 0) + (props.schema.maxlength !== undefined ? `/${props.schema.maxlength}` : ''));
</script>

<template>
  <div v-if="schema.editor === 'rich'" class="text-input">
    <MRichEditor
      :modelValue="modelValue"
      @update:modelValue="event => $emit('update:modelValue', event)"
      @insertImage="prepareInsertion"
    />

    <MDialog :label="false" ref="dialog">
      <UploadInput
        :schema="schema.upload"
        :hideInput="true"
        @update:modelValue="insertImage"
      />
    </MDialog>
  </div>

  <MDropdown
    v-else-if="schema.choice"
    class="w-[100%!important] block"
    position="left"
    :autohide="true"
  >
    <template #open="{click}">
      <div class="relative">
        <MInput
          class="my-0"
          @click="click"
          :disabled="true"
          :modelValue="modelValue"
        />

        <button
          class="border-2 border-warn-500 text-warn-500 rounded-full w-6 h-6 opacity-50 inline-flex items-center justify-center absolute right-9 top-2.5
          hover:opacity-100"
          v-if="modelValue && !schema.required && !schema.default"
          @click="$emit('update:modelValue', null)"
        >
          <ion-icon class="text-lg" name="close" />
        </button>

        <ion-icon @click="click" class="text-lg absolute right-2.5 top-3.5 text-gray-500" name="chevron-down" />
      </div>
    </template>

    <MList class="w-[100%!important]">
      <MListItem
        v-for="item in schema.choice"
        :key="item"
        @click="$emit('update:modelValue', item)"
      >
        {{ item }}
      </MListItem>
    </MList>
  </MDropdown>
  
  <div v-else class="relative">
    <MInput
      class="my-0"
      :modelValue="modelValue"
      @update:modelValue="event => $emit('update:modelValue', event)"
    />

    <div class="absolute bottom-[-1.25em] right-2 text-[.8em] bg-white p-1 text-gray-400">{{ valueLength }}</div>
  </div>
</template>

<style lang="scss">
.text-input {
  .m-dialog .m-content-dialog {
    @apply max-w-2xl;
  }
}
</style>