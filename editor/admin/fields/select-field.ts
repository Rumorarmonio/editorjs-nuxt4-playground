import { createPlainFieldWrapper } from './field-ui'
import type { PlainFieldControl, PlainSelectFieldOptions } from './types'

export function createPlainSelectField<TValue extends string = string>(
  options: PlainSelectFieldOptions<TValue>,
): PlainFieldControl<TValue, HTMLSelectElement> {
  const select = document.createElement('select')

  select.className = 'editor-plain-field__control'
  select.name = options.name

  options.options.forEach((option) => {
    const optionElement = document.createElement('option')

    optionElement.value = option.value
    optionElement.textContent = option.label
    optionElement.disabled = Boolean(option.disabled)
    select.append(optionElement)
  })

  select.value = options.value

  select.addEventListener('change', () => {
    options.onChange(select.value as TValue)
  })

  const wrapper = createPlainFieldWrapper({
    ...options,
    control: select,
  })

  return {
    root: wrapper.root,
    control: select,
    getValue: () => select.value as TValue,
    setValue(value) {
      select.value = value
    },
    setError: wrapper.setError,
    setDisabled: wrapper.setDisabled,
    setReadOnly: wrapper.setReadOnly,
  }
}
