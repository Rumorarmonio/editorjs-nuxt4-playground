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
  createPlainToggleField,
  createPlainUrlField,
  createRichParagraphField,
  type PlainFieldControl,
  type RichFieldControl,
} from '~~/editor/admin/fields'
import {
  mediaGalleryItemTypes,
  mediaGalleryModes,
  normalizeMediaGalleryBlockData,
  normalizeMediaGalleryItemData,
  type MediaGalleryBlockData,
  type MediaGalleryItemData,
  type MediaGalleryItemType,
  type MediaGalleryMode,
  type RichParagraphFieldData,
} from '~~/editor/shared'

interface MediaCardControls {
  root: HTMLElement
  type: PlainFieldControl<MediaGalleryItemType, HTMLSelectElement>
  url: PlainFieldControl<string, HTMLInputElement>
  alt: PlainFieldControl<string, HTMLInputElement>
  caption: PlainFieldControl<string, HTMLTextAreaElement>
  description: RichFieldControl<RichParagraphFieldData>
}

const modeOptions = mediaGalleryModes.map((mode) => {
  return {
    label: mode === 'gallery' ? 'Gallery grid' : 'Slider',
    value: mode,
  }
})

const itemTypeOptions = mediaGalleryItemTypes.map((type) => {
  return {
    label: type === 'image' ? 'Image' : 'Video',
    value: type,
  }
})

export default class MediaGalleryTool implements BlockTool {
  static isReadOnlySupported = true

  private readonly block: BlockAPI
  private readonly readOnly: boolean
  private data: MediaGalleryBlockData
  private modeField: PlainFieldControl<MediaGalleryMode, HTMLSelectElement> | null =
    null
  private galleryIdField: PlainFieldControl<string, HTMLInputElement> | null =
    null
  private fancyboxField: PlainFieldControl<boolean, HTMLInputElement> | null =
    null
  private urlSyncField: PlainFieldControl<boolean, HTMLInputElement> | null =
    null
  private cardsRoot: HTMLElement | null = null
  private cardControls: MediaCardControls[] = []

  static get toolbox(): ToolboxConfig {
    return {
      title: 'Media gallery',
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M3 4.25A1.25 1.25 0 0 1 4.25 3h9.5A1.25 1.25 0 0 1 15 4.25v9.5A1.25 1.25 0 0 1 13.75 15h-9.5A1.25 1.25 0 0 1 3 13.75v-9.5Zm1.5.25v7.58l2.2-2.2a1 1 0 0 1 1.42 0l1.02 1.02 2.74-2.74a1 1 0 0 1 1.42 0l.2.2V4.5h-9Zm9 5.98-.9-.9-3.46 3.46-1.73-1.73-2.09 2.09h8.18v-2.92ZM6.75 7.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"/></svg>',
    }
  }

  constructor(
    options: BlockToolConstructorOptions<Partial<MediaGalleryBlockData>>,
  ) {
    this.block = options.block
    this.readOnly = options.readOnly
    this.data = normalizeMediaGalleryBlockData(options.data)
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div')
    const settings = document.createElement('div')
    const actions = document.createElement('div')
    const addButton = document.createElement('button')

    wrapper.className = 'editor-media-gallery-tool'
    settings.className = 'editor-media-gallery-tool__settings'
    actions.className = 'editor-media-gallery-tool__actions'
    this.cardsRoot = document.createElement('div')
    this.cardsRoot.className = 'editor-media-gallery-tool__cards'

    this.modeField = createPlainSelectField<MediaGalleryMode>({
      name: 'media-gallery-mode',
      label: 'Mode',
      value: this.data.mode,
      readOnly: this.readOnly,
      options: modeOptions,
      onChange: (value) => {
        this.data.mode = value
        this.dispatchChange()
      },
    })

    this.galleryIdField = createPlainTextField({
      name: 'media-gallery-id',
      label: 'Gallery ID',
      value: this.data.galleryId,
      readOnly: this.readOnly,
      placeholder: 'project-gallery',
      onChange: (value) => {
        this.data.galleryId = value
        this.dispatchChange()
      },
    })

    this.fancyboxField = createPlainToggleField({
      name: 'media-gallery-fancybox',
      label: 'Enable viewer',
      value: this.data.enableFancybox,
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.enableFancybox = value
        this.dispatchChange()
      },
    })

