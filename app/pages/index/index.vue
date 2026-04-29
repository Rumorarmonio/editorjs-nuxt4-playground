<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import EditorJsEditor from '~~/editor/admin/components/EditorJsEditor/EditorJsEditor.vue'
import type { EditorContentData } from '~~/editor/shared'
import type { SupportedLocale } from '~~/i18n'

const { t } = useI18n()
const { currentLocale, editorMessages, setLocale, supportedLocales } =
  useAppLocale()

const {
  importDraftJson,
  isReady,
  loadContent,
  resolvedContent,
  saveDraft,
} = useEditorContentSource()

const saveMessage = ref<string | null>(null)
const importJsonText = ref('')
const importMessage = ref<string | null>(null)
const importError = ref<string | null>(null)
const hasUnsavedChanges = ref(false)
const editorRenderKey = ref(0)
const editorRef = ref<InstanceType<typeof EditorJsEditor> | null>(null)
const importFileInputRef = ref<HTMLInputElement | null>(null)
const translatedSourceLabel = computed(() =>
  resolvedContent.value.source === 'draft'
    ? t('app.common.localDraft')
    : t('app.common.defaultJson'),
)

async function handleSaveDraft(): Promise<void> {
  saveMessage.value = null
  await editorRef.value?.save()
}

async function handleOpenPreview(): Promise<void> {
  saveMessage.value = null

  if (await editorRef.value?.save({ validateContent: false })) {
    await navigateTo('/preview')
  }
}

function handleSaved(content: EditorContentData): void {
  saveDraft(content)
  hasUnsavedChanges.value = false
  saveMessage.value = t('app.editorPage.saveSuccess')
}

function handleChanged(): void {
  hasUnsavedChanges.value = true
  saveMessage.value = null
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
  hasUnsavedChanges.value = false
  importMessage.value = t('app.common.importSuccess')
  editorRenderKey.value += 1

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

async function handleSetLocale(nextLocale: SupportedLocale): Promise<void> {
  if (nextLocale === currentLocale.value) {
    return
  }

  if (hasUnsavedChanges.value) {
    const currentContent = await editorRef.value?.getCurrentContent()

    if (!currentContent) {
      return
    }

    saveDraft(currentContent)
    hasUnsavedChanges.value = false
  }

  saveMessage.value = null
  setLocale(nextLocale)
  editorRenderKey.value += 1
}

onMounted(loadContent)
</script>

<template>
  <main :class="$style.page">
    <section :class="$style.header">
      <div :class="$style.heading">
        <p :class="$style.kicker">{{ t('app.editorPage.kicker') }}</p>
        <h1 :class="$style.title">{{ t('app.editorPage.title') }}</h1>
      </div>

      <div :class="$style.headerActions">
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
          :class="$style.previewLink"
          type="button"
          @click="handleOpenPreview"
        >
          {{ t('app.editorPage.openPreview') }}
        </button>
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
          :initial-data="resolvedContent.data"
          :editor-messages="editorMessages"
          @changed="handleChanged"
          @saved="handleSaved"
        />

        <div :class="$style.actions">
          <button
            :class="$style.primaryButton"
            type="button"
            @click="handleSaveDraft"
          >
            {{ t('app.editorPage.saveDraft') }}
          </button>

          <p
            v-if="saveMessage"
            :class="$style.success"
          >
            {{ saveMessage }}
          </p>
        </div>

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
              @click="handleChooseJsonFile"
            >
              {{ t('app.common.chooseFile') }}
            </button>
          </div>

          <textarea
            v-model="importJsonText"
            :class="$style.importTextarea"
            rows="7"
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
              :disabled="importJsonText.trim().length === 0"
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
      </section>
    </section>
  </main>
</template>

<style module lang="scss" src="./index.module.scss" />
