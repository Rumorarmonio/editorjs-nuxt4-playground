import type { EditorConfig } from '@editorjs/editorjs/types'

export const editorInlineToolbar = [
  'bold',
  'italic',
  'link',
  'underline',
  'textBackground',
  'textColor',
  'strikethrough',
  'inlineCode',
] satisfies NonNullable<EditorConfig['inlineToolbar']>

export const inlineToolShortcuts = {
  textBackground: 'CMD+SHIFT+M',
  textColor: 'CMD+SHIFT+Y',
  underline: 'CMD+U',
  strikethrough: 'CMD+SHIFT+X',
  inlineCode: 'CMD+SHIFT+6',
} as const
