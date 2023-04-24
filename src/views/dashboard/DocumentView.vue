<script setup>
import { ref } from "vue";
import axios from "axios";
import { clone } from "ramda";
import AddIcon from "@rugo-vn/vue/dist/ionicons/AddIcon.vue";
import CloseIcon from "@rugo-vn/vue/dist/ionicons/CloseIcon.vue";
import LockClosed from "@rugo-vn/vue/dist/ionicons/LockClosedIcon.vue";
import { useAppStore } from "../../stores/app.js";
import { useApiStore } from "../../stores/api.js";
import RSelect from "../../components/RSelect.vue";
import JsonEditor from "../../components/JsonEditor.vue";
import EmptyValue from "../../components/values/EmptyValue.vue";
import { API_DOCS } from "../../constants.js";
import { useSchemaStore } from "../../stores/schema";
import objectPath from "object-path";
import { formatLabel } from "../../utils";

const appStore = useAppStore();
const apiStore = useApiStore();
const schemaStore = useSchemaStore();

const method = ref("");
const url = ref("");
const payload = ref("{}");
const headers = ref([]);
const resp = ref("");
const currentDoc = ref(null);

const apiDocs = clone(API_DOCS);
const { schemas, drives } = schemaStore;
const authHeader = {
  headers: {
    Authorization: "_.token",
  },
};

for (const schemaName in schemas) {
  const schema = schemas[schemaName];

  apiDocs.push({
    type: "heading",
    title: `"${formatLabel(schemaName)}" table`,
  });

  apiDocs.push({
    type: "endpoint",
    method: "get",
    url: `/api/tables/${schema.name}`,
    ...authHeader,
    detail: `Get list rows from <span class="font-semibold">${schema.name}</span> table.`,
  });

  apiDocs.push({
    type: "endpoint",
    method: "get",
    url: `/api/tables/${schema.name}/:id`,
    ...authHeader,
    detail: `Get a specific row with <code>:id</code> from <span class="font-semibold">${schema.name}</span> table.`,
  });

  let dataTable = `<table class="w-full bg-white"><thead><th class="font-semibold border px-2 py-1 text-left">Property</th><th class="font-semibold border px-2 py-1 text-left">Type</th><th class="font-semibold border px-2 py-1 text-left">Notes</th></thead><tbody>`;

  for (const prop in schema.properties) {
    const propSchema = schema.properties[prop];
    dataTable += `<tr><td class="border px-2 py-1 text-left">${prop}</td><td class="border px-2 py-1 text-left">${
      propSchema.type
    }</td><td class="border px-2 py-1 text-left">${
      propSchema.required ? "Required. " : ""
    }${
      propSchema.default !== undefined
        ? "Default: <code>" + propSchema.default + "</code>."
        : ""
    }</td></tr>`;
  }

  dataTable += `</tbody></table>`;

  apiDocs.push({
    type: "endpoint",
    method: "post",
    url: `/api/tables/${schema.name}`,
    ...authHeader,
    payload: {},
    detail: `<p>Create a new row in <span class="font-semibold">${schema.name}</span> table.</p><p class="my-2">Your payload body should have data structure:</p>${dataTable}`,
  });

  apiDocs.push({
    type: "endpoint",
    method: "patch",
    url: `/api/tables/${schema.name}/:id`,
    ...authHeader,
    payload: {
      set: {},
      inc: {},
      unset: {},
    },
    detail: `<p>Edit a specific row in <span class="font-semibold">${schema.name}</span> table.</p><p class="my-2">Your payload body should follow data structure:</p>${dataTable}`,
  });

  apiDocs.push({
    type: "endpoint",
    method: "delete",
    url: `/api/tables/${schema.name}/:id`,
    ...authHeader,
    detail: `<p>Remove a specific row in <span class="font-semibold">${schema.name}</span> table.</p>`,
  });
}

for (const driveName in drives) {
  // const drive = drives[driveName];

  apiDocs.push({
    type: "heading",
    title: `"${formatLabel(driveName)}" drive`,
  });

  apiDocs.push({
    type: "endpoint",
    method: "get",
    url: `/api/drives/${driveName}?path=:path`,
    ...authHeader,
    detail: `Get list entry in <code>:path</code> in <span class="font-semibold">${driveName}</span> drive.`,
  });
}

appStore.view = "API Explorer";
let currentHeaderId = 0;
const defaultObject = {
  token: `Bearer ${apiStore.http.token}`,
};

const validateStatus = (status) => status >= 200 && status < 500;

