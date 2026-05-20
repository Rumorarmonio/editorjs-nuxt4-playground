const dragHandleSelector = '.ce-toolbar__settings-btn'
const edgeThresholdPx = 96
const maxScrollSpeedPx = 24

export interface EditorDragAutoScrollPatch {
  destroy: () => void
}

export function enableEditorDragAutoScroll({
  root,
}: {
  root: HTMLElement
}): EditorDragAutoScrollPatch {
  let isDraggingEditorBlock = false
  let lastClientY: number | null = null
  let animationFrameId: number | null = null

  function handleDragStart(event: DragEvent): void {
    const target = event.target

    if (
      !(target instanceof Element) ||
      !root.contains(target) ||
      !target.closest(dragHandleSelector)
    ) {
      return
    }

    isDraggingEditorBlock = true
    lastClientY = event.clientY
    scheduleScroll()
  }

  function handleDrag(event: DragEvent): void {
    if (!isDraggingEditorBlock || event.clientY === 0) {
      return
    }

    lastClientY = event.clientY

    if (getScrollDelta(event.clientY) === 0) {
      cancelScheduledScroll()
      return
    }

    scheduleScroll()
  }

  function stopScroll(): void {
    isDraggingEditorBlock = false
    lastClientY = null

    cancelScheduledScroll()
  }

  function scheduleScroll(): void {
    if (animationFrameId !== null) {
      return
    }

    animationFrameId = requestAnimationFrame(scrollNearViewportEdge)
  }

  function cancelScheduledScroll(): void {
    if (animationFrameId === null) {
      return
    }

    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  function scrollNearViewportEdge(): void {
    animationFrameId = null

    if (!isDraggingEditorBlock || lastClientY === null) {
      return
    }

    const scrollDelta = getScrollDelta(lastClientY)

    if (scrollDelta !== 0) {
      window.scrollBy(0, scrollDelta)
      scheduleScroll()
    }
  }

  root.addEventListener('dragstart', handleDragStart, true)
  document.addEventListener('drag', handleDrag, true)
  document.addEventListener('dragover', handleDrag, true)
  document.addEventListener('drop', stopScroll, true)
  document.addEventListener('dragend', stopScroll, true)
  window.addEventListener('blur', stopScroll)

  return {
    destroy() {
      stopScroll()
      root.removeEventListener('dragstart', handleDragStart, true)
      document.removeEventListener('drag', handleDrag, true)
      document.removeEventListener('dragover', handleDrag, true)
      document.removeEventListener('drop', stopScroll, true)
      document.removeEventListener('dragend', stopScroll, true)
      window.removeEventListener('blur', stopScroll)
    },
  }
}

function getScrollDelta(clientY: number): number {
  if (clientY < edgeThresholdPx) {
    return -getEdgeScrollSpeed(edgeThresholdPx - clientY)
  }

  const bottomDistance = window.innerHeight - clientY

  if (bottomDistance < edgeThresholdPx) {
    return getEdgeScrollSpeed(edgeThresholdPx - bottomDistance)
  }

  return 0
}

function getEdgeScrollSpeed(edgeOverlapPx: number): number {
  const progress = Math.min(Math.max(edgeOverlapPx / edgeThresholdPx, 0), 1)

  return Math.ceil(progress * maxScrollSpeedPx)
}
