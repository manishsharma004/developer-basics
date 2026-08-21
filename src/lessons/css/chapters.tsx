import type { ComponentType } from 'react'
import { createChapterLesson } from '../components/ChapterLesson.tsx'
import { Callout, CodePreview, UnderTheHood, TryThis } from '../components/blocks.tsx'
import { BoxModelPlayground } from './BoxModelPlayground.tsx'
import { FlexPlayground } from './FlexPlayground.tsx'
import { PositionPlayground } from './PositionPlayground.tsx'
import { OverflowPlayground } from './OverflowPlayground.tsx'
import { ThemePlayground } from './ThemePlayground.tsx'

const cssIntro = createChapterLesson({
  id: 'css-intro',
  modelTitle: 'The mental model',
  intro: (
    <p className="prose">
      CSS looks simple — pick a color, set a width — but one line can rearrange an entire
      page. That is why it feels <strong>trickier than Python or SQL</strong> for many new
      developers: you are not telling the computer a sequence of steps; you are declaring
      rules that the browser resolves globally through the <strong>cascade</strong>.
    </p>
  ),
  model: (
    <>
      <Callout kind="why" title="Why beginners struggle">
        HTML says <em>what</em> is on the page; CSS says <em>how it looks</em>. Layout is
        implicit — every element is a box, and boxes interact in ways tutorials rarely spell
        out until something breaks.
      </Callout>
      <ul className="prose-list">
        <li><strong>Cascade</strong> — many rules compete; the browser picks a winner.</li>
        <li><strong>Inheritance</strong> — some properties (color, font) flow down to children.</li>
        <li><strong>Default styles</strong> — browsers ship their own CSS before yours loads.</li>
        <li><strong>DevTools</strong> — inspect computed styles; never guess which rule won.</li>
      </ul>
      <Callout kind="tip">
        When stuck, ask: <em>Which box am I sizing?</em> <em>Which rule wins?</em>{' '}
        <em>Is overflow hidden somewhere?</em> The next chapters answer each one.
      </Callout>
    </>
  ),
  terms: [
    { term: 'cascade', def: 'How the browser merges competing CSS rules into one computed style.' },
    { term: 'selector', def: 'Pattern that targets elements (e.g. .btn, #nav, div > p).' },
    { term: 'computed style', def: 'The final values DevTools show after cascade + inheritance.' },
  ],
  quiz: [
    { q: 'CSS primarily describes:', options: ['Execution order of functions', 'Visual presentation of HTML', 'Database schemas', 'Git branches'], answer: 1 },
    { q: 'When two rules conflict, the browser uses:', options: ['The cascade and specificity', 'Alphabetical file names only', 'Random choice', 'HTML tag count'], answer: 0 },
    { q: 'The best first step when CSS “makes no sense” is:', options: ['Add !important everywhere', 'Inspect computed styles in DevTools', 'Delete all CSS', 'Rewrite in inline styles only'], answer: 1 },
  ],
  recap: [
    <>CSS is <strong>declarative</strong> — rules interact through the cascade.</>,
    <>Every element is a <strong>box</strong>; layout bugs are usually box bugs.</>,
    <>Use <strong>DevTools</strong> to see which rule actually applied.</>,
  ],
})

