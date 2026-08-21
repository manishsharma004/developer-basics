import { MonacoEditor } from './MonacoEditor.tsx'

export type CodeLanguage = 'python' | 'javascript' | 'css' | 'sql' | 'json' | 'plaintext'

export interface CodePreviewProps {
  code: string
  language?: CodeLanguage
  minLines?: number
  ariaLabel?: string
}

/** Read-only syntax-highlighted code block for lesson examples. */
export function CodePreview({
  code,
  language = 'plaintext',
  minLines,
  ariaLabel = 'Code example',
}: CodePreviewProps) {
  const lineCount = code.trimEnd().split('\n').length
  const lines = minLines ?? Math.min(Math.max(lineCount, 3), 28)

  return (
    <div className="code-preview">
      <MonacoEditor
        value={code.trimEnd()}
        onChange={() => {}}
        readOnly
        language={language}
        minLines={lines}
        ariaLabel={ariaLabel}
      />
    </div>
  )
}
