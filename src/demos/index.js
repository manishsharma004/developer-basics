import FilesystemDemo from './FilesystemDemo.jsx'
import ProcessDemo from './ProcessDemo.jsx'

// Central registry of the interactive "basics" demos. The nav, home page, and
// router all read from this list so adding a new demo only requires one entry.
export const demos = [
  {
    id: 'filesystem',
    path: '/filesystem',
    title: 'Filesystem',
    tagline: 'How files, directories, paths, and permissions fit together.',
    icon: '🗂️',
    Component: FilesystemDemo,
  },
  {
    id: 'process',
    path: '/process',
    title: 'Process Architecture',
    tagline: 'Process trees, memory layout, and the lifecycle of a process.',
    icon: '⚙️',
    Component: ProcessDemo,
  },
]
