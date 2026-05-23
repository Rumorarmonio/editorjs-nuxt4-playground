import type {
  BlockAPI,
  BlockTool,
  BlockToolConstructorOptions,
  SanitizerConfig,
  ToolConstructable,
  ToolboxConfig,
} from '@editorjs/editorjs/types'
import {
  createPlainSelectField,
  createPlainTextField,
  createPlainToggleField,
  createPlainUrlField,
  type PlainFieldControl,
} from '~~/editor/admin/fields'
import {
  createDefaultDataCardsViewAllHref,
  getDataCardsSourceConfig,
  normalizeDataCardsBlockData,
  type DataCardsBlockData,
  type DataCardsSource,
  type DataCardsViewMode,
} from '~~/editor/shared'
import { getCurrentEditorMessages } from '~~/i18n/editor'
import { createBlockToolLabel } from './tool-label'

interface DataCardsFieldSet {
  limit: PlainFieldControl<string, HTMLInputElement>
  loadMoreStep: PlainFieldControl<string, HTMLInputElement>
  order: PlainFieldControl<'asc' | 'desc', HTMLSelectElement>
  root: HTMLElement
  showLoadMore: PlainFieldControl<boolean, HTMLInputElement>
  showVisitorControls: PlainFieldControl<boolean, HTMLInputElement>
  showViewAllButton: PlainFieldControl<boolean, HTMLInputElement>
  skip: PlainFieldControl<string, HTMLInputElement>
  source: PlainFieldControl<DataCardsSource, HTMLSelectElement>
  viewAllHref: PlainFieldControl<string, HTMLInputElement>
  viewMode: PlainFieldControl<DataCardsViewMode, HTMLSelectElement>
}

export default class DataCardsTool implements BlockTool {
  static isReadOnlySupported = true

  static get sanitize(): SanitizerConfig {
    return {
      limit: true,
      loadMoreStep: true,
      order: true,
      skip: true,
      showLoadMore: true,
      showVisitorControls: true,
      showViewAllButton: true,
      source: true,
      viewAllHref: true,
      viewMode: true,
    }
  }

  static get toolbox(): ToolboxConfig {
    const messages = getCurrentEditorMessages()

    return {
      title: messages.tools.dataCards.toolboxTitle,
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5v9A1.5 1.5 0 0 1 13.5 15h-9A1.5 1.5 0 0 1 3 13.5v-9Zm1.5 0v2h9v-2h-9Zm0 3.5v5.5h9V8h-9Zm1.25 1.25h2.75v1.25H5.75V9.25Zm0 2.5h4.75V13H5.75v-1.25Z"/></svg>',
    }
  }

  private readonly block: BlockAPI
  private readonly readOnly: boolean
  private data: DataCardsBlockData
  private fieldSet: DataCardsFieldSet | null = null

  constructor(options: BlockToolConstructorOptions<Partial<DataCardsBlockData>>) {
    this.block = options.block
    this.readOnly = options.readOnly
    this.data = normalizeDataCardsBlockData(options.data)
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div')
    const settings = document.createElement('div')
    const actions = document.createElement('div')
    const messages = getCurrentEditorMessages()

    wrapper.className = 'editor-data-cards-tool'
    settings.className = 'editor-data-cards-tool__settings'
    actions.className = 'editor-data-cards-tool__actions'

    wrapper.append(
      createBlockToolLabel(
        'dataCards',
        messages.tools.dataCards.toolboxTitle,
      ),
      settings,
      actions,
    )

    this.renderFields(settings, actions)

    return wrapper
  }

  async save(): Promise<DataCardsBlockData> {
    this.syncDataFromFields()

    this.data = normalizeDataCardsBlockData(this.data)

    return this.data
  }

  validate(data: Partial<DataCardsBlockData>): boolean {
    this.data = normalizeDataCardsBlockData(data)
    this.syncFieldValues()

    return true
  }

  destroy(): void {
    this.destroyFields()
  }

