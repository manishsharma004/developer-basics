import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { NumberConverter, TextEncoder2 } from './EncodingPlayground.tsx'

export default function DataLesson() {
  return (
    <Lesson id="data">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Under every string, image, and number is the same thing: <strong>bits</strong>.
          Knowing how data is represented explains integer overflow, why text
          sometimes turns into <code>Ã©</code> garbage, why colors are written as{' '}
          <code>#ff8800</code>, and how much space things take.
        </p>
        <Callout kind="why" title="The one idea">
          A computer stores everything as binary. Hex and decimal are just
          human-friendly ways to read those same bits.
        </Callout>
      </Section>

      <Section id="model" title="Bits, bytes & bases">
        <p className="prose">
          A <strong>bit</strong> is a single 0 or 1. Eight bits make a{' '}
          <strong>byte</strong>, which can hold 256 values (0–255). The same value
          can be written in different <strong>bases</strong>:
        </p>
        <ul className="prose-list">
          <li><strong>Binary (base 2)</strong> — how it's actually stored: <code>101010</code>.</li>
          <li><strong>Decimal (base 10)</strong> — how humans usually count: <code>42</code>.</li>
          <li><strong>Hexadecimal (base 16)</strong> — compact for bytes; each hex digit is 4 bits: <code>2a</code>.</li>
        </ul>
        <Callout kind="note">
          Hex is everywhere (colors, memory addresses, hashes) because two hex
          digits map cleanly to exactly one byte.
        </Callout>
      </Section>

      <Section id="playground" title="Convert it live">
        <p className="prose">
          Type a value in any base and watch the others update. Edit the binary
          directly to feel how each bit contributes.
        </p>
        <NumberConverter />
        <TryThis>
          Enter <code>255</code> in decimal — see it's <code>ff</code> in hex and
          eight <code>1</code>s in binary (one full byte). Now try <code>256</code>{' '}
          and notice it needs a second byte.
        </TryThis>
      </Section>

      <Section id="text" title="Text is bytes too">
        <p className="prose">
          Characters are numbers under the hood. <strong>Unicode</strong> assigns
          every character a <em>code point</em> (like <code>U+2605</code> for ★),
          and <strong>UTF-8</strong> encodes that code point into one to four
          bytes. That's why <b>character count ≠ byte count</b> for non-ASCII text.
        </p>
        <TextEncoder2 />
        <TryThis>
          Type a plain word, then add an emoji or a non-Latin character. Watch the
          byte count jump faster than the character count — those characters take
          multiple UTF-8 bytes.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Why you get Ã© mojibake">
          <p className="prose">
            If text is written as UTF-8 but read as if it were a single-byte
            encoding (like Latin-1), each multi-byte character gets split into
            wrong-looking characters. The fix is always to agree on one encoding
            (UTF-8) end to end.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Integer overflow">
          <p className="prose">
            A fixed-width integer can only hold so many bits. Add past the maximum
            and it wraps around (an 8-bit value goes 255 → 0). This is why sizes,
            counters, and timestamps sometimes behave bizarrely at their limits.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'bit', def: 'A single binary digit, 0 or 1.' },
            { term: 'byte', def: 'Eight bits; holds 0–255.' },
            { term: 'base / radix', def: 'How many symbols a number system uses (2, 10, 16).' },
            { term: 'hexadecimal', def: 'Base-16 notation; two hex digits equal one byte.' },
            { term: 'Unicode code point', def: 'The unique number assigned to a character (e.g. U+2605).' },
            { term: 'UTF-8', def: 'An encoding that stores a code point in 1–4 bytes.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: <>How many distinct values can a single byte hold?</>,
              options: ['8', '16', '256', '1024'],
              answer: 2,
              explain: '8 bits → 2^8 = 256 values (0–255).',
            },
            {
              q: <>What is <code>ff</code> in hexadecimal, in decimal?</>,
              options: ['15', '128', '255', '256'],
              answer: 2,
              explain: 'f = 15, so ff = 15×16 + 15 = 255 — the largest value in one byte.',
            },
            {
              q: 'For text with emoji, why is the byte count larger than the character count?',
              options: [
                'Emoji are images',
                'UTF-8 encodes many characters in multiple bytes',
                'Bytes are always double',
                'It is a bug',
              ],
              answer: 1,
              explain: 'Non-ASCII code points take 2–4 UTF-8 bytes each.',
            },

            {
              q: 'How many bits are in one byte?',
              options: [
                '4',
              '8',
              '16',
              '32',
              ],
              answer: 1,
              explain: 'A byte is eight bits (256 distinct values).',
            },
            {
              q: 'Why is hex popular for memory dumps?',
              options: [
                'Hex is faster',
              'Two hex digits map cleanly to one byte',
              'Decimals are illegal',
              'Unicode requires hex',
              ],
              answer: 1,
              explain: 'Each byte is exactly two hex digits — easy to read at a glance.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>Everything is bits; a <strong>byte</strong> is 8 bits (0–255).</>,
            <>Binary, decimal, and hex are just different <strong>bases</strong> for the same value.</>,
            <>Text is numbers: Unicode <strong>code points</strong> encoded as bytes by <strong>UTF-8</strong>.</>,
            <>Character count ≠ byte count once you leave plain ASCII.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}
