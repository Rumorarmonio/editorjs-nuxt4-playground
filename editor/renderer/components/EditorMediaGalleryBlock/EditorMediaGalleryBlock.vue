<script setup lang="ts">
import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { computed, onBeforeUnmount, onMounted, onUpdated, ref } from 'vue'
import {
  getInlineText,
  sanitizeInlineHtml,
} from '~~/editor/renderer/helpers/sanitize-inline-html'
import { normalizeRichParagraphContent } from '~~/editor/renderer/helpers/rich-field-content'
import {
  normalizeMediaGalleryBlockData,
  type MediaGalleryBlockData,
  type MediaGalleryItemData,
} from '~~/editor/shared'

const props = defineProps<{
  data: MediaGalleryBlockData
}>()

const container = ref<HTMLElement | null>(null)
const modules = [Navigation, Pagination]

const mediaGallery = computed(() => {
  return normalizeMediaGalleryBlockData(props.data)
})

const visibleItems = computed(() => {
  return mediaGallery.value.items.filter((item) => item.url.length > 0)
})

onMounted(bindFancybox)
onUpdated(bindFancybox)
onBeforeUnmount(() => {
  Fancybox.unbind(container.value)
  Fancybox.close()
})

function bindFancybox(): void {
  Fancybox.unbind(container.value)

  if (!mediaGallery.value.enableFancybox) {
    return
  }

  Fancybox.bind(container.value, '[data-fancybox]', {
    Hash: mediaGallery.value.syncUrlWithFancybox ? undefined : false,
  })
}

function getGalleryName(): string {
  return mediaGallery.value.galleryId || 'media-gallery'
}

function getItemCaption(item: MediaGalleryItemData): string {
  return getInlineText(item.caption)
}

function getItemAlt(item: MediaGalleryItemData): string {
  return item.type === 'image' ? item.alt || getItemCaption(item) : ''
}
</script>

<template>
  <section
    v-if="visibleItems.length"
    ref="container"
    :class="$style.mediaGallery"
  >
    <div
      v-if="mediaGallery.mode === 'gallery'"
      :class="$style.grid"
    >
      <article
        v-for="item in visibleItems"
        :key="item.id"
        :class="$style.card"
      >
        <a
          v-if="mediaGallery.enableFancybox"
          :class="$style.mediaLink"
          :data-caption="getItemCaption(item)"
          :data-fancybox="getGalleryName()"
          :data-type="item.type === 'video' ? 'html5video' : undefined"
          :href="item.url"
        >
          <img
            v-if="item.type === 'image'"
            :alt="getItemAlt(item)"
            :src="item.url"
          />
          <video
            v-else
            muted
            playsinline
            preload="metadata"
            :src="item.url"
          />
        </a>
        <div
          v-else
          :class="$style.mediaFrame"
        >
          <img
            v-if="item.type === 'image'"
            :alt="getItemAlt(item)"
            :src="item.url"
          />
          <video
            v-else
            controls
            preload="metadata"
            :src="item.url"
          />
        </div>

        <p
          v-if="item.caption"
          :class="$style.caption"
          v-html="sanitizeInlineHtml(item.caption)"
        />
        <div
          v-if="normalizeRichParagraphContent(item.description).blocks.length"
          :class="$style.description"
        >
          <p
            v-for="(descriptionBlock, descriptionIndex) in normalizeRichParagraphContent(item.description).blocks"
            :key="descriptionBlock.id ?? descriptionIndex"
            v-html="sanitizeInlineHtml(descriptionBlock.data.text)"
          />
        </div>
      </article>
    </div>

    <Swiper
      v-else
      :class="$style.slider"
      :modules="modules"
      :navigation="visibleItems.length > 1"
      :pagination="{ clickable: true }"
      :slides-per-view="1"
      :space-between="18"
    >
      <SwiperSlide
        v-for="item in visibleItems"
        :key="item.id"
      >
        <article :class="$style.card">
          <a
            v-if="mediaGallery.enableFancybox"
            :class="$style.mediaLink"
            :data-caption="getItemCaption(item)"
            :data-fancybox="getGalleryName()"
            :data-type="item.type === 'video' ? 'html5video' : undefined"
            :href="item.url"
          >
            <img
              v-if="item.type === 'image'"
              :alt="getItemAlt(item)"
              :src="item.url"
            />
            <video
              v-else
              muted
              playsinline
              preload="metadata"
              :src="item.url"
            />
          </a>
          <div
            v-else
            :class="$style.mediaFrame"
          >
            <img
              v-if="item.type === 'image'"
              :alt="getItemAlt(item)"
              :src="item.url"
            />
            <video
              v-else
              controls
              preload="metadata"
              :src="item.url"
            />
          </div>

          <p
            v-if="item.caption"
            :class="$style.caption"
            v-html="sanitizeInlineHtml(item.caption)"
          />
          <div
            v-if="normalizeRichParagraphContent(item.description).blocks.length"
            :class="$style.description"
          >
            <p
              v-for="(descriptionBlock, descriptionIndex) in normalizeRichParagraphContent(item.description).blocks"
              :key="descriptionBlock.id ?? descriptionIndex"
              v-html="sanitizeInlineHtml(descriptionBlock.data.text)"
            />
          </div>
        </article>
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<style module lang="scss" src="./EditorMediaGalleryBlock.module.scss" />
