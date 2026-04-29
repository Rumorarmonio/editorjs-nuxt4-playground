import {
  normalizeMediaGalleryBlockData,
  normalizeNoticeBlockData,
  normalizeSectionIntroBlockData,
  normalizeTwoColumnsBlockData,
  type MediaGalleryBlockData,
  type MediaGalleryItemData,
  type NoticeBlockData,
  type RichParagraphFieldData,
  type SectionIntroBlockData,
  type TwoColumnsBlockData,
  type TwoColumnsContentData,
} from '~~/editor/shared/blocks/custom-block-data'
import type { ListBlockItem } from '~~/editor/shared/blocks/standard-block-data'
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
const galleryIdPattern = /^[a-z0-9_-]+$/i

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

  if (!hasText(data.title) && !hasText(data.text)) {
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
    data.title,
    maxNoticeTitleLength,
    messages.fieldLabels.noticeTitle,
    messages,
  )
  pushMaxLengthIssue(
    issues,
    'text',
    data.text,
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

  if (!hasText(data.title) && !hasRichParagraphContent(data.description)) {
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
    data.title,
    maxSectionIntroTitleLength,
    messages.fieldLabels.sectionIntroTitle,
    messages,
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
    item.caption,
    maxMediaCaptionLength,
    messages.fieldLabels.mediaCaption,
    messages,
  )

  return issues
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

function hasRichParagraphContent(data: RichParagraphFieldData): boolean {
  return data.blocks.some((block) => hasText(block.data.text))
}

function hasTwoColumnsContent(data: TwoColumnsContentData): boolean {
  return data.blocks.some((block) => {
    switch (block.type) {
      case 'paragraph':
      case 'header':
        return hasText(block.data.text)
      case 'list':
        return block.data.items.some(hasListItemContent)
      default:
        return false
    }
  })
}

function hasListItemContent(item: ListBlockItem): boolean {
  return hasText(item.content) || item.items.some(hasListItemContent)
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
