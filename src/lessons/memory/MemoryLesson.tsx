import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap } from '../components/blocks.tsx'
import { ReferencePlayground, StackHeapVisualizer } from './MemoryPlayground.tsx'

export default function MemoryLesson() {
  return (
    <Lesson id="memory">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Bugs like "I changed one list and another changed too", "my app's memory
          keeps growing", and "maximum recursion depth exceeded" all come from not
          seeing where data lives in memory. Two regions matter most: the{' '}
          <strong>stack</strong> (fast, automatic, short-lived) and the{' '}
          <strong>heap</strong> (flexible, longer-lived).
        </p>
        <Callout kind="why" title="The one idea">
          Variables don't <em>contain</em> objects — they <em>refer</em> to them.
          Two variables can point at the same object, so changing it through one
          name is visible through the other.
        </Callout>
      </Section>

      <Section id="refs" title="Values vs. references">
        <p className="prose">
          The classic gotcha: assigning one variable to another usually copies the{' '}
          <em>reference</em>, not the object. Run these snippets and read the
          output carefully — <code>is</code> asks "the same object?", while{' '}
          <code>==</code> asks "the same contents?".
        </p>
        <ReferencePlayground />
        <TryThis>
          Run <strong>Aliasing</strong> and note <code>a</code> changed too. Then
          run <strong>Copy</strong> and see how <code>.copy()</code> breaks the
          link. Edit the code and experiment.
        </TryThis>
      </Section>

      <Section id="playground" title="Stack & heap, live">
        <p className="prose">
          Every function call pushes a <strong>frame</strong> onto the stack
          holding its local variables; returning pops it off. Objects that must
          outlive a single call live on the <strong>heap</strong>, and stack
          frames hold references to them.
        </p>
        <StackHeapVisualizer />
        <TryThis>
          Press <strong>Call function</strong> until you hit the limit — that's a{' '}
          <em>stack overflow</em> (what runaway recursion causes). Then allocate a
          couple of heap objects and use <strong>Point top frame → newest</strong>;
          notice objects nothing points to are labeled "garbage" — exactly what a
          garbage collector reclaims.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Why the stack is fast">
          <p className="prose">
            The stack only ever grows or shrinks at one end, so allocating a frame
            is basically moving a pointer — extremely cheap. Its size is limited
            (often a few MB), which is why deep or infinite recursion crashes with
            a stack overflow.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Virtual memory: everyone thinks they're alone">
          <p className="prose">
            Each process sees its own private, contiguous address space. The OS and
            CPU translate those virtual addresses to real physical RAM in units
            called <strong>pages</strong>, loading them on demand. That's why a
            program can't read another's memory, and why "out of memory" is about
            your process's mappings, not just installed RAM.
          </p>
        </UnderTheHood>
        <Callout kind="note">
          Languages with a garbage collector (Python, JS, Go) free heap objects for
          you once nothing references them. In C/C++/Rust you manage or track that
          lifetime yourself.
        </Callout>
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>Variables hold <strong>references</strong>, so aliases can share one object.</>,
            <><code>is</code> compares identity; <code>==</code> compares value.</>,
            <>The <strong>stack</strong> holds call frames and locals; the <strong>heap</strong> holds longer-lived objects.</>,
            <>Unbounded recursion overflows the stack; unreferenced heap objects become garbage.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}
