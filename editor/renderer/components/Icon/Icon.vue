<script setup lang="ts">
import { createIconSpriteHref, type IconName } from '~~/editor/shared'

defineOptions({
  name: 'EditorIcon',
})

const props = withDefaults(
  defineProps<{
    name: IconName
    size?: number | string
    width?: number | string
    height?: number | string
    ariaHidden?: boolean
  }>(),
  {
    size: undefined,
    width: undefined,
    height: undefined,
    ariaHidden: true,
  },
)

const runtimeConfig = useRuntimeConfig()

const iconWidth = computed(() => {
  return normalizeIconSize(props.width ?? props.size)
})

const iconHeight = computed(() => {
  return normalizeIconSize(props.height ?? props.size)
})

const href = computed(() => {
  return createIconSpriteHref(props.name, runtimeConfig.app.baseURL)
})

function normalizeIconSize(value: number | string | undefined): string | undefined {
  if (typeof value === 'number') {
    return `${value}px`
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim()
  }

  return undefined
}
</script>

<template>
  <svg
    :aria-hidden="ariaHidden"
    :width="iconWidth"
    :height="iconHeight"
    focusable="false"
  >
    <use :href="href" />
  </svg>
</template>
