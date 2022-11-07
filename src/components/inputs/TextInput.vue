<script setup>
import objectPath from "object-path";
import { nextTick, reactive, ref, watch } from "vue";

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

const textarea = ref(null);
const styles = reactive({
  overflow: 'hidden',
});

const MIN_TEXT_HEIGHT = 84;
const MAX_TEXT_HEIGHT = 262;

const resizeTextarea = () => {
  if (!textarea.value)
    return;

  styles.height = `auto !important`;

  nextTick(() => {
    const scrollHeight = textarea.value.scrollHeight;
    styles.overflow = 'hidden';

    if (scrollHeight <= MIN_TEXT_HEIGHT) {
      styles.height = `${MIN_TEXT_HEIGHT}px`;
    } else if (scrollHeight <= MAX_TEXT_HEIGHT) {
      styles.height = `${scrollHeight}px`;
    } else {
      styles.height = `${MAX_TEXT_HEIGHT}px`;
      styles.overflow = 'auto';
    }
  });
}

const syncValue = () => {
  localValue.value = objectPath.get(props.value, props.path);
  localSchema.value = schemaStore.getSchema(props.model, props.path);

  localLabel.value = props.path.split(".").slice(-1)[0];

  nextTick(() => {
    resizeTextarea();
  });
};

const updateValue = (newValue) => {
  emit("update:value", (o) =>
    objectPath.set(o, props.path, newValue || undefined)
  );
};

const updateTextareValue = (newValue) => {
  updateValue(newValue);
  resizeTextarea();
}

watch(() => [props.value, props.path, props.model], syncValue, { deep: true });

syncValue();
</script>

<template>
  <div>
    <label v-if="!inline && localLabel" class="block uppercase mb-2">{{
      formatLabel(localLabel)
    }}</label>

    <RInput
      v-if="edit && localSchema.type === 'string'"
      class="my-0"
      :modelValue="localValue"
      :disabled="disabled"
      @update:modelValue="updateValue"
    />

    <textarea
      v-else-if="edit && localSchema.type === 'text'"
      ref="textarea"
      :style="styles"
      class="block border w-full p-3 rounded-lg outline-none focus:border-black dark:bg-gray-900 dark:border-gray-500 dark:focus:border-primary-500 resize-none"
      :value="localValue"
      @input="updateTextareValue($event.target.value)"
    ></textarea>

    <div v-else>
      {{ localValue }}
    </div>
  </div>
</template>
