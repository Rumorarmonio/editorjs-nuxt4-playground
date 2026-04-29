import { createI18n } from 'vue-i18n'
import {
  appMessages,
  defaultLocale,
  isSupportedLocale,
  type SupportedLocale,
} from '~~/i18n'

const localeStorageKey = 'editorjs-vue3-locale'

export default defineNuxtPlugin((nuxtApp) => {
  const storedLocale = import.meta.client
    ? window.localStorage.getItem(localeStorageKey)
    : null
  const locale: SupportedLocale = isSupportedLocale(storedLocale)
    ? storedLocale
    : defaultLocale

  const i18n = createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    messages: appMessages,
  })

  nuxtApp.vueApp.use(i18n)
})
