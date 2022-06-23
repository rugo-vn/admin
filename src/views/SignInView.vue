<script setup>
import { inject, reactive } from "vue";
import { useRouter } from "vue-router";

import { MInput, MButton } from '../../lib';

const api = inject('api');
const noti = inject('mnoti');

const router = useRouter();
const form = reactive({
  email: '',
  password: '',
});

api.token = null;

const signIn = async () => {
  try {
    await api.signIn(form);
  } catch(err){
    return noti.push('danger', err.message);
  }

  noti.push('success', 'Welcome to Rugo.vn!');
  router.push('/dashboard');
};
</script>

<template>
  <h1 class="text-xl text-center font-medium tracking-wide">Sign In</h1>

  <MInput label="Email" type="email" v-model="form.email" @keyup.enter="signIn" />
  <MInput label="Password" type="password" v-model="form.password" @keyup.enter="signIn" />

  <div class="flex justify-between items-center">
    <MButton variant="primary" @click="signIn">Sign In</MButton>
  </div>
</template>
