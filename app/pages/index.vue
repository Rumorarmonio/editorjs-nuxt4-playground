<script setup lang="ts">
import { onMounted, ref } from 'vue'
import EditorJsEditor from '~~/editor/admin/components/EditorJsEditor.vue'
import type { EditorContentData } from '~~/editor/shared'

const {
  isReady,
  loadContent,
  resolvedContent,
  saveDraft,
  sourceLabel,
} = useEditorContentSource()

const saveMessage = ref<string | null>(null)
const editorRef = ref<InstanceType<typeof EditorJsEditor> | null>(null)

async function handleSaveDraft(): Promise<void> {
  saveMessage.value = null
  await editorRef.value?.save()
}

async function handleOpenPreview(): Promise<void> {
  saveMessage.value = null

  if (await editorRef.value?.save()) {
    await navigateTo('/preview')
  }
}

function handleSaved(content: EditorContentData): void {
  saveDraft(content)
  saveMessage.value = 'Draft saved locally.'
}

function handleChanged(): void {
  saveMessage.value = null
}

onMounted(loadContent)
</script>

<template>
  <main :class="$style.page">
    <section :class="$style.header">
      <div :class="$style.heading">
        <p :class="$style.kicker">Editor shell</p>
        <h1 :class="$style.title">Content draft</h1>
      </div>

      <button
        :class="$style.previewLink"
        type="button"
        @click="handleOpenPreview"
      >
        Open preview
      </button>
    </section>

    <section :class="$style.workspace">
      <aside :class="$style.sidebar">
        <dl :class="$style.metaList">
          <div :class="$style.metaItem">
            <dt>Source</dt>
            <dd>{{ sourceLabel }}</dd>
          </div>
          <div :class="$style.metaItem">
            <dt>Blocks</dt>
            <dd>{{ resolvedContent.data.blocks.length }}</dd>
          </div>
          <div :class="$style.metaItem">
            <dt>Status</dt>
            <dd>{{ isReady ? 'Loaded' : 'Loading' }}</dd>
          </div>
        </dl>
      </aside>

      <section
        :class="$style.editorPanel"
      >
        <EditorJsEditor
          v-if="isReady"
          ref="editorRef"
          :initial-data="resolvedContent.data"
          @changed="handleChanged"
          @saved="handleSaved"
        />

        <div :class="$style.actions">
          <button
            :class="$style.primaryButton"
            type="button"
            @click="handleSaveDraft"
          >
            Save draft
          </button>

          <p
            v-if="saveMessage"
            :class="$style.success"
          >
            {{ saveMessage }}
          </p>
        </div>
      </section>
    </section>
  </main>
</template>

<style module lang="scss" src="./index.module.scss" />
