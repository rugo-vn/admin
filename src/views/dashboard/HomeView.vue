<script setup>
import { computed, inject, ref } from 'vue';
import { RouterLink } from "vue-router";
import { MPanel, MButton, MInput } from '../../../lib';
import { useInfoStore } from '../../stores/info';
import { formatName } from '../../utils';

const baseURL = import.meta.env.ADMIN_API_BASE_URL;
const api = inject('api');
const noti = inject('mnoti');
const dialog = inject("mdialog");

// navigation
const infoStore = useInfoStore();
const items = computed(() => {
  return infoStore.info.map(schema => ({
    name: formatName(schema.__name), 
    href: `/dashboard/${schema.__type}/${schema.__name}`, 
    icon: schema.__icon || 'file-tray'
  }));
});

// import & export
const file = ref(null);
const createBackup = async () => {
  const res = await api.get('/apix/export');
  window.open(`${baseURL}${res}`, '_blank');
}

const uploadToImport = async () => {
  if (!file.value || !file.value.files || !file.value.files[0])
    return;

  if (!await dialog.show("confirm")) 
    return;

  let formData = new FormData();
  formData.append('data', file.value.files[0]);

  const res = await api.post('/apix/import', formData);
  noti.push('success', res);
}

</script>

<template>
  <h1 class="text-3xl mt-4 font-semibold">Welcome!</h1>
  <p>Have a nice time with <b>Rugo.vn</b>.</p>

  <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
    <RouterLink
      v-for="item of items"
      class="bg-primary-500 p-8 rounded-lg text-center text-white text-lg"
      :to="item.href"
      :key="item.name"
    >
      <div>
        <ion-icon class="text-3xl" :name="item.icon" />
      </div>

      <div>
        {{ item.name }}
      </div>
    </RouterLink>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <MPanel>
      <h2 class="text-xl mb-2">Change Password</h2>

      <MInput label="Old Password" />
      <MInput label="New Password" />
      <MInput label="Confirm Password" />

      <MButton variant="primary">Save</MButton>
    </MPanel>

    <MPanel>
      <h2 class="text-xl mb-2">Backup Your Site</h2>

      <MButton class="mb-4" variant="primary" @click="createBackup">Create & Download</MButton><br />
      <input
        class="hidden"
        ref="file"
        type="file"
        allow=".zip"
        @change="uploadToImport"
      />
      <MButton variant="danger" @click="file.click()">Upload & Restore</MButton>
    </MPanel>
  </div>
</template>