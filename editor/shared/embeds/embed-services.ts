import type { EmbedBlockData } from '~~/editor/shared/blocks/standard-block-data'

interface EmbedServiceDefinition {
  service: string
  label: string
  width: number
  height: number
  createEmbedUrl(sourceUrl: URL): string | null
  isAllowedEmbedUrl(embedUrl: URL): boolean
}

export const supportedEmbedServices = [
  {
    service: 'youtube',
    label: 'YouTube',
    width: 580,
    height: 320,
    createEmbedUrl(sourceUrl) {
      const videoId = getYoutubeVideoId(sourceUrl)

      return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    },
    isAllowedEmbedUrl(embedUrl) {
      return (
        embedUrl.protocol === 'https:' &&
        embedUrl.hostname === 'www.youtube.com' &&
        /^\/embed\/[a-zA-Z0-9_-]{11}$/.test(embedUrl.pathname)
      )
    },
  },
  {
    service: 'vimeo',
    label: 'Vimeo',
    width: 580,
    height: 320,
    createEmbedUrl(sourceUrl) {
      const videoId = getVimeoVideoId(sourceUrl)

      return videoId
        ? `https://player.vimeo.com/video/${videoId}?title=0&byline=0`
        : null
    },
    isAllowedEmbedUrl(embedUrl) {
      return (
        embedUrl.protocol === 'https:' &&
        embedUrl.hostname === 'player.vimeo.com' &&
        /^\/video\/\d+$/.test(embedUrl.pathname)
      )
    },
  },
  {
    service: 'coub',
    label: 'Coub',
    width: 580,
    height: 320,
    createEmbedUrl(sourceUrl) {
      const coubId = getCoubId(sourceUrl)

      return coubId ? `https://coub.com/embed/${coubId}` : null
    },
    isAllowedEmbedUrl(embedUrl) {
      return (
        embedUrl.protocol === 'https:' &&
        embedUrl.hostname === 'coub.com' &&
        /^\/embed\/[a-zA-Z0-9_-]+$/.test(embedUrl.pathname)
      )
    },
  },
] satisfies EmbedServiceDefinition[]

export const supportedEmbedServiceLabels = supportedEmbedServices
  .map((service) => service.label)
  .join(', ')

export function createEmbedDataFromSource(
  value: string,
): EmbedBlockData | null {
  const source = value.trim()

  if (!source) {
    return null
  }

  try {
    const sourceUrl = new URL(source)

    for (const service of supportedEmbedServices) {
      const embed = service.createEmbedUrl(sourceUrl)

      if (!embed) {
        continue
      }

      return {
        service: service.service,
        source,
        embed,
        width: service.width,
        height: service.height,
        caption: '',
      }
    }
  } catch {
    return null
  }

  return null
}

export function getAllowedEmbedIframeUrl(
  data: EmbedBlockData,
): string | null {
  const service = supportedEmbedServices.find(
    (item) => item.service === data.service,
  )

  if (!service) {
    return null
  }

  try {
    const embedUrl = new URL(data.embed)

    return service.isAllowedEmbedUrl(embedUrl) ? embedUrl.toString() : null
  } catch {
    return null
  }
}

function getYoutubeVideoId(sourceUrl: URL): string | null {
  if (sourceUrl.hostname === 'youtu.be') {
    return normalizeYoutubeVideoId(sourceUrl.pathname.slice(1))
  }

  if (!isHostnameOrSubdomain(sourceUrl.hostname, 'youtube.com')) {
    return null
  }

  const watchId = sourceUrl.searchParams.get('v')

  if (watchId) {
    return normalizeYoutubeVideoId(watchId)
  }

  const pathMatch = sourceUrl.pathname.match(
    /^\/(?:embed|shorts|v)\/([a-zA-Z0-9_-]{11})/,
  )

  return pathMatch?.[1] ? normalizeYoutubeVideoId(pathMatch[1]) : null
}

function normalizeYoutubeVideoId(value: string): string | null {
  const [videoId = ''] = value.split(/[?&/]/)

  return /^[a-zA-Z0-9_-]{11}$/.test(videoId) ? videoId : null
}

function getVimeoVideoId(sourceUrl: URL): string | null {
  if (sourceUrl.hostname === 'player.vimeo.com') {
    const pathMatch = sourceUrl.pathname.match(/^\/video\/(\d+)/)

    return pathMatch?.[1] ?? null
  }

  if (!isHostnameOrSubdomain(sourceUrl.hostname, 'vimeo.com')) {
    return null
  }

  const pathMatch = sourceUrl.pathname.match(/^\/(?:.*\/)?(\d+)/)

  return pathMatch?.[1] ?? null
}

function getCoubId(sourceUrl: URL): string | null {
  if (
    sourceUrl.hostname !== 'coub.com' &&
    sourceUrl.hostname !== 'www.coub.com'
  ) {
    return null
  }

  const pathMatch = sourceUrl.pathname.match(
    /^\/(?:view|embed)\/([a-zA-Z0-9_-]+)/,
  )

  return pathMatch?.[1] ?? null
}

function isHostnameOrSubdomain(hostname: string, domain: string): boolean {
  return hostname === domain || hostname.endsWith(`.${domain}`)
}
