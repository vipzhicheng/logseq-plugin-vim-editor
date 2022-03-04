<script setup lang="ts">
import "@logseq/libs";
import { useEditorStore } from "@/stores/editor";

const editorStore = useEditorStore();

onMounted(async () => {
  editorStore.init("editor");
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
