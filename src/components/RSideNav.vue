<script setup>
import RIcon from "./RIcon.vue";

defineProps(["items", "modelValue"]);
defineEmits(["update:modelValue"]);
</script>

<template>
  <div>
    <!-- LEFT SIDEBAR -->
    <input
      type="checkbox"
      class="hidden peer"
      id="r-control-left-sidebar"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <label
      for="r-control-left-sidebar"
      class="fixed top-0 left-0 w-screen h-screen z-30 bg-white bg-opacity-80 hidden peer-checked:block md:hidden md:peer-checked:hidden dark:bg-black dark:bg-opacity-80"
    ></label>
    <div
      id="r-left-sidebar"
      class="z-30 bg-white border-r fixed left-[-16rem] top-0 w-64 h-screen transition-size group mactive:left-0 md:static md:left-0 md:mactive:w-16 dark:bg-[#1d2432] dark:border-[#292f3d]"
      :active="modelValue ? true : null"
    >
      <header
        class="h-16 w-full px-4 flex items-center justify-center border-b dark:border-[#292f3d]"
      >
        <slot name="logo"> </slot>
      </header>

      <nav
        class="h-[calc(100vh-4rem)] w-full px-2 overflow-hidden myscroll hover:overflow-y-auto"
      >
        <template v-for="item in items">
          <h5
            v-if="item.type === 'label'"
            class="px-3 h-10 flex items-center text-xs uppercase tracking-wider relative my-2 after:hidden after:h-[1px] after:w-full after:bg-gray-200 after:absolute after:top-1/2 after:left-0 md:group-mactive:first:hidden md:group-mactive:after:block md:group-mactive:h-0 dark:after:bg-[#292f3d]"
          >
            <span class="md:group-mactive:hidden">{{ item.name }}</span>
          </h5>
          <component
            :is="item.href ? 'RouterLink' : 'a'"
            :to="item.href"
            v-else="item.href"
            class="flex items-center my-2 h-10 rounded cursor-pointer mactive:bg-primary-500 mactive:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
            :active="item.active ? true : null"
          >
            <RIcon
              class="block text-xl px-3"
              :name="item.icon"
              :type="item.active ? 'filled' : 'outline'"
            />
            <span class="block md:group-mactive:hidden">{{ item.name }}</span>
          </component>
        </template>
      </nav>
    </div>
    <!-- LEFT SIDEBAR CLOSED -->
  </div>
</template>
