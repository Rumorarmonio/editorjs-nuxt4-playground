import { computed, ref } from 'vue'
import defaultPageContent from '~~/content/default-page.json'
import {
  resolveEditorContent,
  writeEditorDraft,
  type EditorContentData,
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

  const sourceLabel = computed(() =>
    resolvedContent.value.source === 'draft' ? 'Local draft' : 'Default JSON',
  )

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

  return {
    isReady,
    resolvedContent,
    saveDraft,
    sourceLabel,
    loadContent,
  }
}
