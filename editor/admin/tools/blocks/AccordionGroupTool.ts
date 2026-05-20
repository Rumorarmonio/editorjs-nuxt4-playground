import type {
  BlockAPI,
  BlockTool,
  BlockToolConstructorOptions,
  ToolConstructable,
  ToolboxConfig,
} from '@editorjs/editorjs/types'
import {
  createPlainTextareaField,
  createPlainToggleField,
  type PlainFieldControl,
} from '~~/editor/admin/fields'
import {
  normalizeAccordionGroupBlockData,
  validateAccordionGroupBlockData,
  type AccordionGroupBlockData,
} from '~~/editor/shared'
import { getCurrentEditorMessages } from '~~/i18n/editor'
import { createBlockToolLabel } from './tool-label'

export default class AccordionGroupTool implements BlockTool {
  static isReadOnlySupported = true

  private readonly block: BlockAPI
  private readonly readOnly: boolean
  private data: AccordionGroupBlockData
  private closeOthersField: PlainFieldControl<
    boolean,
    HTMLInputElement
  > | null = null
  private itemsJsonField: PlainFieldControl<
    string,
    HTMLTextAreaElement
  > | null = null

  static get toolbox(): ToolboxConfig {
    const messages = getCurrentEditorMessages()

    return {
      title: messages.tools.accordionGroup.toolboxTitle,
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M3 3h12v3H3V3Zm0 4.5h12v3H3v-3ZM3 12h12v3H3v-3Zm2-7.8v.6h8v-.6H5Zm0 4.5v.6h8v-.6H5Zm0 4.5v.6h8v-.6H5Z"/></svg>',
    }
  }

  constructor(
    options: BlockToolConstructorOptions<Partial<AccordionGroupBlockData>>,
  ) {
    this.block = options.block
    this.readOnly = options.readOnly
    this.data = normalizeAccordionGroupBlockData(options.data)
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div')
    const messages = getCurrentEditorMessages()

    wrapper.className = 'editor-accordion-group-tool'

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

    this.itemsJsonField = createPlainTextareaField({
      name: 'accordion-items-json',
      label: messages.tools.accordionGroup.itemsJsonLabel,
      value: JSON.stringify(this.data.items, null, 2),
      placeholder: messages.tools.accordionGroup.itemsJsonPlaceholder,
      rows: 12,
      readOnly: this.readOnly,
      onChange: (value) => {
        this.itemsJsonField?.setError(undefined)
        this.data = this.getDataFromJson(value)
        this.dispatchChange()
      },
    })

    wrapper.append(
      createBlockToolLabel(
        'accordionGroup',
        messages.tools.accordionGroup.toolboxTitle,
      ),
      this.closeOthersField.root,
      this.itemsJsonField.root,
    )

    return wrapper
  }

  save(): AccordionGroupBlockData {
    const data = this.getCurrentData()

    this.syncValidationErrors(data)

    return data
  }

  validate(data: Partial<AccordionGroupBlockData>): boolean {
    this.syncValidationErrors(normalizeAccordionGroupBlockData(data))

    return true
  }

  private getCurrentData(): AccordionGroupBlockData {
    return normalizeAccordionGroupBlockData({
      closeOthersOnOpen:
        this.closeOthersField?.getValue() ?? this.data.closeOthersOnOpen,
      items: this.getItemsFromJson() ?? [],
    })
  }

  private getDataFromJson(value: string): AccordionGroupBlockData {
    return normalizeAccordionGroupBlockData({
      closeOthersOnOpen:
        this.closeOthersField?.getValue() ?? this.data.closeOthersOnOpen,
      items: parseItemsJson(value) ?? this.data.items,
    })
  }

  private getItemsFromJson(): AccordionGroupBlockData['items'] | null {
    return parseItemsJson(this.itemsJsonField?.getValue() ?? '')
  }

  private syncValidationErrors(data: AccordionGroupBlockData): boolean {
    const result = validateAccordionGroupBlockData(data)
    const messages = getCurrentEditorMessages()

    this.itemsJsonField?.setError(
      parseItemsJson(this.itemsJsonField.getValue()) === null
        ? messages.tools.accordionGroup.itemsJsonInvalid
        : result.issues.find((issue) => issue.path === 'items')?.message,
    )

    return result.valid
  }

  private dispatchChange(): void {
    this.block.dispatchChange()
  }
}

function parseItemsJson(
  serializedItems: string,
): AccordionGroupBlockData['items'] | null {
  try {
    const parsed: unknown = JSON.parse(serializedItems)

    if (!Array.isArray(parsed)) {
      return null
    }

    return normalizeAccordionGroupBlockData({
      closeOthersOnOpen: false,
      items: parsed,
    }).items
  } catch {
    return null
  }
}

export const AccordionGroupToolConstructable =
  AccordionGroupTool as unknown as ToolConstructable
