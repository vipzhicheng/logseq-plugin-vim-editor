import '@logseq/libs'
import { createApp } from "vue";
import App from "./App.vue";

import './style.css';

/**
 * user model
 */
function createModel () {
  return {
    openModel () {
      logseq.showMainUI()
    },
  }
}

/**
 * app entry
 */
function main () {
  logseq.setMainUIInlineStyle({
    position: 'fixed',
    zIndex: 11,
  })



  // external btns
  logseq.App.registerUIItem('toolbar', {
    key: 'open-vim-editor',
    template: `
      <a class="button" data-on-click="openModel">
        aa
      </a>
    `,
  })

  // main UI
  createApp(App).mount('#app')
}

// bootstrap
logseq.ready(createModel()).then(main)