import type { INotyfNotificationOptions, INotyfOptions } from 'notyf'

type ToastOptions = Partial<INotyfNotificationOptions>

interface NotyfInstance {
  success: (payload: string | Partial<INotyfNotificationOptions>) => void
  error: (payload: string | Partial<INotyfNotificationOptions>) => void
  dismissAll: () => void
}

const defaultOptions: INotyfOptions = {
  duration: 3600,
  ripple: false,
  dismissible: true,
  position: {
    x: 'center',
    y: 'top',
  },
  types: [
    {
      type: 'success',
      background: 'var(--color-success)',
      icon: false,
    },
    {
      type: 'error',
      background: 'var(--color-danger)',
      icon: false,
    },
  ],
}

let notyfInstance: NotyfInstance | null = null
let notyfPromise: Promise<NotyfInstance | null> | null = null

export function notifySuccess(
  message: string,
  options: ToastOptions = {},
): void {
  void dispatchToast('success', message, options)
}

export function notifyError(
  message: string,
  options: ToastOptions = {},
): void {
  void dispatchToast('error', message, options)
}

export function dismissToasts(): void {
  void getNotyf().then((notyf) => {
    notyf?.dismissAll()
  })
}

export function installToastDebugApi(): void {
  if (!import.meta.client || !import.meta.dev || typeof window === 'undefined') {
    return
  }

  const debugWindow = window as Window & {
    editorjsToasts?: {
      success: typeof notifySuccess
      error: typeof notifyError
      dismissAll: typeof dismissToasts
    }
  }

  debugWindow.editorjsToasts = {
    success: notifySuccess,
    error: notifyError,
    dismissAll: dismissToasts,
  }
}

async function dispatchToast(
  type: 'success' | 'error',
  message: string,
  options: ToastOptions,
): Promise<void> {
  const notyf = await getNotyf()

  if (type === 'success') {
    notyf?.success({
      ...options,
      message,
    })
    return
  }

  notyf?.error({
    ...options,
    message,
  })
}

async function getNotyf(): Promise<NotyfInstance | null> {
  if (!import.meta.client) {
    return null
  }

  if (!notyfInstance) {
    notyfInstance = await loadNotyf()
  }

  return notyfInstance
}

async function loadNotyf(): Promise<NotyfInstance | null> {
  if (!notyfPromise) {
    notyfPromise = import('notyf')
      .then(({ Notyf }) => new Notyf(defaultOptions))
      .catch(() => null)
  }

  return notyfPromise
}
