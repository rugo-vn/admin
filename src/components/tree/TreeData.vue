<script setup>
import { ref, watch } from "vue";
import { join, basename } from "path-browserify";

import CloudUploadIcon from "@rugo-vn/vue/dist/ionicons/CloudUploadIcon.vue";
import TrashIcon from "@rugo-vn/vue/dist/ionicons/TrashIcon.vue";
import FolderOpenIcon from "@rugo-vn/vue/dist/ionicons/FolderOpenIcon.vue";
import CutIcon from "@rugo-vn/vue/dist/ionicons/CutIcon.vue";
import ClipboardIcon from "@rugo-vn/vue/dist/ionicons/ClipboardIcon.vue";
import DocumentIcon from "@rugo-vn/vue/dist/ionicons/DocumentIcon.vue";

import { useApiStore } from "../../stores/api";
import FileExplorer from "./FileExplorer.vue";
import { useSelectionStore } from "../../stores/selection";
import UploadForm from "./UploadForm.vue";
import FileForm from "./FileForm.vue";

const props = defineProps(["driveName"]);

const apiStore = useApiStore();
const selectionStore = useSelectionStore();

const uploadForm = ref(null);
const fileExplorer = ref(null);
const parent = ref("/");
const moveList = ref([]);
const currentFilePath = ref(undefined);

const removeSelected = async () => {
  if (
    !window.confirm(
      `You you want to remove ${selectionStore.selected.length} item(s)?`
    )
  )
    return;

  let no = 0;
  for (let entryPath of selectionStore.selected) {
    try {
      await apiStore.drive.remove(props.driveName, entryPath);
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

const selectToMove = () => {
  moveList.value = [...selectionStore.selected];
  selectionStore.clear();

  apiStore.http.pushNotice({
    type: "success",
    title: "Ready to move",
    detail: `You have ${moveList.value.length} item(s) are ready to move.`,
  });
};

const moveHere = async () => {
  let count = 0;

  for (const entryPath of moveList.value) {
    try {
      await apiStore.drive.move(
        props.driveName,
        entryPath,
        join(parent.value, basename(entryPath))
      );
    } catch (_) {
      // pass
    }
  }

  apiStore.http.pushNotice({
    type: "success",
    title: "Moved",
    detail: `Moved ${count}/${moveList.value.length} item(s).`,
  });

  moveList.value = [];
  syncValue();
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

    <FileForm
      v-if="currentFilePath !== undefined"
      :path="currentFilePath"
      :model="driveName"
      :parent="parent"
      @close="
        currentFilePath = undefined;
        $event && syncValue();
      "
    />

    <div class="toolbar mb-4">
      <RButton
        variant="primary"
        class="justify-center w-8 h-8 px-0 py-0 mr-2"
        @click="currentFilePath = null"
      >
        <DocumentIcon class="text-lg" />
      </RButton>

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
        variant="primary"
        class="justify-center w-8 h-8 px-0 py-0 mr-2"
        v-if="selectionStore.selected.length"
        @click="selectToMove"
      >
        <CutIcon class="text-lg" />
      </RButton>

      <RButton
        variant="primary"
        class="justify-center h-8 px-2 py-0 mr-2"
        v-if="moveList.length"
        @click="moveHere"
      >
        <ClipboardIcon class="text-lg" />
        <div
          class="bg-primary-600 px-2 ml-2 rounded pt-[.25rem] items-center inline-flex font-semibold text-xs"
        >
          {{ moveList.length }}
        </div>
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
      @edit="currentFilePath = $event"
    />
  </div>
</template>
