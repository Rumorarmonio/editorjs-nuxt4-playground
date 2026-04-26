import type { PlainFieldBaseOptions } from './types'

interface PlainFieldWrapperOptions<TValue>
  extends Pick<
    PlainFieldBaseOptions<TValue>,
    'name' | 'label' | 'hint' | 'error' | 'disabled' | 'readOnly'
  > {
  control: HTMLElement
}

interface PlainFieldGroupWrapperOptions<TValue>
  extends Omit<PlainFieldWrapperOptions<TValue>, 'control'> {
  content: HTMLElement
}

export interface PlainFieldWrapper {
  root: HTMLElement
  setError: (error?: string) => void
  setDisabled: (disabled: boolean) => void
  setReadOnly: (readOnly: boolean) => void
}

let fieldId = 0

export function createPlainFieldWrapper<TValue>({
  name,
  label,
  hint,
  error,
  disabled,
  readOnly,
  control,
}: PlainFieldWrapperOptions<TValue>): PlainFieldWrapper {
  const root = document.createElement('div')
  const labelElement = document.createElement('label')
  const controlId = createFieldId(name)

  root.className = 'editor-plain-field'
  root.classList.toggle('editor-plain-field--disabled', Boolean(disabled))
  root.classList.toggle('editor-plain-field--readonly', Boolean(readOnly))
  labelElement.className = 'editor-plain-field__label'
  labelElement.htmlFor = controlId
  labelElement.textContent = label

  control.id = controlId
  applyFieldControlState(control, Boolean(disabled), Boolean(readOnly))

  const messages = createFieldMessages({ name, hint, error })

  root.append(labelElement, control, messages.hint, messages.error)
  syncDescribedBy(control, messages.hint, messages.error)
  syncInvalidState(root, control, error)

  return {
    root,
    setError(nextError) {
      messages.error.textContent = nextError ?? ''
      messages.error.hidden = !nextError
      syncDescribedBy(control, messages.hint, messages.error)
      syncInvalidState(root, control, nextError)
    },
    setDisabled(nextDisabled) {
      applyFieldControlState(control, nextDisabled, isReadOnly(control))
      root.classList.toggle('editor-plain-field--disabled', nextDisabled)
    },
    setReadOnly(nextReadOnly) {
      applyFieldControlState(control, isDisabled(control), nextReadOnly)
      root.classList.toggle('editor-plain-field--readonly', nextReadOnly)
    },
  }
}

export function createPlainFieldGroupWrapper<TValue>({
  name,
  label,
  hint,
  error,
  disabled,
  readOnly,
  content,
}: PlainFieldGroupWrapperOptions<TValue>): PlainFieldWrapper {
  const root = document.createElement('fieldset')
  const legend = document.createElement('legend')

  root.className = 'editor-plain-field editor-plain-field--group'
  root.classList.toggle('editor-plain-field--disabled', Boolean(disabled))
  root.classList.toggle('editor-plain-field--readonly', Boolean(readOnly))
  root.disabled = Boolean(disabled)
  root.dataset.readonly = String(Boolean(readOnly))

  legend.className = 'editor-plain-field__label'
  legend.textContent = label

  const messages = createFieldMessages({ name, hint, error })

  root.append(legend, content, messages.hint, messages.error)
  syncDescribedBy(content, messages.hint, messages.error)
  syncInvalidState(root, content, error)

  return {
    root,
    setError(nextError) {
      messages.error.textContent = nextError ?? ''
      messages.error.hidden = !nextError
      syncDescribedBy(content, messages.hint, messages.error)
      syncInvalidState(root, content, nextError)
    },
    setDisabled(nextDisabled) {
      root.disabled = nextDisabled
      root.classList.toggle('editor-plain-field--disabled', nextDisabled)
    },
    setReadOnly(nextReadOnly) {
      root.dataset.readonly = String(nextReadOnly)
      root.classList.toggle('editor-plain-field--readonly', nextReadOnly)
    },
  }
}

export function applyFieldControlState(
  control: HTMLElement,
  disabled: boolean,
  readOnly: boolean,
): void {
  if ('disabled' in control) {
    control.disabled = disabled
  }

  if ('readOnly' in control) {
    control.readOnly = readOnly
  }

  control.toggleAttribute('aria-readonly', readOnly)
}

function createFieldMessages({
  name,
  hint,
  error,
}: Pick<PlainFieldBaseOptions<unknown>, 'name' | 'hint' | 'error'>): {
  hint: HTMLParagraphElement
  error: HTMLParagraphElement
} {
  const hintElement = document.createElement('p')
  const errorElement = document.createElement('p')

  hintElement.id = createFieldId(`${name}-hint`)
  hintElement.className = 'editor-plain-field__hint'
  hintElement.textContent = hint ?? ''
  hintElement.hidden = !hint

  errorElement.id = createFieldId(`${name}-error`)
  errorElement.className = 'editor-plain-field__error'
  errorElement.textContent = error ?? ''
  errorElement.hidden = !error

  return {
    hint: hintElement,
    error: errorElement,
  }
}

function syncDescribedBy(
  control: HTMLElement,
  hint: HTMLElement,
  error: HTMLElement,
): void {
  const messageIds = [hint, error]
    .filter((element) => !element.hidden)
    .map((element) => element.id)

  if (messageIds.length > 0) {
    control.setAttribute('aria-describedby', messageIds.join(' '))
    return
  }

  control.removeAttribute('aria-describedby')
}

function syncInvalidState(
  root: HTMLElement,
  control: HTMLElement,
  error?: string,
): void {
  const isInvalid = Boolean(error)

  root.classList.toggle('editor-plain-field--invalid', isInvalid)
  control.setAttribute('aria-invalid', String(isInvalid))
}

function createFieldId(name: string): string {
  fieldId += 1

  return `editor-plain-field-${sanitizeFieldName(name)}-${fieldId}`
}

function sanitizeFieldName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9_-]+/g, '-')
}

function isDisabled(control: HTMLElement): boolean {
  return 'disabled' in control && Boolean(control.disabled)
}

function isReadOnly(control: HTMLElement): boolean {
  return 'readOnly' in control && Boolean(control.readOnly)
}
