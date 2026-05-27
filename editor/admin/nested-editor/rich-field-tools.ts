import type {
  EditorConfig,
  ToolConstructable,
} from '@editorjs/editorjs/types'
import RawTool from '@editorjs/raw'
import {
  editorInlineToolbar,
  inlineToolShortcuts,
} from '~~/editor/admin/config/editor-inline-tools'
import InlineCodeTool from '~~/editor/admin/tools/InlineCodeTool'
import { TextBackgroundToolConstructable } from '~~/editor/admin/tools/TextBackgroundTool'
import { TextColorToolConstructable } from '~~/editor/admin/tools/TextColorTool'
import { CtaToolConstructable } from '~~/editor/admin/tools/blocks/CtaTool'
import { getCurrentEditorMessages } from '~~/i18n/editor'

export const nestedRichFieldInlineToolbar = editorInlineToolbar

export interface NestedParagraphToolsOptions {
  allowCta?: boolean
}

export interface NestedColumnToolsOptions {
  allowRawHtml?: boolean
}

export async function createNestedParagraphTools(
  options: NestedParagraphToolsOptions = {},
): Promise<EditorConfig['tools']> {
  const [{ default: List }, inlineTools] = await Promise.all([
    import('@editorjs/list'),
    createNestedInlineTools(),
  ])

  const tools: EditorConfig['tools'] = {
    list: {
      class: List as unknown as ToolConstructable,
      inlineToolbar: nestedRichFieldInlineToolbar,
      config: {
        defaultStyle: 'unordered',
      },
    },
    ...inlineTools,
  }

  if (options.allowCta ?? true) {
    tools.cta = CtaToolConstructable
  }

  return tools
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

export async function createNestedColumnTools(
  options: NestedColumnToolsOptions = {},
): Promise<EditorConfig['tools']> {
  const [{ default: Header }, { default: List }, inlineTools] =
    await Promise.all([
      import('@editorjs/header'),
      import('@editorjs/list'),
      createNestedInlineTools(),
    ])

  const tools: EditorConfig['tools'] = {
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

  if (options.allowRawHtml ?? false) {
    tools.rawHtml = {
      class: RawTool as unknown as ToolConstructable,
      config: {
        placeholder: getCurrentEditorMessages().tools.rawHtml.htmlPlaceholder,
      },
    }
  }

  return tools
}

async function createNestedInlineTools(): Promise<EditorConfig['tools']> {
  const [
    { default: Underline },
    { default: Strikethrough },
  ] = await Promise.all([
    import('@editorjs/underline'),
    import('@sotaproject/strikethrough'),
  ])

  return {
    textBackground: {
      class: TextBackgroundToolConstructable as unknown as ToolConstructable,
      shortcut: inlineToolShortcuts.textBackground,
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
