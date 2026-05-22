import {
  normalizeMediaGalleryBlockData,
  normalizeNoticeBlockData,
  normalizeCtaBlockData,
  normalizeCodeSnippetBlockData,
  normalizeRawHtmlBlockData,
  normalizeAccordionGroupBlockData,
  isAllowedCtaUrl,
  normalizeSectionIntroBlockData,
  normalizeTwoColumnsBlockData,
  type AccordionBodyData,
  type AccordionGroupBlockData,
  type AccordionGroupItemData,
  type CtaBlockData,
  type CodeSnippetBlockData,
  type RawHtmlBlockData,
  type MediaGalleryBlockData,
  type MediaGalleryItemData,
  type NoticeBlockData,
  type RichParagraphFieldData,
  type SectionIntroBlockData,
  type TwoColumnsBlockData,
  type TwoColumnsContentData,
} from '~~/editor/shared/blocks/custom-block-data'
import type { ListBlockItem } from '~~/editor/shared/blocks/standard-block-data'
import { isAllowedMediaUrl } from '~~/editor/shared/entities/media'
import { isIconName } from '~~/editor/shared/icons/icons'
import type { EditorContentData } from '~~/editor/shared/types/content'
import {
  getCurrentEditorMessages,
  type EditorValidationMessages,
} from '~~/i18n/editor'

export interface ValidationIssue {
  path: string
  message: string
}

export interface ValidationResult {
  valid: boolean
  issues: ValidationIssue[]
}

const maxNoticeTitleLength = 120
const maxNoticeTextLength = 500
const maxSectionIntroTitleLength = 120
const maxGalleryIdLength = 80
const maxMediaAltLength = 160
const maxMediaCaptionLength = 300
const maxCtaLabelLength = 80
const maxCtaEventPayloadJsonLength = 4000
const maxCodeCaptionLength = 160
const maxCodeLength = 12000
const maxRawHtmlLength = 12000
const maxCtaEventNameLength = 80
const maxAccordionHeaderTextLength = 120
const galleryIdPattern = /^[a-z0-9_-]+$/i
const ctaEventNamePattern = /^[a-z0-9:_-]+$/i

export function validateEditorContentData(
  content: EditorContentData,
): ValidationResult {
  const issues = content.blocks.flatMap((block, index) => {
    const blockPath = `blocks.${index}`

    switch (block.type) {
      case 'notice':
        return prefixValidationIssues(
          validateNoticeBlockData(block.data).issues,
          blockPath,
        )
      case 'sectionIntro':
        return prefixValidationIssues(
          validateSectionIntroBlockData(block.data).issues,
          blockPath,
        )
      case 'twoColumns':
        return prefixValidationIssues(
          validateTwoColumnsBlockData(block.data).issues,
          blockPath,
        )
      case 'mediaGallery':
        return prefixValidationIssues(
          validateMediaGalleryBlockData(block.data).issues,
          blockPath,
        )
      case 'cta':
        return prefixValidationIssues(
          validateCtaBlockData(block.data).issues,
          blockPath,
        )
      case 'codeSnippet':
        return prefixValidationIssues(
          validateCodeSnippetBlockData(block.data).issues,
          blockPath,
        )
      case 'rawHtml':
        return prefixValidationIssues(
          validateRawHtmlBlockData(block.data).issues,
          blockPath,
        )
      case 'accordionGroup':
        return prefixValidationIssues(
          validateAccordionGroupBlockData(block.data).issues,
          blockPath,
        )
      default:
        return []
    }
  })

  return createValidationResult(issues)
}

export function validateNoticeBlockData(
  value: Partial<NoticeBlockData>,
  messages: EditorValidationMessages = getCurrentEditorMessages().validation,
): ValidationResult {
  const data = normalizeNoticeBlockData(value)
  const issues: ValidationIssue[] = []

  if (!hasInlineText(data.title) && !hasRichParagraphContent(data.text)) {
    issues.push({
      path: 'title',
      message: messages.noticeContentRequired,
    })
    issues.push({
      path: 'text',
      message: messages.noticeContentRequired,
    })
  }

  pushMaxLengthIssue(
    issues,
    'title',
    getInlineText(data.title),
    maxNoticeTitleLength,
    messages.fieldLabels.noticeTitle,
    messages,
  )
  pushMaxLengthIssue(
    issues,
    'text',
    getRichParagraphText(data.text),
    maxNoticeTextLength,
    messages.fieldLabels.noticeText,
    messages,
  )

  return createValidationResult(issues)
}

