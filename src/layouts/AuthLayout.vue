<script setup>
import { RouterView } from "vue-router";
import { MAuthLayout } from '../../lib';
import AppLogo from "../components/AppLogo.vue";
</script>

<template>
  <MAuthLayout>
    <template #logo>
      <AppLogo size="lg"/>
    </template>

    <RouterView />
  </MAuthLayout>
</template>
