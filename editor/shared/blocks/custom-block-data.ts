import type {
  HeaderBlockData,
  ListBlockData,
  ListBlockItem,
  ParagraphBlockData,
} from '~~/editor/shared/blocks/standard-block-data'
import type {
  DataCardsBlockData,
} from '~~/editor/shared/blocks/data-cards-block'
import type {
  EditorOutputBlock,
  EditorOutputData,
} from '~~/editor/shared/types/editor-output'
import { isAllowedMediaUrl } from '~~/editor/shared/entities/media'
import { isIconName, type IconName } from '~~/editor/shared/icons/icons'

export const noticeBlockTypes = ['info', 'success', 'warning'] as const

export type NoticeBlockType = (typeof noticeBlockTypes)[number]

export type SectionIntroDescriptionBlock = EditorOutputBlock<
  'paragraph',
  ParagraphBlockData
> | EditorOutputBlock<'list', ListBlockData>
  | EditorOutputBlock<'cta', CtaBlockData>

export type SectionIntroDescriptionData =
  EditorOutputData<SectionIntroDescriptionBlock>

export type RichParagraphBlockData = SectionIntroDescriptionBlock

export type RichParagraphFieldData = SectionIntroDescriptionData

export type RichHeaderBlockData = EditorOutputBlock<'header', HeaderBlockData>

export type RichHeaderFieldData = EditorOutputData<RichHeaderBlockData>

export type AccordionHeaderData = RichHeaderFieldData

export type AccordionBodyContentBlock =
  | EditorOutputBlock<'paragraph', ParagraphBlockData>
  | EditorOutputBlock<'header', HeaderBlockData>
  | EditorOutputBlock<'list', ListBlockData>
  | EditorOutputBlock<'cta', CtaBlockData>

export type AccordionBodyBlock =
  | AccordionBodyContentBlock
  | EditorOutputBlock<'accordionGroup', AccordionGroupBlockData>

export type AccordionBodyData = EditorOutputData<AccordionBodyBlock>

export const twoColumnsLayoutVariants = [
  'equal',
  'leftWide',
  'rightWide',
] as const

export const mediaGalleryModes = ['gallery', 'slider'] as const

export const mediaGalleryItemTypes = ['image', 'video'] as const

export const ctaBlockVariants = ['primary', 'secondary', 'ghost'] as const

export const ctaBlockTargets = ['sameTab', 'newTab'] as const

export const ctaBlockActionTypes = ['link', 'event'] as const

export const ctaBlockContentModes = ['text', 'iconOnly'] as const

export const codeSnippetLanguages = [
  'plain',
  'typescript',
  'javascript',
  'vue',
  'html',
  'css',
  'json',
  'bash',
] as const

export type TwoColumnsLayoutVariant =
  (typeof twoColumnsLayoutVariants)[number]

export type MediaGalleryMode = (typeof mediaGalleryModes)[number]

export type MediaGalleryItemType = (typeof mediaGalleryItemTypes)[number]

export type CtaBlockVariant = (typeof ctaBlockVariants)[number]

export type CtaBlockTarget = (typeof ctaBlockTargets)[number]

export type CtaBlockActionType = (typeof ctaBlockActionTypes)[number]

export type CtaBlockContentMode = (typeof ctaBlockContentModes)[number]

export type CtaBlockIconName = IconName | ''

export type CodeSnippetLanguage = (typeof codeSnippetLanguages)[number]

export type TwoColumnsContentBlock =
  | EditorOutputBlock<'paragraph', ParagraphBlockData>
  | EditorOutputBlock<'header', HeaderBlockData>
  | EditorOutputBlock<'list', ListBlockData>
  | EditorOutputBlock<'cta', CtaBlockData>
  | EditorOutputBlock<'rawHtml', RawHtmlBlockData>

export type TwoColumnsContentData = EditorOutputData<TwoColumnsContentBlock>

