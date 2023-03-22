<script setup>
import { ref } from "vue";
import { DEFAULT_ID_FIELD } from "../../constants";
import { useApiStore } from "../../stores/api";
import { useSchemaStore } from "../../stores/schema";

const props = defineProps(["item", "lookup", "value", "schema"]);

const apiStore = useApiStore();
const schemaStore = useSchemaStore();

const localItem = ref(props.item);
const localLookup = ref(props.lookup || DEFAULT_ID_FIELD);

const syncValue = async () => {
  if (localItem.value) return;

  if (!props.value) return;

  if (!props.schema?.ref) {
    localItem.value = { id: props.value };
    localLookup.value = DEFAULT_ID_FIELD;
    return;
  }

  const refSchema = schemaStore.getSchema(props.schema.ref);

  if (!refSchema) return;

  const item = await apiStore.table.get(refSchema.name, props.value);

  if (!item) {
    localItem.value = { id: props.value };
    return;
  }

  if (props.schema.lookup) localLookup.value = props.schema.lookup;

  if (!item[localLookup.value]) localLookup.value = DEFAULT_ID_FIELD;

  localItem.value = item;
};

syncValue();
</script>

<template>
  <div v-if="localItem">
    <span v-if="localLookup === 'id'" class="text-xs font-mono">
      Id: {{ localItem[localLookup] }}
    </span>
    <span v-else>{{ localItem[localLookup] }}</span>
  </div>
</template>