async function sendAPI() {
  if (!method.value || !url.value) {
    return apiStore.http.pushNotice({
      type: "warn",
      title: "Warn",
      detail: "Please enter method and url value",
    });
  }

  const baseURL = import.meta.env.ADMIN_API;
  const reqHeaders = {};

  for (const h of headers.value) {
    if (!h.key || !h.value) continue;

    reqHeaders[h.key] = h.value;
  }

  const req = axios.create({
    baseURL,
    headers: reqHeaders,
    validateStatus,
  });

  apiStore.http.startLoad();
  let res;
  try {
    res = await req[method.value.trim().toLowerCase()](
      url.value,
      payload.value
    );
  } catch (err) {
    apiStore.http.endLoad();
    console.error(err);
    return apiStore.http.pushNotice({
      type: "danger",
      title: "Error",
      detail: err.message + ". See more information in the Dev Tool console.",
    });
  }
  apiStore.http.endLoad();

  resp.value = `Status: ${res.status}\n\nHeaders:\n${res.headers
    .toString()
    .split("\n")
    .map((s) => "- " + s)
    .join("\n")}\n\nBody: \n${JSON.stringify(res.data, 0, 2)}`;
}

function addHeader(key = "", value = "") {
  headers.value.push({
    id: ++currentHeaderId,
    key,
    value,
  });
}

function removeHeader(h) {
  headers.value.splice(headers.value.indexOf(h), 1);
}

function showDoc(doc) {
  if (isCurrentDoc(doc)) {
    return (currentDoc.value = null);
  }

  currentDoc.value = doc;
  method.value = doc.method.toUpperCase();
  url.value = doc.url;
  headers.value = [];
  for (const key in doc.headers) {
    let value = doc.headers[key];
    if (value.indexOf("_.") === 0) {
      value = objectPath.get({ _: defaultObject }, value);
    }

    addHeader(key, value);
  }
  payload.value = clone(doc.payload);
}

function isCurrentDoc(doc) {
  return (
    currentDoc.value?.method === doc.method && currentDoc.value?.url === doc.url
  );
}
</script>

<template>
  <RHeading>{{ appStore.view }}</RHeading>

  <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
    <RPanel class="mt-0">
      <RHeading type="h2">API</RHeading>

      <div
        v-for="doc of apiDocs"
        :key="`${doc.method}-${doc.url}`"
        class="mb-2"
      >
        <RHeading v-if="doc.type === 'heading'" type="h3" class="mt-4">{{
          doc.title
        }}</RHeading>
        <div v-else>
          <RButton
            variant="none"
            class="px-0 py-0 hover:bg-gray-100 w-full rounded flex items-center"
            @click="showDoc(doc)"
          >
            <span
              :class="`${
                doc.method.toLowerCase() === 'get'
                  ? 'bg-primary-500'
                  : doc.method.toLowerCase() === 'post'
                  ? 'bg-purple-500'
                  : doc.method.toLowerCase() === 'patch'
                  ? 'bg-warn-500'
                  : doc.method.toLowerCase() === 'delete'
                  ? 'bg-red-500'
                  : ''
              } text-white px-2 py-1 rounded uppercase w-16`"
              >{{ doc.method }}</span
            >
            <span class="px-2 py-1 font-mono">{{ doc.url }}</span>
            <LockClosed
              class="text-green-700"
              v-if="doc.headers?.Authorization"
            />
          </RButton>

          <div
            v-if="isCurrentDoc(doc)"
            class="border bg-gray-50 my-4 p-4 rounded"
            v-html="doc.detail"
          ></div>
        </div>
      </div>
    </RPanel>

    <RPanel class="mt-0">
      <RHeading type="h2">Explorer</RHeading>

      <div class="mb-4">
        <label class="block uppercase mb-2">Method</label>
        <RSelect
          v-model="method"
          :options="['GET', 'POST', 'PATCH', 'DELETE']"
        />
      </div>

      <div class="mb-4">
        <label class="block uppercase mb-2">URL</label>
        <RInput class="my-0" v-model="url" />
      </div>

      <div class="mb-4">
        <label class="uppercase mb-2 flex justify-between items-center">
          <span>Headers</span>
          <RButton
            class="px-0 py-0 w-6 h-6 rounded flex items-center justify-center"
            variant="primary"
            @click="addHeader"
          >
            <AddIcon class="text-lg" />
          </RButton>
        </label>

        <div v-if="headers.length">
          <div
            v-for="header in headers"
            :key="header.id"
            class="flex mb-4 items-center"
          >
            <RInput class="my-0 flex-1 mr-4" v-model="header.key" />
            <RInput class="my-0 flex-1 mr-4" v-model="header.value" />
            <RButton
              class="px-0 py-0 w-6 h-6 rounded flex items-center justify-center"
              variant="danger"
              @click="removeHeader(header)"
            >
              <CloseIcon class="text-lg" />
            </RButton>
          </div>
        </div>
        <div v-else>
          <EmptyValue />
        </div>
      </div>

      <div v-if="['POST', 'PATCH'].indexOf(method) !== -1" class="mb-4">
        <label class="block uppercase mb-2">Body</label>
        <JsonEditor v-model="payload" />
      </div>

      <RButton
        variant="primary"
        class="w-full text-center uppercase justify-center rounded"
        @click="sendAPI"
        >Send</RButton
      >

      <div
        v-if="resp"
        class="border border-gray-300 mt-4 p-4 rounded bg-gray-100"
      >
        <pre class="break-all whitespace-pre-wrap">{{ resp }}</pre>
      </div>
    </RPanel>
  </div>
</template>
