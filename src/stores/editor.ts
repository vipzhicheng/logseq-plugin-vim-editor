import "@logseq/libs";
import { defineStore } from "pinia";
import { EditorFromTextArea } from "codemirror";
import { useHelpStore } from "@/stores/help";
import { useTitleBarStore } from "@/stores/titleBar";

import * as CodeMirror from "codemirror";

import "codemirror/lib/codemirror.css";

import "codemirror/addon/dialog/dialog.css";
// import "codemirror/theme/material.css";
// import "codemirror/theme/solarized.css";

import "@/theme/base2tone-sea-dark.css";

// import "codemirror/mode/javascript/javascript";
// import "codemirror/mode/htmlmixed/htmlmixed";
// import "codemirror/mode/coffeescript/coffeescript";
import "codemirror/mode/markdown/markdown";

import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/edit/continuelist";

import "codemirror/keymap/vim.js";

// This is for transform block id to invisible string to make multiple mode separator more unique.
const encode = (text) => {
  const textArray = Array.from(text);
  const binarify = textArray.map((c: string) => c.codePointAt(0).toString(2));
  const encoded = binarify
    .map((c) =>
      Array.from(c)
        .map((b) => (b === "1" ? "‍" : "‌"))
        .join("")
    )
    .join("​");
  return encoded;
};

// This is for checking if user change the block seprator, if so the changes of that block will not be saved back to Logseq.
const decode = (encoded) => {
  const split = encoded.split("​");
  const binary = split.map((c) =>
    Array.from(c)
      .map((z) => (z === "‍" ? "1" : "0"))
      .join("")
  );
  const decoded = binary
    .map((b) => String.fromCodePoint(parseInt(b, 2)))
    .join("");
  return decoded;
};

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
      CodeMirror.Vim.defineEx("wq", "wq", this.save);

      // @ts-ignore
      CodeMirror.Vim.defineEx("quit", "q", this.quit);

      // @ts-ignore
      CodeMirror.Vim.defineEx("help", "h", this.help);

      const cm = CodeMirror.fromTextArea(editor as HTMLTextAreaElement, {
        mode: "markdown",
        theme: "markdown",
        // // @ts-ignore
        // minimap: true,
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

      cm.addKeyMap({
        "Ctrl-]": () => {
          // @ts-ignore
          CodeMirror.Vim.exitInsertMode(cm);
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
            titleBarStore.setMode("Multiple");

            const value = blocks
              .map((b) => {
                const encoded = encode(b.uuid);
                return `> ((${b.uuid}))${encoded}:\n${b.content}`;
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
              titleBarStore.setMode("Single");
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
        if (titleBarStore.mode === "Single") {
          const block = await logseq.Editor.getCurrentBlock();
          if (block) {
            await logseq.Editor.updateBlock(block.uuid, this.cm.getValue());
          }
          logseq.hideMainUI({
            restoreEditingCursor: true,
          });
        } else {
          const value = this.cm.getValue();

          const splited = value.split(
            /^> \(\(([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\)\)([\u200b-\u200f\uFEFF\u202a-\u202e]+):\n/gim
          );

          for (let i = 1; i < splited.length; i += 3) {
            const uuid = splited[i];
            const encoded = splited[i + 1];
            if (uuid !== decode(encoded)) {
              continue;
            }
            const content = splited[i + 2];
            await logseq.Editor.updateBlock(uuid, content);
          }

          logseq.hideMainUI({
            restoreEditingCursor: true,
          });
        }
        logseq.App.showMsg("Saved back to Logseq!");
      }
    },

    quit() {
      logseq.hideMainUI({
        restoreEditingCursor: true,
      });
      logseq.App.showMsg("Quit without saving!");
    },

    help() {
      const helpStore = useHelpStore();
      helpStore.open();
    },
  },
});
