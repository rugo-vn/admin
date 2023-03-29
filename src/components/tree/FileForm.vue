<script setup>
import { ref, nextTick, computed } from "vue";
import { join, parse } from "path-browserify";
import CodeEditor from "../CodeEditor.vue";
import { formatLabel } from "../../utils";
import { useApiStore } from "../../stores/api";

const props = defineProps(["path", "parent", "model"]);
const emit = defineEmits(["close"]);

const apiStore = useApiStore();

const dialogRef = ref(null);
const form = ref({});

const syncData = async () => {
  nextTick(() => {
    dialogRef.value.show();
  });

  if (!props.path) return;

  const res = await apiStore.drive.download(props.model, props.path);

  const pp = parse(props.path);
  form.value.name = pp.base;
  form.value.data = (await res.text()) || "";
};

const handleClose = (val = false) => {
  emit("close", val);
};

const handleSave = async () => {
  let formData = new FormData();
  formData.append("path", join(props.parent, form.value.name));
  formData.append(
    "file",
    new Blob([form.value.data], {
      type: "text/plain",
    })
  );

  if (mode.value === "edit") {
    await apiStore.drive.remove(props.model, props.path);
  }

  await apiStore.drive.create(props.model, formData);

  apiStore.http.pushNotice({
    type: "success",
    title: mode.value === "create" ? "Created" : "Edited",
    detail: `${mode.value === "create" ? "Created" : "Edited"} 1 item(s).`,
  });

  handleClose(true);
};

const mode = computed(() => (props.path ? "edit" : "create"));

syncData();
</script>

<template>
  <RDialog
    ref="dialogRef"
    :label="false"
    :disableDefaultClose="true"
    @close="handleClose"
  >
    <div class="flex items-center justify-between">
      <RHeading type="h2"
        >{{
          formatLabel(mode, true) + (mode === "create" ? " a" : " the")
        }}
        file</RHeading
      >

      <div v-if="parent && !path" class="text-xs font-mono">
        Parent: {{ parent }}
      </div>
      <div v-else-if="path" class="text-xs font-mono">Path: {{ path }}</div>
    </div>

    <div class="pb-4">
      <label class="block uppercase mb-2">File name</label>

      <RInput v-model="form.name" class="my-0" />
    </div>

    <div class="pb-4">
      <label class="block uppercase mb-2">Content</label>

      <CodeEditor v-model="form.data" />
    </div>

    <div>
      <RButton variant="primary" @click="handleSave">Save</RButton>
    </div>
  </RDialog>
</template>
