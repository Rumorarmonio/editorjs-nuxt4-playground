import type {
  BlockAPI,
  BlockTool,
  BlockToolConstructorOptions,
  EditorConfig,
  ToolConstructable,
  ToolboxConfig,
} from '@editorjs/editorjs/types'
import {
  createPlainFieldWrapper,
  createPlainToggleField,
  createRichHeaderField,
  type PlainFieldControl,
  type PlainFieldWrapper,
  type RichFieldControl,
} from '~~/editor/admin/fields'
import {
  createNestedColumnTools,
  createNestedRichEditor,
  nestedRichFieldInlineToolbar,
  type NestedRichEditor,
} from '~~/editor/admin/nested-editor'
import {
  normalizeAccordionBodyData,
  normalizeAccordionGroupBlockData,
  normalizeAccordionGroupItemData,
  validateAccordionGroupBlockData,
  type AccordionBodyData,
  type AccordionGroupBlockData,
  type AccordionGroupItemData,
  type AccordionHeaderData,
} from '~~/editor/shared'
import { getCurrentEditorMessages } from '~~/i18n/editor'
import { createBlockToolLabel } from './tool-label'

interface AccordionItemControls {
  root: HTMLElement
  initialOpen: PlainFieldControl<boolean, HTMLInputElement>
  header: RichFieldControl<AccordionHeaderData>
  body: NestedRichEditor<AccordionBodyData>
  bodyField: PlainFieldWrapper
}

interface AccordionGroupToolConfig {
  nestedAccordionDepth?: number
}

export default class AccordionGroupTool implements BlockTool {
  static isReadOnlySupported = true

  private readonly block: BlockAPI
  private readonly readOnly: boolean
  private readonly nestedAccordionDepth: number
  private data: AccordionGroupBlockData
  private closeOthersField: PlainFieldControl<
    boolean,
    HTMLInputElement
  > | null = null
  private itemsRoot: HTMLElement | null = null
  private itemsErrorElement: HTMLParagraphElement | null = null
  private itemControls: AccordionItemControls[] = []

  static get toolbox(): ToolboxConfig {
    const messages = getCurrentEditorMessages()

    return {
      title: messages.tools.accordionGroup.toolboxTitle,
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M3 3h12v3H3V3Zm0 4.5h12v3H3v-3ZM3 12h12v3H3v-3Zm2-7.8v.6h8v-.6H5Zm0 4.5v.6h8v-.6H5Zm0 4.5v.6h8v-.6H5Z"/></svg>',
    }
  }

  constructor(
    options: BlockToolConstructorOptions<
      Partial<AccordionGroupBlockData>,
      AccordionGroupToolConfig
    >,
  ) {
    this.block = options.block
    this.readOnly = options.readOnly
    this.nestedAccordionDepth = options.config?.nestedAccordionDepth ?? 2
    this.data = normalizeAccordionGroupBlockData(options.data)
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div')
    const controls = document.createElement('div')
    const actions = document.createElement('div')
    const addButton = this.createItemButton(
      getCurrentEditorMessages().tools.accordionGroup.addItemButton,
    )
    const messages = getCurrentEditorMessages()

    wrapper.className = 'editor-accordion-group-tool'
    controls.className = 'editor-accordion-group-tool__controls'
    actions.className = 'editor-accordion-group-tool__actions'
    this.itemsRoot = document.createElement('div')
    this.itemsRoot.className = 'editor-accordion-group-tool__items'
    this.itemsErrorElement = document.createElement('p')
    this.itemsErrorElement.className = 'editor-plain-field__error'
    this.itemsErrorElement.hidden = true
    this.itemsErrorElement.setAttribute('role', 'alert')

    this.closeOthersField = createPlainToggleField({
      name: 'accordion-close-others',
      label: messages.tools.accordionGroup.closeOthersLabel,
      value: this.data.closeOthersOnOpen,
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.closeOthersOnOpen = value
        this.dispatchChange()
      },
    })

    addButton.disabled = this.readOnly
    addButton.addEventListener('click', () => {
      void this.addItem()
    })

