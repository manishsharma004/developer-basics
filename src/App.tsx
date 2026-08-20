import { useEffect, useState } from 'react'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { lessons } from './lessons/index.tsx'
import type { Level } from './lessons/meta.ts'
import Home from './pages/Home.tsx'
import TeacherHome from './pages/TeacherHome.tsx'
import { useExperience } from './experience/ExperienceContext.tsx'
import { LessonPlan } from './experience/LessonPlan.tsx'
import { useTheme } from './theme/ThemeContext.tsx'
import { THEMES } from './theme/themes.ts'
import { FeedbackDialog } from './components/FeedbackDialog.tsx'

const LEVELS: Level[] = ['Beginner', 'Intermediate']
const COLLAPSE_KEY = 'devbasics.sidebarCollapsed'

function App() {
  const { experience, setExperience } = useExperience()
  const { theme, setTheme } = useTheme()
  const teacher = experience === 'teacher'
  const location = useLocation()

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === '1'
    } catch {
      return false
    }
  })
  const [mobileOpen, setMobileOpen] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0')
      } catch {
        /* ignore */
      }
      return next
    })
  }

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const closeMobile = () => setMobileOpen(false)

  const renderLink = (to: string, icon: string, label: string, end = false) => (
    <NavLink to={to} end={end} className="nav-link" title={label} onClick={closeMobile}>
      <span className="nav-icon">{icon}</span>
      <span className="nav-label">{label}</span>
    </NavLink>
  )

  return (
    <div
      className={`app${teacher ? ' app--teacher' : ''}${collapsed ? ' app--collapsed' : ''}${
        mobileOpen ? ' app--mobnav-open' : ''
      }`}
    >
      <header className="topbar">
        <button
          className="topbar-toggle"
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span className="hamburger" aria-hidden />
        </button>
        <span className="topbar-title">Developer Basics</span>
        <button className="topbar-feedback" onClick={() => setFeedbackOpen(true)} aria-label="Request or report an issue" title="Request / report">
          💬
        </button>
        <span className={`topbar-mode${teacher ? ' topbar-mode--teacher' : ''}`}>
          {teacher ? '🧑‍🏫 Teacher' : '🎓 Student'}
        </span>
      </header>

      <button className="mobile-backdrop" aria-label="Close navigation" tabIndex={-1} onClick={closeMobile} />

      <aside className="sidebar">
        <div className="sidebar-head">
          <div className="brand">
            <span className="brand-mark">{'</>'}</span>
            <div className="brand-text">
              <div className="brand-title">Developer Basics</div>
              <div className="brand-sub">{teacher ? 'teach with confidence' : 'learn by doing'}</div>
            </div>
          </div>
          <button
            className="collapse-btn"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={toggleCollapsed}
          >
            {collapsed ? '»' : '«'}
          </button>
        </div>

        <div className="exp-switch" role="tablist" aria-label="Experience">
          <button
            role="tab"
            aria-selected={!teacher}
            className={`exp-btn${!teacher ? ' exp-btn--active' : ''}`}
            onClick={() => setExperience('student')}
            title="Student experience"
          >
            <span className="exp-icon">🎓</span>
            <span className="exp-label">Student</span>
          </button>
          <button
            role="tab"
            aria-selected={teacher}
            className={`exp-btn${teacher ? ' exp-btn--active' : ''}`}
            onClick={() => setExperience('teacher')}
            title="Teacher experience"
          >
            <span className="exp-icon">🧑‍🏫</span>
            <span className="exp-label">Teacher</span>
          </button>
        </div>

        <nav className="nav">
          {renderLink('/', teacher ? '📋' : '🏠', teacher ? 'Curriculum' : 'All lessons', true)}

          {teacher ? (
            LEVELS.map((level) => {
              const group = lessons.filter((l) => l.level === level)
              if (group.length === 0) return null
              return (
                <div key={level} className="nav-group">
                  <div className="nav-group-title">{level}</div>
                  {group.map((lesson) => (
                    <NavLink
                      key={lesson.id}
                      to={lesson.path}
                      className="nav-link"
                      title={lesson.title}
                      onClick={closeMobile}
                    >
                      <span className="nav-icon">{lesson.icon}</span>
                      <span className="nav-label">{lesson.title}</span>
                    </NavLink>
                  ))}
                </div>
              )
            })
          ) : (
            lessons.map((lesson) => (
              <NavLink
                key={lesson.id}
                to={lesson.path}
                className="nav-link"
                title={lesson.title}
                onClick={closeMobile}
              >
                <span className="nav-icon">{lesson.icon}</span>
                <span className="nav-label">{lesson.title}</span>
              </NavLink>
            ))
          )}
        </nav>

        <div className="theme-picker">
          <span className="theme-picker-label nav-label">Theme</span>
          <div className="theme-swatches">
            {THEMES.map((t) => (
              <button
                key={t.id}
                className={`theme-swatch${theme === t.id ? ' theme-swatch--active' : ''}`}
                style={{ background: t.swatch }}
                onClick={() => setTheme(t.id)}
                aria-label={`${t.label} theme`}
                aria-pressed={theme === t.id}
                title={t.label}
              />
            ))}
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="feedback-btn" onClick={() => setFeedbackOpen(true)}>
            <span className="nav-icon">💬</span>
            <span className="nav-label">Request / feedback</span>
          </button>
          <a href="https://github.com/manishsharma004/developer-basics" target="_blank" rel="noreferrer">
            <span className="nav-icon">↗</span>
            <span className="nav-label">View source</span>
          </a>
        </div>
      </aside>

      <main className="content">
        {teacher && <div className="mode-ribbon">🧑‍🏫 Teacher mode — lesson plans &amp; teaching notes</div>}
        <Routes>
          <Route path="/" element={teacher ? <TeacherHome /> : <Home />} />
          {lessons.map(({ id, path, Component }) => (
            <Route key={id} path={path} element={teacher ? <LessonPlan id={id} /> : <Component />} />
          ))}
          <Route path="*" element={teacher ? <TeacherHome /> : <Home />} />
        </Routes>
      </main>

      {feedbackOpen && <FeedbackDialog onClose={() => setFeedbackOpen(false)} />}
    </div>
  )
}

export default App
