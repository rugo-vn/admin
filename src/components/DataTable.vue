<script setup>
import { computed, inject, reactive, ref, watch } from 'vue';
import { MList, MListItem, MTable, MDropdown, MCheckbox, MButton, MDialog } from '../../lib';
import RelationValue from './values/RelationValue.vue';
import { formatValueWithSchema } from '../utils';

const props = defineProps(['data', 'schema']);
const emit = defineEmits(['create', 'remove', 'edit'])

const dialog = inject("mdialog");

// infomation
const fields = computed(() => {
  const result = [];
  for (let key in props.schema){
    if (key[0] === '_' && key[1] === '_')
      continue;

    if (props.schema[key].hidden)
      continue;

    if (props.schema[key].preview === false)
      continue;

    result.push(key);
  }

  return result;
});

// selected documents
const selected = reactive(new Set());

const isAnySelectAndNotAll = computed(() => selected.size > 0 && selected.size < props.data.length);
const isSelectAll = computed(() => selected.size === props.data.length);

const isSelect = doc => selected.has(doc);

const deselectAll = () => {
  for (let v of selected)
    selected.delete(v);
}

const toggleSelect = (doc, checked) => {
  if (checked)
    selected.add(doc);
  else
    selected.delete(doc);
}

const toggleSelectAll = checked => {
  if (checked){
    for (let v of props.data)
      selected.add(v);
  } else {
    deselectAll();
  }
}

// system
const currentDoc = ref([]);
const viewDialog = ref(null);

const reload = () => {
  deselectAll();
}

const view = (doc) => {
  currentDoc.value = [
    { key: 'Id', value: doc._id },
  ];

  for (let key in props.schema){
    if (key[0] === '_' && key[1] === '_')
      continue;

    if (['_id', 'createdAt', 'updatedAt'].indexOf(key) !== -1)
      continue;
    
    currentDoc.value.push({
      key,
      value: formatValueWithSchema(doc[key], props.schema[key])
    });
  }

  currentDoc.value.push({ key: 'Created At', value: (new Date(doc.createdAt)).toLocaleString('vi-VN') });
  currentDoc.value.push({ key: 'Updated At', value: (new Date(doc.updatedAt)).toLocaleString('vi-VN') });

  viewDialog.value.show();
}

const remove = async (docs) => {
  if (await dialog.show("confirm")) {
    emit('remove', docs);
  };
}

watch([
  () => props.data,
  () => props.schema
], reload);

</script>

<template>
  <div class="collection-data-table">
    <div class="toolbar mb-4">
      <MButton
        variant="primary"
        class="justify-center w-8 h-8 px-0 py-0 mr-2"
        @click="$emit('create')"
      >
        <ion-icon class="text-lg" icon="create" />
      </MButton>

      <MButton
        v-if="selected.size"
        variant="danger"
        class="justify-center w-8 h-8 px-0 py-0 mr-2"
        @click="remove(selected)"
      >
        <ion-icon class="text-lg" icon="trash" />
      </MButton>
    </div>

    <div class="wrapper select-none" v-dragscroll>
      <MTable
        :data="props.data"
        :labels="fields"
      >
        <template #beforerow="{row}">
          <MCheckbox
            v-if="row"
            :modelValue="isSelect(row)"
            @update:modelValue="toggleSelect(row, $event)"
          />

          <MCheckbox
            v-else-if="props.data.length"
            :indeterminate="isAnySelectAndNotAll"
            :modelValue="isSelectAll"
            @update:modelValue="toggleSelectAll($event)"
          />
        </template>

        <template #afterrow="{row}">
          <MDropdown v-if="row" variant="none" position="right" :autohide="true">
            <MList>
              <MListItem @click="view(row)">View</MListItem>
              <MListItem @click="$emit('edit', row)">Edit</MListItem>
              <MListItem class="text-red-500" @click="remove([row])">Delete</MListItem>
            </MList>
          </MDropdown>
        </template>

        <template #cell()="{value, label}">
          <RelationValue
            v-if="props.schema[label] && props.schema[label].type === 'relation'"
            :value="value"
            :schema="props.schema[label]"
          />
          <span v-else v-html="formatValueWithSchema(value, props.schema[label])"></span>
        </template>
      </MTable>
    </div>

    <div class="wrapper-margin"></div>

    <MDialog :label="false" ref="viewDialog">
      <MTable :data="currentDoc">
        <template #cell()="{ value }">
          <span v-html="value"></span>
        </template>
      </MTable>
    </MDialog>
  </div>
</template>

<style lang="scss">

.collection-data-table {
  .wrapper {
    overflow: auto;
    padding-bottom: 10em;
    -ms-overflow-style: none;
    scrollbar-width: none;

    table {
      table-layout: auto;

      th, td {
        min-width: 2em;
        min-height: 2em;
        white-space: pre-wrap;
      }

      th:first-child,
      td:first-child {
        width: 3em;
        min-width: 3em;
        
        div {
          display: flex;
          width: 100%;
          height: 100%;
          justify-content: center;
        }
      }

      th:last-child,
      td:last-child {
        width: 3em;
        min-width: 3em;
      }

      tr:hover {
        @apply bg-gray-50; 
      }
    }
  }

  .wrapper::-webkit-scrollbar {
    display: none;
  }

  .wrapper-margin {
    margin-top: -10em;
  }

  .toolbar {
    .m-button {

    }
  }

  .m-dialog {
    table {
      table-layout: auto;
      
      th:first-child,
      td:first-child {
        @apply capitalize;
      }
    }
  }
}
</style>