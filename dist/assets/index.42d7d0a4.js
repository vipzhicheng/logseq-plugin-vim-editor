import{d as c,o as d,c as l,a as u,b as g,e as p}from"./vendor.b6c4d058.js";const m=function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&t(s)}).observe(document,{childList:!0,subtree:!0});function r(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerpolicy&&(o.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?o.credentials="include":e.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function t(e){if(e.ep)return;e.ep=!0;const o=r(e);fetch(e.href,o)}};m();const f={id:"editor"},y=c({setup(i){return d(async()=>{const n=document.getElementById("editor");n.value="",l.exports.commands.save=async function(t){const e=await logseq.Editor.getCurrentBlock();e&&await logseq.Editor.updateBlock(e.uuid,t.doc.getValue()),logseq.hideMainUI({restoreEditingCursor:!0})},l.exports.Vim.defineEx("quit","q",async t=>{logseq.hideMainUI({restoreEditingCursor:!0})});const r=l.exports.fromTextArea(n,{mode:"markdown",theme:"markdown",minimap:!0,lineNumbers:!0,lineWrapping:!0,indentUnit:2,tabSize:2,indentWithTabs:!0,showCursorWhenSelecting:!0,keyMap:"vim",extraKeys:{Tab:t=>{const e=Array(t.getOption("indentUnit")+1).join(" ");t.replaceSelection(e)},Enter:"newlineAndIndentContinueMarkdownList"}});logseq.on("ui:visible:changed",async t=>{if(!t)return;const e=await logseq.Editor.getCurrentBlock();e&&r.setValue(e.content),r.refresh(),r.focus()})}),(n,r)=>(g(),u("textarea",f))}});const a={openModel(){logseq.showMainUI({autoFocus:!0})}};function h(){logseq.setMainUIInlineStyle({position:"fixed",zIndex:11}),logseq.provideModel(a),p(y).mount("#app");const i=async()=>{if(!await logseq.Editor.getCurrentBlock()){logseq.App.showMsg("Please select a block");return}const r=await logseq.Editor.getSelectedBlocks();if(r&&r?.length>1){logseq.App.showMsg("Please select only one block");return}a.openModel()};logseq.Editor.registerSlashCommand("VIM Editor",i),logseq.Editor.registerBlockContextMenuItem("VIM Editor",i),logseq.App.registerCommandPalette({key:"vim-editor-open-vim-editor",label:"VIM Editor",keybinding:{mode:"global",binding:"mod+shift+e"}},i)}logseq.ready(h);
