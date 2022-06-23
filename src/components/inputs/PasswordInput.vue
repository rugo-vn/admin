<script setup>
import { MInput } from "../../../lib";

defineProps(['label', 'modelValue', 'schema']);
defineEmits(['update:modelValue']);
</script>

<template> 
  <MInput
    type="password"
    class="my-0"
    @update:modelValue="event => $emit('update:modelValue', event)"
  />
</template>