<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import EditorContentRenderer from '~~/editor/renderer/components/EditorContentRenderer/EditorContentRenderer.vue'
import EditorSidebarNavigation from '~~/editor/renderer/components/EditorSidebarNavigation/EditorSidebarNavigation.vue'
import type { NavigationItem } from '~~/editor/shared'
import {
  buildFlatNavigationItems,
  buildHeadingNavigationItems,
  getValidationSummary,
  validateEditorContentData,
} from '~~/editor/shared'
import { notifyError, notifySuccess } from '~~/shared/notifications'

const { t } = useI18n()
const { currentLocalePreference, setLocalePreference } = useAppLocale()
const { currentTheme, setTheme } = useAppTheme()

const {
  importDraftJson,
  isReady,
  loadContent,
  resetDraft,
  resolvedContent,
} = useEditorContentSource()

const exportFileName = 'editor-content.json'
const importJsonText = ref('')
const importMessage = ref<string | null>(null)
const importError = ref<string | null>(null)
const exportError = ref<string | null>(null)
const navigationMode = ref<'labels' | 'headings'>('headings')
const activeAnchor = ref<string | null>(null)
const previewPanelRef = ref<HTMLElement | null>(null)
const demoCtaEventName = ref<string | null>(null)
const demoCtaModalText = ref<string | null>(null)
const headingNavigationItems = computed(() =>
  buildHeadingNavigationItems(resolvedContent.value.data),
)
const labelNavigationItems = computed(() =>
  buildFlatNavigationItems(resolvedContent.value.data),
)
const navigationItems = computed(() => {
  return navigationMode.value === 'headings'
    ? headingNavigationItems.value
    : labelNavigationItems.value
})
const hasNavigationItems = computed(() => {
  return (
    headingNavigationItems.value.length > 0 ||
    labelNavigationItems.value.length > 0
  )
})
const translatedSourceLabel = computed(() =>
  resolvedContent.value.source === 'draft'
    ? t('app.common.localDraft')
    : t('app.common.defaultJson'),
)
const demoCtaModalDisplayText = computed(
  () =>
    demoCtaModalText.value ??
    t('app.previewPage.ctaDemoModalText', {
      eventName: demoCtaEventName.value,
    }),
)
let activeAnchorAnimationFrame = 0
let activeAnchorResizeObserver: ResizeObserver | null = null

interface CtaActionEventDetail {
  eventName?: string
  payload?: Record<string, unknown>
}

function getFlattenedNavigationItems(items: NavigationItem[]): NavigationItem[] {
  return items.flatMap((item) => [
    item,
    ...getFlattenedNavigationItems(item.children ?? []),
  ])
}

function updateActiveAnchor(): void {
  activeAnchorAnimationFrame = 0

  if (!import.meta.client) {
    return
  }

  const items = getFlattenedNavigationItems(navigationItems.value)
  const anchoredSections = items
    .map((item) => ({
      anchor: item.anchor,
      element: document.getElementById(item.anchor),
    }))
    .filter(
      (
        section,
      ): section is {
        anchor: string
        element: HTMLElement
      } => section.element instanceof HTMLElement,
    )

  if (anchoredSections.length === 0) {
    activeAnchor.value = null
    return
  }

  const activationOffset = 32
  const isScrolledToPageEnd =
    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2

  if (isScrolledToPageEnd) {
    activeAnchor.value = anchoredSections.at(-1)?.anchor ?? null
    return
  }

  const activeSection = anchoredSections
    .filter(
      ({ element }) => element.getBoundingClientRect().top <= activationOffset,
    )
    .at(-1)

  activeAnchor.value = activeSection?.anchor ?? anchoredSections[0]?.anchor ?? null
}

function scheduleActiveAnchorUpdate(): void {
  if (!import.meta.client || activeAnchorAnimationFrame !== 0) {
    return
  }

  activeAnchorAnimationFrame = window.requestAnimationFrame(updateActiveAnchor)
}

