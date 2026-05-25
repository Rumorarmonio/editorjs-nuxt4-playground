import Choices from 'choices.js'
import { createCustomSelectChoiceMarkup } from './custom-select-markup'
import { waitForElementTransitionEnd } from './choices-close'
import { createPlainFieldWrapper } from './field-ui'
import type { PlainFieldControl, PlainSelectFieldOptions } from './types'

export function createPlainSelectField<TValue extends string = string>(
  options: PlainSelectFieldOptions<TValue>,
): PlainFieldControl<TValue, HTMLSelectElement> {
  let currentValue = options.value
  let isReadOnly = Boolean(options.readOnly)
  let isDisabled = Boolean(options.disabled)
  let choices: Choices | null = null
  let pendingCloseCleanup: (() => void) | null = null
  const select = document.createElement('select')
  const summary = document.createElement('button')
  const summaryLabel = document.createElement('span')
  const dropdownHost = document.createElement('div')

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
  summary.setAttribute('aria-haspopup', 'listbox')
  summary.setAttribute('aria-expanded', 'false')
  summaryLabel.className = 'editor-select__summary-label'
  dropdownHost.className = 'editor-select__dropdown-host'
  summary.append(summaryLabel)

  select.addEventListener('change', () => {
    if (isDisabled || isReadOnly) {
      choices?.setChoiceByValue(currentValue)
      return
    }

    currentValue = select.value as TValue
    updateSummary()
    options.onChange(currentValue)
  })

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
  wrapper.root.classList.add('editor-select', 'editor-select--compact')
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
      noChoicesText: options.noChoicesText ?? '',
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
    wrapper.root.classList.add('editor-select--open')
    summary.setAttribute('aria-expanded', 'true')
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

    wrapper.root.classList.remove('editor-select--open')
    summary.setAttribute('aria-expanded', 'false')
    select.hidden = true

    pendingCloseCleanup?.()
    pendingCloseCleanup = waitForElementTransitionEnd(dropdownElement, () => {
      closeChoices(true)
    })
  }

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

    summaryLabel.textContent = selectedOption?.label ?? currentValue
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

function stopKeyboardEventPropagation(event: KeyboardEvent): void {
  event.stopPropagation()
}
