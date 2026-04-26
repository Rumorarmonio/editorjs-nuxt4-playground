export interface TuneFieldOptions {
  label: string
  value: string
  placeholder?: string
  onInput: (value: string) => void
}

export interface TuneSelectOptions {
  label: string
  value: string
  options: readonly {
    label: string
    value: string
  }[]
  onChange: (value: string) => void
}

export function createTunePanel(title: string): HTMLDivElement {
  const panel = document.createElement('div')
  panel.className = 'editor-block-tune-panel'

  const heading = document.createElement('p')
  heading.className = 'editor-block-tune-panel__title'
  heading.textContent = title

  panel.append(heading)

  return panel
}

export function createTuneTextField({
  label,
  value,
  placeholder,
  onInput,
}: TuneFieldOptions): HTMLLabelElement {
  const field = document.createElement('label')
  field.className = 'editor-block-tune-field'

  const labelElement = document.createElement('span')
  labelElement.className = 'editor-block-tune-field__label'
  labelElement.textContent = label

  const input = document.createElement('input')
  input.className = 'editor-block-tune-field__control'
  input.type = 'text'
  input.value = value
  input.placeholder = placeholder ?? ''

  input.addEventListener('input', () => {
    onInput(input.value)
  })

  field.append(labelElement, input)

  return field
}

export function createTuneSelectField({
  label,
  value,
  options,
  onChange,
}: TuneSelectOptions): HTMLLabelElement {
  const field = document.createElement('label')
  field.className = 'editor-block-tune-field'

  const labelElement = document.createElement('span')
  labelElement.className = 'editor-block-tune-field__label'
  labelElement.textContent = label

  const select = document.createElement('select')
  select.className = 'editor-block-tune-field__control'
  select.value = value

  options.forEach((option) => {
    const optionElement = document.createElement('option')
    optionElement.value = option.value
    optionElement.textContent = option.label
    select.append(optionElement)
  })

  select.addEventListener('change', () => {
    onChange(select.value)
  })

  field.append(labelElement, select)

  return field
}
