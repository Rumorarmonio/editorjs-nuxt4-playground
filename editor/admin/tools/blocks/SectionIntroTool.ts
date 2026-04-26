import type {
  BlockAPI,
  BlockTool,
  BlockToolConstructorOptions,
  ToolConstructable,
  ToolboxConfig,
} from '@editorjs/editorjs/types'
import {
  createPlainTextField,
  type PlainFieldControl,
} from '~~/editor/admin/fields'
import {
  createNestedParagraphEditor,
  type NestedParagraphEditor,
} from '~~/editor/admin/nested-editor'
import {
  normalizeSectionIntroBlockData,
  type SectionIntroBlockData,
} from '~~/editor/shared'

export default class SectionIntroTool implements BlockTool {
  static isReadOnlySupported = true

  private readonly block: BlockAPI
  private readonly readOnly: boolean
  private data: SectionIntroBlockData
  private titleField: PlainFieldControl<string, HTMLInputElement> | null = null
  private descriptionEditor: NestedParagraphEditor | null = null

  static get toolbox(): ToolboxConfig {
    return {
      title: 'Section intro',
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
    const richField = document.createElement('div')
    const richLabel = document.createElement('p')

    wrapper.className = 'editor-section-intro-tool'

    this.titleField = createPlainTextField({
      name: 'section-intro-title',
      label: 'Title',
      value: this.data.title,
      placeholder: 'Section title',
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.title = value
        this.dispatchChange()
      },
    })

    this.descriptionEditor = createNestedParagraphEditor({
      data: this.data.description,
      readOnly: this.readOnly,
      placeholder: 'Write an introductory paragraph',
      onChange: () => {
        this.dispatchChange()
      },
    })

    richField.className = 'editor-section-intro-tool__rich-field'
    richLabel.className = 'editor-section-intro-tool__rich-label'
    richLabel.textContent = 'Description'
    richField.append(richLabel, this.descriptionEditor.holder)

    wrapper.append(this.titleField.root, richField)

    void this.descriptionEditor.initialize()

    return wrapper
  }

  async save(): Promise<SectionIntroBlockData> {
    return normalizeSectionIntroBlockData({
      title: this.titleField?.getValue() ?? this.data.title,
      description:
        (await this.descriptionEditor?.save()) ?? this.data.description,
    })
  }

  validate(data: Partial<SectionIntroBlockData>): boolean {
    const sectionIntroData = normalizeSectionIntroBlockData(data)

    return Boolean(
      sectionIntroData.title.trim() ||
        sectionIntroData.description.blocks.some((block) => {
          return block.data.text.trim()
        }),
    )
  }

  destroy(): void {
    this.descriptionEditor?.destroy()
    this.descriptionEditor = null
  }

  private dispatchChange(): void {
    this.block.dispatchChange()
  }
}

export const SectionIntroToolConstructable =
  SectionIntroTool as unknown as ToolConstructable
