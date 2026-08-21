import type { ComponentType } from 'react'
import { lessonsMeta, type LessonMeta } from './meta.ts'
import VariablesLesson from './variables/VariablesLesson.tsx'
import ControlFlowLesson from './controlflow/ControlFlowLesson.tsx'
import FloatingPointLesson from './floatingpoint/FloatingPointLesson.tsx'
import CicdLesson from './cicd/CicdLesson.tsx'
import LoadBalancingLesson from './loadbalancing/LoadBalancingLesson.tsx'
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
import RegexLesson from './regex/RegexLesson.tsx'
import ErrorsLesson from './errors/ErrorsLesson.tsx'
import CachingLesson from './caching/CachingLesson.tsx'
import CryptoLesson from './crypto/CryptoLesson.tsx'
import TimeLesson from './time/TimeLesson.tsx'
import ComputeLesson from './compute/ComputeLesson.tsx'
import QueueLesson from './queues/QueueLesson.tsx'
import ClassesLesson from './classes/ClassesLesson.tsx'
import OopLesson from './oop/OopLesson.tsx'
import PatternsLesson from './patterns/PatternsLesson.tsx'
import TreesLesson from './trees/TreesLesson.tsx'
import ApisLesson from './apis/ApisLesson.tsx'
import AuthLesson from './auth/AuthLesson.tsx'
import SecurityLesson from './security/SecurityLesson.tsx'
import TestingLesson from './testing/TestingLesson.tsx'
import FunctionalLesson from './functional/FunctionalLesson.tsx'
import JsonLesson from './json/JsonLesson.tsx'
import SearchLesson from './search/SearchLesson.tsx'
import DebuggingLesson from './debugging/DebuggingLesson.tsx'
import { CSS_CHAPTERS } from './css/chapters.tsx'
import { WEB_CHAPTERS } from './web/chapters.tsx'
import { DATABASES_CHAPTERS } from './databases/chapters.tsx'
import { REACT_CHAPTERS } from './react/chapters.tsx'
import { FASTAPI_CHAPTERS } from './fastapi/chapters.tsx'
import { SQL_CHAPTERS } from './sql/chapters.tsx'
import { MONGODB_CHAPTERS } from './mongodb/chapters.tsx'

// Wire each metadata entry to its component. Adding a lesson = add a metadata
// entry in meta.ts and a component here; nav, routes, and the home page update
// automatically.
const COMPONENTS: Record<string, ComponentType> = {
  variables: VariablesLesson,
  controlflow: ControlFlowLesson,
  floatingpoint: FloatingPointLesson,
  cicd: CicdLesson,
  loadbalancing: LoadBalancingLesson,
  filesystem: FilesystemLesson,
  process: ProcessLesson,
  memory: MemoryLesson,
  concurrency: ConcurrencyLesson,
  data: DataLesson,
  json: JsonLesson,
  network: NetworkLesson,
  git: GitLesson,
  cli: CliLesson,
  datastructures: DataStructuresLesson,
  algorithms: AlgorithmsLesson,
  search: SearchLesson,
  recursion: RecursionLesson,
  regex: RegexLesson,
  errors: ErrorsLesson,
  caching: CachingLesson,
  crypto: CryptoLesson,
  time: TimeLesson,
  compute: ComputeLesson,
  queues: QueueLesson,
  classes: ClassesLesson,
  oop: OopLesson,
  patterns: PatternsLesson,
  trees: TreesLesson,
  apis: ApisLesson,
  auth: AuthLesson,
  ...WEB_CHAPTERS,
  ...CSS_CHAPTERS,
  security: SecurityLesson,
  testing: TestingLesson,
  debugging: DebuggingLesson,
  functional: FunctionalLesson,
  ...DATABASES_CHAPTERS,
  ...SQL_CHAPTERS,
  ...MONGODB_CHAPTERS,
  ...REACT_CHAPTERS,
  ...FASTAPI_CHAPTERS,
}

export interface RegisteredLesson extends LessonMeta {
  Component: ComponentType
}

export const lessons: RegisteredLesson[] = lessonsMeta.map((m) => ({
  ...m,
  Component: COMPONENTS[m.id],
}))
