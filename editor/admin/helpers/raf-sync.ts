export interface RafSyncScheduler {
  schedule: () => void
  cancel: () => void
}

export function createRafSyncScheduler(sync: () => void): RafSyncScheduler {
  let frameId: number | null = null
  let isCancelled = false

  return {
    schedule() {
      if (isCancelled || frameId !== null) {
        return
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null

        if (!isCancelled) {
          sync()
        }
      })
    },
    cancel() {
      isCancelled = true

      if (frameId === null) {
        return
      }

      window.cancelAnimationFrame(frameId)
      frameId = null
    },
  }
}
