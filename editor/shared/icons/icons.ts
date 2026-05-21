import { iconNames } from './icon-names.generated'
import type { IconName } from './icon-names.generated'

const iconNameSet = new Set<string>(iconNames)

function normalizeSpriteBaseURL(baseURL: string) {
  if (baseURL.length === 0) {
    return '/'
  }

  return baseURL.endsWith('/') ? baseURL : `${baseURL}/`
}

export function isIconName(value: unknown): value is IconName {
  return typeof value === 'string' && iconNameSet.has(value)
}

export function createIconSymbolId(iconName: IconName) {
  return `icon/${iconName}` as const
}

export function createIconSpriteHref(iconName: IconName, baseURL = '/') {
  return `${normalizeSpriteBaseURL(baseURL)}icons/sprite.svg#${createIconSymbolId(iconName)}`
}

export { iconNames }
export type { IconName }
