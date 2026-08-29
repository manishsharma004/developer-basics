/** Build a lesson path with an optional section query for shareable deep links. */
export function lessonSectionUrl(path: string, sectionId?: string): string {
  if (!sectionId) return path
  const params = new URLSearchParams({ section: sectionId })
  return `${path}?${params.toString()}`
}

/** Read `?section=` from the current location search string. */
export function parseSectionFromSearch(search: string): string | undefined {
  const id = new URLSearchParams(search).get('section')?.trim()
  return id || undefined
}
