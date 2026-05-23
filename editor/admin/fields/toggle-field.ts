import { createPlainFieldWrapper } from './field-ui'
import type { PlainFieldControl, PlainToggleFieldOptions } from './types'

export function createPlainToggleField(
  options: PlainToggleFieldOptions,
): PlainFieldControl<boolean, HTMLInputElement> {
  const input = document.createElement('input')
  const toggle = document.createElement('label')
  const isInlineLabel = Boolean(options.inlineLabel)
  let currentValue = options.value
  let isReadOnly = Boolean(options.readOnly)

  input.className = 'editor-plain-field__toggle-input'
  input.type = 'checkbox'
  input.name = options.name
  input.checked = currentValue
  input.disabled = Boolean(options.disabled)
  input.tabIndex = 0
  input.toggleAttribute('aria-readonly', isReadOnly)

  toggle.className = 'editor-plain-field__toggle'
  toggle.append(input, createToggleTrack())

  input.addEventListener('click', (event) => {
    if (!isReadOnly) {
      return
    }

    event.preventDefault()
  })

  input.addEventListener('keydown', (event) => {
    if (!isReadOnly || event.key === 'Tab') {
      return
    }

    event.preventDefault()
  })

  input.addEventListener('change', () => {
    if (isReadOnly) {
      input.checked = currentValue
      return
    }

    currentValue = input.checked
    options.onChange(currentValue)
  })

  const wrapper = createPlainFieldWrapper({
    ...options,
    control: toggle,
  })
  const controlId = toggle.id

  input.id = controlId
  toggle.removeAttribute('id')
  wrapper.root.classList.toggle(
    'editor-plain-field--toggle-inline',
    isInlineLabel,
  )

  if (isInlineLabel) {
    wrapper.root.insertBefore(toggle, wrapper.root.firstChild)
  }

  syncToggleState(toggle, input)

  return {
    root: wrapper.root,
    control: input,
    getValue: () => currentValue,
    setValue(value) {
      currentValue = value
      input.checked = value
    },
    setError(error) {
      wrapper.setError(error)
      syncToggleState(toggle, input)
    },
    setDisabled(disabled) {
      input.disabled = disabled
      wrapper.setDisabled(disabled)
    },
    setReadOnly(readOnly) {
      isReadOnly = readOnly
      input.toggleAttribute('aria-readonly', readOnly)
      input.classList.toggle(
        'editor-plain-field__toggle-input--readonly',
        readOnly,
      )
      wrapper.setReadOnly(readOnly)
    },
  }
}

function createToggleTrack(): HTMLSpanElement {
  const track = document.createElement('span')
  const thumb = document.createElement('span')

  track.className = 'editor-plain-field__toggle-track'
  thumb.className = 'editor-plain-field__toggle-thumb'
  track.append(thumb)

  return track
}

function syncToggleState(
  toggle: HTMLLabelElement,
  input: HTMLInputElement,
): void {
  const description = toggle.getAttribute('aria-describedby')
  const invalid = toggle.getAttribute('aria-invalid')

  if (description) {
    input.setAttribute('aria-describedby', description)
  } else {
    input.removeAttribute('aria-describedby')
  }

  if (invalid) {
    input.setAttribute('aria-invalid', invalid)
    return
  }

  input.removeAttribute('aria-invalid')
}
