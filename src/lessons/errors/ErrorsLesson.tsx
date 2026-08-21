import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { ErrorPlayground } from './ErrorPlayground.tsx'

export default function ErrorsLesson() {
  return (
    <Lesson id="errors">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Things go wrong: files are missing, input is malformed, the network
          drops. How your program reacts is the difference between a clear message
          and a silent corruption. Good error handling makes failures{' '}
          <em>visible</em> and <em>recoverable</em> — without hiding real bugs.
        </p>
        <Callout kind="why" title="The one idea">
          When something fails, an <strong>exception</strong> is raised and
          propagates up the call stack until something <strong>catches</strong> it.
          If nothing does, the program stops and prints a <strong>traceback</strong>.
        </Callout>
      </Section>

      <Section id="model" title="How errors propagate">
        <p className="prose">
          A raised exception unwinds the stack: the current function stops, its
          caller gets a chance to handle it, then <em>its</em> caller, and so on.
          You handle it with <code>try</code>/<code>except</code>, optionally add{' '}
          <code>finally</code> for cleanup that must always run, and use{' '}
          <code>raise</code> to signal your own errors.
        </p>
        <Callout kind="warning" title="Anti-pattern">
          Catching every exception and ignoring it (<code>except: pass</code>) hides
          real bugs. Catch the <em>specific</em> exception you can actually handle.
        </Callout>
      </Section>

      <Section id="playground" title="Catch it live">
        <p className="prose">
          Run these snippets and read the output. An uncaught error prints a full
          traceback (bottom line = the error type and message); a handled one prints
          your recovery instead.
        </p>
        <ErrorPlayground />
        <TryThis>
          Run <strong>Uncaught error</strong> and read the traceback — the last line
          names the exception (<code>ValueError</code>). Then run{' '}
          <strong>try / except</strong> to see it handled gracefully, and{' '}
          <strong>finally always runs</strong> to see cleanup fire even on error.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Reading a traceback">
          <p className="prose">
            Read a traceback <strong>bottom-up</strong>: the last line is the actual
            error and message; the lines above show the chain of calls that led
            there, most recent last. That call chain usually points straight at the
            line you need to fix.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Exceptions vs. error codes">
          <p className="prose">
            Some languages/APIs return error <em>codes</em> you must check after
            every call; others raise exceptions that jump straight to a handler.
            Exceptions keep the happy path clean and are hard to ignore by accident —
            but they can also skip code, which is why <code>finally</code> (or a{' '}
            context manager / <code>with</code>) exists for reliable cleanup.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'exception', def: 'An object representing an error condition that interrupts normal flow.' },
            { term: 'raise / throw', def: 'To signal an exception.' },
            { term: 'catch / except', def: 'To handle an exception and resume.' },
            { term: 'finally', def: 'A block that runs whether or not an error occurred.' },
            { term: 'traceback / stack trace', def: 'The call chain leading to an error.' },
            { term: 'propagation', def: 'An unhandled exception moving up the call stack.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'What happens to an exception nothing catches?',
              options: ['It is ignored', 'It propagates up the stack and stops the program with a traceback', 'It becomes zero', 'It retries'],
              answer: 1,
              explain: 'Uncaught exceptions unwind the stack and terminate with a traceback.',
            },
            {
              q: <>When does a <code>finally</code> block run?</>,
              options: ['Only on success', 'Only on error', 'Always, error or not', 'Never'],
              answer: 2,
              explain: 'finally runs regardless, which is why it is used for cleanup.',
            },
            {
              q: 'Where is the actual error in a Python traceback?',
              options: ['The first line', 'A random line', 'The last line', 'It is not shown'],
              answer: 2,
              explain: 'The bottom line names the exception type and message.',
            },

            {
              q: 'What does `finally` guarantee?',
              options: [
                'Only on success',
              'Runs whether or not an exception occurred',
              'Skips on error',
              'Retries the block',
              ],
              answer: 1,
              explain: '`finally` runs on every exit path from the try/except.',
            },
            {
              q: 'Bare `except:` catches:',
              options: [
                'Only ValueError',
              'Almost any exception — often too broad',
              'Syntax errors only',
              'Nothing',
              ],
              answer: 1,
              explain: 'Catch specific exceptions so you do not hide bugs like KeyboardInterrupt.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>Failures <strong>raise exceptions</strong> that propagate up the stack.</>,
            <>Handle them with <code>try</code>/<code>except</code>; clean up with <code>finally</code>.</>,
            <>Catch <strong>specific</strong> exceptions — don't swallow everything.</>,
            <>Read tracebacks bottom-up to find the real error and its origin.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}