  private renderFields(settings: HTMLElement, actions: HTMLElement): void {
    this.destroyFields()
    settings.replaceChildren()
    actions.replaceChildren()

    const messages = getCurrentEditorMessages()
    const loadMoreRow = document.createElement('div')
    const viewAllRow = document.createElement('div')

    loadMoreRow.className = 'editor-data-cards-tool__inline-row'
    viewAllRow.className = 'editor-data-cards-tool__inline-row'
    loadMoreRow.style.gridColumn = '1 / -1'
    viewAllRow.style.gridColumn = '1 / -1'

    const source = createPlainSelectField<DataCardsSource>({
      name: 'data-cards-source',
      label: messages.tools.dataCards.sourceLabel,
      value: this.data.source,
      readOnly: this.readOnly,
      options: Object.entries(messages.tools.dataCards.sourceOptions).map(
        ([value, label]) => ({
          value: value as DataCardsSource,
          label,
        }),
      ),
      onChange: (value) => {
        this.data.source = value
        this.data.order = getDataCardsSourceConfig(value).defaultOrder
        this.data.viewAllHref = createDefaultDataCardsViewAllHref(value)
        this.data.showLoadMore = false
        this.renderFields(settings, actions)
        this.dispatchChange()
      },
    })

    const viewMode = createPlainSelectField<DataCardsViewMode>({
      name: 'data-cards-view-mode',
      label: messages.tools.dataCards.viewModeLabel,
      value: this.data.viewMode,
      readOnly: this.readOnly,
      options: Object.entries(messages.tools.dataCards.viewModeOptions).map(
        ([value, label]) => ({
          value: value as DataCardsViewMode,
          label,
        }),
      ),
      onChange: (value) => {
        this.data.viewMode = value
        if (value === 'slider') {
          this.data.showLoadMore = false
          this.fieldSet?.showLoadMore.setValue(false)
        }
        this.syncLoadMoreControlsState()
        this.dispatchChange()
      },
    })

    const limit = createPlainTextField({
      name: 'data-cards-limit',
      label: messages.tools.dataCards.limitLabel,
      value: String(this.data.limit),
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.limit = parsePositiveInteger(value, this.data.limit)
        this.dispatchChange()
      },
    })
    setupNumericField(limit.control, 1)

