/*
SCENE: The ICJ — two lanes out of one court, and how far each decision reaches
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Contentious cases (states only) end in judgments that are final, without appeal and binding on the parties
  alone, enforced through art 94 UN Charter; advisory opinions (UN organs and agencies) carry weight but bind no one.
SUBJECT: the spine from the Court down its two lanes; the fence around "the parties" in the contentious lane.
STEP 1: the Court — principal judicial organ, The Hague, 15 judges, 9-year terms, ad hoc judge.
STEP 2: contentious lane — states only (art 34); final, without appeal (art 60); parties only (arts 59, 61).
STEP 3: non-compliance — art 94: to the Security Council, which may recommend or decide on measures (art 94(2)).
STEP 4: advisory lane — UN organs and specialised agencies (art 96; art 65); non-binding but weighty (Chagos).
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all four captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades. Narrow 360-unit canvas.
Source: concept laws2000-w08-icj-cases-and-effect-of-decisions; Week 8 slides 25–28, 31, 35; live lecture (Part A).
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;

function Box({ y, h, title, lines, id, dashed, x = 44 }: { y: number; h: number; title: string; lines: string[]; id: string; dashed?: boolean; x?: number }) {
  return (
    <>
      <rect x={x} y={y} width={W - x - 8} height={h} rx="12" fill="none" stroke={dashed ? 'var(--ink-3)' : 'var(--ink)'} strokeWidth="1.5" strokeDasharray={dashed ? '6 5' : undefined} />
      <text x={x + 14} y={y + 24} {...ui} data-label={id}>{title}</text>
      {lines.map((l, i) => <text key={l} x={x + 14} y={y + 46 + i * 19} {...note}>{l}</text>)}
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 600`} role="img" aria-label="The ICJ with two lanes: contentious cases ending in a judgment binding only the parties, enforced through the Security Council, and advisory opinions that bind no one">
    <g data-step="1">
      <Box id="court" x={8} y={8} h={84} title="THE ICJ — THE HAGUE" lines={['principal judicial organ of the UN', '15 judges · 9-year terms · ad hoc judge']} />
    </g>
    <g data-step="2">
      <line x1="24" y1="92" x2="24" y2="186" stroke="var(--ink)" strokeWidth="1.5" />
      <line x1="24" y1="186" x2="44" y2="186" stroke="var(--ink)" strokeWidth="1.5" />
      <Box id="contentious" y={118} h={142} title="CONTENTIOUS CASES" lines={['brought by states only (art 34)', 'judgment final, without appeal (art 60)', 'binds the parties only (arts 59, 61) —', 'not third states']} />
    </g>
    <g data-step="3">
      <line x1="196" y1="260" x2="196" y2="286" stroke="var(--ink-3)" strokeWidth="1.5" />
      <Box id="security-council" y={286} h={104} title="IF A PARTY DOES NOT COMPLY" lines={['art 94: members must comply', 'art 94(2): recommendations or', 'measures to give effect to it']} dashed />
    </g>
    <g data-step="4">
      <line x1="24" y1="186" x2="24" y2="490" stroke="var(--ink)" strokeWidth="1.5" />
      <line x1="24" y1="490" x2="44" y2="490" stroke="var(--ink)" strokeWidth="1.5" />
      <Box id="advisory" y={418} h={142} title="ADVISORY OPINIONS" lines={['asked by UN organs and specialised', 'agencies (art 96 Charter; art 65)', 'non-binding — but weighty', 'e.g. Chagos (General Assembly)']} />
    </g>
  </svg>
);

export default function IcjCasesAndEffectOfDecisions() {
  return (
    <Diagram
      label="The ICJ: contentious cases, advisory opinions and the effect of decisions"
      terms={[
        { term: 'Contentious case', def: 'A legal dispute between states, submitted by them.' },
        { term: 'Advisory opinion', def: 'An answer to a legal question from a UN organ or specialised agency.' },
        { term: 'Third state', def: 'A state not party to the case — not bound by the judgment.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'The ICJ is the principal judicial organ of the UN, in The Hague: 15 regular judges elected by the Security Council and General Assembly for 9 years, plus any ad hoc judge a party appoints.' },
        { caption: 'Contentious cases: only states may be parties (art 34). The judgment is final and without appeal (art 60) and binds only the parties — a judgment between Australia and New Zealand does not bind Indonesia (arts 59, 61).' },
        { caption: 'If a party does not comply, the other may go to the Security Council (art 94), which can make recommendations or decide on measures to give effect to the judgment (art 94(2)).' },
        { caption: 'Advisory opinions answer legal questions from UN organs and specialised agencies (art 96 UN Charter; art 65 Statute). They are non-binding but carry weight — e.g. the Chagos opinion requested by the General Assembly.' },
      ]}
      check={{
        question: 'The ICJ decides a maritime dispute between Australia and New Zealand. Does the judgment bind Indonesia?',
        options: [
          { text: 'Yes — ICJ judgments bind all UN members', why: 'A judgment binds only the parties to the dispute and cannot oblige third parties.' },
          { text: 'No — it binds only the parties to that dispute', correct: true, why: 'Arts 59, 60 and 61: final and without appeal, but binding only on the parties.' },
          { text: 'Only if Indonesia has made an optional clause declaration', why: 'Accepting jurisdiction in general does not make another case’s judgment binding on a non-party.' },
        ],
      }}
    />
  );
}
