<script setup>
import { computed } from "vue";
import * as Inputs from "./index.js";

const props = defineProps(["name", "schema", "value", "inline"]);

defineEmits(["updateValue"]);

const view = computed(() => {
  let input = null;

  const schema = props.schema || {};

  switch ((schema.input || schema.type).toLowerCase()) {
    case "boolean":
      input = Inputs.BooleanInput;
      break;

    case "date":
      input = Inputs.DateInput;
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
      if (Object.keys(schema.properties || {}).length)
        input = Inputs.ObjectInput;
      else input = Inputs.JsonInput;

      break;

    case "id":
      input = Inputs.RelationInput;
      break;

    case "rich":
      input = Inputs.RichInput;
      break;

    // case "File":
    //   input = Inputs.FileInput;
    //   break;

    case "json":
      input = Inputs.JsonInput;
      break;

    case "upload":
      input = Inputs.UploadInput;
      break;
  }

  return input;
});
</script>

<template>
  <component
    :is="view"
    :name="name"
    :schema="schema"
    :inline="inline"
    :value="value"
    @updateValue="$emit('updateValue', $event)"
  />
</template>
