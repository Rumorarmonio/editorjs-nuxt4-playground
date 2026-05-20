<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import EditorJsEditor from '~~/editor/admin/components/EditorJsEditor/EditorJsEditor.vue'
import {
  getValidationSummary,
  validateEditorContentData,
  type EditorContentData,
} from '~~/editor/shared'
import type { AppLocalePreference } from '~~/i18n'

const { t } = useI18n()
const {
  currentLocale,
  currentLocalePreference,
  editorMessages,
  setLocalePreference,
} = useAppLocale()
const { currentTheme, setTheme } = useAppTheme()

const {
  importDraftJson,
  isReady,
  loadContent,
  resetDraft,
  resolvedContent,
  saveDraft,
} = useEditorContentSource()

const saveMessage = ref<string | null>(null)
const exportError = ref<string | null>(null)
const importJsonText = ref('')
const importMessage = ref<string | null>(null)
const importError = ref<string | null>(null)
const hasUnsavedChanges = ref(false)
const editorRenderKey = ref(0)
const editorRef = ref<InstanceType<typeof EditorJsEditor> | null>(null)
const headerActionsRef = ref<HTMLElement | null>(null)
const translatedSourceLabel = computed(() =>
  resolvedContent.value.source === 'draft'
    ? t('app.common.localDraft')
    : t('app.common.defaultJson'),
)
const exportFileName = 'editor-content.json'

async function handleSaveDraft(): Promise<void> {
  saveMessage.value = null
  await editorRef.value?.save()
}

async function handleOpenPreview(): Promise<void> {
  saveMessage.value = null
  exportError.value = null

  if (
    hasUnsavedChanges.value &&
    !window.confirm(t('app.editorPage.openPreviewConfirm'))
  ) {
    return
  }

  await navigateTo('/preview')
}

async function handleExportJson(): Promise<void> {
  if (!import.meta.client) {
    return
  }

  saveMessage.value = null
  const currentContent = await editorRef.value?.getCurrentContent()

  if (!currentContent) {
    return
  }

  const validationSummary = getValidationSummary(
    validateEditorContentData(currentContent),
  )

  exportError.value = validationSummary

  if (validationSummary) {
    return
  }

  const serializedContent = JSON.stringify(currentContent, null, 2)
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
  if (
    hasUnsavedChanges.value &&
    !window.confirm(t('app.editorPage.resetConfirm'))
  ) {
    return
  }

  resetDraft()
  saveMessage.value = null
  exportError.value = null
  importMessage.value = null
  importError.value = null
  hasUnsavedChanges.value = false
  editorRenderKey.value += 1
}

function handleSaved(content: EditorContentData): void {
  saveDraft(content)
  hasUnsavedChanges.value = false
  exportError.value = null
  saveMessage.value = t('app.editorPage.saveSuccess')
}

function handleChanged(): void {
  hasUnsavedChanges.value = true
  saveMessage.value = null
  exportError.value = null
}

function stopHeaderTabPropagation(event: KeyboardEvent): void {
  const target = event.target

  if (
    event.key !== 'Tab' ||
    !(target instanceof Node) ||
    !headerActionsRef.value?.contains(target)
  ) {
    return
  }

  event.stopImmediatePropagation()
}

function handleSaveShortcut(event: KeyboardEvent): void {
  const isSaveKey = event.code === 'KeyS' || event.key.toLowerCase() === 's'

  if (!isSaveKey || (!event.ctrlKey && !event.metaKey)) {
    return
  }

  event.preventDefault()
  void handleSaveDraft()
}

function handleImportJson(serializedContent: string): boolean {
  if (
    hasUnsavedChanges.value &&
    !window.confirm(t('app.editorPage.importConfirm'))
  ) {
    return false
  }

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
  saveMessage.value = null
  exportError.value = null
  hasUnsavedChanges.value = false
  importMessage.value = t('app.common.importSuccess')
  editorRenderKey.value += 1

  return true
}

function handleImportPastedJson(): void {
  handleImportJson(importJsonText.value)
}

async function handleImportFile(file: File): Promise<void> {
  try {
    handleImportJson(await file.text())
  } catch {
    importMessage.value = null
    importError.value = t('app.common.importReadError')
  }
}

