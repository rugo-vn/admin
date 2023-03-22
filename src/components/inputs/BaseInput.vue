<script setup>
import { clone, equals } from "ramda";
import { ref, watch } from "vue";
import { formatLabel } from "../../utils";
import EmptyValue from "../values/EmptyValue.vue";

const props = defineProps([
  "name",
  "value",
  "inline",
]); /* changable props: value */
const emit = defineEmits(["updateValue"]);

const localValue = ref(undefined);
// const dump = (o) => (typeof o === "object" ? JSON.stringify(o) : o);

const updateValue = (newValue) => {
  if (typeof newValue === "function") newValue = newValue();

  if (equals(newValue, localValue.value)) return;

  // console.log(`Update localValue to "${dump(newValue)}"`);

  localValue.value = clone(newValue);
  emit("updateValue", localValue.value);
};

watch(
  () => props.value,
  () => updateValue(props.value),
  { deep: true }
);

updateValue(props.value);
</script>

<template>
  <div>
    <label v-if="name" class="block uppercase mb-2">
      {{ formatLabel(name, true) }}
    </label>

    <EmptyValue v-if="inline && localValue === undefined" />

    <slot v-else-if="inline" name="inlineValue" :value="localValue">
      {{ localValue }}
    </slot>

    <slot v-else :value="localValue" :updateValue="updateValue"></slot>
  </div>
</template>
