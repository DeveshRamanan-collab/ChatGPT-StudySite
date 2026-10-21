/*
SCENE: Diverging and converging — the patterns of creative thinking as a diamond
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Creative thinking opens out (diverging: defer judgement, lots of ideas, accept all, stretch, simmer, odd
  combinations) and then closes in (converging: what is really new, what excites, avoid premature closure, sneaky
  spots, affirmative judgement, eyes on the objective) — as in the Floor Company Exercise: 100 ideas, then a top 3.
SUBJECT: the diamond's outline, with the slide's six behaviours beside each half; the reported idea at the point is
  the one accent element.
STEPS: 1 upper half + diverging list · 2 the ideas multiply (100 in 10 minutes) · 3 lower half + converging list ·
  4 the top 3, and one idea reported to the class.
REDUCED MOTION: the finished diagram with all four captions stacked.
BUDGET: < 8 KB gz (DrawSVG is in the shared motion chunk). Vertical 380-unit canvas so text stays legible on phones.
Source: concept mgmt2094-w06-diverging-and-converging (Week 6 tutorial slides 1, 4 and 5); authority
  mgmt2094-example-floor-company-exercise.
*/
import { Diagram } from '../bases/Diagram';

const W = 380;
const CX = 64;
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2 } as const;
const item = { fontFamily: 'var(--font-ui)', fontSize: 13 } as const;

const DIVERGING = ['defer judgement', 'look for lots of ideas', 'accept all ideas', 'make yourself "stretch"', 'take time to "simmer"', 'bring together odd combinations'];
// [text, y] — two-line items share a bullet.
const CONVERGING: [string, number, boolean][] = [
  ['look for what is really new', 330, true],
  ['what gets people excited,', 354, true],
  ['even if not very realistic', 372, false],
  ['avoid premature closure', 396, true],
  ['take the risk to look at', 420, true],
  ['difficult issues or "sneaky spots"', 438, false],
  ['develop "affirmative judgement"', 462, true],
  ['keep your eyes on your objective', 486, true],
];

// Ideas in the widest part of the upper half (outlines only, so the Diagram base can draw them on).
const IDEAS: [number, number][] = [];
for (const [y, n] of [[206, 3], [226, 5], [246, 6], [266, 7]] as const)
  for (let k = 0; k < n; k++) IDEAS.push([CX + (k - (n - 1) / 2) * 12, y]);

const figure = (
  <svg viewBox={`0 0 ${W} 560`} role="img" aria-label="A diamond: diverging opens out to many ideas, converging closes in to a top three and one idea reported">
    <g data-step="1">
      <text x={CX} y="26" textAnchor="middle" {...head} fill="var(--ink-2)">THE BRIEF</text>
      <path d={`M${CX} 40 L14 280`} fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <path d={`M${CX} 40 L114 280`} fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="136" y="48" {...head} fill="var(--ink-2)" data-label="diverging">DIVERGING</text>
      {DIVERGING.map((d, i) => (
        <text key={d} x="136" y={74 + i * 24} {...item} fill="var(--ink)">· {d}</text>
      ))}
    </g>
    <g data-step="2">
      {IDEAS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.5" fill="none" stroke="var(--ink-2)" strokeWidth="1.25" />)}
      <text x="136" y="240" {...item} fill="var(--ink-2)">lots of ideas: 100 in 10 minutes</text>
    </g>
    <g data-step="3">
      <path d={`M14 280 L${CX} 520`} fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <path d={`M114 280 L${CX} 520`} fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="136" y="306" {...head} fill="var(--ink-2)" data-label="converging">CONVERGING</text>
      {CONVERGING.map(([c, y, bullet]) => (
        <text key={c} x={bullet ? 136 : 146} y={y} {...item} fill="var(--ink)">{bullet ? `· ${c}` : c}</text>
      ))}
    </g>
    <g data-step="4">
      {[52, 64, 76].map((x) => <circle key={x} cx={x} cy="432" r="3.5" fill="none" stroke="var(--ink)" strokeWidth="1.5" />)}
      <circle cx={CX} cy="538" r="7" fill="none" stroke="var(--accent)" strokeWidth="3" />
      <text x="136" y="524" {...item} fill="var(--ink)">pick your top 3 innovative ideas,</text>
      <text x="136" y="542" {...item} fill="var(--ink)">then report one to the class</text>
    </g>
  </svg>
);

export default function DivergingAndConverging() {
  return (
    <Diagram
      label="Patterns of creative thinking: diverging opens out, converging closes in"
      terms={[
        { term: 'Diverging', def: 'Opening out: defer judgement and look for lots of ideas.' },
        { term: 'Converging', def: 'Closing in: look for what is really new, avoid premature closure, keep the objective in view.' },
        { term: 'Premature closure', def: 'Settling on an idea too early, before the others have been weighed.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Diverging opens out: defer judgement, look for lots of ideas, accept all ideas, make yourself "stretch", take time to "simmer", bring together odd combinations.' },
        { caption: 'In the Floor Company Exercise this is the sprint: 100 new floor covering ideas in 10 minutes, with no one judging them yet.' },
        { caption: 'Converging closes in — but it is not just rejecting: it looks for what is really new and exciting even if not very realistic, avoids premature closure, faces the "sneaky spots" and judges affirmatively.' },
        { caption: 'It ends at the objective: pick your top 3 innovative ideas, then report one idea to the rest of the class.' },
      ]}
      check={{
        question: 'Ten minutes into the idea sprint, Tom says "that will never work" to every suggestion. Which pattern is he breaking?',
        options: [
          { text: 'Converging: keep your eyes on your objective', why: 'The team is still generating ideas; that rule belongs to the converging phase later.' },
          { text: 'Converging: avoid premature closure', why: 'Shutting ideas down sounds like closure, but the team is still diverging.' },
          { text: 'Diverging: defer judgement', correct: true, why: 'While generating ideas the slide says defer judgement and accept all ideas; Tom is judging too early.' },
        ],
      }}
    />
  );
}
