import "@logseq/libs";
import { createApp } from "vue";
import App from "./App.vue";

import "./style.css";

const model = {
  openModel() {
    logseq.showMainUI({
      autoFocus: true,
    });
  },
};

/**
 * user model
 */
function createModel() {
  return {
    openModel() {
      logseq.showMainUI();
    },
  };
}

/**
 * app entry
 */
function main() {
  logseq.setMainUIInlineStyle({
    position: "fixed",
    zIndex: 11,
  });

  // external btns
  // logseq.App.registerUIItem("toolbar", {
  //   key: "open-vim-editor",
  //   template: `
  //     <a class="button" data-on-click="openModel" style="font-size: 18px">
  //       V
  //     </a>
  //   `,
  // });

  logseq.provideModel(model);

  // main UI
  createApp(App).mount("#app");

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
