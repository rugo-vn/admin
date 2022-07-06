<script setup>
import { formatValueWithSchema } from "../../utils";
import { useRelationStore } from "../../stores/relation";
import { computed, inject } from "vue";

const CACHE_DURATION = 10000; // 10 seconds

const props = defineProps(["value", "schema"]);
const relationStore = useRelationStore();

const noti = inject("mnoti");
const model = inject("model");

const currentRelation = relationStore.relations[props.schema.ref];

const loadData = async () => {
  let result;
  try {
    result = await model(props.schema.ref).list({ $limit: -1 });
  } catch (err) {
    return noti.push("danger", err.message);
  }

  relationStore.update(props.schema.ref, result.data);
};

if (
  props.value &&
  (!currentRelation || Date.now() - currentRelation.updatedAt > CACHE_DURATION)
) {
  relationStore.update(props.schema.ref, []);

  loadData();
}

const localValue = computed(() => {
  if (!relationStore.relations[props.schema.ref]) return null;

  for (let item of relationStore.relations[props.schema.ref].data) {
    if (item._id === props.value) return item[props.schema.str];
  }

  return null;
});
</script>
<template>
  <span v-html="formatValueWithSchema(localValue || value, schema)"></span>
</template>
