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
  type PlainFieldControl,
} from '~~/editor/admin/fields'
import {
  codeSnippetLanguages,
  normalizeCodeSnippetBlockData,
  validateCodeSnippetBlockData,
  type CodeSnippetBlockData,
  type CodeSnippetLanguage,
} from '~~/editor/shared'
import { getCurrentEditorMessages } from '~~/i18n/editor'
import { createBlockToolLabel } from './tool-label'

export default class CodeSnippetTool implements BlockTool {
  static isReadOnlySupported = true

  private readonly block: BlockAPI
  private readonly readOnly: boolean
  private data: CodeSnippetBlockData
  private languageField: PlainFieldControl<
    CodeSnippetLanguage,
    HTMLSelectElement
  > | null = null
  private codeField: PlainFieldControl<string, HTMLTextAreaElement> | null = null
  private captionField: PlainFieldControl<
    string,
    HTMLTextAreaElement
  > | null = null

  static get toolbox(): ToolboxConfig {
    const messages = getCurrentEditorMessages()

    return {
      title: messages.tools.codeSnippet.toolboxTitle,
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="m6.6 5.4 1.1 1.1L5.2 9l2.5 2.5-1.1 1.1L3 9l3.6-3.6Zm4.8 0L15 9l-3.6 3.6-1.1-1.1L12.8 9l-2.5-2.5 1.1-1.1ZM9.6 4l1.4.4L8.4 14 7 13.6 9.6 4Z"/></svg>',
    }
  }

  constructor(
    options: BlockToolConstructorOptions<Partial<CodeSnippetBlockData>>,
  ) {
    this.block = options.block
    this.readOnly = options.readOnly
    this.data = normalizeCodeSnippetBlockData(options.data)
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div')
    const messages = getCurrentEditorMessages()

    wrapper.className = 'editor-code-snippet-tool'

    this.languageField = createPlainSelectField<CodeSnippetLanguage>({
      name: 'code-snippet-language',
      label: messages.tools.codeSnippet.languageLabel,
      value: this.data.language,
      options: codeSnippetLanguages.map((language) => ({
        value: language,
        label: messages.tools.codeSnippet.languageOptions[language] ?? language,
      })),
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.language = value
        this.dispatchChange()
      },
    })

    this.codeField = createPlainTextareaField({
      name: 'code-snippet-code',
      label: messages.tools.codeSnippet.codeLabel,
      value: this.data.code,
      placeholder: messages.tools.codeSnippet.codePlaceholder,
      rows: 10,
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.code = value
        this.codeField?.setError(undefined)
        this.dispatchChange()
      },
    })
    this.codeField.control.classList.add(
      'editor-code-snippet-tool__code-control',
    )
    this.codeField.control.spellcheck = false

    this.captionField = createPlainTextareaField({
      name: 'code-snippet-caption',
      label: messages.tools.codeSnippet.captionLabel,
      value: this.data.caption,
      placeholder: messages.tools.codeSnippet.captionPlaceholder,
      rows: 2,
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.caption = value
        this.captionField?.setError(undefined)
        this.dispatchChange()
      },
    })

    wrapper.append(
      createBlockToolLabel(
        'codeSnippet',
        messages.tools.codeSnippet.toolboxTitle,
      ),
      this.languageField.root,
      this.codeField.root,
      this.captionField.root,
    )

    return wrapper
  }

  save(): CodeSnippetBlockData {
    const data = this.getCurrentData()

    this.syncValidationErrors(data)

    return data
  }

  validate(data: Partial<CodeSnippetBlockData>): boolean {
    this.syncValidationErrors(normalizeCodeSnippetBlockData(data))

    return true
  }

  private getCurrentData(): CodeSnippetBlockData {
    return normalizeCodeSnippetBlockData({
      language: this.languageField?.getValue() ?? this.data.language,
      code: this.codeField?.getValue() ?? this.data.code,
      caption: this.captionField?.getValue() ?? this.data.caption,
    })
  }

  private syncValidationErrors(data: CodeSnippetBlockData): boolean {
    const result = validateCodeSnippetBlockData(data)

    this.codeField?.setError(
      result.issues.find((issue) => issue.path === 'code')?.message,
    )
    this.captionField?.setError(
      result.issues.find((issue) => issue.path === 'caption')?.message,
    )

    return result.valid
  }

  private dispatchChange(): void {
    this.block.dispatchChange()
  }
}

export const CodeSnippetToolConstructable =
  CodeSnippetTool as unknown as ToolConstructable
