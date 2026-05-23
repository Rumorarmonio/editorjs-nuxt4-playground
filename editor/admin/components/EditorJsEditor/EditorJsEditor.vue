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
  enableEditorDragAutoScroll,
  type EditorDragAutoScrollPatch,
} from '~~/editor/admin/helpers/editor-drag-auto-scroll'
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
  omitEmptyBlockTuneData,
  typographEditorContentData,
  validateEditorContentData,
  type ContentTypographyLocale,
  type EditorContentData,
} from '~~/editor/shared'
import { notifyError } from '~~/shared/notifications'
import type { EditorUiMessages } from '~~/i18n'

const props = defineProps<{
  initialData: EditorContentData
  editorMessages: EditorUiMessages
  contentLocale: ContentTypographyLocale
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
let editorDragAutoScrollPatch: EditorDragAutoScrollPatch | null = null

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

    const typographedContent = typographEditorContentData(
      savedContent,
      props.contentLocale,
    )
    const storageContent = omitEmptyBlockTuneData(typographedContent)
    const duplicateAnchorValues = getDuplicateAnchorValues(
      storageContent.blocks,
    )

    if (duplicateAnchorValues.length > 0) {
      const duplicateAnchorsError = props.editorMessages.core.duplicateAnchorsError(
        duplicateAnchorValues.join(', '),
      )
      errorMessage.value = duplicateAnchorsError
      notifyError(duplicateAnchorsError)
      return false
    }

    const shouldValidateContent = options.validateContent ?? true
    const validationSummary = shouldValidateContent
      ? getValidationSummary(validateEditorContentData(storageContent))
      : null

    if (validationSummary) {
      errorMessage.value = validationSummary
      notifyError(props.editorMessages.core.validationSaveError)
      scheduleScrollToFirstValidationError()
      return false
    }

    errorMessage.value = null
    emit('saved', storageContent)
    return true
  } catch (error) {
    const saveErrorMessage =
      error instanceof Error && error.message.includes('validation errors')
        ? props.editorMessages.core.validationSaveError
        : props.editorMessages.core.saveError
    errorMessage.value = saveErrorMessage
    notifyError(saveErrorMessage)
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

  return isKnownEditorContentData(savedContent)
    ? omitEmptyBlockTuneData(
        typographEditorContentData(savedContent, props.contentLocale),
      )
    : null
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
    const [{ default: EditorJS }, { default: DragDrop }, tools] =
      await Promise.all([
        import('@editorjs/editorjs'),
        import('editorjs-drag-drop'),
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
        if (!isReady.value) {
          return
        }

        emit('changed')
      },
    })

    editor.value = instance
    await instance.isReady
    new DragDrop(instance)
    editorDragAutoScrollPatch = enableEditorDragAutoScroll({
      root: holder,
    })
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
  editorDragAutoScrollPatch?.destroy()
  editorDragAutoScrollPatch = null
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
