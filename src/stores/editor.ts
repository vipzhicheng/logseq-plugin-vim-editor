import "@logseq/libs";
import { defineStore } from "pinia";
import { EditorFromTextArea } from "codemirror";
import { useHelpStore } from "@/stores/help";
import { useTitleBarStore } from "@/stores/titleBar";
import {
  ITextEditor,
  TableEditor,
  Point,
  optionsWithDefaults,
  Alignment,
} from "@tgrosinger/md-advanced-tables";

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

class TextEditorInterface extends ITextEditor {
  editor: any;
  doc: any;
  transaction: any;
  onDidFinishTransaction: any;
  constructor(editor) {
    super();
    this.editor = editor;
    this.doc = editor.getDoc();
    this.transaction = false;
    this.onDidFinishTransaction = null;
  }

  getCursorPosition() {
    const { line, ch } = this.doc.getCursor();
    return new Point(line, ch);
  }

  setCursorPosition(pos) {
    this.doc.setCursor({ line: pos.row, ch: pos.column });
  }

  setSelectionRange(range) {
    this.doc.setSelection(
      { line: range.start.row, ch: range.start.column },
      { line: range.end.row, ch: range.end.column }
    );
  }

  getLastRow() {
    return this.doc.lineCount() - 1;
  }

  acceptsTableEdit() {
    return true;
  }

  getLine(row) {
    return this.doc.getLine(row);
  }

  insertLine(row, line) {
    const lastRow = this.getLastRow();
    if (row > lastRow) {
      const lastLine = this.getLine(lastRow);
      this.doc.replaceRange(
        "\n" + line,
        { line: lastRow, ch: lastLine.length },
        { line: lastRow, ch: lastLine.length }
      );
    } else {
      this.doc.replaceRange(
        line + "\n",
        { line: row, ch: 0 },
        { line: row, ch: 0 }
      );
    }
  }

  deleteLine(row) {
    const lastRow = this.getLastRow();
    if (row >= lastRow) {
      if (lastRow > 0) {
        const preLastLine = this.getLine(lastRow - 1);
        const lastLine = this.getLine(lastRow);
        this.doc.replaceRange(
          "",
          { line: lastRow - 1, ch: preLastLine.length },
          { line: lastRow, ch: lastLine.length }
        );
      } else {
        const lastLine = this.getLine(lastRow);
        this.doc.replaceRange(
          "",
          { line: lastRow, ch: 0 },
          { line: lastRow, ch: lastLine.length }
        );
      }
    } else {
      this.doc.replaceRange("", { line: row, ch: 0 }, { line: row + 1, ch: 0 });
    }
  }

  replaceLines(startRow, endRow, lines) {
    const lastRow = this.getLastRow();
    if (endRow > lastRow) {
      const lastLine = this.getLine(lastRow);
      this.doc.replaceRange(
        lines.join("\n"),
        { line: startRow, ch: 0 },
        { line: lastRow, ch: lastLine.length }
      );
    } else {
      this.doc.replaceRange(
        lines.join("\n") + "\n",
        { line: startRow, ch: 0 },
        { line: endRow, ch: 0 }
      );
    }
  }

