import { useEffect, useRef, useState } from 'react'
import type * as Monaco from 'monaco-editor'
import { useTheme } from '../theme/ThemeContext.tsx'
import { applyMonacoTheme, getMonaco, getMonacoThemeId } from '../lib/editor/monaco.ts'

export interface MonacoEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  readOnly?: boolean
  minLines?: number
  ariaLabel?: string
  className?: string
}

export function MonacoEditor({
  value,
  onChange,
  language = 'python',
  readOnly = false,
  minLines = 4,
  ariaLabel = 'Code editor',
  className = '',
}: MonacoEditorProps) {
  const { theme } = useTheme()
  const hostRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null)
  const modelRef = useRef<Monaco.editor.ITextModel | null>(null)
  const monacoRef = useRef<typeof Monaco | null>(null)
  const onChangeRef = useRef(onChange)
  const [ready, setReady] = useState(false)

  onChangeRef.current = onChange

  const minHeight = `${Math.max(minLines, value.split('\n').length + 1) * 1.45 + 1.5}rem`

  useEffect(() => {
    let disposed = false

    void (async () => {
      const monaco = await getMonaco()
      if (disposed || !hostRef.current) return

      monacoRef.current = monaco
      const model = monaco.editor.createModel(value, language)
      modelRef.current = model

      const editor = monaco.editor.create(hostRef.current, {
        model,
        readOnly,
        domReadOnly: readOnly,
        theme: getMonacoThemeId(theme),
        automaticLayout: true,
        minimap: { enabled: false },
        lineNumbers: 'on',
        renderLineHighlight: readOnly ? 'none' : 'line',
        overviewRulerLanes: 0,
        glyphMargin: false,
        folding: false,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        contextmenu: !readOnly,
        fontSize: 13,
        fontFamily:
          "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        tabSize: 4,
        insertSpaces: true,
        renderWhitespace: 'selection',
        padding: { top: 8, bottom: 8 },
        scrollbar: {
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
        },
        ariaLabel,
      })
      editorRef.current = editor

      editor.onDidChangeModelContent(() => {
        onChangeRef.current(model.getValue())
      })

      applyMonacoTheme(monaco, theme)
      setReady(true)
    })()

    return () => {
      disposed = true
      editorRef.current?.dispose()
      editorRef.current = null
      modelRef.current?.dispose()
      modelRef.current = null
    }
    // Mount once; value/theme sync handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const monaco = monacoRef.current
    const editor = editorRef.current
    const model = modelRef.current
    if (!monaco || !editor || !model) return

    editor.updateOptions({
      readOnly,
      domReadOnly: readOnly,
      renderLineHighlight: readOnly ? 'none' : 'line',
    })

    if (model.getLanguageId() !== language) {
      monaco.editor.setModelLanguage(model, language)
    }
  }, [language, readOnly])

  useEffect(() => {
    const monaco = monacoRef.current
    if (!monaco) return
    applyMonacoTheme(monaco, theme)
  }, [theme])

  useEffect(() => {
    const model = modelRef.current
    if (!model || model.getValue() === value) return
    model.setValue(value)
  }, [value])

  return (
    <div
      className={`monaco-editor-host${ready ? ' monaco-editor-host--ready' : ''}${className ? ` ${className}` : ''}`}
      style={{ minHeight }}
      ref={hostRef}
      aria-label={ariaLabel}
    />
  )
}