export function validateSectionIntroBlockData(
  value: Partial<SectionIntroBlockData>,
  messages: EditorValidationMessages = getCurrentEditorMessages().validation,
): ValidationResult {
  const data = normalizeSectionIntroBlockData(value)
  const issues: ValidationIssue[] = []

  if (!hasInlineText(data.title) && !hasRichParagraphContent(data.description)) {
    issues.push({
      path: 'title',
      message: messages.sectionIntroContentRequired,
    })
    issues.push({
      path: 'description',
      message: messages.sectionIntroContentRequired,
    })
  }

  pushMaxLengthIssue(
    issues,
    'title',
    getInlineText(data.title),
    maxSectionIntroTitleLength,
    messages.fieldLabels.sectionIntroTitle,
    messages,
  )
  issues.push(
    ...validateRichParagraphFieldCtaData(
      data.description,
      'description',
      messages,
    ),
  )

  return createValidationResult(issues)
}

export function validateTwoColumnsBlockData(
  value: Partial<TwoColumnsBlockData>,
  messages: EditorValidationMessages = getCurrentEditorMessages().validation,
): ValidationResult {
  const data = normalizeTwoColumnsBlockData(value)
  const issues: ValidationIssue[] = []

  if (!hasTwoColumnsContent(data.left) && !hasTwoColumnsContent(data.right)) {
    issues.push({
      path: 'left',
      message: messages.twoColumnsContentRequired,
    })
    issues.push({
      path: 'right',
      message: messages.twoColumnsContentRequired,
    })
  }
  issues.push(...validateTwoColumnsContentCtaData(data.left, 'left', messages))
  issues.push(...validateTwoColumnsContentCtaData(data.right, 'right', messages))

  return createValidationResult(issues)
}

export function validateMediaGalleryBlockData(
  value: Partial<MediaGalleryBlockData>,
  messages: EditorValidationMessages = getCurrentEditorMessages().validation,
): ValidationResult {
  const data = normalizeMediaGalleryBlockData(value)
  const issues: ValidationIssue[] = []

  if (hasText(data.galleryId)) {
    pushMaxLengthIssue(
      issues,
      'galleryId',
      data.galleryId,
      maxGalleryIdLength,
      messages.fieldLabels.galleryId,
      messages,
    )

    if (!galleryIdPattern.test(data.galleryId)) {
      issues.push({
        path: 'galleryId',
        message: messages.galleryIdPattern,
      })
    }
  }

  if (data.items.length === 0) {
    issues.push({
      path: 'items',
      message: messages.mediaCardsRequired,
    })
  }

  data.items.forEach((item, index) => {
    issues.push(...validateMediaGalleryItem(item, index, messages))
  })

  return createValidationResult(issues)
}

