# Logseq VIM Editor

[![Github All Releases](https://img.shields.io/github/downloads/vipzhicheng/logseq-plugin-vim-editor/total.svg)](https://github.com/vipzhicheng-starter/logseq-plugin-vim-editor/releases)

A VIM-like block editor for Logseq, if you are familiar with VIM, it will bring VIM level performance boost when you editing.

![Screenshot](./screencast.gif)

## Features

- Single block mode.
- Multiple blocks mode.
- Many VIM operations supported.
- Support markdown table editor.

## Usage

The default trigger shortcut is `mod+shift+e`

## Multiple blocks mode notes

1. The order will be the selection order
2. All hierarchical blocks will be flattened.
3. Should not change the blockid, or the plugin can not locate block then the modification of that block will be lost.
4. What is the dots? It's zero width chars to verify block id, so also should not change those dots.

## Markdown Table Editor shortcuts

If you are using Mac, use Cmd instead of Ctrl.

### Basic

| Command       | Description               | Keymap     |
| ------------- | ------------------------- | ---------- |
| Next Cell     | Move to the next cell     | Tab        |
| Previous Cell | Move to the previous cell | Shift-Tab  |
| Next Row      | Move to the next row      | Enter      |
| Escape        | Escape from the table     | Ctrl-enter |

### Move focus

| Command    | Description      | Keymap     |
| ---------- | ---------------- | ---------- |
| Move Left  | Move focus left  | Ctrl-Left  |
| Move Right | Move focus right | Ctrl-Right |
| Move Up    | Move focus up    | Ctrl-Up    |
| Move Down  | Move focus down  | Ctrl-Down  |

### Alignment

| Command      | Description           | Keymap           |
| ------------ | --------------------- | ---------------- |
| Align Left   | Align a column left   | Shift-Ctrl-Left  |
| Align Right  | Align a column right  | Shift-Ctrl-Right |
| Align Center | Align a column center | Shift-Ctrl-Up    |
| Align None   | Unset alignment       | Shift-Ctrl-Down  |

### Row/column operations

| Command           | Description            | Keymap               |
| ----------------- | ---------------------- | -------------------- |
| Insert Row        | Insert an empty row    | Ctrl-K Ctrl-I        |
| Delete Row        | Delete a row           | Ctrl-L Ctrl-I        |
| Insert Column     | Insert an empty column | Ctrl-K Ctrl-J        |
| Delete Column     | Delete a column        | Ctrl-L Ctrl-J        |
| Move Row Up       | Move a row up          | Alt-Shift-Ctrl-Up    |
| Move Row Down     | Move a row down        | Alt-Shift-Ctrl-Down  |
| Move Column Left  | Move a column left     | Alt-Shift-Ctrl-Left  |
| Move Column Right | Move a column right    | Alt-Shift-Ctrl-Right |

## Codemirror

The editor is based on [codemirror](https://codemirror.net/) v5, you can learn more from there. This plugin does not need to be a professional editor or IDE for editing Logseq blocks, you can just think it as a another way to editing blocks for fun.

## Buy me a coffee

If my plugin solve your situation a little bit and you will, you can choose to [buy me a coffee](https://www.buymeacoffee.com/vipzhicheng).

## Licence

MIT
