import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { SnippetRunner, type Snippet } from '../components/SnippetRunner.tsx'

const SNIPPETS: Snippet[] = [
  {
    label: 'SQL injection',
    code: `# A fake login that builds SQL by pasting strings together. UNSAFE.
def unsafe_query(username):
    return "SELECT * FROM users WHERE name = '" + username + "'"

print("normal:", unsafe_query("ada"))

# An attacker supplies a crafted username...
attack = "x' OR '1'='1"
print("attack:", unsafe_query(attack))
print("=> the WHERE is always true: every row leaks")`,
  },
  {
    label: 'The fix: parameters',
    code: `# Keep code and data separate. The driver binds values safely.
def safe_query(username):
    sql = "SELECT * FROM users WHERE name = ?"
    params = (username,)                 # data stays data, never code
    return sql, params

print(safe_query("ada"))
print(safe_query("x' OR '1'='1"))
print("=> the whole string is treated as one literal name, not SQL")`,
  },
  {
    label: 'Escaping to stop XSS',
    code: `import html

# User content rendered into a page. Un-escaped, this <script> runs.
comment = "<script>steal(document.cookie)</script>"

print("raw   :", comment)
print("escaped:", html.escape(comment))
print("=> escaped angle brackets render as text, not executable HTML")`,
  },
]

export default function SecurityLesson() {
  return (
    <Lesson id="security">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Most breaches aren't exotic — they're a handful of the same mistakes made
          over and over: trusting user input, mixing code with data, and handing out
          more access than needed. Learn to spot these patterns and you prevent the
          majority of real-world attacks.
        </p>
        <Callout kind="why" title="The one idea">
          <strong>Never trust input, and keep code separate from data.</strong> When
          user-supplied values get treated as commands — SQL, HTML, shell — an
          attacker can rewrite what your program does.
        </Callout>
      </Section>

      <Section id="model" title="Think like an attacker">
        <ul className="prose-list">
          <li>
            <strong>Injection</strong> (SQL, command, LDAP): user input is
            concatenated into a command string, so crafted input changes the command.
            Fix: <strong>parameterized</strong> queries that bind values as data.
          </li>
          <li>
            <strong>XSS (cross-site scripting)</strong>: user content is rendered into
            a page without escaping, so a <code>&lt;script&gt;</code> runs in other
            users' browsers. Fix: <strong>escape output</strong> for its context.
          </li>
          <li>
            <strong>Least privilege</strong>: give every component only the access it
            needs. A leaked read-only key is far less dangerous than an admin one.
          </li>
          <li>
            <strong>Defense in depth</strong>: layer validation, escaping, auth, and
            limited privileges so one failure isn't game over.
          </li>
        </ul>
      </Section>

      <Section id="playground" title="Break it, then fix it">
        <p className="prose">
          Run the unsafe version to see the attack succeed, then the fixed version to
          see why separating code from data defuses it. The third snippet shows output
          escaping stopping an XSS payload.
        </p>
        <SnippetRunner snippets={SNIPPETS} />
        <TryThis>
          In <strong>SQL injection</strong>, change <code>attack</code> to{' '}
          <code>"'; DROP TABLE users; --"</code> and see how the query is rewritten.
          Then switch to <strong>The fix</strong> and confirm the exact same string is
          now treated as a harmless literal.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Why parameterization actually works">
          <p className="prose">
            A parameterized query sends the SQL <em>text</em> and the{' '}
            <em>values</em> to the database on separate channels. The database parses
            the query structure first, then plugs values into fixed slots — so a value
            can never become new SQL keywords or a second statement. String
            concatenation, by contrast, hands the database one blob where data and code
            are indistinguishable.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Escaping is context-specific">
          <p className="prose">
            The same value needs different escaping depending on where it lands: HTML
            body, an HTML attribute, a URL, JavaScript, or SQL each have their own
            rules. This is why you escape at <strong>output</strong> time for the
            specific sink, rather than trying to "clean" input once at the door —
            input has no single safe form.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'injection', def: 'Untrusted input treated as part of a command (SQL, shell, etc.).' },
            { term: 'parameterized query', def: 'Sending SQL and values separately so values stay data.' },
            { term: 'XSS', def: 'Cross-site scripting: injecting runnable script into a page.' },
            { term: 'escaping', def: 'Encoding output so special characters render as text, not code.' },
            { term: 'least privilege', def: 'Granting only the minimum access each component needs.' },
            { term: 'defense in depth', def: 'Layering multiple independent safeguards.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'What is the correct fix for SQL injection?',
              options: [
                'Remove all quotes from input',
                'Use parameterized queries that bind values as data',
                'Hash the query',
                'Trust logged-in users',
              ],
              answer: 1,
              explain: 'Parameterization keeps user values as data, never as SQL code.',
            },
            {
              q: 'XSS is prevented mainly by:',
              options: [
                'Encrypting the database',
                'Escaping user content when rendering it into a page',
                'Using HTTPS only',
                'Longer passwords',
              ],
              answer: 1,
              explain: 'Context-appropriate output escaping stops injected markup from running.',
            },
            {
              q: 'The principle of least privilege says:',
              options: [
                'Give everyone admin to keep things simple',
                'Grant each component only the access it needs',
                'Never grant any access',
                'Only admins can log in',
              ],
              answer: 1,
              explain: 'Minimal access limits the blast radius of any single compromise.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <><strong>Never trust input</strong>; keep code and data separate.</>,
            <>Stop injection with <strong>parameterized queries</strong>, not string building.</>,
            <>Stop XSS by <strong>escaping output</strong> for its context.</>,
            <>Apply <strong>least privilege</strong> and <strong>defense in depth</strong>.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}
