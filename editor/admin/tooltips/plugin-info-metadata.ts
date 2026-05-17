import type { EditorUiMessages } from '~~/i18n'

export const editorPluginInfoStandardToolKeys = [
  'paragraph',
  'header',
  'list',
  'unorderedList',
  'orderedList',
  'checklist',
  'quote',
  'delimiter',
  'table',
  'embed',
  'image',
  'rawHtml',
] as const

export const editorPluginInfoCustomToolKeys = [
  'notice',
  'sectionIntro',
  'twoColumns',
  'mediaGallery',
  'maskedFieldsDemo',
  'cta',
  'codeSnippet',
] as const

export const editorPluginInfoToolKeys = [
  ...editorPluginInfoStandardToolKeys,
  ...editorPluginInfoCustomToolKeys,
] as const

export type EditorPluginInfoToolKey =
  (typeof editorPluginInfoToolKeys)[number]

export type EditorPluginInfoCustomToolKey =
  (typeof editorPluginInfoCustomToolKeys)[number]

export interface EditorPluginInfoMetadata {
  key: EditorPluginInfoToolKey
  title: string
  description: string
  preview: string
  previewImage?: EditorPluginInfoPreviewImage
}

export interface EditorPluginInfoPreviewImage {
  src: string
  alt: string
}

export type EditorPluginInfoMetadataMap = Record<
  EditorPluginInfoToolKey,
  EditorPluginInfoMetadata
>

const editorPluginInfoPreviewImageSrcByKey: Partial<
  Record<EditorPluginInfoToolKey, string>
> = {
  paragraph: '/plugin-previews/paragraph.jpg',
  header: '/plugin-previews/header.jpg',
  unorderedList: '/plugin-previews/unordered-list.jpg',
  orderedList: '/plugin-previews/ordered-list.jpg',
  checklist: '/plugin-previews/checklist.jpg',
  quote: '/plugin-previews/quote.jpg',
  delimiter: '/plugin-previews/delimiter.jpg',
  table: '/plugin-previews/table.jpg',
  embed: '/plugin-previews/embed.jpg',
  image: '/plugin-previews/image.jpg',
  rawHtml: '/plugin-previews/raw-html.jpg',
  notice: '/plugin-previews/notice.jpg',
  sectionIntro: '/plugin-previews/section-intro.jpg',
  twoColumns: '/plugin-previews/two-columns.jpg',
  mediaGallery: '/plugin-previews/media-gallery.jpg',
  maskedFieldsDemo: '/plugin-previews/masked-fields-demo.jpg',
  cta: '/plugin-previews/cta.jpg',
  codeSnippet: '/plugin-previews/code-snippet.jpg',
}

export function getEditorPluginInfoMetadataMap(
  messages: EditorUiMessages,
): EditorPluginInfoMetadataMap {
  return {
    paragraph: withResolvedPreviewImage({
      key: 'paragraph',
      ...messages.pluginInfo.standardTools.paragraph,
    }),
    header: withResolvedPreviewImage({
      key: 'header',
      ...messages.pluginInfo.standardTools.header,
    }),
    list: withResolvedPreviewImage({
      key: 'list',
      ...messages.pluginInfo.standardTools.list,
    }),
    unorderedList: withResolvedPreviewImage({
      key: 'unorderedList',
      ...messages.pluginInfo.standardTools.unorderedList,
    }),
    orderedList: withResolvedPreviewImage({
      key: 'orderedList',
      ...messages.pluginInfo.standardTools.orderedList,
    }),
    checklist: withResolvedPreviewImage({
      key: 'checklist',
      ...messages.pluginInfo.standardTools.checklist,
    }),
    quote: withResolvedPreviewImage({
      key: 'quote',
      ...messages.pluginInfo.standardTools.quote,
    }),
    delimiter: withResolvedPreviewImage({
      key: 'delimiter',
      ...messages.pluginInfo.standardTools.delimiter,
    }),
    table: withResolvedPreviewImage({
      key: 'table',
      ...messages.pluginInfo.standardTools.table,
    }),
    embed: withResolvedPreviewImage({
      key: 'embed',
      ...messages.pluginInfo.standardTools.embed,
    }),
    image: withResolvedPreviewImage({
      key: 'image',
      ...messages.pluginInfo.standardTools.image,
    }),
    rawHtml: withResolvedPreviewImage({
      key: 'rawHtml',
      ...messages.pluginInfo.standardTools.rawHtml,
    }),
    notice: withResolvedPreviewImage({
      key: 'notice',
      title: messages.tools.notice.toolboxTitle,
      ...messages.pluginInfo.tools.notice,
    }),
    sectionIntro: withResolvedPreviewImage({
      key: 'sectionIntro',
      title: messages.tools.sectionIntro.toolboxTitle,
      ...messages.pluginInfo.tools.sectionIntro,
    }),
    twoColumns: withResolvedPreviewImage({
      key: 'twoColumns',
      title: messages.tools.twoColumns.toolboxTitle,
      ...messages.pluginInfo.tools.twoColumns,
    }),
    mediaGallery: withResolvedPreviewImage({
      key: 'mediaGallery',
      title: messages.tools.mediaGallery.toolboxTitle,
      ...messages.pluginInfo.tools.mediaGallery,
    }),
    maskedFieldsDemo: withResolvedPreviewImage({
      key: 'maskedFieldsDemo',
      title: messages.tools.maskedFieldsDemo.toolboxTitle,
      ...messages.pluginInfo.tools.maskedFieldsDemo,
    }),
    cta: withResolvedPreviewImage({
      key: 'cta',
      title: messages.tools.cta.toolboxTitle,
      ...messages.pluginInfo.tools.cta,
    }),
    codeSnippet: withResolvedPreviewImage({
      key: 'codeSnippet',
      title: messages.tools.codeSnippet.toolboxTitle,
      ...messages.pluginInfo.tools.codeSnippet,
    }),
  }
}

export function isEditorPluginInfoCustomToolKey(
  value: string | null,
): value is EditorPluginInfoCustomToolKey {
  return editorPluginInfoCustomToolKeys.includes(
    value as EditorPluginInfoCustomToolKey,
  )
}

function withResolvedPreviewImage(
  metadata: EditorPluginInfoMetadata,
): EditorPluginInfoMetadata {
  const sharedPreviewImageSrc = editorPluginInfoPreviewImageSrcByKey[metadata.key]
  const previewImageSrc = metadata.previewImage?.src ?? sharedPreviewImageSrc

  if (!previewImageSrc) {
    return metadata
  }

  return {
    ...metadata,
    previewImage: {
      src: previewImageSrc,
      alt: metadata.previewImage?.alt ?? metadata.title,
    },
  }
}
