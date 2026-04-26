import { applyFieldControlState, createPlainFieldWrapper } from './field-ui'
import type { PlainFieldControl, PlainTextFieldOptions } from './types'

export function createPlainTextField(
  options: PlainTextFieldOptions,
): PlainFieldControl<string, HTMLInputElement> {
  const input = document.createElement('input')

  input.className = 'editor-plain-field__control'
  input.type = 'text'
  input.name = options.name
  input.value = options.value
  input.placeholder = options.placeholder ?? ''

  if (options.autocomplete) {
    input.setAttribute('autocomplete', options.autocomplete)
  }

  if (options.inputMode) {
    input.inputMode = options.inputMode
  }

  input.addEventListener('input', () => {
    options.onChange(input.value)
  })

  const wrapper = createPlainFieldWrapper({
    ...options,
    control: input,
  })

  return {
    root: wrapper.root,
    control: input,
    getValue: () => input.value,
    setValue(value) {
      input.value = value
    },
    setError: wrapper.setError,
    setDisabled: wrapper.setDisabled,
    setReadOnly: wrapper.setReadOnly,
  }
}

export function createPlainUrlField(
  options: PlainTextFieldOptions,
): PlainFieldControl<string, HTMLInputElement> {
  const field = createPlainTextField({
    ...options,
    inputMode: options.inputMode ?? 'url',
  })

  field.control.type = 'url'
  field.control.setAttribute('autocomplete', options.autocomplete ?? 'url')

  applyFieldControlState(
    field.control,
    Boolean(options.disabled),
    Boolean(options.readOnly),
  )

  return field
}
