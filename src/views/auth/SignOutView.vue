<script setup>
import { useRouter } from "vue-router";
import { VIEW } from '../../constants.js';
import { useApiStore } from '../../stores/api.js';
import { useAppStore } from '../../stores/app.js';

const appStore = useAppStore();
const apiStore = useApiStore();
const router = useRouter();

appStore.view = "Overview";
apiStore.http.setToken(null);

apiStore.http.pushNotice({
  type: "success",
  title: "Success",
  detail: "Signed out successfully",
});

router.push(VIEW.SignInView);
</script>
<template>
  Signing out...
</template>