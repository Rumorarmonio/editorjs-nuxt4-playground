import Typograf from 'typograf'
import type {
  CtaBlockData,
  AccordionGroupBlockData,
  CodeSnippetBlockData,
  MediaGalleryBlockData,
  NoticeBlockData,
  SectionIntroBlockData,
  TwoColumnsBlockData,
} from '~~/editor/shared/blocks/custom-block-data'
import type {
  EmbedBlockData,
  HeaderBlockData,
  ImageBlockData,
  ListBlockData,
  ListBlockItem,
  ParagraphBlockData,
  QuoteBlockData,
  TableBlockData,
} from '~~/editor/shared/blocks/standard-block-data'
import type {
  EditorOutputBlock,
  EditorOutputData,
} from '~~/editor/shared/types/editor-output'
import type { EditorContentBlock } from '~~/editor/shared/registry/block-registry'
import type { EditorContentData } from '~~/editor/shared/types/content'

export type ContentTypographyLocale = 'ru' | 'en' | 'es'

const typografByLocale = new Map<ContentTypographyLocale, Typograf>()

export function typographEditorContentData(
  content: EditorContentData,
  locale: ContentTypographyLocale,
): EditorContentData {
  return {
    ...content,
    blocks: content.blocks.map((block) => typographContentBlock(block, locale)),
  }
}

function typographContentBlock(
  block: EditorContentBlock,
  locale: ContentTypographyLocale,
): EditorContentBlock {
  switch (block.type) {
    case 'paragraph':
      return {
        ...block,
        data: typographParagraphBlockData(block.data, locale),
      }
    case 'header':
      return {
        ...block,
        data: typographHeaderBlockData(block.data, locale),
      }
    case 'list':
      return {
        ...block,
        data: typographListBlockData(block.data, locale),
      }
    case 'quote':
      return {
        ...block,
        data: typographQuoteBlockData(block.data, locale),
      }
    case 'table':
      return {
        ...block,
        data: typographTableBlockData(block.data, locale),
      }
    case 'embed':
      return {
        ...block,
        data: typographEmbedBlockData(block.data, locale),
      }
    case 'image':
      return {
        ...block,
        data: typographImageBlockData(block.data, locale),
      }
    case 'dataCards':
      return block
    case 'notice':
      return {
        ...block,
        data: typographNoticeBlockData(block.data, locale),
      }
    case 'sectionIntro':
      return {
        ...block,
        data: typographSectionIntroBlockData(block.data, locale),
      }
    case 'twoColumns':
      return {
        ...block,
        data: typographTwoColumnsBlockData(block.data, locale),
      }
    case 'mediaGallery':
      return {
        ...block,
        data: typographMediaGalleryBlockData(block.data, locale),
      }
    case 'cta':
      return {
        ...block,
        data: typographCtaBlockData(block.data, locale),
      }
    case 'codeSnippet':
      return {
        ...block,
        data: typographCodeSnippetBlockData(block.data, locale),
      }
    case 'accordionGroup':
      return {
        ...block,
        data: typographAccordionGroupBlockData(block.data, locale),
      }
    case 'delimiter':
    case 'maskedFieldsDemo':
    case 'rawHtml':
      return block
  }
}

function typographNestedContentData<
  TData extends EditorOutputData<EditorOutputBlock>,
>(content: TData, locale: ContentTypographyLocale): TData {
  return {
    ...content,
    blocks: content.blocks.map((block) =>
      typographNestedContentBlock(block, locale),
    ),
  } as TData
}

function typographNestedContentBlock(
  block: EditorOutputBlock,
  locale: ContentTypographyLocale,
): EditorOutputBlock {
  switch (block.type) {
    case 'paragraph':
      return {
        ...block,
        data: typographParagraphBlockData(
          block.data as ParagraphBlockData,
          locale,
        ),
      }
    case 'header':
      return {
        ...block,
        data: typographHeaderBlockData(block.data as HeaderBlockData, locale),
      }
    case 'list':
      return {
        ...block,
        data: typographListBlockData(block.data as ListBlockData, locale),
      }
    case 'cta':
      return {
        ...block,
        data: typographCtaBlockData(block.data as CtaBlockData, locale),
      }
    case 'accordionGroup':
      return {
        ...block,
        data: typographAccordionGroupBlockData(
          block.data as AccordionGroupBlockData,
          locale,
        ),
      }
    default:
      return block
  }
}

