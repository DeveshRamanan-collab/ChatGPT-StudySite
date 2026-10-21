/*
SCENE: Design thinking — overlapping spaces, not orderly steps (Brown and Wyatt, 2010) — and the lecture's ideation process
LENGTH: 6 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
BEATS: terms → the straight milestone line → inspiration → ideation → implementation → the loop back → the ideation funnel
INTENT: Design thinking works through three overlapping spaces (inspiration, ideation, implementation) that a project
  may loop through more than once, grounded in what people actually do; the lecture's ideation process has the same
  shape (diverse team, immersion, many ideas, criteria, a shortlist of three to five).
SUBJECT: the three overlapping circles; the loop-back arrow carries the one accent.
BEAT 1 (step 1): a faint straight line with eight ticks — the linear, milestone-based process organisations usually run.
BEAT 2 (step 2): the inspiration circle and Pecknold's reframed brief beneath it.
BEAT 3 (step 3): the ideation circle and T-shaped teams deferring judgement.
BEAT 4 (step 4): the implementation circle and VisionSpring's prototype (children screening each other).
BEAT 5 (step 5): the accent arrow from implementation back to inspiration; Shanti's water centre named in the caption.
BEAT 6 (step 6): the lecture's ideation process as a funnel of five rows narrowing to a shortlist of three to five.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished diagram with all six captions stacked (Diagram base, off); calm plays steps quickly.
BUDGET: < 6 KB gz, no WebGL. 360-unit canvas; circle labels kept to one word plus two short lines.
Source: concept mgmt2094-w08-design-thinking (reading: Brown and Wyatt 2010; Week 8 slides 26–27); authorities
  mgmt2094-brown-and-wyatt-2010-design-thinking-for-social-innovation, mgmt2094-example-pecknold-rwanda-weavers,
  mgmt2094-example-visionspring, mgmt2094-example-naandi-water-centre.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const CY = 150;
const R = 62;
const ui = { fontFamily: 'var(--font-ui)' } as const;
const serif = { fontFamily: 'var(--font-body)' } as const;

const SPACES = [
  { step: 2, id: 'inspiration', cx: 76, title: 'INSPIRATION', fs: 9, sub: ['brief,', 'observe'], eg: ['Pecknold:', 'website brief', 'reframed'] },
  { step: 3, id: 'ideation', cx: 180, title: 'IDEATION', fs: 9, sub: ['synthesise,', 'diverge'], eg: ['T-shaped teams;', 'judgement', 'deferred'] },
  { step: 4, id: 'implementation', cx: 284, title: 'IMPLEMENTATION', fs: 8.2, sub: ['prototype,', 'refine'], eg: ['VisionSpring:', 'children screen', 'each other'] },
] as const;

const FUNNEL = ['a diverse team', 'immersion', 'as many ideas as possible', 'criteria', 'a shortlist of 3–5'];

const figure = (
  <svg viewBox={`0 0 ${W} 450`} role="img" aria-label="Design thinking: three overlapping spaces, inspiration, ideation and implementation, looping back, set against a straight milestone line; below, the lecture's ideation process narrowing to a shortlist">
    <g data-step="1">
      <line x1="30" y1="30" x2={W - 30} y2="30" stroke="var(--ink-3)" strokeWidth="1.2" />
      {Array.from({ length: 8 }, (_, k) => (
        <line key={k} x1={30 + k * (300 / 7)} y1="25" x2={30 + k * (300 / 7)} y2="35" stroke="var(--ink-3)" strokeWidth="1.2" />
      ))}
      <text x={W / 2} y="16" textAnchor="middle" {...ui} fontSize="10" letterSpacing="1" fill="var(--ink-3)">NOT THIS: ORDERLY STEPS, MILESTONES</text>
    </g>
    {SPACES.map((s) => (
      <g key={s.id} data-step={s.step} data-space={s.id}>
        <circle cx={s.cx} cy={CY} r={R} fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x={s.cx} y={CY - 8} textAnchor="middle" {...ui} fontSize={s.fs} letterSpacing="0.5" fill="var(--ink)" data-label={s.id}>{s.title}</text>
        {s.sub.map((l, k) => <text key={l} x={s.cx} y={CY + 10 + k * 15} textAnchor="middle" {...serif} fontSize="12" fill="var(--ink-2)">{l}</text>)}
        {s.eg.map((l, k) => <text key={l} x={s.cx} y={CY + R + 26 + k * 15} textAnchor="middle" {...serif} fontSize="11.5" fill="var(--ink-2)">{l}</text>)}
      </g>
    ))}
    <g data-step="5">
      <path d={`M${284 - 10} ${CY - R + 2} C 240 46, 120 46, ${76 + 10} ${CY - R + 2}`} fill="none" stroke="var(--accent)" strokeWidth="2" />
      <path d={`M${76 + 10} ${CY - R + 2} L${76 + 6} ${CY - R - 10} L${76 + 18} ${CY - R - 6} Z`} fill="var(--accent)" />
      <text x={W / 2} y="78" textAnchor="middle" {...serif} fontSize="11.5" fill="var(--ink)">loops back</text>
    </g>
    <g data-step="6">
      <text x={W / 2} y="286" textAnchor="middle" {...ui} fontSize="10" letterSpacing="1" fill="var(--ink-2)">THE LECTURE'S IDEATION PROCESS</text>
      <line x1="40" y1="296" x2="140" y2="440" stroke="var(--ink-3)" strokeWidth="1.2" />
      <line x1={W - 40} y1="296" x2={W - 140} y2="440" stroke="var(--ink-3)" strokeWidth="1.2" />
      {FUNNEL.map((l, k) => <text key={l} x={W / 2} y={316 + k * 28} textAnchor="middle" {...serif} fontSize="12" fill="var(--ink)">{l}</text>)}
    </g>
  </svg>
);

export default function DesignThinking() {
  return (
    <Diagram
      label="Design thinking as three overlapping spaces that loop, against a straight milestone process, with the lecture's ideation process beneath"
      terms={[
        { term: 'Design thinking', def: 'A human-centred approach using consumer insight in depth and rapid prototyping (Brown and Wyatt, 2010).' },
        { term: 'Space', def: 'Inspiration, ideation or implementation — overlapping, not taken strictly in order.' },
        { term: 'T-shaped person', def: 'Depth of skill in one area, plus empathy for people and other disciplines.' },
        { term: 'Prototyping', def: 'Turning ideas into products and services that are tested, iterated and refined.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Not this: the linear, milestone-based process organisations typically run. Brown and Wyatt describe a system of overlapping spaces instead.' },
        { caption: 'Inspiration: the problem or opportunity that motivates the search — a brief, then observing what people actually do. Kara Pecknold reframed a website brief once she saw the weavers had little access to computers.' },
        { caption: 'Ideation: synthesise what you saw into insights, then think divergently with diverse, T-shaped people; brainstorming defers judgement.' },
        { caption: 'Implementation: prototype, test, iterate and refine. VisionSpring found children were at ease when they screened each other.' },
        { caption: "Projects loop back through the spaces more than once. Shanti's water centre shows the cost of skipping them: it made clean water, but she could not carry its jerrican or use a monthly card." },
        { caption: "The lecture's ideation process has the same shape: a diverse team, immersion, as many ideas as possible (quantity, not quality), criteria, then a shortlist of three to five." },
      ]}
      check={{
        question: "A manager says: 'Design thinking is just an eight-step milestone process with a new name.' What is the best reply?",
        options: [
          { text: 'Agreed: it runs strictly in order, step by step', why: 'Brown and Wyatt contrast design thinking with exactly that kind of linear, milestone-based process.' },
          { text: 'No: its spaces overlap and projects loop back through them, starting from what people actually do', correct: true, why: 'Inspiration, ideation and implementation are overlapping spaces, not orderly steps, and a project may loop through them more than once.' },
          { text: 'No: design thinking skips prototyping to save time', why: 'Prototyping is at the core of the implementation space.' },
        ],
      }}
    />
  );
}
