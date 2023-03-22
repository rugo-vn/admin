<script setup>
import objectPath from "object-path";
import { ref, watch } from "vue";

import { useSchemaStore } from "../../stores/schema.js";
import { formatLabel } from "../../utils.js";

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

const syncValue = () => {
  localValue.value = objectPath.get(props.value, props.path);
  localSchema.value = schemaStore.getSchema(props.model, props.path);

  localLabel.value = props.path.split(".").slice(-1)[0];
};

const updateValue = (newValue) => {
  emit("update:value", (o) =>
    objectPath.set(
      o,
      props.path,
      newValue === "" ? undefined : parseFloat(newValue)
    )
  );
};

watch(() => [props.value, , props.path, props.model], syncValue, {
  deep: true,
});

syncValue();
</script>

<template>
  <div>
    <label v-if="!inline && localLabel" class="block uppercase mb-2">{{
      formatLabel(localLabel, true)
    }}</label>
    <RInput
      v-if="edit"
      class="my-0"
      type="number"
      :modelValue="localValue"
      :disabled="disabled"
      @update:modelValue="updateValue"
    />
    <div v-else>
      {{ localValue }}
    </div>
  </div>
</template>