export interface NoticeBlockData {
  title: string
  text: RichParagraphFieldData
  type: NoticeBlockType
}

export interface SectionIntroBlockData {
  title: string
  description: SectionIntroDescriptionData
}

export interface TwoColumnsBlockData {
  layout: TwoColumnsLayoutVariant
  isReversed: boolean
  left: TwoColumnsContentData
  right: TwoColumnsContentData
}

export interface MediaGalleryItemData {
  id: string
  type: MediaGalleryItemType
  url: string
  alt: string
  caption: string
  description: RichParagraphFieldData
}

export interface MediaGalleryBlockData {
  mode: MediaGalleryMode
  galleryId: string
  enableFancybox: boolean
  syncUrlWithFancybox: boolean
  items: MediaGalleryItemData[]
}

export interface MaskedFieldsDemoBlockData {
  phone: string
  date: string
  time: string
  price: string
  card: string
  email: string
}

export interface CtaBlockData {
  label: string
  url: string
  variant: CtaBlockVariant
  target: CtaBlockTarget
  actionType: CtaBlockActionType
  contentMode: CtaBlockContentMode
  leftIcon: CtaBlockIconName
  rightIcon: CtaBlockIconName
  icon: CtaBlockIconName
  eventName: string
  eventPayloadJson: string
}

export interface CodeSnippetBlockData {
  language: CodeSnippetLanguage
  code: string
  caption: string
}

export interface RawHtmlBlockData {
  html: string
}

export interface AccordionGroupItemData {
  id: string
  isInitiallyOpen: boolean
  header: AccordionHeaderData
  body: AccordionBodyData
}

export interface AccordionGroupBlockData {
  closeOthersOnOpen: boolean
  items: AccordionGroupItemData[]
}

export interface CustomBlockDataMap {
  notice: NoticeBlockData
  sectionIntro: SectionIntroBlockData
  twoColumns: TwoColumnsBlockData
  mediaGallery: MediaGalleryBlockData
  dataCards: DataCardsBlockData
  maskedFieldsDemo: MaskedFieldsDemoBlockData
  cta: CtaBlockData
  codeSnippet: CodeSnippetBlockData
  rawHtml: RawHtmlBlockData
  accordionGroup: AccordionGroupBlockData
}

export function normalizeNoticeBlockData(value: unknown): NoticeBlockData {
  if (!isRecord(value)) {
    return createDefaultNoticeBlockData()
  }

  return {
    title: typeof value.title === 'string' ? value.title : '',
    text: normalizeNoticeTextData(value.text),
    type: isNoticeBlockType(value.type) ? value.type : 'info',
  }
}

export function isNoticeBlockData(value: unknown): value is NoticeBlockData {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.title === 'string' &&
    isRichParagraphFieldData(value.text) &&
    isNoticeBlockType(value.type)
  )
}

function normalizeNoticeTextData(value: unknown): RichParagraphFieldData {
  return normalizeRichParagraphFieldData(value)
}

export function normalizeSectionIntroBlockData(
  value: unknown,
): SectionIntroBlockData {
  if (!isRecord(value)) {
    return createDefaultSectionIntroBlockData()
  }

  return {
    title: typeof value.title === 'string' ? value.title : '',
    description: normalizeSectionIntroDescriptionData(value.description),
  }
}

export function normalizeSectionIntroDescriptionData(
  value: unknown,
): SectionIntroDescriptionData {
  return normalizeRichParagraphFieldData(value)
}

export function normalizeRichParagraphFieldData(
  value: unknown,
): RichParagraphFieldData {
  if (!isRichParagraphFieldData(value)) {
    return createDefaultRichParagraphFieldData()
  }

  return value
}

export function normalizeRichHeaderFieldData(
  value: unknown,
): RichHeaderFieldData {
  if (!isRichHeaderFieldData(value)) {
    return createDefaultRichHeaderFieldData()
  }

  return value
}

