<script setup>
import { inject, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { formatName } from '../../../utils';
import { MPanel } from '../../../../lib';
import { useInfoStore } from '../../../stores/info';
import FileExplorer from '../../../components/FileExplorer.vue';

const route = useRoute();
const model = inject('model');
const noti = inject('mnoti');
const collectionName = ref(route.params.collectionName);
const infoStore = useInfoStore();

// load data
const fs = reactive({
  data: [],
  schema: {},
  parent: 'Lw'
});

const loadData = async () => {
  let result;
  try {
    result = await model(collectionName.value).list({ parent: fs.parent });
  } catch(err) {
    return noti.push('danger', err.message);
  }
  
  fs.data = result.data;
  
  for (let schema of infoStore.info)
    if (schema.__name === collectionName.value)
      fs.schema = schema;
}

watch(
  () => route.params.collectionName,
  async name => {
    if (route.name !== 'FsCollection')
      return;

    collectionName.value = name;
    await loadData();
  }
);

// data handle
const handleCreate = async (doc) => {
  try {
    await model(collectionName.value).create(doc);
  } catch(err) {
    return noti.push('danger', err.message);
  }

  noti.push('success', `${doc.name} is created!`)
  await loadData();
}

const handleRemove = async docs => {
  let counter = 0;

  for (let doc of docs) {
    try {
      await model(collectionName.value).remove(doc._id);
    } catch(err) {
      noti.push('danger', err.message);
      continue;
    }

    counter++;
  }

  if (counter)
    noti.push('success', `Removed ${counter} item(s)!`);
    
  await loadData();
}

const handleUpload = async docs => {
  let counter = 0;

  for (let doc of docs){
    try {
      await model(collectionName.value).create(doc);
    } catch(err) {
      noti.push('danger', err.message);
      continue;
    }

    counter++;
  }

  if (counter)
    noti.push('success', `Uploaded ${counter} file(s)!`);

  await loadData();
}

// start
loadData();
</script>

<template>
  <h1 class="text-3xl mt-4 font-semibold">{{ formatName(collectionName) }}</h1>

  <MPanel>
    <FileExplorer
      :data="fs.data"
      :parent="fs.parent"
      @create="handleCreate"
      @remove="handleRemove"
      @update:parent="id => { fs.parent = id; loadData(); }"
      @upload="handleUpload"
    />
  </MPanel>
</template>