<script setup lang="ts">
import EditorContentList from '~~/editor/renderer/components/EditorContentList/EditorContentList.vue'
import {
  getInlineText,
  sanitizeInlineHtml,
} from '~~/editor/renderer/helpers/sanitize-inline-html'
import type {
  EditorBlock,
  EditorContentBlock,
  EditorContentData,
} from '~~/editor/shared'
import { getAllowedEmbedIframeUrl } from '~~/editor/shared'

defineProps<{
  content: EditorContentData
}>()

function isHeaderBlock(
  block: EditorContentBlock,
): block is EditorBlock<'header'> {
  return block.type === 'header'
}

function isParagraphBlock(
  block: EditorContentBlock,
): block is EditorBlock<'paragraph'> {
  return block.type === 'paragraph'
}

function isListBlock(block: EditorContentBlock): block is EditorBlock<'list'> {
  return block.type === 'list'
}

function isQuoteBlock(block: EditorContentBlock): block is EditorBlock<'quote'> {
  return block.type === 'quote'
}

function isDelimiterBlock(
  block: EditorContentBlock,
): block is EditorBlock<'delimiter'> {
  return block.type === 'delimiter'
}

function isTableBlock(block: EditorContentBlock): block is EditorBlock<'table'> {
  return block.type === 'table'
}

function isEmbedBlock(block: EditorContentBlock): block is EditorBlock<'embed'> {
  return block.type === 'embed'
}

function isImageBlock(block: EditorContentBlock): block is EditorBlock<'image'> {
  return block.type === 'image'
}

function getHeaderTag(level: EditorBlock<'header'>['data']['level']): string {
  return `h${level}`
}
</script>

<template>
  <article :class="$style.renderer">
    <template
      v-for="(block, index) in content.blocks"
      :key="block.id ?? `${block.type}-${index}`"
    >
      <component
        :is="getHeaderTag(block.data.level)"
        v-if="isHeaderBlock(block)"
        :class="$style.heading"
      >
        <span v-html="sanitizeInlineHtml(block.data.text)" />
      </component>

      <p
        v-else-if="isParagraphBlock(block)"
        :class="$style.paragraph"
        v-html="sanitizeInlineHtml(block.data.text)"
      />

      <EditorContentList
        v-else-if="isListBlock(block)"
        :items="block.data.items"
        :style="block.data.style"
      />

      <blockquote
        v-else-if="isQuoteBlock(block)"
        :class="$style.quote"
      >
        <p v-html="sanitizeInlineHtml(block.data.text)" />
        <footer
          v-if="block.data.caption"
          v-html="sanitizeInlineHtml(block.data.caption)"
        />
      </blockquote>

      <hr
        v-else-if="isDelimiterBlock(block)"
        :class="$style.delimiter"
      />

      <div
        v-else-if="isTableBlock(block)"
        :class="$style.tableWrap"
      >
        <table :class="$style.table">
          <tbody>
            <tr
              v-for="(row, rowIndex) in block.data.content"
              :key="rowIndex"
            >
              <component
                :is="block.data.withHeadings && rowIndex === 0 ? 'th' : 'td'"
                v-for="(cell, cellIndex) in row"
                :key="cellIndex"
              >
                <span v-html="sanitizeInlineHtml(cell)" />
              </component>
            </tr>
          </tbody>
        </table>
      </div>

      <figure
        v-else-if="isEmbedBlock(block)"
        :class="$style.embed"
      >
        <iframe
          v-if="getAllowedEmbedIframeUrl(block.data)"
          :height="block.data.height ?? 320"
          :src="getAllowedEmbedIframeUrl(block.data) ?? ''"
          :title="getInlineText(block.data.caption || block.data.source)"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
        />
        <a
          v-else
          :href="block.data.source"
          rel="noreferrer"
          target="_blank"
        >
          {{ block.data.service || block.data.source }}
        </a>
        <figcaption
          v-if="block.data.caption"
          v-html="sanitizeInlineHtml(block.data.caption)"
        />
      </figure>

      <figure
        v-else-if="isImageBlock(block)"
        :class="$style.image"
      >
        <img
          :alt="block.data.alt ?? getInlineText(block.data.caption ?? '')"
          :src="block.data.file.url"
        />
        <figcaption
          v-if="block.data.caption"
          v-html="sanitizeInlineHtml(block.data.caption)"
        />
      </figure>

      <pre
        v-else
        :class="$style.unsupported"
      >{{ block }}</pre>
    </template>
  </article>
</template>

<style module lang="scss" src="./EditorContentRenderer.module.scss" />
