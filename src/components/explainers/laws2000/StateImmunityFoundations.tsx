/*
SCENE: State immunity — two gates in sequence, with side doors that open only the first
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Immunity, grounded in sovereign equality and customary law, is a procedural bar with two gates —
  adjudication, then enforcement — and consent, participation or a counterclaim open only the first.
SUBJECT: the claim's path down the spine through gate 1 and up to gate 2.
STEP 1: the ground — sovereign equality; custom (UNCSI 2004 not in force: 25 of 30); arts 5–6; "state" art 2(1)(b).
STEP 2: gate 1 — adjudication: can the court hear it? decided first; says nothing of lawfulness.
STEP 3: side doors into gate 1 — express consent (art 7), participation (art 8), counterclaim (art 9); no reclaiming.
STEP 4: gate 2 — enforcement: can the judgment be executed (e.g. confiscating assets)? still shut.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all four captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades.
Source: concept laws2000-w06-state-immunity-foundations; UNCSI 2004 arts 2(1)(b), 5–9; State Immunity Act 1978 (UK);
  Foreign States Immunities Act 1985 (Cth).
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;

function Gate({ y, n, title, q, id }: { y: number; n: number; title: string; q: string; id: string }) {
  return (
    <>
      <line x1="200" y1={y} x2="200" y2={y + 70} stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
      <line x1="200" y1={y + 35} x2="320" y2={y + 35} stroke="var(--ink)" strokeWidth="2" />
      <line x1="320" y1={y} x2="320" y2={y + 70} stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
      <text x="180" y={y - 26} textAnchor="middle" {...ui} data-label={id}>GATE {n} · {title}</text>
      <text x="180" y={y - 8} textAnchor="middle" {...note}>{q}</text>
    </>
  );
}

const DOORS = [
  { y: 186, t: 'express consent · art 7' },
  { y: 210, t: 'participation · art 8' },
  { y: 234, t: 'counterclaim · art 9' },
];

const figure = (
  <svg viewBox={`0 0 ${W} 530`} role="img" aria-label="Two gates: adjudication then enforcement; side doors for consent, participation and counterclaim open only the first">
    <g data-step="1">
      <rect x="8" y="8" width={W - 16} height="96" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x="24" y="32" {...ui} data-label="basis">GROUND: SOVEREIGN EQUALITY</text>
      <text x="24" y="54" {...note}>source: custom — UNCSI 2004 not in force</text>
      <text x="24" y="73" {...note}>(25 of 30 ratifications); arts 5–6 reflect it</text>
      <text x="24" y="92" {...note}>“state”: organs, units, agencies (art 2(1)(b))</text>
    </g>
    <g data-step="2">
      <Gate y={170} n={1} id="adjudication" title="ADJUDICATION" q="can the court hear it? — decided first" />
      <line x1="260" y1="104" x2="260" y2="124" stroke="var(--ink-3)" strokeWidth="1.5" />
    </g>
    <g data-step="3">
      {DOORS.map((d) => (
        <g key={d.t}>
          <line x1="8" y1={d.y} x2="196" y2={d.y} stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="8" y={d.y - 5} {...note} fontSize="12">{d.t}</text>
        </g>
      ))}
      <text x="8" y="296" {...note}>side doors open gate 1 only; once waived,</text>
      <text x="8" y="315" {...note}>immunity cannot be reclaimed on losing</text>
    </g>
    <g data-step="4">
      <line x1="260" y1="330" x2="260" y2="382" stroke="var(--ink-3)" strokeWidth="1.5" />
      <Gate y={430} n={2} id="enforcement" title="ENFORCEMENT" q="can the judgment be executed on the state?" />
      <text x="180" y="518" textAnchor="middle" {...note}>still shut — e.g. no confiscating its assets</text>
    </g>
  </svg>
);

export default function StateImmunityFoundations() {
  return (
    <Diagram
      label="State immunity: adjudication and enforcement as two gates"
      terms={[
        { term: 'Sovereign equality', def: 'States are juridically equal, so none may exercise jurisdiction over another without consent.' },
        { term: 'Immunity from adjudication', def: 'A state cannot be sued before a foreign court unless it consents.' },
        { term: 'Immunity from enforcement', def: 'A judgment cannot be enforced upon the state, for example by confiscating assets.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'State immunity rests on sovereign equality, and its source is custom: the 2004 UN Convention is not in force, but arts 5 and 6 mostly reflect custom. Say so in an exam.' },
        { caption: 'Gate 1 — adjudication: a procedural barrier, decided first, saying nothing about whether the conduct was lawful. The UK State Immunity Act 1978 presumes immunity; Australia’s 1985 Act is similar.' },
        { caption: 'No immunity where the state expressly consents (art 7), participates in the proceedings (art 8) or faces a counterclaim (art 9). Once waived, immunity cannot be reclaimed when judgment goes against it.' },
        { caption: 'Gate 2 — enforcement: a separate immunity. A judgment still cannot simply be executed against the state’s property. Prescriptive jurisdiction is untouched throughout.' },
      ]}
      check={{
        question: 'A foreign state takes part in proceedings on the merits and loses. It now claims immunity from that judgment’s adjudication. What follows?',
        options: [
          { text: 'It can reclaim immunity because the judgment went against it', why: 'Once waived, immunity cannot be reclaimed when judgment goes against the state.' },
          { text: 'Participation (art 8) waived adjudicative immunity, and it cannot be reclaimed', correct: true, why: 'Participating in the proceedings opens the first gate, and the state cannot shut it after losing.' },
          { text: 'Immunity never applies because the 2004 Convention is not in force', why: 'The Convention is not in force, but immunity applies as custom, which its articles mostly reflect.' },
        ],
      }}
    />
  );
}
