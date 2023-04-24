<script setup>
defineProps(["label", "options", "modelValue"]);
defineEmits(["update:modelValue"]);
</script>

<template>
  <div>
    <RDropdown :label="false" class="w-full">
      <template #open="{ click }">
        <RInput
          :label="label"
          class="my-0"
          :modelValue="modelValue"
          @click="click"
          readonly
        />
      </template>

      <template #default="{ click }">
        <RButton
          class="w-full"
          variant="none"
          v-for="opt in options"
          :key="opt"
          @click="
            $emit('update:modelValue', opt);
            click();
          "
          >{{ opt }}</RButton
        >
      </template>
    </RDropdown>
  </div>
</template>
