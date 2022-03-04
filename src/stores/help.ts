import { defineStore } from "pinia";

export const useHelpStore = defineStore("help", {
  state: () => ({
    visible: false,
    bordered: false,
    segmented: false,
    bodyStyle: {
      width: "600px",
    },
  }),
  actions: {
    open() {
      this.visible = true;
    },
  },
});
