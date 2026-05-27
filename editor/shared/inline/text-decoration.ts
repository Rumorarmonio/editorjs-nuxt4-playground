import { textColorInlineClassName } from './text-color'

const textDecorationTags = new Set(['U', 'S'])

export function normalizeTextDecorationOrder(node: ParentNode): void {
  Array.from(
    node.querySelectorAll<HTMLElement>(`.${textColorInlineClassName}`),
  ).forEach((colorWrapper) => {
    moveTextColorWrapperOutsideDecoration(colorWrapper)
  })
}

export function moveTextColorWrapperOutsideDecoration(
  colorWrapper: HTMLElement,
): void {
  const decorationAncestor = findOutermostTextDecorationAncestor(colorWrapper)

  if (!decorationAncestor) {
    return
  }

  const parent = decorationAncestor.parentNode

  if (!parent) {
    return
  }

  parent.insertBefore(colorWrapper, decorationAncestor)
  colorWrapper.append(decorationAncestor)
}

function findOutermostTextDecorationAncestor(
  element: HTMLElement,
): HTMLElement | null {
  let current = element.parentElement
  let decorationAncestor: HTMLElement | null = null

  while (current) {
    if (textDecorationTags.has(current.tagName)) {
      decorationAncestor = current
    }

    current = current.parentElement
  }

  return decorationAncestor
}
