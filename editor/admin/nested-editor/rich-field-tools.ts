import type {
  EditorConfig,
  ToolConstructable,
} from '@editorjs/editorjs/types'
import {
  editorInlineToolbar,
  inlineToolShortcuts,
} from '~~/editor/admin/config/editor-inline-tools'
import InlineCodeTool from '~~/editor/admin/tools/InlineCodeTool'
import { TextColorToolConstructable } from '~~/editor/admin/tools/TextColorTool'
import { CtaToolConstructable } from '~~/editor/admin/tools/blocks/CtaTool'

export const nestedRichFieldInlineToolbar = editorInlineToolbar

export async function createNestedParagraphTools(): Promise<
  EditorConfig['tools']
> {
  return {
    cta: CtaToolConstructable,
    ...(await createNestedInlineTools()),
  }
}

export async function createNestedHeaderTools(): Promise<EditorConfig['tools']> {
  const [{ default: Header }, inlineTools] = await Promise.all([
    import('@editorjs/header'),
    createNestedInlineTools(),
  ])

  return {
    header: {
      class: Header as unknown as ToolConstructable,
      inlineToolbar: nestedRichFieldInlineToolbar,
      config: {
        levels: [2, 3, 4],
        defaultLevel: 2,
      },
    },
    ...inlineTools,
  }
}

export async function createNestedColumnTools(): Promise<EditorConfig['tools']> {
  const [{ default: Header }, { default: List }, inlineTools] =
    await Promise.all([
      import('@editorjs/header'),
      import('@editorjs/list'),
      createNestedInlineTools(),
    ])

  return {
    header: {
      class: Header as unknown as ToolConstructable,
      inlineToolbar: nestedRichFieldInlineToolbar,
      config: {
        levels: [2, 3, 4],
        defaultLevel: 3,
      },
    },
    list: {
      class: List as unknown as ToolConstructable,
      inlineToolbar: nestedRichFieldInlineToolbar,
      config: {
        defaultStyle: 'unordered',
      },
    },
    cta: CtaToolConstructable,
    ...inlineTools,
  }
}

async function createNestedInlineTools(): Promise<EditorConfig['tools']> {
  const [
    { default: Marker },
    { default: Underline },
    { default: Strikethrough },
  ] = await Promise.all([
    import('@editorjs/marker'),
    import('@editorjs/underline'),
    import('@sotaproject/strikethrough'),
  ])

  return {
    marker: {
      class: Marker as unknown as ToolConstructable,
      shortcut: inlineToolShortcuts.marker,
    },
    textColor: {
      class: TextColorToolConstructable as unknown as ToolConstructable,
      shortcut: inlineToolShortcuts.textColor,
    },
    underline: {
      class: Underline as unknown as ToolConstructable,
      shortcut: inlineToolShortcuts.underline,
    },
    inlineCode: {
      class: InlineCodeTool as unknown as ToolConstructable,
      shortcut: inlineToolShortcuts.inlineCode,
    },
    strikethrough: {
      class: Strikethrough as unknown as ToolConstructable,
      shortcut: inlineToolShortcuts.strikethrough,
    },
  }
}
