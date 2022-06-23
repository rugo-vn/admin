<script setup>
import TextInput from './TextInput.vue';

defineProps(['modelValue', 'schema']);
defineEmits(['update:modelValue']);

</script>

<template>
  <TextInput
    :schema="{ editor: 'code' }"
    :modelValue="modelValue ? JSON.stringify(modelValue, 0, 2) : null"
    @update:modelValue="$emit('update:modelValue', $event)"
  />
</template>