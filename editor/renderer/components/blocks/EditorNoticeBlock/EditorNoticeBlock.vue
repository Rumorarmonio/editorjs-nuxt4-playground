<script setup lang="ts">
import EditorContentRenderer from '~~/editor/renderer/components/EditorContentRenderer/EditorContentRenderer.vue'
import { normalizeRichParagraphContent } from '~~/editor/renderer/helpers/rich-field-content'
import { sanitizeInlineHtml } from '~~/editor/renderer/helpers/sanitize-inline-html'
import type { NoticeBlockData } from '~~/editor/shared'

defineProps<{
  data: NoticeBlockData
}>()
</script>

<template>
  <aside :class="[$style.notice, $style[`notice_${data.type}`]]">
    <p
      v-if="data.title"
      :class="$style.noticeTitle"
      v-html="sanitizeInlineHtml(data.title)"
    />
    <EditorContentRenderer
      v-if="normalizeRichParagraphContent(data.text).blocks.length"
      :class="$style.noticeText"
      :content="normalizeRichParagraphContent(data.text)"
    />
  </aside>
</template>

<style module lang="scss" src="./EditorNoticeBlock.module.scss" />
