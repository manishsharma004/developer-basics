import type { ReactNode } from 'react'
import { Lesson } from './Lesson.tsx'
import { Section, Recap, Quiz, KeyTerms } from './blocks.tsx'

export interface QuizQuestion {
  q: string
  options: string[]
  answer: number
  explain?: string
}

export interface ChapterConfig {
  id: string
  modelTitle?: string
  intro: ReactNode
  model: ReactNode
  playground?: ReactNode
  playgroundTitle?: string
  hood?: ReactNode
  terms: { term: string; def: string }[]
  quiz: QuizQuestion[]
  recap: ReactNode[]
}

export function createChapterLesson(config: ChapterConfig) {
  const {
    id,
    intro,
    model,
    modelTitle = 'Core ideas',
    playground,
    playgroundTitle = 'Try it',
    hood,
    terms,
    quiz,
    recap,
  } = config

  return function ChapterLesson() {
    return (
      <Lesson id={id}>
        <Section id="intro" title="Why it matters">
          {intro}
        </Section>
        <Section id="model" title={modelTitle}>
          {model}
        </Section>
        {playground && (
          <Section id="playground" title={playgroundTitle}>
            {playground}
          </Section>
        )}
        {hood && (
          <Section id="hood" title="Under the hood">
            {hood}
          </Section>
        )}
        <Section id="terms" title="Key terms">
          <KeyTerms terms={terms} />
        </Section>
        <Section id="check" title="Check yourself">
          <Quiz questions={quiz} />
        </Section>
        <Section id="recap" title="Recap">
          <Recap items={recap} />
        </Section>
      </Lesson>
    )
  }
}
