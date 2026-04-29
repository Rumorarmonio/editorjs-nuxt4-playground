import type {
  BlockAPI,
  BlockTool,
  BlockToolConstructorOptions,
  ToolConstructable,
  ToolboxConfig,
} from '@editorjs/editorjs/types'
import {
  createPlainFieldWrapper,
  createPlainSelectField,
  createPlainToggleField,
  type PlainFieldControl,
  type PlainFieldWrapper,
} from '~~/editor/admin/fields'
import {
  createNestedColumnTools,
  createNestedRichEditor,
  nestedRichFieldInlineToolbar,
  type NestedRichEditor,
} from '~~/editor/admin/nested-editor'
import {
  normalizeTwoColumnsBlockData,
  normalizeTwoColumnsContentData,
  validateTwoColumnsBlockData,
  type TwoColumnsBlockData,
  type TwoColumnsContentData,
  type TwoColumnsLayoutVariant,
} from '~~/editor/shared'
import { getCurrentEditorMessages } from '~~/i18n/editor'

const layoutOptions = [
  {
    value: 'equal',
  },
  {
    value: 'leftWide',
  },
  {
    value: 'rightWide',
  },
] as const satisfies ReadonlyArray<{
  value: TwoColumnsLayoutVariant
}>

export default class TwoColumnsTool implements BlockTool {
  static isReadOnlySupported = true

  private readonly block: BlockAPI
  private readonly readOnly: boolean
  private data: TwoColumnsBlockData
  private layoutField: PlainFieldControl<
    TwoColumnsLayoutVariant,
    HTMLSelectElement
  > | null = null
  private reversedField: PlainFieldControl<boolean, HTMLInputElement> | null =
    null
  private leftEditor: NestedRichEditor<TwoColumnsContentData> | null = null
  private rightEditor: NestedRichEditor<TwoColumnsContentData> | null = null
  private leftColumnField: PlainFieldWrapper | null = null
  private rightColumnField: PlainFieldWrapper | null = null

  static get toolbox(): ToolboxConfig {
    const messages = getCurrentEditorMessages()

    return {
      title: messages.tools.twoColumns.toolboxTitle,
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M2.75 3h5.5v12h-5.5V3Zm7 0h5.5v12h-5.5V3Zm-5.5 1.5v9h2.5v-9h-2.5Zm7 0v9h2.5v-9h-2.5Z"/></svg>',
    }
  }

  constructor(
    options: BlockToolConstructorOptions<Partial<TwoColumnsBlockData>>,
  ) {
    this.block = options.block
    this.readOnly = options.readOnly
    this.data = normalizeTwoColumnsBlockData(options.data)
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div')
    const controls = document.createElement('div')
    const columns = document.createElement('div')
    const messages = getCurrentEditorMessages()

    wrapper.className = 'editor-two-columns-tool'
    controls.className = 'editor-two-columns-tool__controls'
    columns.className = 'editor-two-columns-tool__columns'

    this.layoutField = createPlainSelectField({
      name: 'two-columns-layout',
      label: messages.tools.twoColumns.layoutLabel,
      value: this.data.layout,
      readOnly: this.readOnly,
      options: layoutOptions.map((option) => ({
        ...option,
        label: messages.tools.twoColumns.layoutOptions[option.value],
      })),
      onChange: (value) => {
        this.data.layout = value
        this.syncLayoutAttributes(columns)
        this.dispatchChange()
      },
    })

    this.reversedField = createPlainToggleField({
      name: 'two-columns-reversed',
      label: messages.tools.twoColumns.reverseLabel,
      value: this.data.isReversed,
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.isReversed = value
        this.syncLayoutAttributes(columns)
        this.dispatchChange()
      },
    })

    this.leftEditor = this.createColumnEditor(this.data.left)
    this.rightEditor = this.createColumnEditor(this.data.right)

    controls.append(this.layoutField.root, this.reversedField.root)
    this.leftColumnField = this.createColumnWrapper(
      'left',
      messages.tools.twoColumns.leftColumnLabel,
      this.leftEditor,
    )
    this.rightColumnField = this.createColumnWrapper(
      'right',
      messages.tools.twoColumns.rightColumnLabel,
      this.rightEditor,
    )

    columns.append(this.leftColumnField.root, this.rightColumnField.root)
    wrapper.append(controls, columns)

    this.syncLayoutAttributes(columns)

    void Promise.all([
      this.leftEditor.initialize(),
      this.rightEditor.initialize(),
    ])

    return wrapper
  }

  async save(): Promise<TwoColumnsBlockData> {
    const data = normalizeTwoColumnsBlockData({
      layout: this.layoutField?.getValue() ?? this.data.layout,
      isReversed: this.reversedField?.getValue() ?? this.data.isReversed,
      left: (await this.leftEditor?.save()) ?? this.data.left,
      right: (await this.rightEditor?.save()) ?? this.data.right,
    })

    this.syncValidationErrors(data)

    return data
  }

  validate(data: Partial<TwoColumnsBlockData>): boolean {
    this.syncValidationErrors(normalizeTwoColumnsBlockData(data))

    return true
  }

  destroy(): void {
    this.leftEditor?.destroy()
    this.rightEditor?.destroy()
    this.leftEditor = null
    this.rightEditor = null
  }

  private createColumnEditor(
    value: TwoColumnsContentData,
  ): NestedRichEditor<TwoColumnsContentData> {
    return createNestedRichEditor({
      data: value,
      readOnly: this.readOnly,
      className: 'editor-two-columns-tool__editor',
      inlineToolbar: nestedRichFieldInlineToolbar,
      normalizeData: normalizeTwoColumnsContentData,
      createTools: createNestedColumnTools,
      placeholder: getCurrentEditorMessages().tools.twoColumns.placeholder,
      onChange: () => {
        this.leftColumnField?.setError(undefined)
        this.rightColumnField?.setError(undefined)
        this.dispatchChange()
      },
    })
  }

  private createColumnWrapper(
    name: string,
    label: string,
    editor: NestedRichEditor<TwoColumnsContentData>,
  ): PlainFieldWrapper {
    return createPlainFieldWrapper({
      name: `two-columns-${name}`,
      label,
      readOnly: this.readOnly,
      control: editor.holder,
    })
  }

  private syncLayoutAttributes(columns: HTMLElement): void {
    columns.dataset.layout = this.data.layout
    columns.dataset.reversed = String(this.data.isReversed)
  }

  private dispatchChange(): void {
    this.block.dispatchChange()
  }

  private syncValidationErrors(data: TwoColumnsBlockData): boolean {
    const result = validateTwoColumnsBlockData(data)

    this.leftColumnField?.setError(
      result.issues.find((issue) => issue.path === 'left')?.message,
    )
    this.rightColumnField?.setError(
      result.issues.find((issue) => issue.path === 'right')?.message,
    )

    return result.valid
  }
}

export const TwoColumnsToolConstructable =
  TwoColumnsTool as unknown as ToolConstructable