async function handleSetLocalePreference(
  nextPreference: AppLocalePreference,
): Promise<void> {
  if (nextPreference === currentLocalePreference.value) {
    return
  }

  const previousLocale = currentLocale.value

  if (
    hasUnsavedChanges.value &&
    !window.confirm(t('app.editorPage.localeConfirm'))
  ) {
    return
  }

  saveMessage.value = null
  exportError.value = null
  hasUnsavedChanges.value = false
  setLocalePreference(nextPreference)

  if (currentLocale.value !== previousLocale) {
    editorRenderKey.value += 1
  }
}

if (import.meta.client) {
  document.addEventListener('keydown', stopHeaderTabPropagation, true)
  document.addEventListener('keydown', handleSaveShortcut, true)
}

onMounted(loadContent)

onBeforeUnmount(() => {
  if (!import.meta.client) {
    return
  }

  document.removeEventListener('keydown', stopHeaderTabPropagation, true)
  document.removeEventListener('keydown', handleSaveShortcut, true)
})
</script>

<template>
  <main :class="$style.page">
    <section :class="$style.header">
      <div :class="$style.heading">
        <p :class="$style.kicker">{{ t('app.editorPage.kicker') }}</p>
        <h1 :class="$style.title">{{ t('app.editorPage.title') }}</h1>
      </div>

      <div
        ref="headerActionsRef"
        :class="$style.headerActions"
        @keydown.stop
      >
        <AppLocaleSelect
          id="editor-locale-select"
          :model-value="currentLocalePreference"
          @update:model-value="handleSetLocalePreference"
        />

        <AppThemeSelect
          id="editor-theme-select"
          :model-value="currentTheme"
          @update:model-value="setTheme"
        />

        <AppButton
          :disabled="!isReady"
          @click="handleExportJson"
        >
          {{ t('app.editorPage.exportJson') }}
        </AppButton>

        <AppButton
          :disabled="!isReady || resolvedContent.source !== 'draft'"
          @click="handleResetDraft"
        >
          {{ t('app.editorPage.resetDraft') }}
        </AppButton>

        <AppButton
          variant="primary"
          @click="handleOpenPreview"
        >
          {{ t('app.editorPage.openPreview') }}
        </AppButton>

        <p
          v-if="exportError"
          :class="$style.error"
          role="alert"
        >
          {{ exportError }}
        </p>
      </div>
    </section>

    <section :class="$style.workspace">
      <aside :class="$style.sidebar">
        <dl :class="$style.metaList">
          <div :class="$style.metaItem">
            <dt>{{ t('app.common.source') }}</dt>
            <dd>{{ translatedSourceLabel }}</dd>
          </div>
          <div :class="$style.metaItem">
            <dt>{{ t('app.common.blocks') }}</dt>
            <dd>{{ resolvedContent.data.blocks.length }}</dd>
          </div>
          <div :class="$style.metaItem">
            <dt>{{ t('app.common.status') }}</dt>
            <dd>
              {{ isReady ? t('app.common.loaded') : t('app.common.loading') }}
            </dd>
          </div>
        </dl>
      </aside>

      <section
        :class="$style.editorPanel"
      >
        <EditorJsEditor
          v-if="isReady"
          :key="editorRenderKey"
          ref="editorRef"
          :content-locale="currentLocale"
          :initial-data="resolvedContent.data"
          :editor-messages="editorMessages"
          @changed="handleChanged"
          @saved="handleSaved"
        />

        <div :class="$style.actions">
          <AppButton
            variant="primary"
            @click="handleSaveDraft"
          >
            {{ t('app.editorPage.saveDraft') }}
          </AppButton>

          <p
            v-if="saveMessage"
            :class="$style.success"
          >
            {{ saveMessage }}
          </p>
        </div>

        <ImportJsonPanel
          id="editor-import-json"
          v-model="importJsonText"
          :error="importError"
          :message="importMessage"
          :rows="7"
          variant="inline"
          @import-file="handleImportFile"
          @import-pasted="handleImportPastedJson"
        />
      </section>
    </section>
  </main>
</template>

<style module lang="scss" src="./index.module.scss" />
