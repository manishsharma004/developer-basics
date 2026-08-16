import type { ComponentType } from 'react'
import FilesystemDemo from './FilesystemDemo.tsx'
import ProcessDemo from './ProcessDemo.tsx'

export interface Demo {
  id: string
  path: string
  title: string
  tagline: string
  icon: string
  Component: ComponentType
}

// Central registry of the interactive "basics" demos. The nav, home page, and
// router all read from this list so adding a new demo only requires one entry.
export const demos: Demo[] = [
  {
    id: 'filesystem',
    path: '/filesystem',
    title: 'Filesystem',
    tagline: 'A real in-browser shell over a live filesystem — powered by Python.',
    icon: '🗂️',
    Component: FilesystemDemo,
  },
  {
    id: 'process',
    path: '/process',
    title: 'Process Architecture',
    tagline: 'Simulate CPU scheduling (FCFS, SJF, Round Robin) with an animated Gantt chart.',
    icon: '⚙️',
    Component: ProcessDemo,
  },
]