export function normalizeTwoColumnsBlockData(
  value: unknown,
): TwoColumnsBlockData {
  if (!isRecord(value)) {
    return createDefaultTwoColumnsBlockData()
  }

  return {
    layout: isTwoColumnsLayoutVariant(value.layout) ? value.layout : 'equal',
    isReversed:
      typeof value.isReversed === 'boolean' ? value.isReversed : false,
    left: normalizeTwoColumnsContentData(value.left),
    right: normalizeTwoColumnsContentData(value.right),
  }
}

export function normalizeTwoColumnsContentData(
  value: unknown,
): TwoColumnsContentData {
  if (!isTwoColumnsContentData(value)) {
    return createDefaultTwoColumnsContentData()
  }

  return value
}

export function normalizeMediaGalleryBlockData(
  value: unknown,
): MediaGalleryBlockData {
  if (!isRecord(value)) {
    return createDefaultMediaGalleryBlockData()
  }

  return {
    mode: isMediaGalleryMode(value.mode) ? value.mode : 'gallery',
    galleryId: normalizePlainValue(value.galleryId),
    enableFancybox:
      typeof value.enableFancybox === 'boolean'
        ? value.enableFancybox
        : true,
    syncUrlWithFancybox:
      typeof value.syncUrlWithFancybox === 'boolean'
        ? value.syncUrlWithFancybox
        : false,
    items: Array.isArray(value.items)
      ? value.items.map(normalizeMediaGalleryItemData)
      : [],
  }
}

export function normalizeMediaGalleryItemData(
  value: unknown,
): MediaGalleryItemData {
  if (!isRecord(value)) {
    return createDefaultMediaGalleryItemData()
  }

  const type = isMediaGalleryItemType(value.type) ? value.type : 'image'

  return {
    id: normalizePlainValue(value.id) || createMediaGalleryItemId(),
    type,
    url: normalizeMediaUrlValue(value.url),
    alt: type === 'image' ? normalizePlainValue(value.alt) : '',
    caption: normalizeMultilineValue(value.caption),
    description: normalizeRichParagraphFieldData(value.description),
  }
}

export function normalizeMaskedFieldsDemoBlockData(
  value: unknown,
): MaskedFieldsDemoBlockData {
  if (!isRecord(value)) {
    return createDefaultMaskedFieldsDemoBlockData()
  }

  return {
    phone: normalizePlainValue(value.phone),
    date: normalizePlainValue(value.date),
    time: normalizePlainValue(value.time),
    price: normalizePlainValue(value.price),
    card: normalizePlainValue(value.card),
    email: normalizePlainValue(value.email),
  }
}

export function normalizeCtaBlockData(value: unknown): CtaBlockData {
  if (!isRecord(value)) {
    return createDefaultCtaBlockData()
  }

  return {
    label: normalizePlainValue(value.label),
    url: normalizeCtaUrlValue(value.url),
    variant: isCtaBlockVariant(value.variant) ? value.variant : 'primary',
    target: isCtaBlockTarget(value.target) ? value.target : 'sameTab',
    actionType: isCtaBlockActionType(value.actionType)
      ? value.actionType
      : 'link',
    contentMode: isCtaBlockContentMode(value.contentMode)
      ? value.contentMode
      : 'text',
    leftIcon: normalizeIconNameValue(value.leftIcon),
    rightIcon: normalizeIconNameValue(value.rightIcon),
    icon: normalizeIconNameValue(value.icon),
    eventName: normalizeEventNameValue(value.eventName),
    eventPayloadJson: normalizeJsonValue(value.eventPayloadJson),
  }
}

export function normalizeCodeSnippetBlockData(
  value: unknown,
): CodeSnippetBlockData {
  if (!isRecord(value)) {
    return createDefaultCodeSnippetBlockData()
  }

  return {
    language: isCodeSnippetLanguage(value.language) ? value.language : 'plain',
    code: normalizeCodeValue(value.code),
    caption: normalizeMultilineValue(value.caption),
  }
}

