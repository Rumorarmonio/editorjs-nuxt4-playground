<script setup lang="ts">
import { useCssModule } from 'vue'
import EditorIcon from '~~/editor/renderer/components/Icon/Icon.vue'
import {
  isIconName,
  type CtaBlockData,
  type CtaBlockVariant,
  type IconName,
} from '~~/editor/shared'

const props = defineProps<{
  data: CtaBlockData
}>()

const runtimeConfig = useRuntimeConfig()
const style = useCssModule()

const href = computed(() => {
  return resolveCtaHref(props.data.url, runtimeConfig.app.baseURL)
})

const isInternalAppLink = computed(() => {
  return (
    props.data.actionType === 'link' &&
    props.data.target === 'sameTab' &&
    isRootRelativeAppUrl(props.data.url)
  )
})

const target = computed(() => {
  return props.data.target === 'newTab' ? '_blank' : undefined
})

const rel = computed(() => {
  return props.data.target === 'newTab' ? 'noreferrer' : undefined
})

const isIconOnly = computed(() => {
  return props.data.contentMode === 'iconOnly'
})

const leftIcon = computed<IconName | null>(() => {
  if (props.data.contentMode !== 'text' || !isIconName(props.data.leftIcon)) {
    return null
  }

  return props.data.leftIcon
})

const rightIcon = computed<IconName | null>(() => {
  if (props.data.contentMode !== 'text' || !isIconName(props.data.rightIcon)) {
    return null
  }

  return props.data.rightIcon
})

const iconOnlyIcon = computed<IconName | null>(() => {
  if (!isIconOnly.value || !isIconName(props.data.icon)) {
    return null
  }

  return props.data.icon
})

const ariaLabel = computed(() => {
  return iconOnlyIcon.value ? props.data.label : undefined
})

const ctaClasses = computed(() => {
  return [
    style.ctaAction,
    getCtaVariantClass(props.data.variant),
    iconOnlyIcon.value ? style.ctaActionIconOnly : '',
  ]
})

function handleEventAction(): void {
  const eventName = props.data.eventName

  window.dispatchEvent(
    new CustomEvent('editor:cta-action', {
      detail: {
        eventName,
        payload: parseEventPayload(props.data.eventPayloadJson),
        data: props.data,
      },
    }),
  )
}

function getCtaVariantClass(variant: CtaBlockVariant): string {
  switch (variant) {
    case 'secondary':
      return style.ctaActionSecondary ?? ''
    case 'ghost':
      return style.ctaActionGhost ?? ''
    default:
      return style.ctaActionPrimary ?? ''
  }
}

function resolveCtaHref(url: string, baseURL: string): string {
  if (!url.startsWith('/') || url.startsWith('//')) {
    return url
  }

  const normalizedBaseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL

  return `${normalizedBaseURL}${url}`
}

function isRootRelativeAppUrl(url: string): boolean {
  return url.startsWith('/') && !url.startsWith('//')
}

function parseEventPayload(value: string): Record<string, unknown> | undefined {
  if (!value.trim()) {
    return undefined
  }

  try {
    const parsed: unknown = JSON.parse(value)

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      !Array.isArray(parsed)
    ) {
      return parsed as Record<string, unknown>
    }
  } catch {
    return undefined
  }

  return undefined
}
</script>

<template>
  <NuxtLink
    v-if="isInternalAppLink"
    :class="ctaClasses"
    :to="data.url"
    :aria-label="ariaLabel"
  >
    <EditorIcon
      v-if="leftIcon"
      :class="$style.ctaActionIcon"
      :name="leftIcon"
      :size="20"
    />
    <span
      v-if="!isIconOnly || !iconOnlyIcon"
      :class="$style.ctaActionLabel"
    >
      {{ data.label }}
    </span>
    <EditorIcon
      v-if="rightIcon"
      :class="$style.ctaActionIcon"
      :name="rightIcon"
      :size="20"
    />
    <EditorIcon
      v-if="iconOnlyIcon"
      :class="$style.ctaActionIcon"
      :name="iconOnlyIcon"
      :size="20"
    />
  </NuxtLink>
  <a
    v-else-if="data.actionType === 'link'"
    :class="ctaClasses"
    :href="href"
    :target="target"
    :rel="rel"
    :aria-label="ariaLabel"
  >
    <EditorIcon
      v-if="leftIcon"
      :class="$style.ctaActionIcon"
      :name="leftIcon"
      :size="20"
    />
    <span
      v-if="!isIconOnly || !iconOnlyIcon"
      :class="$style.ctaActionLabel"
    >
      {{ data.label }}
    </span>
    <EditorIcon
      v-if="rightIcon"
      :class="$style.ctaActionIcon"
      :name="rightIcon"
      :size="20"
    />
    <EditorIcon
      v-if="iconOnlyIcon"
      :class="$style.ctaActionIcon"
      :name="iconOnlyIcon"
      :size="20"
    />
  </a>
  <button
    v-else
    type="button"
    :class="ctaClasses"
    :aria-label="ariaLabel"
    @click="handleEventAction"
  >
    <EditorIcon
      v-if="leftIcon"
      :class="$style.ctaActionIcon"
      :name="leftIcon"
      :size="20"
    />
    <span
      v-if="!isIconOnly || !iconOnlyIcon"
      :class="$style.ctaActionLabel"
    >
      {{ data.label }}
    </span>
    <EditorIcon
      v-if="rightIcon"
      :class="$style.ctaActionIcon"
      :name="rightIcon"
      :size="20"
    />
    <EditorIcon
      v-if="iconOnlyIcon"
      :class="$style.ctaActionIcon"
      :name="iconOnlyIcon"
      :size="20"
    />
  </button>
</template>

<style module lang="scss" src="./EditorCtaBlock.module.scss" />
