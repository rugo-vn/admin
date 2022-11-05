<script setup>
import { useAppStore } from "../../stores/app.js";

const appStore = useAppStore();

appStore.view = "Overview";
</script>

<template>Overview</template>
