<script setup>
import { MInput } from "@rugo-vn/vue";

defineProps(["label", "modelValue", "schema"]);
defineEmits(["update:modelValue"]);
</script>

<template>
  <MInput
    type="password"
    class="my-0"
    @update:modelValue="(event) => $emit('update:modelValue', event)"
  />
</template>
