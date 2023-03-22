<script setup>
import { computed } from "vue";
import * as Inputs from "./index.js";

const props = defineProps(["name", "schema", "value", "inline"]);

defineEmits(["updateValue"]);

const view = computed(() => {
  let input = null;

  const schema = props.schema || {};

  switch (schema.type) {
    // case "Boolean":
    //   input = Inputs.BooleanInput;
    //   break;

    case "String":
    case "Text":
      input = Inputs.TextInput;
      break;

    // case "Number":
    //   input = Inputs.NumberInput;
    //   break;

    case "Array":
      input = Inputs.ListInput;
      break;

    case "Object":
      if (Object.keys(schema.properties || {}).length)
        input = Inputs.ObjectInput;
      else input = Inputs.JsonInput;

      break;

    case "Id":
      input = Inputs.RelationInput;
      break;

    // case "File":
    //   input = Inputs.FileInput;
    //   break;

    // case "Rich":
    //   input = Inputs.RichInput;
    //   break;

    case "Json":
      input = Inputs.JsonInput;
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
