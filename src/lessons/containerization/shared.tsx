import type { ReactNode } from 'react'
import { SimReality } from '../components/blocks.tsx'
import type { QuizQuestion } from '../components/ChapterLesson.tsx'

export function q(question: string, options: string[], answer: number, explain?: string): QuizQuestion {
  return { q: question, options, answer, explain }
}

export function simNote(sim: ReactNode, prod: ReactNode) {
  return <SimReality inSim={sim} inReality={prod} />
}