const cssBoxModel = createChapterLesson({
  id: 'css-box-model',
  modelTitle: 'Boxes all the way down',
  intro: (
    <p className="prose">
      Every element is a rectangle: <strong>content</strong>, then <strong>padding</strong>,{' '}
      <strong>border</strong>, then <strong>margin</strong>. Getting the box model wrong is the
      #1 source of “why is my layout 20px off?” bugs.
    </p>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li><strong>content</strong> — text and images live here.</li>
        <li><strong>padding</strong> — space inside the border, still part of the element’s background.</li>
        <li><strong>border</strong> — edge you can color and round with border-radius.</li>
        <li><strong>margin</strong> — space <em>outside</em> the border, pushing neighbors away.</li>
      </ul>
      <Callout kind="warning" title="box-sizing">
        Default <code>content-box</code> means <code>width: 200px</code> excludes padding and
        border. Use <code>box-sizing: border-box</code> (this app sets it globally) so width
        includes padding + border — what most people expect.
      </Callout>
    </>
  ),
  playground: (
    <>
      <BoxModelPlayground />
      <TryThis>Switch to content-box and add padding — watch the outer size grow past 200px.</TryThis>
    </>
  ),
  terms: [
    { term: 'box model', def: 'content + padding + border + margin layers around every element.' },
    { term: 'border-box', def: 'width/height include padding and border.' },
    { term: 'margin collapse', def: 'Vertical margins between blocks can merge into one gap.' },
  ],
  quiz: [
    { q: 'Margin sits:', options: ['Inside the border', 'Outside the border', 'Only on inline text', 'In the HTML attribute'], answer: 1 },
    { q: 'border-box makes width measure:', options: ['Content only', 'Content + padding + border', 'Margin included', 'Viewport only'], answer: 1 },
    { q: 'Padding affects:', options: ['Space outside the element', 'Space inside the border', 'Only text color', 'DNS lookup'], answer: 1 },
  ],
  recap: [
    <>Think in layers: <strong>content → padding → border → margin</strong>.</>,
    <>Prefer <strong>border-box</strong> so widths behave predictably.</>,
    <>Vertical <strong>margin collapse</strong> surprises people — watch for it.</>,
  ],
})

const cssLayout = createChapterLesson({
  id: 'css-layout',
  modelTitle: 'Flex & Grid',
  intro: (
    <p className="prose">
      Before Flexbox and Grid, developers abused <code>float</code> and clearfix hacks for
      layouts. Today <strong>Flexbox</strong> handles rows and columns in one dimension;{' '}
      <strong>Grid</strong> handles two-dimensional page shells — nav + sidebar + main in one
      declaration.
    </p>
  ),
  model: (
    <>
      <p className="prose"><strong>Flexbox</strong> — one axis at a time:</p>
      <ul className="prose-list">
        <li><code>display: flex</code> on the parent; children become flex items.</li>
        <li><code>justify-content</code> — alignment along the main axis.</li>
        <li><code>align-items</code> — alignment on the cross axis.</li>
        <li><code>gap</code> — space between items without margin hacks.</li>
      </ul>
      <p className="prose"><strong>Grid</strong> — rows and columns together:</p>
      <ul className="prose-list">
        <li><code>display: grid; grid-template-columns: 240px 1fr;</code> — sidebar + main.</li>
        <li>This app’s shell uses <code>grid-template-columns: var(--sidebar-w) 1fr</code>.</li>
      </ul>
    </>
  ),
  playground: (
    <>
      <FlexPlayground />
      <TryThis>Center a row with justify-content and align-items — no margin: auto hacks.</TryThis>
    </>
  ),
  terms: [
    { term: 'flex container', def: 'Parent with display: flex; controls item alignment.' },
    { term: 'grid track', def: 'A row or column in a CSS grid layout.' },
    { term: 'fr unit', def: 'Grid fraction — shares leftover space proportionally.' },
  ],
  quiz: [
    { q: 'Flexbox is best for:', options: ['One-dimensional alignment (row OR column)', '3D transforms only', 'SQL queries', 'Binary trees'], answer: 0 },
    { q: 'justify-content aligns items on:', options: ['The main axis', 'The cross axis always', 'The z axis only', 'Parent margin'], answer: 0 },
    { q: 'grid-template-columns: 200px 1fr creates:', options: ['Two equal pixels always', 'Fixed sidebar + flexible main column', 'Circular layout', 'No columns'], answer: 1 },
  ],
  recap: [
    <>Use <strong>Flexbox</strong> for toolbars, nav rows, and centering.</>,
    <>Use <strong>Grid</strong> for page shells with sidebar + content.</>,
    <>Replace float/clearfix layouts with flex/grid when you can.</>,
  ],
})

