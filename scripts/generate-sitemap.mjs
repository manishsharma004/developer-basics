#!/usr/bin/env bun
/**
 * Regenerate docs/sitemap.md from src/lessons/meta.ts.
 * Run: bun run sitemap
 */
import { writeFileSync } from 'node:fs'
import { groups, lessonsMeta } from '../src/lessons/meta.ts'

const lines = [
  '# Developer Basics — Site Map & Knowledge Index',
  '',
  '> Auto-generated from `src/lessons/meta.ts`. Run `bun run sitemap` to refresh.',
  '',
  `An interactive course with **${groups.length} modules** and **${lessonsMeta.length} chapters**.`,
  'Student and teacher experiences share the same curriculum; the sidebar switcher',
  'is persisted in `localStorage` (`devbasics.experience`).',
  '',
  '## Features',
  '',
  '- **Progress** — chapter read state, quiz answers, and capstone steps in IndexedDB',
  '- **Search** — `Ctrl+K` / `⌘K` global search with section deep links (`?section=`)',
  '- **Themes** — 30+ editor palettes plus a System option (`prefers-color-scheme`)',
  '- **Classroom mode** — simplified layout for teaching',
  '- **Capstone** — guided task-tracker path linking SQL, API, React, auth, tests, deploy',
  '',
  '## Routes',
  '',
  '| Route | Description |',
  '| --- | --- |',
  '| `/` | Home — modules, beginner path, capstone |',
  '| `/lessons/:topic` | Interactive lesson or teacher lesson plan |',
  '',
  'Routing uses `HashRouter` (GitHub Pages friendly). Lesson sections can be linked',
  'with query params, e.g. `/#/lessons/process?section=hood`.',
  '',
  '## Modules',
  '',
]

for (const group of groups) {
  const chapters = lessonsMeta.filter((l) => l.group === group.id)
  const ids = chapters.map((l) => l.id).join(', ')
  lines.push(`### ${group.icon} ${group.title} (${chapters.length} chapters)`)
  lines.push('')
  lines.push(group.blurb)
  lines.push('')
  lines.push(`Chapter ids: \`${ids}\``)
  lines.push('')
}

lines.push('## Chapter index', '')
lines.push('| Module | Title | Path | Level | Minutes |')
lines.push('| --- | --- | --- | --- | --- |')

const groupTitle = Object.fromEntries(groups.map((g) => [g.id, g.title]))
for (const lesson of lessonsMeta) {
  lines.push(
    `| ${groupTitle[lesson.group] ?? lesson.group} | ${lesson.title} | \`${lesson.path}\` | ${lesson.level} | ${lesson.minutes} |`,
  )
}

lines.push('')
writeFileSync(new URL('../docs/sitemap.md', import.meta.url), lines.join('\n'))
console.log(`Wrote docs/sitemap.md (${groups.length} modules, ${lessonsMeta.length} chapters)`)
