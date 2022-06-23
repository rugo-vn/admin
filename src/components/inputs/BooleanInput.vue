<script setup>
import { MCheckbox } from "../../../lib";

defineProps(['modelValue', 'schema']);
defineEmits(['update:modelValue']);

</script>

<template>
  <MCheckbox
    :modelValue="!!modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
  />
</template>