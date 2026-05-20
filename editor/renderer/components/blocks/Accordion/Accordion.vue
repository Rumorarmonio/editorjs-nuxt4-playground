<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

defineOptions({
  name: 'EditorAccordion',
})

const props = defineProps<{
  id: string
  isOpen: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

const bodyRef = ref<HTMLElement | null>(null)
const bodyInnerRef = ref<HTMLElement | null>(null)
const accordionRef = ref<HTMLElement | null>(null)
const bodyHeight = ref('0px')
let resizeObserver: ResizeObserver | null = null
let resizeSuppressionTimer: ReturnType<typeof window.setTimeout> | null = null
let targetBodyHeight = 0

const nestedResizeEventName = 'editor-accordion-resize'
const transitionDurationMs = 300

function updateBodyHeight(): void {
  const nextHeight = props.isOpen
    ? (bodyInnerRef.value?.scrollHeight ?? bodyRef.value?.scrollHeight ?? 0)
    : 0

  setBodyHeight(nextHeight)
}

function setBodyHeight(nextHeight: number): void {
  const normalizedHeight = Math.max(0, nextHeight)
  const nextHeightValue = `${normalizedHeight}px`

  targetBodyHeight = normalizedHeight
  bodyHeight.value = nextHeightValue

  if (bodyRef.value) {
    bodyRef.value.style.height = nextHeightValue
  }
}

function handleToggle(): void {
  emit('toggle')
}

function handleNestedAccordionResize(event: Event): void {
  if (!isAccordionResizeEvent(event) || event.detail.sourceId === props.id) {
    return
  }

  event.stopPropagation()
  suppressIntermediateResize()
  applyNestedHeightDelta(event.detail.delta)
  notifyAncestorAccordionsWithDelta(event.detail.delta)
}

function handleObservedResize(): void {
  if (resizeSuppressionTimer) {
    return
  }

  updateBodyHeight()
  notifyAncestorAccordions()
}

function suppressIntermediateResize(): void {
  if (!import.meta.client) {
    return
  }

  if (resizeSuppressionTimer) {
    window.clearTimeout(resizeSuppressionTimer)
  }

  resizeSuppressionTimer = window.setTimeout(() => {
    resizeSuppressionTimer = null
    updateBodyHeight()
    notifyAncestorAccordions()
  }, transitionDurationMs)
}

function notifyAncestorAccordions(): void {
  notifyAncestorAccordionsWithDelta(0)
}

function notifyAncestorAccordionsWithDelta(delta: number): void {
  bodyRef.value?.dispatchEvent(
    new CustomEvent<AccordionResizeEventDetail>(nestedResizeEventName, {
      bubbles: true,
      detail: {
        sourceId: props.id,
        delta,
      },
    }),
  )
}

function applyNestedHeightDelta(delta: number): void {
  if (!props.isOpen || !bodyRef.value || delta === 0) {
    updateBodyHeight()
    return
  }

  setBodyHeight(targetBodyHeight + delta)
}

onMounted(() => {
  updateBodyHeight()
  accordionRef.value?.addEventListener(
    nestedResizeEventName,
    handleNestedAccordionResize,
  )

  if (
    !import.meta.client ||
    !bodyInnerRef.value ||
    !('ResizeObserver' in window)
  ) {
    return
  }

  resizeObserver = new ResizeObserver(handleObservedResize)
  resizeObserver.observe(bodyInnerRef.value)
})

watch(
  () => props.isOpen,
  (isOpen) => {
    void nextTick(() => {
      const previousHeight = targetBodyHeight

      updateBodyHeight()

      const nextHeight = isOpen
        ? (bodyInnerRef.value?.scrollHeight ?? 0)
        : 0

      notifyAncestorAccordionsWithDelta(nextHeight - previousHeight)
    })
  },
)

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
  accordionRef.value?.removeEventListener(
    nestedResizeEventName,
    handleNestedAccordionResize,
  )

  if (resizeSuppressionTimer) {
    window.clearTimeout(resizeSuppressionTimer)
    resizeSuppressionTimer = null
  }
})

interface AccordionResizeEventDetail {
  sourceId: string
  delta: number
}

function isAccordionResizeEvent(
  event: Event,
): event is CustomEvent<AccordionResizeEventDetail> {
  return (
    event instanceof CustomEvent &&
    event.type === nestedResizeEventName &&
    typeof event.detail?.sourceId === 'string' &&
    typeof event.detail.delta === 'number'
  )
}
</script>

<template>
  <section
    ref="accordionRef"
    :class="$style.accordion"
  >
    <h3 :class="$style.heading">
      <button
        :id="`${id}-button`"
        type="button"
        :class="$style.trigger"
        :aria-expanded="isOpen"
        :aria-controls="`${id}-panel`"
        @click="handleToggle"
      >
        <span :class="$style.head">
          <slot name="head" />
        </span>
        <span
          :class="$style.icon"
          aria-hidden="true"
        />
      </button>
    </h3>

    <div
      :id="`${id}-panel`"
      ref="bodyRef"
      :class="$style.body"
      :style="{ height: bodyHeight }"
      role="region"
      :aria-labelledby="`${id}-button`"
      :aria-hidden="!isOpen"
    >
      <div
        ref="bodyInnerRef"
        :class="$style.bodyInner"
      >
        <slot name="body" />
      </div>
    </div>
  </section>
</template>

<style module lang="scss" src="./Accordion.module.scss" />
