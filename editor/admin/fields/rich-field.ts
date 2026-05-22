import { createPlainFieldWrapper } from './field-ui'
import {
  createNestedHeaderTools,
  createNestedParagraphTools,
  createNestedRichEditor,
  nestedRichFieldInlineToolbar,
  type NestedRichEditor,
} from '~~/editor/admin/nested-editor'
import {
  type EditorOutputBlock,
  normalizeRichHeaderFieldData,
  normalizeRichParagraphFieldData,
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

export type InlineHtmlFieldOptions = RichFieldBaseOptions<string> & {
  allowLineBreaks?: boolean
}

export type RichParagraphFieldOptions =
  RichFieldBaseOptions<RichParagraphFieldData> & {
    allowCta?: boolean
  }

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
    createTools: () => createNestedParagraphTools({ allowCta: options.allowCta }),
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

export function createInlineHtmlField(
  options: InlineHtmlFieldOptions,
): RichFieldControl<string> {
  const allowLineBreaks = options.allowLineBreaks ?? true
  const control = document.createElement('div')
  const wrapper = createPlainFieldWrapper({
    ...options,
    control,
  })

  control.className = 'editor-rich-field__editor editor-rich-field__editor--inline'
  control.contentEditable = String(!options.readOnly)
  control.tabIndex = options.readOnly ? -1 : 0
  control.setAttribute('role', 'textbox')
  control.setAttribute('aria-multiline', String(allowLineBreaks))
  control.innerHTML = normalizeInlineHtmlValue(options.value, allowLineBreaks)

  if (options.placeholder) {
    control.dataset.placeholder = options.placeholder
  }

  const handleInput = () => {
    clearEmptyEditable(control)
    options.onChange()
  }
  const handleKeydown = (event: KeyboardEvent) => {
    if (allowLineBreaks || event.key !== 'Enter') {
      return
    }

    event.preventDefault()
  }
  const handlePaste = (event: ClipboardEvent) => {
    if (allowLineBreaks) {
      return
    }

    const text = event.clipboardData?.getData('text/plain')

    if (!text) {
      return
    }

    event.preventDefault()
    event.stopImmediatePropagation()
    insertPlainText(control, text.replace(/\s+/g, ' ').trim())
    options.onChange()
  }

  control.addEventListener('input', handleInput)
  control.addEventListener('keydown', handleKeydown)
  control.addEventListener('paste', handlePaste, true)

  return {
    root: wrapper.root,
    holder: control,
    async initialize() {},
    async save() {
      return getInlineHtmlFromEditable(control, allowLineBreaks)
    },
    destroy() {
      control.removeEventListener('input', handleInput)
      control.removeEventListener('keydown', handleKeydown)
      control.removeEventListener('paste', handlePaste, true)
    },
    setError: wrapper.setError,
  }
}

function createRichFieldControl<
  TValue extends EditorOutputData<EditorOutputBlock>,
>({
  options,
  editor,
}: {
  options: RichFieldBaseOptions<unknown>
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

function getInlineHtmlFromEditable(
  control: HTMLElement,
  allowLineBreaks: boolean,
): string {
  if (!control.textContent?.trim()) {
    return ''
  }

  return normalizeInlineHtmlValue(control.innerHTML, allowLineBreaks)
}

function normalizeInlineHtmlValue(
  value: string,
  allowLineBreaks: boolean,
): string {
  const html = value
    .replaceAll(/<(div|p)(\s[^>]*)?>/gi, '')
    .replaceAll(/<\/(div|p)>/gi, '<br>')
    .replaceAll(/(<br\s*\/?>\s*)+$/gi, '')

  if (allowLineBreaks) {
    return html.trim()
  }

  return html.replaceAll(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim()
}

function clearEmptyEditable(control: HTMLElement): void {
  if (control.textContent?.trim()) {
    return
  }

  control.replaceChildren()
}

function insertPlainText(control: HTMLElement, text: string): void {
  if (!text) {
    return
  }

  const selection = window.getSelection()

  if (!selection?.rangeCount) {
    control.append(document.createTextNode(text))
    return
  }

  const range = selection.getRangeAt(0)

  if (!control.contains(range.commonAncestorContainer)) {
    control.append(document.createTextNode(text))
    return
  }

  const textNode = document.createTextNode(text)

  range.deleteContents()
  range.insertNode(textNode)
  range.setStartAfter(textNode)
  range.collapse(true)
  selection.removeAllRanges()
  selection.addRange(range)
}
