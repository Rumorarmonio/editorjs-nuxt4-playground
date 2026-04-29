import type {
  BlockAPI,
  BlockTune,
  BlockTuneConstructable,
} from '@editorjs/editorjs/types'
import {
  normalizeAnchorTuneData,
  normalizeAnchorValue,
  type AnchorTuneData,
} from '~~/editor/shared'
import { getCurrentEditorMessages } from '~~/i18n/editor'
import { createTunePanel, createTuneTextField } from './tune-ui'

interface AnchorTuneConstructorOptions {
  block: BlockAPI
  data: unknown
}

class AnchorTune implements BlockTune {
  static isTune = true

  private block: BlockAPI
  private data: AnchorTuneData
  private wrapper: HTMLElement | null = null
  private field: HTMLLabelElement | null = null
  private input: HTMLInputElement | null = null
  private hint: HTMLParagraphElement | null = null

  constructor({ block, data }: AnchorTuneConstructorOptions) {
    this.block = block
    this.data = normalizeAnchorTuneData(data)
  }

  render(): HTMLElement {
    const messages = getCurrentEditorMessages()
    const panel = createTunePanel(messages.tunes.anchor.title)
    const field = createTuneTextField({
      label: messages.tunes.anchor.label,
      value: this.data.anchor ?? '',
      placeholder: messages.tunes.anchor.placeholder,
      onInput: (value) => {
        this.data.anchor = normalizeAnchorValue(value)
        this.syncWrapper()
        this.syncValidation()
        this.block.dispatchChange()
      },
    })
    const input = field.querySelector<HTMLInputElement>('input')
    const hint = document.createElement('p')

    hint.className = 'editor-block-tune-field__error'
    hint.textContent = messages.tunes.anchor.duplicateError
    hint.hidden = true

    field.append(hint)

    this.field = field
    this.input = input
    this.hint = hint
    this.syncValidation()

    panel.append(field)

    return panel
  }

  wrap(blockContent: HTMLElement): HTMLElement {
    this.wrapper = document.createElement('div')
    this.wrapper.append(blockContent)
    this.syncWrapper()
    this.syncValidation()

    return this.wrapper
  }

  save(): AnchorTuneData {
    return this.data
  }

  private syncWrapper(): void {
    if (!this.wrapper) {
      return
    }

    this.wrapper.dataset.blockId = this.block.id

    if (this.data.anchor) {
      this.wrapper.dataset.blockAnchor = this.data.anchor
      return
    }

    delete this.wrapper.dataset.blockAnchor
  }

  private syncValidation(): void {
    const isDuplicate = this.isDuplicateAnchor()

    this.field?.classList.toggle(
      'editor-block-tune-field--invalid',
      isDuplicate,
    )

    if (this.input) {
      this.input.setAttribute('aria-invalid', String(isDuplicate))
    }

    if (this.hint) {
      this.hint.hidden = !isDuplicate
    }
  }

  private isDuplicateAnchor(): boolean {
    if (!this.data.anchor || !this.wrapper) {
      return false
    }

    return [...document.querySelectorAll<HTMLElement>('[data-block-anchor]')]
      .filter((element) => element.dataset.blockId !== this.block.id)
      .some((element) => element.dataset.blockAnchor === this.data.anchor)
  }
}

export const AnchorTuneConstructable =
  AnchorTune as unknown as BlockTuneConstructable
