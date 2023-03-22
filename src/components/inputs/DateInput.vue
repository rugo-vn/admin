<script setup>
import { DatePicker } from "v-calendar";
import BaseInput from "./BaseInput.vue";
</script>

<template>
  <BaseInput>
    <template #inlineValue="{ value }">
      <pre class="text-xs">{{
        new Date(value).toString().split("GMT").join("\nGMT")
      }}</pre>
    </template>
    <template v-slot="{ value, updateValue }">
      <DatePicker
        mode="dateTime"
        is24hr
        :modelValue="value"
        :time-accuracy="4"
        @update:modelValue="updateValue"
      />
    </template>
  </BaseInput>
</template>
