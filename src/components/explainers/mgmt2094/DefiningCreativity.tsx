/*
SCENE: Defining creativity — seeing what everyone has seen, thinking what no-one has thought
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
BEATS: 4
INTENT: Make Einstein's definition visible as one shared input and one new output, then show the slide's broad
  definition of creative thinking as a scale from the everyday to business, and Robinson's claim that it is learnt.
SUBJECT: the single line that leaves the shared box for "a thought no-one else has had".
BEAT 1 (0–25%): five eyes, all lines converging on one box of information; ease none (scrubbed draw-on).
BEAT 2 (25–50%): one line leaves the box for the new-thought box; caption: Einstein's definition.
BEAT 3 (50–75%): a scale for creative thinking (think, imagine, invent something new) from a different route to
  campus to dropshipping.
BEAT 4 (75–100%): a dashed box with Robinson (2011): people who say they aren't creative haven't learnt what is involved.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished diagram with all four captions stacked.
BUDGET: < 6 KB gz, no WebGL. Narrow 360-unit canvas so text stays legible at phone width.
Source: concept mgmt2094-w01-defining-creativity (Week 1 slides 10–12; lecture transcript).
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const T = { ui: 'var(--font-ui)', body: 'var(--font-body)' };

function Label({ y, children }: { y: number; children: string }) {
  return <text x={W / 2} y={y} textAnchor="middle" fontFamily={T.ui} fontSize="13" letterSpacing="1.2" fill="var(--ink-2)">{children}</text>;
}

function Eye({ cx, cy }: { cx: number; cy: number }) {
  return (
    <>
      <ellipse cx={cx} cy={cy} rx="15" ry="8" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r="3.5" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
    </>
  );
}

const EYES = [44, 112, 180, 248, 316];

const figure = (
  <svg viewBox={`0 0 ${W} 640`} role="img"
    aria-label="Five eyes look at the same information; one line leads to a thought no-one else has had; below, creative thinking runs from a new route to campus to dropshipping; a dashed box quotes Robinson on learning creativity">
    <g data-step="1">
      <Label y={20}>WHAT EVERYONE ELSE HAS SEEN</Label>
      {EYES.map((x) => <Eye key={x} cx={x} cy={48} />)}
      {EYES.map((x) => <line key={`l${x}`} x1={x} y1={60} x2={W / 2} y2={104} stroke="var(--ink-3)" strokeWidth="1.2" />)}
      <rect x="70" y="104" width="220" height="56" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="129" textAnchor="middle" fontFamily={T.body} fontSize="16" fill="var(--ink)">the same information</text>
      <text x={W / 2} y="149" textAnchor="middle" fontFamily={T.ui} fontSize="12" fill="var(--ink-2)">abundant, easy to access</text>
    </g>
    <g data-step="2">
      <line x1={W / 2} y1="160" x2={W / 2} y2="214" stroke="var(--ink)" strokeWidth="2.5" />
      <polyline points={`${W / 2 - 7},205 ${W / 2},214 ${W / 2 + 7},205`} fill="none" stroke="var(--ink)" strokeWidth="2.5" />
      <rect x="30" y="218" width="300" height="70" rx="12" fill="none" stroke="var(--ink)" strokeWidth="2.5" />
      <text x={W / 2} y="246" textAnchor="middle" fontFamily={T.ui} fontSize="13" letterSpacing="1.2" fill="var(--ink)" data-label="new-thought">A THOUGHT NO-ONE ELSE HAS HAD</text>
      <text x={W / 2} y="272" textAnchor="middle" fontFamily={T.body} fontSize="15" fontStyle="italic" fill="var(--ink-2)">creativity (Einstein)</text>
    </g>
    <g data-step="3">
      <Label y={336}>CREATIVE THINKING</Label>
      <text x={W / 2} y="360" textAnchor="middle" fontFamily={T.body} fontSize="16" fill="var(--ink)">think · imagine · invent something new</text>
      <line x1="40" y1="396" x2="320" y2="396" stroke="var(--ink)" strokeWidth="1.5" />
      <line x1="40" y1="388" x2="40" y2="404" stroke="var(--ink)" strokeWidth="1.5" />
      <line x1="320" y1="388" x2="320" y2="404" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="40" y="428" fontFamily={T.ui} fontSize="12" fill="var(--ink-2)">everyday</text>
      <text x="40" y="447" fontFamily={T.body} fontSize="14" fill="var(--ink)">a different route</text>
      <text x="40" y="465" fontFamily={T.body} fontSize="14" fill="var(--ink)">to campus</text>
      <text x="320" y="428" textAnchor="end" fontFamily={T.ui} fontSize="12" fill="var(--ink-2)">business</text>
      <text x="320" y="447" textAnchor="end" fontFamily={T.body} fontSize="14" fill="var(--ink)">dropshipping: you</text>
      <text x="320" y="465" textAnchor="end" fontFamily={T.body} fontSize="14" fill="var(--ink)">hold no stock</text>
    </g>
    <g data-step="4">
      <rect x="8" y="500" width={W - 16} height="128" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x={W / 2} y="528" textAnchor="middle" fontFamily={T.ui} fontSize="13" letterSpacing="1.2" fill="var(--ink)" data-label="learnt">CAN IT BE LEARNT?</text>
      <text x={W / 2} y="556" textAnchor="middle" fontFamily={T.body} fontSize="15" fontStyle="italic" fill="var(--ink)">"…I assume they haven't learnt</text>
      <text x={W / 2} y="576" textAnchor="middle" fontFamily={T.body} fontSize="15" fontStyle="italic" fill="var(--ink)">what is involved"</text>
      <text x={W / 2} y="604" textAnchor="middle" fontFamily={T.ui} fontSize="12" fill="var(--ink-2)">Sir Ken Robinson (2011)</text>
    </g>
  </svg>
);

export default function DefiningCreativity() {
  return (
    <Diagram
      label="Defining creativity: shared information, a new thought, creative thinking and whether it can be learnt"
      terms={[
        { term: 'Creativity', def: "Seeing what everyone else has seen, and thinking what no-one else has thought (Einstein)." },
        { term: 'Creative thinking', def: 'The ability to think, imagine or invent something new.' },
        { term: 'Dropshipping', def: "You don't hold the stock; the manufacturer or wholesaler supplies your customer directly." },
      ]}
      figure={figure}
      steps={[
        { caption: 'We all have abundant, easy access to information, so everyone can see the same things.' },
        { caption: "Creativity is seeing what everyone else has seen, and thinking what no-one else has thought (Einstein): the key is the new thought, not new information." },
        { caption: 'Creative thinking is the ability to think, imagine or invent something new, from taking a different route to campus to a creative way of doing business such as dropshipping.' },
        { caption: "Some people may be naturally creative, but Robinson (2011) assumes people who say they aren't creative haven't learnt what is involved; the lecturer thinks they can improve." },
      ]}
      check={{
        question: "Which line is Einstein's definition of creativity on the slides?",
        options: [
          { text: 'Thinking up new things, as opposed to doing them', why: "That is Theodore Levitt's line, used to contrast creativity with innovation (doing new things)." },
          { text: 'Seeing what everyone has seen, and thinking what no-one has thought', correct: true, why: 'Slide 11 attributes this definition to Einstein: everyone sees the same things; the new thought is the creative part.' },
          { text: 'The ability to think, imagine or invent something new', why: "That is the slides' definition of creative thinking, given without attribution, not Einstein's definition of creativity." },
        ],
      }}
    />
  );
}