export function normalizeRawHtmlBlockData(value: unknown): RawHtmlBlockData {
  if (!isRecord(value)) {
    return createDefaultRawHtmlBlockData()
  }

  return {
    html: normalizeHtmlValue(value.html),
  }
}

export function normalizeAccordionGroupBlockData(
  value: unknown,
): AccordionGroupBlockData {
  if (!isRecord(value)) {
    return createDefaultAccordionGroupBlockData()
  }

  return {
    closeOthersOnOpen:
      typeof value.closeOthersOnOpen === 'boolean'
        ? value.closeOthersOnOpen
        : false,
    items: normalizeAccordionGroupItemsData(value.items),
  }
}

function normalizeAccordionGroupItemsData(
  value: unknown,
): AccordionGroupItemData[] {
  if (!Array.isArray(value)) {
    return []
  }

  const usedIds = new Set<string>()

  return value.map((item) => {
    const normalizedItem = normalizeAccordionGroupItemData(item)
    let id = normalizedItem.id

    while (usedIds.has(id)) {
      id = createAccordionGroupItemId()
    }

    usedIds.add(id)

    return {
      ...normalizedItem,
      id,
    }
  })
}

export function normalizeAccordionGroupItemData(
  value: unknown,
): AccordionGroupItemData {
  if (!isRecord(value)) {
    return createDefaultAccordionGroupItemData()
  }

  return {
    id: normalizePlainValue(value.id) || createAccordionGroupItemId(),
    isInitiallyOpen:
      typeof value.isInitiallyOpen === 'boolean'
        ? value.isInitiallyOpen
        : false,
    header: normalizeAccordionHeaderData(value.header),
    body: normalizeAccordionBodyData(value.body),
  }
}

export function normalizeAccordionHeaderData(
  value: unknown,
): AccordionHeaderData {
  return normalizeRichHeaderFieldData(value)
}

export function normalizeAccordionBodyData(
  value: unknown,
): AccordionBodyData {
  if (!isAccordionBodyData(value)) {
    return createDefaultAccordionBodyData()
  }

  return value
}

export function isSectionIntroBlockData(
  value: unknown,
): value is SectionIntroBlockData {
  return (
    isRecord(value) &&
    typeof value.title === 'string' &&
    isSectionIntroDescriptionData(value.description)
  )
}

export function isSectionIntroDescriptionData(
  value: unknown,
): value is SectionIntroDescriptionData {
  return isRichParagraphFieldData(value)
}

export function isRichParagraphFieldData(
  value: unknown,
): value is RichParagraphFieldData {
  return (
    isRecord(value) &&
    (value.time === undefined || typeof value.time === 'number') &&
    (value.version === undefined || typeof value.version === 'string') &&
    Array.isArray(value.blocks) &&
    value.blocks.every(isRichParagraphFieldBlock)
  )
}

export function isRichHeaderFieldData(
  value: unknown,
): value is RichHeaderFieldData {
  return (
    isRecord(value) &&
    (value.time === undefined || typeof value.time === 'number') &&
    (value.version === undefined || typeof value.version === 'string') &&
    Array.isArray(value.blocks) &&
    value.blocks.length <= 1 &&
    value.blocks.every(isRichHeaderFieldBlock)
  )
}

export function isTwoColumnsBlockData(
  value: unknown,
): value is TwoColumnsBlockData {
  return (
    isRecord(value) &&
    isTwoColumnsLayoutVariant(value.layout) &&
    typeof value.isReversed === 'boolean' &&
    isTwoColumnsContentData(value.left) &&
    isTwoColumnsContentData(value.right)
  )
}

export function isTwoColumnsContentData(
  value: unknown,
): value is TwoColumnsContentData {
  return (
    isRecord(value) &&
    (value.time === undefined || typeof value.time === 'number') &&
    (value.version === undefined || typeof value.version === 'string') &&
    Array.isArray(value.blocks) &&
    value.blocks.every(isTwoColumnsContentBlock)
  )
}

