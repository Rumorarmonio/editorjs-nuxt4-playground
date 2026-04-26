import type { BlockTune, BlockTuneConstructable } from '@editorjs/editorjs/types'
import {
  normalizeAnchorTuneData,
  normalizeAnchorValue,
  type AnchorTuneData,
} from '~~/editor/shared'
import { createTunePanel, createTuneTextField } from './tune-ui'

interface AnchorTuneConstructorOptions {
  data: unknown
}

class AnchorTune implements BlockTune {
  static isTune = true

  private data: AnchorTuneData
  private wrapper: HTMLElement | null = null

  constructor({ data }: AnchorTuneConstructorOptions) {
    this.data = normalizeAnchorTuneData(data)
  }

  render(): HTMLElement {
    const panel = createTunePanel('Anchor')

    panel.append(
      createTuneTextField({
        label: 'Anchor',
        value: this.data.anchor ?? '',
        placeholder: 'section-anchor',
        onInput: (value) => {
          this.data.anchor = normalizeAnchorValue(value)
          this.syncWrapper()
        },
      }),
    )

    return panel
  }

  wrap(blockContent: HTMLElement): HTMLElement {
    this.wrapper = document.createElement('div')
    this.wrapper.append(blockContent)
    this.syncWrapper()

    return this.wrapper
  }

  save(): AnchorTuneData {
    return this.data
  }

  private syncWrapper(): void {
    if (!this.wrapper) {
      return
    }

    if (this.data.anchor) {
      this.wrapper.dataset.blockAnchor = this.data.anchor
      return
    }

    delete this.wrapper.dataset.blockAnchor
  }
}

export const AnchorTuneConstructable =
  AnchorTune as unknown as BlockTuneConstructable
