const TRANSITION_END_FALLBACK_BUFFER_MS = 50

export function waitForElementTransitionEnd(
  element: HTMLElement | null,
  callback: () => void,
): () => void {
  if (!element) {
    callback()
    return () => {}
  }

  let finished = false
  let timeoutId: number | null = null

  const finish = () => {
    if (finished) {
      return
    }

    finished = true
    cleanup()
    callback()
  }

  const onTransitionEnd = (event: TransitionEvent) => {
    if (event.target !== element) {
      return
    }

    finish()
  }

  const cleanup = () => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId)
      timeoutId = null
    }

    element.removeEventListener('transitionend', onTransitionEnd)
  }

  element.addEventListener('transitionend', onTransitionEnd)
  timeoutId = window.setTimeout(
    finish,
    getTransitionDurationMs(element) + TRANSITION_END_FALLBACK_BUFFER_MS,
  )

  return cleanup
}

function getTransitionDurationMs(element: HTMLElement): number {
  const styles = window.getComputedStyle(element)
  const durations = styles.transitionDuration.split(',')
  const delays = styles.transitionDelay.split(',')

  return durations.reduce((maxDuration, duration, index) => {
    const totalDuration =
      parseTimeToMs(duration) + parseTimeToMs(delays[index] ?? '0s')

    return Math.max(maxDuration, totalDuration)
  }, 0)
}

function parseTimeToMs(value: string): number {
  const trimmedValue = value.trim()

  if (trimmedValue.endsWith('ms')) {
    return Number.parseFloat(trimmedValue)
  }

  return Number.parseFloat(trimmedValue) * 1000
}
