import "@logseq/libs";
import { defineStore } from "pinia";
import { EditorFromTextArea } from "codemirror";
import { useHelpStore } from "@/stores/help";

export const useEditorStore = defineStore("editor", {
  state: () => ({
    instance: null as EditorFromTextArea | null,
  }),
  actions: {
    setInstance(instance: EditorFromTextArea) {
      this.instance = instance;
    },

    async save() {
      if (this.instance) {
        const block = await logseq.Editor.getCurrentBlock();
        if (block) {
          await logseq.Editor.updateBlock(block.uuid, this.instance.getValue());
        }
        logseq.hideMainUI({
          restoreEditingCursor: true,
        });
      }
    },

    quit() {
      logseq.hideMainUI({
        restoreEditingCursor: true,
      });
    },

    help() {
      const helpStore = useHelpStore();
      helpStore.open();
    },
  },
});
