/*
SCENE: Forms of jurisdiction — one theft followed through three lanes, with enforcement stopping hard at the border
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Prescription reaches abroad unless prohibited; enforcement abroad is prohibited unless permitted;
  adjudication is in principle territorial.
SUBJECT: the three lane arrows and the border they meet.
STEP 1: the state, the border, abroad.
STEP 2: prescribe — criminalise theft; the arrow crosses the border (Lotus: "a wide measure of discretion").
STEP 3: enforce — arrest, imprison; the arrow stops hard at the border (Lotus; Eichmann 1960).
STEP 4: adjudicate — prosecute; in principle territorial (Lockerbie).
STEP 5: the two rules side by side.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all five captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades.
Source: concept laws2000-w05-forms-of-jurisdiction; SS Lotus.
*/
import { Diagram } from '../bases/Diagram';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;
const ink = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 1.5 } as const;
const BORDER = 250;

const lane = (y: number, to: number, n: number, title: string, lines: string[], id: string, stop = false) => (
  <g data-step={n}>
    <text x="16" y={y} {...ui} data-label={id}><tspan fontFamily="var(--font-mono)">{n - 1}  </tspan>{title}</text>
    <line x1="16" y1={y + 18} x2={to} y2={y + 18} {...ink} strokeWidth="2" />
    {stop ? <line x1={to + 4} y1={y + 6} x2={to + 4} y2={y + 30} stroke="var(--ink)" strokeWidth="3" /> : <polyline points={`${to - 7},${y + 12} ${to},${y + 18} ${to - 7},${y + 24}`} {...ink} strokeWidth="2" />}
    {lines.map((l, i) => <text key={l} x="16" y={y + 42 + i * 18} {...note}>{l}</text>)}
  </g>
);

const figure = (
  <svg viewBox="0 0 360 470" role="img" aria-label="A theft through three lanes: prescription crosses the border, enforcement stops at it, adjudication stays home">
    <g data-step="1">
      <text x="16" y="24" {...ui}>STATE A</text>
      <text x="262" y="24" {...ui}>ABROAD</text>
      <line x1={BORDER} y1="8" x2={BORDER} y2="370" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 5" />
    </g>
    {lane(62, 344, 2, 'PRESCRIBE', ['criminalise theft; reaches abroad', 'unless prohibited (Lotus)'], 'prescribe')}
    {lane(164, 240, 3, 'ENFORCE', ['arrest, imprison; abroad only', 'with a permissive rule —', 'Eichmann (1960) was unlawful'], 'enforce', true)}
    {lane(284, 220, 4, 'ADJUDICATE', ['prosecute; in principle territorial', '(Lockerbie: a Scottish court sat', 'in the Netherlands)'], 'adjudicate')}
    <g data-step="5">
      <rect x="8" y="386" width="344" height="72" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x="22" y="412" {...note} fill="var(--ink)">prescribe abroad: yes, unless prohibited</text>
      <text x="22" y="440" {...note} fill="var(--ink)">enforce abroad: no, unless permitted</text>
    </g>
  </svg>
);

export default function FormsOfJurisdiction() {
  return (
    <Diagram
      label="Three forms of jurisdiction traced through one theft"
      terms={[
        { term: 'Jurisdiction', def: '“The lawful power of a State to define and enforce the rights and duties, and control the conduct” of persons (Oxman).' },
        { term: 'Prescribe', def: 'Make national law applicable — by legislation, executive act, regulation or court determination.' },
        { term: 'Enforce', def: 'Put laws into operation: arrest, seizure, freezing assets, fines.' },
        { term: 'Adjudicate', def: 'Domestic courts hearing and bindingly deciding disputes.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Jurisdiction is linked to sovereignty — supreme authority within a territory — which also implies sovereign equality, territorial control, non-intervention, and sovereign and diplomatic immunity.' },
        { caption: 'Criminalising theft is prescriptive. In Lotus the PCIJ said international law leaves states “a wide measure of discretion” to extend their laws beyond their territory, limited only by prohibitive rules.' },
        { caption: 'Arresting, remanding and imprisoning the thief is enforcement — the most intrusive form. Lotus’s “first and foremost restriction”: failing a permissive rule, a state “may not exercise its power in any form in the territory of another State”. Israel’s 1960 seizure of Eichmann in Argentina was unlawful.' },
        { caption: 'Prosecuting the thief is adjudicative — in principle territorial, though Lockerbie saw a Scottish court sit in the Netherlands applying Scottish law.' },
        { caption: 'So: prescription reaches abroad unless prohibited; enforcement abroad is prohibited unless permitted.' },
      ]}
      check={{
        question: 'State A’s police cross into State B, without B’s consent, to arrest a suspect wanted under A’s law. Lawful?',
        options: [
          { text: 'Yes — A’s law validly extends to the suspect’s conduct', why: 'That is prescription, which can reach abroad; enforcement is a separate question.' },
          { text: 'No — enforcement in another state’s territory needs a permissive rule', correct: true, why: 'Lotus’s first and foremost restriction; Eichmann’s seizure in Argentina was unlawful for this reason.' },
          { text: 'Yes, if A’s courts will try the suspect', why: 'Adjudication at home does not make enforcement in B’s territory lawful.' },
        ],
      }}
    />
  );
}
