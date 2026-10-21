/*
SCENE: Critical race theory — a "neutral" rule, then the hierarchy CRT finds beneath it, its methods, and its aim
LENGTH: 7 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: CRT argues that laws and institutions can perpetuate racial hierarchies even when they appear neutral; it
  treats race as constructed, questions liberal ideals, uses storytelling, reads whiteness as property, stresses
  intersectionality, and is normative as well as descriptive (with Moreton-Robinson as the Australian example).
SUBJECT: the level "neutral" line, then the stepped line drawn beneath it.
STEPS: 1 origins and influences · 2 a "neutral" rule; race as constructed · 3 the stepped hierarchy beneath ·
  4 storytelling, liberal ideals questioned, whiteness as property · 5 intersectionality · 6 describe → transform ·
  7 Moreton-Robinson.
REDUCED MOTION: the finished diagram with all seven captions stacked.
BUDGET: < 7 KB gz. 360-unit canvas, strokes only.
Source: concept laws2100-w08-critical-race-theory; authority moreton-robinson-talkin-up-to-the-white-woman; week 8
  notes (slides 24–27).
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;
const BOXES: string[][] = [
  ['storytelling:', 'voice to unheard', 'perspectives'],
  ['questions:', 'meritocracy,', 'equal opportunity,', 'colourblindness'],
  ['whiteness as', 'property: legal and', 'social advantages'],
];
const AXES = ['gender', 'class', 'sexuality', 'disability'];

const figure = (
  <svg viewBox={`0 0 ${W} 640`} role="img" aria-label="Critical race theory: origins; a neutral rule with a racial hierarchy beneath it; three methods and targets; intersecting identities; from description to transformation; Moreton-Robinson">
    <g data-step="1">
      <text x="8" y="18" {...head}>ORIGINS</text>
      <line x1="20" y1="44" x2="340" y2="44" stroke="var(--ink-2)" strokeWidth="1.5" />
      <line x1="60" y1="36" x2="60" y2="52" stroke="var(--ink)" strokeWidth="2" />
      <line x1="260" y1="36" x2="260" y2="52" stroke="var(--ink)" strokeWidth="2" />
      <text x="60" y="68" textAnchor="middle" {...body} fontSize={12}>1970s · US</text>
      <text x="260" y="68" textAnchor="middle" {...body} fontSize={12}>1990s · momentum</text>
      <text x="8" y="90" {...body} fontSize={12} fill="var(--ink-2)">slave trade · civil rights · applies to Australia</text>
    </g>
    <g data-step="2">
      <text x="8" y="118" {...head}>A “NEUTRAL” RULE</text>
      <line x1="8" y1="138" x2={W - 8} y2="138" stroke="var(--ink)" strokeWidth="2" />
      <text x="8" y="160" {...body} fontSize={12}>race: constructed; we chose which traits matter</text>
    </g>
    <g data-step="3">
      <path d="M8 228 L120 228 L120 206 L240 206 L240 184 L352 184" fill="none" stroke="var(--ink)" strokeWidth="2" />
      <text x="8" y="252" {...body} fontSize={12}>racism coexists with formal neutrality</text>
    </g>
    <g data-step="4">
      <text x="8" y="282" {...head}>METHODS AND TARGETS</text>
      {BOXES.map((lines, i) => (
        <g key={lines[0]}>
          <rect x={8 + i * 116} y="292" width="112" height="70" rx="8" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
          {lines.map((l, k) => <text key={l} x={64 + i * 116} y={327 - (lines.length - 1) * 7.5 + k * 15} textAnchor="middle" {...body} fontSize={11}>{l}</text>)}
        </g>
      ))}
    </g>
    <g data-step="5">
      <text x="8" y="386" {...head}>INTERSECTIONALITY</text>
      <line x1="80" y1="402" x2="80" y2="478" stroke="var(--ink)" strokeWidth="2" />
      <text x="88" y="405" {...body} fontSize={12}>race</text>
      {AXES.map((a, i) => (
        <g key={a}>
          <line x1="56" y1={414 + i * 18} x2="200" y2={414 + i * 18} stroke="var(--ink-2)" strokeWidth="1.5" />
          <text x="208" y={418 + i * 18} {...body} fontSize={12}>{a}</text>
        </g>
      ))}
    </g>
    <g data-step="6">
      <text x="8" y="508" {...head}>NOT JUST DESCRIPTIVE</text>
      <line x1="20" y1="524" x2="334" y2="524" stroke="var(--ink)" strokeWidth="1.5" />
      <path d="M326 517 L336 524 L326 531" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="20" y="544" {...body} fontSize={12}>describe</text>
      <text x="340" y="544" textAnchor="end" {...body} fontSize={12}>transform: racial justice</text>
    </g>
    <g data-step="7">
      <rect x="8" y="562" width={W - 16} height="70" rx="10" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x="22" y="584" {...head}>MORETON-ROBINSON (2000)</text>
      <text x="22" y="604" {...body} fontSize={12}>white Australian feminism silenced Indigenous</text>
      <text x="22" y="621" {...body} fontSize={12}>women and left their demands out</text>
    </g>
  </svg>
);

export default function CriticalRaceTheory() {
  return (
    <Diagram
      label="Critical race theory: a neutral rule, the hierarchy beneath it, CRT's methods, and its aim of racial justice"
      terms={[
        { term: 'Socially constructed category', def: 'Race exists because we have decided to make certain characteristics, like skin colour, relevant.' },
        { term: 'Colourblindness', def: 'A liberal ideal of ignoring race, which CRT says can obscure structural racism.' },
        { term: 'Whiteness as property', def: 'CRT’s claim that whiteness operates as property, conferring legal and social advantages.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'CRT emerged in the United States in the 1970s and gained momentum in the 1990s (Derrick Bell, Kimberlé Crenshaw, Richard Delgado, Mari Matsuda …), shaped by the trans-Atlantic slave trade and the civil rights movement. Its criticisms apply elsewhere, including Australia.' },
        { caption: 'Liberalism, "the hegemonic ideology of the West", offers a neutral rule. CRT: race is a socially, culturally and legally constructed category.' },
        { caption: 'Beneath the level line: laws and institutions can perpetuate racial hierarchies even when they appear neutral. Racism can coexist with formal "objectivity" and "neutrality", so equal treatment is not enough.' },
        { caption: 'Storytelling, personal narratives and experiential knowledge as sources of legal insight; liberal ideals (meritocracy, equal opportunity, colourblindness) questioned; whiteness as a form of property.' },
        { caption: 'Race intersects with gender, class, sexuality and disability to produce complex forms of discrimination and exclusion. Rights matter, especially for historically disadvantaged minorities.' },
        { caption: 'CRT is not just descriptive but normative: it aims to transform law and society to achieve racial justice. Dworkin, a liberal, also held that legal theory cannot avoid combining the two.' },
        { caption: 'Aileen Moreton-Robinson, Talkin’ Up to the White Woman (2000): white Australian feminism positioned and silenced Indigenous women; their demands on maternity allowances, voting rights and labour rights were left out.' },
      ]}
      check={{
        question: 'Why does CRT doubt that extending equal treatment to every race is enough for racial equality?',
        options: [
          { text: 'Because race is a fixed biological fact that no rule can change', why: 'CRT treats race as socially, culturally and legally constructed, not as a biological fact.' },
          { text: 'Because racism can coexist with formal objectivity and neutrality', correct: true, why: 'A rule can look neutral yet sustain a racial hierarchy, so equal treatment on paper may leave structural racism in place.' },
          { text: 'Because rights are of no use to historically disadvantaged minorities', why: 'CRT stresses the importance of rights, especially for historically disadvantaged minorities.' },
        ],
      }}
    />
  );
}