const cssPosition = createChapterLesson({
  id: 'css-position',
  modelTitle: 'Position modes',
  intro: (
    <p className="prose">
      <code>position</code> takes elements out of normal flow or anchors them to the viewport.
      Dropdowns, modals, sticky headers, and “badge on corner of card” all depend on getting
      this right — especially the combo <strong>relative parent + absolute child</strong>.
    </p>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li><strong>static</strong> — default; top/left ignored.</li>
        <li><strong>relative</strong> — offset from its normal spot; still occupies original space.</li>
        <li><strong>absolute</strong> — positioned vs nearest positioned ancestor (not static).</li>
        <li><strong>fixed</strong> — relative to the viewport (modals, chat widgets).</li>
        <li><strong>sticky</strong> — hybrid; scrolls until a threshold, then sticks.</li>
      </ul>
      <Callout kind="note" title="z-index">
        <code>z-index</code> only works on <em>positioned</em> elements (not static). Stacking
        contexts nest — a high z-index inside a low parent still loses to siblings outside.
      </Callout>
    </>
  ),
  playground: (
    <>
      <PositionPlayground />
      <TryThis>Switch absolute → fixed and see the badge jump to the viewport corner.</TryThis>
    </>
  ),
  terms: [
    { term: 'positioned element', def: 'position other than static; z-index applies.' },
    { term: 'stacking context', def: 'Layer group where z-index comparisons stay local.' },
    { term: 'sticky', def: 'Scrolls normally until threshold, then behaves like fixed.' },
  ],
  quiz: [
    { q: 'absolute positioning is relative to:', options: ['Always the viewport', 'Nearest positioned ancestor', 'The HTML root only', 'Parent margin box always'], answer: 1 },
    { q: 'fixed positioning is relative to:', options: ['The viewport', 'First flex item', 'Border-box of table', 'Random sibling'], answer: 0 },
    { q: 'z-index without position: relative/absolute/fixed/sticky:', options: ['Always wins', 'Has no effect on static elements', 'Doubles margin', 'Changes font size'], answer: 1 },
  ],
  recap: [
    <>Anchor overlays with <strong>relative parent + absolute child</strong>.</>,
    <><strong>fixed</strong> sticks to viewport; <strong>sticky</strong> sticks after scroll.</>,
    <>z-index fights happen inside <strong>stacking contexts</strong> — raise the right parent.</>,
  ],
})

const cssOverflow = createChapterLesson({
  id: 'css-overflow',
  modelTitle: 'Overflow modes',
  intro: (
    <p className="prose">
      When content is bigger than its box, something has to give. <code>overflow</code>{' '}
      decides whether it spills visibly, gets clipped, or scrolls — critical for sidebars,
      code blocks, tables, and modals.
    </p>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li><strong>visible</strong> (default) — content paints outside the box; can overlap neighbors.</li>
        <li><strong>hidden</strong> — clip silently; no scrollbar.</li>
        <li><strong>scroll</strong> — always show scrollbars (even if not needed).</li>
        <li><strong>auto</strong> — scrollbars appear only when content overflows.</li>
      </ul>
      <Callout kind="warning">
        A parent with <code>overflow: hidden</code> can clip dropdowns and sticky children.
        Sidebars often use <code>overflow-y: auto</code> so long nav lists scroll inside the rail.
      </Callout>
    </>
  ),
  playground: (
    <>
      <OverflowPlayground />
      <TryThis>Compare hidden vs auto with tall content — this app’s sidebar uses auto scroll.</TryThis>
    </>
  ),
  terms: [
    { term: 'overflow', def: 'How content larger than the box is handled.' },
    { term: 'scroll container', def: 'Element that captures wheel events for overflowing content.' },
    { term: 'clip', def: 'Paint outside the padding edge is discarded (hidden).' },
  ],
  quiz: [
    { q: 'overflow: auto shows scrollbars:', options: ['Always, even when empty', 'Only when content exceeds the box', 'Never', 'Only on mobile'], answer: 1 },
    { q: 'overflow: hidden can accidentally:', options: ['Clip dropdown menus', 'Increase database speed', 'Compile TypeScript', 'Fix margin collapse always'], answer: 0 },
    { q: 'Default overflow is:', options: ['hidden', 'visible', 'scroll', 'auto'], answer: 1 },
  ],
  recap: [
    <>Pick <strong>auto</strong> for scrollable panels; <strong>hidden</strong> to clip.</>,
    <>Overflow on parents affects <strong>absolute/sticky</strong> descendants.</>,
    <>This app’s nav uses <code>overflow-y: auto</code> for long chapter lists.</>,
  ],
})

