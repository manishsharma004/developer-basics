import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { CapstoneChecklist } from './CapstoneChecklist.tsx'

export default function CapstoneLesson() {
  return (
    <Lesson id="capstone">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Isolated chapters build skills; a capstone stitches them into one narrative.
          You'll map a small <strong>task tracker</strong> onto lessons you've already
          got — data, API, UI, auth, tests, deploy.
        </p>
        <Callout kind="why" title="The one idea">
          Real projects reuse the same primitives — tables, HTTP, components, CI — in one
          coherent flow with tradeoffs.
        </Callout>
      </Section>

      <Section id="model" title="The project">
        <ul className="prose-list">
          <li><strong>Data</strong> — tasks table with user_id, title, done flag.</li>
          <li><strong>API</strong> — CRUD endpoints with validation.</li>
          <li><strong>UI</strong> — list tasks, toggle done, add new.</li>
          <li><strong>Auth</strong> — simple token or session (conceptual).</li>
          <li><strong>Quality</strong> — tests + pipeline before deploy.</li>
        </ul>
      </Section>

      <Section id="playground" title="Your checklist">
        <CapstoneChecklist />
        <TryThis>
          Pick one step you haven't read yet — open that lesson, complete the lab, mark as read,
          then return here to track overall capstone progress.
        </TryThis>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms terms={[
          { term: 'capstone', def: 'Integrative project tying multiple topics together.' },
          { term: 'vertical slice', def: 'One feature through all layers (DB → API → UI).' },
        ]} />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz questions={[
          { q: 'A capstone helps because:', options: ['It replaces all lessons', 'It practices transfer across topics', 'It removes need for SQL', 'It disables React'], answer: 1 },
          { q: 'First capstone step focuses on:', options: ['GPU drivers', 'Data modeling with SQL', 'Regex only', 'Floating point'], answer: 1 },
        ]} />
      </Section>

      <Section id="recap" title="Recap">
        <Recap items={[
          <>Follow the checklist through existing lessons.</>,
          <>Aim for one vertical slice before adding features.</>,
        ]} />
      </Section>
    </Lesson>
  )
}
