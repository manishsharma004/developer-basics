import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { CliPlayground } from './CliPlayground.tsx'

export default function CliLesson() {
  return (
    <Lesson id="cli">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          The command line feels intimidating, but its real power is a simple idea:
          lots of tiny programs that each do one thing, snapped together into
          pipelines. Once it clicks, you can slice logs, transform data, and
          automate chores in a single line — no script file required.
        </p>
        <Callout kind="why" title="The one idea">
          Each program reads <strong>stdin</strong> and writes <strong>stdout</strong>.
          The pipe <code>|</code> connects one program's output to the next one's
          input, forming an assembly line for text.
        </Callout>
      </Section>

      <Section id="model" title="Streams & pipes">
        <p className="prose">
          A program has three standard streams: <strong>stdin</strong> (input),{' '}
          <strong>stdout</strong> (normal output), and <strong>stderr</strong>{' '}
          (errors). A pipeline like <code>grep ERROR | sort | uniq -c</code> wires
          them up: <code>grep</code>'s stdout becomes <code>sort</code>'s stdin, and
          so on.
        </p>
        <ul className="prose-list">
          <li><code>grep pattern</code> — keep lines matching <em>pattern</em> (<code>-v</code> inverts, <code>-i</code> ignores case).</li>
          <li><code>sort</code> — order lines (<code>-r</code> reverse, <code>-n</code> numeric).</li>
          <li><code>uniq -c</code> — collapse adjacent duplicates and count them.</li>
          <li><code>wc -l</code> — count lines; <code>head</code>/<code>tail</code> — first/last N.</li>
        </ul>
      </Section>

      <Section id="playground" title="Compose a pipeline">
        <p className="prose">
          Edit the input and the pipeline, then run it. The stages execute
          left-to-right in real Python — change one stage and watch the output
          change.
        </p>
        <CliPlayground />
        <TryThis>
          Start with <code>grep ERROR</code>, then add <code>| sort | uniq -c</code>{' '}
          to count how many times each error line appears. Add{' '}
          <code>| sort -rn</code> to rank them most-frequent first.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Why pipelines are efficient">
          <p className="prose">
            The shell runs the stages <em>concurrently</em> and streams data
            between them through an in-memory buffer, so a later stage can start
            working before an earlier one finishes. Nothing is written to disk
            between steps — that's why pipelines handle huge inputs comfortably.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Exit codes and stderr">
          <p className="prose">
            Every program returns an <strong>exit code</strong> (0 = success). The
            shell uses it for <code>&amp;&amp;</code> / <code>||</code> chaining.
            Errors go to <strong>stderr</strong>, a separate stream, so they don't
            pollute the piped data — that's why you still see errors on screen even
            when stdout is redirected to a file.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'stdin / stdout / stderr', def: 'The standard input, output, and error streams of a program.' },
            { term: 'pipe (|)', def: "Connects one program's stdout to the next program's stdin." },
            { term: 'filter', def: 'A program that reads stdin, transforms it, and writes stdout.' },
            { term: 'exit code', def: 'A number a program returns; 0 means success.' },
            { term: 'redirection', def: 'Sending a stream to/from a file with > , >> , or <.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: <>What does the pipe in <code>a | b</code> do?</>,
              options: ["Runs a and b at the same time on the same input", "Sends a's stdout into b's stdin", "Saves a's output to a file b", 'Runs b only if a fails'],
              answer: 1,
              explain: "The pipe connects a's standard output to b's standard input.",
            },
            {
              q: <>Which pipeline counts how many lines contain "ERROR"?</>,
              options: ['grep ERROR', 'grep ERROR | wc -l', 'wc -l | grep ERROR', 'sort | ERROR'],
              answer: 1,
              explain: 'Filter to matching lines first, then count them with wc -l.',
            },
            {
              q: 'Why do error messages still appear even when you pipe a command?',
              options: ['Pipes are broken', 'Errors go to stderr, which is separate from the piped stdout', 'The shell prints them randomly', 'grep adds them'],
              answer: 1,
              explain: 'stderr is a distinct stream, so it is not carried through the pipe.',
            },

            {
              q: 'In a pipeline `a | b`, stdout of `a` becomes:',
              options: [
                'A file on disk',
              'stdin of `b`',
              'stderr of `b`',
              'Environment variable',
              ],
              answer: 1,
              explain: 'The pipe connects one process output to the next input.',
            },
            {
              q: 'Exit code 0 usually means:',
              options: [
                'Failure',
              'Success',
              'Timeout',
              'Permission denied',
              ],
              answer: 1,
              explain: 'Unix convention: zero is success; non-zero signals an error.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>Programs communicate through <strong>stdin</strong>/<strong>stdout</strong>/<strong>stderr</strong>.</>,
            <>The <strong>pipe</strong> <code>|</code> chains small tools into a pipeline.</>,
            <>Composing filters (<code>grep</code>, <code>sort</code>, <code>uniq</code>, <code>wc</code>) is often faster than writing a script.</>,
            <>Exit codes signal success/failure; errors travel on stderr.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}
