<script setup>
import { ref, watch } from "vue";

import CreateIcon from "@rugo-vn/vue/dist/ionicons/CreateIcon.vue";
import TrashIcon from "@rugo-vn/vue/dist/ionicons/TrashIcon.vue";

import { useApiStore } from "../../stores/api";

import DataExplorer from "./DataExplorer.vue";
import RDialog from "../RDialog.vue";
import DataForm from "./DataForm.vue";
import { useSelectionStore } from "../../stores/selection.js";

const props = defineProps(["tableName", "open"]);

const apiStore = useApiStore();
const selectionStore = useSelectionStore();

const dataForm = ref(null);
const dataExplorer = ref(null);

const updateDataForm = () => {
  dataForm.value.hide();
  dataExplorer.value.sync();
};

const removeSelected = async () => {
  if (
    !window.confirm(
      `You you want to remove ${selectionStore.selected.length} item(s)?`
    )
  )
    return;

  let no = 0;
  for (let id of selectionStore.selected) {
    try {
      await apiStore.table.remove(props.tableName, id);
      no++;
    } catch (err) {
      console.error(err);
    }
  }

  if (no !== selectionStore.selected.length) {
    apiStore.http.pushNotice({
      type: "danger",
      title: "Not removed",
      detail: `Cannot remove ${selectionStore.selected.length - no} item(s).`,
    });
  }

  if (no) {
    apiStore.http.pushNotice({
      type: "success",
      title: "Removed",
      detail: `Removed ${no} item(s).`,
    });

    dataExplorer.value.sync();
  }
};

// const syncValue = async () => {
//   if (dataExplorer.value) {
//     dataExplorer.value.sync();
//   }
// };
// watch(() => props.tableName, syncValue);
// syncValue();
</script>

<template>
  <div class="table-data">
    <RDialog :label="false" ref="dataForm">
      <DataForm
        mode="create"
        :tableName="tableName"
        @update:value="updateDataForm"
      />
    </RDialog>

    <div class="toolbar mb-4">
      <RButton
        variant="primary"
        class="justify-center w-8 h-8 px-0 py-0 mr-2"
        @click="dataForm.show()"
      >
        <CreateIcon class="text-lg" />
      </RButton>

      <RButton
        variant="danger"
        class="justify-center w-8 h-8 px-0 py-0 mr-2"
        v-if="selectionStore.selected.length"
        @click="removeSelected"
      >
        <TrashIcon class="text-lg" />
      </RButton>
    </div>

    <DataExplorer ref="dataExplorer" :tableName="tableName" :open="open" />
  </div>
</template>

<style lang="scss">
.table-data {
  .m-content-dialog {
    .data-form {
      margin-left: calc(-1rem - 1px);
    }

    .data-form > div {
      border: none;
    }
  }
}
</style>
