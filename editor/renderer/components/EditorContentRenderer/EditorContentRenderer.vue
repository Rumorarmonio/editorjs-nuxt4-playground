<script setup lang="ts">
import EditorContentList from '~~/editor/renderer/components/EditorContentList/EditorContentList.vue'
import {
  getInlineText,
  sanitizeInlineHtml,
} from '~~/editor/renderer/helpers/sanitize-inline-html'
import { normalizeRichParagraphContent } from '~~/editor/renderer/helpers/rich-field-content'
import { useCssModule } from 'vue'
import type {
  EditorBlock,
  EditorContentBlock,
  EditorContentData,
  TwoColumnsContentData,
} from '~~/editor/shared'
import {
  getAllowedEmbedIframeUrl,
  getKnownBlockTuneData,
  normalizeNoticeBlockData,
  normalizeSectionIntroBlockData,
  normalizeTwoColumnsBlockData,
} from '~~/editor/shared'

defineProps<{
  content: EditorContentData
}>()

const style = useCssModule()

const defaultBlockSpacing = '18px'
const spacingValueMap = {
  none: '0',
  small: '12px',
  medium: '24px',
  large: '40px',
} as const

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

function isNoticeBlock(
  block: EditorContentBlock,
): block is EditorBlock<'notice'> {
  return block.type === 'notice'
}

function isSectionIntroBlock(
  block: EditorContentBlock,
): block is EditorBlock<'sectionIntro'> {
  return block.type === 'sectionIntro'
}

function isTwoColumnsBlock(
  block: EditorContentBlock,
): block is EditorBlock<'twoColumns'> {
  return block.type === 'twoColumns'
}

function asEditorContentData(data: TwoColumnsContentData): EditorContentData {
  return data as EditorContentData
}

function getTwoColumnsLayoutClass(
  layout: EditorBlock<'twoColumns'>['data']['layout'],
): string | undefined {
  switch (layout) {
    case 'leftWide':
      return style.twoColumnsLeftWide
    case 'rightWide':
      return style.twoColumnsRightWide
    default:
      return undefined
  }
}

function getHeaderTag(level: EditorBlock<'header'>['data']['level']): string {
  return `h${level}`
}

function getBlockAnchor(
  blocks: EditorContentBlock[],
  block: EditorContentBlock,
  index: number,
): string | undefined {
  const anchor = getKnownBlockTuneData(block.tunes).anchor?.anchor

  if (!anchor) {
    return undefined
  }

  const sameAnchorIndex = blocks
    .slice(0, index)
    .filter((currentBlock) => {
      return getKnownBlockTuneData(currentBlock.tunes).anchor?.anchor === anchor
    }).length

  return sameAnchorIndex === 0 ? anchor : `${anchor}-${sameAnchorIndex + 1}`
}

function getBlockLabel(block: EditorContentBlock): string | undefined {
  return getKnownBlockTuneData(block.tunes).label?.label
}

function getBlockClasses(): string[] {
  return style.block ? [style.block] : []
}

function getBlockStyle(
  blocks: EditorContentBlock[],
  block: EditorContentBlock,
  index: number,
): Record<string, string> {
  if (index === 0) {
    return {}
  }

  const previousBlock = blocks[index - 1]
  const previousSpacing = previousBlock
    ? getKnownBlockTuneData(previousBlock.tunes).spacing
    : undefined
  const currentSpacing = getKnownBlockTuneData(block.tunes).spacing
  const spacing = currentSpacing?.top ?? previousSpacing?.bottom

  return {
    marginTop: spacing ? spacingValueMap[spacing] : defaultBlockSpacing,
  }
}
</script>

<template>
  <article :class="$style.renderer">
    <template
      v-for="(block, index) in content.blocks"
      :key="block.id ?? `${block.type}-${index}`"
    >
      <div
        :id="getBlockAnchor(content.blocks, block, index)"
        :class="getBlockClasses()"
        :data-block-label="getBlockLabel(block)"
        :style="getBlockStyle(content.blocks, block, index)"
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

        <aside
          v-else-if="isNoticeBlock(block)"
          :class="[
            $style.notice,
            $style[`notice_${normalizeNoticeBlockData(block.data).type}`],
          ]"
        >
          <p
            v-if="normalizeNoticeBlockData(block.data).title"
            :class="$style.noticeTitle"
          >
            {{ normalizeNoticeBlockData(block.data).title }}
          </p>
          <p
            v-if="normalizeNoticeBlockData(block.data).text"
            :class="$style.noticeText"
          >
            {{ normalizeNoticeBlockData(block.data).text }}
          </p>
        </aside>

        <section
          v-else-if="isSectionIntroBlock(block)"
          :class="$style.sectionIntro"
        >
          <h2
            v-if="normalizeSectionIntroBlockData(block.data).title"
            :class="$style.sectionIntroTitle"
          >
            {{ normalizeSectionIntroBlockData(block.data).title }}
          </h2>
          <EditorContentRenderer
            v-if="normalizeRichParagraphContent(normalizeSectionIntroBlockData(block.data).description).blocks.length"
            :class="$style.sectionIntroContent"
            :content="normalizeRichParagraphContent(normalizeSectionIntroBlockData(block.data).description)"
          />
        </section>

        <section
          v-else-if="isTwoColumnsBlock(block)"
          :class="[
            $style.twoColumns,
            getTwoColumnsLayoutClass(normalizeTwoColumnsBlockData(block.data).layout),
            normalizeTwoColumnsBlockData(block.data).isReversed
              ? $style.twoColumnsReversed
              : '',
          ]"
        >
          <EditorContentRenderer
            v-if="normalizeTwoColumnsBlockData(block.data).left.blocks.length"
            :class="$style.twoColumnsColumn"
            :content="asEditorContentData(normalizeTwoColumnsBlockData(block.data).left)"
          />
          <div
            v-else
            :class="$style.twoColumnsColumn"
          />
          <EditorContentRenderer
            v-if="normalizeTwoColumnsBlockData(block.data).right.blocks.length"
            :class="$style.twoColumnsColumn"
            :content="asEditorContentData(normalizeTwoColumnsBlockData(block.data).right)"
          />
          <div
            v-else
            :class="$style.twoColumnsColumn"
          />
        </section>

        <pre
          v-else
          :class="$style.unsupported"
        >{{ block }}</pre>
      </div>
    </template>
  </article>
</template>

<style module lang="scss" src="./EditorContentRenderer.module.scss" />
