import type { KeyboardEvent } from 'react'

const INDENT = '  ' // two spaces

// Capture the Tab key inside a controlled <textarea> so it inserts indentation
// instead of moving focus out of the editor. Shift+Tab removes up to one indent
// before the caret. Works with React controlled state via the provided setter.
export function handleEditorTab(
  e: KeyboardEvent<HTMLTextAreaElement>,
  value: string,
  setValue: (next: string) => void,
): void {
  if (e.key !== 'Tab') return
  e.preventDefault()

  const el = e.currentTarget
  const start = el.selectionStart
  const end = el.selectionEnd

  if (e.shiftKey) {
    // Outdent: remove up to INDENT.length spaces immediately before the caret.
    const before = value.slice(0, start)
    const removable = before.length - before.replace(/ {1,2}$/, '').length
    if (removable === 0) return
    const next = value.slice(0, start - removable) + value.slice(start)
    setValue(next)
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start - removable
    })
    return
  }

  const next = value.slice(0, start) + INDENT + value.slice(end)
  setValue(next)
  requestAnimationFrame(() => {
    el.selectionStart = el.selectionEnd = start + INDENT.length
  })
}
