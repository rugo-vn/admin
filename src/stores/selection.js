import { defineStore } from "pinia";

export const useSelectionStore = defineStore("selection", {
  state: () => ({
    selected: [],
  }),

  actions: {
    clear() {
      while (this.selected.length) this.selected.pop();
    },

    select(val) {
      const p = this.selected.indexOf(val);
      if (p !== -1) return;

      this.selected.push(val);
    },

    unselect(val) {
      const p = this.selected.indexOf(val);
      if (p === -1) return;

      this.selected.splice(p, 1);
    },

    isAnySelected(length) {
      return this.selected.length > 0 && this.selected.length < length;
    },

    isAllSelected(length) {
      return length && this.selected.length === length;
    },
  },
});
