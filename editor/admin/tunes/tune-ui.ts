import Choices from 'choices.js'
import { waitForElementTransitionEnd } from '../fields/choices-close'
import { createCustomSelectChoiceMarkup } from '../fields/custom-select-markup'

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

export interface TuneSelectControl extends HTMLDivElement {
  destroy: () => void
}

export interface TuneToggleOptions {
  label: string
  value: boolean
  onChange: (value: boolean) => void
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
}: TuneSelectOptions): TuneSelectControl {
  const field = document.createElement('div') as TuneSelectControl
  const select = document.createElement('select')
  const summary = document.createElement('button')
  const summaryLabel = document.createElement('span')
  const dropdownHost = document.createElement('div')
  let currentValue = value
  let choices: Choices | null = null
  let pendingCloseCleanup: (() => void) | null = null

  field.className = 'editor-block-tune-field editor-select editor-select--compact'

  const labelElement = document.createElement('span')
  labelElement.className = 'editor-block-tune-field__label'
  labelElement.textContent = label

  select.className = 'editor-block-tune-field__control editor-select__control'
  select.hidden = true

  options.forEach((option) => {
    const optionElement = document.createElement('option')
    optionElement.value = option.value
    optionElement.textContent = option.label
    select.append(optionElement)
  })

  select.value = currentValue
  summary.type = 'button'
  summary.className = 'editor-select__summary'
  summary.setAttribute('aria-label', label)
  summary.setAttribute('aria-haspopup', 'listbox')
  summary.setAttribute('aria-expanded', 'false')
  summaryLabel.className = 'editor-select__summary-label'
  dropdownHost.className = 'editor-select__dropdown-host'
  summary.append(summaryLabel)
  updateSummary()

  select.addEventListener('change', () => {
    currentValue = select.value
    updateSummary()
    onChange(currentValue)
  })
  summary.addEventListener('click', openChoices)
  summary.addEventListener('keydown', (event) => {
    if (
      event.key !== 'Enter' &&
      event.key !== ' ' &&
      event.key !== 'ArrowDown'
    ) {
      return
    }

    event.preventDefault()
    openChoices()
  })

  stopTuneBubbleEvents(field)
  field.append(labelElement, select, summary, dropdownHost)
  field.destroy = () => closeChoices()

  return field

  function openChoices(): void {
    if (choices) {
      return
    }

    select.hidden = false
    choices = new Choices(select, {
      allowHTML: true,
      duplicateItemsAllowed: false,
      itemSelectText: '',
      noChoicesText: '',
      placeholder: false,
      position: 'bottom',
      renderSelectedChoices: 'always',
      searchEnabled: false,
      shouldSort: false,
      callbackOnCreateTemplates: (strToEl, escapeForTemplate, getClassNames) => {
        return {
          item: (templateOptions, choice) => {
            return strToEl(
              createCustomSelectChoiceMarkup({
                choice,
                className: [
                  getClassNames(templateOptions.classNames.item),
                  getClassNames(
                    choice.highlighted
                      ? templateOptions.classNames.highlightedState
                      : templateOptions.classNames.itemSelectable,
                  ),
                  choice.placeholder
                    ? getClassNames(templateOptions.classNames.placeholder)
                    : '',
                  choice.selected
                    ? getClassNames(templateOptions.classNames.selectedState)
                    : '',
                ]
                  .filter(Boolean)
                  .join(' '),
                label: escapeForTemplate(true, choice.label),
                mode: 'item',
              }),
            ) as HTMLDivElement
          },
          choice: (templateOptions, choice, selectText) => {
            return strToEl(
              createCustomSelectChoiceMarkup({
                choice,
                className: [
                  getClassNames(templateOptions.classNames.item),
                  getClassNames(templateOptions.classNames.itemChoice),
                  getClassNames(
                    choice.disabled
                      ? templateOptions.classNames.itemDisabled
                      : templateOptions.classNames.itemSelectable,
                  ),
                  choice.selected
                    ? getClassNames(templateOptions.classNames.selectedState)
                    : '',
                ]
                  .filter(Boolean)
                  .join(' '),
                label: escapeForTemplate(true, choice.label),
                mode: 'choice',
                selectText: escapeForTemplate(true, selectText),
              }),
            ) as HTMLDivElement
          },
        }
      },
    })

    dropdownHost.append(choices.containerOuter.element)
    field.classList.add('editor-select--open')
    summary.setAttribute('aria-expanded', 'true')
    choices.setChoiceByValue(currentValue)
    select.addEventListener('hideDropdown', handleChoicesHide)
    window.requestAnimationFrame(() => {
      choices?.showDropdown()
    })
  }

  function closeChoices(restoreFocus = false): void {
    if (!choices) {
      return
    }

    pendingCloseCleanup?.()
    pendingCloseCleanup = null
    select.removeEventListener('hideDropdown', handleChoicesHide)
    choices.destroy()
    choices = null
    field.classList.remove('editor-select--open')
    summary.setAttribute('aria-expanded', 'false')
    select.hidden = true
    if (restoreFocus) {
      summary.focus()
    }
    updateSummary()
  }

  function handleChoicesHide(): void {
    if (!choices) {
      return
    }

    const dropdownElement = choices.containerOuter.element.querySelector<HTMLElement>(
      '.choices__list--dropdown',
    )

    field.classList.remove('editor-select--open')
    summary.setAttribute('aria-expanded', 'false')
    select.hidden = true

    pendingCloseCleanup?.()
    pendingCloseCleanup = waitForElementTransitionEnd(dropdownElement, () => {
      closeChoices(true)
    })
  }

  function updateSummary(): void {
    const selectedOption = options.find((option) => option.value === currentValue)

    summaryLabel.textContent = selectedOption?.label ?? currentValue
  }
}

