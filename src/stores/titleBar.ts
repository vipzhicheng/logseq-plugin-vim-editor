import { defineStore } from "pinia";

export const useTitleBarStore = defineStore("titleBar", {
  state: () => ({
    title: "",
    mode: "",
  }),
  actions: {
    setTitle(title) {
      this.title = title;
    },
    setMode(mode) {
      this.mode = mode;
    },
  },
});