function typographParagraphBlockData(
  data: ParagraphBlockData,
  locale: ContentTypographyLocale,
): ParagraphBlockData {
  return {
    ...data,
    text: typographInlineHtml(data.text, locale),
  }
}

function typographHeaderBlockData(
  data: HeaderBlockData,
  locale: ContentTypographyLocale,
): HeaderBlockData {
  return {
    ...data,
    text: typographInlineHtml(data.text, locale),
  }
}

function typographListBlockData(
  data: ListBlockData,
  locale: ContentTypographyLocale,
): ListBlockData {
  return {
    ...data,
    items: data.items.map((item) => typographListBlockItem(item, locale)),
  }
}

function typographListBlockItem(
  item: ListBlockItem,
  locale: ContentTypographyLocale,
): ListBlockItem {
  return {
    ...item,
    content: typographInlineHtml(item.content, locale),
    items: item.items.map((childItem) =>
      typographListBlockItem(childItem, locale),
    ),
  }
}

function typographQuoteBlockData(
  data: QuoteBlockData,
  locale: ContentTypographyLocale,
): QuoteBlockData {
  return {
    ...data,
    text: typographInlineHtml(data.text, locale),
    caption:
      data.caption === undefined
        ? undefined
        : typographInlineHtml(data.caption, locale),
  }
}

function typographTableBlockData(
  data: TableBlockData,
  locale: ContentTypographyLocale,
): TableBlockData {
  return {
    ...data,
    content: data.content.map((row) =>
      row.map((cell) => typographInlineHtml(cell, locale)),
    ),
  }
}

function typographEmbedBlockData(
  data: EmbedBlockData,
  locale: ContentTypographyLocale,
): EmbedBlockData {
  return {
    ...data,
    source: decodeUrlHtmlEntities(data.source),
    embed: decodeUrlHtmlEntities(data.embed),
    caption:
      data.caption === undefined
        ? undefined
        : typographInlineHtml(data.caption, locale),
  }
}

function typographImageBlockData(
  data: ImageBlockData,
  locale: ContentTypographyLocale,
): ImageBlockData {
  return {
    ...data,
    caption:
      data.caption === undefined
        ? undefined
        : typographInlineHtml(data.caption, locale),
  }
}

function typographNoticeBlockData(
  data: NoticeBlockData,
  locale: ContentTypographyLocale,
): NoticeBlockData {
  return {
    ...data,
    title: typographInlineHtml(data.title, locale),
    text: typographNestedContentData(data.text, locale),
  }
}

function typographSectionIntroBlockData(
  data: SectionIntroBlockData,
  locale: ContentTypographyLocale,
): SectionIntroBlockData {
  return {
    ...data,
    title: typographPlainText(data.title, locale),
    description: typographNestedContentData(data.description, locale),
  }
}

function typographTwoColumnsBlockData(
  data: TwoColumnsBlockData,
  locale: ContentTypographyLocale,
): TwoColumnsBlockData {
  return {
    ...data,
    left: typographNestedContentData(data.left, locale),
    right: typographNestedContentData(data.right, locale),
  }
}

function typographMediaGalleryBlockData(
  data: MediaGalleryBlockData,
  locale: ContentTypographyLocale,
): MediaGalleryBlockData {
  return {
    ...data,
    items: data.items.map((item) => ({
      ...item,
      caption: typographInlineHtml(item.caption, locale),
      description: typographNestedContentData(item.description, locale),
    })),
  }
}

function typographCtaBlockData(
  data: CtaBlockData,
  locale: ContentTypographyLocale,
): CtaBlockData {
  return {
    ...data,
    label: typographPlainText(data.label, locale),
  }
}

