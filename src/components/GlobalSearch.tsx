import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  listLessonTopics,
  searchLessons,
  type LessonSearchItem,
} from '../lib/lessonSearch.ts'

interface Props {
  open: boolean
  onClose: () => void
}

function isMacPlatform() {
  if (typeof navigator === 'undefined') return false
  return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
}

export function searchShortcutLabel() {
  return isMacPlatform() ? '⌘K' : 'Ctrl+K'
}

export function GlobalSearch({ open, onClose }: Props) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const results = useMemo(() => {
    const trimmed = query.trim()
    return trimmed ? searchLessons(trimmed) : listLessonTopics()
  }, [query])

  useEffect(() => {
    if (!open) return
    setQuery('')
    setActiveIndex(0)
    const frame = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const active = list.querySelector<HTMLElement>('[data-active="true"]')
    active?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, results])

  if (!open) return null

  const shortcutLabel = searchShortcutLabel()

  const goTo = (item: LessonSearchItem) => {
    navigate(item.path, item.sectionId ? { state: { scrollTo: item.sectionId } } : undefined)
    onClose()
  }

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)))
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
      return
    }
    if (event.key === 'Enter' && results[activeIndex]) {
      event.preventDefault()
      goTo(results[activeIndex])
    }
  }

  return (
    <div className="search-backdrop" onClick={onClose}>
      <div
        className="search-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Search topics"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="search-palette-head">
          <span className="search-palette-icon" aria-hidden>
            🔍
          </span>
          <input
            ref={inputRef}
            className="search-palette-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Search chapters and sections…"
            aria-label="Search chapters and sections"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="search-kbd">{shortcutLabel}</kbd>
        </div>

        <div className="search-palette-meta">
          {query.trim() ? (
            <span>
              {results.length} result{results.length === 1 ? '' : 's'}
            </span>
          ) : (
            <span>Popular chapters — or type to search everything</span>
          )}
        </div>

        <div
          ref={listRef}
          className="search-results"
          role="listbox"
          aria-label="Search results"
        >
          {results.length === 0 ? (
            <div className="search-empty">No topics match &ldquo;{query.trim()}&rdquo;</div>
          ) : (
            results.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`search-result${index === activeIndex ? ' search-result--active' : ''}`}
                role="option"
                aria-selected={index === activeIndex}
                data-active={index === activeIndex ? 'true' : 'false'}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => goTo(item)}
              >
                <span className="search-result-icon" aria-hidden>
                  {item.icon}
                </span>
                <span className="search-result-body">
                  <span className="search-result-title">{item.title}</span>
                  <span className="search-result-subtitle">{item.subtitle}</span>
                </span>
                <span className="search-result-kind">
                  {item.kind === 'section' ? 'Section' : 'Chapter'}
                </span>
              </button>
            ))
          )}
        </div>

        <div className="search-palette-foot">
          <span>
            <kbd className="search-kbd">↑↓</kbd> navigate
          </span>
          <span>
            <kbd className="search-kbd">Enter</kbd> open
          </span>
          <span>
            <kbd className="search-kbd">Esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  )
}

export function useGlobalSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const mod = isMacPlatform() ? event.metaKey : event.ctrlKey
      if (mod && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        onOpen()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onOpen])
}