  transact(func) {
    this.transaction = true;
    func();
    this.transaction = false;
    if (this.onDidFinishTransaction) {
      this.onDidFinishTransaction.call(undefined);
    }
  }
}

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
    async init(selector: string) {
      const titleBarStore = useTitleBarStore();
      const editor = document.getElementById(selector) as HTMLTextAreaElement;
      editor.value = "";

      // @ts-ignore
      CodeMirror.commands.save = this.save;

      // @ts-ignore
      CodeMirror.Vim.defineEx("wq", "wq", this.saveAndQuit);

      // @ts-ignore
      CodeMirror.Vim.defineEx("quit", "q", this.quitWithoutSaving);

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
      });

      cm.addKeyMap({
        "Ctrl-]": () => {
          // @ts-ignore
          CodeMirror.Vim.exitInsertMode(cm);
        },
      });

      // create an interface to the text editor
      const editorIntf = new TextEditorInterface(cm);
      // create a table editor object
      const tableEditor = new TableEditor(editorIntf);
      // options for the table editor
      const opts = optionsWithDefaults({
        smartCursor: true,
      });

      const keyMapDefault = CodeMirror.normalizeKeyMap({
        // indent with spaces
        Tab: (cm: CodeMirror.Editor) => {
          // @ts-ignore
          const spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
          cm.replaceSelection(spaces);
        },
        Enter: "newlineAndIndentContinueMarkdownList",
      });

      cm.setOption("extraKeys", keyMapDefault);

      // keymap of the commands
      const keyMap = CodeMirror.normalizeKeyMap({
        Tab: () => {
          tableEditor.nextCell(opts);
        },
        "Shift-Tab": () => {
          tableEditor.previousCell(opts);
        },
        Enter: () => {
          tableEditor.nextRow(opts);
        },
        "Ctrl-Enter": () => {
          tableEditor.escape(opts);
        },
        "Cmd-Enter": () => {
          tableEditor.escape(opts);
        },
        "Shift-Ctrl-Left": () => {
          tableEditor.alignColumn(Alignment.LEFT, opts);
        },
        "Shift-Cmd-Left": () => {
          tableEditor.alignColumn(Alignment.LEFT, opts);
        },
        "Shift-Ctrl-Right": () => {
          tableEditor.alignColumn(Alignment.RIGHT, opts);
        },
        "Shift-Cmd-Right": () => {
          tableEditor.alignColumn(Alignment.RIGHT, opts);
        },
        "Shift-Ctrl-Up": () => {
          tableEditor.alignColumn(Alignment.CENTER, opts);
        },
        "Shift-Cmd-Up": () => {
          tableEditor.alignColumn(Alignment.CENTER, opts);
        },
        "Shift-Ctrl-Down": () => {
          tableEditor.alignColumn(Alignment.NONE, opts);
        },
        "Shift-Cmd-Down": () => {
          tableEditor.alignColumn(Alignment.NONE, opts);
        },
        "Ctrl-Left": () => {
          tableEditor.moveFocus(0, -1, opts);
        },
        "Cmd-Left": () => {
          tableEditor.moveFocus(0, -1, opts);
        },
        "Ctrl-Right": () => {
          tableEditor.moveFocus(0, 1, opts);
        },
        "Cmd-Right": () => {
          tableEditor.moveFocus(0, 1, opts);
        },
        "Ctrl-Up": () => {
          tableEditor.moveFocus(-1, 0, opts);
        },
        "Cmd-Up": () => {
          tableEditor.moveFocus(-1, 0, opts);
        },
        "Ctrl-Down": () => {
          tableEditor.moveFocus(1, 0, opts);
        },
        "Cmd-Down": () => {
          tableEditor.moveFocus(1, 0, opts);
        },
        "Ctrl-K Ctrl-I": () => {
          tableEditor.insertRow(opts);
        },
        "Cmd-K Cmd-I": () => {
          tableEditor.insertRow(opts);
        },
        "Ctrl-L Ctrl-I": () => {
          tableEditor.deleteRow(opts);
        },
        "Cmd-L Cmd-I": () => {
          tableEditor.deleteRow(opts);
        },
        "Ctrl-K Ctrl-J": () => {
          tableEditor.insertColumn(opts);
        },
        "Cmd-K Cmd-J": () => {
          tableEditor.insertColumn(opts);
        },
        "Ctrl-L Ctrl-J": () => {
          tableEditor.deleteColumn(opts);
        },
        "Cmd-L Cmd-J": () => {
          tableEditor.deleteColumn(opts);
        },
        "Alt-Shift-Ctrl-Left": () => {
          tableEditor.moveColumn(-1, opts);
        },
        "Alt-Shift-Cmd-Left": () => {
          tableEditor.moveColumn(-1, opts);
        },
        "Alt-Shift-Ctrl-Right": () => {
          tableEditor.moveColumn(1, opts);
        },
        "Alt-Shift-Cmd-Right": () => {
          tableEditor.moveColumn(1, opts);
        },
        "Alt-Shift-Ctrl-Up": () => {
          tableEditor.moveRow(-1, opts);
        },
        "Alt-Shift-Cmd-Up": () => {
          tableEditor.moveRow(-1, opts);
        },
        "Alt-Shift-Ctrl-Down": () => {
          tableEditor.moveRow(1, opts);
        },
        "Alt-Shift-Cmd-Down": () => {
          tableEditor.moveRow(1, opts);
        },
      });

      // enable keymap if the cursor is in a table
      function updateActiveState() {
        const active = tableEditor.cursorIsInTable(opts);
        if (active) {
          cm.setOption("extraKeys", keyMap);
        } else {
          cm.setOption("extraKeys", keyMapDefault);
          tableEditor.resetSmartCursor();
        }
      }
      // event subscriptions
      cm.on("cursorActivity", () => {
        if (!editorIntf.transaction) {
          updateActiveState();
        }
      });
      cm.on("changes", () => {
        if (!editorIntf.transaction) {
          updateActiveState();
        }
      });
      editorIntf.onDidFinishTransaction = () => {
        updateActiveState();
      };

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
        }
        logseq.App.showMsg("Saved back to Logseq!");
      }
    },

    async saveAndQuit() {
      await this.save();
      logseq.hideMainUI({
        restoreEditingCursor: true,
      });
    },

    quitWithoutSaving() {
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
