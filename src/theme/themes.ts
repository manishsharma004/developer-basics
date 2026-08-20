export type ThemeId = 'midnight' | 'light' | 'nord' | 'dracula' | 'terminal'

export interface ThemeOption {
  id: ThemeId
  label: string
  swatch: string
}

export const THEMES: ThemeOption[] = [
  { id: 'midnight', label: 'Midnight', swatch: '#38bdf8' },
  { id: 'light', label: 'Light', swatch: '#0284c7' },
  { id: 'nord', label: 'Nord', swatch: '#88c0d0' },
  { id: 'dracula', label: 'Dracula', swatch: '#bd93f9' },
  { id: 'terminal', label: 'Terminal', swatch: '#22c55e' },
]
