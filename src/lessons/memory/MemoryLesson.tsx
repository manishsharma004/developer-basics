import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { ReferencePlayground, StackHeapVisualizer } from './MemoryPlayground.tsx'
import { ShallowDeepViz } from './ShallowDeepViz.tsx'

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
          <code>==</code> asks "the same contents?". For mutable types (lists,
          dicts), aliasing means two names can mutate the same object. For
          immutable types (ints, strings), <code>+=</code> on one name typically
          rebinds it to a new object without changing the other.
        </p>
        <ReferencePlayground />
        <TryThis>
          Run <strong>Aliasing</strong> and note <code>a</code> changed too. Then
          run <strong>Copy</strong> and see how <code>.copy()</code> breaks the
          link. Edit the code and experiment. Finally run <strong>Numbers are
          immutable</strong> and compare: <code>y += 5</code> rebinds <code>y</code>{' '}
          without changing <code>x</code> — integers do not alias the way lists do.
        </TryThis>
      </Section>

      <Section id="immutability" title="Immutable vs mutable">
        <p className="prose">
          Some values cannot change after creation — integers, strings, tuples of
          immutables. <strong>Mutable</strong> objects (lists, dicts, sets) can be
          changed in place. That distinction drives aliasing bugs: two names on a
          mutable object share one identity; rebinding one name to a new object does
          not affect the other.
        </p>
        <ul className="prose-list">
          <li>
            <code>x += 5</code> on an int rebinds <code>x</code> — the old object is
            unchanged.
          </li>
          <li>
            <code>lst.append(9)</code> mutates the list object both names may share.
          </li>
          <li>
            Tuples hold references too — a tuple of lists is immutable as a container,
            but the inner lists can still be mutated.
          </li>
        </ul>
        <Callout kind="tip" title="Rule of thumb">
          Prefer immutable data where you can (new objects instead of in-place mutation)
          to reduce spooky action at a distance — especially across threads or async
          tasks.
        </Callout>
      </Section>

      <Section id="copying" title="Shallow vs deep copy">
        <p className="prose">
          <code>.copy()</code> on a list makes a <strong>shallow copy</strong>: the
          outer container is new, but nested mutable objects are still shared. A{' '}
          <strong>deep copy</strong> recursively duplicates nested structures so
          nothing is aliased.
        </p>
        <ul className="prose-list">
          <li>
            <code>b = a.copy()</code> — safe for flat lists of numbers or strings.
          </li>
          <li>
            <code>copy.deepcopy(a)</code> — needed when lists contain other lists or
            dicts you want fully independent.
          </li>
          <li>
            Default arguments like <code>def f(items=[])</code> create one shared list
            for all calls — a classic leak of mutable state.
          </li>
        </ul>
        <ShallowDeepViz />
        <TryThis>
          Use the visual lab above, then run <strong>Shallow vs deep</strong> in the references playground and compare outputs.
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
          notice objects nothing points to are labeled "garbage".
        </TryThis>
      </Section>

      <Section id="gc" title="Garbage & leaks">
        <p className="prose">
          Once nothing references a heap object, it can never be used again — it's{' '}
          <strong>garbage</strong>. Managed languages (Python, JavaScript, Go, Java)
          run a <strong>garbage collector</strong> that reclaims such objects
          automatically. But "automatic" doesn't mean "leak-proof".
        </p>
        <ul className="prose-list">
          <li>
            A <strong>memory leak</strong> in a GC language happens when you keep
            references you no longer need — e.g. appending to a global list forever,
            or a cache that never evicts. The GC can't free what's still reachable.
          </li>
          <li>
            In manual-memory languages (C/C++), a leak is forgetting to{' '}
            <code>free()</code>; a <em>use-after-free</em> is freeing too early.
          </li>
        </ul>
        <Callout kind="warning" title="Watch for">
          Growing memory over time (rising RSS) usually means references are piling
          up somewhere. Look for unbounded collections, caches, or event listeners
          that are never removed.
        </Callout>
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
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'reference', def: 'A pointer from a variable to an object; assignment usually copies the reference.' },
            { term: 'stack', def: 'Fast, last-in-first-out memory holding call frames and locals.' },
            { term: 'heap', def: 'Flexible memory for objects that outlive a single call.' },
            { term: 'garbage collection', def: 'Automatic reclamation of objects nothing references anymore.' },
            { term: 'memory leak', def: 'Holding references you no longer need, so memory grows unbounded.' },
            { term: 'virtual memory', def: "Each process's private address space, mapped to physical RAM in pages." },
            { term: 'aliasing', def: 'Two names referring to the same object; mutations through one are visible via the other.' },
            { term: 'shallow copy', def: 'A new container that still shares inner mutable objects with the original (.copy() on a list).' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: <>After <code>b = a</code> where <code>a</code> is a list, you do <code>b.append(9)</code>. What happens to <code>a</code>?</>,
              options: ['a is unchanged', 'a also gets 9 appended', 'an error occurs', 'a becomes a copy'],
              answer: 1,
              explain: 'b and a reference the same list, so mutating through b is visible via a.',
            },
            {
              q: 'What typically causes a stack overflow?',
              options: [
                'Allocating too many heap objects',
                'Unbounded or very deep recursion',
                'A memory leak',
                'Using the garbage collector',
              ],
              answer: 1,
              explain: 'Each call adds a frame; too many nested calls exhaust the limited stack.',
            },
            {
              q: 'Can a garbage-collected language still leak memory?',
              options: [
                'No, never',
                'Yes — if you keep references you no longer need',
                'Only on Windows',
                'Only in C',
              ],
              answer: 1,
              explain: "The GC only frees unreachable objects; reachable-but-unneeded objects still accumulate.",
            },
            {
              q: 'a = [1, 2]; b = a.copy(); b.append(3). What is len(a)?',
              options: ['2', '3', 'Error', 'Depends on GC'],
              answer: 0,
              explain: 'copy() makes a new list; appending to b does not mutate a.',
            },
            {
              q: 'x = 10; y = x; y += 5. Why is x still 10?',
              options: [
                '+= never changes integers',
                'Integers are immutable — y += 5 rebinds y to a new int object',
                'y and x share one int that cannot change',
                'Python copies on every assignment',
              ],
              answer: 1,
              explain: 'Immutable values cannot be mutated; += creates a new object and rebinds the name.',
            },
            {
              q: 'a = [[1]]; b = a.copy(); b[0].append(2). What is a?',
              options: ['[[1]]', '[[1, 2]]', '[[2]]', 'Error'],
              answer: 1,
              explain: 'Shallow copy shares inner lists; mutating b[0] also mutates a[0].',
            },
            {
              q: 'Why is def f(items=[]) dangerous?',
              options: [
                'Lists cannot be default arguments',
                'The same list object is reused across every call',
                'It causes a stack overflow',
                'GC cannot free default arguments',
              ],
              answer: 1,
              explain: 'Default values are evaluated once at definition time and shared by all calls.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>Variables hold <strong>references</strong>, so aliases can share one object.</>,
            <><code>is</code> compares identity; <code>==</code> compares value.</>,
            <>The <strong>stack</strong> holds call frames; the <strong>heap</strong> holds longer-lived objects.</>,
            <>GC frees unreachable objects, but keeping unneeded references still leaks.</>,
            <>Immutable values rebind on <code>+=</code>; mutable objects alias until you copy.</>,
            <>Use <code>.copy()</code> for flat data; <code>deepcopy</code> when nesting matters.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}
