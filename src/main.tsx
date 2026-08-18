import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ExperienceProvider } from './experience/ExperienceContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExperienceProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ExperienceProvider>
  </StrictMode>,
)