export function validateCtaBlockData(
  value: Partial<CtaBlockData>,
  messages: EditorValidationMessages = getCurrentEditorMessages().validation,
): ValidationResult {
  const data = normalizeCtaBlockData(value)
  const issues: ValidationIssue[] = []

  if (!hasText(data.label)) {
    issues.push({
      path: 'label',
      message: messages.ctaLabelRequired,
    })
  }

  issues.push(...validateCtaIconData(value, data, messages))

  if (data.actionType === 'link' && !hasText(data.url)) {
    issues.push({
      path: 'url',
      message: messages.ctaUrlRequired,
    })
  } else if (data.actionType === 'link' && !isAllowedCtaUrl(data.url)) {
    issues.push({
      path: 'url',
      message: messages.ctaUrlInvalid,
    })
  }

  if (data.actionType === 'event' && !hasText(data.eventName)) {
    issues.push({
      path: 'eventName',
      message: messages.ctaEventNameRequired,
    })
  } else if (
    data.actionType === 'event' &&
    !ctaEventNamePattern.test(data.eventName)
  ) {
    issues.push({
      path: 'eventName',
      message: messages.ctaEventNameInvalid,
    })
  }

  if (data.actionType === 'event' && hasText(data.eventPayloadJson)) {
    const payloadValidation = validateJsonObject(data.eventPayloadJson)

    if (payloadValidation === 'invalid') {
      issues.push({
        path: 'eventPayloadJson',
        message: messages.ctaEventPayloadJsonInvalid,
      })
    } else if (payloadValidation === 'notObject') {
      issues.push({
        path: 'eventPayloadJson',
        message: messages.ctaEventPayloadJsonObjectRequired,
      })
    }
  }

  pushMaxLengthIssue(
    issues,
    'label',
    data.label,
    maxCtaLabelLength,
    messages.fieldLabels.ctaLabel,
    messages,
  )

  if (data.actionType === 'event') {
    pushMaxLengthIssue(
      issues,
      'eventName',
      data.eventName,
      maxCtaEventNameLength,
      messages.fieldLabels.ctaEventName,
      messages,
    )
    pushMaxLengthIssue(
      issues,
      'eventPayloadJson',
      data.eventPayloadJson,
      maxCtaEventPayloadJsonLength,
      messages.fieldLabels.ctaEventPayloadJson,
      messages,
    )
  }

  return createValidationResult(issues)
}

function validateCtaIconData(
  value: Partial<CtaBlockData>,
  data: CtaBlockData,
  messages: EditorValidationMessages,
): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const rawValue = isPlainJsonObject(value) ? value : {}

  for (const path of ['leftIcon', 'rightIcon', 'icon'] as const) {
    const rawIconName = rawValue[path]

    if (
      typeof rawIconName === 'string' &&
      rawIconName.trim().length > 0 &&
      !isIconName(rawIconName.trim())
    ) {
      issues.push({
        path,
        message: messages.ctaIconInvalid,
      })
    }
  }

  const hasInvalidIconOnlyIcon = issues.some((issue) => issue.path === 'icon')

  if (
    data.contentMode === 'iconOnly' &&
    !hasText(data.icon) &&
    !hasInvalidIconOnlyIcon
  ) {
    issues.push({
      path: 'icon',
      message: messages.ctaIconRequired,
    })
  }

  return issues
}

export function validateRawHtmlBlockData(
  value: Partial<RawHtmlBlockData>,
  messages: EditorValidationMessages = getCurrentEditorMessages().validation,
): ValidationResult {
  const data = normalizeRawHtmlBlockData(value)
  const issues: ValidationIssue[] = []

  if (!hasText(data.html)) {
    issues.push({
      path: 'html',
      message: messages.rawHtmlRequired,
    })
  }

  pushMaxLengthIssue(
    issues,
    'html',
    data.html,
    maxRawHtmlLength,
    messages.fieldLabels.rawHtml,
    messages,
  )
  return createValidationResult(issues)
}

export function validateCodeSnippetBlockData(
  value: Partial<CodeSnippetBlockData>,
  messages: EditorValidationMessages = getCurrentEditorMessages().validation,
): ValidationResult {
  const data = normalizeCodeSnippetBlockData(value)
  const issues: ValidationIssue[] = []

  if (!hasText(data.code)) {
    issues.push({
      path: 'code',
      message: messages.codeSnippetCodeRequired,
    })
  }

  pushMaxLengthIssue(
    issues,
    'code',
    data.code,
    maxCodeLength,
    messages.fieldLabels.codeSnippetCode,
    messages,
  )
  pushMaxLengthIssue(
    issues,
    'caption',
    getInlineText(data.caption),
    maxCodeCaptionLength,
    messages.fieldLabels.codeSnippetCaption,
    messages,
  )

  return createValidationResult(issues)
}

export function validateAccordionGroupBlockData(
  value: Partial<AccordionGroupBlockData>,
  messages: EditorValidationMessages = getCurrentEditorMessages().validation,
): ValidationResult {
  const data = normalizeAccordionGroupBlockData(value)
  const issues: ValidationIssue[] = []

  if (data.items.length === 0) {
    issues.push({
      path: 'items',
      message: messages.accordionItemsRequired,
    })
  }

  data.items.forEach((item, index) => {
    issues.push(...validateAccordionGroupItem(item, index, messages))
  })

  return createValidationResult(issues)
}

