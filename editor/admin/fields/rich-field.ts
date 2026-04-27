import { createPlainFieldWrapper } from './field-ui'
import {
  createNestedHeaderTools,
  createNestedParagraphTools,
  createNestedRichEditor,
  nestedRichFieldInlineToolbar,
  type NestedRichEditor,
} from '~~/editor/admin/nested-editor'
import {
  normalizeRichHeaderFieldData,
  normalizeRichParagraphFieldData,
  type EditorOutputBlock,
  type EditorOutputData,
  type RichHeaderFieldData,
  type RichParagraphFieldData,
} from '~~/editor/shared'

interface RichFieldBaseOptions<TValue> {
  name: string
  label: string
  value: TValue
  hint?: string
  error?: string
  readOnly?: boolean
  placeholder?: string
  onChange: () => void
}

export interface RichFieldControl<TValue> {
  root: HTMLElement
  holder: HTMLElement
  initialize: () => Promise<void>
  save: () => Promise<TValue>
  destroy: () => void
  setError: (error?: string) => void
}

export type RichParagraphFieldOptions =
  RichFieldBaseOptions<RichParagraphFieldData>

export type RichHeaderFieldOptions = RichFieldBaseOptions<RichHeaderFieldData>

export function createRichParagraphField(
  options: RichParagraphFieldOptions,
): RichFieldControl<RichParagraphFieldData> {
  const editor = createNestedRichEditor({
    data: options.value,
    readOnly: Boolean(options.readOnly),
    className: 'editor-rich-field__editor editor-rich-field__editor--paragraph',
    inlineToolbar: nestedRichFieldInlineToolbar,
    normalizeData: normalizeRichParagraphFieldData,
    createTools: createNestedParagraphTools,
    placeholder: options.placeholder,
    onChange: options.onChange,
  })

  return createRichFieldControl({
    options,
    editor,
  })
}

export function createRichHeaderField(
  options: RichHeaderFieldOptions,
): RichFieldControl<RichHeaderFieldData> {
  const editor = createNestedRichEditor({
    data: options.value,
    readOnly: Boolean(options.readOnly),
    className: 'editor-rich-field__editor editor-rich-field__editor--header',
    inlineToolbar: nestedRichFieldInlineToolbar,
    normalizeData: normalizeRichHeaderFieldData,
    createTools: createNestedHeaderTools,
    defaultBlock: 'header',
    placeholder: options.placeholder,
    onChange: options.onChange,
  })

  return createRichFieldControl({
    options,
    editor,
  })
}

function createRichFieldControl<
  TValue extends EditorOutputData<EditorOutputBlock>,
>({
  options,
  editor,
}: {
  options: RichFieldBaseOptions<TValue>
  editor: NestedRichEditor<TValue>
}): RichFieldControl<TValue> {
  const wrapper = createPlainFieldWrapper({
    name: options.name,
    label: options.label,
    hint: options.hint,
    error: options.error,
    readOnly: options.readOnly,
    control: editor.holder,
  })

  return {
    root: wrapper.root,
    holder: editor.holder,
    initialize: editor.initialize,
    async save() {
      return editor.save()
    },
    destroy: editor.destroy,
    setError: wrapper.setError,
  }
}
