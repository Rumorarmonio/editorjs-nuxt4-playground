<script setup lang="ts">
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { computed, onBeforeUnmount, onMounted, ref, useCssModule, watch } from 'vue'
import {
  buildDataCardsCollectionUrl,
  buildDataCardsViewAllHref,
  getDataCardsSourceConfig,
  normalizeDataCardsBlockData,
  type DataCardsBlockData,
  type DataCardsSource,
} from '~~/editor/shared'
import { getCurrentEditorMessages } from '~~/i18n/editor'

interface DataCardsViewModel {
  description: string
  id: string
  image?: string
  meta: string[]
  placeholderLabel?: string
  stats: Array<{
    label: string
    value: string
  }>
  title: string
  eyebrow: string
}

interface DataCardsApiResponse {
  total?: number
  products?: unknown[]
  posts?: unknown[]
  recipes?: unknown[]
}

const props = defineProps<{
  data: DataCardsBlockData
}>()

const messages = getCurrentEditorMessages()
const style = useCssModule()
const modules = [Navigation, Pagination]

const normalizedData = computed(() => normalizeDataCardsBlockData(props.data))
const sourceConfig = computed(() =>
  getDataCardsSourceConfig(normalizedData.value.source),
)
const visitorOrder = ref(normalizedData.value.order)
const visibleLimit = ref(normalizedData.value.limit)
const loadedCards = ref<DataCardsViewModel[]>([])
const totalCards = ref(0)
const isLoading = ref(false)
const loadError = ref<string | null>(null)
let activeRequestId = 0
let activeAbortController: AbortController | null = null

const currentOrderLabel = computed(() => {
  return messages.tools.dataCards.orderOptions[visitorOrder.value]
})

const canLoadMore = computed(() => {
  return (
    normalizedData.value.showLoadMore &&
    normalizedData.value.viewMode !== 'slider' &&
    loadedCards.value.length < totalCards.value &&
    !isLoading.value
  )
})

const viewAllHref = computed(() => {
  return buildDataCardsViewAllHref(normalizedData.value, {
    order: visitorOrder.value,
  })
})

watch(
  () => props.data,
  () => {
    syncVisitorState()
    void loadCards(true)
  },
  { deep: true, immediate: true },
)

onMounted(() => {
  syncVisitorState()
})

onBeforeUnmount(() => {
  activeAbortController?.abort()
  activeAbortController = null
})

function syncVisitorState(): void {
  const data = normalizedData.value

  visitorOrder.value = data.order
  visibleLimit.value = data.limit
}

async function loadCards(resetVisibleLimit = false): Promise<void> {
  if (!import.meta.client) {
    return
  }

  const data = normalizedData.value

  if (resetVisibleLimit) {
    visibleLimit.value = data.limit
  }

  const requestId = ++activeRequestId

  activeAbortController?.abort()
  activeAbortController = new AbortController()

  isLoading.value = true
  loadError.value = null

  try {
    const response = await fetch(
      buildDataCardsCollectionUrl(data, {
        limit: visibleLimit.value,
        order: visitorOrder.value,
        skip: data.skip,
      }),
      {
        signal: activeAbortController.signal,
      },
    )

    if (!response.ok) {
      throw new Error('Bad response')
    }

    const payload: unknown = await response.json()
    const normalizedResponse = normalizeResponse(data.source, payload)

    if (requestId !== activeRequestId) {
      return
    }

    loadedCards.value = normalizedResponse.items
    totalCards.value = normalizedResponse.total
  } catch {
    if (requestId !== activeRequestId) {
      return
    }

    loadError.value = messages.core.dataLoadError
    loadedCards.value = []
    totalCards.value = 0
  } finally {
    if (requestId === activeRequestId) {
      isLoading.value = false
    }
  }
}

function loadMoreCards(): void {
  visibleLimit.value += normalizedData.value.loadMoreStep
  void loadCards()
}

function handleOrderChange(event: Event): void {
  visitorOrder.value = readSelectValue(event, visitorOrder.value) as
    | 'asc'
    | 'desc'
  visibleLimit.value = normalizedData.value.limit
  void loadCards()
}

function getCardClasses(): string[] {
  return [
    style.card ?? '',
    normalizedData.value.viewMode === 'list' ? style.cardList ?? '' : '',
  ]
}

function getCardImage(card: DataCardsViewModel): string | undefined {
  return card.image
}

function getCardEyebrow(card: DataCardsViewModel): string {
  return card.eyebrow
}

function getCardMeta(card: DataCardsViewModel): string[] {
  return card.meta
}

function getCardStats(card: DataCardsViewModel): Array<{
  label: string
  value: string
}> {
  return card.stats
}

