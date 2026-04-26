<script setup lang="ts">
import type EditorJS from '@editorjs/editorjs'
import { onBeforeUnmount, onMounted, shallowRef, ref } from 'vue'
import {
  editorBlockTunes,
  createEditorTools,
  editorInlineToolbar,
} from '~~/editor/admin/config/editor-tools'
import {
  isKnownEditorContentData,
  type EditorContentData,
} from '~~/editor/shared'

const props = defineProps<{
  initialData: EditorContentData
}>()

const emit = defineEmits<{
  changed: []
  saved: [content: EditorContentData]
}>()

const holderElement = ref<HTMLElement | null>(null)
const editor = shallowRef<EditorJS | null>(null)
const isReady = ref(false)
const isSaving = ref(false)
const errorMessage = ref<string | null>(null)

async function save(): Promise<boolean> {
  if (!editor.value || isSaving.value) {
    return false
  }

  try {
    isSaving.value = true
    const savedContent: unknown = await editor.value.save()

    if (!isKnownEditorContentData(savedContent)) {
      errorMessage.value =
        'Saved data contains block types that are not registered.'
      return false
    }

    errorMessage.value = null
    emit('saved', savedContent)
    return true
  } catch {
    errorMessage.value = 'Editor content could not be saved.'
    return false
  } finally {
    isSaving.value = false
  }
}

defineExpose({
  save,
})

onMounted(async () => {
  if (!holderElement.value) {
    return
  }

  try {
    const [{ default: EditorJS }, tools] = await Promise.all([
      import('@editorjs/editorjs'),
      createEditorTools(),
    ])

    const instance = new EditorJS({
      holder: holderElement.value,
      data: cloneEditorContent(props.initialData),
      tools,
      tunes: editorBlockTunes,
      inlineToolbar: editorInlineToolbar,
      autofocus: true,
      placeholder: 'Write content or press Tab to open the block toolbar',
      onChange: () => {
        emit('changed')
      },
    })

    editor.value = instance
    await instance.isReady
    isReady.value = true
  } catch {
    errorMessage.value = 'Editor.js could not be initialized.'
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
  editor.value = null
})

function cloneEditorContent(content: EditorContentData): EditorContentData {
  return JSON.parse(JSON.stringify(content)) as EditorContentData
}
</script>

<template>
  <div :class="$style.wrapper">
    <div
      ref="holderElement"
      :class="$style.holder"
    />
    <p
      v-if="!isReady && !errorMessage"
      :class="$style.status"
    >
      Loading editor
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