export function isMediaGalleryBlockData(
  value: unknown,
): value is MediaGalleryBlockData {
  return (
    isRecord(value) &&
    isMediaGalleryMode(value.mode) &&
    typeof value.galleryId === 'string' &&
    typeof value.enableFancybox === 'boolean' &&
    typeof value.syncUrlWithFancybox === 'boolean' &&
    Array.isArray(value.items) &&
    value.items.every(isMediaGalleryItemData)
  )
}

export function isMediaGalleryItemData(
  value: unknown,
): value is MediaGalleryItemData {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    isMediaGalleryItemType(value.type) &&
    typeof value.url === 'string' &&
    (value.url === '' || isAllowedMediaUrl(value.url)) &&
    typeof value.alt === 'string' &&
    typeof value.caption === 'string' &&
    isRichParagraphFieldData(value.description)
  )
}

export function isMaskedFieldsDemoBlockData(
  value: unknown,
): value is MaskedFieldsDemoBlockData {
  return (
    isRecord(value) &&
    typeof value.phone === 'string' &&
    typeof value.date === 'string' &&
    typeof value.time === 'string' &&
    typeof value.price === 'string' &&
    typeof value.card === 'string' &&
    typeof value.email === 'string'
  )
}

export function isCtaBlockData(value: unknown): value is CtaBlockData {
  if (!isRecord(value)) {
    return false
  }

  const actionType = isCtaBlockActionType(value.actionType)
    ? value.actionType
    : 'link'

  return (
    typeof value.label === 'string' &&
    typeof value.url === 'string' &&
    (actionType === 'event' ||
      value.url === '' ||
      isAllowedCtaUrl(value.url)) &&
    isCtaBlockVariant(value.variant) &&
    isCtaBlockTarget(value.target) &&
    (value.actionType === undefined ||
      isCtaBlockActionType(value.actionType)) &&
    (value.contentMode === undefined ||
      isCtaBlockContentMode(value.contentMode)) &&
    isOptionalCtaIconName(value.leftIcon) &&
    isOptionalCtaIconName(value.rightIcon) &&
    isOptionalCtaIconName(value.icon) &&
    (value.eventName === undefined || typeof value.eventName === 'string') &&
    (value.eventPayloadJson === undefined ||
      typeof value.eventPayloadJson === 'string')
  )
}

export function isCodeSnippetBlockData(
  value: unknown,
): value is CodeSnippetBlockData {
  return (
    isRecord(value) &&
    isCodeSnippetLanguage(value.language) &&
    typeof value.code === 'string' &&
    typeof value.caption === 'string'
  )
}

export function isRawHtmlBlockData(value: unknown): value is RawHtmlBlockData {
  return isRecord(value) && typeof value.html === 'string'
}

export function isAccordionGroupBlockData(
  value: unknown,
): value is AccordionGroupBlockData {
  return (
    isRecord(value) &&
    typeof value.closeOthersOnOpen === 'boolean' &&
    Array.isArray(value.items) &&
    hasUniqueAccordionGroupItemIds(value.items) &&
    value.items.every(isAccordionGroupItemData)
  )
}

export function isAccordionGroupItemData(
  value: unknown,
): value is AccordionGroupItemData {
  return (
    isRecord(value) &&
    isNonEmptyPlainString(value.id) &&
    typeof value.isInitiallyOpen === 'boolean' &&
    isAccordionHeaderData(value.header) &&
    isAccordionBodyData(value.body)
  )
}

export function isAccordionHeaderData(
  value: unknown,
): value is AccordionHeaderData {
  return isRichHeaderFieldData(value)
}

export function isAccordionBodyData(
  value: unknown,
): value is AccordionBodyData {
  return (
    isRecord(value) &&
    (value.time === undefined || typeof value.time === 'number') &&
    (value.version === undefined || typeof value.version === 'string') &&
    Array.isArray(value.blocks) &&
    value.blocks.every(isAccordionBodyBlock)
  )
}

