import { en } from './en'
import { ru } from './ru'
import type { SupportedLocale } from '~~/i18n/editor'

export const appMessages: Record<SupportedLocale, typeof ru> = {
  ru,
  en,
}
