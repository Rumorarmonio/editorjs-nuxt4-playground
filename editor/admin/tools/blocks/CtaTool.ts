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
  createPlainUrlField,
  type PlainFieldControl,
} from '~~/editor/admin/fields'
import {
  ctaBlockActionTypes,
  ctaBlockTargets,
  ctaBlockVariants,
  normalizeCtaBlockData,
  validateCtaBlockData,
  type CtaBlockActionType,
  type CtaBlockData,
  type CtaBlockTarget,
  type CtaBlockVariant,
} from '~~/editor/shared'
import { getCurrentEditorMessages } from '~~/i18n/editor'
import { createBlockToolLabel } from './tool-label'

export default class CtaTool implements BlockTool {
  static isReadOnlySupported = true

  private readonly block: BlockAPI
  private readonly readOnly: boolean
  private data: CtaBlockData
  private labelField: PlainFieldControl<string, HTMLInputElement> | null = null
  private urlField: PlainFieldControl<string, HTMLInputElement> | null = null
  private variantField: PlainFieldControl<
    CtaBlockVariant,
    HTMLSelectElement
  > | null = null
  private actionTypeField: PlainFieldControl<
    CtaBlockActionType,
    HTMLSelectElement
  > | null = null
  private targetField: PlainFieldControl<
    CtaBlockTarget,
    HTMLSelectElement
  > | null = null
  private eventNameField: PlainFieldControl<string, HTMLInputElement> | null =
    null
  private eventPayloadJsonField: PlainFieldControl<
    string,
    HTMLTextAreaElement
  > | null = null

  static get toolbox(): ToolboxConfig {
    const messages = getCurrentEditorMessages()

    return {
      title: messages.tools.cta.toolboxTitle,
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 3 13.5v-9Zm3 3v3h4.2L8.6 12.1 9.7 13.2 13.2 9.7 9.7 6.2 8.6 7.3 10.2 9H6Z"/></svg>',
    }
  }

  constructor(options: BlockToolConstructorOptions<Partial<CtaBlockData>>) {
    this.block = options.block
    this.readOnly = options.readOnly
    this.data = normalizeCtaBlockData(options.data)
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div')
    const messages = getCurrentEditorMessages()

    wrapper.className = 'editor-cta-tool'

    this.labelField = createPlainTextField({
      name: 'cta-label',
      label: messages.tools.cta.labelLabel,
      value: this.data.label,
      placeholder: messages.tools.cta.labelPlaceholder,
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.label = value
        this.labelField?.setError(undefined)
        this.dispatchChange()
      },
    })

