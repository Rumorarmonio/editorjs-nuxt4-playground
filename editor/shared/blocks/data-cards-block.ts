import { withQuery } from 'ufo'

export const dataCardsSources = ['products', 'posts', 'recipes'] as const
export const dataCardsViewModes = ['grid', 'slider', 'list'] as const
export const dataCardsOrders = ['asc', 'desc'] as const

export type DataCardsSource = (typeof dataCardsSources)[number]
export type DataCardsViewMode = (typeof dataCardsViewModes)[number]
export type DataCardsOrder = (typeof dataCardsOrders)[number]

export interface DataCardsSourceConfig {
  collectionPath: string
  defaultOrder: DataCardsOrder
  title: string
}

export interface DataCardsBlockData {
  limit: number
  loadMoreStep: number
  order: DataCardsOrder
  skip: number
  showLoadMore: boolean
  showVisitorControls: boolean
  showViewAllButton: boolean
  source: DataCardsSource
  viewAllHref: string
  viewMode: DataCardsViewMode
}

export interface DataCardsFetchState {
  limit?: number
  order?: DataCardsOrder
  skip?: number
}

export const dataCardsSourceConfigMap: Record<DataCardsSource, DataCardsSourceConfig> =
  {
    products: {
      collectionPath: 'products',
      defaultOrder: 'desc',
      title: 'Products',
    },
    posts: {
      collectionPath: 'posts',
      defaultOrder: 'desc',
      title: 'Posts',
    },
    recipes: {
      collectionPath: 'recipes',
      defaultOrder: 'desc',
      title: 'Recipes',
    },
  }

export function getDataCardsSourceConfig(
  source: DataCardsSource,
): DataCardsSourceConfig {
  return dataCardsSourceConfigMap[source]
}

export function normalizeDataCardsBlockData(
  value: unknown,
): DataCardsBlockData {
  if (!isRecord(value)) {
    return createDefaultDataCardsBlockData()
  }

  const source = isDataCardsSource(value.source) ? value.source : 'products'
  const config = getDataCardsSourceConfig(source)

  return {
    limit: normalizePositiveInteger(value.limit, 6),
    loadMoreStep: normalizePositiveInteger(value.loadMoreStep, 3),
    order: isDataCardsOrder(value.order) ? value.order : config.defaultOrder,
    skip: normalizeNonNegativeInteger(value.skip, 0),
    showLoadMore:
      typeof value.showLoadMore === 'boolean' ? value.showLoadMore : false,
    showVisitorControls:
      typeof value.showVisitorControls === 'boolean'
        ? value.showVisitorControls
        : true,
    showViewAllButton:
      typeof value.showViewAllButton === 'boolean'
        ? value.showViewAllButton
        : true,
    source,
    viewAllHref:
      typeof value.viewAllHref === 'string'
        ? value.viewAllHref
        : createDefaultDataCardsViewAllHref(source),
    viewMode: isDataCardsViewMode(value.viewMode) ? value.viewMode : 'grid',
  }
}

export function isDataCardsBlockData(value: unknown): value is DataCardsBlockData {
  if (!isRecord(value)) {
    return false
  }

  return (
    isDataCardsSource(value.source) &&
    isDataCardsViewMode(value.viewMode) &&
    isDataCardsOrder(value.order) &&
    typeof value.limit === 'number' &&
    Number.isInteger(value.limit) &&
    value.limit >= 0 &&
    typeof value.loadMoreStep === 'number' &&
    Number.isInteger(value.loadMoreStep) &&
    value.loadMoreStep >= 0 &&
    typeof value.skip === 'number' &&
    Number.isInteger(value.skip) &&
    value.skip >= 0 &&
    typeof value.viewAllHref === 'string' &&
    typeof value.showLoadMore === 'boolean' &&
    typeof value.showVisitorControls === 'boolean' &&
    typeof value.showViewAllButton === 'boolean'
  )
}

export function createDefaultDataCardsBlockData(): DataCardsBlockData {
  return normalizeDataCardsBlockData({})
}

export function createDefaultDataCardsViewAllHref(
  source: DataCardsSource,
): string {
  return `https://dummyjson.com/${getDataCardsSourceConfig(source).collectionPath}`
}

export function buildDataCardsCollectionUrl(
  data: DataCardsBlockData,
  state: DataCardsFetchState = {},
): string {
  const config = getDataCardsSourceConfig(data.source)
  const order = state.order ?? data.order
  const limit = state.limit ?? data.limit
  const skip = state.skip ?? data.skip
  const baseUrl = `https://dummyjson.com/${config.collectionPath}`
  const sortBy = getDataCardsDefaultSortBy(data.source)

  return withQuery(baseUrl, {
    limit,
    order,
    skip,
    sortBy,
  })
}

export function buildDataCardsViewAllHref(
  data: DataCardsBlockData,
  state: DataCardsFetchState = {},
): string {
  const baseHref = data.viewAllHref.trim().length
    ? data.viewAllHref
    : createDefaultDataCardsViewAllHref(data.source)

  const order = state.order ?? data.order

  return withQuery(baseHref, {
    order,
  })
}

function normalizePositiveInteger(value: unknown, fallback: number): number {
  const normalized = normalizeNonNegativeInteger(value, fallback)

  return normalized > 0 ? normalized : fallback
}

function normalizeNonNegativeInteger(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0) {
    return value
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number.parseInt(value, 10)

    if (Number.isInteger(parsed) && parsed >= 0) {
      return parsed
    }
  }

  return fallback
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isDataCardsSource(value: unknown): value is DataCardsSource {
  return (
    typeof value === 'string' &&
    dataCardsSources.includes(value as DataCardsSource)
  )
}

function isDataCardsViewMode(value: unknown): value is DataCardsViewMode {
  return (
    typeof value === 'string' &&
    dataCardsViewModes.includes(value as DataCardsViewMode)
  )
}

function isDataCardsOrder(value: unknown): value is DataCardsOrder {
  return (
    typeof value === 'string' &&
    dataCardsOrders.includes(value as DataCardsOrder)
  )
}

function getDataCardsDefaultSortBy(source: DataCardsSource): string {
  switch (source) {
    case 'posts':
      return 'views'
    case 'recipes':
      return 'rating'
    default:
      return 'rating'
  }
}
