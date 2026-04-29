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
  type PlainTextFieldMaskOptions,
} from '~~/editor/admin/fields'
import {
  normalizeMaskedFieldsDemoBlockData,
  type MaskedFieldsDemoBlockData,
} from '~~/editor/shared'
import { getCurrentEditorMessages } from '~~/i18n/editor'

type MaskedFieldName = keyof MaskedFieldsDemoBlockData

interface MaskedFieldConfig {
  name: MaskedFieldName
  placeholder: string
  inputMode?: HTMLInputElement['inputMode']
  autocomplete?: string
  mask: PlainTextFieldMaskOptions
}

const maskedFieldConfigs: readonly MaskedFieldConfig[] = [
  {
    name: 'phone',
    placeholder: '+1 (555) 123-4567',
    inputMode: 'tel',
    autocomplete: 'tel',
    mask: {
      mask: '+{1} (000) 000-0000',
    },
  },
  {
    name: 'date',
    placeholder: '04/29/2026',
    inputMode: 'numeric',
    autocomplete: 'off',
    mask: {
      mask: '00/00/0000',
    },
  },
  {
    name: 'time',
    placeholder: '14:30',
    inputMode: 'numeric',
    autocomplete: 'off',
    mask: {
      mask: '00:00',
    },
  },
  {
    name: 'price',
    placeholder: '$1,299.99',
    inputMode: 'decimal',
    autocomplete: 'off',
    mask: {
      mask: '$num',
      blocks: {
        num: {
          mask: Number,
          radix: '.',
          scale: 2,
          thousandsSeparator: ',',
          mapToRadix: ['.'],
          normalizeZeros: true,
        },
      },
    },
  },
  {
    name: 'card',
    placeholder: '4242 4242 4242 4242',
    inputMode: 'numeric',
    autocomplete: 'cc-number',
    mask: {
      mask: '0000 0000 0000 0000',
    },
  },
  {
    name: 'email',
    placeholder: 'editor@example.com',
    inputMode: 'email',
    autocomplete: 'email',
    mask: {
      mask: /^[^\s@]*@?[^\s@]*\.?[^\s@]*$/,
    },
  },
] as const

export default class MaskedFieldsDemoTool implements BlockTool {
  static isReadOnlySupported = true

  private readonly block: BlockAPI
  private readonly readOnly: boolean
  private data: MaskedFieldsDemoBlockData
  private fields = new Map<
    MaskedFieldName,
    PlainFieldControl<string, HTMLInputElement>
  >()

  static get toolbox(): ToolboxConfig {
    const messages = getCurrentEditorMessages()

    return {
      title: messages.tools.maskedFieldsDemo.toolboxTitle,
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M3.75 2.75h10.5A1.75 1.75 0 0 1 16 4.5v9a1.75 1.75 0 0 1-1.75 1.75H3.75A1.75 1.75 0 0 1 2 13.5v-9a1.75 1.75 0 0 1 1.75-1.75Zm0 1.5a.25.25 0 0 0-.25.25v1h11v-1a.25.25 0 0 0-.25-.25H3.75Zm10.75 2.75h-11v6.5c0 .14.11.25.25.25h10.5c.14 0 .25-.11.25-.25V7ZM5 9h2.5v1.5H5V9Zm4 0h4v1.5H9V9Zm-4 2.5h5v1.5H5v-1.5Z"/></svg>',
    }
  }

  constructor(
    options: BlockToolConstructorOptions<
      Partial<MaskedFieldsDemoBlockData>
    >,
  ) {
    this.block = options.block
    this.readOnly = options.readOnly
    this.data = normalizeMaskedFieldsDemoBlockData(options.data)
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div')
    const fieldsRoot = document.createElement('div')
    const messages = getCurrentEditorMessages()

    wrapper.className = 'editor-masked-fields-demo-tool'
    fieldsRoot.className = 'editor-masked-fields-demo-tool__fields'

    maskedFieldConfigs.forEach((config) => {
      const field = createPlainTextField({
        name: `masked-fields-demo-${config.name}`,
        label: messages.tools.maskedFieldsDemo.fields[config.name],
        value: this.data[config.name],
        placeholder: config.placeholder,
        inputMode: config.inputMode,
        autocomplete: config.autocomplete,
        readOnly: this.readOnly,
        mask: config.mask,
        onChange: (value) => {
          this.data[config.name] = value
          this.block.dispatchChange()
        },
      })

      this.fields.set(config.name, field)
      fieldsRoot.append(field.root)
    })

    wrapper.append(fieldsRoot)

    return wrapper
  }

  save(): MaskedFieldsDemoBlockData {
    return normalizeMaskedFieldsDemoBlockData({
      phone: this.fields.get('phone')?.getValue() ?? this.data.phone,
      date: this.fields.get('date')?.getValue() ?? this.data.date,
      time: this.fields.get('time')?.getValue() ?? this.data.time,
      price: this.fields.get('price')?.getValue() ?? this.data.price,
      card: this.fields.get('card')?.getValue() ?? this.data.card,
      email: this.fields.get('email')?.getValue() ?? this.data.email,
    })
  }

  validate(): boolean {
    return true
  }

  destroy(): void {
    this.fields.forEach((field) => {
      field.destroy?.()
    })
    this.fields.clear()
  }
}

export const MaskedFieldsDemoToolConstructable =
  MaskedFieldsDemoTool as unknown as ToolConstructable
