/*
SCENE: Treaties and custom — one rule, three relationships, two sources side by side
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: A rule can be treaty and custom at once: a treaty codifies, crystallises or generates custom, and each ends
  with both existing in parallel — so a non-party can still rely on the customary rule.
SUBJECT: the three arrows leaving the one rule and landing on the same "coexist" mark.
STEP 1: one rule. STEP 2: codifies / crystallises / generates (Nicaragua; North Sea).
STEP 3: each lands on treaty + custom coexisting. STEP 4: self-defence — custom and UN Charter art 51.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all four captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades.
Source: concept laws2000-w02-relationship-between-treaties-and-custom; case cards nicaragua-v-united-states-of-america,
  north-sea-continental-shelf-cases.
*/
import { Diagram } from '../bases/Diagram';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;
const line = { stroke: 'var(--ink)', strokeWidth: 1.5, fill: 'none' } as const;

const WAYS = [
  { x: 62, a: 'codifies', b: 'pre-existing', c: 'custom' },
  { x: 180, a: 'crystallises', b: 'developing', c: 'custom' },
  { x: 298, a: 'generates', b: 'a new rule', c: 'of custom' },
];

const figure = (
  <svg viewBox="0 0 360 470" role="img" aria-label="One rule; a treaty codifies, crystallises or generates custom; in each case treaty and custom coexist">
    <g data-step="1">
      <rect x="110" y="8" width="140" height="40" rx="10" {...line} />
      <text x="180" y="33" textAnchor="middle" {...ui} data-label="rule">ONE RULE</text>
    </g>
    <g data-step="2">
      {WAYS.map((w) => (
        <g key={w.a}>
          <line x1="180" y1="48" x2={w.x} y2="84" {...line} />
          <rect x={w.x - 56} y="84" width="112" height="70" rx="8" {...line} />
          <text x={w.x} y="106" textAnchor="middle" {...ui} fontSize="12" data-label={w.a}>{w.a.toUpperCase()}</text>
          <text x={w.x} y="126" textAnchor="middle" {...note} fontSize="12.5">{w.b}</text>
          <text x={w.x} y="143" textAnchor="middle" {...note} fontSize="12.5">{w.c}</text>
        </g>
      ))}
      <text x="180" y="176" textAnchor="middle" {...note} fontSize="12.5" fontStyle="italic">Nicaragua · North Sea Continental Shelf</text>
    </g>
    <g data-step="3">
      {WAYS.map((w) => (
        <g key={w.a}>
          <line x1={w.x} y1="186" x2={w.x} y2="206" {...line} />
          <circle cx={w.x - 9} cy="226" r="18" {...line} />
          <circle cx={w.x + 9} cy="226" r="18" {...line} />
          <text x={w.x - 16} y="231" textAnchor="middle" {...ui} fontSize="11">T</text>
          <text x={w.x + 16} y="231" textAnchor="middle" {...ui} fontSize="11">C</text>
        </g>
      ))}
      <text x="180" y="272" textAnchor="middle" {...note} fill="var(--ink)">each way ends the same: treaty + custom coexist</text>
    </g>
    <g data-step="4">
      <rect x="8" y="296" width="344" height="164" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x="22" y="320" {...ui} data-label="self-defence">EXAMPLE · SELF-DEFENCE</text>
      <text x="22" y="344" {...note}>custom</text>
      <text x="170" y="344" {...note}>UN Charter art 51</text>
      <line x1="22" y1="356" x2="150" y2="356" stroke="var(--ink)" strokeWidth="2.5" />
      <line x1="170" y1="356" x2="338" y2="356" stroke="var(--ink)" strokeWidth="2.5" />
      <text x="22" y="384" {...note}>two rules in parallel: a state not party to</text>
      <text x="22" y="402" {...note}>the Charter still has a right of self-defence,</text>
      <text x="22" y="420" {...note}>relying on custom — which may specify the</text>
      <text x="22" y="438" {...note}>right differently from the treaty version</text>
    </g>
  </svg>
);

export default function RelationshipBetweenTreatiesAndCustom() {
  return (
    <Diagram
      label="Treaties and custom: codification, crystallisation and generation, with both sources coexisting"
      terms={[
        { term: 'Codify', def: 'A treaty writes down a rule of custom that already exists.' },
        { term: 'Crystallise', def: 'A treaty prompts the intense practice that completes a developing custom.' },
        { term: 'Generate', def: 'Practice on a genuinely new issue grows around a treaty provision into new custom.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'A rule may be in a treaty and be a rule of custom at the same time — the two are not mutually exclusive.' },
        { caption: 'Nicaragua identifies three relationships: a treaty codifies pre-existing custom, crystallises developing custom, or generates entirely new custom. North Sea Continental Shelf confirms them.' },
        { caption: 'Whichever way it happens, the result is the same: the treaty rule and the customary rule exist in parallel.' },
        { caption: 'Self-defence is custom and also UN Charter art 51. A state need not be a Charter party to have the right; it can rely on custom, which may specify the right differently.' },
      ]}
      check={{
        question: 'State Y is not party to a treaty whose rule it wants to rely on. What should you check?',
        options: [
          { text: 'Nothing: without the treaty Y has no entitlement', why: 'The card warns against this — the same rule may exist in custom.' },
          { text: 'Whether the same rule also exists in customary international law', correct: true, why: 'Treaty and custom can coexist; a non-party can rely on the parallel customary rule.' },
          { text: 'Whether the treaty has displaced custom on the point', why: 'Do not assume a treaty provision displaces a parallel customary rule.' },
        ],
      }}
    />
  );
}