function createDefaultNoticeBlockData(): NoticeBlockData {
  return {
    title: '',
    text: createDefaultRichParagraphFieldData(),
    type: 'info',
  }
}

function createDefaultSectionIntroBlockData(): SectionIntroBlockData {
  return {
    title: '',
    description: createDefaultSectionIntroDescriptionData(),
  }
}

function createDefaultSectionIntroDescriptionData(): SectionIntroDescriptionData {
  return createDefaultRichParagraphFieldData()
}

function createDefaultRichParagraphFieldData(): RichParagraphFieldData {
  return {
    blocks: [],
  }
}

function createDefaultRichHeaderFieldData(): RichHeaderFieldData {
  return {
    blocks: [],
  }
}

function createDefaultTwoColumnsBlockData(): TwoColumnsBlockData {
  return {
    layout: 'equal',
    isReversed: false,
    left: createDefaultTwoColumnsContentData(),
    right: createDefaultTwoColumnsContentData(),
  }
}

function createDefaultTwoColumnsContentData(): TwoColumnsContentData {
  return {
    blocks: [],
  }
}

function createDefaultMediaGalleryBlockData(): MediaGalleryBlockData {
  return {
    mode: 'gallery',
    galleryId: '',
    enableFancybox: true,
    syncUrlWithFancybox: false,
    items: [createDefaultMediaGalleryItemData()],
  }
}

function createDefaultMediaGalleryItemData(): MediaGalleryItemData {
  return {
    id: createMediaGalleryItemId(),
    type: 'image',
    url: '',
    alt: '',
    caption: '',
    description: createDefaultRichParagraphFieldData(),
  }
}

function createDefaultMaskedFieldsDemoBlockData(): MaskedFieldsDemoBlockData {
  return {
    phone: '',
    date: '',
    time: '',
    price: '',
    card: '',
    email: '',
  }
}

function createDefaultCtaBlockData(): CtaBlockData {
  return {
    label: '',
    url: '',
    variant: 'primary',
    target: 'sameTab',
    actionType: 'link',
    contentMode: 'text',
    leftIcon: '',
    rightIcon: '',
    icon: '',
    eventName: '',
    eventPayloadJson: '',
  }
}

function createDefaultCodeSnippetBlockData(): CodeSnippetBlockData {
  return {
    language: 'plain',
    code: '',
    caption: '',
  }
}

function createDefaultRawHtmlBlockData(): RawHtmlBlockData {
  return {
    html: '',
  }
}

function createDefaultAccordionGroupBlockData(): AccordionGroupBlockData {
  return {
    closeOthersOnOpen: false,
    items: [createDefaultAccordionGroupItemData()],
  }
}

function createDefaultAccordionGroupItemData(): AccordionGroupItemData {
  return {
    id: createAccordionGroupItemId(),
    isInitiallyOpen: false,
    header: createDefaultAccordionHeaderData(),
    body: createDefaultAccordionBodyData(),
  }
}

function createDefaultAccordionHeaderData(): AccordionHeaderData {
  return createDefaultRichHeaderFieldData()
}

function createDefaultAccordionBodyData(): AccordionBodyData {
  return {
    blocks: [],
  }
}

function isNoticeBlockType(value: unknown): value is NoticeBlockType {
  return noticeBlockTypes.includes(value as NoticeBlockType)
}

function isTwoColumnsLayoutVariant(
  value: unknown,
): value is TwoColumnsLayoutVariant {
  return twoColumnsLayoutVariants.includes(value as TwoColumnsLayoutVariant)
}

function isMediaGalleryMode(value: unknown): value is MediaGalleryMode {
  return mediaGalleryModes.includes(value as MediaGalleryMode)
}

