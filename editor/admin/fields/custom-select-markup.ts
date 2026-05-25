export interface CreateCustomSelectChoiceMarkupOptions {
  choice: CustomSelectChoice
  className: string
  label: string
  mode: 'choice' | 'item'
  selectText?: string
}

export interface CustomSelectChoice {
  active: boolean
  disabled: boolean
  highlighted: boolean
  id: number
  placeholder: boolean
  selected: boolean
  value: string
}

export function createCustomSelectChoiceMarkup({
  choice,
  className,
  label,
  mode,
  selectText,
}: CreateCustomSelectChoiceMarkupOptions): string {
  const isChoice = mode === 'choice'
  const attributes = [
    isChoice ? 'data-choice' : 'data-item',
    isChoice
      ? choice.disabled
        ? 'data-choice-disabled aria-disabled="true"'
        : 'data-choice-selectable'
      : '',
    `data-id="${choice.id}"`,
    `data-value="${escapeHtmlAttribute(choice.value)}"`,
    choice.selected ? 'aria-selected="true"' : '',
    !isChoice && choice.disabled ? 'aria-disabled="true"' : '',
    isChoice ? `data-select-text="${escapeHtmlAttribute(selectText ?? '')}"` : '',
    'role="option"',
  ]
    .filter(Boolean)
    .join(' ')

  return `
    <div class="${className} editor-select__option" ${attributes}>
      <span class="editor-select__option-label">${label}</span>
    </div>
  `
}

function escapeHtmlAttribute(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}
