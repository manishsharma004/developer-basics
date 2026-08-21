import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { SnippetRunner, type Snippet } from '../components/SnippetRunner.tsx'

const SNIPPETS: Snippet[] = [
  {
    label: 'Dump & load',
    code: `import json

person = {
    "name": "Ada",
    "born": 1815,
    "languages": ["English", "math"],
    "active": True,
}

text = json.dumps(person, indent=2)
print("as text:")
print(text)

back = json.loads(text)
print("name:", back["name"], "born:", back["born"])
print("same keys?", set(back) == set(person))`,
  },
  {
    label: 'Types that survive',
    code: `import json

# JSON only knows: object, array, string, number, true/false, null
payload = {
    "ok": True,
    "count": 3,
    "note": None,
    "tags": ["a", "b"],
}

print(json.dumps(payload))

# Sets and tuples are not JSON types — convert first.
data = {"ids": list({1, 2, 2, 3})}
print(json.dumps(data))`,
  },
  {
    label: 'Pretty vs compact',
    code: `import json

obj = {"user": "dev", "roles": ["reader", "writer"]}

compact = json.dumps(obj, separators=(",", ":"))
pretty = json.dumps(obj, indent=2, sort_keys=True)

print("bytes compact:", len(compact))
print(compact)
print("---")
print("bytes pretty:", len(pretty))
print(pretty)`,
  },
]

export default function JsonLesson() {
  return (
    <Lesson id="json">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Programs constantly turn structured data into text (to store it, send it
          over the network, or log it) and back again. That round-trip is{' '}
          <strong>serialization</strong>. <strong>JSON</strong> is the common
          language for it across languages, APIs, config files, and browsers.
        </p>
        <Callout kind="why" title="The one idea">
          Serialization is a translation: an in-memory object becomes a string of
          bytes, then becomes an object again. JSON defines the shared grammar so
          Python, JavaScript, Go, and friends can all speak it.
        </Callout>
      </Section>

      <Section id="model" title="Objects become text">
        <ul className="prose-list">
          <li>
            <strong>Serialize</strong> (encode / dump): object → text. In Python,{' '}
            <code>json.dumps</code>; in JavaScript, <code>JSON.stringify</code>.
          </li>
          <li>
            <strong>Deserialize</strong> (decode / load): text → object.{' '}
            <code>json.loads</code> / <code>JSON.parse</code>.
          </li>
          <li>
            JSON values are only: objects <code>{'{}'}</code>, arrays{' '}
            <code>[]</code>, strings, numbers, <code>true</code>/<code>false</code>,{' '}
            <code>null</code>. No dates, sets, or binary blobs as first-class types.
          </li>
          <li>
            Pretty-printing (indent) helps humans; compact form saves bandwidth. Both
            parse to the same data.
          </li>
        </ul>
      </Section>

      <Section id="playground" title="Serialize it live">
        <p className="prose">
          Run these to dump a Python dict to JSON text, load it back, see which types
          survive the trip, and compare compact vs pretty output size.
        </p>
        <SnippetRunner snippets={SNIPPETS} />
        <TryThis>
          In <strong>Dump & load</strong>, add a nested dict like{' '}
          <code>{`{"city": "London"}`}</code> under an <code>address</code> key and
          re-run. Then try putting a <code>set</code> directly into the payload
          without converting — watch the error, then fix it with{' '}
          <code>list(...)</code>.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Schema and versioning">
          <p className="prose">
            JSON is schemaless by default — receivers must tolerate missing keys or
            unexpected fields. Production APIs often add a schema (OpenAPI, JSON
            Schema) or a <code>version</code> field so clients and servers can evolve
            without silently misreading each other.
          </p>
        </UnderTheHood>
        <UnderTheHood title="When JSON is the wrong tool">
          <p className="prose">
            Huge binary payloads, high-frequency telemetry, and typed RPC often use
            denser formats (Protocol Buffers, MessagePack, Avro). JSON wins on
            readability and universal tooling; those formats win on size and strict
            schemas.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'serialization', def: 'Turning an in-memory structure into a transferable byte/text form.' },
            { term: 'deserialization', def: 'Parsing that form back into an in-memory structure.' },
            { term: 'JSON', def: 'JavaScript Object Notation — a text format for objects, arrays, and scalars.' },
            { term: 'schema', def: 'A description of which fields and types a document must have.' },
            { term: 'pretty-print', def: 'Indented JSON meant for humans; larger on the wire.' },
            { term: 'null', def: 'JSON’s explicit “no value”; distinct from a missing key.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'Which type is not a native JSON value?',
              options: ['string', 'boolean', 'set / frozenset', 'null'],
              answer: 2,
              explain: 'JSON has objects, arrays, strings, numbers, booleans, and null — not sets.',
            },
            {
              q: 'json.dumps then json.loads should give you:',
              options: [
                'A different object with no relation',
                'Equivalent data (same structure and values)',
                'Only the keys, never the values',
                'Binary bytes only',
              ],
              answer: 1,
              explain: 'A round-trip preserves the JSON-representable structure and values.',
            },
            {
              q: 'Why prefer compact JSON on the network?',
              options: [
                'It parses into different data',
                'Fewer bytes to send; same meaning',
                'It encrypts the payload',
                'Browsers reject indented JSON',
              ],
              answer: 1,
              explain: 'Whitespace is optional; compact form is smaller but equivalent.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <><strong>Serialization</strong> turns objects into text; deserialization reverses it.</>,
            <><strong>JSON</strong> is the common interchange format for APIs and config.</>,
            <>Only a small set of types survives — convert sets, dates, and bytes yourself.</>,
            <>Use schemas and versioning when producers and consumers evolve independently.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}
