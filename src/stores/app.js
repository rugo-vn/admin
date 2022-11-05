import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => {
    return {
      view: null,
    };
  },

  actions: {},
});
