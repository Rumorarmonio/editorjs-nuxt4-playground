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
  validateNoticeBlockData,
  type NoticeBlockData,
  type NoticeBlockType,
} from '~~/editor/shared'
import { getCurrentEditorMessages } from '~~/i18n/editor'

const noticeTypeOptions = [
  {
    value: 'info',
  },
  {
    value: 'success',
  },
  {
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
    const messages = getCurrentEditorMessages()

    return {
      title: messages.tools.notice.toolboxTitle,
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
    const messages = getCurrentEditorMessages()

    wrapper.className = 'editor-notice-tool'
    wrapper.dataset.noticeType = this.data.type

    this.titleField = createPlainTextField({
      name: 'notice-title',
      label: messages.tools.notice.titleLabel,
      value: this.data.title,
      placeholder: messages.tools.notice.titlePlaceholder,
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.title = value
        this.titleField?.setError(undefined)
        this.dispatchChange()
      },
    })

    this.textField = createPlainTextareaField({
      name: 'notice-text',
      label: messages.tools.notice.textLabel,
      value: this.data.text,
      placeholder: messages.tools.notice.textPlaceholder,
      rows: 4,
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.text = value
        this.textField?.setError(undefined)
        this.dispatchChange()
      },
    })

    this.typeField = createPlainSelectField<NoticeBlockType>({
      name: 'notice-type',
      label: messages.tools.notice.typeLabel,
      value: this.data.type,
      options: noticeTypeOptions.map((option) => ({
        ...option,
        label: messages.tools.notice.typeOptions[option.value],
      })),
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
    const data = this.getCurrentData()

    this.syncValidationErrors(data)

    return data
  }

  validate(data: Partial<NoticeBlockData>): boolean {
    this.syncValidationErrors(normalizeNoticeBlockData(data))

    return true
  }

  private getCurrentData(): NoticeBlockData {
    return normalizeNoticeBlockData({
      title: this.titleField?.getValue() ?? this.data.title,
      text: this.textField?.getValue() ?? this.data.text,
      type: this.typeField?.getValue() ?? this.data.type,
    })
  }

  private syncValidationErrors(data: NoticeBlockData): boolean {
    const result = validateNoticeBlockData(data)

    this.titleField?.setError(
      result.issues.find((issue) => issue.path === 'title')?.message,
    )
    this.textField?.setError(
      result.issues.find((issue) => issue.path === 'text')?.message,
    )

    return result.valid
  }

  private dispatchChange(): void {
    this.block.dispatchChange()
  }
}

export const NoticeToolConstructable = NoticeTool as unknown as ToolConstructable
