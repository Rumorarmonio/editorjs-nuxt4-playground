import type { API, InlineToolConstructorOptions } from '@editorjs/editorjs'
import type { SanitizerConfig } from '@editorjs/editorjs/types'
import {
  getTextColorInlineOptionByClassName,
  textColorInlineClassName,
  textColorInlineOptions,
  type TextColorInlineOption,
} from '~~/editor/shared'
import { getCurrentEditorMessages } from '~~/i18n/editor'

const textColorTag = 'SPAN'

export default class TextColorTool {
  private readonly api: API

  private button: HTMLButtonElement | null = null

  private actions: HTMLDivElement | null = null

  private selectedColor: TextColorInlineOption = textColorInlineOptions[0]

  private savedRange: Range | null = null

  static get isInline(): true {
    return true
  }

  static get title(): string {
    return getCurrentEditorMessages().inlineTools.textColor
  }

  static get sanitize(): SanitizerConfig {
    return {
      span: {
        class: true,
      },
    }
  }

  constructor(options: InlineToolConstructorOptions) {
    this.api = options.api
  }

  render(): HTMLButtonElement {
    this.button = document.createElement('button')
    this.button.type = 'button'
    this.button.classList.add('ce-inline-tool')
    this.button.setAttribute('aria-label', TextColorTool.title)
    this.button.innerHTML = '<span class="editor-text-color-tool__icon">A</span>'

    this.updateButtonState(false)

    return this.button
  }

  renderActions(): HTMLDivElement {
    this.actions = document.createElement('div')
    this.actions.classList.add('editor-text-color-tool__actions')

    textColorInlineOptions.forEach((option) => {
      const button = document.createElement('button')
      const messages = getCurrentEditorMessages()

      button.type = 'button'
      button.classList.add('editor-text-color-tool__swatch')
      button.style.setProperty('--editor-text-color-tool-swatch', option.value)
      button.setAttribute(
        'aria-label',
        messages.inlineTools.textColorOptions[option.name],
      )
      button.dataset.color = option.name

      button.addEventListener('mousedown', (event) => {
        event.preventDefault()
        event.stopPropagation()
        this.selectedColor = option
        this.applySelectedColor(this.getSavedRange())
      })

      this.actions?.append(button)
    })

    this.updateActionsState()

    return this.actions
  }

  surround(range: Range | null): void {
    this.selectedColor = textColorInlineOptions[0]
    this.saveRange(range)
    this.applySelectedColor(range)
  }

  checkState(selection?: Selection): boolean {
    const range = this.selectionToRange(selection)

    this.saveRange(range)

    const wrapper = this.findColorWrapper(range)
    const isActive = Boolean(wrapper)

    if (wrapper) {
      this.selectedColor =
        getTextColorInlineOptionByClassName(wrapper.classList) ??
        this.selectedColor
    } else {
      this.selectedColor = textColorInlineOptions[0]
    }

    this.updateButtonState(isActive)
    this.updateActionsState()

    return isActive
  }

  private applySelectedColor(range = this.getSavedRange()): void {
    if (!range) {
      return
    }

    try {
      const wrapper = this.findColorWrapper(range)

      if (wrapper) {
        if (wrapper.classList.contains(this.selectedColor.className)) {
          this.unwrap(wrapper)
          return
        }

        this.updateWrapperColor(wrapper)
        this.api.selection.expandToTag(wrapper)
        return
      }

      if (range.collapsed) {
        return
      }

      this.wrap(range)
    } finally {
      this.savedRange = null
    }
  }

  private wrap(range: Range): void {
    const wrapper = document.createElement(textColorTag)

    wrapper.classList.add(textColorInlineClassName, this.selectedColor.className)

    const content = range.extractContents()

    unwrapNestedColorWrappers(content)
    wrapper.append(content)
    range.insertNode(wrapper)
    this.api.selection.expandToTag(wrapper)
  }

  private unwrap(wrapper: HTMLElement): void {
    this.api.selection.expandToTag(wrapper)

    const selection = window.getSelection()
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null

    if (!selection || !range) {
      return
    }

    const content = range.extractContents()

    wrapper.remove()
    range.insertNode(content)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  private updateWrapperColor(wrapper: HTMLElement): void {
    textColorInlineOptions.forEach((option) => {
      wrapper.classList.remove(option.className)
    })
    wrapper.classList.add(textColorInlineClassName, this.selectedColor.className)
  }

  private findColorWrapper(range: Range | null = null): HTMLElement | null {
    return findInlineWrapper(textColorTag, textColorInlineClassName, range)
  }

  private saveRange(range: Range | null): void {
    if (!range || range.collapsed) {
      return
    }

    this.savedRange = range.cloneRange()
  }

  private getSavedRange(): Range | null {
    return this.savedRange?.cloneRange() ?? this.getRestoredRange()
  }

  private getRestoredRange(): Range | null {
    this.api.selection.restore()

    const selection = window.getSelection()

    if (!selection?.rangeCount) {
      return null
    }

    return selection.getRangeAt(0)
  }

  private selectionToRange(selection?: Selection): Range | null {
    if (!selection || !selection.rangeCount) {
      return null
    }

    return selection.getRangeAt(0)
  }

  private updateButtonState(isActive: boolean): void {
    if (!this.button) {
      return
    }

    this.button.classList.toggle('ce-inline-tool--active', isActive)

    if (isActive) {
      this.button.style.setProperty(
        '--editor-text-color-tool-current',
        this.selectedColor.value,
      )
      return
    }

    this.button.style.removeProperty('--editor-text-color-tool-current')
  }

  private updateActionsState(): void {
    if (!this.actions) {
      return
    }

    Array.from(this.actions.querySelectorAll<HTMLButtonElement>('button')).forEach(
      (button) => {
        button.classList.toggle(
          'editor-text-color-tool__swatch--active',
          button.dataset.color === this.selectedColor.name,
        )
      },
    )
  }
}

function unwrapNestedColorWrappers(fragment: DocumentFragment): void {
  Array.from(fragment.querySelectorAll(`.${textColorInlineClassName}`)).forEach(
    (wrapper) => {
      wrapper.replaceWith(...Array.from(wrapper.childNodes))
    },
  )
}

function findInlineWrapper(
  tagName: string,
  className: string,
  range: Range | null = null,
): HTMLElement | null {
  const nodes: Array<Node | null> = range
    ? [
        range.startContainer,
        range.endContainer,
        range.commonAncestorContainer,
      ]
    : []
  const selection = window.getSelection()

  if (nodes.length === 0 && !selection?.rangeCount) {
    return null
  }

  if (nodes.length === 0 && selection?.rangeCount) {
    nodes.push(
      selection.anchorNode,
      selection.focusNode,
      selection.getRangeAt(0).commonAncestorContainer,
    )
  }

  for (const startNode of nodes) {
    if (!startNode) {
      continue
    }

    const wrapper = findAncestorByTagAndClass(startNode, tagName, className)

    if (wrapper) {
      return wrapper
    }
  }

  return null
}

function findAncestorByTagAndClass(
  node: Node | null,
  tagName: string,
  className: string,
): HTMLElement | null {
  let current = node

  if (current?.nodeType === Node.TEXT_NODE) {
    current = current.parentElement
  }

  while (current instanceof HTMLElement) {
    if (current.tagName === tagName && current.classList.contains(className)) {
      return current
    }

    current = current.parentElement
  }

  return null
}

export const TextColorToolConstructable = TextColorTool
