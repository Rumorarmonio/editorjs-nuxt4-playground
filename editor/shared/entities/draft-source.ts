import { EDITOR_DRAFT_STORAGE_KEY } from '~~/editor/shared/constants/draft-storage'
import { editorBlockRegistry } from '~~/editor/shared/registry/block-registry'
import { isEditorOutputData } from '~~/editor/shared/types/editor-output'
import type {
  EditorContentData,
  ResolvedEditorContent,
} from '~~/editor/shared/types/content'
import type { EditorOutputData } from '~~/editor/shared/types/editor-output'

export interface DraftStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export function resolveEditorContent(
  defaultContent: EditorContentData,
  storage?: DraftStorage | null,
): ResolvedEditorContent {
  const draft = readEditorDraft(storage)

  if (draft) {
    return {
      source: 'draft',
      data: draft,
    }
  }

  return {
    source: 'default',
    data: defaultContent,
  }
}

export function readEditorDraft(
  storage?: DraftStorage | null,
): EditorContentData | null {
  const serializedDraft = storage?.getItem(EDITOR_DRAFT_STORAGE_KEY)

  if (!serializedDraft) {
    return null
  }

  try {
    const parsedDraft: unknown = JSON.parse(serializedDraft)

    return isKnownEditorContentData(parsedDraft) ? parsedDraft : null
  } catch {
    return null
  }
}

export function writeEditorDraft(
  storage: DraftStorage,
  draft: EditorContentData,
): void {
  storage.setItem(EDITOR_DRAFT_STORAGE_KEY, JSON.stringify(draft))
}

export function clearEditorDraft(storage: DraftStorage): void {
  storage.removeItem(EDITOR_DRAFT_STORAGE_KEY)
}

export function isKnownEditorContentData(
  value: unknown,
): value is EditorContentData {
  if (!isEditorOutputData(value)) {
    return false
  }

  return value.blocks.every(isKnownEditorContentBlock)
}

function isKnownEditorContentBlock(
  block: EditorOutputData['blocks'][number],
): boolean {
  if (!(block.type in editorBlockRegistry)) {
    return false
  }

  switch (block.type) {
    case 'paragraph':
      return isParagraphBlockData(block.data)
    case 'header':
      return isHeaderBlockData(block.data)
    case 'list':
      return isListBlockData(block.data)
    case 'quote':
      return isQuoteBlockData(block.data)
    case 'delimiter':
      return isRecord(block.data)
    case 'table':
      return isTableBlockData(block.data)
    case 'embed':
      return isEmbedBlockData(block.data)
    case 'image':
      return isImageBlockData(block.data)
    default:
      return false
  }
}

function isParagraphBlockData(value: unknown): boolean {
  return isRecord(value) && typeof value.text === 'string'
}

function isHeaderBlockData(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.text === 'string' &&
    isHeaderLevel(value.level)
  )
}

function isListBlockData(value: unknown): boolean {
  return (
    isRecord(value) &&
    isListStyle(value.style) &&
    Array.isArray(value.items) &&
    value.items.every(isListBlockItem)
  )
}

function isListBlockItem(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.content === 'string' &&
    Array.isArray(value.items) &&
    value.items.every(isListBlockItem)
  )
}

function isQuoteBlockData(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.text === 'string' &&
    (value.caption === undefined || typeof value.caption === 'string') &&
    (value.alignment === undefined ||
      value.alignment === 'left' ||
      value.alignment === 'center')
  )
}

function isTableBlockData(value: unknown): boolean {
  return (
    isRecord(value) &&
    (value.withHeadings === undefined ||
      typeof value.withHeadings === 'boolean') &&
    Array.isArray(value.content) &&
    value.content.every(isTableRow)
  )
}

function isTableRow(value: unknown): boolean {
  return Array.isArray(value) && value.every((cell) => typeof cell === 'string')
}

function isEmbedBlockData(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.service === 'string' &&
    typeof value.source === 'string' &&
    typeof value.embed === 'string' &&
    (value.width === undefined || typeof value.width === 'number') &&
    (value.height === undefined || typeof value.height === 'number') &&
    (value.caption === undefined || typeof value.caption === 'string')
  )
}

function isImageBlockData(value: unknown): boolean {
  return (
    isRecord(value) &&
    isRecord(value.file) &&
    typeof value.file.url === 'string' &&
    (value.caption === undefined || typeof value.caption === 'string') &&
    (value.alt === undefined || typeof value.alt === 'string') &&
    (value.withBorder === undefined || typeof value.withBorder === 'boolean') &&
    (value.withBackground === undefined ||
      typeof value.withBackground === 'boolean') &&
    (value.stretched === undefined || typeof value.stretched === 'boolean')
  )
}

function isHeaderLevel(value: unknown): boolean {
  return (
    value === 1 ||
    value === 2 ||
    value === 3 ||
    value === 4 ||
    value === 5 ||
    value === 6
  )
}

function isListStyle(value: unknown): boolean {
  return value === 'ordered' || value === 'unordered' || value === 'checklist'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