function isMediaGalleryItemType(
  value: unknown,
): value is MediaGalleryItemType {
  return mediaGalleryItemTypes.includes(value as MediaGalleryItemType)
}

function isCtaBlockVariant(value: unknown): value is CtaBlockVariant {
  return ctaBlockVariants.includes(value as CtaBlockVariant)
}

function isCtaBlockTarget(value: unknown): value is CtaBlockTarget {
  return ctaBlockTargets.includes(value as CtaBlockTarget)
}

function isCtaBlockActionType(value: unknown): value is CtaBlockActionType {
  return ctaBlockActionTypes.includes(value as CtaBlockActionType)
}

function isCtaBlockContentMode(value: unknown): value is CtaBlockContentMode {
  return ctaBlockContentModes.includes(value as CtaBlockContentMode)
}

function isCodeSnippetLanguage(
  value: unknown,
): value is CodeSnippetLanguage {
  return codeSnippetLanguages.includes(value as CodeSnippetLanguage)
}

function isRichParagraphFieldBlock(
  value: unknown,
): value is RichParagraphBlockData {
  if (!isRecord(value)) {
    return false
  }

  if (value.type === 'cta') {
    return isCtaBlock(value)
  }

  if (value.type === 'list') {
    return isListBlock(value)
  }

  return (
    (value.id === undefined || typeof value.id === 'string') &&
    value.type === 'paragraph' &&
    isRecord(value.data) &&
    typeof value.data.text === 'string' &&
    (value.tunes === undefined || isRecord(value.tunes))
  )
}

function isRichHeaderFieldBlock(value: unknown): value is RichHeaderBlockData {
  return (
    isRecord(value) &&
    (value.id === undefined || typeof value.id === 'string') &&
    value.type === 'header' &&
    isRecord(value.data) &&
    typeof value.data.text === 'string' &&
    isHeaderLevel(value.data.level) &&
    (value.tunes === undefined || isRecord(value.tunes))
  )
}

function isTwoColumnsContentBlock(
  value: unknown,
): value is TwoColumnsContentBlock {
  if (!isRecord(value)) {
    return false
  }

  switch (value.type) {
    case 'paragraph':
      return isRichParagraphFieldBlock(value)
    case 'header':
      return isRichHeaderFieldBlock(value)
    case 'list':
      return isListBlock(value)
    case 'cta':
      return isCtaBlock(value)
    case 'rawHtml':
      return (
        (value.id === undefined || typeof value.id === 'string') &&
        isRawHtmlBlockData(value.data) &&
        (value.tunes === undefined || isRecord(value.tunes))
      )
    default:
      return false
  }
}

function isAccordionBodyContentBlock(
  value: unknown,
): value is AccordionBodyContentBlock {
  if (!isRecord(value)) {
    return false
  }

  switch (value.type) {
    case 'paragraph':
      return isRichParagraphFieldBlock(value)
    case 'header':
      return isRichHeaderFieldBlock(value)
    case 'list':
      return isListBlock(value)
    case 'cta':
      return isCtaBlock(value)
    default:
      return false
  }
}

function isAccordionBodyBlock(value: unknown): value is AccordionBodyBlock {
  if (!isRecord(value)) {
    return false
  }

  if (value.type === 'accordionGroup') {
    return isAccordionGroupBlock(value)
  }

  return isAccordionBodyContentBlock(value)
}

function isAccordionGroupBlock(
  value: unknown,
): value is EditorOutputBlock<'accordionGroup', AccordionGroupBlockData> {
  return (
    isRecord(value) &&
    (value.id === undefined || typeof value.id === 'string') &&
    value.type === 'accordionGroup' &&
    isAccordionGroupBlockData(value.data) &&
    (value.tunes === undefined || isRecord(value.tunes))
  )
}

function isCtaBlock(
  value: unknown,
): value is EditorOutputBlock<'cta', CtaBlockData> {
  return (
    isRecord(value) &&
    (value.id === undefined || typeof value.id === 'string') &&
    value.type === 'cta' &&
    isCtaBlockData(value.data) &&
    (value.tunes === undefined || isRecord(value.tunes))
  )
}

