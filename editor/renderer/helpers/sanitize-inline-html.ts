import {
  getTextBackgroundInlineOptionByClassName,
  textBackgroundInlineClassName,
  textBackgroundInlineClassNames,
  getTextColorInlineOptionByClassName,
  textColorInlineClassName,
  textColorInlineClassNames,
} from '~~/editor/shared'
import { normalizeTextDecorationOrder } from '~~/editor/shared/inline/text-decoration'

const allowedTags = new Set([
  'A',
  'B',
  'BR',
  'I',
  'U',
  'MARK',
  'SPAN',
  'S',
  'CODE',
])
const allowedClasses = new Set([
  'cdx-marker',
  'cdx-underline',
  'cdx-strikethrough',
  'cdx-strikethroughs',
  'inline-code',
  ...textColorInlineClassNames,
  ...textBackgroundInlineClassNames,
])

export function sanitizeInlineHtml(html: string): string {
  if (!import.meta.client) {
    return escapeHtml(html)
  }

  const template = document.createElement('template')

  template.innerHTML = html
  sanitizeNode(template.content)
  normalizeTextDecorationOrder(template.content)

  return template.innerHTML
}

export function getInlineText(html: string): string {
  if (!import.meta.client) {
    return stripTags(html)
  }

  const template = document.createElement('template')

  template.innerHTML = sanitizeInlineHtml(html)

  return template.content.textContent ?? ''
}

function sanitizeNode(node: Node): void {
  Array.from(node.childNodes).forEach((childNode) => {
    if (childNode.nodeType === Node.TEXT_NODE) {
      return
    }

    if (!(childNode instanceof HTMLElement)) {
      childNode.remove()
      return
    }

    if (!allowedTags.has(childNode.tagName)) {
      childNode.replaceWith(
        document.createTextNode(childNode.textContent ?? ''),
      )
      return
    }

    sanitizeElement(childNode)
    sanitizeNode(childNode)
  })
}

function sanitizeElement(element: HTMLElement): void {
  const href = element.getAttribute('href') ?? ''
  const classes = Array.from(element.classList).filter((className) =>
    allowedClasses.has(className),
  )

  Array.from(element.attributes).forEach((attribute) => {
    element.removeAttribute(attribute.name)
  })

  if (element.tagName === 'A') {
    if (isAllowedHref(href)) {
      element.setAttribute('href', href)
      element.setAttribute('rel', 'noreferrer')
      element.setAttribute('target', '_blank')
    }
  }

  if (element.tagName === 'SPAN') {
    const colorOption = getTextColorInlineOptionByClassName(classes)
    const backgroundOption = getTextBackgroundInlineOptionByClassName(classes)
    const nextClasses: string[] = []

    if (classes.includes(textColorInlineClassName) && colorOption) {
      nextClasses.push(textColorInlineClassName, colorOption.className)
    }

    if (classes.includes(textBackgroundInlineClassName) && backgroundOption) {
      nextClasses.push(
        textBackgroundInlineClassName,
        backgroundOption.className,
      )
    }

    if (nextClasses.length > 0) {
      element.className = nextClasses.join(' ')
      return
    }
  }

  if (element.tagName === 'MARK') {
    const backgroundOption = getTextBackgroundInlineOptionByClassName(classes)

    if (
      classes.includes(textBackgroundInlineClassName) &&
      backgroundOption
    ) {
      element.className = [
        textBackgroundInlineClassName,
        backgroundOption.className,
      ].join(' ')
      return
    }

    if (classes.includes('cdx-marker')) {
      element.className = [
        textBackgroundInlineClassName,
        'editor-background-color--warning',
      ].join(' ')
      return
    }
  }

  if (classes.length > 0) {
    element.className = classes.join(' ')
  }
}

function isAllowedHref(href: string): boolean {
  return (
    href.startsWith('https://') ||
    href.startsWith('http://') ||
    href.startsWith('mailto:')
  )
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function stripTags(value: string): string {
  return value.replaceAll(/<[^>]*>/g, '')
}
