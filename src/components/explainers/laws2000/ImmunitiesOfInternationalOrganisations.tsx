/*
SCENE: Immunities of international organisations — the UN's treaty layers and an accountability valve
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: IO immunities rest on treaty (states grant them) and are functional: the Charter sets the principle, the 1946
  Convention fills it in for the UN and three classes of people, and the price is an alternative forum or waiver —
  tested, and upheld, in Haiti and Srebrenica.
SUBJECT: the stack from Charter to Convention, then the branches, then the valve.
STEP 1: UN Charter art 105 — what is "necessary for the fulfillment of its purposes".
STEP 2: 1946 Convention art II ss 2–4 — the UN: every form of legal process unless waived; no waiver extends to
  execution; premises and archives inviolable.
STEP 3: branches — member representatives (art IV), officials (art V s 18), experts on mission (art VI): official
  words and acts only.
STEP 4: the valve — alternative settlement (s 29), waiver; Haiti (US courts, 2016), Srebrenica (2012, 2013) upheld.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all four captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades.
Source: concept laws2000-w06-immunities-of-international-organisations; UN Charter art 105; CPIUN art II ss 2–4,
  arts IV–VI, s 29; Mothers of Srebrenica.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;

function Layer({ y, h, title, lines, id, dashed }: { y: number; h: number; title: string; lines: string[]; id: string; dashed?: boolean }) {
  return (
    <>
      <rect x="8" y={y} width={W - 16} height={h} rx="12" fill="none" stroke={dashed ? 'var(--ink-3)' : 'var(--ink)'} strokeWidth="1.5" strokeDasharray={dashed ? '6 5' : undefined} />
      <text x="24" y={y + 24} {...ui} data-label={id}>{title}</text>
      {lines.map((l, i) => <text key={i} x="24" y={y + 46 + i * 19} {...note}>{l}</text>)}
    </>
  );
}

const BRANCHES = [
  { x: 64, t: ['REPS OF', 'MEMBERS'], s: 'art IV' },
  { x: 180, t: ['OFFICIALS'], s: 'art V s 18' },
  { x: 296, t: ['EXPERTS ON', 'MISSION'], s: 'art VI' },
];

const figure = (
  <svg viewBox={`0 0 ${W} 600`} role="img" aria-label="UN Charter article 105, then the 1946 Convention, branching to representatives, officials and experts, with an accountability valve">
    <g data-step="1">
      <Layer id="art105" y={8} h={78} title="UN CHARTER ART 105" lines={['what is “necessary for the fulfillment', 'of its purposes” — granted by treaty']} />
    </g>
    <g data-step="2">
      <line x1="180" y1="86" x2="180" y2="104" stroke="var(--ink-3)" strokeWidth="1.5" />
      <Layer id="convention" y={104} h={116} title="1946 CONVENTION · THE UN ITSELF" lines={['immune from every form of legal process', 'unless expressly waived (art II s 2)', 'no waiver extends to execution', 'premises (s 3), archives (s 4) inviolable']} />
    </g>
    <g data-step="3">
      <line x1="64" y1="238" x2="296" y2="238" stroke="var(--ink-3)" strokeWidth="1.5" />
      <line x1="180" y1="220" x2="180" y2="238" stroke="var(--ink-3)" strokeWidth="1.5" />
      {BRANCHES.map((b) => (
        <g key={b.s}>
          <line x1={b.x} y1="238" x2={b.x} y2="256" stroke="var(--ink-3)" strokeWidth="1.5" />
          <circle cx={b.x} cy="262" r="6" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
          {b.t.map((l, i) => <text key={i} x={b.x} y={290 + i * 16} textAnchor="middle" {...ui} fontSize="11.5">{l}</text>)}
          <text x={b.x} y="340" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="12" fill="var(--ink-2)">{b.s}</text>
        </g>
      ))}
      <text x={W / 2} y="368" textAnchor="middle" {...note}>official acts only: functional, never personal</text>
    </g>
    <g data-step="4">
      <Layer id="valve" dashed y={392} h={200} title="ACCOUNTABILITY VALVE" lines={['alternative settlement of private', 'claims (s 29) · waiver', '', 'Haiti cholera (2010): US courts', 'upheld UN immunity (2016)', 'Srebrenica: immunity upheld (2012,', '2013); case went on v the Netherlands']} />
    </g>
  </svg>
);

export default function ImmunitiesOfInternationalOrganisations() {
  return (
    <Diagram
      label="Immunities of international organisations: the UN's treaty layers"
      terms={[
        { term: 'Functional immunity', def: 'Immunity limited to what the organisation, or the person, needs to perform its functions.' },
        { term: 'Adjudication and enforcement', def: 'Being sued, and having a judgment executed — IOs are immune from both.' },
        { term: 'Waiver', def: 'Express surrender of immunity; for the UN it never extends to execution.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Unlike state immunity, IO immunities rest on treaty: states grant them. Charter art 105 gives the UN what is “necessary for the fulfillment of its purposes”.' },
        { caption: 'The 1946 Convention: the UN, its property and assets are immune from every form of legal process unless expressly waived, and no waiver extends to execution. Premises and archives are inviolable.' },
        { caption: 'Member representatives (art IV), officials (art V s 18) and experts on missions (art VI, continuing after the mission) are immune for words and acts in their official capacity.' },
        { caption: 'Accountability: IOs may have to provide alternative settlement for private claims, and can waive. Yet UN immunity was upheld over the Haiti cholera outbreak and in Mothers of Srebrenica.' },
      ]}
      check={{
        question: 'How does the immunity of UN officials differ from the immunity of the UN itself?',
        options: [
          { text: 'Officials are immune only for acts in their official capacity', correct: true, why: 'Officials’ immunity is functional, never personal; the UN itself is immune from every form of legal process.' },
          { text: 'Officials have full personal immunity, like a diplomatic agent', why: 'IO officials’ immunity is limited to official words and acts — functional, never personal.' },
          { text: 'Officials’ immunity comes from custom, the UN’s from treaty', why: 'Both rest on treaty: Charter art 105 and the 1946 Convention.' },
        ],
      }}
    />
  );
}
