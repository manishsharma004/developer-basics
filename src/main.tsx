import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ExperienceProvider } from './experience/ExperienceContext.tsx'
import { ClassroomProvider } from './experience/ClassroomContext.tsx'
import { ProgressProvider } from './progress/ProgressContext.tsx'
import { ThemeProvider } from './theme/ThemeContext.tsx'
import { getPyodide } from './lib/pyodide.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ExperienceProvider>
        <ClassroomProvider>
          <ProgressProvider>
            <HashRouter>
              <App />
            </HashRouter>
          </ProgressProvider>
        </ClassroomProvider>
      </ExperienceProvider>
    </ThemeProvider>
  </StrictMode>,
)

// Prefetch Pyodide after first paint so later lessons start faster.
if (typeof window !== 'undefined') {
  const prefetch = () => {
    void getPyodide().catch(() => {})
  }
  if ('requestIdleCallback' in window) {
    requestIdleCallback(prefetch, { timeout: 8000 })
  } else {
    setTimeout(prefetch, 2000)
  }
}
