<script setup>
import { reactive } from "vue";
import { useApiStore } from "../../stores/api.js";
import { formatLabel } from "../../utils.js";
import AutoInput from "../inputs/AutoInput.vue";

const props = defineProps(["model", "mode"]);
const emit = defineEmits(["update:value"]);

const apiStore = useApiStore();

const form = reactive({});
const updateDataForm = (set) => set(form);

const saveForm = async () => {
  if (props.mode === "create") {
    const { data } = await apiStore.create(props.model, form);
    apiStore.pushNotice({
      type: "success",
      title: "Created",
      detail: "Document was created successfully",
    });
    emit("update:value", data);
  } else {
  }

  // clear form
  for (let key in form) delete form[key];
};
</script>

<template>
  <AutoInput
    class="mb-4 data-form"
    :value="form"
    :model="model"
    path=""
    :inline="false"
    :edit="true"
    :disabled="apiStore.isLoading"
    @update:value="updateDataForm"
  />

  <RButton variant="primary" class="mr-4" @click="saveForm">
    {{ formatLabel(mode) }}
  </RButton>
</template>
