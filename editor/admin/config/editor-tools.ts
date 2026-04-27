import type {
  EditorConfig,
  ToolConstructable,
} from '@editorjs/editorjs/types'
import { ManualEmbedToolConstructable } from '~~/editor/admin/tools/ManualEmbedTool'
import InlineCodeTool from '~~/editor/admin/tools/InlineCodeTool'
import { TextColorToolConstructable } from '~~/editor/admin/tools/TextColorTool'
import { AnchorTuneConstructable } from '~~/editor/admin/tunes/AnchorTune'
import { LabelTuneConstructable } from '~~/editor/admin/tunes/LabelTune'
import { SpacingTuneConstructable } from '~~/editor/admin/tunes/SpacingTune'
import { NoticeToolConstructable } from '~~/editor/admin/tools/blocks/NoticeTool'
import { SectionIntroToolConstructable } from '~~/editor/admin/tools/blocks/SectionIntroTool'
import { TwoColumnsToolConstructable } from '~~/editor/admin/tools/blocks/TwoColumnsTool'
import { MediaGalleryToolConstructable } from '~~/editor/admin/tools/blocks/MediaGalleryTool'
import { editorBlockTuneNames } from '~~/editor/shared'

export const editorInlineToolbar = [
  'bold',
  'italic',
  'link',
  'underline',
  'marker',
  'textColor',
  'strikethrough',
  'inlineCode',
] satisfies NonNullable<EditorConfig['inlineToolbar']>

export const editorBlockTunes = [...editorBlockTuneNames]

export async function createEditorTools(): Promise<EditorConfig['tools']> {
  const [
    { default: Header },
    { default: List },
    { default: Quote },
    { default: Delimiter },
    { default: Table },
    { default: ImageTool },
    { default: Marker },
    { default: Underline },
    { default: Strikethrough },
  ] = await Promise.all([
    import('@editorjs/header'),
    import('@editorjs/list'),
    import('@editorjs/quote'),
    import('@editorjs/delimiter'),
    import('@editorjs/table'),
    import('@editorjs/image'),
    import('@editorjs/marker'),
    import('@editorjs/underline'),
    import('@sotaproject/strikethrough'),
  ])

  return {
    header: {
      class: Header as unknown as ToolConstructable,
      inlineToolbar: editorInlineToolbar,
      config: {
        levels: [1, 2, 3, 4],
        defaultLevel: 2,
      },
    },
    list: {
      class: List as unknown as ToolConstructable,
      inlineToolbar: editorInlineToolbar,
      config: {
        defaultStyle: 'unordered',
      },
    },
    quote: {
      class: Quote as unknown as ToolConstructable,
      inlineToolbar: editorInlineToolbar,
      config: {
        quotePlaceholder: 'Enter a quote',
        captionPlaceholder: 'Quote caption',
      },
    },
    delimiter: Delimiter as unknown as ToolConstructable,
    table: {
      class: Table as unknown as ToolConstructable,
      inlineToolbar: editorInlineToolbar,
      config: {
        rows: 2,
        cols: 3,
      },
    },
    embed: {
      class: ManualEmbedToolConstructable,
      inlineToolbar: editorInlineToolbar,
      config: {
        services: {
          youtube: true,
          vimeo: true,
          coub: true,
        },
      },
    },
    image: {
      class: ImageTool as unknown as ToolConstructable,
      inlineToolbar: editorInlineToolbar,
      config: {
        uploader: {
          uploadByFile: uploadLocalImageByFile,
          uploadByUrl: uploadLocalImageByUrl,
        },
      },
    },
    notice: NoticeToolConstructable,
    sectionIntro: SectionIntroToolConstructable,
    twoColumns: TwoColumnsToolConstructable,
    mediaGallery: MediaGalleryToolConstructable,
    marker: {
      class: Marker as unknown as ToolConstructable,
      shortcut: 'CMD+SHIFT+M',
    },
    textColor: TextColorToolConstructable as unknown as ToolConstructable,
    underline: Underline as unknown as ToolConstructable,
    inlineCode: {
      class: InlineCodeTool as unknown as ToolConstructable,
      shortcut: 'CMD+SHIFT+C',
    },
    strikethrough: Strikethrough as unknown as ToolConstructable,
    anchor: AnchorTuneConstructable,
    spacing: SpacingTuneConstructable,
    label: LabelTuneConstructable,
  }
}

async function uploadLocalImageByFile(file: Blob) {
  const url = await readFileAsDataUrl(file)

  return {
    success: 1,
    file: {
      url,
    },
  }
}

async function uploadLocalImageByUrl(url: string) {
  return {
    success: 1,
    file: {
      url,
    },
  }
}

function readFileAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Image file could not be read.'))
    })

    reader.addEventListener('error', () => {
      reject(new Error('Image file could not be read.'))
    })

    reader.readAsDataURL(file)
  })
}
