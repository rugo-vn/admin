<script setup>
import { inject, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { formatName } from '../../../utils';
import { MPanel, MDialog, MPagination } from '../../../../lib';
import { useInfoStore } from '../../../stores/info';
import DataTable from '../../../components/DataTable.vue';
import DocumentForm from '../../../components/DocumentForm.vue';

const route = useRoute();
const model = inject('model');
const noti = inject('mnoti');
const collectionName = ref(route.params.collectionName);
const infoStore = useInfoStore();

const isAnyChanged = ref(false);
const dialog = inject("mdialog");

// load data
const table = reactive({
  data: [],
  total: 0,
  skip: 0,
  limit: 10,
  schema: {}
});

const loadData = async () => {
  let result;
  try {
    result = await model(collectionName.value).list({ $sort: { createdAt: -1 }, $skip: table.skip });
  } catch(err) {
    return noti.push('danger', err.message);
  }
  
  table.data = result.data;
  table.total = result.total;
  table.skip = result.skip;
  table.limit = result.limit;
  
  for (let schema of infoStore.info)
    if (schema.__name === collectionName.value)
      table.schema = schema;
}

const updateSkip = skip => {
  table.skip = skip;
  loadData();
}

watch(
  () => route.params.collectionName,
  async name => {
    if (route.name.indexOf('TableCollection') === -1)
      return;

    collectionName.value = name;
    await loadData();
  }
);

// handle document
const documentDialog = ref(null);
const isCreate = ref(true);
const currentDoc = ref(null);

const handleSave = async doc => {
  let result;

  if (isCreate.value){
    try {
      result = await model(collectionName.value).create(doc);
    } catch(err) {
      return noti.push('danger', err.message);
    }

    noti.push('success', 'Document is created!')
  } else {
    try {
      result = await model(collectionName.value).patch(currentDoc.value._id, doc);
    } catch(err) {
      return noti.push('danger', err.message);
    }

    noti.push('success', 'Document is updated!')
  }

  documentDialog.value.hide();
  await loadData();
}

const handleRemove = async docs => {
  let counter = 0;

  for (let doc of docs){
    try {
      await model(collectionName.value).remove(doc._id);
    } catch(err) {
      noti.push('danger', err.message);
      continue;
    }

    counter++;
  }

  if (counter)
    noti.push('success', `Removed ${counter} document(s)!`);

  await loadData();
}

const handleCancel = async () => {
  if (isAnyChanged.value && !await dialog.show('confirm'))
    return;

  documentDialog.value.hide();
}

// start
loadData();
</script>

<template>
  <h1 class="text-3xl mt-4 font-semibold">{{ formatName(collectionName) }}</h1>

  <MPanel>
    <MDialog
      ref="documentDialog"
      :label="false"
      :disableHotKey="true"
      :disableDefaultClose="true"
      @close="handleCancel"
    >
      <DocumentForm
        :schema="table.schema"
        :doc="currentDoc"
        :isCreate="isCreate"
        @save="handleSave"
        @cancel="handleCancel"
        @change="isAnyChanged = true"
      />
    </MDialog>

    <DataTable
      :data="table.data"
      :schema="table.schema"
      @create="() => { isCreate = true; isAnyChanged = false; currentDoc = null; documentDialog.show(); }"
      @edit="doc => { isCreate = false; isAnyChanged = false; currentDoc = doc; documentDialog.show(); }"
      @remove="handleRemove"
    />

    <MPagination
      v-if="table.data.length"
      class="mt-4 justify-end"
      :total="table.total"
      :limit="table.limit"
      :modelValue="table.skip"
      @update:modelValue="updateSkip"
    />

    <div v-if="table.data.length === 0" class="text-center bg-gray-50 italic py-2 px-4 text-gray-400">
      The collection is empty.
    </div>
  </MPanel>
</template>