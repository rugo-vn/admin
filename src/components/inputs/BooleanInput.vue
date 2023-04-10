<script setup>
import BaseInput from "./BaseInput.vue";
</script>

<template>
  <BaseInput v-slot="{ value, updateValue }">
    <RCheckbox
      class="my-0"
      variant="primary"
      :modelValue="value"
      @update:modelValue="updateValue"
    />
  </BaseInput>
</template>