export function createTuneToggleField({
  label,
  value,
  onChange,
}: TuneToggleOptions): HTMLDivElement {
  const field = document.createElement('div')
  const button = document.createElement('button')
  const track = document.createElement('span')
  const thumb = document.createElement('span')
  const labelElement = document.createElement('span')
  let currentValue = value

  field.className = 'editor-block-tune-field editor-block-tune-field--toggle'
  field.contentEditable = 'false'
  button.className = 'editor-block-tune-toggle'
  button.type = 'button'
  button.setAttribute('role', 'switch')
  button.setAttribute('aria-label', label)
  track.className = 'editor-plain-field__toggle-track'
  thumb.className = 'editor-plain-field__toggle-thumb'
  labelElement.className = 'editor-block-tune-field__label'
  labelElement.textContent = label

  syncTuneToggle(button, currentValue)

  function toggleValue(): void {
    currentValue = !currentValue
    syncTuneToggle(button, currentValue)
    onChange(currentValue)
  }

  field.addEventListener(
    'click',
    (event) => {
      stopTuneEventPropagation(event)
      toggleValue()
    },
    true,
  )
  stopTuneEvents(button)

  track.append(thumb)
  button.append(track)
  field.append(labelElement, button)

  return field
}

function stopTuneEventPropagation(event: Event): void {
  event.stopImmediatePropagation()
  event.stopPropagation()
}

function stopTuneEvents(element: HTMLElement): void {
  ;[
    'pointerdown',
    'pointerup',
    'mousedown',
    'mouseup',
    'keydown',
    'keyup',
  ].forEach((eventName) => {
    element.addEventListener(eventName, stopTuneEventPropagation, true)
  })
}

function stopTuneBubbleEvents(element: HTMLElement): void {
  ;[
    'pointerdown',
    'pointerup',
    'mousedown',
    'mouseup',
    'keydown',
    'keyup',
  ].forEach((eventName) => {
    element.addEventListener(eventName, stopTuneEventPropagation)
  })
}

function syncTuneToggle(button: HTMLButtonElement, value: boolean): void {
  button.setAttribute('aria-checked', String(value))
  button.classList.toggle('editor-block-tune-toggle--checked', value)
}
