import type {
  PlainFileFieldValue,
  PlainImageFieldValue,
  PlainTextFieldOptions,
} from './types'

export interface PlainFileFieldOptions
  extends Omit<PlainTextFieldOptions, 'value' | 'onChange'> {
  value: PlainFileFieldValue
  onChange: (value: PlainFileFieldValue) => void
}

export interface PlainImageFieldOptions
  extends Omit<PlainTextFieldOptions, 'value' | 'onChange'> {
  value: PlainImageFieldValue
  onChange: (value: PlainImageFieldValue) => void
}

export function normalizePlainFileFieldValue(
  value: Partial<PlainFileFieldValue> | null | undefined,
): PlainFileFieldValue {
  return {
    url: value?.url ?? '',
  }
}

export function normalizePlainImageFieldValue(
  value: Partial<PlainImageFieldValue> | null | undefined,
): PlainImageFieldValue {
  return {
    url: value?.url ?? '',
    alt: value?.alt ?? '',
  }
}
