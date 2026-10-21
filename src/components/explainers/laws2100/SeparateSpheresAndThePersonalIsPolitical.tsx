/*
SCENE: Separate spheres and "the personal is the political" — a wall between two spheres, then four arrows across it
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Separate spheres ideology put men in a public sphere and women in a private one, and law incorporated the
  line; the feminist slogan keeps the distinction but denies the separation: inequality, power and injustice cross it.
SUBJECT: the wall line, then the four arrows crossing it.
STEPS: 1 public sphere / wall / private sphere · 2 Bradwell: the domestic sphere and the family; law incorporates the
  line · 3 "the personal is the political": distinguished, not separate · 4 four arrows across the wall · 5 reforms.
REDUCED MOTION: the finished diagram with all five captions stacked.
BUDGET: < 6 KB gz. 360-unit canvas, strokes only (no fills that would show before their step).
Source: concept laws2100-w08-separate-spheres-and-the-personal-is-political; case bradwell-v-illinois; authority
  crimes-legislation-amendment-sexual-consent-reforms-act-2021-nsw; week 8 notes (slides 6, 17, 23).
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;
const WALL = 150;
// Four crossings: x position, direction (up = private → public), legend.
const ARROWS: { x: number; up: boolean; n: string; text: string }[] = [
  { x: 40, up: true, n: '1', text: 'private inequality → public disadvantage' },
  { x: 100, up: false, n: '2', text: 'the politics of power permeates the home' },
  { x: 260, up: true, n: '3', text: 'private problems → systemic injustice' },
  { x: 320, up: true, n: '4', text: 'the family → a political institution' },
];
const REFORMS = ['provocation defence tightened up', 'marital rape exception removed', 'NSW 2021: consent not presumed; ongoing, mutual'];

const arrow = (x: number, up: boolean) => {
  const y1 = up ? 214 : 86, y2 = up ? 86 : 214;
  const tip = up ? `M${x - 6} ${y2 + 9} L${x} ${y2} L${x + 6} ${y2 + 9}` : `M${x - 6} ${y2 - 9} L${x} ${y2} L${x + 6} ${y2 - 9}`;
  return (
    <g key={x}>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke="var(--ink)" strokeWidth="1.5" />
      <path d={tip} fill="none" stroke="var(--ink)" strokeWidth="1.5" />
    </g>
  );
};

const figure = (
  <svg viewBox={`0 0 ${W} 572`} role="img" aria-label="A public sphere for men above a wall and a private sphere for women and children below; four arrows cross the wall; three reforms below">
    <g data-step="1">
      <rect x="8" y="8" width={W - 16} height="120" rx="12" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <text x="22" y="32" {...head} data-label="public">PUBLIC SPHERE · MEN</text>
      <line x1="8" y1={WALL} x2={W - 8} y2={WALL} stroke="var(--ink)" strokeWidth="3" />
      <rect x="8" y="172" width={W - 16} height="120" rx="12" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <text x="22" y="240" {...head} data-label="private">PRIVATE SPHERE · WOMEN (AND CHILDREN)</text>
    </g>
    <g data-step="2">
      <text x="22" y="56" {...body} fontSize={12} fill="var(--ink-2)">“the occupations of civil life”</text>
      <text x="22" y="274" {...body} fontSize={12} fill="var(--ink-2)">“the domestic sphere” · the family</text>
      <text x="22" y="76" {...body} fontSize={12}>the law incorporates the line below</text>
    </g>
    <g data-step="3">
      <rect x="128" y={WALL - 24} width="104" height="48" rx="14" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="5 4" />
      <text x={W / 2} y={WALL - 6} textAnchor="middle" {...body} fontSize={12}>the personal</text>
      <text x={W / 2} y={WALL + 16} textAnchor="middle" {...body} fontSize={12}>is the political</text>
    </g>
    <g data-step="4">
      {ARROWS.map((a) => arrow(a.x, a.up))}
      {ARROWS.map((a) => <text key={a.n} x={a.x + 9} y={a.up ? 112 : 196} {...head} fill="var(--ink)">{a.n}</text>)}
      {ARROWS.map((a, i) => (
        <text key={a.text} x="8" y={330 + i * 22} {...body} fontSize={12}>{`${a.n}  ${a.text}`}</text>
      ))}
    </g>
    <g data-step="5">
      <rect x="8" y="432" width={W - 16} height="128" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x="22" y="456" {...head}>PRACTICAL ACHIEVEMENTS</text>
      {REFORMS.map((r, i) => <text key={r} x="22" y={484 + i * 24} {...body} fontSize={12}>{r}</text>)}
    </g>
  </svg>
);

export default function SeparateSpheresAndThePersonalIsPolitical() {
  return (
    <Diagram
      label="Separate spheres and the personal is the political: a wall between two spheres, crossed by four arrows"
      terms={[
        { term: 'Separate spheres', def: 'The ideology of a public sphere for men and a private sphere for women (and children).' },
        { term: 'Public–private distinction', def: 'The line the law has incorporated between public life and private, family life.' },
        { term: 'The personal is the political', def: 'The feminist slogan: the spheres can be distinguished, but they are not separate.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Separate spheres ideology: a public sphere for men and a private sphere for women (and children), entrenched in law until relatively recently.' },
        { caption: 'Bradwell v Illinois (1873), Bradley J: women are unfitted "for many of the occupations of civil life"; the family, "founded in the divine ordinance", indicates "the domestic sphere" for womanhood. The law incorporated the distinction.' },
        { caption: 'The challenge: "the personal is the political". Not necessarily an attack on privacy (we value it): the two spheres can be distinguished without being separate.' },
        { caption: 'Four crossings: private inequality is the source of public disadvantage; power permeates the private sphere; women’s private problems are systemic injustice; the family is a political institution.' },
        { caption: 'Practical achievements: the provocation defence tightened up in various jurisdictions; the marital rape exception removed; NSW consent reforms (2021): a free and voluntary agreement, not presumed, with ongoing and mutual communication.' },
      ]}
      check={{
        question: 'What does "the personal is the political" challenge, on the lecture’s reading?',
        options: [
          { text: 'The value of privacy itself', why: 'The lecture says the distinction is not negative per se: we all attach some value to our privacy.' },
          { text: 'The separation of the spheres, which kept claims of justice out of private life', correct: true, why: 'The spheres can be distinguished without being separate; private inequality, power and injustice cross the line.' },
          { text: 'The goal of equal treatment in public life', why: 'Equal treatment in public life is the liberal feminist goal; the slogan goes further, into the private sphere.' },
        ],
      }}
    />
  );
}
