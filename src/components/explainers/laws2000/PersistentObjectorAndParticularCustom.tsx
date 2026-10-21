/*
SCENE: Persistent objector and particular custom — a decision flow from "custom established"
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: An established custom generally binds every state, with two exits: it may be particular (regional or two-state),
  and a state that objected from the start, persistently and consistently, is not bound.
SUBJECT: the path from the top box down to "bound" or "not bound".
STEP 1: custom established → whom does it bind? STEP 2: universal / regional / two states (Right of Passage).
STEP 3: objected from the start, persistently and consistently? yes → not bound; no → bound.
STEP 4: Fisheries (UK v Norway); object before crystallisation — rarely successful.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all four captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades.
Source: concept laws2000-w02-persistent-objector-and-particular-custom; case cards fisheries-case-united-kingdom-v-norway,
  right-of-passage-over-indian-territory-portugal-v-india.
*/
import { Diagram } from '../bases/Diagram';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;
const line = { stroke: 'var(--ink)', strokeWidth: 1.5, fill: 'none' } as const;

const SCOPES = [
  { x: 62, a: 'universal', b: 'every state' },
  { x: 180, a: 'regional', b: 'a group of states' },
  { x: 298, a: 'particular', b: 'two states only' },
];

const figure = (
  <svg viewBox="0 0 360 520" role="img" aria-label="Decision flow: an established custom may be universal, regional or between two states; a persistent objector is not bound">
    <g data-step="1">
      <rect x="90" y="8" width="180" height="40" rx="10" {...line} />
      <text x="180" y="33" textAnchor="middle" {...ui} data-label="established">CUSTOM ESTABLISHED</text>
      <line x1="180" y1="48" x2="180" y2="68" {...line} />
      <text x="180" y="86" textAnchor="middle" {...note}>whom does it bind?</text>
    </g>
    <g data-step="2">
      {SCOPES.map((s) => (
        <g key={s.a}>
          <line x1="180" y1="94" x2={s.x} y2="108" {...line} />
          <rect x={s.x - 56} y="108" width="112" height="48" rx="8" {...line} />
          <text x={s.x} y="128" textAnchor="middle" {...ui} fontSize="12" data-label={s.a}>{s.a.toUpperCase()}</text>
          <text x={s.x} y="146" textAnchor="middle" {...note} fontSize="12">{s.b}</text>
        </g>
      ))}
      <text x="298" y="176" textAnchor="middle" {...note} fontSize="12.5" fontStyle="italic">Right of Passage</text>
      <text x="298" y="192" textAnchor="middle" {...note} fontSize="12.5">Portugal v India</text>
    </g>
    <g data-step="3">
      <line x1="62" y1="156" x2="62" y2="226" {...line} />
      <rect x="8" y="226" width="344" height="58" rx="10" {...line} />
      <text x="180" y="250" textAnchor="middle" {...note} fill="var(--ink)">did this state object from the very start,</text>
      <text x="180" y="270" textAnchor="middle" {...note} fill="var(--ink)">persistently and consistently?</text>
      <line x1="100" y1="284" x2="100" y2="318" {...line} />
      <line x1="260" y1="284" x2="260" y2="318" {...line} />
      <text x="108" y="306" {...note} fontSize="12">yes</text>
      <text x="268" y="306" {...note} fontSize="12">no</text>
      <rect x="30" y="318" width="140" height="48" rx="8" fill="none" stroke="var(--ink)" strokeWidth="2.5" />
      <text x="100" y="339" textAnchor="middle" {...ui} data-label="not-bound">NOT BOUND</text>
      <text x="100" y="357" textAnchor="middle" {...note} fontSize="12">persistent objector</text>
      <rect x="190" y="318" width="140" height="48" rx="8" {...line} />
      <text x="260" y="347" textAnchor="middle" {...ui}>BOUND</text>
    </g>
    <g data-step="4">
      <rect x="8" y="392" width="344" height="116" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x="22" y="416" {...ui}>FISHERIES · UK v NORWAY</text>
      <text x="22" y="438" {...note}>the UK’s 10-mile bay rule was not custom —</text>
      <text x="22" y="456" {...note}>and Norway, always opposed, would not</text>
      <text x="22" y="474" {...note}>be bound by it regardless</text>
      <text x="22" y="496" {...note} fill="var(--ink)">object before it crystallises; rarely succeeds</text>
    </g>
  </svg>
);

export default function PersistentObjectorAndParticularCustom() {
  return (
    <Diagram
      label="Particular custom and the persistent objector rule as a decision flow"
      terms={[
        { term: 'Particular custom', def: 'A custom binding only a group of states (regional), or only two states.' },
        { term: 'Persistent objector', def: 'A state that objected to a rule from the very start of its formation, persistently and consistently, and so is not bound.' },
        { term: 'Crystallise', def: 'The point at which a rule under formation becomes established custom.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Once a rule of custom is established, it generally binds every state. First ask: whom does it bind?' },
        { caption: 'Custom can be particular: regional, or between two states only. In Right of Passage, Portugal’s centuries-long access to its enclave through India crystallised into a two-state customary right, with no treaty.' },
        { caption: 'Second exception: a state that objected from the very beginning of the rule’s formation, persistently and consistently, is not bound by it.' },
        { caption: 'Fisheries: the UK’s 10-mile bay rule was not custom at all — and even if it were, Norway had always opposed it. The rule reconciles custom with consent, but the objection must come before crystallisation, so it rarely succeeds.' },
      ]}
      check={{
        question: 'State X first objects to a customary rule twenty years after it became established. Is X bound?',
        options: [
          { text: 'No — any objection lets a state opt out of custom', why: 'Only an objection from the very start of the rule’s formation counts.' },
          { text: 'Yes — the objection came after the rule crystallised', correct: true, why: 'The persistent objector must object before the rule crystallises and keep objecting consistently.' },
          { text: 'No — custom only binds states that signed up to it', why: 'Established custom generally binds every state; the exits are narrow.' },
        ],
      }}
    />
  );
}
