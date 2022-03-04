<script setup lang="ts">
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

import "@logseq/libs";
import { useTitleBarStore } from "@/stores/titleBar";
import { useHelpStore } from "@/stores/help";
import { useEditorStore } from "@/stores/editor";

const titleBarStore = useTitleBarStore();
const helpStore = useHelpStore();
const editorStore = useEditorStore();

onMounted(async () => {
  const editor = document.getElementById("editor") as HTMLTextAreaElement;
  editor.value = "";

  // @ts-ignore
  CodeMirror.commands.save = editorStore.save;

  // @ts-ignore
  CodeMirror.Vim.defineEx("quit", "q", editorStore.quit);

  // @ts-ignore
  CodeMirror.Vim.defineEx("help", "h", editorStore.help);

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

  editorStore.setInstance(cm);

  logseq.on("ui:visible:changed", async (visible) => {
    if (!visible) {
      return;
    }

    const block = await logseq.Editor.getCurrentBlock();
    if (block) {
      cm.setValue(block.content);

      let page = await logseq.Editor.getCurrentPage();
      if (!page) {
        page = await logseq.Editor.getPage(block.page.id);
      }

      titleBarStore.setTitle(page.name);
      titleBarStore.setMode("single block");
    }

    cm.refresh();
    cm.focus();
  });
});
</script>
<template>
  <div class="flex-1">
    <textarea id="editor"></textarea>
  </div>
</template>
<style>
.CodeMirror {
  width: 100%;
  height: 100%;
}
</style>
