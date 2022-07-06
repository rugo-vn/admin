<script setup>
import { reactive } from "vue";
import { generateId } from "@rugo-vn/vue/src/utils.js";
import * as Inputs from "./index.js";
import { MButton } from "@rugo-vn/vue";

const props = defineProps(["label", "modelValue", "schema"]);
const emit = defineEmits(["update:modelValue"]);

const items = reactive([]);

const addItem = (value = null) => {
  items.push({
    id: generateId(),
    value,
  });
};

const removeItem = (item) => {
  items.splice(items.indexOf(item), 1);
};

const getView = (type) => {
  const viewName =
    type[0].toUpperCase() + type.substring(1).toLowerCase() + "Input";

  if (Inputs[viewName]) return Inputs[viewName];

  return null;
};

const updateChange = () => {
  const result = items.map((item) => item.value).filter((i) => i !== null);
  emit("update:modelValue", result.length ? result : null);
};

const initValue = () => {
  while (items.length) items.splice(0, 1);

  for (let value of props.modelValue || []) {
    addItem(value);
  }
};

initValue();
</script>

<template>
  <div
    v-for="item in items"
    :key="item.id"
    class="flex justify-between my-2 bg-[rgba(0,0,0,.05)] p-2 rounded-lg"
  >
    <component
      class="w-full"
      :is="
        schema.children
          ? getView(schema.children.type) || Inputs.TextInput
          : Inputs.TextInput
      "
      :schema="schema.children || { editor: 'code' }"
      v-model="item.value"
      @update:modelValue="updateChange"
    />

    <div class="ml-2">
      <MButton variant="danger" class="px-1 py-1" @click="removeItem(item)">
        <ion-icon class="text-[1.3em]" name="close" />
      </MButton>
    </div>
  </div>

  <MButton variant="primary" class="px-1 py-1" @click="addItem()">
    <ion-icon class="text-[1.3em]" name="add" />
  </MButton>
</template>
