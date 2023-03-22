<script setup>
import { clone, equals } from "ramda";
import { ref, watch } from "vue";
import { useApiStore } from "../../stores/api.js";
import { useSchemaStore } from "../../stores/schema";
import { formatLabel } from "../../utils";
import AutoInput from "../inputs/AutoInput.vue";
import IdValue from "../values/IdValue.vue";

const props = defineProps(["tableName", "mode", "id"]);
const emit = defineEmits(["update:value"]);

const apiStore = useApiStore();
const schemaStore = useSchemaStore();

const form = ref({});
const isChangable = ref(false);

const clearForm = () => {
  form.value = {};
};

const saveForm = async () => {
  if (props.mode === "create") {
    const { data } = await apiStore.table.create(props.tableName, form.value);
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
      form.value
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
    form.value = clone(data);
  }
};

const updateValue = (newValue) => {
  if (equals(newValue, form.value)) return;

  form.value = clone(newValue);
  isChangable.value = true;
};

watch(() => [props.tableName, props.id], syncValue);

syncValue();
</script>

<template>
  <div v-if="tableName">
    <div class="flex justify-between mb-4 items-center">
      <RHeading type="h2" class="mb-0">
        {{ formatLabel(mode, true) + (mode === "create" ? " a" : " the") }}
        document
      </RHeading>
      <IdValue v-if="id" :value="id" />
    </div>

    <AutoInput
      :schema="schemaStore.getSchema(tableName)"
      :value="form"
      @updateValue="updateValue"
    />

    <RButton
      v-if="mode !== 'view'"
      variant="primary"
      class="mr-4 mt-4"
      @click="saveForm"
    >
      {{ mode === "create" ? "Create" : "Save" }}
    </RButton>
  </div>
</template>

<style></style>
