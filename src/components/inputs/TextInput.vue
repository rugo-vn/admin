<script setup>
import BaseInput from "./BaseInput.vue";
import { createDelayCall } from "../../utils";

const delayCall = createDelayCall();
</script>

<template>
  <BaseInput v-slot="{ value, updateValue }">
    <RInput
      class="my-0"
      :modelValue="value"
      @update:modelValue="($event) => delayCall(updateValue, false, $event)"
      @blur="delayCall(updateValue, true)"
    />
  </BaseInput>
</template>
