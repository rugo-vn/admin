<script setup>
import { inject, onBeforeMount, reactive, watch } from 'vue';
import { useRoute, useRouter, RouterView } from "vue-router";

import { MDashboardLayout } from '../../lib';
import { useInfoStore } from '../stores/info';
import AppLogo from '../components/AppLogo.vue';
import { formatName } from '../utils';

const api = inject('api');
const noti = inject('mnoti');
const router = useRouter();
const route = useRoute();
const infoStore = useInfoStore();

const navigations = reactive([
  { type: "link", name: "Home", href: "/dashboard", icon: "home" },
]);

const updateCollectionRoute = async name => {
  const formatedName = name ? formatName(name) : null;

  for (let item of navigations){
    if (item.name === formatedName)
      item.active = true;
    else
      item.active = false;
  }
}

onBeforeMount(async () => {
  if (!api.token){
    noti.push('warn', 'You must sign in first!');
    return router.push('/signin');
  }

  try {
    infoStore.setInfo(await api.getInfo());
  } catch(err){
    noti.push('warn', 'Your session was expired. Please sign in again!');
    return router.push('/signin');
  }

  navigations.push(...[
    { type: 'label', name: 'Collections' },
    ...infoStore.info.map(schema => ({
      type: 'link', 
      name: formatName(schema.__name), 
      href: `/dashboard/${schema.__type}/${schema.__name}`, 
      icon: schema.__icon || 'file-tray', 
      active: false
    })),
    { type: 'label', name: 'Actions' },
    { type: "link", name: "Sign out", href: "/signout", icon: "log-out" },
  ]);

  updateCollectionRoute(route.params.collectionName);
});

watch(
  () => route.params.collectionName,
  updateCollectionRoute
);
</script>

<template>
  <MDashboardLayout :items="navigations">
    <template #logo>
      <AppLogo :responsive="true" />
    </template>

    <RouterView />
  </MDashboardLayout>
</template>