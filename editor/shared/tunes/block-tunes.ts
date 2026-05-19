export const editorBlockTuneNames = [
  'anchor',
  'spacing',
  'label',
  'animation',
] as const

export const embedDisplayTuneName = 'embedDisplay' as const

export type EditorBlockTuneName =
  | (typeof editorBlockTuneNames)[number]
  | typeof embedDisplayTuneName

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

export type AnimationTuneValue = 'none' | 'fade-up' | 'fade-left' | 'fade-right'

export interface AnimationTuneData {
  type?: AnimationTuneValue
}

export type EmbedDisplayTuneMode = 'inline' | 'fancybox'

export interface EmbedDisplayTuneData {
  mode?: EmbedDisplayTuneMode
}

export interface KnownEditorBlockTuneData {
  anchor?: AnchorTuneData
  spacing?: SpacingTuneData
  label?: LabelTuneData
  animation?: AnimationTuneData
  embedDisplay?: EmbedDisplayTuneData
}

export const spacingTuneValues = [
  'none',
  'small',
  'medium',
  'large',
] as const satisfies readonly SpacingTuneValue[]

export const animationTuneValues = [
  'none',
  'fade-up',
  'fade-left',
  'fade-right',
] as const satisfies readonly AnimationTuneValue[]

export const embedDisplayTuneModes = [
  'inline',
  'fancybox',
] as const satisfies readonly EmbedDisplayTuneMode[]

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

export function normalizeAnimationTuneData(value: unknown): AnimationTuneData {
  if (!isRecord(value)) {
    return {}
  }

  return {
    type: normalizeAnimationTuneValue(value.type),
  }
}

export function normalizeEmbedDisplayTuneData(
  value: unknown,
): EmbedDisplayTuneData {
  if (!isRecord(value)) {
    return {}
  }

  return {
    mode: normalizeEmbedDisplayTuneMode(value.mode),
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
    animation: normalizeAnimationTuneData(tunes.animation),
    embedDisplay: normalizeEmbedDisplayTuneData(tunes.embedDisplay),
  }
}

export function getDuplicateAnchorValues(
  blocks: { tunes?: Record<string, unknown> }[],
): string[] {
  const anchorCounts = new Map<string, number>()

  blocks.forEach((block) => {
    const anchor = getKnownBlockTuneData(block.tunes).anchor?.anchor

    if (!anchor) {
      return
    }

    anchorCounts.set(anchor, (anchorCounts.get(anchor) ?? 0) + 1)
  })

  return [...anchorCounts]
    .filter(([, count]) => count > 1)
    .map(([anchor]) => anchor)
}

export function omitEmptyBlockTuneData<
  TContent extends {
    blocks: { type: string; data: unknown; tunes?: Record<string, unknown> }[]
  },
>(content: TContent): TContent {
  return omitEmptyTunesFromValue(content) as TContent
}

function omitEmptyTunesFromValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(omitEmptyTunesFromValue)
  }

  if (!isRecord(value)) {
    return value
  }

  const result = Object.fromEntries(
    Object.entries(value).map(([key, entryValue]) => [
      key,
      omitEmptyTunesFromValue(entryValue),
    ]),
  )

  if (isBlockLikeRecord(result)) {
    const tunes = omitEmptyTuneEntries(result.tunes)

    if (tunes) {
      result.tunes = tunes
    } else {
      delete result.tunes
    }
  }

  return result
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
    isValidLabelTuneData(value.label) &&
    isValidAnimationTuneData(value.animation) &&
    isValidEmbedDisplayTuneData(value.embedDisplay)
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

function isValidAnimationTuneData(value: unknown): boolean {
  if (value === undefined) {
    return true
  }

  if (!isRecord(value)) {
    return false
  }

  return value.type === undefined || isAnimationTuneValue(value.type)
}

function isValidEmbedDisplayTuneData(value: unknown): boolean {
  if (value === undefined) {
    return true
  }

  if (!isRecord(value)) {
    return false
  }

  return value.mode === undefined || isEmbedDisplayTuneMode(value.mode)
}

function normalizeSpacingTuneValue(
  value: unknown,
): SpacingTuneValue | undefined {
  return isSpacingTuneValue(value) ? value : undefined
}

function normalizeAnimationTuneValue(
  value: unknown,
): AnimationTuneValue | undefined {
  return isAnimationTuneValue(value) ? value : undefined
}

function normalizeEmbedDisplayTuneMode(
  value: unknown,
): EmbedDisplayTuneMode | undefined {
  return isEmbedDisplayTuneMode(value) ? value : undefined
}

function isSpacingTuneValue(value: unknown): value is SpacingTuneValue {
  return spacingTuneValues.includes(value as SpacingTuneValue)
}

function isAnimationTuneValue(value: unknown): value is AnimationTuneValue {
  return animationTuneValues.includes(value as AnimationTuneValue)
}

function isEmbedDisplayTuneMode(
  value: unknown,
): value is EmbedDisplayTuneMode {
  return embedDisplayTuneModes.includes(value as EmbedDisplayTuneMode)
}

function omitEmptyTuneEntries(
  tunes: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (!tunes) {
    return undefined
  }

  const entries = Object.entries(tunes).filter(([name, value]) => {
    return !isEmptyTuneData(name, value)
  })

  return entries.length > 0 ? Object.fromEntries(entries) : undefined
}

function isEmptyTuneData(name: string, value: unknown): boolean {
  if (value === undefined) {
    return true
  }

  if (!isRecord(value)) {
    return false
  }

  switch (name) {
    case 'anchor':
      return value.anchor === undefined
    case 'spacing':
      return isEmptySpacingTuneData(value)
    case 'label':
      return value.label === undefined
    case 'animation':
      return value.type === undefined || value.type === 'none'
    case 'embedDisplay':
      return value.mode === undefined || value.mode === 'inline'
    default:
      return false
  }
}

function isEmptySpacingTuneData(value: Record<string, unknown>): boolean {
  return (
    (value.top === undefined || value.top === 'none') &&
    (value.bottom === undefined || value.bottom === 'none')
  )
}

function isBlockLikeRecord(
  value: Record<string, unknown>,
): value is Record<string, unknown> & { tunes?: Record<string, unknown> } {
  return (
    typeof value.type === 'string' &&
    'data' in value &&
    (value.tunes === undefined || isRecord(value.tunes))
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
