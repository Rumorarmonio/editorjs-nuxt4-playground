import type {
  EditorConfig,
  ToolConstructable,
} from '@editorjs/editorjs/types'
import InlineCodeTool from '~~/editor/admin/tools/InlineCodeTool'

export const nestedRichFieldInlineToolbar = [
  'bold',
  'italic',
  'link',
  'underline',
  'marker',
  'strikethrough',
  'inlineCode',
] satisfies NonNullable<EditorConfig['inlineToolbar']>

export async function createNestedParagraphTools(): Promise<
  EditorConfig['tools']
> {
  return createNestedInlineTools()
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
      shortcut: 'CMD+SHIFT+M',
    },
    underline: Underline as unknown as ToolConstructable,
    inlineCode: {
      class: InlineCodeTool as unknown as ToolConstructable,
      shortcut: 'CMD+SHIFT+C',
    },
    strikethrough: Strikethrough as unknown as ToolConstructable,
  }
}