    this.urlSyncField = createPlainToggleField({
      name: 'media-gallery-url-sync',
      label: 'Sync URL',
      value: this.data.syncUrlWithFancybox,
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.syncUrlWithFancybox = value
        this.dispatchChange()
      },
    })

    addButton.className = 'editor-media-gallery-tool__button'
    addButton.type = 'button'
    addButton.textContent = 'Add card'
    addButton.disabled = this.readOnly
    addButton.addEventListener('click', () => {
      void this.addCard()
    })

    settings.append(
      this.modeField.root,
      this.galleryIdField.root,
      this.fancyboxField.root,
      this.urlSyncField.root,
    )
    actions.append(addButton)
    wrapper.append(settings, this.cardsRoot, actions)
    this.renderCards()

    return wrapper
  }

  async save(): Promise<MediaGalleryBlockData> {
    await this.syncCardsFromControls()

    return normalizeMediaGalleryBlockData({
      mode: this.modeField?.getValue() ?? this.data.mode,
      galleryId: this.galleryIdField?.getValue() ?? this.data.galleryId,
      enableFancybox:
        this.fancyboxField?.getValue() ?? this.data.enableFancybox,
      syncUrlWithFancybox:
        this.urlSyncField?.getValue() ?? this.data.syncUrlWithFancybox,
      items: this.data.items,
    })
  }

  validate(data: Partial<MediaGalleryBlockData>): boolean {
    return normalizeMediaGalleryBlockData(data).items.some((item) => {
      return item.url.length > 0
    })
  }

  destroy(): void {
    this.destroyCardControls()
  }

  private renderCards(): void {
    if (!this.cardsRoot) {
      return
    }

    this.destroyCardControls()
    this.cardsRoot.replaceChildren()

    this.data.items.forEach((item, index) => {
      const controls = this.createCardControls(item, index)

      this.cardControls.push(controls)
      this.cardsRoot?.append(controls.root)
      void controls.description.initialize()
    })
  }

  private createCardControls(
    item: MediaGalleryItemData,
    index: number,
  ): MediaCardControls {
    const root = document.createElement('section')
    const header = document.createElement('div')
    const title = document.createElement('p')
    const buttons = document.createElement('div')
    const moveUpButton = this.createCardButton('Move up')
    const moveDownButton = this.createCardButton('Move down')
    const removeButton = this.createCardButton('Remove')
    const fields = document.createElement('div')

    root.className = 'editor-media-gallery-tool__card'
    header.className = 'editor-media-gallery-tool__card-header'
    title.className = 'editor-media-gallery-tool__card-title'
    title.textContent = `Card ${index + 1}`
    buttons.className = 'editor-media-gallery-tool__card-buttons'
    fields.className = 'editor-media-gallery-tool__card-fields'

    moveUpButton.disabled = this.readOnly || index === 0
    moveDownButton.disabled = this.readOnly || index === this.data.items.length - 1
    removeButton.disabled = this.readOnly || this.data.items.length === 1

    moveUpButton.addEventListener('click', () => {
      void this.moveCard(index, -1)
    })
    moveDownButton.addEventListener('click', () => {
      void this.moveCard(index, 1)
    })
    removeButton.addEventListener('click', () => {
      void this.removeCard(index)
    })

    const type = createPlainSelectField<MediaGalleryItemType>({
      name: `media-gallery-${item.id}-type`,
      label: 'Media type',
      value: item.type,
      readOnly: this.readOnly,
      options: itemTypeOptions,
      onChange: (value) => {
        item.type = value
        if (value === 'video') {
          item.alt = ''
          alt.setValue('')
        }
        alt.root.hidden = value === 'video'
        this.dispatchChange()
      },
    })

    const url = createPlainUrlField({
      name: `media-gallery-${item.id}-url`,
      label: 'Media URL',
      value: item.url,
      readOnly: this.readOnly,
      placeholder: 'https://example.com/media.jpg',
      onChange: (value) => {
        item.url = value
        this.dispatchChange()
      },
    })

    const alt = createPlainTextField({
      name: `media-gallery-${item.id}-alt`,
      label: 'Alt text',
      value: item.alt,
      readOnly: this.readOnly,
      placeholder: 'Describe the image',
      onChange: (value) => {
        item.alt = value
        this.dispatchChange()
      },
    })

    const caption = createPlainTextareaField({
      name: `media-gallery-${item.id}-caption`,
      label: 'Caption',
      value: item.caption,
      readOnly: this.readOnly,
      rows: 2,
      placeholder: 'Short visible caption',
      onChange: (value) => {
        item.caption = value
        this.dispatchChange()
      },
    })

    const description = createRichParagraphField({
      name: `media-gallery-${item.id}-description`,
      label: 'Description',
      value: item.description,
      readOnly: this.readOnly,
      placeholder: 'Optional rich description',
      onChange: () => {
        this.dispatchChange()
      },
    })

    alt.root.hidden = item.type === 'video'
    buttons.append(moveUpButton, moveDownButton, removeButton)
    header.append(title, buttons)
    fields.append(type.root, url.root, alt.root, caption.root, description.root)
    root.append(header, fields)

    return {
      root,
      type,
      url,
      alt,
      caption,
      description,
    }
  }

  private createCardButton(label: string): HTMLButtonElement {
    const button = document.createElement('button')

    button.className = 'editor-media-gallery-tool__button'
    button.type = 'button'
    button.textContent = label

    return button
  }

  private async addCard(): Promise<void> {
    await this.syncCardsFromControls()
    this.data.items.push(normalizeMediaGalleryItemData({}))
    this.renderCards()
    this.dispatchChange()
  }

  private async moveCard(index: number, direction: -1 | 1): Promise<void> {
    await this.syncCardsFromControls()

    const targetIndex = index + direction
    const item = this.data.items[index]

    if (!item || targetIndex < 0 || targetIndex >= this.data.items.length) {
      return
    }

    this.data.items.splice(index, 1)
    this.data.items.splice(targetIndex, 0, item)
    this.renderCards()
    this.dispatchChange()
  }

  private async removeCard(index: number): Promise<void> {
    await this.syncCardsFromControls()

    if (this.data.items.length <= 1) {
      return
    }

    this.data.items.splice(index, 1)
    this.renderCards()
    this.dispatchChange()
  }

  private async syncCardsFromControls(): Promise<void> {
    const items = await Promise.all(
      this.cardControls.map(async (controls, index) => {
        return normalizeMediaGalleryItemData({
          id: this.data.items[index]?.id,
          type: controls.type.getValue(),
          url: controls.url.getValue(),
          alt: controls.type.getValue() === 'image' ? controls.alt.getValue() : '',
          caption: controls.caption.getValue(),
          description: await controls.description.save(),
        })
      }),
    )

    if (items.length > 0) {
      this.data.items = items
    }
  }

  private destroyCardControls(): void {
    this.cardControls.forEach((controls) => {
      controls.description.destroy()
    })
    this.cardControls = []
  }

  private dispatchChange(): void {
    this.block.dispatchChange()
  }
}

export const MediaGalleryToolConstructable =
  MediaGalleryTool as unknown as ToolConstructable
