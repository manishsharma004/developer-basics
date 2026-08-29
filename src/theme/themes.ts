export type ThemeId =
  | 'midnight'
  | 'light'
  | 'nord'
  | 'dracula'
  | 'terminal'
  | 'solarized-dark'
  | 'solarized-light'
  | 'monokai'
  | 'one-dark'
  | 'one-light'
  | 'gruvbox-dark'
  | 'gruvbox-light'
  | 'tokyo-night'
  | 'catppuccin-mocha'
  | 'catppuccin-latte'
  | 'github-dark'
  | 'github-light'
  | 'ayu-dark'
  | 'ayu-light'
  | 'rose-pine'
  | 'night-owl'
  | 'synthwave'
  | 'cobalt'
  | 'palenight'
  | 'everforest-dark'
  | 'everforest-light'
  | 'kanagawa'
  | 'poimandres'
  | 'material-darker'
  | 'flexoki-dark'
  | 'flexoki-light'
  | 'horizon'
  | 'vesper'
  | 'shades-of-purple'

export type ThemeMode = 'dark' | 'light'

/** Stored in localStorage; `system` follows OS light/dark via prefers-color-scheme. */
export type ThemePreference = ThemeId | 'system'

export const SYSTEM_LIGHT_THEME: ThemeId = 'light'
export const SYSTEM_DARK_THEME: ThemeId = 'midnight'

export interface ThemeOption {
  id: ThemeId
  label: string
  swatch: string
  mode: ThemeMode
}

export function resolveTheme(preference: ThemePreference, prefersDark = true): ThemeId {
  if (preference === 'system') return prefersDark ? SYSTEM_DARK_THEME : SYSTEM_LIGHT_THEME
  if (THEMES.some((t) => t.id === preference)) return preference
  return SYSTEM_DARK_THEME
}

// A broad catalog of popular editor/IDE themes. `midnight` is the :root default;
// every other id has a matching [data-theme='id'] block in index.css.
export const THEMES: ThemeOption[] = [
  { id: 'midnight', label: 'Midnight', swatch: '#38bdf8', mode: 'dark' },
  { id: 'light', label: 'Light', swatch: '#0284c7', mode: 'light' },
  { id: 'nord', label: 'Nord', swatch: '#88c0d0', mode: 'dark' },
  { id: 'dracula', label: 'Dracula', swatch: '#bd93f9', mode: 'dark' },
  { id: 'terminal', label: 'Terminal', swatch: '#22c55e', mode: 'dark' },
  { id: 'solarized-dark', label: 'Solarized Dark', swatch: '#268bd2', mode: 'dark' },
  { id: 'solarized-light', label: 'Solarized Light', swatch: '#b58900', mode: 'light' },
  { id: 'monokai', label: 'Monokai', swatch: '#a6e22e', mode: 'dark' },
  { id: 'one-dark', label: 'One Dark', swatch: '#61afef', mode: 'dark' },
  { id: 'one-light', label: 'One Light', swatch: '#4078f2', mode: 'light' },
  { id: 'gruvbox-dark', label: 'Gruvbox Dark', swatch: '#fabd2f', mode: 'dark' },
  { id: 'gruvbox-light', label: 'Gruvbox Light', swatch: '#b57614', mode: 'light' },
  { id: 'tokyo-night', label: 'Tokyo Night', swatch: '#7aa2f7', mode: 'dark' },
  { id: 'catppuccin-mocha', label: 'Catppuccin Mocha', swatch: '#cba6f7', mode: 'dark' },
  { id: 'catppuccin-latte', label: 'Catppuccin Latte', swatch: '#8839ef', mode: 'light' },
  { id: 'github-dark', label: 'GitHub Dark', swatch: '#58a6ff', mode: 'dark' },
  { id: 'github-light', label: 'GitHub Light', swatch: '#0969da', mode: 'light' },
  { id: 'ayu-dark', label: 'Ayu Dark', swatch: '#ffb454', mode: 'dark' },
  { id: 'ayu-light', label: 'Ayu Light', swatch: '#ff9940', mode: 'light' },
  { id: 'rose-pine', label: 'Rosé Pine', swatch: '#c4a7e7', mode: 'dark' },
  { id: 'night-owl', label: 'Night Owl', swatch: '#82aaff', mode: 'dark' },
  { id: 'synthwave', label: "Synthwave '84", swatch: '#ff7edb', mode: 'dark' },
  { id: 'cobalt', label: 'Cobalt2', swatch: '#ffc600', mode: 'dark' },
  { id: 'palenight', label: 'Palenight', swatch: '#c792ea', mode: 'dark' },
  { id: 'everforest-dark', label: 'Everforest Dark', swatch: '#a7c080', mode: 'dark' },
  { id: 'everforest-light', label: 'Everforest Light', swatch: '#8da101', mode: 'light' },
  { id: 'kanagawa', label: 'Kanagawa', swatch: '#7e9cd8', mode: 'dark' },
  { id: 'poimandres', label: 'Poimandres', swatch: '#d0679d', mode: 'dark' },
  { id: 'material-darker', label: 'Material Darker', swatch: '#82aaff', mode: 'dark' },
  { id: 'flexoki-dark', label: 'Flexoki Dark', swatch: '#4385be', mode: 'dark' },
  { id: 'flexoki-light', label: 'Flexoki Light', swatch: '#205ea6', mode: 'light' },
  { id: 'horizon', label: 'Horizon', swatch: '#e95678', mode: 'dark' },
  { id: 'vesper', label: 'Vesper', swatch: '#ffc799', mode: 'dark' },
  { id: 'shades-of-purple', label: 'Shades of Purple', swatch: '#fad000', mode: 'dark' },
]
