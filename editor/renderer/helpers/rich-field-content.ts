import {
  normalizeRichHeaderFieldData,
  normalizeRichParagraphFieldData,
  type RichHeaderFieldData,
  type RichParagraphFieldData,
} from '~~/editor/shared'

export function normalizeRichParagraphContent(
  value: unknown,
): RichParagraphFieldData {
  return normalizeRichParagraphFieldData(value)
}

export function normalizeRichHeaderContent(value: unknown): RichHeaderFieldData {
  return normalizeRichHeaderFieldData(value)
}
