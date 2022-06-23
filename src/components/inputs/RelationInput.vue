<script setup>
import { inject, onMounted, reactive, ref, watch } from "vue";
import { MDropdown, MList, MListItem, MInput } from "../../../lib";

const props = defineProps(['modelValue', 'schema']);
const emit = defineEmits(['update:modelValue']);

const noti = inject('mnoti');
const model = inject('model');

// load data
const relation = reactive({
  data: []
});

const localValue = ref(null);

const syncLocalValue = () => {
  for(let item of relation.data)
    if (item._id === props.modelValue)
      return localValue.value = item[props.schema.str];

  localValue.value = null;
}

const loadData = async () => {
  let result;
  try {
    result = await model(props.schema.ref).list({ $limit: -1 });
  } catch(err) {
    return noti.push('danger', err.message);
  }
  
  relation.data = result.data;
  syncLocalValue();
}

onMounted(() => {
  loadData();
});

// data manipulation
const validate = () => {
  for (let item of relation.data)
    if (item[props.schema.str] === localValue.value)
      return emit('update:modelValue', item._id);

  emit('update:modelValue', null);
  localValue.value = null;
}

watch(() => props.modelValue, syncLocalValue);

</script>

<template>
  <MDropdown
    class="w-[100%!important] block"
    position="left"
    :autohide="true"
  >
    <template #open="{click}">
      <div class="relative">
        <MInput
          class="my-0"
          @focus="click"
          @blur="validate"
          v-model="localValue"
        />

        <button
          class="border-2 border-warn-500 text-warn-500 rounded-full w-6 h-6 opacity-50 inline-flex items-center justify-center absolute right-2.5 top-2.5
          hover:opacity-100"
          v-if="localValue && !schema.required && !schema.default"
          @click="emit('update:modelValue', null)"
        >
          <ion-icon class="text-lg" name="close" />
        </button>
      </div>
    </template>

    <MList class="w-[100%!important]">
      <MListItem
        v-for="item in relation.data"
        :key="item._id"
        @click="$emit('update:modelValue', item._id)"
      >
        {{ item[schema.str] }}
      </MListItem>
    </MList>
  </MDropdown>
</template>