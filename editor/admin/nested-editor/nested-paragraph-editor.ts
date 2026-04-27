import { createNestedRichEditor } from './nested-rich-editor'
import {
  createNestedParagraphTools,
  nestedRichFieldInlineToolbar,
} from './rich-field-tools'
import {
  normalizeSectionIntroDescriptionData,
  type SectionIntroDescriptionData,
} from '~~/editor/shared'

export interface NestedParagraphEditorOptions {
  data: unknown
  readOnly: boolean
  placeholder?: string
  onChange?: () => void
}

export interface NestedParagraphEditor {
  holder: HTMLElement
  initialize: () => Promise<void>
  save: () => Promise<SectionIntroDescriptionData>
  destroy: () => void
}

export function createNestedParagraphEditor(
  options: NestedParagraphEditorOptions,
): NestedParagraphEditor {
  return createNestedRichEditor({
    ...options,
    className:
      'editor-rich-field__editor editor-rich-field__editor--paragraph editor-nested-paragraph-editor',
    inlineToolbar: nestedRichFieldInlineToolbar,
    normalizeData: normalizeSectionIntroDescriptionData,
    createTools: createNestedParagraphTools,
  })
}
