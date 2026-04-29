import { computed, watch, type Ref } from 'vue'

export type AppTheme = 'system' | 'light' | 'dark'
type ResolvedAppTheme = 'light' | 'dark'

const themeStorageKey = 'editorjs-vue3-theme'
const defaultTheme: AppTheme = 'system'
const themeMediaQuery = '(prefers-color-scheme: dark)'
let isThemeRuntimeInitialized = false

export const appThemeOptions = [
  'system',
  'light',
  'dark',
] as const satisfies ReadonlyArray<AppTheme>

function isAppTheme(value: unknown): value is AppTheme {
  return value === 'system' || value === 'light' || value === 'dark'
}

function getSystemTheme(): ResolvedAppTheme {
  if (!import.meta.client) {
    return 'light'
  }

  return window.matchMedia(themeMediaQuery).matches ? 'dark' : 'light'
}

function getStoredTheme(): AppTheme {
  if (!import.meta.client) {
    return defaultTheme
  }

  const storedTheme = window.localStorage.getItem(themeStorageKey)

  return isAppTheme(storedTheme) ? storedTheme : defaultTheme
}

function resolveTheme(
  theme: AppTheme,
  systemTheme: ResolvedAppTheme,
): ResolvedAppTheme {
  return theme === 'system' ? systemTheme : theme
}

function applyTheme(theme: ResolvedAppTheme, preference: AppTheme): void {
  if (!import.meta.client) {
    return
  }

  document.documentElement.dataset.theme = theme
  document.documentElement.dataset.themePreference = preference
  document.documentElement.style.colorScheme = theme
}

function initializeThemeRuntime(
  theme: Ref<AppTheme>,
  systemTheme: Ref<ResolvedAppTheme>,
): void {
  if (!import.meta.client || isThemeRuntimeInitialized) {
    return
  }

  const mediaQueryList = window.matchMedia(themeMediaQuery)
  const updateSystemTheme = (): void => {
    systemTheme.value = mediaQueryList.matches ? 'dark' : 'light'
  }

  isThemeRuntimeInitialized = true
  theme.value = getStoredTheme()
  updateSystemTheme()
  mediaQueryList.addEventListener('change', updateSystemTheme)

  watch(
    [theme, systemTheme],
    ([nextTheme, nextSystemTheme]) => {
      applyTheme(resolveTheme(nextTheme, nextSystemTheme), nextTheme)
    },
    { immediate: true },
  )
}

export function useAppTheme() {
  const theme = useState<AppTheme>('app-theme', getStoredTheme)
  const systemTheme = useState<ResolvedAppTheme>(
    'app-system-theme',
    getSystemTheme,
  )
  const currentTheme = computed(() => theme.value)
  const resolvedTheme = computed<ResolvedAppTheme>(() =>
    theme.value === 'system' ? systemTheme.value : theme.value,
  )

  function setTheme(nextValue: AppTheme): void {
    theme.value = nextValue

    if (import.meta.client) {
      window.localStorage.setItem(themeStorageKey, nextValue)
    }
  }

  initializeThemeRuntime(theme, systemTheme)

  return {
    appThemeOptions,
    currentTheme,
    resolvedTheme,
    setTheme,
  }
}
