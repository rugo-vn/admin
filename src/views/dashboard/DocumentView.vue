<script setup>
import { useAppStore } from "../../stores/app.js";

const appStore = useAppStore();

appStore.view = "API Explorer";
</script>

<template>
  <RHeading>{{ appStore.view }}</RHeading>

  <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
    <RPanel class="mt-0">
      <RHeading type="h2">API</RHeading>
    </RPanel>

    <RPanel class="mt-0">
      <RHeading type="h2">Details</RHeading>
    </RPanel>

    <RPanel class="mt-0">
      <RHeading type="h2">Explorer</RHeading>

      <RInput
        label="Method"
      />

      <RInput
        label="URL"
      />

      <RButton variant="primary">Send</RButton>
    </RPanel>
  </div>
</template>