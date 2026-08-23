import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, SimReality, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { RenderPipeline } from './RenderPipeline.tsx'

export default function BrowserRenderingLesson() {
  return (
    <Lesson id="browser-rendering">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          CSS and React updates ultimately become pixels. Knowing the pipeline — parse,
          style, layout, paint, composite — explains jank and why some animations are smooth.
        </p>
        <Callout kind="why" title="The one idea">
          Changing layout is expensive; changing compositor-only properties (
          <code>transform</code>, <code>opacity</code>) is cheap.
        </Callout>
      </Section>

      <Section id="model" title="The pipeline">
        <ul className="prose-list">
          <li><strong>DOM</strong> — tree from HTML.</li>
          <li><strong>CSSOM</strong> — tree from CSS rules.</li>
          <li><strong>Render tree</strong> — DOM + computed styles.</li>
          <li><strong>Layout</strong> — compute geometry (reflow).</li>
          <li><strong>Paint</strong> — fill pixels.</li>
          <li><strong>Composite</strong> — GPU layers blended together.</li>
        </ul>
        <SimReality
          inSim={<span>Step through stages with a single demo box.</span>}
          inReality={<span>Real pages have thousands of nodes, incremental layout, and browser-specific optimizations.</span>}
        />
      </Section>

      <Section id="playground" title="Invalidate stages">
        <RenderPipeline />
        <TryThis>
          Toggle width — notice layout+ stages highlighted. Toggle color — only paint/composite.
        </TryThis>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms terms={[
          { term: 'reflow', def: 'Recalculating layout when geometry changes.' },
          { term: 'repaint', def: 'Redrawing pixels without layout changes.' },
        ]} />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz questions={[
          { q: 'Animating width triggers:', options: ['Composite only', 'Layout and below', 'Nothing', 'DNS lookup'], answer: 1 },
          { q: 'React reconciliation ultimately updates:', options: ['The real DOM (via the renderer)', 'The CPU scheduler', 'SQL indexes', 'Git branches'], answer: 0 },
        ]} />
      </Section>

      <Section id="recap" title="Recap">
        <Recap items={[
          <>Parse → style → layout → paint → composite.</>,
          <>Prefer transform/opacity for smooth 60fps animations.</>,
        ]} />
      </Section>
    </Lesson>
  )
}
