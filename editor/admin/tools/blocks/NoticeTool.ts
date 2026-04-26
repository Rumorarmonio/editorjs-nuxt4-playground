import type {
  BlockAPI,
  BlockTool,
  BlockToolConstructorOptions,
  ToolConstructable,
  ToolboxConfig,
} from '@editorjs/editorjs/types'
import {
  createPlainSelectField,
  createPlainTextareaField,
  createPlainTextField,
  type PlainFieldControl,
} from '~~/editor/admin/fields'
import {
  normalizeNoticeBlockData,
  type NoticeBlockData,
  type NoticeBlockType,
} from '~~/editor/shared'

const noticeTypeOptions = [
  {
    label: 'Info',
    value: 'info',
  },
  {
    label: 'Success',
    value: 'success',
  },
  {
    label: 'Warning',
    value: 'warning',
  },
] as const

export default class NoticeTool implements BlockTool {
  static isReadOnlySupported = true

  private readonly block: BlockAPI
  private readonly readOnly: boolean
  private data: NoticeBlockData
  private titleField: PlainFieldControl<string, HTMLInputElement> | null = null
  private textField: PlainFieldControl<string, HTMLTextAreaElement> | null = null
  private typeField: PlainFieldControl<NoticeBlockType, HTMLSelectElement> | null =
    null

  static get toolbox(): ToolboxConfig {
    return {
      title: 'Notice',
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M9 1.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Zm0 3.25a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Zm-1.1 3.1h1.9v4.4h1.15v1.5h-4.1v-1.5H8.1v-2.9H6.9v-1.5Z"/></svg>',
    }
  }

  constructor(options: BlockToolConstructorOptions<Partial<NoticeBlockData>>) {
    this.block = options.block
    this.readOnly = options.readOnly
    this.data = normalizeNoticeBlockData(options.data)
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div')

    wrapper.className = 'editor-notice-tool'
    wrapper.dataset.noticeType = this.data.type

    this.titleField = createPlainTextField({
      name: 'notice-title',
      label: 'Title',
      value: this.data.title,
      placeholder: 'Notice title',
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.title = value
        this.dispatchChange()
      },
    })

    this.textField = createPlainTextareaField({
      name: 'notice-text',
      label: 'Text',
      value: this.data.text,
      placeholder: 'Notice text',
      rows: 4,
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.text = value
        this.dispatchChange()
      },
    })

    this.typeField = createPlainSelectField<NoticeBlockType>({
      name: 'notice-type',
      label: 'Type',
      value: this.data.type,
      options: noticeTypeOptions,
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.type = value
        wrapper.dataset.noticeType = value
        this.dispatchChange()
      },
    })

    wrapper.append(
      this.titleField.root,
      this.textField.root,
      this.typeField.root,
    )

    return wrapper
  }

  save(): NoticeBlockData {
    return normalizeNoticeBlockData({
      title: this.titleField?.getValue() ?? this.data.title,
      text: this.textField?.getValue() ?? this.data.text,
      type: this.typeField?.getValue() ?? this.data.type,
    })
  }

  validate(data: Partial<NoticeBlockData>): boolean {
    const noticeData = normalizeNoticeBlockData(data)

    return Boolean(noticeData.title.trim() || noticeData.text.trim())
  }

  private dispatchChange(): void {
    this.block.dispatchChange()
  }
}

export const NoticeToolConstructable = NoticeTool as unknown as ToolConstructable
