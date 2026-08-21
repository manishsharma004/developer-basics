import type * as Monaco from 'monaco-editor'
import { THEMES, type ThemeId } from '../../theme/themes.ts'
import { normalizeMonacoHexColor } from './monacoColors.ts'

export const MONACO_THEME_DARK = 'developer-basics-dark'
export const MONACO_THEME_LIGHT = 'developer-basics-light'

let initialized = false
let monacoPromise: Promise<typeof Monaco> | null = null

export function getMonacoThemeId(themeId: ThemeId): string {
  const mode = THEMES.find((t) => t.id === themeId)?.mode ?? 'dark'
  return mode === 'light' ? MONACO_THEME_LIGHT : MONACO_THEME_DARK
}

function cssVar(name: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return normalizeMonacoHexColor(value || fallback, fallback)
}

function ensureWorkerEnvironment(): void {
  if (globalThis.MonacoEnvironment) return
  globalThis.MonacoEnvironment = {
    getWorker(_: string, label: string) {
      if (label === 'typescript' || label === 'javascript') {
        return new Worker(
          new URL('monaco-editor/esm/vs/language/typescript/ts.worker.js', import.meta.url),
          { type: 'module' },
        )
      }
      return new Worker(
        new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url),
        { type: 'module' },
      )
    },
  }
}

const DARK_TOKEN_RULES: Monaco.editor.ITokenThemeRule[] = [
  { token: 'keyword', foreground: 'C586C0' },
  { token: 'attribute.name', foreground: '9CDCFE' },
  { token: 'type.identifier', foreground: '4EC9B0' },
  { token: 'string', foreground: 'CE9178' },
  { token: 'number', foreground: 'B5CEA8' },
  { token: 'comment', foreground: '6A9955' },
]

const LIGHT_TOKEN_RULES: Monaco.editor.ITokenThemeRule[] = [
  { token: 'keyword', foreground: 'AF00DB' },
  { token: 'attribute.name', foreground: '0451A5' },
  { token: 'type.identifier', foreground: '267F99' },
  { token: 'string', foreground: 'A31515' },
  { token: 'number', foreground: '098658' },
  { token: 'comment', foreground: '6A9955' },
]

function registerBaseThemes(monaco: typeof Monaco): void {
  monaco.editor.defineTheme(MONACO_THEME_DARK, {
    base: 'vs-dark',
    inherit: true,
    rules: DARK_TOKEN_RULES,
    colors: {
      'editor.background': '#060b16',
      'editor.foreground': '#e6edf7',
      'editorGutter.background': '#060b16',
      'editorLineNumber.foreground': '#5e677d',
      'editorLineNumber.activeForeground': '#c9d4ee',
      'editorCursor.foreground': '#38bdf8',
      'editor.selectionBackground': '#264f78',
      'editor.lineHighlightBackground': '#111a2e',
      'editorIndentGuide.background1': '#263450',
      'editorWidget.background': '#111a2e',
      'editorWidget.border': '#263450',
      'scrollbarSlider.background': '#3a4252aa',
    },
  })

  monaco.editor.defineTheme(MONACO_THEME_LIGHT, {
    base: 'vs',
    inherit: true,
    rules: LIGHT_TOKEN_RULES,
    colors: {
      'editor.background': '#0b1324',
      'editor.foreground': '#e6edf7',
      'editorGutter.background': '#0b1324',
      'editorLineNumber.foreground': '#7a8aa3',
      'editorLineNumber.activeForeground': '#cdd7ea',
      'editorCursor.foreground': '#0284c7',
      'editor.selectionBackground': '#1e3a5f',
      'editor.lineHighlightBackground': '#0f1a30',
      'editorIndentGuide.background1': '#263450',
      'editorWidget.background': '#0b1324',
      'editorWidget.border': '#263450',
      'scrollbarSlider.background': '#3a425288',
    },
  })
}

export function applyMonacoTheme(monaco: typeof Monaco, themeId: ThemeId): void {
  const isLight = THEMES.find((t) => t.id === themeId)?.mode === 'light'
  const themeName = getMonacoThemeId(themeId)
  const editorBg = cssVar('--code-bg', isLight ? '#0b1324' : '#060b16')
  const editorFg = cssVar('--text', isLight ? '#10203a' : '#e6edf7')
  const gutterBg = cssVar('--code-bg', editorBg)
  const muted = cssVar('--muted', isLight ? '#5a6b86' : '#93a4c3')
  const accent = cssVar('--accent', isLight ? '#0284c7' : '#38bdf8')
  const panel = cssVar('--panel-2', isLight ? '#eef2f9' : '#1b2947')
  const border = cssVar('--border', isLight ? '#d6deea' : '#263450')
  const widgetBg = cssVar('--panel', isLight ? '#ffffff' : '#16213a')

  monaco.editor.defineTheme(themeName, {
    base: isLight ? 'vs' : 'vs-dark',
    inherit: true,
    rules: isLight ? LIGHT_TOKEN_RULES : DARK_TOKEN_RULES,
    colors: {
      'editor.background': editorBg,
      'editor.foreground': editorFg,
      'editorGutter.background': gutterBg,
      'editorLineNumber.foreground': muted,
      'editorLineNumber.activeForeground': editorFg,
      'editorCursor.foreground': accent,
      'editor.selectionBackground': panel,
      'editor.inactiveSelectionBackground': border,
      'editor.lineHighlightBackground': panel,
      'editor.lineHighlightBorder': '#00000000',
      'editorIndentGuide.background1': border,
      'editorIndentGuide.activeBackground1': muted,
      'editorBracketMatch.background': panel,
      'editorBracketMatch.border': accent,
      'editorSuggestWidget.background': widgetBg,
      'editorSuggestWidget.border': border,
      'editorSuggestWidget.selectedBackground': panel,
      'editorHoverWidget.background': widgetBg,
      'editorHoverWidget.border': border,
      'editorWidget.background': widgetBg,
      'editorWidget.border': border,
      'scrollbar.shadow': '#00000000',
      'scrollbarSlider.background': isLight ? '#94a3b866' : '#3a4252aa',
      'scrollbarSlider.hoverBackground': isLight ? '#64748b99' : '#4b5568cc',
      'scrollbarSlider.activeBackground': isLight ? '#475569cc' : '#677285dd',
    },
  })
  monaco.editor.setTheme(themeName)
}

async function initialize(): Promise<typeof Monaco> {
  if (monacoPromise) return monacoPromise

  monacoPromise = (async () => {
    const [monaco] = await Promise.all([
      import('monaco-editor/esm/vs/editor/editor.api.js'),
      import('monaco-editor/esm/vs/basic-languages/python/python.contribution.js'),
      import('monaco-editor/esm/vs/basic-languages/sql/sql.contribution.js'),
      import('monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution.js'),
      import('monaco-editor/esm/vs/basic-languages/css/css.contribution.js'),
      import('monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution.js'),
      import('monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution.js'),
    ])
    ensureWorkerEnvironment()
    if (!initialized) {
      registerBaseThemes(monaco)
      initialized = true
    }
    return monaco
  })()

  return monacoPromise
}

export function getMonaco(): Promise<typeof Monaco> {
  return initialize()
}

declare global {
  // eslint-disable-next-line no-var
  var MonacoEnvironment: {
    getWorker: (workerId: string, label: string) => Worker
  } | undefined
}