function getCardPlaceholder(card: DataCardsViewModel): string | undefined {
  return card.placeholderLabel
}

function getCurrentViewModeLabel(): string {
  return messages.tools.dataCards.viewModeOptions[normalizedData.value.viewMode]
}

function readSelectValue(event: Event, fallback: string): string {
  const target = event.target

  if (target instanceof HTMLSelectElement) {
    return target.value
  }

  return fallback
}

function normalizeResponse(
  source: DataCardsSource,
  payload: unknown,
): { items: DataCardsViewModel[]; total: number } {
  const response = isRecord(payload) ? (payload as DataCardsApiResponse) : {}
  const rawItems = getResponseItems(source, response)

  return {
    items: rawItems
      .map((item, index) => normalizeCardItem(source, item, index))
      .filter((item): item is DataCardsViewModel => item !== null),
    total:
      typeof response.total === 'number' && Number.isFinite(response.total)
        ? response.total
        : rawItems.length,
  }
}

function getResponseItems(
  source: DataCardsSource,
  response: DataCardsApiResponse,
): unknown[] {
  switch (source) {
    case 'posts':
      return Array.isArray(response.posts) ? response.posts : []
    case 'recipes':
      return Array.isArray(response.recipes) ? response.recipes : []
    default:
      return Array.isArray(response.products) ? response.products : []
  }
}

function normalizeCardItem(
  source: DataCardsSource,
  item: unknown,
  index: number,
): DataCardsViewModel | null {
  if (!isRecord(item)) {
    return null
  }

  if (source === 'posts') {
    const reactions = isRecord(item.reactions) ? item.reactions : null
    const itemId = getIdentifierValue(item.id, `${index + 1}`)

    return {
      id: itemId,
      title: getStringValue(item.title, 'Untitled post'),
      description: truncateText(getStringValue(item.body, '')),
      eyebrow: `Post #${itemId}`,
      meta: getStringArray(item.tags),
      placeholderLabel: 'Posts',
      stats: [
        {
          label: 'Likes',
          value: formatNumber(getNumberValue(reactions?.likes, 0)),
        },
        {
          label: 'Views',
          value: formatNumber(getNumberValue(item.views, 0)),
        },
      ],
    }
  }

  if (source === 'recipes') {
    const mealType = getStringArray(item.mealType)
    const tags = getStringArray(item.tags)
    const itemId = getIdentifierValue(item.id, `${index + 1}`)

    return {
      id: itemId,
      title: getStringValue(item.name, 'Untitled recipe'),
      description: truncateText(
        [
          getStringValue(item.cuisine, ''),
          getStringValue(item.difficulty, ''),
          mealType[0] ?? '',
        ]
          .filter(Boolean)
          .join(' · '),
      ),
      eyebrow: getStringValue(item.cuisine, 'Recipe'),
      image: getStringValue(item.image, ''),
      meta: tags.slice(0, 3),
      stats: [
        {
          label: 'Prep',
          value: `${formatNumber(getNumberValue(item.prepTimeMinutes, 0))}m`,
        },
        {
          label: 'Cook',
          value: `${formatNumber(getNumberValue(item.cookTimeMinutes, 0))}m`,
        },
        {
          label: 'Calories',
          value: formatNumber(getNumberValue(item.caloriesPerServing, 0)),
        },
      ],
    }
  }

  const itemId = getIdentifierValue(item.id, `${index + 1}`)

  return {
    id: itemId,
    title: getStringValue(item.title, 'Untitled product'),
    description: truncateText(getStringValue(item.description, '')),
    eyebrow: getStringValue(item.category, 'Product'),
    image: getStringValue(item.thumbnail, ''),
    meta: [getStringValue(item.category, '')].filter(Boolean),
    stats: [
      {
        label: 'Price',
        value: `$${formatNumber(getNumberValue(item.price, 0), 2)}`,
      },
      {
        label: 'Rating',
        value: formatNumber(getNumberValue(item.rating, 0), 1),
      },
      {
        label: 'Stock',
        value: formatNumber(getNumberValue(item.stock, 0)),
      },
    ],
  }
}

function getStringValue(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback
}

function getIdentifierValue(value: unknown, fallback: string): string {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }

  return fallback
}

function getNumberValue(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function getStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
}

