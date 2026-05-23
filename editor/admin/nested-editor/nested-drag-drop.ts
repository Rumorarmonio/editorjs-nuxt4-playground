import type EditorJS from '@editorjs/editorjs'

const dragHandleSelector = '.ce-toolbar__settings-btn'
const nestedEditorRootSelector = '[data-editorjs-nested-editor]'
const dropTargetClassName = 'ce-block--drop-target'
const defaultBorderStyle = '1px dashed #aaa'

export interface NestedEditorDragDropPatch {
  destroy: () => void
}

export function enableNestedEditorDragDrop({
  editor,
  root,
}: {
  editor: EditorJS
  root: HTMLElement
}): NestedEditorDragDropPatch {
  let isDragging = false
  let startBlockIndex: number | null = null
  let currentDropTarget: HTMLElement | null = null
  let currentHandle: HTMLButtonElement | null = null
  let scrollLockSnapshot: ScrollLockSnapshot | null = null
  const observer = new MutationObserver(syncDragHandle)

  observer.observe(root, {
    childList: true,
    subtree: true,
  })
  syncDragHandle()

  document.addEventListener('dragstart', handleDragStart, true)
  document.addEventListener('dragover', handleDragOver, true)
  document.addEventListener('drop', handleDrop, true)
  document.addEventListener('dragend', stopDragging, true)

  return {
    destroy() {
      observer.disconnect()
      detachHandle(currentHandle)
      clearDropTarget()
      stopDragging()
      document.removeEventListener('dragstart', handleDragStart, true)
      document.removeEventListener('dragover', handleDragOver, true)
      document.removeEventListener('drop', handleDrop, true)
      document.removeEventListener('dragend', stopDragging, true)
    },
  }

  function syncDragHandle(): void {
    const nextHandle = root.querySelector<HTMLButtonElement>(dragHandleSelector)

    if (nextHandle === currentHandle) {
      return
    }

    detachHandle(currentHandle)
    currentHandle = nextHandle
    attachHandle(currentHandle)
  }

  function attachHandle(handle: HTMLButtonElement | null): void {
    if (!handle) {
      return
    }

    handle.setAttribute('draggable', 'true')
  }

  function detachHandle(handle: HTMLButtonElement | null): void {
    if (!handle) {
      return
    }

    handle.removeAttribute('draggable')
  }

  function handleDragStart(event: DragEvent): void {
    const target = event.target

    if (
      !(target instanceof Element) ||
      target.closest(nestedEditorRootSelector) !== root ||
      !target.closest(dragHandleSelector)
    ) {
      return
    }

    const currentBlockIndex = editor.blocks.getCurrentBlockIndex()

    if (currentBlockIndex < 0 || editor.blocks.getBlocksCount() <= 1) {
      return
    }

    isDragging = true
    startBlockIndex = currentBlockIndex
    lockPageScroll()
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
    }
    event.stopImmediatePropagation()
  }

  function handleDragOver(event: DragEvent): void {
    if (!isDragging || startBlockIndex === null) {
      return
    }

    event.preventDefault()
    event.stopImmediatePropagation()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }

    const target = event.target

    if (
      !(target instanceof Element) ||
      target.closest(nestedEditorRootSelector) !== root
    ) {
      clearDropTarget()
      return
    }

    const blockElement = target.closest<HTMLElement>('.ce-block')

    if (!blockElement) {
      clearDropTarget()
      return
    }

    const blockApi = editor.blocks.getBlockByElement(blockElement)

    if (!blockApi) {
      clearDropTarget()
      return
    }

    const targetIndex = editor.blocks.getBlockIndex(blockApi.id)

    if (targetIndex < 0 || targetIndex === startBlockIndex) {
      clearDropTarget()
      return
    }

    event.preventDefault()
    setDropTarget(blockElement, targetIndex > startBlockIndex)
  }

  function handleDrop(event: DragEvent): void {
    if (!isDragging || startBlockIndex === null) {
      stopDragging()
      return
    }

    event.preventDefault()
    event.stopImmediatePropagation()

    const target = event.target

    if (
      !(target instanceof Element) ||
      target.closest(nestedEditorRootSelector) !== root
    ) {
      stopDragging()
      return
    }

    const blockElement = target.closest<HTMLElement>('.ce-block')

    if (!blockElement) {
      stopDragging()
      return
    }

    const blockApi = editor.blocks.getBlockByElement(blockElement)

    if (!blockApi) {
      stopDragging()
      return
    }

    const targetIndex = editor.blocks.getBlockIndex(blockApi.id)

    const fromIndex = startBlockIndex

    if (targetIndex >= 0 && fromIndex !== null && targetIndex !== fromIndex) {
      editor.blocks.move(targetIndex, fromIndex)
    }

    stopDragging()
  }

  function setDropTarget(
    blockElement: HTMLElement,
    isBelowStartBlock: boolean,
  ): void {
    if (currentDropTarget === blockElement) {
      return
    }

    clearDropTarget()

    currentDropTarget = blockElement
    currentDropTarget.classList.add(dropTargetClassName)

    const content = currentDropTarget.querySelector<HTMLElement>(
      '.ce-block__content',
    )

    if (!content) {
      return
    }

    content.style.removeProperty('border-top')
    content.style.removeProperty('border-bottom')

    if (isBelowStartBlock) {
      content.style.borderBottom = defaultBorderStyle
      return
    }

    content.style.borderTop = defaultBorderStyle
  }

  function clearDropTarget(): void {
    if (!currentDropTarget) {
      return
    }

    const content = currentDropTarget.querySelector<HTMLElement>(
      '.ce-block__content',
    )

    currentDropTarget.classList.remove(dropTargetClassName)
    if (content) {
      content.style.removeProperty('border-top')
      content.style.removeProperty('border-bottom')
    }

    currentDropTarget = null
  }

  function stopDragging(): void {
    isDragging = false
    startBlockIndex = null
    clearDropTarget()
    unlockPageScroll()
  }

  function lockPageScroll(): void {
    if (scrollLockSnapshot) {
      return
    }

    scrollLockSnapshot = {
      bodyOverflow: document.body.style.overflow,
      htmlOverflow: document.documentElement.style.overflow,
      bodyPaddingRight: document.body.style.paddingRight,
    }

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
  }

  function unlockPageScroll(): void {
    if (!scrollLockSnapshot) {
      return
    }

    document.body.style.overflow = scrollLockSnapshot.bodyOverflow
    document.documentElement.style.overflow = scrollLockSnapshot.htmlOverflow
    document.body.style.paddingRight = scrollLockSnapshot.bodyPaddingRight

    scrollLockSnapshot = null
  }
}

interface ScrollLockSnapshot {
  bodyOverflow: string
  htmlOverflow: string
  bodyPaddingRight: string
}
