/*
SCENE: Who may invoke responsibility — three rings around a breached obligation
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Standing widens ring by ring — the injured state it was owed to, a group with a collective interest, the
  whole international community for erga omnes obligations — so ask to whom the obligation was owed.
SUBJECT: the rings, drawn centre-out; each ring's number keys a legend row beneath.
STEP 1: ring 1 — the injured state (art 42).
STEP 2: ring 2 — a group sharing a collective interest (art 48(1)(a)).
STEP 3: ring 3 — the international community as a whole, erga omnes (art 48(1)(b); Barcelona Traction).
STEP 4: the question — to whom was it owed?
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all four captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades.
Source: concept laws2000-w07-invocation-of-responsibility; ARSIWA arts 42, 48; Barcelona Traction.
*/
import { Diagram } from '../bases/Diagram';

const W = 360, CX = 180, CY = 186;
const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;
const arc = (r: number) => `M ${CX - r} ${CY} A ${r} ${r} 0 0 1 ${CX + r} ${CY}`;

const RINGS = [
  { r: 56, id: 'injured', title: 'INJURED STATE (art 42)', lines: ['obligation owed to it — bilateral or', 'multilateral; alone or as a group'] },
  { r: 112, id: 'group', title: 'GROUP, COLLECTIVE INTEREST', lines: ['art 48(1)(a): nuclear-free zone treaty,', 'regional human rights system'] },
  { r: 166, id: 'community', title: 'EVERYONE: ERGA OMNES', lines: ['art 48(1)(b), Barcelona Traction: force,', 'aggression, genocide, environment'] },
];

const figure = (
  <svg viewBox={`0 0 ${W} 490`} role="img" aria-label="Three rings around a breached obligation: the injured state, a group with a collective interest, the international community as a whole">
    <line x1="6" y1={CY} x2={W - 6} y2={CY} stroke="var(--ink-3)" strokeWidth="1.5" />
    <circle cx={CX} cy={CY} r="4" fill="var(--ink)" />
    <text x={CX} y={CY + 20} textAnchor="middle" {...note} fill="var(--ink)">the breached obligation</text>
    {RINGS.map((g, i) => {
      const inner = i ? RINGS[i - 1].r : 0;
      const y = 234 + i * 66;
      return (
        <g key={g.id} data-step={i + 1}>
          <path d={arc(g.r)} fill="none" stroke="var(--ink)" strokeWidth={i === 0 ? 2 : 1.5} />
          <text x={CX} y={CY - (inner + g.r) / 2 + 5} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" fill="var(--ink)">{i + 1}</text>
          <text x="16" y={y} {...ui} data-label={g.id}><tspan fontFamily="var(--font-mono)">{i + 1}  </tspan>{g.title}</text>
          {g.lines.map((l, k) => <text key={l} x="34" y={y + 20 + k * 18} {...note}>{l}</text>)}
        </g>
      );
    })}
    <g data-step="4">
      <rect x="8" y="428" width={W - 16} height="50" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 5" />
      <text x={CX} y="458" textAnchor="middle" {...ui} data-label="question">ASK: TO WHOM WAS IT OWED?</text>
    </g>
  </svg>
);

export default function InvocationOfResponsibility() {
  return (
    <Diagram
      label="Who may invoke responsibility: three rings of standing"
      terms={[
        { term: 'Invoke responsibility', def: 'Demand cessation, reparation and so on from the responsible state.' },
        { term: 'Injured state', def: 'A state to which the breached obligation was owed (art 42).' },
        { term: 'Erga omnes', def: 'Owed to the international community as a whole; all states have a legal interest (Barcelona Traction).' },
      ]}
      figure={figure}
      steps={[
        { caption: 'The rule: only the state or states whose individual rights were violated may invoke responsibility. A state is injured if the obligation breached was owed to it — for instance under a bilateral or multilateral treaty — individually or as one of a group (art 42).' },
        { caption: 'In very limited circumstances a non-injured state may invoke responsibility (art 48(1)(a)): the obligation is owed to a group including it and protects a collective interest of the group — a regional nuclear-free zone treaty, or a regional human rights system.' },
        { caption: 'Or (art 48(1)(b)) the obligation is owed to the international community as a whole — erga omnes (Barcelona Traction, ICJ 1970). The slides’ examples: non-use of force, the prohibition of aggression and genocide, and breaches of international environmental law.' },
        { caption: 'So ask: to whom was this obligation owed? If to the claimant, it is injured (art 42); if to a collective or to everyone, art 48 may still give it standing.' },
      ]}
      check={{
        question: 'State X commits genocide against its own population. State Y suffered no direct injury. Can Y invoke X’s responsibility?',
        options: [
          { text: 'No — only an injured state may invoke responsibility', why: 'That is the general rule, but art 48 makes exceptions for collective and erga omnes obligations.' },
          { text: 'Yes — the prohibition of genocide is owed erga omnes (art 48(1)(b))', correct: true, why: 'All states have a legal interest in its protection (Barcelona Traction).' },
          { text: 'Only if Y is party to a regional human rights system with X', why: 'That is art 48(1)(a); the erga omnes route in art 48(1)(b) needs no shared group.' },
        ],
      }}
    />
  );
}