function cleanupActiveAnchorTracking(): void {
  window.removeEventListener('scroll', scheduleActiveAnchorUpdate)
  window.removeEventListener('resize', scheduleActiveAnchorUpdate)
  activeAnchorResizeObserver?.disconnect()
  activeAnchorResizeObserver = null

  if (activeAnchorAnimationFrame !== 0) {
    window.cancelAnimationFrame(activeAnchorAnimationFrame)
    activeAnchorAnimationFrame = 0
  }
}

function setupActiveAnchorResizeObserver(): void {
  if (
    !import.meta.client ||
    !previewPanelRef.value ||
    !('ResizeObserver' in window)
  ) {
    return
  }

  activeAnchorResizeObserver?.disconnect()
  activeAnchorResizeObserver = new ResizeObserver(scheduleActiveAnchorUpdate)
  activeAnchorResizeObserver.observe(previewPanelRef.value)
}

function handleExportJson(): void {
  if (!import.meta.client) {
    return
  }

  const validationSummary = getValidationSummary(
    validateEditorContentData(resolvedContent.value.data),
  )

  exportError.value = validationSummary

  if (validationSummary) {
    notifyError(validationSummary)
    return
  }

  const serializedContent = JSON.stringify(resolvedContent.value.data, null, 2)
  const blob = new Blob([serializedContent], {
    type: 'application/json;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = exportFileName
  link.click()
  URL.revokeObjectURL(url)
}

function handleResetDraft(): void {
  resetDraft()
  importMessage.value = null
  importError.value = null
  exportError.value = null
}

function handleImportJson(serializedContent: string): boolean {
  const error = importDraftJson(serializedContent, {
    browserOnlyError: t('app.common.importBrowserOnly'),
    parseError: t('app.common.importParseError'),
    schemaError: t('app.common.importSchemaError'),
  })

  importMessage.value = null
  importError.value = error

  if (error) {
    return false
  }

  importJsonText.value = ''
  exportError.value = null
  const successMessage = t('app.common.importSuccess')
  importMessage.value = successMessage
  notifySuccess(successMessage)

  return true
}

function handleImportPastedJson(): void {
  handleImportJson(importJsonText.value)
}

async function handleImportFile(file: File): Promise<void> {
  try {
    handleImportJson(await file.text())
  } catch {
    const errorMessage = t('app.common.importReadError')
    importMessage.value = null
    importError.value = errorMessage
    notifyError(errorMessage)
  }
}

function handleSetLocalePreference(
  nextPreference: Parameters<typeof setLocalePreference>[0],
): void {
  setLocalePreference(nextPreference)
  exportError.value = null
}

function handleSetNavigationMode(event: Event): void {
  const nextMode = (event.target as HTMLSelectElement).value

  if (nextMode !== 'labels' && nextMode !== 'headings') {
    return
  }

  navigationMode.value = nextMode
}

function handleCtaAction(event: Event): void {
  const detail = (event as CustomEvent<CtaActionEventDetail>).detail

  if (detail?.eventName !== 'open-demo-modal') {
    return
  }

  demoCtaEventName.value = detail.eventName
  demoCtaModalText.value = getPayloadString(detail.payload, 'modalText')
}

function closeDemoModal(): void {
  demoCtaEventName.value = null
  demoCtaModalText.value = null
}

function getPayloadString(
  payload: Record<string, unknown> | undefined,
  key: string,
): string | null {
  const value = payload?.[key]

  return typeof value === 'string' && value.trim() ? value : null
}

onMounted(() => {
  loadContent()
  window.addEventListener('editor:cta-action', handleCtaAction)
  window.addEventListener('scroll', scheduleActiveAnchorUpdate, { passive: true })
  window.addEventListener('resize', scheduleActiveAnchorUpdate)
  void nextTick(() => {
    setupActiveAnchorResizeObserver()
    updateActiveAnchor()
  })
})

watch(
  navigationItems,
  () => {
    activeAnchor.value = null
    void nextTick(updateActiveAnchor)
  },
  { deep: true },
)

onBeforeUnmount(() => {
  window.removeEventListener('editor:cta-action', handleCtaAction)
  cleanupActiveAnchorTracking()
})
</script>

<template>
  <main :class="$style.page">
    <section :class="$style.header">
      <div :class="$style.heading">
        <p :class="$style.kicker">{{ t('app.previewPage.kicker') }}</p>
        <h1 :class="$style.title">{{ t('app.previewPage.title') }}</h1>
        <p :class="$style.meta">
          {{
            isReady ? translatedSourceLabel : t('app.common.loading')
          }}
        </p>
      </div>

      <div
        :class="$style.actions"
        @keydown.stop
      >
        <AppLocaleSelect
          id="preview-locale-select"
          :model-value="currentLocalePreference"
          @update:model-value="handleSetLocalePreference"
        />

        <AppThemeSelect
          id="preview-theme-select"
          :model-value="currentTheme"
          @update:model-value="setTheme"
        />

        <AppButton
          :disabled="!isReady"
          @click="handleExportJson"
        >
          {{ t('app.previewPage.exportJson') }}
        </AppButton>

        <AppButton
          :disabled="!isReady || resolvedContent.source !== 'draft'"
          @click="handleResetDraft"
        >
          {{ t('app.previewPage.resetDraft') }}
        </AppButton>

        <NuxtLink
          :class="$style.editorLink"
          to="/"
        >
          {{ t('app.previewPage.backToEditor') }}
        </NuxtLink>

        <p
          v-if="exportError"
          :class="$style.error"
          role="alert"
        >
          {{ exportError }}
        </p>
      </div>
    </section>

    <section :class="$style.previewLayout">
      <aside
        v-if="hasNavigationItems"
        :class="$style.sidebar"
      >
        <div :class="$style.navigationControl">
          <label
            :class="$style.controlLabel"
            for="preview-navigation-mode-select"
          >
            {{ t('app.navigation.label') }}
          </label>

          <select
            id="preview-navigation-mode-select"
            :class="$style.controlSelect"
            :value="navigationMode"
            @change="handleSetNavigationMode"
          >
            <option value="headings">
              {{ t('app.navigation.headings') }}
            </option>
            <option value="labels">
              {{ t('app.navigation.labels') }}
            </option>
          </select>
        </div>

        <EditorSidebarNavigation
          v-if="navigationItems.length > 0"
          :active-anchor="activeAnchor"
          :items="navigationItems"
          :title="t('app.navigation.title')"
        />
      </aside>

      <div
        ref="previewPanelRef"
        :class="$style.previewPanel"
      >
        <EditorContentRenderer :content="resolvedContent.data" />
      </div>
    </section>

    <ImportJsonPanel
      id="preview-import-json"
      v-model="importJsonText"
      :disabled="!isReady"
      :error="importError"
      :message="importMessage"
      @import-file="handleImportFile"
      @import-pasted="handleImportPastedJson"
    />

    <Teleport to="body">
      <div
        v-if="demoCtaEventName"
        :class="$style.modalBackdrop"
        @click.self="closeDemoModal"
      >
        <dialog
          :class="$style.modal"
          aria-modal="true"
          open
        >
          <p :class="$style.modalTitle">
            {{ t('app.previewPage.ctaDemoModalTitle') }}
          </p>
          <p :class="$style.modalText">
            {{ demoCtaModalDisplayText }}
          </p>
          <button
            type="button"
            :class="$style.modalButton"
            @click="closeDemoModal"
          >
            {{ t('app.previewPage.ctaDemoModalClose') }}
          </button>
        </dialog>
      </div>
    </Teleport>
  </main>
</template>

<style module lang="scss" src="./preview.module.scss" />
