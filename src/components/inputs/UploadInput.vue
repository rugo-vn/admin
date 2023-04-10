<script setup>
import { ref, onMounted, onUnmounted } from "vue";

import { useApiStore } from "../../stores/api";
import BaseInput from "./BaseInput.vue";

const isFocus = ref(false);
const inputBox = ref(null);
const uploadInput = ref(null);

const apiStore = useApiStore();

const upload = async (updateValue) => {
  const file = uploadInput.value.files[0];

  const formData = new FormData();
  formData.append("name", file.name);
  formData.append("file", file);

  try {
    const res = await apiStore.drive.upload(formData);
    updateValue(res.url);
    isFocus.value = false;
    apiStore.http.pushNotice({
      type: "success",
      title: "Uploaded",
      detail: `Uploaded 1 item(s).`,
    });
  } catch (err) {
    console.error(err);
    apiStore.http.pushNotice({
      type: "danger",
      title: "Not uploaded",
      detail: `Cannot uploaded 1 item(s).`,
    });
  }
};

const fileInputFocus = (e) => {
  if (!inputBox.value) return;

  let elm = e.target;
  while (elm) {
    elm = elm.parentElement;
    if (inputBox.value === elm) {
      return (isFocus.value = true);
    }
  }

  isFocus.value = false;
};

onMounted(() => {
  window.addEventListener("click", fileInputFocus);
});

onUnmounted(() => {
  window.removeEventListener("click", fileInputFocus);
});

defineExpose({
  show() {
    isFocus.value = true;
  },
  hide() {
    isFocus.value = false;
  },
  isFocus() {
    return isFocus.value;
  },
});
</script>

<template>
  <BaseInput v-slot="{ value, updateValue }">
    <div ref="inputBox" class="upload-input relative">
      <input
        class="block border w-full p-3 rounded-lg outline-none focus:border-black dark:bg-gray-900 dark:border-gray-500 dark:focus:border-primary-500"
        placeholder="Select a file"
        readonly
      />

      <div
        class="bg-white drop-shadow rounded absolute w-[calc(100%-1rem)] top-10 mx-2 z-10 overflow-hidden"
        v-if="isFocus"
      >
        <div class="p-3">
          <div
            class="w-full min-h-[5rem] relative border-2 rounded-lg border-dashed bg-gray-100 bg-transparent"
          >
            <input
              class="w-full h-full min-h-[5rem] opacity-0"
              ref="uploadInput"
              type="file"
              @change="upload(updateValue)"
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
        </div>
      </div>

      <button
        v-if="value"
        class="rounded-full bg-primary-500 text-white py-1 px-3 absolute top-2 left-2 items-center whitespace-nowrap max-w-[calc(100%-1rem)] overflow-hidden flex"
        @click="updateValue()"
      >
        <span class="text-ellipsis overflow-hidden max-w-[calc(100%-1rem)]">
          {{ value }}
        </span>
        <CloseIcon class="text-base ml-2" />
      </button>
    </div>
  </BaseInput>
</template>
