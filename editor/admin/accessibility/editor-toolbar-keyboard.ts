import type { EditorUiMessages } from '~~/i18n'

const patchedAttribute = 'data-editor-toolbar-keyboard-patched'

interface EditorToolbarKeyboardLabels {
  addBlock: string
  tuneBlock: string
}

type KeyboardActivation = 'click' | 'mousedown'

export interface EditorToolbarKeyboardPatch {
  destroy: () => void
}

export function enableEditorToolbarKeyboardAccess({
  root,
  messages,
}: {
  root: HTMLElement
  messages: EditorUiMessages
}): EditorToolbarKeyboardPatch {
  const labels = messages.tools.editorToolbar
  const observer = new MutationObserver(() => {
    patchEditorToolbarControls(root, labels)
  })

  patchEditorToolbarControls(root, labels)
  observer.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
  })

  return {
    destroy() {
      observer.disconnect()
    },
  }
}

function patchEditorToolbarControls(
  root: HTMLElement,
  labels: EditorToolbarKeyboardLabels,
): void {
  root.querySelectorAll<HTMLElement>('.ce-toolbar__plus').forEach((control) => {
    patchButtonControl(control, labels.addBlock, 'click')
  })

  root
    .querySelectorAll<HTMLElement>('.ce-toolbar__settings-btn')
    .forEach((control) => {
      patchButtonControl(control, labels.tuneBlock, 'mousedown')
      control.tabIndex = control.classList.contains(
        'ce-toolbar__settings-btn--hidden',
      )
        ? -1
        : 0
    })

  root.querySelectorAll<HTMLElement>('.ce-popover-item').forEach((control) => {
    const label =
      control.querySelector<HTMLElement>('.ce-popover-item__title')?.textContent
        ?.trim() || control.textContent?.trim()

    patchButtonControl(control, label)
    control.tabIndex =
      control.classList.contains('ce-popover-item--hidden') ||
      control.classList.contains('ce-popover-item--disabled')
        ? -1
        : 0
  })
}

function patchButtonControl(
  control: HTMLElement,
  label?: string,
  activation: KeyboardActivation = 'click',
): void {
  control.contentEditable = 'false'
  control.tabIndex = 0
  control.setAttribute('role', 'button')
  control.dataset.editorToolbarKeyboardActivation = activation

  if (label) {
    control.setAttribute('aria-label', label)
  }

  if (control.getAttribute(patchedAttribute) === 'true') {
    return
  }

  control.setAttribute(patchedAttribute, 'true')
  control.addEventListener('keydown', handleButtonKeydown)
}

function handleButtonKeydown(event: KeyboardEvent): void {
  event.stopPropagation()

  if (event.key !== 'Enter' && event.key !== ' ') {
    return
  }

  event.preventDefault()
  const control = event.currentTarget

  if (control instanceof HTMLElement) {
    activateControl(control)
  }
}

function activateControl(control: HTMLElement): void {
  if (control.dataset.editorToolbarKeyboardActivation === 'mousedown') {
    control.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        button: 0,
        view: window,
      }),
    )
    return
  }

  control.click()
}
