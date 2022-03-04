import "@logseq/libs";
import { defineStore } from "pinia";
import { EditorFromTextArea } from "codemirror";
import { useHelpStore } from "@/stores/help";
import { useTitleBarStore } from "@/stores/titleBar";

import * as CodeMirror from "codemirror";

import "codemirror/lib/codemirror.css";

import "codemirror/addon/dialog/dialog.css";
import "codemirror/theme/material.css";
import "codemirror/theme/solarized.css";

import "@/theme/base2tone-sea-dark.css";

import "codemirror/mode/javascript/javascript";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/coffeescript/coffeescript";
import "codemirror/mode/markdown/markdown";

import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/edit/continuelist";

import "codemirror/keymap/vim.js";

export const useEditorStore = defineStore("editor", {
  state: () => ({
    cm: null as EditorFromTextArea | null,
  }),
  actions: {
    init(selector: string) {
      const titleBarStore = useTitleBarStore();
      const editor = document.getElementById(selector) as HTMLTextAreaElement;
      editor.value = "";

      // @ts-ignore
      CodeMirror.commands.save = this.save;

      // @ts-ignore
      CodeMirror.Vim.defineEx("quit", "q", this.quit);

      // @ts-ignore
      CodeMirror.Vim.defineEx("help", "h", this.help);

      const cm = CodeMirror.fromTextArea(editor as HTMLTextAreaElement, {
        mode: "markdown",
        theme: "markdown",
        // @ts-ignore
        minimap: true,
        lineNumbers: true,
        lineWrapping: true,
        // autofocus: true,
        indentUnit: 2,
        tabSize: 2,
        indentWithTabs: true,
        showCursorWhenSelecting: true,
        keyMap: "vim",
        extraKeys: {
          // indent with spaces
          Tab: (cm: CodeMirror.Editor) => {
            // @ts-ignore
            const spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
            cm.replaceSelection(spaces);
          },
          Enter: "newlineAndIndentContinueMarkdownList",
        },
      });

      logseq.on("ui:visible:changed", async (visible) => {
        if (!visible) {
          return;
        }

        if (cm) {
          const blocks = await logseq.Editor.getSelectedBlocks();

          if (blocks && blocks.length > 1) {
            let page = await logseq.Editor.getCurrentPage();
            if (!page) {
              page = await logseq.Editor.getPage(blocks[0].page.id);
            }
            titleBarStore.setTitle(page.name);
            titleBarStore.setMode("multiple");
            console.log(blocks);

            const value = blocks
              .map((b) => {
                return `> ((${b.uuid})):\n${b.content}`;
              })
              .join("\n");
            cm.setValue(value);
          } else {
            const block = await logseq.Editor.getCurrentBlock();
            if (block) {
              cm.setValue(block.content);

              let page = await logseq.Editor.getCurrentPage();
              if (!page) {
                page = await logseq.Editor.getPage(block.page.id);
              }

              titleBarStore.setTitle(page.name);
              titleBarStore.setMode("single");
            }
          }
          cm.refresh();
          cm.focus();
        }
      });

      this.cm = cm;
      return cm;
    },

    async save() {
      if (this.cm) {
        const titleBarStore = useTitleBarStore();
        if (titleBarStore.mode === "single") {
          const block = await logseq.Editor.getCurrentBlock();
          if (block) {
            await logseq.Editor.updateBlock(block.uuid, this.cm.getValue());
          }
          logseq.hideMainUI({
            restoreEditingCursor: true,
          });
        } else {
          const value = this.cm.getValue();
          console.log("value", value);

          const splited = value.split(
            /> \(\(([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\)\):\n/gim
          );

          console.log("splited", splited);

          for (let i = 1; i < splited.length; i += 2) {
            const uuid = splited[i];
            const content = splited[i + 1];
            await logseq.Editor.updateBlock(uuid, content);
          }

          logseq.hideMainUI({
            restoreEditingCursor: true,
          });
        }
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
