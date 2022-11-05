<script setup>
import objectPath from "object-path";
import { ref, watch } from "vue";
import AddIcon from "@rugo-vn/vue/dist/ionicons/AddIcon.vue";
import TrashIcon from "@rugo-vn/vue/dist/ionicons/TrashIcon.vue";

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

const localValue = ref([]);
const localSchema = ref({});

const localLabel = ref("");

const syncValue = () => {
  localValue.value = objectPath.get(props.value, props.path) || [];
  localSchema.value = schemaStore.getSchema(props.model, props.path);

  localLabel.value = props.path.split(".").slice(-1)[0];
};

const addItem = () => {
  emit("update:value", (o) => objectPath.push(o, props.path, null));
};

const removeItem = (index) => {
  emit("update:value", (o) => objectPath.del(o, `${props.path}.${index}`));
};

watch(() => [props.value, props.path, props.model], syncValue, { deep: true });

syncValue();
</script>

<template>
  <div class="list-input">
    <div
      class="list-input-label flex justify-between mb-2 items-center"
      v-if="!inline"
    >
      <label v-if="localLabel" class="uppercase mb-0">{{
        formatLabel(localLabel)
      }}</label>
      <RButton
        v-if="edit"
        class="px-1 py-1"
        variant="primary rounded"
        @click="addItem"
      >
        <AddIcon />
      </RButton>
    </div>

    <div
      v-if="localValue.length === 0"
      class="border p-1 rounded text-center italic text-gray-500"
    >
      Empty
    </div>

    <template v-if="inline">
      <span class="bg-secondary-400 text-white px-2 py-1 rounded text-xs"
        >Complex</span
      >
    </template>

    <template v-else>
      <div
        v-for="(_, index) in localValue"
        :key="index"
        class="list-input-values pb-4 pl-4 border-l relative last:pb-0"
      >
        <RButton
          v-if="edit"
          class="absolute left-[-.7rem] w-[1.4rem] h-[1.3rem] px-0 py-0 rounded text-xs text-center justify-center"
          variant="danger"
          @click="removeItem(index)"
        >
          <TrashIcon />
        </RButton>
        <div>
          <AutoInput
            class="list-input-value"
            :value="value"
            :model="model"
            :path="`${path ? path + '.' : ''}${index}`"
            :inline="inline"
            :edit="edit"
            :disabled="disabled"
            @update:value="$emit('update:value', $event)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.list-input-value > label:first-of-type {
  display: none;
}
</style>
