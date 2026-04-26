export const editorBlockTuneNames = ['anchor', 'spacing', 'label'] as const

export type EditorBlockTuneName = (typeof editorBlockTuneNames)[number]

export interface AnchorTuneData {
  anchor?: string
}

export type SpacingTuneValue = 'none' | 'small' | 'medium' | 'large'

export interface SpacingTuneData {
  top?: SpacingTuneValue
  bottom?: SpacingTuneValue
}

export interface LabelTuneData {
  label?: string
}

export interface KnownEditorBlockTuneData {
  anchor?: AnchorTuneData
  spacing?: SpacingTuneData
  label?: LabelTuneData
}

export const spacingTuneValues = [
  'none',
  'small',
  'medium',
  'large',
] as const satisfies readonly SpacingTuneValue[]

const anchorMaxLength = 80
const labelMaxLength = 120

export function normalizeAnchorTuneData(value: unknown): AnchorTuneData {
  if (!isRecord(value)) {
    return {}
  }

  return {
    anchor: normalizeAnchorValue(value.anchor),
  }
}

export function normalizeSpacingTuneData(value: unknown): SpacingTuneData {
  if (!isRecord(value)) {
    return {}
  }

  return {
    top: normalizeSpacingTuneValue(value.top),
    bottom: normalizeSpacingTuneValue(value.bottom),
  }
}

export function normalizeLabelTuneData(value: unknown): LabelTuneData {
  if (!isRecord(value)) {
    return {}
  }

  return {
    label: normalizeLabelValue(value.label),
  }
}

export function getKnownBlockTuneData(
  tunes: Record<string, unknown> | undefined,
): KnownEditorBlockTuneData {
  if (!tunes) {
    return {}
  }

  return {
    anchor: normalizeAnchorTuneData(tunes.anchor),
    spacing: normalizeSpacingTuneData(tunes.spacing),
    label: normalizeLabelTuneData(tunes.label),
  }
}

export function isKnownBlockTuneData(value: unknown): boolean {
  if (value === undefined) {
    return true
  }

  if (!isRecord(value)) {
    return false
  }

  return (
    isValidAnchorTuneData(value.anchor) &&
    isValidSpacingTuneData(value.spacing) &&
    isValidLabelTuneData(value.label)
  )
}

export function normalizeAnchorValue(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, anchorMaxLength)

  return normalized || undefined
}

export function normalizeLabelValue(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  const normalized = value.trim().replace(/\s+/g, ' ').slice(0, labelMaxLength)

  return normalized || undefined
}

function isValidAnchorTuneData(value: unknown): boolean {
  if (value === undefined) {
    return true
  }

  if (!isRecord(value)) {
    return false
  }

  return (
    value.anchor === undefined ||
    normalizeAnchorValue(value.anchor) === value.anchor
  )
}

function isValidSpacingTuneData(value: unknown): boolean {
  if (value === undefined) {
    return true
  }

  if (!isRecord(value)) {
    return false
  }

  return (
    (value.top === undefined || isSpacingTuneValue(value.top)) &&
    (value.bottom === undefined || isSpacingTuneValue(value.bottom))
  )
}

function isValidLabelTuneData(value: unknown): boolean {
  if (value === undefined) {
    return true
  }

  if (!isRecord(value)) {
    return false
  }

  return (
    value.label === undefined || normalizeLabelValue(value.label) === value.label
  )
}

function normalizeSpacingTuneValue(
  value: unknown,
): SpacingTuneValue | undefined {
  return isSpacingTuneValue(value) ? value : undefined
}

function isSpacingTuneValue(value: unknown): value is SpacingTuneValue {
  return spacingTuneValues.includes(value as SpacingTuneValue)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
