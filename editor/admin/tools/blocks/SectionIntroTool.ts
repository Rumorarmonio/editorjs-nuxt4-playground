import type {
  BlockAPI,
  BlockTool,
  BlockToolConstructorOptions,
  SanitizerConfig,
  ToolConstructable,
  ToolboxConfig,
} from '@editorjs/editorjs/types'
import {
  createInlineHtmlField,
  createRichParagraphField,
  type RichFieldControl,
} from '~~/editor/admin/fields'
import {
  normalizeSectionIntroBlockData,
  validateSectionIntroBlockData,
  type SectionIntroBlockData,
  type SectionIntroDescriptionData,
} from '~~/editor/shared'
import { getCurrentEditorMessages } from '~~/i18n/editor'
import { createBlockToolLabel } from './tool-label'

export default class SectionIntroTool implements BlockTool {
  static isReadOnlySupported = true

  static get sanitize(): SanitizerConfig {
    return {
      title: true,
      description: true,
    }
  }

  private readonly block: BlockAPI
  private readonly readOnly: boolean
  private data: SectionIntroBlockData
  private titleField: RichFieldControl<string> | null = null
  private descriptionField: RichFieldControl<SectionIntroDescriptionData> | null =
    null

  static get toolbox(): ToolboxConfig {
    const messages = getCurrentEditorMessages()

    return {
      title: messages.tools.sectionIntro.toolboxTitle,
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M3 2.75h12v2H3v-2Zm0 4h8.5v1.5H3v-1.5Zm0 3h12v1.5H3v-1.5Zm0 3h9.5v1.5H3v-1.5Z"/></svg>',
    }
  }

  constructor(
    options: BlockToolConstructorOptions<Partial<SectionIntroBlockData>>,
  ) {
    this.block = options.block
    this.readOnly = options.readOnly
    this.data = normalizeSectionIntroBlockData(options.data)
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div')
    const messages = getCurrentEditorMessages()

    wrapper.className = 'editor-section-intro-tool'

    this.titleField = createInlineHtmlField({
      name: 'section-intro-title',
      label: messages.tools.sectionIntro.titleLabel,
      value: this.data.title,
      placeholder: messages.tools.sectionIntro.titlePlaceholder,
      allowLineBreaks: false,
      readOnly: this.readOnly,
      onChange: () => {
        this.titleField?.setError(undefined)
        this.dispatchChange()
      },
    })

    this.descriptionField = createRichParagraphField({
      name: 'section-intro-description',
      label: messages.tools.sectionIntro.descriptionLabel,
      value: this.data.description,
      readOnly: this.readOnly,
      placeholder: messages.tools.sectionIntro.descriptionPlaceholder,
      onChange: () => {
        this.descriptionField?.setError(undefined)
        this.dispatchChange()
      },
    })

    wrapper.append(
      createBlockToolLabel(
        'sectionIntro',
        messages.tools.sectionIntro.toolboxTitle,
      ),
      this.titleField.root,
      this.descriptionField.root,
    )

    void this.descriptionField.initialize()

    return wrapper
  }

  async save(): Promise<SectionIntroBlockData> {
    const data = normalizeSectionIntroBlockData({
      title: (await this.titleField?.save()) ?? this.data.title,
      description:
        (await this.descriptionField?.save()) ?? this.data.description,
    })

    this.syncValidationErrors(data)

    return data
  }

  validate(data: Partial<SectionIntroBlockData>): boolean {
    this.syncValidationErrors(normalizeSectionIntroBlockData(data))

    return true
  }

  private syncValidationErrors(data: SectionIntroBlockData): boolean {
    const result = validateSectionIntroBlockData(data)

    this.titleField?.setError(
      result.issues.find((issue) => issue.path === 'title')?.message,
    )
    this.descriptionField?.setError(
      result.issues.find((issue) => issue.path === 'description')?.message,
    )

    return result.valid
  }

  destroy(): void {
    this.titleField?.destroy()
    this.descriptionField?.destroy()
    this.descriptionField = null
  }

  private dispatchChange(): void {
    this.block.dispatchChange()
  }
}

export const SectionIntroToolConstructable =
  SectionIntroTool as unknown as ToolConstructable
