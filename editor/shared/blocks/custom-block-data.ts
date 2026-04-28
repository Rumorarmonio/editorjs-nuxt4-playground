import type {
  HeaderBlockData,
  ListBlockData,
  ListBlockItem,
  ParagraphBlockData,
} from '~~/editor/shared/blocks/standard-block-data'
import type {
  EditorOutputBlock,
  EditorOutputData,
} from '~~/editor/shared/types/editor-output'

export const noticeBlockTypes = ['info', 'success', 'warning'] as const

export type NoticeBlockType = (typeof noticeBlockTypes)[number]

export type SectionIntroDescriptionBlock = EditorOutputBlock<
  'paragraph',
  ParagraphBlockData
>

export type SectionIntroDescriptionData =
  EditorOutputData<SectionIntroDescriptionBlock>

export type RichParagraphBlockData = SectionIntroDescriptionBlock

export type RichParagraphFieldData = SectionIntroDescriptionData

export type RichHeaderBlockData = EditorOutputBlock<'header', HeaderBlockData>

export type RichHeaderFieldData = EditorOutputData<RichHeaderBlockData>

export const twoColumnsLayoutVariants = [
  'equal',
  'leftWide',
  'rightWide',
] as const

export const mediaGalleryModes = ['gallery', 'slider'] as const

export const mediaGalleryItemTypes = ['image', 'video'] as const

export type TwoColumnsLayoutVariant =
  (typeof twoColumnsLayoutVariants)[number]

export type MediaGalleryMode = (typeof mediaGalleryModes)[number]

export type MediaGalleryItemType = (typeof mediaGalleryItemTypes)[number]

export type TwoColumnsContentBlock =
  | EditorOutputBlock<'paragraph', ParagraphBlockData>
  | EditorOutputBlock<'header', HeaderBlockData>
  | EditorOutputBlock<'list', ListBlockData>

export type TwoColumnsContentData = EditorOutputData<TwoColumnsContentBlock>

export interface NoticeBlockData {
  title: string
  text: string
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

export interface CustomBlockDataMap {
  notice: NoticeBlockData
  sectionIntro: SectionIntroBlockData
  twoColumns: TwoColumnsBlockData
  mediaGallery: MediaGalleryBlockData
  maskedFieldsDemo: MaskedFieldsDemoBlockData
}

export function normalizeNoticeBlockData(value: unknown): NoticeBlockData {
  if (!isRecord(value)) {
    return createDefaultNoticeBlockData()
  }

  return {
    title: typeof value.title === 'string' ? value.title : '',
    text: typeof value.text === 'string' ? value.text : '',
    type: isNoticeBlockType(value.type) ? value.type : 'info',
  }
}

export function isNoticeBlockData(value: unknown): value is NoticeBlockData {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.title === 'string' &&
    typeof value.text === 'string' &&
    isNoticeBlockType(value.type)
  )
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

function createDefaultNoticeBlockData(): NoticeBlockData {
  return {
    title: '',
    text: '',
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

function isRichParagraphFieldBlock(
  value: unknown,
): value is RichParagraphBlockData {
  return (
    isRecord(value) &&
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
    default:
      return false
  }
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

function isAllowedMediaUrl(url: string): boolean {
  return (
    url.startsWith('https://') ||
    url.startsWith('http://') ||
    url.startsWith('blob:') ||
    url.startsWith('data:image/svg+xml') ||
    url.startsWith('data:image/') ||
    url.startsWith('data:video/') ||
    (url.startsWith('/') && !url.startsWith('//')) ||
    url.startsWith('./') ||
    url.startsWith('../')
  )
}

function createMediaGalleryItemId(): string {
  return `media-${Math.random().toString(36).slice(2, 10)}`
}