    const skip = createPlainTextField({
      name: 'data-cards-skip',
      label: messages.tools.dataCards.skipLabel,
      value: String(this.data.skip),
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.skip = parseNonNegativeInteger(value, this.data.skip)
        this.dispatchChange()
      },
    })
    setupNumericField(skip.control, 0)

    const order = createPlainSelectField<'asc' | 'desc'>({
      name: 'data-cards-order',
      label: messages.tools.dataCards.orderLabel,
      value: this.data.order,
      readOnly: this.readOnly,
      options: Object.entries(messages.tools.dataCards.orderOptions).map(
        ([value, label]) => ({
          value: value as 'asc' | 'desc',
          label,
        }),
      ),
      onChange: (value) => {
        this.data.order = value
        this.dispatchChange()
      },
    })

    const showLoadMore = createPlainToggleField({
      name: 'data-cards-show-load-more',
      label: messages.tools.dataCards.showLoadMoreLabel,
      value: this.data.showLoadMore,
      inlineLabel: true,
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.showLoadMore = value
        this.syncLoadMoreControlsState()
        this.dispatchChange()
      },
    })

    const loadMoreStep = createPlainTextField({
      name: 'data-cards-load-more-step',
      label: messages.tools.dataCards.loadMoreStepLabel,
      value: String(this.data.loadMoreStep),
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.loadMoreStep = parsePositiveInteger(value, this.data.loadMoreStep)
        this.dispatchChange()
      },
    })
    setupNumericField(loadMoreStep.control, 1)

    const showViewAllButton = createPlainToggleField({
      name: 'data-cards-show-view-all',
      label: messages.tools.dataCards.showViewAllButtonLabel,
      value: this.data.showViewAllButton,
      inlineLabel: true,
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.showViewAllButton = value
        this.syncViewAllControlsState()
        this.dispatchChange()
      },
    })

    const showVisitorControls = createPlainToggleField({
      name: 'data-cards-show-visitor-controls',
      label: messages.tools.dataCards.showVisitorControlsLabel,
      value: this.data.showVisitorControls,
      inlineLabel: true,
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.showVisitorControls = value
        this.dispatchChange()
      },
    })

    const viewAllHref = createPlainUrlField({
      name: 'data-cards-view-all-href',
      label: messages.tools.dataCards.viewAllHrefLabel,
      value: this.data.viewAllHref,
      readOnly: this.readOnly,
      placeholder: createDefaultDataCardsViewAllHref(this.data.source),
      onChange: (value) => {
        this.data.viewAllHref = value
        this.dispatchChange()
      },
    })

    loadMoreRow.append(showLoadMore.root, loadMoreStep.root)
    viewAllRow.append(showViewAllButton.root, viewAllHref.root)
    showVisitorControls.root.style.gridColumn = '1 / -1'

    this.fieldSet = {
      limit,
      loadMoreStep,
      order,
      root: settings,
      showLoadMore,
      showVisitorControls,
      showViewAllButton,
      skip,
      source,
      viewAllHref,
      viewMode,
    }

    settings.append(
      source.root,
      viewMode.root,
      limit.root,
      skip.root,
      order.root,
      loadMoreRow,
      viewAllRow,
      showVisitorControls.root,
    )
    this.syncLoadMoreControlsState()
    this.syncViewAllControlsState()
  }

  private syncDataFromFields(): void {
    if (!this.fieldSet) {
      return
    }

    this.data = normalizeDataCardsBlockData({
      ...this.data,
      limit: parsePositiveInteger(
        this.fieldSet.limit.getValue(),
        this.data.limit,
      ),
      loadMoreStep: parsePositiveInteger(
        this.fieldSet.loadMoreStep.getValue(),
        this.data.loadMoreStep,
      ),
      order: this.fieldSet.order.getValue(),
      skip: parseNonNegativeInteger(this.fieldSet.skip.getValue(), this.data.skip),
      showLoadMore: this.fieldSet.showLoadMore.getValue(),
      showVisitorControls: this.fieldSet.showVisitorControls.getValue(),
      showViewAllButton: this.fieldSet.showViewAllButton.getValue(),
      viewAllHref: this.fieldSet.viewAllHref.getValue(),
      viewMode: this.fieldSet.viewMode.getValue(),
    })
  }

  private syncFieldValues(): void {
    if (!this.fieldSet) {
      return
    }

    this.fieldSet.source.setValue(this.data.source)
    this.fieldSet.viewMode.setValue(this.data.viewMode)
    this.fieldSet.limit.setValue(String(this.data.limit))
    this.fieldSet.skip.setValue(String(this.data.skip))
    this.fieldSet.order.setValue(this.data.order)
    this.fieldSet.showLoadMore.setValue(this.data.showLoadMore)
    this.fieldSet.loadMoreStep.setValue(String(this.data.loadMoreStep))
    this.fieldSet.showViewAllButton.setValue(this.data.showViewAllButton)
    this.fieldSet.viewAllHref.setValue(this.data.viewAllHref)
    this.fieldSet.showVisitorControls.setValue(this.data.showVisitorControls)
    this.syncLoadMoreControlsState()
    this.syncViewAllControlsState()
  }

  private syncLoadMoreControlsState(): void {
    if (!this.fieldSet) {
      return
    }

    const isSlider = this.data.viewMode === 'slider'
    const hideLoadMoreStep = isSlider || !this.data.showLoadMore

    this.fieldSet.showLoadMore.setDisabled(isSlider || this.readOnly)
    if (isSlider) {
      this.fieldSet.showLoadMore.setValue(false)
      this.data.showLoadMore = false
    }
    this.fieldSet.loadMoreStep.root.hidden = hideLoadMoreStep
    this.fieldSet.loadMoreStep.setDisabled(hideLoadMoreStep || this.readOnly)
  }

  private syncViewAllControlsState(): void {
    if (!this.fieldSet) {
      return
    }

    const hideViewAllHref = !this.data.showViewAllButton

    this.fieldSet.viewAllHref.root.hidden = hideViewAllHref
    this.fieldSet.viewAllHref.setDisabled(
      hideViewAllHref || this.readOnly,
    )
  }

  private destroyFields(): void {
    if (!this.fieldSet) {
      return
    }

    this.fieldSet.source.destroy?.()
    this.fieldSet.viewMode.destroy?.()
    this.fieldSet.limit.destroy?.()
    this.fieldSet.skip.destroy?.()
    this.fieldSet.order.destroy?.()
    this.fieldSet.showLoadMore.destroy?.()
    this.fieldSet.loadMoreStep.destroy?.()
    this.fieldSet.showViewAllButton.destroy?.()
    this.fieldSet.viewAllHref.destroy?.()
    this.fieldSet.showVisitorControls.destroy?.()
    this.fieldSet = null
  }

  private dispatchChange(): void {
    this.block.dispatchChange()
  }
}

function parsePositiveInteger(value: string, fallback: number): number {
  const parsed = Number.parseInt(value, 10)

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

function parseNonNegativeInteger(value: string, fallback: number): number {
  const parsed = Number.parseInt(value, 10)

  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback
}

function setupNumericField(
  input: HTMLInputElement,
  min: number,
  step = 1,
): void {
  input.type = 'number'
  input.min = String(min)
  input.step = String(step)
}

export const DataCardsToolConstructable =
  DataCardsTool as unknown as ToolConstructable
