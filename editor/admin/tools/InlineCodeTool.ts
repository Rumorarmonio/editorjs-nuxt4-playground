import InlineCode from '@editorjs/inline-code'
import type { API, InlineToolConstructorOptions } from '@editorjs/editorjs'

const inlineCodeTag = 'CODE'
const inlineCodeClassName = 'inline-code'
const inlineCodeSelector = `${inlineCodeTag.toLowerCase()}.${inlineCodeClassName}`

export default class InlineCodeTool extends InlineCode {
  private readonly editorApi: API

  constructor(options: InlineToolConstructorOptions) {
    super(options)
    this.editorApi = options.api
  }

  override surround(range: Range | null): void {
    if (!range || range.collapsed) {
      return
    }

    const codeWrapper = this.editorApi.selection.findParentTag(
      inlineCodeTag,
      inlineCodeClassName,
    )

    if (codeWrapper) {
      this.unwrap(codeWrapper)
      return
    }

    if (range.cloneContents().querySelector(inlineCodeSelector)) {
      return
    }

    this.wrap(range)
  }
}
