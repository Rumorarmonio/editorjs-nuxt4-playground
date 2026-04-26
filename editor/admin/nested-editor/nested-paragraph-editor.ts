import type EditorJS from '@editorjs/editorjs'
import type {
  EditorConfig,
  ToolConstructable,
} from '@editorjs/editorjs/types'
import InlineCodeTool from '~~/editor/admin/tools/InlineCodeTool'
import {
  normalizeSectionIntroDescriptionData,
  type SectionIntroDescriptionData,
} from '~~/editor/shared'

const nestedParagraphInlineToolbar = [
  'bold',
  'italic',
  'link',
  'underline',
  'marker',
  'strikethrough',
  'inlineCode',
] satisfies NonNullable<EditorConfig['inlineToolbar']>

export interface NestedParagraphEditorOptions {
  data: unknown
  readOnly: boolean
  placeholder?: string
  onChange?: () => void
}

export interface NestedParagraphEditor {
  holder: HTMLElement
  initialize: () => Promise<void>
  save: () => Promise<SectionIntroDescriptionData>
  destroy: () => void
}

export function createNestedParagraphEditor(
  options: NestedParagraphEditorOptions,
): NestedParagraphEditor {
  const initialData = normalizeSectionIntroDescriptionData(options.data)
  const holder = document.createElement('div')

  let editor: EditorJS | null = null
  let initializePromise: Promise<void> | null = null
  let isDestroyed = false

  holder.className = 'editor-nested-paragraph-editor'

  async function initialize(): Promise<void> {
    if (initializePromise) {
      return initializePromise
    }

    initializePromise = createEditor()

    return initializePromise
  }

  async function createEditor(): Promise<void> {
    const [{ default: EditorJS }, tools] = await Promise.all([
      import('@editorjs/editorjs'),
      createNestedParagraphTools(),
    ])

    if (isDestroyed) {
      return
    }

    const instance = new EditorJS({
      holder,
      data: cloneSectionIntroDescriptionData(initialData),
      tools,
      inlineToolbar: nestedParagraphInlineToolbar,
      readOnly: options.readOnly,
      minHeight: 0,
      placeholder: options.placeholder,
      onChange: () => {
        options.onChange?.()
      },
    })

    editor = instance
    await instance.isReady

    if (isDestroyed) {
      instance.destroy()

      if (editor === instance) {
        editor = null
      }
    }
  }

  async function save(): Promise<SectionIntroDescriptionData> {
    if (initializePromise) {
      await initializePromise
    }

    if (!editor) {
      return cloneSectionIntroDescriptionData(initialData)
    }

    const savedData: unknown = await editor.save()

    return normalizeSectionIntroDescriptionData(savedData)
  }

  function destroy(): void {
    isDestroyed = true

    if (!editor) {
      holder.replaceChildren()
      return
    }

    editor.destroy()
    editor = null
  }

  return {
    holder,
    initialize,
    save,
    destroy,
  }
}

async function createNestedParagraphTools(): Promise<EditorConfig['tools']> {
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

function cloneSectionIntroDescriptionData(
  data: SectionIntroDescriptionData,
): SectionIntroDescriptionData {
  return JSON.parse(JSON.stringify(data)) as SectionIntroDescriptionData
}
