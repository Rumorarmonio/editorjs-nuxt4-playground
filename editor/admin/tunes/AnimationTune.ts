import type { BlockTune, BlockTuneConstructable } from '@editorjs/editorjs/types'
import {
  animationTuneValues,
  normalizeAnimationTuneData,
  type AnimationTuneData,
  type AnimationTuneValue,
} from '~~/editor/shared'
import { getCurrentEditorMessages } from '~~/i18n/editor'
import {
  createTunePanel,
  createTuneSelectField,
  type TuneSelectControl,
} from './tune-ui'

interface AnimationTuneConstructorOptions {
  data: unknown
}

class AnimationTune implements BlockTune {
  static isTune = true

  private data: AnimationTuneData
  private wrapper: HTMLElement | null = null
  private selectField: TuneSelectControl | null = null

  constructor({ data }: AnimationTuneConstructorOptions) {
    this.data = normalizeAnimationTuneData(data)
  }

  render(): HTMLElement {
    const messages = getCurrentEditorMessages()
    const animationOptions = animationTuneValues.map((value) => ({
      value,
      label: messages.tunes.animation.options[value],
    }))
    const panel = createTunePanel(messages.tunes.animation.title)

    this.selectField = createTuneSelectField({
      label: messages.tunes.animation.label,
      value: this.data.type ?? 'none',
      options: animationOptions,
      onChange: (value) => {
        this.data.type = value as AnimationTuneValue
        this.syncWrapper()
      },
    })
    panel.append(this.selectField)

    return panel
  }

  wrap(blockContent: HTMLElement): HTMLElement {
    this.wrapper = document.createElement('div')
    this.wrapper.append(blockContent)
    this.syncWrapper()

    return this.wrapper
  }

  save(): AnimationTuneData {
    return this.data
  }

  destroy(): void {
    this.selectField?.destroy()
    this.selectField = null
  }

  private syncWrapper(): void {
    if (!this.wrapper) {
      return
    }

    this.wrapper.dataset.blockAnimation = this.data.type ?? 'none'
  }
}

export const AnimationTuneConstructable =
  AnimationTune as unknown as BlockTuneConstructable
