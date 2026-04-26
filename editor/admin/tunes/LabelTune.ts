import type { BlockTune, BlockTuneConstructable } from '@editorjs/editorjs/types'
import {
  normalizeLabelTuneData,
  normalizeLabelValue,
  type LabelTuneData,
} from '~~/editor/shared'
import { createTunePanel, createTuneTextField } from './tune-ui'

interface LabelTuneConstructorOptions {
  data: unknown
}

class LabelTune implements BlockTune {
  static isTune = true

  private data: LabelTuneData
  private wrapper: HTMLElement | null = null

  constructor({ data }: LabelTuneConstructorOptions) {
    this.data = normalizeLabelTuneData(data)
  }

  render(): HTMLElement {
    const panel = createTunePanel('Label')

    panel.append(
      createTuneTextField({
        label: 'Label',
        value: this.data.label ?? '',
        placeholder: 'Sidebar title',
        onInput: (value) => {
          this.data.label = normalizeLabelValue(value)
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

  save(): LabelTuneData {
    return this.data
  }

  private syncWrapper(): void {
    if (!this.wrapper) {
      return
    }

    if (this.data.label) {
      this.wrapper.dataset.blockLabel = this.data.label
      return
    }

    delete this.wrapper.dataset.blockLabel
  }
}

export const LabelTuneConstructable =
  LabelTune as unknown as BlockTuneConstructable
