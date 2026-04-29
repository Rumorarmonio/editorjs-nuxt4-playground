import { editorEn } from './en'
import { editorRu } from './ru'
import type { EditorUiMessages, SupportedLocale } from './types'

export type {
  EditorUiMessages,
  EditorValidationMessages,
  SupportedLocale,
} from './types'

export const defaultLocale: SupportedLocale = 'ru'

export const supportedLocales = [
  {
    code: 'ru',
    label: 'RU',
  },
  {
    code: 'en',
    label: 'EN',
  },
] as const satisfies ReadonlyArray<{
  code: SupportedLocale
  label: string
}>

export const editorMessagesByLocale: Record<
  SupportedLocale,
  EditorUiMessages
> = {
  ru: editorRu,
  en: editorEn,
}

let currentEditorMessages = editorMessagesByLocale[defaultLocale]

export function getEditorMessages(locale: SupportedLocale): EditorUiMessages {
  return editorMessagesByLocale[locale] ?? editorMessagesByLocale[defaultLocale]
}

export function setCurrentEditorMessages(messages: EditorUiMessages): void {
  currentEditorMessages = messages
}

export function getCurrentEditorMessages(): EditorUiMessages {
  return currentEditorMessages
}

export function isSupportedLocale(value: unknown): value is SupportedLocale {
  return value === 'ru' || value === 'en'
}
