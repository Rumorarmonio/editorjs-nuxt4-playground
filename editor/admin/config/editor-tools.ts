import type {
  EditorConfig,
  ToolConstructable,
} from '@editorjs/editorjs/types'

export async function createEditorTools(): Promise<EditorConfig['tools']> {
  const [
    { default: Header },
    { default: List },
    { default: Quote },
    { default: Delimiter },
    { default: Table },
    { default: Embed },
    { default: ImageTool },
  ] = await Promise.all([
    import('@editorjs/header'),
    import('@editorjs/list'),
    import('@editorjs/quote'),
    import('@editorjs/delimiter'),
    import('@editorjs/table'),
    import('@editorjs/embed'),
    import('@editorjs/image'),
  ])

  return {
    header: {
      class: Header as unknown as ToolConstructable,
      inlineToolbar: true,
      config: {
        levels: [1, 2, 3, 4],
        defaultLevel: 2,
      },
    },
    list: {
      class: List as unknown as ToolConstructable,
      inlineToolbar: true,
      config: {
        defaultStyle: 'unordered',
      },
    },
    quote: {
      class: Quote as unknown as ToolConstructable,
      inlineToolbar: true,
      config: {
        quotePlaceholder: 'Enter a quote',
        captionPlaceholder: 'Quote caption',
      },
    },
    delimiter: Delimiter as unknown as ToolConstructable,
    table: {
      class: Table as unknown as ToolConstructable,
      inlineToolbar: true,
      config: {
        rows: 2,
        cols: 3,
      },
    },
    embed: {
      class: Embed as unknown as ToolConstructable,
      inlineToolbar: false,
    },
    image: {
      class: ImageTool as unknown as ToolConstructable,
      config: {
        uploader: {
          uploadByFile: uploadLocalImageByFile,
          uploadByUrl: uploadLocalImageByUrl,
        },
      },
    },
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
