import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { lessons } from '../lessons/index.tsx'
import { teacherGuides } from '../experience/teacherGuides.ts'
import { useClassroom } from '../experience/ClassroomContext.tsx'

export function PresenterNotesStrip() {
  const { classroomMode } = useClassroom()
  const location = useLocation()
  const [open, setOpen] = useState(true)

  if (!classroomMode) return null

  const lesson = lessons.find((l) => l.path === location.pathname)
  if (!lesson) return null

  const guide = teacherGuides[lesson.id]
  if (!guide) return null

  return (
    <aside className={`presenter-notes${open ? ' presenter-notes--open' : ''}`} aria-label="Presenter notes">
      <button
        type="button"
        className="presenter-notes-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? '▾' : '▸'} Presenter notes
      </button>
      {open && (
        <div className="presenter-notes-body">
          <p className="presenter-notes-lab">{guide.lab}</p>
          {guide.discussion[0] && (
            <p className="presenter-notes-prompt">
              <strong>Ask:</strong> {guide.discussion[0]}
            </p>
          )}
        </div>
      )}
    </aside>
  )
}
