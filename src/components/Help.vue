<script setup lang="ts">
import { useHelpStore } from "@/stores/help";
const helpStore = useHelpStore();
</script>

<template>
  <n-modal
    v-model:show="helpStore.visible"
    class="custom-card"
    preset="card"
    :style="helpStore.bodyStyle"
    size="huge"
    :bordered="helpStore.bordered"
    :segmented="helpStore.segmented"
    transform-origin="center"
    :auto-focus="false"
  >
    <template #header>
      <div class="font-bold">
        Logseq VIM Editor <span class="text-gray-500 text-xs mr-2">v0.0.1</span>

        <a
          href="https://github.com/vipzhicheng/logseq-plugin-vim-editor"
          target="_blank"
          ><svg
            t="1645855006893"
            class="icon inline-block"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2750"
            width="16"
            height="16"
          >
            <path
              d="M512 42.666667A464.64 464.64 0 0 0 42.666667 502.186667 460.373333 460.373333 0 0 0 363.52 938.666667c23.466667 4.266667 32-9.813333 32-22.186667v-78.08c-130.56 27.733333-158.293333-61.44-158.293333-61.44a122.026667 122.026667 0 0 0-52.053334-67.413333c-42.666667-28.16 3.413333-27.733333 3.413334-27.733334a98.56 98.56 0 0 1 71.68 47.36 101.12 101.12 0 0 0 136.533333 37.973334 99.413333 99.413333 0 0 1 29.866667-61.44c-104.106667-11.52-213.333333-50.773333-213.333334-226.986667a177.066667 177.066667 0 0 1 47.36-124.16 161.28 161.28 0 0 1 4.693334-121.173333s39.68-12.373333 128 46.933333a455.68 455.68 0 0 1 234.666666 0c89.6-59.306667 128-46.933333 128-46.933333a161.28 161.28 0 0 1 4.693334 121.173333A177.066667 177.066667 0 0 1 810.666667 477.866667c0 176.64-110.08 215.466667-213.333334 226.986666a106.666667 106.666667 0 0 1 32 85.333334v125.866666c0 14.933333 8.533333 26.88 32 22.186667A460.8 460.8 0 0 0 981.333333 502.186667 464.64 464.64 0 0 0 512 42.666667"
              p-id="2751"
            ></path></svg
        ></a>
      </div>
    </template>
    <div class="flex flex-col gap-4">
      <p>
        Logseq VIM Editor is a tool to help you editing Logseq blocks in a VIM
        Editor, you can edit one block or select more blocks to edit.
      </p>
      <p>
        <span class="text-red-500 font-bold">Note</span>: If you use multiple
        blocks editing mode, do not change block ids on the left, and the order
        maybe different, and hierarchy of blocks will be flattened. You may not
        need to choose too many blocks to edit.
      </p>
      <p class="text-gray-400 text-sm">
        If you like this plugin and would like to support me to keep working on
        this plugin, you can
        <a
          class="font-bold text-gray-600"
          href="https://www.buymeacoffee.com/vipzhicheng"
          target="_blank"
          >buy me a coffee</a
        >, that would be very kind and appreciated!
      </p>
    </div>
  </n-modal>
</template>

<style></style>
