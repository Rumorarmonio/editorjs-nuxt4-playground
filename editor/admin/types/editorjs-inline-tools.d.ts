declare module '@sotaproject/strikethrough' {
  import type { ToolConstructable } from '@editorjs/editorjs/types'

  const Strikethrough: ToolConstructable

  export default Strikethrough
}

declare module '@editorjs/raw' {
  import type { ToolConstructable } from '@editorjs/editorjs/types'

  const RawTool: ToolConstructable

  export default RawTool
}
