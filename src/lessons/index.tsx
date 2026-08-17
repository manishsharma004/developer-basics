import type { ComponentType } from 'react'
import { lessonsMeta, type LessonMeta } from './meta.ts'
import FilesystemLesson from './filesystem/FilesystemLesson.tsx'
import ProcessLesson from './process/ProcessLesson.tsx'
import MemoryLesson from './memory/MemoryLesson.tsx'
import ConcurrencyLesson from './concurrency/ConcurrencyLesson.tsx'
import DataLesson from './data/DataLesson.tsx'
import NetworkLesson from './network/NetworkLesson.tsx'
import GitLesson from './git/GitLesson.tsx'
import CliLesson from './cli/CliLesson.tsx'
import DataStructuresLesson from './datastructures/DataStructuresLesson.tsx'
import AlgorithmsLesson from './algorithms/AlgorithmsLesson.tsx'
import RecursionLesson from './recursion/RecursionLesson.tsx'
import SqlLesson from './sql/SqlLesson.tsx'
import RegexLesson from './regex/RegexLesson.tsx'
import ErrorsLesson from './errors/ErrorsLesson.tsx'
import CachingLesson from './caching/CachingLesson.tsx'
import CryptoLesson from './crypto/CryptoLesson.tsx'
import TimeLesson from './time/TimeLesson.tsx'

// Wire each metadata entry to its component. Adding a lesson = add a metadata
// entry in meta.ts and a component here; nav, routes, and the home page update
// automatically.
const COMPONENTS: Record<string, ComponentType> = {
  filesystem: FilesystemLesson,
  process: ProcessLesson,
  memory: MemoryLesson,
  concurrency: ConcurrencyLesson,
  data: DataLesson,
  network: NetworkLesson,
  git: GitLesson,
  cli: CliLesson,
  datastructures: DataStructuresLesson,
  algorithms: AlgorithmsLesson,
  recursion: RecursionLesson,
  sql: SqlLesson,
  regex: RegexLesson,
  errors: ErrorsLesson,
  caching: CachingLesson,
  crypto: CryptoLesson,
  time: TimeLesson,
}

export interface RegisteredLesson extends LessonMeta {
  Component: ComponentType
}

export const lessons: RegisteredLesson[] = lessonsMeta.map((m) => ({
  ...m,
  Component: COMPONENTS[m.id],
}))
