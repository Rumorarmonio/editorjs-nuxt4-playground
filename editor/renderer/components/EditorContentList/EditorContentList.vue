<script setup lang="ts">
import { sanitizeInlineHtml } from '~~/editor/renderer/helpers/sanitize-inline-html'
import type { ListBlockData, ListBlockItem } from '~~/editor/shared'

defineOptions({
  name: 'EditorContentList',
})

defineProps<{
  items: ListBlockItem[]
  style: ListBlockData['style']
}>()

function getListTag(style: ListBlockData['style']): string {
  return style === 'ordered' ? 'ol' : 'ul'
}

function isChecklist(style: ListBlockData['style']): boolean {
  return style === 'checklist'
}

function isChecklistItemChecked(item: ListBlockItem): boolean {
  return item.meta?.checked === true
}
</script>

<template>
  <component
    :is="getListTag(style)"
    :class="[$style.list, isChecklist(style) ? $style.listChecklist : '']"
  >
    <li
      v-for="(item, index) in items"
      :key="`${item.content}-${index}`"
      :class="[$style.item, isChecklist(style) ? $style.checklistItem : '']"
    >
      <template v-if="isChecklist(style)">
        <input
          :checked="isChecklistItemChecked(item)"
          :class="$style.checkbox"
          disabled
          tabindex="-1"
          type="checkbox"
        />
        <div :class="$style.content">
          <span v-html="sanitizeInlineHtml(item.content)" />
          <EditorContentList
            v-if="item.items.length > 0"
            :items="item.items"
            :style="style"
          />
        </div>
      </template>
      <template v-else>
        <span v-html="sanitizeInlineHtml(item.content)" />
        <EditorContentList
          v-if="item.items.length > 0"
          :items="item.items"
          :style="style"
        />
      </template>
    </li>
  </component>
</template>

<style module lang="scss" src="./EditorContentList.module.scss" />