    this.urlField = createPlainUrlField({
      name: 'cta-url',
      label: messages.tools.cta.urlLabel,
      value: this.data.url,
      placeholder: messages.tools.cta.urlPlaceholder,
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.url = value
        this.urlField?.setError(undefined)
        this.dispatchChange()
      },
    })

    this.variantField = createPlainSelectField<CtaBlockVariant>({
      name: 'cta-variant',
      label: messages.tools.cta.variantLabel,
      value: this.data.variant,
      options: ctaBlockVariants.map((variant) => ({
        value: variant,
        label: messages.tools.cta.variantOptions[variant],
      })),
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.variant = value
        this.dispatchChange()
      },
    })

    this.actionTypeField = createPlainSelectField<CtaBlockActionType>({
      name: 'cta-action-type',
      label: messages.tools.cta.actionTypeLabel,
      value: this.data.actionType,
      options: ctaBlockActionTypes.map((actionType) => ({
        value: actionType,
        label: messages.tools.cta.actionTypeOptions[actionType],
      })),
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.actionType = value
        this.eventNameField?.setError(undefined)
        this.eventPayloadJsonField?.setError(undefined)
        this.urlField?.setError(undefined)
        this.updateActionFields()
        this.dispatchChange()
      },
    })

    this.targetField = createPlainSelectField<CtaBlockTarget>({
      name: 'cta-target',
      label: messages.tools.cta.targetLabel,
      value: this.data.target,
      options: ctaBlockTargets.map((target) => ({
        value: target,
        label: messages.tools.cta.targetOptions[target],
      })),
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.target = value
        this.dispatchChange()
      },
    })

    this.eventNameField = createPlainTextField({
      name: 'cta-event-name',
      label: messages.tools.cta.eventNameLabel,
      value: this.data.eventName,
      placeholder: messages.tools.cta.eventNamePlaceholder,
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.eventName = value
        this.eventNameField?.setError(undefined)
        this.dispatchChange()
      },
    })

    this.eventPayloadJsonField = createPlainTextareaField({
      name: 'cta-event-payload-json',
      label: messages.tools.cta.eventPayloadJsonLabel,
      value: this.data.eventPayloadJson,
      placeholder: messages.tools.cta.eventPayloadJsonPlaceholder,
      rows: 5,
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.eventPayloadJson = value
        this.eventPayloadJsonField?.setError(undefined)
        this.dispatchChange()
      },
    })
    this.eventPayloadJsonField.root.classList.add(
      'editor-cta-tool__payload-field',
    )

    const settings = document.createElement('div')

    settings.className = 'editor-cta-tool__settings'
    settings.append(
      this.variantField.root,
      this.actionTypeField.root,
      this.urlField.root,
      this.targetField.root,
      this.eventNameField.root,
      this.eventPayloadJsonField.root,
    )
    wrapper.append(
      createBlockToolLabel('cta', messages.tools.cta.toolboxTitle),
      this.labelField.root,
      settings,
    )
    this.updateActionFields()

    return wrapper
  }

  save(): CtaBlockData {
    const data = this.getCurrentData()

    this.syncValidationErrors(data)

    return data
  }

  validate(data: Partial<CtaBlockData>): boolean {
    this.syncValidationErrors(normalizeCtaBlockData(data))

    return true
  }

  private getCurrentData(): CtaBlockData {
    return normalizeCtaBlockData({
      label: this.labelField?.getValue() ?? this.data.label,
      url: this.urlField?.getValue() ?? this.data.url,
      variant: this.variantField?.getValue() ?? this.data.variant,
      actionType:
        this.actionTypeField?.getValue() ?? this.data.actionType,
      target: this.targetField?.getValue() ?? this.data.target,
      eventName: this.eventNameField?.getValue() ?? this.data.eventName,
      eventPayloadJson:
        this.eventPayloadJsonField?.getValue() ?? this.data.eventPayloadJson,
    })
  }

  private syncValidationErrors(data: CtaBlockData): boolean {
    const result = validateCtaBlockData(data)

    this.labelField?.setError(
      result.issues.find((issue) => issue.path === 'label')?.message,
    )
    this.urlField?.setError(
      result.issues.find((issue) => issue.path === 'url')?.message,
    )
    this.eventNameField?.setError(
      result.issues.find((issue) => issue.path === 'eventName')?.message,
    )
    this.eventPayloadJsonField?.setError(
      result.issues.find((issue) => issue.path === 'eventPayloadJson')?.message,
    )

    return result.valid
  }

  private updateActionFields(): void {
    const actionType = this.actionTypeField?.getValue() ?? this.data.actionType
    const isLinkAction = actionType === 'link'

    if (this.urlField) {
      this.urlField.root.hidden = !isLinkAction
    }

    if (this.targetField) {
      this.targetField.root.hidden = !isLinkAction
    }

    if (this.eventNameField) {
      this.eventNameField.root.hidden = isLinkAction
    }

    if (this.eventPayloadJsonField) {
      this.eventPayloadJsonField.root.hidden = isLinkAction
    }
  }

  private dispatchChange(): void {
    this.block.dispatchChange()
  }
}

export const CtaToolConstructable = CtaTool as unknown as ToolConstructable
