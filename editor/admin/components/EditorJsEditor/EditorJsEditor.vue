<script setup lang="ts">
import type EditorJS from '@editorjs/editorjs'
import { nextTick, onBeforeUnmount, onMounted, shallowRef, ref } from 'vue'
import {
  enableEditorToolbarKeyboardAccess,
  type EditorToolbarKeyboardPatch,
} from '~~/editor/admin/accessibility/editor-toolbar-keyboard'
import {
  enableTableToolKeyboardAccess,
  type TableToolKeyboardPatch,
} from '~~/editor/admin/accessibility/table-tool-keyboard'
import {
  enableEditorPluginInfoTooltips,
  type EditorPluginInfoTooltipsPatch,
} from '~~/editor/admin/tooltips/plugin-info-tooltips'
import {
  editorBlockTunes,
  createEditorTools,
  editorInlineToolbar,
} from '~~/editor/admin/config/editor-tools'
import {
  getDuplicateAnchorValues,
  getValidationSummary,
  isKnownEditorContentData,
  validateEditorContentData,
  type EditorContentData,
} from '~~/editor/shared'
import type { EditorUiMessages } from '~~/i18n'

const props = defineProps<{
  initialData: EditorContentData
  editorMessages: EditorUiMessages
}>()

const runtimeConfig = useRuntimeConfig()

const emit = defineEmits<{
  changed: []
  saved: [content: EditorContentData]
}>()

interface SaveOptions {
  validateContent?: boolean
}

const holderElement = ref<HTMLElement | null>(null)
const editor = shallowRef<EditorJS | null>(null)
const isReady = ref(false)
const isSaving = ref(false)
const errorMessage = ref<string | null>(null)
let editorToolbarKeyboardPatch: EditorToolbarKeyboardPatch | null = null
let tableKeyboardPatch: TableToolKeyboardPatch | null = null
let pluginInfoTooltipsPatch: EditorPluginInfoTooltipsPatch | null = null

async function save(options: SaveOptions = {}): Promise<boolean> {
  if (!editor.value || isSaving.value) {
    return false
  }

  try {
    isSaving.value = true
    const savedContent: unknown = await editor.value.save()

    if (!isKnownEditorContentData(savedContent)) {
      errorMessage.value = props.editorMessages.core.unknownBlocksError
      return false
    }

    const duplicateAnchorValues = getDuplicateAnchorValues(savedContent.blocks)

    if (duplicateAnchorValues.length > 0) {
      errorMessage.value = props.editorMessages.core.duplicateAnchorsError(
        duplicateAnchorValues.join(', '),
      )
      return false
    }

    const shouldValidateContent = options.validateContent ?? true
    const validationSummary = shouldValidateContent
      ? getValidationSummary(validateEditorContentData(savedContent))
      : null

    if (validationSummary) {
      errorMessage.value = validationSummary
      scheduleScrollToFirstValidationError()
      return false
    }

    errorMessage.value = null
    emit('saved', savedContent)
    return true
  } catch (error) {
    errorMessage.value =
      error instanceof Error && error.message.includes('validation errors')
        ? props.editorMessages.core.validationSaveError
        : props.editorMessages.core.saveError
    return false
  } finally {
    isSaving.value = false
  }
}

async function getCurrentContent(): Promise<EditorContentData | null> {
  if (!editor.value) {
    return null
  }

  const savedContent: unknown = await editor.value.save()

  return isKnownEditorContentData(savedContent) ? savedContent : null
}

defineExpose({
  getCurrentContent,
  save,
})

onMounted(async () => {
  if (!holderElement.value) {
    return
  }

  const holder = holderElement.value

  try {
    const [{ default: EditorJS }, tools] = await Promise.all([
      import('@editorjs/editorjs'),
      createEditorTools(props.editorMessages),
    ])

    const instance = new EditorJS({
      holder,
      data: cloneEditorContent(props.initialData),
      tools,
      tunes: editorBlockTunes,
      inlineToolbar: editorInlineToolbar,
      autofocus: false,
      i18n: props.editorMessages.editorJs,
      placeholder: props.editorMessages.core.placeholder,
      onChange: () => {
        emit('changed')
      },
    })

    editor.value = instance
    await instance.isReady
    editorToolbarKeyboardPatch = enableEditorToolbarKeyboardAccess({
      root: holder,
      messages: props.editorMessages,
    })
    tableKeyboardPatch = enableTableToolKeyboardAccess({
      root: holder,
      messages: props.editorMessages,
    })
    pluginInfoTooltipsPatch = enableEditorPluginInfoTooltips({
      root: holder,
      messages: props.editorMessages,
      appBaseURL: runtimeConfig.app.baseURL,
    })
    isReady.value = true
  } catch {
    errorMessage.value = props.editorMessages.core.initError
  }
})

onBeforeUnmount(() => {
  editorToolbarKeyboardPatch?.destroy()
  editorToolbarKeyboardPatch = null
  tableKeyboardPatch?.destroy()
  tableKeyboardPatch = null
  pluginInfoTooltipsPatch?.destroy()
  pluginInfoTooltipsPatch = null
  editor.value?.destroy()
  editor.value = null
})

function cloneEditorContent(content: EditorContentData): EditorContentData {
  return JSON.parse(JSON.stringify(content)) as EditorContentData
}

function scheduleScrollToFirstValidationError(): void {
  if (!import.meta.client) {
    return
  }

  void nextTick(() => {
    requestAnimationFrame(scrollToFirstValidationError)
  })
}

function scrollToFirstValidationError(): void {
  const root = holderElement.value

  if (!root) {
    return
  }

  const invalidElement = findFirstVisibleElement(root, [
    '.editor-plain-field--invalid',
    '.editor-block-tune-field--invalid',
  ])

  if (!invalidElement) {
    return
  }

  invalidElement.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
  focusValidationElement(invalidElement)
}

function findFirstVisibleElement(
  root: HTMLElement,
  selectors: string[],
): HTMLElement | null {
  const elements = root.querySelectorAll<HTMLElement>(selectors.join(', '))

  return (
    Array.from(elements).find((element) => isVisibleElement(element)) ?? null
  )
}

function isVisibleElement(element: HTMLElement): boolean {
  if (element.hidden) {
    return false
  }

  return Boolean(element.offsetParent || element.getClientRects().length > 0)
}

function focusValidationElement(element: HTMLElement): void {
  const focusTarget = element.querySelector<HTMLElement>(
    [
      '[aria-invalid="true"]',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'button:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', '),
  )

  focusTarget?.focus({ preventScroll: true })
}
</script>

<template>
  <div :class="$style.wrapper">
    <div
      ref="holderElement"
      :class="[$style.holder, 'editor-admin-editor']"
    />
    <p
      v-if="!isReady && !errorMessage"
      :class="$style.status"
    >
      {{ editorMessages.core.loading }}
    </p>
    <p
      v-if="errorMessage"
      :class="$style.error"
      role="alert"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<style module lang="scss" src="./EditorJsEditor.module.scss" />
