<script setup>
import BaseInput from "./BaseInput.vue";
</script>

<template>
  <BaseInput v-slot="{ value, updateValue }">
    <RInput
      class="my-0"
      type="number"
      :modelValue="value"
      @update:modelValue="updateValue"
    />
  </BaseInput>
</template>
