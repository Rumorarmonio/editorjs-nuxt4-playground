<script setup lang="ts">
import { onMounted } from 'vue'
import EditorContentRenderer from '~~/editor/renderer/components/EditorContentRenderer.vue'

const { isReady, loadContent, resolvedContent, sourceLabel } =
  useEditorContentSource()

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

      <NuxtLink
        :class="$style.editorLink"
        to="/"
      >
        Back to editor
      </NuxtLink>
    </section>

    <section :class="$style.previewPanel">
      <EditorContentRenderer :content="resolvedContent.data" />
    </section>
  </main>
</template>

<style module lang="scss" src="./preview.module.scss" />
