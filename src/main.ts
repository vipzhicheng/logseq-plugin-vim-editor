import "@logseq/libs";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";

import "./style.css";
import "vfonts/FiraCode.css";

const model = {
  openModel() {
    logseq.showMainUI({
      autoFocus: true,
    });
  },
};

/**
 * app entry
 */
function main() {
  logseq.setMainUIInlineStyle({
    position: "fixed",
    zIndex: 11,
  });

  logseq.provideModel(model);

  // vue init
  const app = createApp(App);
  app.use(createPinia());
  app.mount("#app");

  const handleTriggerModal = async () => {
    const block = await logseq.Editor.getCurrentBlock();
    if (!block) {
      logseq.App.showMsg("Please select a block");
      return;
    }

    const blocks = await logseq.Editor.getSelectedBlocks();
    if (blocks && blocks?.length > 1) {
      logseq.App.showMsg("Please select only one block");
      return;
    }

    model.openModel();
  };
  logseq.Editor.registerSlashCommand("VIM Editor", handleTriggerModal);
  logseq.Editor.registerBlockContextMenuItem("VIM Editor", handleTriggerModal);
  logseq.App.registerCommandPalette(
    {
      key: "vim-editor-open-vim-editor",
      label: "VIM Editor",
      keybinding: {
        mode: "global",
        binding: "mod+shift+e",
      },
    },
    handleTriggerModal
  );
}

// bootstrap
logseq.ready(main);
