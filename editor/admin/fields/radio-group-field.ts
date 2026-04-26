import { createPlainFieldGroupWrapper } from './field-ui'
import type {
  PlainFieldControl,
  PlainRadioGroupFieldOptions,
} from './types'

export function createPlainRadioGroupField<TValue extends string = string>(
  options: PlainRadioGroupFieldOptions<TValue>,
): PlainFieldControl<TValue, HTMLDivElement> {
  let currentValue = options.value
  let isReadOnly = Boolean(options.readOnly)
  const group = document.createElement('div')

  group.className = 'editor-plain-field__radio-group'
  group.setAttribute('role', 'radiogroup')

  options.options.forEach((option) => {
    const label = document.createElement('label')
    const input = document.createElement('input')
    const text = document.createElement('span')

    label.className = 'editor-plain-field__radio'
    input.className = 'editor-plain-field__radio-input'
    input.type = 'radio'
    input.name = options.name
    input.value = option.value
    input.checked = option.value === options.value
    input.disabled = Boolean(option.disabled)
    input.toggleAttribute('aria-readonly', isReadOnly)
    text.className = 'editor-plain-field__radio-label'
    text.textContent = option.label

    input.addEventListener('click', (event) => {
      if (!isReadOnly) {
        return
      }

      event.preventDefault()
    })

    input.addEventListener('change', () => {
      if (!input.checked) {
        return
      }

      currentValue = input.value as TValue
      options.onChange(currentValue)
    })

    label.append(input, text)
    group.append(label)
  })

  const wrapper = createPlainFieldGroupWrapper({
    ...options,
    content: group,
  })

  return {
    root: wrapper.root,
    control: group,
    getValue: () => currentValue,
    setValue(value) {
      currentValue = value

      group
        .querySelectorAll<HTMLInputElement>('input[type="radio"]')
        .forEach((input) => {
          input.checked = input.value === value
        })
    },
    setError: wrapper.setError,
    setDisabled: wrapper.setDisabled,
    setReadOnly(readOnly) {
      isReadOnly = readOnly
      group.dataset.readonly = String(readOnly)
      group
        .querySelectorAll<HTMLInputElement>('input[type="radio"]')
        .forEach((input) => {
          input.toggleAttribute('aria-readonly', readOnly)
        })
      wrapper.setReadOnly(readOnly)
    },
  }
}
