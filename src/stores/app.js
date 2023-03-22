import { defineStore } from "pinia";
import { ref } from "vue";
import { CUSTOMIZE_NAME } from "../constants";

export const useAppStore = defineStore("app", () => {
  const view = ref(null);
  const info = ref(null);

  const getCustomize = (name) => {
    const raw = localStorage.getItem(`${CUSTOMIZE_NAME}.${name}`);

    try {
      return JSON.parse(raw);
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const setCustomize = (name, value) => {
    localStorage.setItem(
      `${CUSTOMIZE_NAME}.${info.value.spaceId}.${name}`,
      JSON.stringify(value)
    );
    return true;
  };

  return {
    getCustomize,
    setCustomize,
    view,
    info,
  };
});
