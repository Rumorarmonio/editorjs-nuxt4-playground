import { ref } from 'vue'
import defaultPageContent from '~~/content/default-page.json'
import {
  clearEditorDraft,
  omitEmptyBlockTuneData,
  parseEditorContentJson,
  resolveEditorContent,
  writeEditorDraft,
  type EditorContentData,
  type ParseEditorContentJsonMessages,
  type ResolvedEditorContent,
} from '~~/editor/shared'

const defaultContent = omitEmptyBlockTuneData(
  defaultPageContent as EditorContentData,
)

function createDefaultResolvedContent(): ResolvedEditorContent {
  return {
    source: 'default',
    data: defaultContent,
  }
}

export function useEditorContentSource() {
  const resolvedContent = ref<ResolvedEditorContent>(
    createDefaultResolvedContent(),
  )
  const isReady = ref(false)

  function loadContent(): void {
    if (!import.meta.client) {
      return
    }

    const content = resolveEditorContent(defaultContent, localStorage)
    const normalizedContent = omitEmptyBlockTuneData(content.data)

    if (content.source === 'draft') {
      writeEditorDraft(localStorage, normalizedContent)
    }

    resolvedContent.value = {
      source: content.source,
      data: normalizedContent,
    }
    isReady.value = true
  }

  function saveDraft(content: EditorContentData): void {
    if (!import.meta.client) {
      return
    }

    const storageContent = omitEmptyBlockTuneData(content)

    writeEditorDraft(localStorage, storageContent)
    resolvedContent.value = {
      source: 'draft',
      data: storageContent,
    }
  }

  function importDraftJson(
    serializedContent: string,
    messages?: ParseEditorContentJsonMessages & {
      browserOnlyError: string
    },
  ): string | null {
    if (!import.meta.client) {
      return messages?.browserOnlyError ?? 'Import is available only in the browser.'
    }

    const result = parseEditorContentJson(serializedContent, messages)

    if (!result.content) {
      return result.error
    }

    saveDraft(result.content)

    return null
  }

  function resetDraft(): void {
    if (!import.meta.client) {
      return
    }

    clearEditorDraft(localStorage)
    resolvedContent.value = createDefaultResolvedContent()
  }

  return {
    importDraftJson,
    isReady,
    loadContent,
    resetDraft,
    resolvedContent,
    saveDraft,
  }
}
