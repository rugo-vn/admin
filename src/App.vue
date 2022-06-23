<script setup>
import { inject, ref } from 'vue';
import { RouterView } from 'vue-router'
import { MNotification, MLoader, MConfirmDialog, MInputDialog } from '../lib';
import { useInfoStore } from './stores/info';

const infoStore = useInfoStore();

// dialog
const confirmDialog = ref(null);
const inputDialog = ref(null);

const dialog = inject("mdialog");

dialog.register({
  confirm: confirmDialog,
  input: inputDialog,
});

// notification
const notification = ref(null);
const noti = inject("mnoti");
noti.register(notification);

// loader
const loader = inject('loader');
loader.onChange(v => infoStore.setIsLoading(v));

</script>

<template>
  <RouterView />

  <MConfirmDialog ref="confirmDialog" />
  <MInputDialog ref="inputDialog" />

  <MNotification ref="notification" />

  <MLoader class="fixed bottom-6 left-6 z-30" v-if="infoStore.isLoading" />
</template>