    controls.append(this.closeOthersField.root)
    actions.append(addButton)
    wrapper.append(
      createBlockToolLabel(
        'accordionGroup',
        messages.tools.accordionGroup.toolboxTitle,
      ),
      controls,
      this.itemsRoot,
      this.itemsErrorElement,
      actions,
    )
    this.renderItems()

    return wrapper
  }

  async save(): Promise<AccordionGroupBlockData> {
    await this.syncItemsFromControls()

    const data = normalizeAccordionGroupBlockData({
      closeOthersOnOpen:
        this.closeOthersField?.getValue() ?? this.data.closeOthersOnOpen,
      items: this.data.items,
    })

    this.syncValidationErrors(data)

    return data
  }

  validate(data: Partial<AccordionGroupBlockData>): boolean {
    this.syncValidationErrors(normalizeAccordionGroupBlockData(data))

    return true
  }

  destroy(): void {
    this.destroyItemControls()
  }

  private renderItems(): void {
    if (!this.itemsRoot) {
      return
    }

    this.destroyItemControls()
    this.itemsRoot.replaceChildren()

    this.data.items.forEach((item, index) => {
      const controls = this.createItemControls(item, index)

      this.itemControls.push(controls)
      this.itemsRoot?.append(controls.root)
      void Promise.all([controls.header.initialize(), controls.body.initialize()])
    })
  }

  private createItemControls(
    item: AccordionGroupItemData,
    index: number,
  ): AccordionItemControls {
    const messages = getCurrentEditorMessages()
    const root = document.createElement('section')
    const header = document.createElement('div')
    const title = document.createElement('p')
    const buttons = document.createElement('div')
    const moveUpButton = this.createItemButton(
      messages.tools.accordionGroup.moveUpButton,
    )
    const moveDownButton = this.createItemButton(
      messages.tools.accordionGroup.moveDownButton,
    )
    const removeButton = this.createItemButton(
      messages.tools.accordionGroup.removeButton,
    )
    const fields = document.createElement('div')

    root.className = 'editor-accordion-group-tool__item'
    header.className = 'editor-accordion-group-tool__item-header'
    title.className = 'editor-accordion-group-tool__item-title'
    title.textContent = messages.tools.accordionGroup.itemTitle(index)
    buttons.className = 'editor-accordion-group-tool__item-buttons'
    fields.className = 'editor-accordion-group-tool__item-fields'

    moveUpButton.disabled = this.readOnly || index === 0
    moveDownButton.disabled = this.readOnly || index === this.data.items.length - 1
    removeButton.disabled = this.readOnly || this.data.items.length === 1

    moveUpButton.addEventListener('click', () => {
      void this.moveItem(index, -1)
    })
    moveDownButton.addEventListener('click', () => {
      void this.moveItem(index, 1)
    })
    removeButton.addEventListener('click', () => {
      void this.removeItem(index)
    })

    const initialOpen = createPlainToggleField({
      name: `accordion-${item.id}-initial-open`,
      label: messages.tools.accordionGroup.initialOpenLabel,
      value: item.isInitiallyOpen,
      readOnly: this.readOnly,
      onChange: (value) => {
        item.isInitiallyOpen = value
        this.dispatchChange()
      },
    })

    const richHeader = createRichHeaderField({
      name: `accordion-${item.id}-header`,
      label: messages.tools.accordionGroup.headerLabel,
      value: item.header,
      readOnly: this.readOnly,
      placeholder: messages.tools.accordionGroup.headerPlaceholder,
      onChange: () => {
        richHeader.setError(undefined)
        this.dispatchChange()
      },
    })

    let bodyField: PlainFieldWrapper | null = null
    const body = this.createBodyEditor(item.body, () => {
      bodyField?.setError(undefined)
      this.dispatchChange()
    })
    bodyField = createPlainFieldWrapper({
      name: `accordion-${item.id}-body`,
      label: messages.tools.accordionGroup.bodyLabel,
      readOnly: this.readOnly,
      control: body.holder,
    })

    buttons.append(moveUpButton, moveDownButton, removeButton)
    header.append(title, buttons)
    fields.append(initialOpen.root, richHeader.root, bodyField.root)
    root.append(header, fields)

    return {
      root,
      initialOpen,
      header: richHeader,
      body,
      bodyField,
    }
  }

  private createBodyEditor(
    value: AccordionBodyData,
    onChange: () => void,
  ): NestedRichEditor<AccordionBodyData> {
    return createNestedRichEditor({
      data: value,
      readOnly: this.readOnly,
      className: 'editor-accordion-group-tool__body-editor',
      inlineToolbar: nestedRichFieldInlineToolbar,
      normalizeData: normalizeAccordionBodyData,
      createTools: () =>
        createAccordionBodyTools({
          nestedAccordionDepth: this.nestedAccordionDepth,
        }),
      placeholder: getCurrentEditorMessages().tools.accordionGroup.bodyPlaceholder,
      onChange,
    })
  }

  private createItemButton(label: string): HTMLButtonElement {
    const button = document.createElement('button')

    button.className = 'editor-accordion-group-tool__button'
    button.type = 'button'
    button.contentEditable = 'false'
    button.tabIndex = 0
    button.textContent = label
    button.addEventListener('keydown', (event) => {
      event.stopPropagation()
    })

    return button
  }

  private async addItem(): Promise<void> {
    await this.syncItemsFromControls()
    this.data.items.push(normalizeAccordionGroupItemData({}))
    this.setItemsError(undefined)
    this.renderItems()
    this.dispatchChange()
  }

  private async moveItem(index: number, direction: -1 | 1): Promise<void> {
    await this.syncItemsFromControls()

    const targetIndex = index + direction
    const item = this.data.items[index]

    if (!item || targetIndex < 0 || targetIndex >= this.data.items.length) {
      return
    }

    this.data.items.splice(index, 1)
    this.data.items.splice(targetIndex, 0, item)
    this.renderItems()
    this.dispatchChange()
  }

  private async removeItem(index: number): Promise<void> {
    await this.syncItemsFromControls()

    if (this.data.items.length <= 1) {
      return
    }

    this.data.items.splice(index, 1)
    this.setItemsError(undefined)
    this.renderItems()
    this.dispatchChange()
  }

  private async syncItemsFromControls(): Promise<void> {
    const items = await Promise.all(
      this.itemControls.map(async (controls, index) => {
        return normalizeAccordionGroupItemData({
          id: this.data.items[index]?.id,
          isInitiallyOpen: controls.initialOpen.getValue(),
          header: await controls.header.save(),
          body: await controls.body.save(),
        })
      }),
    )

    if (items.length > 0) {
      this.data = normalizeAccordionGroupBlockData({
        ...this.data,
        items,
      })
    }
  }

  private destroyItemControls(): void {
    this.itemControls.forEach((controls) => {
      controls.header.destroy()
      controls.body.destroy()
    })
    this.itemControls = []
  }

  private syncValidationErrors(data: AccordionGroupBlockData): boolean {
    const result = validateAccordionGroupBlockData(data)

    this.setItemsError(
      result.issues.find((issue) => issue.path === 'items')?.message,
    )

    this.itemControls.forEach((controls, index) => {
      controls.header.setError(
        result.issues.find((issue) =>
          issue.path.startsWith(`items.${index}.header`),
        )?.message,
      )
      controls.bodyField.setError(
        result.issues.find((issue) =>
          issue.path.startsWith(`items.${index}.body`),
        )?.message,
      )
    })

    return result.valid
  }

  private setItemsError(error?: string): void {
    if (!this.itemsErrorElement) {
      return
    }

    this.itemsErrorElement.textContent = error ?? ''
    this.itemsErrorElement.hidden = !error
  }

  private dispatchChange(): void {
    this.block.dispatchChange()
  }
}

export const AccordionGroupToolConstructable =
  AccordionGroupTool as unknown as ToolConstructable

async function createAccordionBodyTools({
  nestedAccordionDepth,
}: {
  nestedAccordionDepth: number
}): Promise<EditorConfig['tools']> {
  const tools = await createNestedColumnTools()

  if (nestedAccordionDepth <= 0) {
    return tools
  }

  return {
    ...tools,
    accordionGroup: {
      class: AccordionGroupToolConstructable,
      config: {
        nestedAccordionDepth: nestedAccordionDepth - 1,
      },
    },
  }
}
