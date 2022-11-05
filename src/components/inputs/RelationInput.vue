<script setup>
import objectPath from "object-path";
import { ref, watch } from "vue";

import CloseIcon from "@rugo-vn/vue/dist/ionicons/CloseIcon.vue";

import { useSchemaStore } from "../../stores/schema.js";
import { useApiStore } from "../../stores/api.js";
import { formatLabel } from "../../utils.js";
import { DELAY_SEARCH } from "../../constants.js";

const props = defineProps([
  "label",
  "value",
  "path",
  "model",
  "inline",
  "edit",
  "disabled",
]);
const emit = defineEmits(["update:value"]);

const schemaStore = useSchemaStore();
const apiStore = useApiStore();

const isLoading = ref(false);
const localValue = ref("");
const localSchema = ref({});
const localLabel = ref("");
const results = ref([]);
const localItem = ref(null);

let firstField = "_id";
let refSchema = null;

const syncValue = async () => {
  localValue.value = objectPath.get(props.value, props.path);
  localSchema.value = schemaStore.getSchema(props.model, props.path);
  localLabel.value = props.path.split(".").slice(-1)[0];

  if (localSchema.value.ref) {
    refSchema = schemaStore.getSchema(localSchema.value.ref);
    firstField = Object.keys(refSchema.properties || {})[0] || "_id";
  }

  if (
    localValue.value &&
    refSchema &&
    !(localItem.value && localItem.value._id === localValue.value)
  ) {
    const { data: item } = await apiStore.get(
      refSchema._name,
      localValue.value
    );
    localItem.value = item;
  }
};

const updateValue = (newValue) => {
  emit("update:value", (o) =>
    objectPath.set(o, props.path, newValue || undefined)
  );
};

let searchTimeout;
const search = async (text) => {
  clearTimeout(searchTimeout);

  if (!refSchema) {
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  const { data } = await apiStore.find(refSchema._name, {
    search: text,
    limit: 5,
  });
  isLoading.value = false;
  results.value = data;
};

const preSearch = (text) => {
  isLoading.value = true;
  results.value = [];

  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => search(text), DELAY_SEARCH);
};

const clearSearch = (e) => {
  e.target.value = "";
  results.value = [];
  isLoading.value = false;
};

const selectValue = (item) => {
  localItem.value = item;
  updateValue(item ? item._id : undefined);
};

watch(() => [props.value, props.path, props.model], syncValue, { deep: true });

syncValue();
</script>

<template>
  <div>
    <label v-if="!inline && localLabel" class="block uppercase mb-2">{{
      formatLabel(localLabel)
    }}</label>
    <div v-if="edit">
      <div v-if="localSchema.ref" class="relative">
        <input
          class="block border w-full p-3 rounded-lg peer outline-none focus:border-black dark:bg-gray-900 dark:border-gray-500 dark:focus:border-primary-500 peer"
          :placeholder="localItem ? '' : `Search something`"
          :disabled="localItem"
          @focus="search($event.target.value)"
          @input="preSearch($event.target.value)"
          @blur="clearSearch"
          @keydown.enter="search($event.target.value)"
        />

        <div
          class="hidden peer-focus:block bg-white drop-shadow rounded absolute w-[calc(100%-1rem)] top-10 mx-2 z-10"
        >
          <div
            v-if="isLoading"
            class="text-center italic text-gray-500 py-2 px-3"
          >
            Searching...
          </div>
          <div v-else-if="results.length">
            <button
              v-for="item in results"
              :key="item._id"
              class="block w-full border-b last:border-none text-left py-2 px-3 hover:bg-gray-50"
              @mousedown="selectValue(item)"
            >
              {{ item[firstField] }}
            </button>
          </div>
          <div v-else class="text-center italic text-gray-500 py-2 px-3">
            Empty!
          </div>
        </div>

        <button
          v-if="localItem"
          class="rounded-full bg-primary-500 text-white py-1 px-3 absolute top-2 left-2 inline-flex items-center whitespace-nowrap max-w-[calc(100%-1rem)] overflow-hidden block"
          @click="selectValue()"
        >
          <span class="text-ellipsis overflow-hidden max-w-[calc(100%-1rem)]">
            {{ localItem[firstField] }}
          </span>
          <CloseIcon class="text-base ml-2" />
        </button>
      </div>

      <RInput
        v-else
        class="my-0"
        :modelValue="localValue"
        :disabled="disabled"
        @update:modelValue="updateValue"
      />
    </div>
    <div v-else>
      {{ localItem ? localItem[firstField] : localValue }}
    </div>
  </div>
</template>
