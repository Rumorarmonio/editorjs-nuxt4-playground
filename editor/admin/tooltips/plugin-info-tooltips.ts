import tippy, { type Instance } from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import { createRafSyncScheduler } from '~~/editor/admin/helpers/raf-sync'
import {
  getEditorPluginInfoMetadataMap,
  isEditorPluginInfoCustomToolKey,
  type EditorPluginInfoMetadata,
} from '~~/editor/admin/tooltips/plugin-info-metadata'
import type { EditorUiMessages } from '~~/i18n'

const tooltipAttribute = 'data-editor-plugin-info-tooltip'
const toolAttribute = 'data-editor-plugin-info-tool'
const tooltipTheme = 'editor-plugin-info'

export interface EditorPluginInfoTooltipsPatch {
  destroy: () => void
}

export function enableEditorPluginInfoTooltips({
  root,
  messages,
  appBaseURL = '/',
}: {
  root: HTMLElement
  messages: EditorUiMessages
  appBaseURL?: string
}): EditorPluginInfoTooltipsPatch {
  const metadataByKey = getEditorPluginInfoMetadataMap(messages, appBaseURL)
  const metadataByTitle = new Map(
    Object.values(metadataByKey).map((metadata) => [
      normalizeToolboxTitle(metadata.title),
      metadata,
    ]),
  )
  const instances = new Map<HTMLElement, Instance>()
  const scheduler = createRafSyncScheduler(() => {
    syncPluginInfoTooltips(root, metadataByKey, metadataByTitle, instances)
  })
  const observer = new MutationObserver(() => {
    scheduler.schedule()
  })

  syncPluginInfoTooltips(root, metadataByKey, metadataByTitle, instances)
  observer.observe(root, {
    childList: true,
    subtree: true,
    characterData: true,
  })

  return {
    destroy() {
      scheduler.cancel()
      observer.disconnect()
      Fancybox.close()
      instances.forEach((instance) => {
        instance.destroy()
      })
      instances.clear()
    },
  }
}

function syncPluginInfoTooltips(
  root: HTMLElement,
  metadataByKey: ReturnType<typeof getEditorPluginInfoMetadataMap>,
  metadataByTitle: Map<string, EditorPluginInfoMetadata>,
  instances: Map<HTMLElement, Instance>,
): void {
  const activeElements = new Set<HTMLElement>()

  root
    .querySelectorAll<HTMLElement>(`.editor-block-tool-label[${toolAttribute}]`)
    .forEach((element) => {
      const key = element.getAttribute(toolAttribute)

      if (!isEditorPluginInfoCustomToolKey(key)) {
        return
      }

      activeElements.add(element)
      attachPluginInfoTooltip(element, metadataByKey[key], instances)
    })

  root.querySelectorAll<HTMLElement>('.ce-popover-item').forEach((element) => {
    const title = getToolboxItemTitle(element)
    const metadata = metadataByTitle.get(normalizeToolboxTitle(title))

    if (!metadata) {
      return
    }

    activeElements.add(element)
    attachPluginInfoTooltip(element, metadata, instances)
  })

  instances.forEach((instance, element) => {
    if (activeElements.has(element) && root.contains(element)) {
      return
    }

    instance.destroy()
    instances.delete(element)
  })
}

function attachPluginInfoTooltip(
  element: HTMLElement,
  metadata: EditorPluginInfoMetadata,
  instances: Map<HTMLElement, Instance>,
): void {
  element.setAttribute(tooltipAttribute, metadata.key)

  const existingInstance = instances.get(element)

  if (existingInstance) {
    return
  }

  const instance = tippy(element, {
    appendTo: () => document.body,
    aria: {
      content: 'describedby',
    },
    content: createTooltipContent(metadata),
    delay: [120, 140],
    duration: [120, 80],
    interactive: true,
    interactiveBorder: 12,
    maxWidth: 320,
    placement: 'right',
    theme: tooltipTheme,
    trigger: 'mouseenter focus',
  })

  instances.set(element, instance)
}

function createTooltipContent(
  metadata: EditorPluginInfoMetadata,
): HTMLDivElement {
  const root = document.createElement('div')
  const title = document.createElement('strong')
  const description = document.createElement('p')
  const preview = document.createElement('p')

  root.className = 'editor-plugin-info-tooltip'
  title.className = 'editor-plugin-info-tooltip__title'
  description.className = 'editor-plugin-info-tooltip__description'
  preview.className = 'editor-plugin-info-tooltip__preview'
  title.textContent = metadata.title
  description.textContent = metadata.description
  preview.textContent = metadata.preview
  root.append(title, description)

  if (metadata.previewImage) {
    const previewImage = metadata.previewImage
    const link = document.createElement('a')
    const image = document.createElement('img')

    link.className = 'editor-plugin-info-tooltip__image-link'
    link.href = previewImage.src
    link.setAttribute('aria-label', previewImage.alt)
    link.addEventListener('click', (event) => {
      event.preventDefault()
      Fancybox.show(
        [
          {
            src: previewImage.src,
            thumb: previewImage.src,
            caption: metadata.title,
            type: 'image',
          },
        ],
        {
          Hash: false,
        },
      )
    })
    image.className = 'editor-plugin-info-tooltip__image'
    image.src = previewImage.src
    image.alt = previewImage.alt
    image.loading = 'lazy'
    link.append(image)
    root.append(link)
  }

  root.append(preview)

  return root
}

function getToolboxItemTitle(element: HTMLElement): string {
  return (
    element
      .querySelector<HTMLElement>('.ce-popover-item__title')
      ?.textContent?.trim() ||
    element.textContent?.trim() ||
    ''
  )
}

function normalizeToolboxTitle(title: string): string {
  return title.trim().replace(/\s+/g, ' ').toLocaleLowerCase()
}
