<script setup lang="ts">
import { onMounted } from 'vue'
import EditorContentRenderer from '~~/editor/renderer/components/EditorContentRenderer/EditorContentRenderer.vue'

const { isReady, loadContent, resetDraft, resolvedContent, sourceLabel } =
  useEditorContentSource()

const exportFileName = 'editor-content.json'

function handleExportJson(): void {
  if (!import.meta.client) {
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

onMounted(loadContent)
</script>

<template>
  <main :class="$style.page">
    <section :class="$style.header">
      <div :class="$style.heading">
        <p :class="$style.kicker">Preview shell</p>
        <h1 :class="$style.title">Rendered content</h1>
        <p :class="$style.meta">
          {{ isReady ? sourceLabel : 'Loading' }}
        </p>
      </div>

      <div :class="$style.actions">
        <button
          :class="$style.secondaryButton"
          type="button"
          :disabled="!isReady"
          @click="handleExportJson"
        >
          Export JSON
        </button>

        <button
          :class="$style.secondaryButton"
          type="button"
          :disabled="!isReady || resolvedContent.source !== 'draft'"
          @click="resetDraft"
        >
          Reset draft
        </button>

        <NuxtLink
          :class="$style.editorLink"
          to="/"
        >
          Back to editor
        </NuxtLink>
      </div>
    </section>

    <section :class="$style.previewPanel">
      <EditorContentRenderer :content="resolvedContent.data" />
    </section>
  </main>
</template>

<style module lang="scss" src="./preview.module.scss" />