function typographCodeSnippetBlockData(
  data: CodeSnippetBlockData,
  locale: ContentTypographyLocale,
): CodeSnippetBlockData {
  return {
    ...data,
    caption: typographInlineHtml(data.caption, locale),
  }
}

function typographAccordionGroupBlockData(
  data: AccordionGroupBlockData,
  locale: ContentTypographyLocale,
): AccordionGroupBlockData {
  return {
    ...data,
    items: data.items.map((item) => ({
      ...item,
      header: typographNestedContentData(item.header, locale),
      body: typographNestedContentData(item.body, locale),
    })),
  }
}

function typographInlineHtml(
  value: string,
  locale: ContentTypographyLocale,
): string {
  if (!hasHtmlTag(value) || typeof document === 'undefined') {
    return typographPlainText(value, locale)
  }

  const template = document.createElement('template')

  template.innerHTML = value
  typographTextNodes(template.content, locale)

  return template.innerHTML.replaceAll('&nbsp;', '\u00a0')
}

function typographTextNodes(
  node: Node,
  locale: ContentTypographyLocale,
): void {
  Array.from(node.childNodes).forEach((childNode) => {
    if (childNode.nodeType === Node.TEXT_NODE) {
      childNode.textContent = typographPlainText(
        childNode.textContent ?? '',
        locale,
      )
      return
    }

    if (!(childNode instanceof HTMLElement) || shouldSkipElement(childNode)) {
      return
    }

    typographTextNodes(childNode, locale)
  })
}

function typographPlainText(
  value: string,
  locale: ContentTypographyLocale,
): string {
  if (!value) {
    return value
  }

  return typographTextSegments(value, locale)
}

function typographTextSegments(
  value: string,
  fallbackLocale: ContentTypographyLocale,
): string {
  const segments = value.match(/[^.!?…]+[.!?…]?\s*|[.!?…]+\s*/g)

  if (!segments) {
    return getTypograf(detectTypographyLocale(value, fallbackLocale)).execute(
      value,
    )
  }

  return segments
    .map((segment) =>
      getTypograf(detectTypographyLocale(segment, fallbackLocale)).execute(
        segment,
      ),
    )
    .join('')
}

function detectTypographyLocale(
  value: string,
  fallbackLocale: ContentTypographyLocale,
): ContentTypographyLocale {
  if (/[А-Яа-яЁё]/.test(value)) {
    return 'ru'
  }

  if (hasSpanishSignal(value)) {
    return 'es'
  }

  if (/[A-Za-z]/.test(value)) {
    return 'en'
  }

  return fallbackLocale
}

function hasSpanishSignal(value: string): boolean {
  if (/[ÁÉÍÓÚÜÑáéíóúüñ¿¡]/.test(value)) {
    return true
  }

  const normalizedValue = ` ${value.toLowerCase()} `

  return [
    ' el ',
    ' la ',
    ' los ',
    ' las ',
    ' de ',
    ' del ',
    ' que ',
    ' para ',
    ' con ',
    ' una ',
    ' uno ',
    ' voy ',
    ' casa ',
  ].filter((word) => normalizedValue.includes(word)).length >= 2
}

function getTypograf(locale: ContentTypographyLocale): Typograf {
  const cachedTypograf = typografByLocale.get(locale)

  if (cachedTypograf) {
    return cachedTypograf
  }

  const typograf = new Typograf({
    locale: getTypografLocale(locale),
    enableRule: 'common/nbsp/afterNumber',
    ruleFilter: (rule) => rule.group === 'nbsp',
  })

  typografByLocale.set(locale, typograf)

  return typograf
}

function getTypografLocale(locale: ContentTypographyLocale): string {
  if (locale === 'en') {
    return 'en-US'
  }

  return locale
}

function shouldSkipElement(element: HTMLElement): boolean {
  return (
    element.tagName === 'CODE' ||
    element.classList.contains('inline-code')
  )
}

function hasHtmlTag(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value)
}

function decodeUrlHtmlEntities(value: string): string {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&#38;', '&')
    .replaceAll('&#x26;', '&')
    .replaceAll('&#X26;', '&')
}
