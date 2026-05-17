import type { EditorPluginInfoCustomToolKey } from '~~/editor/admin/tooltips/plugin-info-metadata'

export function createBlockToolLabel(
  toolKey: EditorPluginInfoCustomToolKey,
  title: string,
): HTMLSpanElement {
  const label = document.createElement('span')

  label.className = 'editor-block-tool-label'
  label.contentEditable = 'false'
  label.tabIndex = 0
  label.dataset.editorPluginInfoTool = toolKey
  label.textContent = title
  label.addEventListener('keydown', stopEditorKeydown)

  return label
}

function stopEditorKeydown(event: KeyboardEvent): void {
  event.stopPropagation()
}
