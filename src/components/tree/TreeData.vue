<script setup>
import { ref, watch } from "vue";
import { join } from 'path-browserify';

import CloudUploadIcon from "@rugo-vn/vue/dist/ionicons/CloudUploadIcon.vue";
import TrashIcon from "@rugo-vn/vue/dist/ionicons/TrashIcon.vue";
import FolderOpenIcon from "@rugo-vn/vue/dist/ionicons/FolderOpenIcon.vue";

import RDialog from "../RDialog.vue";

import { DIRECTORY_MIME } from "../../constants.js";
import { FsId } from "../../utils.js";
import { useApiStore } from "../../stores/api";
import FileExplorer from "./FileExplorer.vue";
import { useSelectionStore } from "../../stores/selection";
import UploadForm from "./UploadForm.vue";

const props = defineProps(["driveName"]);

const apiStore = useApiStore();
const selectionStore = useSelectionStore();

const uploadForm = ref(null);
const fileExplorer = ref(null);
const parent = ref("/");

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
      await apiStore.remove(props.driveName, id);
      no++;
    } catch (err) {
      console.error(err);
    }
  }

  if (no !== selectionStore.selected.length) {
    apiStore.pushNotice({
      type: "danger",
      title: "Not removed",
      detail: `Cannot remove ${selectionStore.selected.length - no} item(s).`,
    });
  }

  if (no) {
    apiStore.pushNotice({
      type: "success",
      title: "Removed",
      detail: `Removed ${no} item(s).`,
    });
    fileExplorer.value.sync();
  }
};

const createDirectory = async () => {
  const name = window.prompt("Enter folder name", "New Folder");

  if (!name) return;

  await apiStore.drive.create(props.driveName, {
    path: join(parent.value, name),
    isDir: true,
  });

  apiStore.http.pushNotice({
    type: "success",
    title: "Created",
    detail: `Folder ${name} was created.`,
  });

  fileExplorer.value.sync();
};

const updateUploadForm = () => {
  uploadForm.value.hide();
  fileExplorer.value.sync();
};

const syncValue = async () => {
  if (fileExplorer.value) {
    fileExplorer.value.sync();
  }
};
watch(() => props.driveName, syncValue);
syncValue();
</script>

<template>
  <div class="tree-data">
    <RDialog :label="false" ref="uploadForm">
      <UploadForm
        class="text-base h-32"
        :model="driveName"
        :parent="parent"
        @update:value="updateUploadForm"
      />
    </RDialog>

    <div class="toolbar mb-4">
      <RButton
        variant="primary"
        class="justify-center w-8 h-8 px-0 py-0 mr-2"
        @click="uploadForm.show()"
      >
        <CloudUploadIcon class="text-lg" />
      </RButton>

      <RButton
        variant="primary"
        class="justify-center w-8 h-8 px-0 py-0 mr-2"
        @click="createDirectory"
      >
        <FolderOpenIcon class="text-lg" />
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

    <FileExplorer
      ref="fileExplorer"
      :driveName="driveName"
      @update:parent="parent = $event"
    />
  </div>
</template>
