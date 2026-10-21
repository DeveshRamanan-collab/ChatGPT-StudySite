/*
SCENE: The International Bill of Rights — one declaration and two Covenants, and the numbering trap between them
LENGTH: 4 steps, scroll-drawn when pinned (≈ 320vh); Next/Back otherwise (Diagram base)
BEATS: 1 the roof and the UDHR · 2 the ICCPR panel · 3 the ICESCR panel · 4 same-numbered rows outlined across both
INTENT: Fix the three parts of the Bill and show that the same article number names a different right in each Covenant.
SUBJECT: the panel being drawn; in step 4, the dashed outlines joining rows 6, 8 and 11 across the two Covenants.
BEAT 1 (0–25%): header bar and UDHR box draw on (DrawSVG, ease none), text fades in.
BEAT 2 (25–50%): ICCPR box and its eight article rows. BEAT 3 (50–75%): ICESCR box and its seven rows.
BEAT 4 (75–100%): dashed outlines across rows 6, 8 and 11; the summary lines fade in.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished diagram with all four captions stacked (base).
BUDGET: < 6 KB gz (DrawSVG is in the shared motion chunk). Narrow 360-unit canvas so 13px labels stay legible on phones.
Source: concept laws2000-w12-international-bill-of-rights; authorities universal-declaration-of-human-rights-1948,
  iccpr-arts-6-13, icescr-arts-6-12; Week 12 lecture slides 7–10 (article headings as the slides list them).
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ROW0 = 262;
const STEP = 22;
const ui = { fontFamily: 'var(--font-ui)' } as const;

const ICCPR: [string, string][] = [
  ['6', 'life'], ['7', 'torture'], ['8', 'slavery'], ['9', 'liberty & security'],
  ['10', 'detention'], ['11', 'breach of contract'], ['12', 'movement'], ['13', 'aliens'],
];
const ICESCR: [string, string][] = [
  ['6', 'work'], ['7', 'work conditions'], ['8', 'trade unions'], ['9', 'social security'],
  ['10', 'family'], ['11', 'food, clothing,'], ['', 'housing'], ['12', 'health'],
];

function Panel({ x, title, rows, id }: { x: number; title: string; rows: [string, string][]; id: string }) {
  return (
    <>
      <rect x={x} y="206" width="164" height="230" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={x + 82} y="234" textAnchor="middle" {...ui} fontSize="13" letterSpacing="1.2" fill="var(--ink)" data-label={id}>{title}</text>
      {rows.map(([n, label], i) => (
        <text key={i} x={x + 12} y={ROW0 + i * STEP} {...ui} fontSize="13" fill="var(--ink-2)">
          <tspan fontFamily="var(--font-mono)" fill="var(--ink)">{n}</tspan>
          <tspan x={x + 38}>{label}</tspan>
        </text>
      ))}
    </>
  );
}

const outline = (row: number) => (
  <rect key={row} x="12" y={ROW0 + row * STEP - 16} width={W - 24} height="22" rx="4" fill="none" stroke="var(--ink-3)" strokeWidth="1.25" strokeDasharray="5 4" />
);

const figure = (
  <svg viewBox={`0 0 ${W} 560`} role="img" aria-label="The International Bill of Rights: the UDHR above the ICCPR and the ICESCR, with articles 6, 8 and 11 outlined across both Covenants because the same number protects a different right in each">
    <g data-step="1">
      <rect x="8" y="10" width={W - 16} height="40" rx="8" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="35" textAnchor="middle" {...ui} fontSize="13" letterSpacing="1.4" fill="var(--ink)" data-label="bill">INTERNATIONAL BILL OF RIGHTS</text>
      <line x1={W / 2} y1="50" x2={W / 2} y2="64" stroke="var(--ink-3)" strokeWidth="1.5" />
      <rect x="8" y="64" width={W - 16} height="124" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="90" textAnchor="middle" {...ui} fontSize="13" letterSpacing="1.2" fill="var(--ink)" data-label="udhr">UDHR · 10 DEC 1948</text>
      <text x={W / 2} y="116" textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">Art 2: every right for everyone,</text>
      <text x={W / 2} y="136" textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">“without distinction of any kind”</text>
      <text x={W / 2} y="160" textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">Art 1: “All human beings are born</text>
      <text x={W / 2} y="180" textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">free and equal” (Hansa Mehta)</text>
    </g>
    <g data-step="2">
      <line x1="92" y1="188" x2="92" y2="206" stroke="var(--ink-3)" strokeWidth="1.5" />
      <Panel x={8} title="ICCPR · 1966" rows={ICCPR} id="iccpr" />
    </g>
    <g data-step="3">
      <line x1="268" y1="188" x2="268" y2="206" stroke="var(--ink-3)" strokeWidth="1.5" />
      <Panel x={188} title="ICESCR · 1966" rows={ICESCR} id="icescr" />
    </g>
    <g data-step="4">
      {[0, 2, 5].map(outline)}
      <text x={W / 2} y="470" textAnchor="middle" {...ui} fontSize="13" letterSpacing="1.2" fill="var(--ink)">SAME NUMBER, DIFFERENT RIGHT</text>
      <text x={W / 2} y="496" textAnchor="middle" fontFamily="var(--font-body)" fontSize="14" fill="var(--ink-2)">art 6: life | work · art 8: slavery | unions</text>
      <text x={W / 2} y="520" textAnchor="middle" fontFamily="var(--font-body)" fontSize="14" fill="var(--ink-2)">art 11: breach of contract | food, housing</text>
      <text x={W / 2} y="546" textAnchor="middle" {...ui} fontSize="13" fill="var(--ink-2)">Always name the Covenant with the article.</text>
    </g>
  </svg>
);

export default function InternationalBillOfRights() {
  return (
    <Diagram
      label="The International Bill of Rights: UDHR, ICCPR and ICESCR"
      terms={[
        { term: 'International Bill of Rights', def: 'The UDHR together with the two 1966 Covenants, the ICCPR and the ICESCR.' },
        { term: 'UDHR', def: 'The Universal Declaration of Human Rights, 10 December 1948 — the first of the three parts.' },
        { term: 'ICCPR / ICESCR', def: 'The Covenants on Civil and Political Rights and on Economic, Social and Cultural Rights, both dated 16 December 1966.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'The Bill has three parts. First the UDHR (10 December 1948): every right for everyone “without distinction of any kind” (art 2), and — credited to Hansa Mehta — “All human beings are born free and equal” (art 1).' },
        { caption: 'The ICCPR (16 December 1966): life (art 6), torture (7), slavery (8), liberty and security (9), detention (10), no imprisonment for breach of contract (11), movement (12), aliens (13).' },
        { caption: 'The ICESCR (16 December 1966): work (art 6), just and favourable conditions (7), trade unions (8), social security (9), family (10), adequate food, clothing and housing (11), health (12).' },
        { caption: 'Same number, different right: art 6 is life in the ICCPR but work in the ICESCR; art 8 is slavery v trade unions; art 11 is breach of contract v food, clothing and housing.' },
      ]}
      check={{
        question: 'An answer cites “art 11” for a right to adequate housing. Which provision is it?',
        options: [
          { text: 'ICCPR art 11', why: 'ICCPR art 11 is the bar on imprisonment for breach of contract — the same number, but a different right.' },
          { text: 'ICESCR art 11', correct: true, why: 'ICESCR art 11 protects the right to “adequate food, clothing and housing”, an economic and social right.' },
          { text: 'UDHR art 12', why: 'UDHR art 12 protects privacy, family and home from interference; it is not the adequate-housing right, and it is not art 11.' },
        ],
      }}
    />
  );
}
