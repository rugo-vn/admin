<script setup>
import { reactive, watch } from "vue";
import { useApiStore } from "../../stores/api.js";
import { formatLabel } from "../../utils.js";
import AutoInput from "../inputs/AutoInput.vue";

const props = defineProps(["tableName", "mode", "id"]);
const emit = defineEmits(["update:value"]);

const apiStore = useApiStore();

const form = reactive({});
const updateDataForm = (set) => set(form);

const clearForm = () => {
  for (let key in form) delete form[key];
};

const saveForm = async () => {
  if (props.mode === "create") {
    const { data } = await apiStore.table.create(props.tableName, form);
    apiStore.http.pushNotice({
      type: "success",
      title: "Created",
      detail: "Document was created successfully",
    });
    emit("update:value", data);
  }

  if (props.mode === "edit" && props.id) {
    const { data } = await apiStore.table.update(
      props.tableName,
      props.id,
      form
    );
    apiStore.http.pushNotice({
      type: "success",
      title: "Updated",
      detail: "Document was updated successfully",
    });
    emit("update:value", data);
  }

  clearForm();
};

const syncValue = async () => {
  if (props.id) {
    clearForm();
    const data = await apiStore.table.get(props.tableName, props.id);
    for (let key in data) {
      form[key] = data[key];
    }
  }
};

watch(() => [props.tableName, props.id], syncValue);

syncValue();
</script>

<template>
  <AutoInput
    class="mb-4 data-form"
    :value="form"
    :model="tableName"
    path=""
    :inline="false"
    :edit="mode === 'view' ? false : true"
    :disabled="apiStore.http.isLoading"
    @update:value="updateDataForm"
  />

  <RButton
    v-if="mode !== 'view'"
    variant="primary"
    class="mr-4"
    @click="saveForm"
  >
    {{ mode === "create" ? "Create" : "Save" }}
  </RButton>
</template>
