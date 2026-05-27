<script setup lang="ts">
import { sanitizeInlineHtml } from '~~/editor/renderer/helpers/sanitize-inline-html'
import type { EditorBlock } from '~~/editor/shared'

defineProps<{
  block: EditorBlock<'header'>
}>()
</script>

<template>
  <h1
    v-if="block.data.level === 1"
    :class="$style.heading"
    v-html="sanitizeInlineHtml(block.data.text)"
  />
  <h2
    v-else-if="block.data.level === 2"
    :class="$style.heading"
    v-html="sanitizeInlineHtml(block.data.text)"
  />
  <h3
    v-else-if="block.data.level === 3"
    :class="$style.heading"
    v-html="sanitizeInlineHtml(block.data.text)"
  />
  <h4
    v-else-if="block.data.level === 4"
    :class="$style.heading"
    v-html="sanitizeInlineHtml(block.data.text)"
  />
  <h5
    v-else-if="block.data.level === 5"
    :class="$style.heading"
    v-html="sanitizeInlineHtml(block.data.text)"
  />
  <h6
    v-else
    :class="$style.heading"
    v-html="sanitizeInlineHtml(block.data.text)"
  />
</template>

<style module lang="scss" src="./EditorHeadingBlock.module.scss" />
