import type { FactoryArg } from 'imask'

export type PlainFieldChangeHandler<TValue> = (value: TValue) => void

export type PlainTextFieldMaskOptions = FactoryArg

export interface PlainFieldBaseOptions<TValue> {
  name: string
  label: string
  value: TValue
  hint?: string
  error?: string
  disabled?: boolean
  readOnly?: boolean
  onChange: PlainFieldChangeHandler<TValue>
}

export interface PlainFieldOption<TValue extends string = string> {
  label: string
  value: TValue
  disabled?: boolean
}

export interface PlainFieldControl<
  TValue,
  TControl extends HTMLElement = HTMLElement,
> {
  root: HTMLElement
  control: TControl
  getValue: () => TValue
  setValue: (value: TValue) => void
  setError: (error?: string) => void
  setDisabled: (disabled: boolean) => void
  setReadOnly: (readOnly: boolean) => void
  destroy?: () => void
}

export interface PlainTextFieldOptions
  extends PlainFieldBaseOptions<string> {
  placeholder?: string
  autocomplete?: string
  inputMode?: HTMLInputElement['inputMode']
  mask?: PlainTextFieldMaskOptions
}

export interface PlainTextareaFieldOptions
  extends PlainFieldBaseOptions<string> {
  placeholder?: string
  rows?: number
}

export interface PlainSelectFieldOptions<TValue extends string = string>
  extends PlainFieldBaseOptions<TValue> {
  options: readonly PlainFieldOption<TValue>[]
}

export interface PlainRadioGroupFieldOptions<TValue extends string = string>
  extends PlainFieldBaseOptions<TValue> {
  options: readonly PlainFieldOption<TValue>[]
}

export interface PlainToggleFieldOptions
  extends PlainFieldBaseOptions<boolean> {}

export interface PlainUrlFieldOptions extends PlainTextFieldOptions {}

export interface PlainFileFieldValue {
  url: string
}

export interface PlainImageFieldValue extends PlainFileFieldValue {
  alt: string
}
