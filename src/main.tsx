import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ExperienceProvider } from './experience/ExperienceContext.tsx'
import { ThemeProvider } from './theme/ThemeContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ExperienceProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </ExperienceProvider>
    </ThemeProvider>
  </StrictMode>,
)
