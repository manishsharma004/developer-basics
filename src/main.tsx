import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ExperienceProvider } from './experience/ExperienceContext.tsx'
import { ProgressProvider } from './progress/ProgressContext.tsx'
import { ThemeProvider } from './theme/ThemeContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ExperienceProvider>
        <ProgressProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </ProgressProvider>
      </ExperienceProvider>
    </ThemeProvider>
  </StrictMode>,
)