const cssThemes = createChapterLesson({
  id: 'css-themes',
  modelTitle: 'Variables & themes',
  intro: (
    <p className="prose">
      Hard-coding <code>#336699</code> in fifty files makes theme changes painful.{' '}
      <strong>CSS custom properties</strong> (<code>--accent</code>) let you define tokens once
      and swap palettes for dark mode, brand themes, or accessibility — this course app ships
      30+ themes using exactly that pattern.
    </p>
  ),
  model: (
    <>
      <CodePreview
        language="css"
        code={`:root {
  --bg: #0b1120;
  --text: #e6edf7;
  --accent: #38bdf8;
}

[data-theme='light'] {
  --bg: #f4f7fb;
  --text: #10203a;
  --accent: #0284c7;
}

.card {
  background: var(--bg);
  color: var(--text);
}`}
      />
      <Callout kind="why">
        React components should consume <strong>semantic tokens</strong> (<code>--panel</code>,{' '}
        <code>--border</code>), not raw hex — then themes work without touching component code.
      </Callout>
    </>
  ),
  playground: <ThemePlayground />,
  terms: [
    { term: 'CSS variable', def: 'Custom property declared with --name and used with var(--name).' },
    { term: 'design token', def: 'Named value (color, spacing) shared across the UI.' },
    { term: 'color-scheme', def: 'Hint for native controls; pair with data-theme for full palettes.' },
  ],
  quiz: [
    { q: 'CSS variables are declared like:', options: ['$primary', '--accent: #38bdf8', '@accent', 'color.primary'], answer: 1 },
    { q: 'This app switches themes by setting:', options: ['data-theme on html', 'A Python env var', 'SQL JOIN', 'Git branch'], answer: 0 },
    { q: 'Semantic tokens help because:', options: ['They remove HTML', 'Components reference meaning (--panel) not fixed hex', 'They disable cascade', 'They remove flexbox'], answer: 1 },
  ],
  recap: [
    <>Define palettes as <strong>CSS variables</strong> on :root or [data-theme].</>,
    <>Components use <code>var(--token)</code> — swap theme without editing each file.</>,
    <>See <strong>Theme</strong> in the sidebar — same mechanism you just practiced.</>,
  ],
})

const cssCascade = createChapterLesson({
  id: 'css-cascade',
  modelTitle: 'Specificity & inheritance',
  intro: (
    <p className="prose">
      “I set color red but it’s blue” means another rule won the cascade. Learning to read{' '}
      <strong>specificity</strong> saves hours of trial and error — and keeps you from sprinkling{' '}
      <code>!important</code> everywhere.
    </p>
  ),
  model: (
    <>
      <p className="prose">Rough specificity weight (higher wins):</p>
      <ol className="prose-list">
        <li>Inline style attribute</li>
        <li><code>#id</code> selectors</li>
        <li><code>.class</code>, <code>[attr]</code>, <code>:pseudo</code></li>
        <li>Element selectors (<code>div</code>, <code>p</code>)</li>
      </ol>
      <p className="prose">When scores tie, <strong>source order</strong> wins — the later rule in the CSS file.</p>
      <Callout kind="warning" title="!important">
        Breaks natural cascade order. Acceptable for utilities or overrides; toxic as a default
        debugging technique.
      </Callout>
      <p className="prose">
        <strong>Inheritance</strong>: properties like <code>color</code> and <code>font-family</code>{' '}
        flow to children; <code>margin</code> and <code>width</code> do not — layout stays local.
      </p>
    </>
  ),
  terms: [
    { term: 'specificity', def: 'Score determining which selector wins when rules conflict.' },
    { term: 'inheritance', def: 'Child elements copy certain properties from parents.' },
    { term: '!important', def: 'Forces a declaration to win except vs other !important + specificity.' },
  ],
  quiz: [
    { q: 'Which selector usually wins?', options: ['p', '.btn', '#save', 'They always tie'], answer: 2 },
    { q: 'color on a parent typically:', options: ['Inherits to children', 'Never affects children', 'Resets margin', 'Changes grid columns'], answer: 0 },
    { q: '!important should be:', options: ['Your first debugging tool', 'A last resort', 'Required on every rule', 'Used instead of classes'], answer: 1 },
  ],
  recap: [
    <>Read <strong>specificity</strong> when styles “don’t apply.”</>,
    <>Layout properties usually <strong>don’t inherit</strong>; typography often does.</>,
    <>Avoid <strong>!important</strong> sprawl — fix selector structure instead.</>,
  ],
})

