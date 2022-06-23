<script setup>
import { inject, onMounted, reactive, ref } from "vue";
import { MInput, MButton } from "../../../lib";
import { base64url } from "../../utils";
import FileExplorer from "../FileExplorer.vue";

const props = defineProps(['modelValue', 'schema', 'hideInput']);
const emit = defineEmits(['update:modelValue']);

const noti = inject('mnoti');
const model = inject('model');

// toggle expand
const isExpand = ref(false);

const toggleExpand = () => {
  isExpand.value = !isExpand.value;
}

// load data
const fs = reactive({
  data: [],
  parent: 'Lw'
});

const loadData = async () => {
  let result;
  try {
    result = await model(props.schema.ref).list({ parent: fs.parent });
  } catch(err) {
    return noti.push('danger', err.message);
  }
  
  fs.data = result.data;
}

const updateParent = newParent => {
  if (props.schema.root && base64url.decode(newParent).indexOf(props.schema.root) !== 0)
    return noti.push('warn', `Upload outside "${props.schema.root}" is prohibition!`);

  fs.parent = newParent;
  loadData();
}

const select = id => {
  if (!id){
    emit('update:modelValue', id);
    return isExpand.value = false;
  }

  let filePath = base64url.decode(id);

  if (props.schema.root && filePath.indexOf(props.schema.root) !== 0)
    return noti.push('warn', `Upload outside "${props.schema.root}" is prohibition!`);

  if (props.schema.root)
    filePath = filePath.replace(props.schema.root, '');

  emit('update:modelValue', filePath);
  isExpand.value = false;
}

const upload = async docs => {
  let result;

  try {
    result = await model(props.schema.ref).create(docs[0]);
  } catch(err) {
    return noti.push('danger', err.message);
  }

  noti.push('success', `Uploaded!`);
  await loadData();

  select(result._id);
}

onMounted(() => {
  if (props.schema.root){
    fs.parent = base64url.encode(props.schema.root + '/uploads/' + (new Date()).toISOString().split('T')[0].replace(/-/gm, '/'));
  }

  loadData();
});
</script>

<template>
  <div class="upload-input relative">
    <MInput
      v-if="!hideInput"
      class="upload-input-value my-0 cursor-pointer mx-[-1px] my-[-1px]"
      :disabled="true"
      :modelValue="modelValue"
      @click="toggleExpand"
    />

    <button
      class="border-2 border-warn-500 text-warn-500 rounded-full w-6 h-6 opacity-50 inline-flex items-center justify-center absolute right-2.5 top-2.5
      hover:opacity-100"
      v-if="!hideInput && modelValue && !schema.required && !schema.default"
      @click="select(null)"
    >
      <ion-icon class="text-lg" name="close" />
    </button>

    <FileExplorer
      class="mx-3 mb-[-1px] mt-4"
      v-if="isExpand || hideInput"
      mode="select"
      accept="image/*"
      :home="schema.ref"
      :data="fs.data"
      :parent="fs.parent"
      @update:parent="updateParent"
      @upload="upload"
      @select="doc => select(doc._id)"
    />
  </div>
</template>

<style lang="scss">
.upload-input {
  @apply relative border rounded-lg;
  
  .upload-input-value:after {
    content: 'Browse';
    
    @apply w-20 border rounded-l-lg h-full top-0 left-0 absolute px-3 inline-flex items-center text-gray-600;
  }

  .upload-input-value input {
    @apply pl-[5.5rem] pr-12;
  }
}
</style>