import type { CustomBlockDataMap } from '~~/editor/shared/blocks/custom-block-data'
import type { StandardBlockDataMap } from '~~/editor/shared/blocks/standard-block-data'
import type {
  EditorBlockFromDataMapByType,
  EditorBlockFromDataMap,
  EditorBlockRegistry,
} from '~~/editor/shared/registry/types'

export const editorBlockRegistry = {
  paragraph: {
    type: 'paragraph',
    title: 'Paragraph',
    isDefault: true,
  },
  header: {
    type: 'header',
    title: 'Header',
  },
  list: {
    type: 'list',
    title: 'List',
  },
  quote: {
    type: 'quote',
    title: 'Quote',
  },
  delimiter: {
    type: 'delimiter',
    title: 'Delimiter',
  },
  table: {
    type: 'table',
    title: 'Table',
  },
  embed: {
    type: 'embed',
    title: 'Embed',
  },
  image: {
    type: 'image',
    title: 'Image',
  },
  notice: {
    type: 'notice',
    title: 'Notice',
  },
  sectionIntro: {
    type: 'sectionIntro',
    title: 'Section intro',
  },
  twoColumns: {
    type: 'twoColumns',
    title: 'Two columns',
  },
  mediaGallery: {
    type: 'mediaGallery',
    title: 'Media gallery',
  },
} as const satisfies EditorBlockRegistry<keyof EditorBlockDataMap & string>

export type EditorBlockType = keyof typeof editorBlockRegistry

export type EditorBlockDataMap = StandardBlockDataMap & CustomBlockDataMap

export type EditorBlock<
  TType extends EditorBlockType = EditorBlockType,
> = EditorBlockFromDataMapByType<EditorBlockDataMap, TType>

export type EditorContentBlock = EditorBlockFromDataMap<EditorBlockDataMap>