function isListBlock(
  value: unknown,
): value is EditorOutputBlock<'list', ListBlockData> {
  return (
    isRecord(value) &&
    (value.id === undefined || typeof value.id === 'string') &&
    value.type === 'list' &&
    isRecord(value.data) &&
    isListStyle(value.data.style) &&
    (value.data.meta === undefined || isRecord(value.data.meta)) &&
    Array.isArray(value.data.items) &&
    value.data.items.every(isListBlockItem) &&
    (value.tunes === undefined || isRecord(value.tunes))
  )
}

function isHeaderLevel(value: unknown): value is HeaderBlockData['level'] {
  return (
    value === 1 ||
    value === 2 ||
    value === 3 ||
    value === 4 ||
    value === 5 ||
    value === 6
  )
}

function isListStyle(value: unknown): value is ListBlockData['style'] {
  return value === 'ordered' || value === 'unordered' || value === 'checklist'
}

function isListBlockItem(value: unknown): value is ListBlockItem {
  return (
    isRecord(value) &&
    typeof value.content === 'string' &&
    (value.meta === undefined || isRecord(value.meta)) &&
    Array.isArray(value.items) &&
    value.items.every(isListBlockItem)
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonEmptyPlainString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function hasUniqueAccordionGroupItemIds(items: unknown[]): boolean {
  const ids = new Set<string>()

  return items.every((item) => {
    if (!isRecord(item) || !isNonEmptyPlainString(item.id)) {
      return false
    }

    if (ids.has(item.id)) {
      return false
    }

    ids.add(item.id)

    return true
  })
}

function normalizePlainValue(value: unknown): string {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : ''
}

function normalizeMultilineValue(value: unknown): string {
  return typeof value === 'string'
    ? value
        .replaceAll('\r\n', '\n')
        .replaceAll('\r', '\n')
        .replace(/[ \t]+$/gm, '')
        .trim()
    : ''
}

function normalizeMediaUrlValue(value: unknown): string {
  if (typeof value !== 'string') {
    return ''
  }

  const url = value.trim()

  return isAllowedMediaUrl(url) ? url : ''
}

function normalizeCtaUrlValue(value: unknown): string {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim()
}

function normalizeCodeValue(value: unknown): string {
  return typeof value === 'string'
    ? value.replaceAll('\r\n', '\n').replaceAll('\r', '\n')
    : ''
}

function normalizeHtmlValue(value: unknown): string {
  return typeof value === 'string'
    ? value.replaceAll('\r\n', '\n').replaceAll('\r', '\n').trim()
    : ''
}

function normalizeEventNameValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeJsonValue(value: unknown): string {
  return typeof value === 'string'
    ? value.replaceAll('\r\n', '\n').replaceAll('\r', '\n').trim()
    : ''
}

function normalizeIconNameValue(value: unknown): CtaBlockIconName {
  if (typeof value !== 'string') {
    return ''
  }

  const iconName = value.trim()

  return isIconName(iconName) ? iconName : ''
}

function isOptionalCtaIconName(value: unknown): boolean {
  if (value === undefined) {
    return true
  }

  if (typeof value !== 'string') {
    return false
  }

  const iconName = value.trim()

  return iconName === '' || isIconName(iconName)
}

export function isAllowedCtaUrl(value: string): boolean {
  return (
    value.startsWith('https://') ||
    value.startsWith('http://') ||
    value.startsWith('mailto:') ||
    (value.startsWith('/') && !value.startsWith('//')) ||
    value.startsWith('#')
  )
}

function createMediaGalleryItemId(): string {
  return `media-${Math.random().toString(36).slice(2, 10)}`
}

function createAccordionGroupItemId(): string {
  return `accordion-${Math.random().toString(36).slice(2, 10)}`
}
