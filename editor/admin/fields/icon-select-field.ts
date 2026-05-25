import Choices from 'choices.js'
import { waitForElementTransitionEnd } from './choices-close'
import { createPlainFieldWrapper } from './field-ui'
import type { PlainFieldControl, PlainFieldOption } from './types'

export interface IconSelectFieldOptions<TValue extends string = string> {
  name: string
  label: string
  value: TValue
  options: readonly PlainFieldOption<TValue>[]
  searchPlaceholder: string
  noResultsText: string
  noChoicesText: string
  readOnly?: boolean
  disabled?: boolean
  onChange: (value: TValue) => void
  getIconHref: (value: TValue) => string
}

export function createIconSelectField<TValue extends string = string>(
  options: IconSelectFieldOptions<TValue>,
): PlainFieldControl<TValue, HTMLSelectElement> {
  let currentValue = options.value
  let isReadOnly = Boolean(options.readOnly)
  let isDisabled = Boolean(options.disabled)
  let choices: Choices | null = null
  let pendingCloseCleanup: (() => void) | null = null
  const select = document.createElement('select')
  const summary = document.createElement('button')
  const dropdownHost = document.createElement('div')
  const summaryIcon = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg',
  )
  const summaryUse = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'use',
  )
  const summaryLabel = document.createElement('span')

  select.className = 'editor-plain-field__control editor-select__control'
  select.name = options.name
  select.tabIndex = 0
  select.hidden = true

  options.options.forEach((option) => {
    const optionElement = document.createElement('option')

    optionElement.value = option.value
    optionElement.textContent = option.label
    optionElement.disabled = Boolean(option.disabled)
    select.append(optionElement)
  })

  select.value = currentValue
  summary.type = 'button'
  summary.className = 'editor-select__summary'
  summary.disabled = isDisabled || isReadOnly
  summary.setAttribute('aria-label', options.label)
  summaryIcon.classList.add('editor-icon-select__summary-icon')
  summaryIcon.setAttribute('width', '20px')
  summaryIcon.setAttribute('height', '20px')
  summaryIcon.setAttribute('aria-hidden', 'true')
  summaryIcon.setAttribute('focusable', 'false')
  summaryLabel.className = 'editor-select__summary-label'
  dropdownHost.className = 'editor-select__dropdown-host'
  summaryIcon.append(summaryUse)
  summary.append(summaryIcon, summaryLabel)

  const wrapper = createPlainFieldWrapper({
    ...options,
    control: select,
  })
  const labelElement = wrapper.root.querySelector<HTMLLabelElement>(
    '.editor-plain-field__label',
  )

  summary.id = `${select.id}-summary`
  if (labelElement) {
    labelElement.htmlFor = summary.id
  }
  wrapper.root.classList.add('editor-select', 'editor-icon-select')
  wrapper.root.addEventListener('keydown', stopKeyboardEventPropagation)
  select.after(summary)
  summary.after(dropdownHost)
  syncSummaryAccessibility()
  updateSummary()

  const openChoices = () => {
    if (choices || isDisabled || isReadOnly) {
      return
    }

    select.hidden = false
    choices = new Choices(select, {
      allowHTML: true,
      duplicateItemsAllowed: false,
      itemSelectText: '',
      noChoicesText: options.noChoicesText,
      noResultsText: options.noResultsText,
      placeholder: false,
      position: 'bottom',
      renderSelectedChoices: 'always',
      searchEnabled: true,
      searchFields: ['label', 'value'],
      searchPlaceholderValue: options.searchPlaceholder,
      shouldSort: false,
      callbackOnCreateTemplates: (strToEl, escapeForTemplate, getClassNames) => {
        return {
          item: (templateOptions, choice) => {
            return strToEl(
              createIconSelectChoiceMarkup({
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
                iconHref: options.getIconHref(choice.value as TValue),
                label: escapeForTemplate(true, choice.label),
                mode: 'item',
              }),
            ) as HTMLDivElement
          },
          choice: (templateOptions, choice, selectText) => {
            return strToEl(
              createIconSelectChoiceMarkup({
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
                iconHref: options.getIconHref(choice.value as TValue),
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
    wrapper.root.classList.add('editor-select--open')
    choices.setChoiceByValue(currentValue)
    select.addEventListener('hideDropdown', handleChoicesHide)
    window.requestAnimationFrame(() => {
      choices?.showDropdown()
    })
  }

  const closeChoices = (restoreFocus = false) => {
    if (!choices) {
      return
    }

    pendingCloseCleanup?.()
    pendingCloseCleanup = null
    select.removeEventListener('hideDropdown', handleChoicesHide)
    choices.destroy()
    choices = null
    wrapper.root.classList.remove('editor-select--open')
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

    wrapper.root.classList.remove('editor-select--open')
    select.hidden = true

    pendingCloseCleanup?.()
    pendingCloseCleanup = waitForElementTransitionEnd(dropdownElement, () => {
      closeChoices(true)
    })
  }

  select.addEventListener('change', () => {
    if (isDisabled || isReadOnly) {
      choices?.setChoiceByValue(currentValue)
      return
    }

    currentValue = select.value as TValue
    updateSummary()
    options.onChange(currentValue)
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

  return {
    root: wrapper.root,
    control: select,
    getValue: () => currentValue,
    setValue(value) {
      currentValue = value
      select.value = value
      choices?.setChoiceByValue(value)
      updateSummary()
    },
    setError(error) {
      wrapper.setError(error)
      syncSummaryAccessibility()
    },
    setDisabled(disabled) {
      isDisabled = disabled
      wrapper.setDisabled(disabled)
      summary.disabled = isDisabled || isReadOnly
      if (isDisabled) {
        closeChoices()
      }
    },
    setReadOnly(readOnly) {
      isReadOnly = readOnly
      wrapper.setReadOnly(readOnly)
      summary.disabled = isDisabled || isReadOnly
      if (isReadOnly) {
        closeChoices()
      }
    },
    destroy() {
      closeChoices()
    },
  }

  function updateSummary(): void {
    const selectedOption = options.options.find(
      (option) => option.value === currentValue,
    )
    const iconHref = options.getIconHref(currentValue)

    summaryLabel.textContent = selectedOption?.label ?? currentValue

    if (!iconHref) {
      summaryUse.removeAttribute('href')
      summaryIcon.toggleAttribute('hidden', true)
      return
    }

    summaryUse.setAttribute('href', iconHref)
    summaryIcon.toggleAttribute('hidden', false)
  }

  function syncSummaryAccessibility(): void {
    const describedBy = select.getAttribute('aria-describedby')
    const invalid = select.getAttribute('aria-invalid')

    if (describedBy) {
      summary.setAttribute('aria-describedby', describedBy)
    } else {
      summary.removeAttribute('aria-describedby')
    }

    if (invalid) {
      summary.setAttribute('aria-invalid', invalid)
      select.removeAttribute('aria-invalid')
    } else {
      summary.removeAttribute('aria-invalid')
    }
  }
}

interface CreateIconSelectChoiceMarkupOptions {
  choice: IconSelectChoice
  className: string
  iconHref: string
  label: string
  mode: 'choice' | 'item'
  selectText?: string
}

interface IconSelectChoice {
  active: boolean
  disabled: boolean
  highlighted: boolean
  id: number
  placeholder: boolean
  selected: boolean
  value: string
}

function createIconSelectChoiceMarkup({
  choice,
  className,
  iconHref,
  label,
  mode,
  selectText,
}: CreateIconSelectChoiceMarkupOptions): string {
  const isChoice = mode === 'choice'
  const attributes = [
    isChoice ? 'data-choice' : 'data-item',
    isChoice
      ? choice.disabled
        ? 'data-choice-disabled aria-disabled="true"'
        : 'data-choice-selectable'
      : '',
    `data-id="${choice.id}"`,
    `data-value="${escapeHtmlAttribute(choice.value)}"`,
    choice.selected ? 'aria-selected="true"' : '',
    !isChoice && choice.disabled ? 'aria-disabled="true"' : '',
    isChoice ? `data-select-text="${escapeHtmlAttribute(selectText ?? '')}"` : '',
    isChoice ? 'role="option"' : 'role="option"',
  ]
    .filter(Boolean)
    .join(' ')

  return `
    <div class="${className} editor-select__option editor-icon-select__option" ${attributes}>
      ${createIconMarkup(iconHref)}
      <span class="editor-select__option-label editor-icon-select__option-label">${label}</span>
    </div>
  `
}

function createIconMarkup(iconHref: string): string {
  if (!iconHref) {
    return '<span class="editor-icon-select__option-icon editor-icon-select__option-icon--empty" aria-hidden="true"></span>'
  }

  return `
    <svg class="editor-icon-select__option-icon" width="20px" height="20px" aria-hidden="true" focusable="false">
      <use href="${escapeHtmlAttribute(iconHref)}"></use>
    </svg>
  `
}

function stopKeyboardEventPropagation(event: KeyboardEvent): void {
  event.stopPropagation()
}

function escapeHtmlAttribute(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}
