import type EditorJS from '@editorjs/editorjs'
import type { EditorConfig } from '@editorjs/editorjs/types'
import type {
  EditorOutputBlock,
  EditorOutputData,
} from '~~/editor/shared'

export interface NestedRichEditorOptions<
  TData extends EditorOutputData<EditorOutputBlock>,
> {
  data: unknown
  readOnly: boolean
  className: string
  normalizeData: (value: unknown) => TData
  createTools: () => Promise<EditorConfig['tools']>
  placeholder?: string
  inlineToolbar?: EditorConfig['inlineToolbar']
  defaultBlock?: string
  onChange?: () => void
}

export interface NestedRichEditor<
  TData extends EditorOutputData<EditorOutputBlock>,
> {
  holder: HTMLElement
  initialize: () => Promise<void>
  save: () => Promise<TData>
  destroy: () => void
}

export function createNestedRichEditor<
  TData extends EditorOutputData<EditorOutputBlock>,
>(options: NestedRichEditorOptions<TData>): NestedRichEditor<TData> {
  const initialData = options.normalizeData(options.data)
  const holder = document.createElement('div')

  let editor: EditorJS | null = null
  let initializePromise: Promise<void> | null = null
  let isDestroyed = false

  holder.className = options.className
  holder.addEventListener('keydown', stopNestedKeyboardEvent)
  holder.addEventListener('keyup', stopNestedKeyboardEvent)

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
      options.createTools(),
    ])

    if (isDestroyed) {
      return
    }

    const instance = new EditorJS({
      holder,
      data: cloneRichEditorData(initialData),
      tools,
      inlineToolbar: options.inlineToolbar,
      defaultBlock: options.defaultBlock,
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

  async function save(): Promise<TData> {
    if (initializePromise) {
      await initializePromise
    }

    if (!editor) {
      return cloneRichEditorData(initialData)
    }

    const savedData: unknown = await editor.save()

    return options.normalizeData(savedData)
  }

  function destroy(): void {
    isDestroyed = true
    holder.removeEventListener('keydown', stopNestedKeyboardEvent)
    holder.removeEventListener('keyup', stopNestedKeyboardEvent)

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

function stopNestedKeyboardEvent(event: KeyboardEvent): void {
  event.stopPropagation()
}

function cloneRichEditorData<TData extends EditorOutputData<EditorOutputBlock>>(
  data: TData,
): TData {
  return JSON.parse(JSON.stringify(data)) as TData
}
