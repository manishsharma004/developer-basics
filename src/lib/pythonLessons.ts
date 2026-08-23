/** Lesson ids that require the in-browser Python (Pyodide) runtime. */
export const PYTHON_LESSON_IDS = new Set([
  'variables',
  'controlflow',
  'data',
  'errors',
  'filesystem',
  'cli',
  'oop',
  'functional',
  'classes',
  'patterns',
  'process',
  'concurrency',
  'floatingpoint',
  'time',
  'regex',
  'json',
  'git',
  'security',
  'sql-intro',
  'sql-tables',
  'sql-schema',
  'sql-writes',
  'sql-joins',
  'sql-aggregates',
  'sql-subqueries',
  'sql-indexes',
  'sql-transactions',
  'sql-python',
])

export function lessonNeedsPython(lessonId: string): boolean {
  return PYTHON_LESSON_IDS.has(lessonId)
}
