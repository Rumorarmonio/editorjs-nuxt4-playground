import { createPlainFieldWrapper } from './field-ui'
import type { PlainFieldControl, PlainToggleFieldOptions } from './types'

export function createPlainToggleField(
  options: PlainToggleFieldOptions,
): PlainFieldControl<boolean, HTMLInputElement> {
  const input = document.createElement('input')
  const toggle = document.createElement('span')
  let isReadOnly = Boolean(options.readOnly)

  input.className = 'editor-plain-field__toggle-input'
  input.type = 'checkbox'
  input.name = options.name
  input.checked = options.value
  input.disabled = Boolean(options.disabled)
  input.toggleAttribute('aria-readonly', isReadOnly)

  toggle.className = 'editor-plain-field__toggle'
  toggle.append(input, createToggleTrack())

  input.addEventListener('click', (event) => {
    if (!isReadOnly) {
      return
    }

    event.preventDefault()
  })

  input.addEventListener('change', () => {
    options.onChange(input.checked)
  })

  const wrapper = createPlainFieldWrapper({
    ...options,
    control: toggle,
  })
  const controlId = toggle.id

  input.id = controlId
  toggle.removeAttribute('id')

  syncToggleDescription(toggle, input)

  return {
    root: wrapper.root,
    control: input,
    getValue: () => input.checked,
    setValue(value) {
      input.checked = value
    },
    setError(error) {
      wrapper.setError(error)
      syncToggleDescription(toggle, input)
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

function syncToggleDescription(
  toggle: HTMLSpanElement,
  input: HTMLInputElement,
): void {
  const description = toggle.getAttribute('aria-describedby')

  if (description) {
    input.setAttribute('aria-describedby', description)
    return
  }

  input.removeAttribute('aria-describedby')
}
