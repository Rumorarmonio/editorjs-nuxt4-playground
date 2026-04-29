<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import EditorContentRenderer from '~~/editor/renderer/components/EditorContentRenderer/EditorContentRenderer.vue'
import EditorSidebarNavigation from '~~/editor/renderer/components/navigation/EditorSidebarNavigation/EditorSidebarNavigation.vue'
import {
  buildFlatNavigationItems,
  getValidationSummary,
  validateEditorContentData,
} from '~~/editor/shared'
import type { SupportedLocale } from '~~/i18n'

const { t } = useI18n()
const { currentLocale, setLocale, supportedLocales } = useAppLocale()

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
const importFileInputRef = ref<HTMLInputElement | null>(null)
const navigationItems = computed(() => {
  return buildFlatNavigationItems(resolvedContent.value.data)
})
const translatedSourceLabel = computed(() =>
  resolvedContent.value.source === 'draft'
    ? t('app.common.localDraft')
    : t('app.common.defaultJson'),
)

function handleExportJson(): void {
  if (!import.meta.client) {
    return
  }

  const validationSummary = getValidationSummary(
    validateEditorContentData(resolvedContent.value.data),
  )

  exportError.value = validationSummary

  if (validationSummary) {
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
  importMessage.value = t('app.common.importSuccess')

  return true
}

function handleImportPastedJson(): void {
  handleImportJson(importJsonText.value)
}

function handleChooseJsonFile(): void {
  importFileInputRef.value?.click()
}

async function handleImportFile(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  try {
    handleImportJson(await file.text())
  } catch {
    importMessage.value = null
    importError.value = t('app.common.importReadError')
  } finally {
    input.value = ''
  }
}

function handleSetLocale(nextLocale: SupportedLocale): void {
  setLocale(nextLocale)
  exportError.value = null
}

onMounted(loadContent)
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

      <div :class="$style.actions">
        <div
          :class="$style.localeSwitcher"
          :aria-label="t('app.locale.label')"
        >
          <button
            v-for="item in supportedLocales"
            :key="item.code"
            :class="[
              $style.secondaryButton,
              currentLocale === item.code ? $style.activeLocaleButton : '',
            ]"
            type="button"
            :aria-pressed="currentLocale === item.code"
            @click="handleSetLocale(item.code)"
          >
            {{ item.label }}
          </button>
        </div>

        <button
          :class="$style.secondaryButton"
          type="button"
          :disabled="!isReady"
          @click="handleExportJson"
        >
          {{ t('app.previewPage.exportJson') }}
        </button>

        <button
          :class="$style.secondaryButton"
          type="button"
          :disabled="!isReady || resolvedContent.source !== 'draft'"
          @click="handleResetDraft"
        >
          {{ t('app.previewPage.resetDraft') }}
        </button>

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
        v-if="navigationItems.length > 0"
        :class="$style.sidebar"
      >
        <EditorSidebarNavigation :items="navigationItems" />
      </aside>

      <div :class="$style.previewPanel">
        <EditorContentRenderer :content="resolvedContent.data" />
      </div>
    </section>

    <section
      :class="$style.importPanel"
      aria-labelledby="import-json-title"
    >
      <div :class="$style.importHeader">
        <h2
          id="import-json-title"
          :class="$style.importTitle"
        >
          {{ t('app.common.importJson') }}
        </h2>

        <button
          :class="$style.secondaryButton"
          type="button"
          :disabled="!isReady"
          @click="handleChooseJsonFile"
        >
          {{ t('app.common.chooseFile') }}
        </button>
      </div>

      <textarea
        v-model="importJsonText"
        :class="$style.importTextarea"
        rows="5"
        spellcheck="false"
        :placeholder="t('app.common.importPlaceholder')"
      />

      <input
        ref="importFileInputRef"
        :class="$style.fileInput"
        type="file"
        accept="application/json,.json"
        @change="handleImportFile"
      >

      <div :class="$style.importActions">
        <button
          :class="$style.secondaryButton"
          type="button"
          :disabled="!isReady || importJsonText.trim().length === 0"
          @click="handleImportPastedJson"
        >
          {{ t('app.common.importPastedJson') }}
        </button>

        <p
          v-if="importMessage"
          :class="$style.success"
        >
          {{ importMessage }}
        </p>

        <p
          v-if="importError"
          :class="$style.error"
          role="alert"
        >
          {{ importError }}
        </p>
      </div>
    </section>
  </main>
</template>

<style module lang="scss" src="./preview.module.scss" />
