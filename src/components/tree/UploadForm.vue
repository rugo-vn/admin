<script setup>
import DocumentTextIcon from "@rugo-vn/vue/dist/ionicons/DocumentTextIcon.vue";
import { ref } from "vue";

import { useApiStore } from "../../stores/api.js";
import { FsId } from "../../utils.js";

const props = defineProps(["model", "mode", "parent"]);
const emit = defineEmits(["update:value"]);

const apiStore = useApiStore();

const uploadInput = ref(null);

const upload = async () => {
  const docs = [];

  for (let file of uploadInput.value.files) {
    let formData = new FormData();
    formData.append("name", file.name);
    formData.append("parent", FsId.fromPath(props.parent).toString());
    formData.append("data", file);

    docs.push(formData);
  }

  let no = 0;
  let results = [];
  for (let doc of docs) {
    try {
      let res = await apiStore.create(props.model, doc);
      no++;
      results.push(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  if (no) {
    apiStore.pushNotice({
      type: "success",
      title: "Uploaded",
      detail: `Uploaded ${no} item(s).`,
    });

    emit("update:value", props.mode === "single" ? results[0] : results);
  }

  if (no !== docs.length) {
    apiStore.pushNotice({
      type: "danger",
      title: "Not uploaded",
      detail: `Cannot uploaded ${docs.length - no} item(s).`,
    });
  }

  uploadInput.value.value = "";
};
</script>

<template>
  <div
    class="w-full min-h-[5rem] relative border-2 rounded-lg border-dashed bg-gray-100 bg-transparent"
  >
    <input
      class="w-full h-full min-h-[5rem] opacity-0"
      ref="uploadInput"
      type="file"
      :multiple="mode !== 'single'"
      @change="upload"
    />

    <label
      class="pointer-events-none absolute w-full h-full top-0 left-0 text-gray-400 tracking-wider flex items-center justify-center"
    >
      <div class="text-center">
        <DocumentTextIcon class="inline-block mb-1 scale-150" />
        <div>Drop files here or click to upload</div>
      </div>
    </label>
  </div>
</template>