const cssHacks = createChapterLesson({
  id: 'css-hacks',
  modelTitle: 'Common pitfalls',
  intro: (
    <p className="prose">
      Every team has “CSS hacks” — magic numbers, float clears, <code>transform: translateX(-50%)</code>{' '}
      centering, z-index 99999. They worked once. This chapter maps the famous hacks to{' '}
      <strong>proper fixes</strong> so you recognize them in the wild.
    </p>
  ),
  model: (
    <>
      <table className="metrics-table">
        <thead>
          <tr>
            <th>Hack</th>
            <th>Better approach</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Float + clearfix for layout</td>
            <td><code>display: flex</code> or <code>grid</code></td>
          </tr>
          <tr>
            <td><code>margin-top: -10px</code> nudge</td>
            <td>Fix alignment with flex/grid gap or align-items</td>
          </tr>
          <tr>
            <td><code>height: 100vh</code> on mobile (URL bar jump)</td>
            <td><code>min-height: 100dvh</code> or flex fill</td>
          </tr>
          <tr>
            <td>z-index: 999999</td>
            <td>Fix stacking context on the right parent</td>
          </tr>
          <tr>
            <td><code>!important</code> on every override</td>
            <td>Lower-specificity component classes, CSS layers</td>
          </tr>
        </tbody>
      </table>
      <Callout kind="tip">
        Centering: <code>display: flex; justify-content: center; align-items: center;</code>{' '}
        on the parent beats absolute + 50% transforms for most cases.
      </Callout>
    </>
  ),
  hood: (
    <UnderTheHood title="Debugging checklist">
      <ol className="prose-list">
        <li>Inspect element → Computed → which rule set width/margin/position?</li>
        <li>Is a parent <code>overflow: hidden</code> clipping you?</li>
        <li>Is the element actually <code>display: flex</code> child misaligned?</li>
        <li>Toggle <code>border-box</code> — did width math change?</li>
        <li>Draw boxes in DevTools (Layout overlay) — margin collapse?</li>
      </ol>
    </UnderTheHood>
  ),
  terms: [
    { term: 'clearfix', def: 'Legacy hack to contain floats; replaced by flex/grid in modern layouts.' },
    { term: 'magic number', def: 'Hard-coded px value that “fixes” layout without explaining why.' },
    { term: 'CSS layers', def: '@layer lets you control cascade order without !important wars.' },
  ],
  quiz: [
    { q: 'Modern replacement for float-based column layouts:', options: ['Flexbox or Grid', 'More floats', 'Tables for everything', 'Inline styles only'], answer: 0 },
    { q: 'Huge z-index values usually mean:', options: ['Perfect architecture', 'Stacking context misunderstood', 'Faster network', 'Better SEO'], answer: 1 },
    { q: 'First tool when CSS looks wrong:', options: ['Add ten new classes', 'Browser DevTools computed styles', 'Rewrite HTML as SVG', 'Disable JavaScript'], answer: 1 },
  ],
  recap: [
    <>Recognize <strong>hacks</strong> (float clears, magic margins, z-index wars).</>,
    <>Replace with <strong>flex, grid, border-box, and proper stacking</strong>.</>,
    <>Use a <strong>DevTools checklist</strong> before adding !important.</>,
  ],
})

export const CSS_CHAPTERS: Record<string, ComponentType> = {
  'css-intro': cssIntro,
  'css-box-model': cssBoxModel,
  'css-layout': cssLayout,
  'css-position': cssPosition,
  'css-overflow': cssOverflow,
  'css-themes': cssThemes,
  'css-cascade': cssCascade,
  'css-hacks': cssHacks,
}
