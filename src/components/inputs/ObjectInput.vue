<script setup>
import objectPath from "object-path";
import uniqid from "uniqid";
import { clone } from "ramda";

import AutoInput from "./AutoInput.vue";
import BaseInput from "./BaseInput.vue";

defineProps(["schema"]);

const id = uniqid();

const setPropertyValue = (obj = {}, path, value) => {
  obj = clone(obj);
  objectPath.set(obj, path, value);
  return obj;
};
</script>

<template>
  <BaseInput v-slot="{ value, updateValue }">
    <div
      v-for="name in Object.keys(schema.properties)"
      class="pb-4 last:pb-0"
      :key="`${id}.${name}`"
    >
      <AutoInput
        :name="name"
        :schema="schema.properties[name]"
        :value="objectPath.get(value, name)"
        @updateValue="updateValue(setPropertyValue(value, name, $event))"
      />
    </div>
  </BaseInput>
</template>
