<script setup>
import { ref } from "vue";

import CloseIcon from "@rugo-vn/vue/dist/ionicons/CloseIcon.vue";

import { useSchemaStore } from "../../stores/schema.js";
import { useApiStore } from "../../stores/api.js";
import { DELAY_INPUT } from "../../constants.js";
import BaseInput from "./BaseInput.vue";
import IdValue from "../values/IdValue.vue";

const props = defineProps(["schema"]);

const schemaStore = useSchemaStore();
const apiStore = useApiStore();

const isLoading = ref(false);
const results = ref([]);
const localItem = ref(null);

let lookupField = "id";
let refSchema = null;

const syncValue = async () => {
  if (props.schema.ref) {
    refSchema = schemaStore.getSchema(props.schema.ref);
    lookupField = props.schema.lookup || "id";
  }
};

let searchTimeout;
const search = async (text) => {
  clearTimeout(searchTimeout);

  if (!refSchema) {
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  const { data } = await apiStore.table.find(refSchema.name, {
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
  searchTimeout = setTimeout(() => search(text), DELAY_INPUT);
};

const clearSearch = (e) => {
  e.target.value = "";
  results.value = [];
  isLoading.value = false;
};

syncValue();
</script>

<template>
  <BaseInput>
    <template #inlineValue="{ value }">
      <IdValue :value="value" :schema="schema" />
    </template>

    <template v-slot="{ value, updateValue }">
      <div v-if="schema.ref" class="relative">
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
              @mousedown="updateValue(item.id)"
            >
              <IdValue
                :item="item"
                :lookup="item[lookupField] ? lookupField : 'id'"
              />
            </button>
          </div>
          <div v-else class="text-center italic text-gray-500 py-2 px-3">
            Empty!
          </div>
        </div>

        <button
          v-if="value"
          class="rounded-full bg-primary-500 text-white py-1 px-3 absolute top-2 left-2 items-center whitespace-nowrap max-w-[calc(100%-1rem)] overflow-hidden block"
          @click="updateValue(undefined)"
        >
          <span class="text-ellipsis overflow-hidden max-w-[calc(100%-1rem)]">
            <IdValue :value="value" :schema="schema" />
          </span>
          <CloseIcon class="text-base ml-2" />
        </button>
      </div>

      <RInput
        v-else
        class="my-0"
        :modelValue="value"
        @update:modelValue="updateValue"
      />
    </template>
  </BaseInput>
</template>
