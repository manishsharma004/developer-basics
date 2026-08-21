import { useState, type CSSProperties } from 'react'
import { CodePreview } from '../../components/CodePreview.tsx'

const PRESETS = {
  light: {
    '--demo-bg': '#ffffff',
    '--demo-text': '#10203a',
    '--demo-accent': '#0284c7',
  },
  dark: {
    '--demo-bg': '#111a2e',
    '--demo-text': '#e6edf7',
    '--demo-accent': '#38bdf8',
  },
  terminal: {
    '--demo-bg': '#05100a',
    '--demo-text': '#c6f7d8',
    '--demo-accent': '#22c55e',
  },
} as const

export function ThemePlayground() {
  const [preset, setPreset] = useState<keyof typeof PRESETS>('dark')
  const vars = PRESETS[preset]

  return (
    <div className="panel css-lab">
      <div className="panel-title">CSS variables & themes</div>
      <p className="panel-hint">
        This app uses the same idea: <code>data-theme</code> on <code>&lt;html&gt;</code> swaps
        palette variables in <code>index.css</code>.
      </p>
      <div className="proc-actions">
        {(Object.keys(PRESETS) as (keyof typeof PRESETS)[]).map((key) => (
          <button
            key={key}
            type="button"
            className={`btn${preset === key ? '' : ' btn--ghost'}`}
            onClick={() => setPreset(key)}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="css-lab-theme-card" style={vars as CSSProperties}>
        <div className="css-lab-theme-title">Card title</div>
        <p className="css-lab-theme-body">
          Background and text come from <code>var(--demo-bg)</code> and{' '}
          <code>var(--demo-text)</code>. Change the preset — tokens update everywhere.
        </p>
        <button type="button" className="css-lab-theme-btn">
          Accent button
        </button>
      </div>
      <CodePreview
        language="css"
        code={`:root, [data-theme="${preset}"] {
  --demo-bg: ${vars['--demo-bg']};
  --demo-text: ${vars['--demo-text']};
  --demo-accent: ${vars['--demo-accent']};
}`}
        minLines={5}
      />
    </div>
  )
}
