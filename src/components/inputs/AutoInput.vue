<script setup>
import { computed } from "vue";
import { useSchemaStore } from "../../stores/schema.js";
import * as Inputs from "./index.js";

const props = defineProps([
  "label",
  "value",
  "model",
  "path",
  "inline",
  "edit",
  "disabled",
]);

defineEmits(["update:value"]);

const schemaStore = useSchemaStore();

const view = computed(() => {
  const schema = schemaStore.getSchema(props.model, props.path);

  let input = null;

  switch (schema.type) {
    case "boolean":
      input = Inputs.BooleanInput;
      break;

    case "string":
    case "text":
      input = Inputs.TextInput;
      break;

    case "number":
      input = Inputs.NumberInput;
      break;

    case "array":
      input = Inputs.ListInput;
      break;

    case "object":
      input = Inputs.ObjectInput;
      break;

    case "relation":
      input = Inputs.RelationInput;
      break;

    case "file":
      input = Inputs.FileInput;
      break;
  }

  return input;
});
</script>

<template>
  <component
    :is="view"
    :label="label"
    :value="value"
    :model="model"
    :path="path"
    :inline="inline"
    :edit="edit"
    :disabled="disabled"
    @update:value="$emit('update:value', $event)"
  />
</template>
