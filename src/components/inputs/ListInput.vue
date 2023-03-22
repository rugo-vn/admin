<script setup>
import { clone } from "ramda";
import uniqid from "uniqid";
import { ref } from "vue";

import ComplexValue from "../values/ComplexValue.vue";
import EmptyValue from "../values/EmptyValue.vue";
import AutoInput from "./AutoInput.vue";
import BaseInput from "./BaseInput.vue";

defineProps(["schema"]);

const id = uniqid();

const isCreate = ref(false);

const removeItem = (value, index) => {
  if (index >= value.length) {
    isCreate.value = false;
    return value;
  }

  const nextValue = clone(value);
  nextValue.splice(index, 1);

  return nextValue;
};

const localUpdateValue = (fn, lastValue, index, newItem) => {
  lastValue = clone(lastValue || []);

  if (index >= lastValue.length) {
    lastValue.push(newItem);
    isCreate.value = false;
  } else {
    lastValue[index] = newItem;
  }

  fn(lastValue);
};
</script>

<template>
  <BaseInput>
    <template #inlineValue>
      <ComplexValue />
    </template>

    <template v-slot="{ value, updateValue }">
      <div class="list-input">
        <template v-if="isCreate || (value && value.length !== 0)">
          <div
            v-for="(_, index) in [
              ...(value || []),
              ...(isCreate ? [null] : []),
            ]"
            :key="`${id}.${index}`"
            class="list-input-values ml-2.5 mt-2 pl-4 border-l relative last:pb-0"
          >
            <RButton
              class="absolute left-[-.7rem] w-[1.4rem] h-[1.3rem] px-0 py-0 rounded text-xs text-center justify-center"
              variant="danger"
              @click="updateValue(removeItem(value, index))"
            >
              <TrashIcon />
            </RButton>
            <div>
              <AutoInput
                class="list-input-value"
                :schema="schema.items"
                :value="(value || [])[index]"
                @updateValue="
                  localUpdateValue(updateValue, value, index, $event)
                "
              />
            </div>
          </div>
        </template>

        <div class="mt-2 flex items-center" v-if="!isCreate">
          <EmptyValue v-if="!value || value.length === 0" class="mr-2" />

          <RButton
            class="px-1 py-1"
            variant="primary rounded"
            @click="isCreate = true"
          >
            <AddIcon />
          </RButton>
        </div>
      </div>
    </template>
  </BaseInput>
</template>

<style lang="scss">
.list-input-value > label:first-of-type {
  display: none;
}
</style>
