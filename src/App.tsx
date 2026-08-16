import { NavLink, Route, Routes } from 'react-router-dom'
import { lessons } from './lessons/index.tsx'
import Home from './pages/Home.tsx'

function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">{'</>'}</span>
          <div>
            <div className="brand-title">Developer Basics</div>
            <div className="brand-sub">learn the systems you use</div>
          </div>
        </div>

        <nav className="nav">
          <NavLink to="/" end className="nav-link">
            <span className="nav-icon">🏠</span>
            <span>All lessons</span>
          </NavLink>
          {lessons.map((lesson) => (
            <NavLink key={lesson.id} to={lesson.path} className="nav-link">
              <span className="nav-icon">{lesson.icon}</span>
              <span>{lesson.title}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a href="https://github.com/manishsharma004/developer-basics" target="_blank" rel="noreferrer">
            View source
          </a>
        </div>
      </aside>

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          {lessons.map(({ id, path, Component }) => (
            <Route key={id} path={path} element={<Component />} />
          ))}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
