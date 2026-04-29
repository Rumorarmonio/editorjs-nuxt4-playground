import Embed from '@editorjs/embed'
import type {
  BlockTool,
  BlockToolConstructorOptions,
  ToolConstructable,
  ToolboxConfig,
} from '@editorjs/editorjs/types'
import {
  createEmbedDataFromSource,
  supportedEmbedServiceLabels,
  type EmbedBlockData,
} from '~~/editor/shared'
import { getCurrentEditorMessages } from '~~/i18n/editor'

type PartialEmbedBlockData = Partial<EmbedBlockData>

interface EmbedToolInstance extends BlockTool {
  data: PartialEmbedBlockData
}

interface EmbedToolConstructor {
  new (
    options: BlockToolConstructorOptions<PartialEmbedBlockData>,
  ): EmbedToolInstance
}

const BaseEmbedTool = Embed as unknown as EmbedToolConstructor

export default class ManualEmbedTool extends BaseEmbedTool {
  private readonly isReadOnlyMode: boolean

  static get toolbox(): ToolboxConfig {
    const messages = getCurrentEditorMessages()

    return {
      title: messages.tools.embed.toolboxTitle,
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M3 4.5h12a1.5 1.5 0 0 1 1.5 1.5v6A1.5 1.5 0 0 1 15 13.5H3A1.5 1.5 0 0 1 1.5 12V6A1.5 1.5 0 0 1 3 4.5Zm0 1.5v6h12V6H3Zm5 1.25 3 1.75-3 1.75v-3.5Z"/></svg>',
    }
  }

  constructor(options: BlockToolConstructorOptions<PartialEmbedBlockData>) {
    super(options)
    this.isReadOnlyMode = options.readOnly
  }

  override render(): HTMLElement {
    if (this.data.service) {
      return super.render() as HTMLElement
    }

    return this.renderManualInput()
  }

  override validate(data: PartialEmbedBlockData): boolean {
    return Boolean(data.service && data.source && data.embed)
  }

  private renderManualInput(): HTMLElement {
    const wrapper = document.createElement('div')
    const input = document.createElement('input')
    const hint = document.createElement('p')
    const error = document.createElement('p')
    const messages = getCurrentEditorMessages()

    wrapper.classList.add('editor-embed-input')
    input.classList.add('editor-embed-input__field')
    input.type = 'url'
    input.placeholder = messages.tools.embed.urlPlaceholder(
      supportedEmbedServiceLabels,
    )
    input.disabled = this.isReadOnlyMode
    hint.classList.add('editor-embed-input__hint')
    hint.textContent = messages.tools.embed.hint
    error.classList.add('editor-embed-input__error')
    error.setAttribute('aria-live', 'polite')

    input.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') {
        return
      }

      event.preventDefault()
      this.applyEmbedUrl(input.value, error)
    })

    input.addEventListener('paste', () => {
      window.setTimeout(() => {
        this.applyEmbedUrl(input.value, error)
      })
    })

    wrapper.append(input, hint, error)
    ;(this as unknown as { element: HTMLElement }).element = wrapper

    return wrapper
  }

  private applyEmbedUrl(value: string, error: HTMLElement): void {
    const embedData = createEmbedDataFromSource(value)

    if (!embedData) {
      error.textContent = value.trim()
        ? getCurrentEditorMessages().tools.embed.supportedServices(
            supportedEmbedServiceLabels,
          )
        : ''
      return
    }

    error.textContent = ''
    this.data = embedData
  }
}

export const ManualEmbedToolConstructable =
  ManualEmbedTool as unknown as ToolConstructable