export function findValidationMessage(
  result: ValidationResult,
  path: string,
): string | undefined {
  return result.issues.find((issue) => issue.path === path)?.message
}

export function getValidationSummary(result: ValidationResult): string | null {
  const messages = getCurrentEditorMessages().validation

  if (result.valid) {
    return null
  }

  if (result.issues.length === 1) {
    return result.issues[0]?.message ?? messages.contentValidationFallback
  }

  return messages.contentValidationSummary(result.issues.length)
}

function validateMediaGalleryItem(
  item: MediaGalleryItemData,
  index: number,
  messages: EditorValidationMessages,
): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const basePath = `items.${index}`

  if (!hasText(item.url)) {
    issues.push({
      path: `${basePath}.url`,
      message: messages.mediaUrlRequired,
    })
  } else if (!isAllowedMediaUrl(item.url)) {
    issues.push({
      path: `${basePath}.url`,
      message: messages.mediaUrlInvalid,
    })
  }

  if (item.type === 'image' && !hasText(item.alt)) {
    issues.push({
      path: `${basePath}.alt`,
      message: messages.mediaAltRequired,
    })
  }

  pushMaxLengthIssue(
    issues,
    `${basePath}.alt`,
    item.alt,
    maxMediaAltLength,
    messages.fieldLabels.mediaAlt,
    messages,
  )
  pushMaxLengthIssue(
    issues,
    `${basePath}.caption`,
    getInlineText(item.caption),
    maxMediaCaptionLength,
    messages.fieldLabels.mediaCaption,
    messages,
  )
  issues.push(
    ...validateRichParagraphFieldCtaData(
      item.description,
      `${basePath}.description`,
      messages,
    ),
  )

  return issues
}

function validateRichParagraphFieldCtaData(
  data: RichParagraphFieldData,
  basePath: string,
  messages: EditorValidationMessages,
): ValidationIssue[] {
  return data.blocks.flatMap((block, index) => {
    if (block.type !== 'cta') {
      return []
    }

    return prefixValidationIssues(
      validateCtaBlockData(block.data, messages).issues,
      `${basePath}.blocks.${index}`,
    )
  })
}

function validateTwoColumnsContentCtaData(
  data: TwoColumnsContentData,
  basePath: string,
  messages: EditorValidationMessages,
): ValidationIssue[] {
  return data.blocks.flatMap((block, index) => {
    if (block.type !== 'cta') {
      return []
    }

    return prefixValidationIssues(
      validateCtaBlockData(block.data, messages).issues,
      `${basePath}.blocks.${index}`,
    )
  })
}

function validateAccordionGroupItem(
  item: AccordionGroupItemData,
  index: number,
  messages: EditorValidationMessages,
): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const basePath = `items.${index}`

  if (!hasAccordionHeaderContent(item) && !hasAccordionBodyContent(item.body)) {
    issues.push({
      path: `${basePath}.header`,
      message: messages.accordionItemContentRequired,
    })
    issues.push({
      path: `${basePath}.body`,
      message: messages.accordionItemContentRequired,
    })
  }

  item.header.blocks.forEach((block, blockIndex) => {
    pushMaxLengthIssue(
      issues,
      `${basePath}.header.blocks.${blockIndex}.data.text`,
      block.data.text,
      maxAccordionHeaderTextLength,
      messages.fieldLabels.accordionHeader,
      messages,
    )
  })

  issues.push(
    ...validateAccordionBodyNestedBlocks(
      item.body,
      `${basePath}.body`,
      messages,
    ),
  )

  return issues
}

function validateAccordionBodyNestedBlocks(
  data: AccordionBodyData,
  basePath: string,
  messages: EditorValidationMessages,
): ValidationIssue[] {
  return data.blocks.flatMap((block, index) => {
    switch (block.type) {
      case 'cta':
        return prefixValidationIssues(
          validateCtaBlockData(block.data, messages).issues,
          `${basePath}.blocks.${index}`,
        )
      case 'accordionGroup':
        return prefixValidationIssues(
          validateAccordionGroupBlockData(block.data, messages).issues,
          `${basePath}.blocks.${index}`,
        )
      default:
        return []
    }
  })
}

