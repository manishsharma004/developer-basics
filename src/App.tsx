import { NavLink, Route, Routes } from 'react-router-dom'
import { lessons } from './lessons/index.tsx'
import type { Level } from './lessons/meta.ts'
import Home from './pages/Home.tsx'
import TeacherHome from './pages/TeacherHome.tsx'
import { useExperience } from './experience/ExperienceContext.tsx'
import { LessonPlan } from './experience/LessonPlan.tsx'

const LEVELS: Level[] = ['Beginner', 'Intermediate']

function NavItems() {
  return (
    <>
      {lessons.map((lesson) => (
        <NavLink key={lesson.id} to={lesson.path} className="nav-link">
          <span className="nav-icon">{lesson.icon}</span>
          <span>{lesson.title}</span>
        </NavLink>
      ))}
    </>
  )
}

function App() {
  const { experience, setExperience } = useExperience()
  const teacher = experience === 'teacher'

  return (
    <div className={`app${teacher ? ' app--teacher' : ''}`}>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">{'</>'}</span>
          <div>
            <div className="brand-title">Developer Basics</div>
            <div className="brand-sub">{teacher ? 'teach with confidence' : 'learn by doing'}</div>
          </div>
        </div>

        <div className="exp-switch" role="tablist" aria-label="Experience">
          <button
            role="tab"
            aria-selected={!teacher}
            className={`exp-btn${!teacher ? ' exp-btn--active' : ''}`}
            onClick={() => setExperience('student')}
          >
            🎓 Student
          </button>
          <button
            role="tab"
            aria-selected={teacher}
            className={`exp-btn${teacher ? ' exp-btn--active' : ''}`}
            onClick={() => setExperience('teacher')}
          >
            🧑‍🏫 Teacher
          </button>
        </div>

        <nav className="nav">
          <NavLink to="/" end className="nav-link">
            <span className="nav-icon">{teacher ? '📋' : '🏠'}</span>
            <span>{teacher ? 'Curriculum' : 'All lessons'}</span>
          </NavLink>

          {teacher ? (
            LEVELS.map((level) => {
              const group = lessons.filter((l) => l.level === level)
              if (group.length === 0) return null
              return (
                <div key={level} className="nav-group">
                  <div className="nav-group-title">{level}</div>
                  {group.map((lesson) => (
                    <NavLink key={lesson.id} to={lesson.path} className="nav-link">
                      <span className="nav-icon">{lesson.icon}</span>
                      <span>{lesson.title}</span>
                    </NavLink>
                  ))}
                </div>
              )
            })
          ) : (
            <NavItems />
          )}
        </nav>

        <div className="sidebar-footer">
          <a href="https://github.com/manishsharma004/developer-basics" target="_blank" rel="noreferrer">
            View source
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
    </div>
  )
}

export default App
