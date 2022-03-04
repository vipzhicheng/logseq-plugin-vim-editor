import { defineStore } from "pinia";
import { version } from "../../package.json";

export const useHelpStore = defineStore("help", {
  state: () => ({
    version,
    visible: false,
    bordered: false,
    segmented: false,
    size: "huge" as "huge",
    preset: "card" as "card",
    transformOrigin: "center" as "center",
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