function createValidationResult(issues: ValidationIssue[]): ValidationResult {
  return {
    valid: issues.length === 0,
    issues,
  }
}

function prefixValidationIssues(
  issues: ValidationIssue[],
  prefix: string,
): ValidationIssue[] {
  return issues.map((issue) => {
    return {
      ...issue,
      path: `${prefix}.${issue.path}`,
    }
  })
}

function pushMaxLengthIssue(
  issues: ValidationIssue[],
  path: string,
  value: string,
  maxLength: number,
  label: string,
  messages: EditorValidationMessages,
): void {
  if (value.length <= maxLength) {
    return
  }

  issues.push({
    path,
    message: messages.maxLength(label, maxLength),
  })
}

function hasText(value: string): boolean {
  return value.trim().length > 0
}

function hasInlineText(value: string): boolean {
  return hasText(getInlineText(value))
}

function getInlineText(value: string): string {
  return decodeHtmlEntities(
    value
      .replaceAll(/<br\s*\/?>/gi, '\n')
      .replaceAll(/<[^>]*>/g, ''),
  ).trim()
}

function decodeHtmlEntities(value: string): string {
  if (typeof document !== 'undefined') {
    const textarea = document.createElement('textarea')

    textarea.innerHTML = value

    return textarea.value
  }

  return value
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&#039;', "'")
    .replaceAll(/&#(\d+);/g, (_, code: string) => decodeCodePoint(Number(code)))
    .replaceAll(/&#x([\da-f]+);/gi, (_, code: string) =>
      decodeCodePoint(Number.parseInt(code, 16)),
    )
}

function decodeCodePoint(codePoint: number): string {
  if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > 0x10ffff) {
    return ''
  }

  return String.fromCodePoint(codePoint)
}

function validateJsonObject(value: string): 'valid' | 'invalid' | 'notObject' {
  try {
    const parsed: unknown = JSON.parse(value)

    return isPlainJsonObject(parsed) ? 'valid' : 'notObject'
  } catch {
    return 'invalid'
  }
}

function isPlainJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasRichParagraphContent(data: RichParagraphFieldData): boolean {
  return data.blocks.some((block) => {
    switch (block.type) {
      case 'paragraph':
        return hasText(block.data.text)
      case 'list':
        return block.data.items.some(hasListItemContent)
      case 'cta':
        return hasText(block.data.label)
      default:
        return false
    }
  })
}

function getRichParagraphText(data: RichParagraphFieldData): string {
  return data.blocks
    .map((block) => {
      switch (block.type) {
        case 'paragraph':
          return getInlineText(block.data.text)
        case 'list':
          return block.data.items.map(getListItemText).join(' ')
        case 'cta':
          return block.data.label
        default:
          return ''
      }
    })
    .join(' ')
    .trim()
}

function getListItemText(item: ListBlockItem): string {
  return [
    getInlineText(item.content),
    ...item.items.map(getListItemText),
  ]
    .join(' ')
    .trim()
}

function hasTwoColumnsContent(data: TwoColumnsContentData): boolean {
  return data.blocks.some((block) => {
    switch (block.type) {
      case 'paragraph':
      case 'header':
        return hasText(block.data.text)
      case 'list':
        return block.data.items.some(hasListItemContent)
      case 'cta':
        return hasText(block.data.label)
      default:
        return false
    }
  })
}

function hasAccordionHeaderContent(item: AccordionGroupItemData): boolean {
  return item.header.blocks.some((block) => hasText(block.data.text))
}

function hasAccordionBodyContent(data: AccordionBodyData): boolean {
  return data.blocks.some((block) => {
    switch (block.type) {
      case 'paragraph':
      case 'header':
        return hasText(block.data.text)
      case 'list':
        return block.data.items.some(hasListItemContent)
      case 'cta':
        return hasText(block.data.label)
      case 'accordionGroup':
        return block.data.items.some(
          (item) => hasAccordionHeaderContent(item) || hasAccordionBodyContent(item.body),
        )
      default:
        return false
    }
  })
}

function hasListItemContent(item: ListBlockItem): boolean {
  return hasText(item.content) || item.items.some(hasListItemContent)
}
