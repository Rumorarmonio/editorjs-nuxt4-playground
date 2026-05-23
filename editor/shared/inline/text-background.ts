export const textBackgroundInlineClassName = 'editor-background-color'

export const textBackgroundInlineOptions = [
  {
    name: 'blue',
    label: 'Blue',
    className: 'editor-background-color--accent',
    value: 'var(--color-accent)',
  },
  {
    name: 'green',
    label: 'Green',
    className: 'editor-background-color--success',
    value: 'var(--color-success)',
  },
  {
    name: 'danger',
    label: 'Red',
    className: 'editor-background-color--danger',
    value: 'var(--color-danger)',
  },
  {
    name: 'warning',
    label: 'Warning',
    className: 'editor-background-color--warning',
    value: 'var(--color-warning)',
  },
  {
    name: 'muted',
    label: 'Muted',
    className: 'editor-background-color--muted',
    value: 'var(--color-muted)',
  },
] as const

export type TextBackgroundInlineName =
  (typeof textBackgroundInlineOptions)[number]['name']

export type TextBackgroundInlineOption =
  (typeof textBackgroundInlineOptions)[number]

export const textBackgroundInlineClassNames = [
  textBackgroundInlineClassName,
  ...textBackgroundInlineOptions.map((option) => option.className),
]

export function getTextBackgroundInlineOption(
  name: string | null | undefined,
): TextBackgroundInlineOption {
  return (
    textBackgroundInlineOptions.find((option) => option.name === name) ??
    textBackgroundInlineOptions[0]
  )
}

export function getTextBackgroundInlineOptionByClassName(
  classList: DOMTokenList | string[],
): TextBackgroundInlineOption | null {
  return (
    textBackgroundInlineOptions.find((option) =>
      Array.from(classList).includes(option.className),
    ) ?? null
  )
}
