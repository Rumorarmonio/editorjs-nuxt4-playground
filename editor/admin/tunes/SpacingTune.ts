import type { BlockTune, BlockTuneConstructable } from '@editorjs/editorjs/types'
import {
  normalizeSpacingTuneData,
  spacingTuneValues,
  type SpacingTuneData,
  type SpacingTuneValue,
} from '~~/editor/shared'
import { getCurrentEditorMessages } from '~~/i18n/editor'
import { createTunePanel, createTuneSelectField } from './tune-ui'

interface SpacingTuneConstructorOptions {
  data: unknown
}

const spacingPreviewValue: Record<SpacingTuneValue, string> = {
  none: '0',
  small: '12px',
  medium: '24px',
  large: '40px',
}

class SpacingTune implements BlockTune {
  static isTune = true

  private data: SpacingTuneData
  private wrapper: HTMLElement | null = null

  constructor({ data }: SpacingTuneConstructorOptions) {
    this.data = normalizeSpacingTuneData(data)
  }

  render(): HTMLElement {
    const messages = getCurrentEditorMessages()
    const spacingOptions = spacingTuneValues.map((value) => ({
      value,
      label: messages.tunes.spacing.options[value],
    }))
    const panel = createTunePanel(messages.tunes.spacing.title)

    panel.append(
      createTuneSelectField({
        label: messages.tunes.spacing.topLabel,
        value: this.data.top ?? 'none',
        options: spacingOptions,
        onChange: (value) => {
          this.data.top = value as SpacingTuneValue
          this.syncWrapper()
        },
      }),
      createTuneSelectField({
        label: messages.tunes.spacing.bottomLabel,
        value: this.data.bottom ?? 'none',
        options: spacingOptions,
        onChange: (value) => {
          this.data.bottom = value as SpacingTuneValue
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

  save(): SpacingTuneData {
    return this.data
  }

  private syncWrapper(): void {
    if (!this.wrapper) {
      return
    }

    this.wrapper.style.marginTop = spacingPreviewValue[this.data.top ?? 'none']
    this.wrapper.style.marginBottom =
      spacingPreviewValue[this.data.bottom ?? 'none']
    this.wrapper.dataset.blockSpacingTop = this.data.top ?? 'none'
    this.wrapper.dataset.blockSpacingBottom = this.data.bottom ?? 'none'
  }
}

export const SpacingTuneConstructable =
  SpacingTune as unknown as BlockTuneConstructable
