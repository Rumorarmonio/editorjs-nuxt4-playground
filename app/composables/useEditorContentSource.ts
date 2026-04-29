import { ref } from 'vue'
import defaultPageContent from '~~/content/default-page.json'
import {
  clearEditorDraft,
  parseEditorContentJson,
  resolveEditorContent,
  writeEditorDraft,
  type EditorContentData,
  type ParseEditorContentJsonMessages,
  type ResolvedEditorContent,
} from '~~/editor/shared'

const defaultContent = defaultPageContent as EditorContentData

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

    resolvedContent.value = resolveEditorContent(defaultContent, localStorage)
    isReady.value = true
  }

  function saveDraft(content: EditorContentData): void {
    if (!import.meta.client) {
      return
    }

    writeEditorDraft(localStorage, content)
    resolvedContent.value = {
      source: 'draft',
      data: content,
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
