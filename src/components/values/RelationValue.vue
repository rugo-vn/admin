<script setup>
import { formatValueWithSchema } from '../../utils';
import { useRelationStore } from '../../stores/relation';
import { computed, inject } from 'vue';

const CACHE_DURATION = 10000; // 10 seconds

const props = defineProps(['value', 'schema']);
const relationStore = useRelationStore();

const noti = inject('mnoti');
const model = inject('model');

const refName = props.schema.ref;
const currentRelation = relationStore.relations[refName];

const loadData = async () => {
  let result;
  try {
    result = await model(props.schema.ref).list({ $limit: -1 });
  } catch(err) {
    return noti.push('danger', err.message);
  }
  
  relationStore.update(refName, result.data);
}

if (props.value && (!currentRelation || Date.now() - currentRelation.updatedAt > CACHE_DURATION)) {
  relationStore.update(refName, []);
  
  loadData();
}

const localValue = computed(() => {
  if (!relationStore.relations[refName])
    return;

  for(let item of relationStore.relations[refName].data){
    if (item._id === props.value)
      return item[props.schema.str];
  }
});

</script>
<template>
  <span v-html="formatValueWithSchema(localValue || value, schema)"></span>
</template>