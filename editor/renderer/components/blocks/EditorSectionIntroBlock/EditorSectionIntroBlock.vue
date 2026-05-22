<script setup lang="ts">
import EditorContentRenderer from '~~/editor/renderer/components/EditorContentRenderer/EditorContentRenderer.vue'
import { normalizeRichParagraphContent } from '~~/editor/renderer/helpers/rich-field-content'
import { sanitizeInlineHtml } from '~~/editor/renderer/helpers/sanitize-inline-html'
import type { SectionIntroBlockData } from '~~/editor/shared'

defineProps<{
  data: SectionIntroBlockData
}>()
</script>

<template>
  <section :class="$style.sectionIntro">
    <h2
      v-if="data.title"
      :class="$style.sectionIntroTitle"
      v-html="sanitizeInlineHtml(data.title)"
    />
    <EditorContentRenderer
      v-if="normalizeRichParagraphContent(data.description).blocks.length"
      :class="$style.sectionIntroContent"
      :content="normalizeRichParagraphContent(data.description)"
      variant="sectionIntro"
    />
  </section>
</template>

<style module lang="scss" src="./EditorSectionIntroBlock.module.scss" />
