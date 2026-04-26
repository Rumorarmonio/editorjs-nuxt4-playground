import { createPlainFieldWrapper } from './field-ui'
import type { PlainFieldControl, PlainTextareaFieldOptions } from './types'

export function createPlainTextareaField(
  options: PlainTextareaFieldOptions,
): PlainFieldControl<string, HTMLTextAreaElement> {
  const textarea = document.createElement('textarea')

  textarea.className =
    'editor-plain-field__control editor-plain-field__control--textarea'
  textarea.name = options.name
  textarea.value = options.value
  textarea.placeholder = options.placeholder ?? ''
  textarea.rows = options.rows ?? 4

  textarea.addEventListener('input', () => {
    options.onChange(textarea.value)
  })

  const wrapper = createPlainFieldWrapper({
    ...options,
    control: textarea,
  })

  return {
    root: wrapper.root,
    control: textarea,
    getValue: () => textarea.value,
    setValue(value) {
      textarea.value = value
    },
    setError: wrapper.setError,
    setDisabled: wrapper.setDisabled,
    setReadOnly: wrapper.setReadOnly,
  }
}
