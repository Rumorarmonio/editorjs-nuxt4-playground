export const textColorInlineClassName = 'editor-text-color'

export const textColorInlineOptions = [
  {
    name: 'blue',
    label: 'Blue',
    className: 'editor-text-color--accent',
    value: 'var(--color-accent)',
  },
  {
    name: 'green',
    label: 'Green',
    className: 'editor-text-color--success',
    value: 'var(--color-success)',
  },
  {
    name: 'danger',
    label: 'Red',
    className: 'editor-text-color--danger',
    value: 'var(--color-danger)',
  },
  {
    name: 'warning',
    label: 'Warning',
    className: 'editor-text-color--warning',
    value: 'var(--color-warning)',
  },
  {
    name: 'muted',
    label: 'Muted',
    className: 'editor-text-color--muted',
    value: 'var(--color-muted)',
  },
] as const

export type TextColorInlineName = (typeof textColorInlineOptions)[number]['name']

export type TextColorInlineOption = (typeof textColorInlineOptions)[number]

export const textColorInlineClassNames = [
  textColorInlineClassName,
  ...textColorInlineOptions.map((option) => option.className),
]

export function getTextColorInlineOption(
  name: string | null | undefined,
): TextColorInlineOption {
  return (
    textColorInlineOptions.find((option) => option.name === name) ??
    textColorInlineOptions[0]
  )
}

export function getTextColorInlineOptionByClassName(
  classList: DOMTokenList | string[],
): TextColorInlineOption | null {
  return (
    textColorInlineOptions.find((option) =>
      Array.from(classList).includes(option.className),
    ) ?? null
  )
}
