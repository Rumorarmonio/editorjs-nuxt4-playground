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
  type ListBlockItem,
  type TwoColumnsBlockData,
  type TwoColumnsContentData,
  type TwoColumnsLayoutVariant,
} from '~~/editor/shared'

const layoutOptions = [
  {
    label: 'Equal columns',
    value: 'equal',
  },
  {
    label: 'Left wide',
    value: 'leftWide',
  },
  {
    label: 'Right wide',
    value: 'rightWide',
  },
] as const satisfies ReadonlyArray<{
  label: string
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

  static get toolbox(): ToolboxConfig {
    return {
      title: 'Two columns',
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

    wrapper.className = 'editor-two-columns-tool'
    controls.className = 'editor-two-columns-tool__controls'
    columns.className = 'editor-two-columns-tool__columns'

    this.layoutField = createPlainSelectField({
      name: 'two-columns-layout',
      label: 'Layout',
      value: this.data.layout,
      readOnly: this.readOnly,
      options: layoutOptions,
      onChange: (value) => {
        this.data.layout = value
        this.syncLayoutAttributes(columns)
        this.dispatchChange()
      },
    })

    this.reversedField = createPlainToggleField({
      name: 'two-columns-reversed',
      label: 'Reverse on render',
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
    columns.append(
      this.createColumnWrapper('Left column', this.leftEditor),
      this.createColumnWrapper('Right column', this.rightEditor),
    )
    wrapper.append(controls, columns)

    this.syncLayoutAttributes(columns)

    void Promise.all([
      this.leftEditor.initialize(),
      this.rightEditor.initialize(),
    ])

    return wrapper
  }

  async save(): Promise<TwoColumnsBlockData> {
    return normalizeTwoColumnsBlockData({
      layout: this.layoutField?.getValue() ?? this.data.layout,
      isReversed: this.reversedField?.getValue() ?? this.data.isReversed,
      left: (await this.leftEditor?.save()) ?? this.data.left,
      right: (await this.rightEditor?.save()) ?? this.data.right,
    })
  }

  validate(data: Partial<TwoColumnsBlockData>): boolean {
    const twoColumnsData = normalizeTwoColumnsBlockData(data)

    return (
      hasColumnContent(twoColumnsData.left) ||
      hasColumnContent(twoColumnsData.right)
    )
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
      placeholder: 'Add paragraph, heading, or list',
      onChange: () => {
        this.dispatchChange()
      },
    })
  }

  private createColumnWrapper(
    label: string,
    editor: NestedRichEditor<TwoColumnsContentData>,
  ): HTMLElement {
    return createPlainFieldWrapper({
      name: `two-columns-${label.toLowerCase().replaceAll(' ', '-')}`,
      label,
      readOnly: this.readOnly,
      control: editor.holder,
    }).root
  }

  private syncLayoutAttributes(columns: HTMLElement): void {
    columns.dataset.layout = this.data.layout
    columns.dataset.reversed = String(this.data.isReversed)
  }

  private dispatchChange(): void {
    this.block.dispatchChange()
  }
}

function hasColumnContent(data: TwoColumnsContentData): boolean {
  return data.blocks.some((block) => {
    switch (block.type) {
      case 'paragraph':
      case 'header':
        return block.data.text.trim().length > 0
      case 'list':
        return block.data.items.some(hasListItemContent)
      default:
        return false
    }
  })
}

function hasListItemContent(item: ListBlockItem): boolean {
  return (
    item.content.trim().length > 0 ||
    item.items.some((child) => {
      return hasListItemContent(child)
    })
  )
}

export const TwoColumnsToolConstructable =
  TwoColumnsTool as unknown as ToolConstructable
