import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  defaultLocale,
  getEditorMessages,
  isSupportedLocale,
  setCurrentEditorMessages,
  supportedLocales,
  type SupportedLocale,
} from '~~/i18n/editor'

const localeStorageKey = 'editorjs-vue3-locale'

export function useAppLocale() {
  const { locale } = useI18n()

  const currentLocale = computed<SupportedLocale>(() => {
    return isSupportedLocale(locale.value) ? locale.value : defaultLocale
  })
  const editorMessages = computed(() => getEditorMessages(currentLocale.value))

  setCurrentEditorMessages(editorMessages.value)

  function setLocale(nextLocale: SupportedLocale): void {
    locale.value = nextLocale
    setCurrentEditorMessages(getEditorMessages(nextLocale))

    if (import.meta.client) {
      window.localStorage.setItem(localeStorageKey, nextLocale)
    }
  }

  return {
    currentLocale,
    editorMessages,
    setLocale,
    supportedLocales,
  }
}
