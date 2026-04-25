<script setup lang="ts">
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
</script>

<template>
  <component
    :is="getListTag(style)"
    :class="$style.list"
  >
    <li
      v-for="(item, index) in items"
      :key="`${item.content}-${index}`"
    >
      <span>{{ item.content }}</span>
      <EditorContentList
        v-if="item.items.length > 0"
        :items="item.items"
        :style="style"
      />
    </li>
  </component>
</template>

<style module lang="scss" src="./EditorContentList.module.scss" />