function truncateText(value: string, maxLength = 150): string {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`
}

function formatNumber(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat('en', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
</script>

<template>
  <section :class="$style.dataCards">
    <header :class="$style.header">
      <div :class="$style.headerCopy">
        <p :class="$style.kicker">
          {{ messages.tools.dataCards.toolboxTitle }}
        </p>
        <h3 :class="$style.title">
          {{ sourceConfig.title }}
        </h3>
        <p :class="$style.summary">
          {{ getCurrentViewModeLabel() }}
          · {{ currentOrderLabel }}
        </p>
      </div>
    </header>

    <div
      v-if="normalizedData.showVisitorControls || normalizedData.showViewAllButton"
      :class="$style.topActions"
    >
      <label
        v-if="normalizedData.showVisitorControls"
        :class="$style.control"
      >
        <span :class="$style.controlLabel">
          {{ messages.tools.dataCards.orderLabel }}
        </span>
        <select
          :class="$style.select"
          :value="visitorOrder"
          @change="handleOrderChange"
        >
          <option
            v-for="(label, value) in messages.tools.dataCards.orderOptions"
            :key="value"
            :value="value"
          >
            {{ label }}
          </option>
        </select>
      </label>

      <AppButton
        v-if="normalizedData.showViewAllButton"
        :href="viewAllHref"
        variant="secondary"
      >
        {{ messages.tools.dataCards.viewAllButtonLabel }}
      </AppButton>
    </div>

    <p
      v-if="loadError"
      :class="$style.error"
      role="alert"
    >
      {{ loadError }}
    </p>

    <p
      v-else-if="isLoading && loadedCards.length === 0"
      :class="$style.loading"
    >
      {{ messages.core.loading }}
    </p>

    <template v-else>
      <Swiper
        v-if="normalizedData.viewMode === 'slider'"
        :class="$style.slider"
        :modules="modules"
        :navigation="loadedCards.length > 1"
        :pagination="{ clickable: true }"
        :slides-per-view="1"
        :space-between="18"
      >
        <SwiperSlide
          v-for="card in loadedCards"
          :key="card.id"
        >
          <article :class="getCardClasses()">
            <div
              v-if="getCardImage(card)"
              :class="$style.media"
            >
              <img
                :alt="card.title"
                :src="getCardImage(card)"
              />
            </div>
            <div
              v-else
              :class="$style.placeholder"
            >
              <span>{{ getCardPlaceholder(card) ?? sourceConfig.title }}</span>
            </div>

            <div :class="$style.content">
              <p :class="$style.eyebrow">
                {{ getCardEyebrow(card) }}
              </p>
              <h4 :class="$style.cardTitle">
                {{ card.title }}
              </h4>
              <p :class="$style.description">
                {{ card.description }}
              </p>

              <ul
                v-if="getCardMeta(card).length"
                :class="$style.meta"
              >
                <li
                  v-for="item in getCardMeta(card)"
                  :key="item"
                >
                  {{ item }}
                </li>
              </ul>

              <ul
                v-if="getCardStats(card).length"
                :class="$style.stats"
              >
                <li
                  v-for="stat in getCardStats(card)"
                  :key="`${card.id}-${stat.label}`"
                >
                  <span>{{ stat.label }}</span>
                  <strong>{{ stat.value }}</strong>
                </li>
              </ul>
            </div>
          </article>
        </SwiperSlide>
      </Swiper>

      <div
        v-else
        :class="[
          $style.cards,
          normalizedData.viewMode === 'list' ? $style.cardsList : $style.cardsGrid,
        ]"
      >
        <article
          v-for="card in loadedCards"
          :key="card.id"
          :class="getCardClasses()"
        >
          <div
            v-if="getCardImage(card)"
            :class="$style.media"
          >
            <img
              :alt="card.title"
              :src="getCardImage(card)"
            />
          </div>
          <div
            v-else
            :class="$style.placeholder"
          >
            <span>{{ getCardPlaceholder(card) ?? sourceConfig.title }}</span>
          </div>

          <div :class="$style.content">
            <p :class="$style.eyebrow">
              {{ getCardEyebrow(card) }}
            </p>
            <h4 :class="$style.cardTitle">
              {{ card.title }}
            </h4>
            <p :class="$style.description">
              {{ card.description }}
            </p>

            <ul
              v-if="getCardMeta(card).length"
              :class="$style.meta"
            >
              <li
                v-for="item in getCardMeta(card)"
                :key="item"
              >
                {{ item }}
              </li>
            </ul>

            <ul
              v-if="getCardStats(card).length"
              :class="$style.stats"
            >
              <li
                v-for="stat in getCardStats(card)"
                :key="`${card.id}-${stat.label}`"
              >
                <span>{{ stat.label }}</span>
                <strong>{{ stat.value }}</strong>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </template>

    <div
      v-if="canLoadMore"
      :class="$style.footer"
    >
      <AppButton @click="loadMoreCards">
        {{ messages.tools.dataCards.loadMoreButtonLabel }}
      </AppButton>
    </div>
  </section>
</template>

<style module lang="scss" src="./EditorDataCardsBlock.module.scss" />
