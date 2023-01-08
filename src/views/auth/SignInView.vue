<script setup>
import { reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useApiStore } from "../../stores/api";
import { VIEW } from "../../constants.js";

const apiStore = useApiStore();
const route = useRoute();
const router = useRouter();

const form = reactive({
  identity: "",
  password: "",
});

const signIn = async () => {
  await apiStore.auth.signIn(form.identity, form.password);
  await apiStore.load();
  router.push(VIEW.OverviewView);
};

console.log(route.query);

// apiStore.http.setToken(null);
</script>

<template>
  <RHeading>Sign In</RHeading>

  <RInput label="Email" v-model="form.identity" @keyup.enter="signIn" />

  <RInput
    label="Password"
    type="password"
    v-model="form.password"
    @keyup.enter="signIn"
  />

  <div class="flex justify-center items-center">
    <RButton variant="primary" @click="signIn">Sign In</RButton>
  </div>
</template>
