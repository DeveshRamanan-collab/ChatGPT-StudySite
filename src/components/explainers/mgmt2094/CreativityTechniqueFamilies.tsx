/*
SCENE: The four families of creativity techniques
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Sort the lecture's techniques into its four families — rational « serious creativity », gaming, idea
  gathering, irrational — with their originators, then mark the four methods it singles out for marketing & sales.
SUBJECT: the stack of four family boxes; each draws on with its techniques, then the M&S tags appear.
STEPS: 1 rational · 2 gaming · 3 idea gathering · 4 irrational (« non rational ») · 5 the four marketing & sales
  methods tagged (mindmaps, innovation games, lateral thinking/6 hats, brainstorming).
REDUCED MOTION: the finished diagram with all five captions stacked (base).
BUDGET: < 6 KB gz (DrawSVG is in the shared motion chunk). Narrow 360-unit canvas so text stays legible on phones.
Source: concept mgmt2094-w02-creativity-technique-families; week 2 lecture slides 9, 11–13
  (content-src/mgmt2094-w02.yaml); example cards for Altshuller, de Bono, Gordon and Hohmann.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
interface Family { title: string; sub?: string; y: number; lines: { t: string; ms?: boolean }[] }

const FAMILIES: Family[] = [
  { title: 'RATIONAL', sub: '« serious creativity »', y: 8, lines: [{ t: 'TRIZ — Genrich Altshuller' }, { t: 'Lateral thinking, 6 hats — de Bono', ms: true }, { t: 'Mindmaps — Tony Buzan', ms: true }] },
  { title: 'GAMING', y: 128, lines: [{ t: 'Frame games — Thagi' }, { t: 'Improvisation' }, { t: 'Innovation games — Luke Hohmann', ms: true }, { t: 'Constructions: LEGOs, blocs…' }] },
  { title: 'IDEA GATHERING', y: 268, lines: [{ t: 'Brainstorming, brainwriting,', ms: true }, { t: 'method 635, CPS' }, { t: 'Idea boxes, idea intranets,' }, { t: 'participatory innovation' }, { t: 'Crowdsourcing' }] },
  { title: 'IRRATIONAL', sub: '« non rational »', y: 428, lines: [{ t: 'Detour approaches' }, { t: 'Synectics — William Gordon' }, { t: 'Random approaches' }] },
];
const heightOf = (f: Family) => 40 + f.lines.length * 21;

function FamilyBox({ f }: { f: Family }) {
  return (
    <>
      <rect x="8" y={f.y} width={W - 16} height={heightOf(f)} rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="22" y={f.y + 24} fontFamily="var(--font-ui)" fontSize="13" letterSpacing="1.2" fill="var(--ink)" data-label={f.title.toLowerCase().replace(/\s+/g, '-')}>
        {f.title}
        {f.sub && <tspan fontFamily="var(--font-body)" letterSpacing="0" fontSize="13" fill="var(--ink-2)">  {f.sub}</tspan>}
      </text>
      {f.lines.map((l, i) => (
        <text key={l.t} x="22" y={f.y + 46 + i * 21} fontFamily="var(--font-body)" fontSize="14" fill="var(--ink-2)">{l.t}</text>
      ))}
    </>
  );
}

function Tags({ f }: { f: Family }) {
  return (
    <>
      {f.lines.map((l, i) => l.ms ? (
        <g key={l.t}>
          <rect x="306" y={f.y + 33 + i * 21} width="40" height="18" rx="9" fill="none" stroke="var(--ink-3)" strokeWidth="1.2" />
          <text x="326" y={f.y + 46 + i * 21} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10.5" fill="var(--ink-2)">M&amp;S</text>
        </g>
      ) : null)}
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} ${FAMILIES[3].y + heightOf(FAMILIES[3]) + 8}`} role="img" aria-label="Four families of creativity techniques — rational, gaming, idea gathering, irrational — with the four marketing and sales methods tagged">
    {FAMILIES.map((f, i) => (
      <g key={f.title} data-step={i + 1}><FamilyBox f={f} /></g>
    ))}
    <g data-step="5">
      {FAMILIES.map((f) => <Tags key={f.title} f={f} />)}
    </g>
  </svg>
);

export default function CreativityTechniqueFamilies() {
  return (
    <Diagram
      label="Creativity techniques in four families"
      terms={[
        { term: 'Serious creativity', def: 'The rational family: techniques that stay logical (TRIZ, lateral thinking, mindmaps).' },
        { term: 'Analogical reasoning', def: 'Synectics: shift the problem with analogies — direct, symbolic, fantasy.' },
        { term: 'Detour', def: 'Step away from the problem, then return to it to converge.' },
        { term: 'Innovation games', def: 'Fun activities that collect, organise and prioritise ideas.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Rational « serious creativity »: TRIZ applies laws of invention to contradictions; lateral thinking adds a random component; the six hats materialise reasoning attitudes; mindmaps represent ideas visually.' },
        { caption: 'Gaming: frame games, improvisation, innovation games (fun activities that collect, organise and prioritise ideas) and constructions with LEGOs or blocs.' },
        { caption: 'Idea gathering: brainstorming and its variants, idea boxes and intranets (participatory innovation), and crowdsourcing.' },
        { caption: 'Irrational: Synectics makes the familiar strange through analogies; detour approaches distance you from the problem, then return to converge; random approaches.' },
        { caption: 'Tagged M&S: the four methods useful for marketing & sales — mindmaps, innovation games, lateral thinking/6 hats, brainstorming.' },
      ]}
      check={{
        question: 'A team needs a product roadmap and its growth drivers. Which method fits, and which family is it in?',
        options: [
          { text: 'Brainstorming — idea gathering', why: 'Brainstorming’s listed usage is product ideas, solutions, names and slogans.' },
          { text: 'Innovation games — gaming', correct: true, why: 'The marketing & sales slide gives innovation games the usage: product roadmap, identifying growth drivers.' },
          { text: 'Synectics — irrational', why: 'Synectics reframes a problem by analogy; it is not one of the four marketing & sales methods.' },
        ],
      }}
    />
  );
}
