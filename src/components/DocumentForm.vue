<script setup>
import uniqid from "uniqid";
import { reactive, ref, watch } from 'vue';
import { formatName } from '../utils';
import { MButton } from "../../lib";
import * as Inputs from './inputs/index.js';

const props = defineProps(['schema', 'isCreate', 'doc']);
defineEmits(['save', 'cancel', 'change']);

const fields = reactive([]);
const form = reactive({});

const reload = () => {
  while (fields.length)
    fields.pop();

  for (let key in props.schema){
    if (key[0] === '_' && key[1] === '_')
      continue;

    if (props.schema[key].hidden)
      continue;

    fields.push({
      key: uniqid(),
      name: key,
      schema: props.schema[key]
    });

    form[key] = props.doc ? props.doc[key] : null;
  }
}

const getView = field => {
  const type = field.schema.type;
  const viewName = type[0].toUpperCase() + type.substring(1).toLowerCase() + 'Input';
  
  if (Inputs[viewName])
    return Inputs[viewName];

  return null;
}

watch([
  () => props.schema,
  () => props.doc
], reload);

reload();
</script>

<template>
  <h2 class="text-xl" v-if="props.schema.__name">{{ props.isCreate ? 'Create a new' : 'Edit an existed'}} {{ formatName(props.schema.__name).toLowerCase() }}</h2>

  <div v-for="field in fields" :key="field.key">
    <label class="block mb-2 mt-4 text-gray-600 capitalize">{{field.name}}</label>

    <component
      :is="getView(field)"
      :schema="field.schema"
      v-model="form[field.name]"
      @update:modelValue="$emit('change')"
    />
  </div>

  <div class="flex justify-end space-x-2 mt-4">
    <MButton variant="primary" @click="$emit('save', form)">Save</MButton>
    <MButton @click="$emit('cancel')">Cancel</MButton>
  </div>
</template>