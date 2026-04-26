export const noticeBlockTypes = ['info', 'success', 'warning'] as const

export type NoticeBlockType = (typeof noticeBlockTypes)[number]

export interface NoticeBlockData {
  title: string
  text: string
  type: NoticeBlockType
}

export interface CustomBlockDataMap {
  notice: NoticeBlockData
}

export function normalizeNoticeBlockData(value: unknown): NoticeBlockData {
  if (!isRecord(value)) {
    return createDefaultNoticeBlockData()
  }

  return {
    title: typeof value.title === 'string' ? value.title : '',
    text: typeof value.text === 'string' ? value.text : '',
    type: isNoticeBlockType(value.type) ? value.type : 'info',
  }
}

export function isNoticeBlockData(value: unknown): value is NoticeBlockData {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.title === 'string' &&
    typeof value.text === 'string' &&
    isNoticeBlockType(value.type)
  )
}

function createDefaultNoticeBlockData(): NoticeBlockData {
  return {
    title: '',
    text: '',
    type: 'info',
  }
}

function isNoticeBlockType(value: unknown): value is NoticeBlockType {
  return noticeBlockTypes.includes(value as NoticeBlockType)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
