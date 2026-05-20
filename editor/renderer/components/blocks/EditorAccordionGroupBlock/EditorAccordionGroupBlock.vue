<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Accordion from '~~/editor/renderer/components/blocks/Accordion/Accordion.vue'
import EditorContentRenderer from '~~/editor/renderer/components/EditorContentRenderer/EditorContentRenderer.vue'
import { sanitizeInlineHtml } from '~~/editor/renderer/helpers/sanitize-inline-html'
import type {
  AccordionBodyData,
  AccordionGroupBlockData,
  AccordionGroupItemData,
  EditorContentData,
} from '~~/editor/shared'

const props = defineProps<{
  data: AccordionGroupBlockData
  fallbackGroupId: string
}>()

const initiallyOpenIds = computed(() => {
  const openItems = props.data.items.filter((item) => item.isInitiallyOpen)

  if (!props.data.closeOthersOnOpen) {
    return openItems.map((item) => item.id)
  }

  return openItems[0] ? [openItems[0].id] : []
})

const openItemIds = ref<string[]>(initiallyOpenIds.value)

watch(
  () => props.data,
  () => {
    openItemIds.value = initiallyOpenIds.value
  },
  { deep: true },
)

function toggleItem(itemId: string): void {
  const isOpen = openItemIds.value.includes(itemId)

  if (isOpen) {
    openItemIds.value = openItemIds.value.filter((id) => id !== itemId)
    return
  }

  openItemIds.value = props.data.closeOthersOnOpen
    ? [itemId]
    : [...openItemIds.value, itemId]
}

function getItemId(item: AccordionGroupItemData, index: number): string {
  return `${props.fallbackGroupId}-${item.id || index}`
}

function getHeaderHtml(item: AccordionGroupItemData): string {
  return sanitizeInlineHtml(item.header.blocks[0]?.data.text ?? '')
}

function getHeaderText(item: AccordionGroupItemData, index: number): string {
  return item.header.blocks[0]?.data.text ? '' : `Item ${index + 1}`
}

function asEditorContentData(data: AccordionBodyData): EditorContentData {
  return data as EditorContentData
}
</script>

<template>
  <section :class="$style.group">
    <Accordion
      v-for="(item, index) in data.items"
      :id="getItemId(item, index)"
      :key="item.id || index"
      :class="$style.item"
      :is-open="openItemIds.includes(item.id)"
      @toggle="toggleItem(item.id)"
    >
      <template #head>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span
          v-if="getHeaderHtml(item)"
          :class="$style.headerText"
          v-html="getHeaderHtml(item)"
        />
        <span
          v-else
          :class="$style.headerText"
        >
          {{ getHeaderText(item, index) }}
        </span>
      </template>

      <template #body>
        <EditorContentRenderer
          v-if="item.body.blocks.length"
          :class="$style.bodyContent"
          :content="asEditorContentData(item.body)"
        />
      </template>
    </Accordion>
  </section>
</template>

<style module lang="scss" src="./EditorAccordionGroupBlock.module.scss" />
