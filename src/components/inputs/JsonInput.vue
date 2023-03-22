<script setup>
import BaseInput from "./BaseInput.vue";
import JsonEditor from "../JsonEditor.vue";
</script>

<template>
  <BaseInput>
    <template v-slot="{ value, updateValue }">
      <div class="relative">
        <JsonEditor
          :value="value"
          @update:value="updateValue($event || undefined)"
        />
      </div>
    </template>
  </BaseInput>
</template>
