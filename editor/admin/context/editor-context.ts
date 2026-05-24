import { inject, type ComputedRef, type InjectionKey } from 'vue'
import type { ContentTypographyLocale } from '~~/editor/shared'
import type { EditorUiMessages } from '~~/i18n'

export interface EditorAdminContext {
  contentLocale: ComputedRef<ContentTypographyLocale>
  editorMessages: ComputedRef<EditorUiMessages>
}

export const editorAdminContextKey: InjectionKey<EditorAdminContext> =
  Symbol('editor-admin-context')

export function useEditorAdminContext(): EditorAdminContext {
  const context = inject(editorAdminContextKey)

  if (!context) {
    throw new Error('Editor admin context was not provided.')
  }

  return context
}
