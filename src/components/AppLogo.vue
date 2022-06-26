<script setup>
import LogoOnly from "../assets/images/logo-only.svg";
import TextOnly from "../assets/images/text-only.svg";

defineProps(["size", "responsive"]); // null, 'lg'
</script>

<template>
  <div class="flex items-center overflow-hidden justify-center">
    <LogoOnly
      :class="`${size === 'lg' ? 'w-10 h-10' : 'w-7 h-7'}`"
      alt="Mintailor Logo Only"
    />
    <TextOnly
      :class="`${size === 'lg' ? 'h-10' : 'h-7'} w-auto
      ${responsive ? 'md:group-mactive:hidden' : ''}
      dark:invert`"
      alt="Mintailor Text Only"
    />
  </div>
</template>
