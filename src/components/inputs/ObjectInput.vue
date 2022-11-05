<script setup>
import { ref, watch } from "vue";

import { useSchemaStore } from "../../stores/schema.js";
import { formatLabel } from "../../utils.js";
import AutoInput from "./AutoInput.vue";

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

const localSchema = ref({});
const localLabel = ref("");

const syncValue = () => {
  localSchema.value = schemaStore.getSchema(props.model, props.path);
  localLabel.value = props.path.split(".").slice(-1)[0];
};

watch(() => [props.path, props.model], syncValue);

syncValue();
</script>

<template>
  <div>
    <label v-if="!inline && localLabel" class="block uppercase mb-2">{{
      formatLabel(localLabel)
    }}</label>

    <template v-if="inline">
      <span class="bg-secondary-400 text-white px-2 py-1 rounded text-xs"
        >Complex</span
      >
    </template>

    <template v-else>
      <div
        v-for="(_, name) in localSchema.properties"
        class="pb-4 pl-4 border-l last:pb-0"
      >
        <AutoInput
          :value="value"
          :model="model"
          :path="`${path ? path + '.' : ''}${name}`"
          :inline="inline"
          :edit="edit"
          :disabled="disabled"
          @update:value="$emit('update:value', $event)"
        />
      </div>
    </template>
  </div>
</template>
