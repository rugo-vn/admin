<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useApiStore } from "../../stores/api";
import { VIEW } from "../../constants.js";

const apiStore = useApiStore();
const router = useRouter();

const form = reactive({
  identity: "",
  password: "",
});

const signIn = async () => {
  await apiStore.auth.signIn(form.identity, form.password);
  router.push(VIEW.OverviewView);
};

apiStore.http.setToken(null);
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
