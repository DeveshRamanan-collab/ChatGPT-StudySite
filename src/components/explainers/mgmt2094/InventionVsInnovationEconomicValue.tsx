/*
SCENE: Invention vs innovation — two columns, three matched rows, and the economic-value cue
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
BEATS: terms → the prompt bar and two headers → what it is → what it requires → examples → shared vs market-only
INTENT: Invention and innovation share competence and money; only innovation is tied to the market (meeting
  requirements or market needs, knowledge of market needs and trends, introductions), which is where the slide's
  "pay attention to the economic value" cue points.
SUBJECT: the innovation column against the invention column, row by row; then the one accent box naming what only
  innovation has.
BEAT 1 (step 1): prompt bar "Let's understand the difference" and the two column headers draw on. Caption: the slide's prompt.
BEAT 2 (step 2): "What it is" row. Caption: the two definitions.
BEAT 3 (step 3): "What it requires" row. Caption: the two lists of requirements.
BEAT 4 (step 4): "Examples" row. Caption: invention of… against introduction of….
BEAT 5 (step 5): dashed box "both columns: competence, money", then the accent box "only innovation: market needs and
  trends, introduced to meet a need". Caption: the economic-value cue, and that the slide does not spell it out.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished diagram with all five captions stacked (Diagram base, off); calm plays steps quickly.
BUDGET: < 8 KB gz, no WebGL. Two 170-unit columns on a 360-unit canvas; short lines so nothing overflows at phone width.
Source: concept mgmt2094-w07-invention-vs-innovation-economic-value (Week 7 tutorial, slide 2 chart); authorities
  mgmt2094-example-printing-press-electricity-telephone, mgmt2094-example-iphone-tablet-flat-screen-tv.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const L = 92;
const R = 268;
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const rowHead = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;

const ROWS = [
  {
    label: 'WHAT IT IS',
    left: ['a novel product,', 'device, process,', 'or concept'],
    right: ['the introduction of a', 'newer and better', 'solution that meets', 'new requirements or', 'existing market needs'],
  },
  {
    label: 'WHAT IT REQUIRES',
    left: ['knowledge,', 'competence,', 'financial aid'],
    right: ['technical knowledge,', 'competence, knowledge', 'about market needs,', 'trends, and', 'financial support'],
  },
  {
    label: 'EXAMPLES',
    left: ['invention of the', 'printing press,', 'electricity, telephone'],
    right: ['introduction of the', 'iPhone, the tablet,', 'the flat-screen TV'],
  },
];

const ROW_TOP = 104;
const rowHeight = (r: (typeof ROWS)[number]) => 44 + Math.max(r.left.length, r.right.length) * 18 + 8;
const tops = ROWS.map((_, i) => ROW_TOP + ROWS.slice(0, i).reduce((sum, r) => sum + rowHeight(r), 0));
const END = tops[ROWS.length - 1] + rowHeight(ROWS[ROWS.length - 1]);

const figure = (
  <svg viewBox={`0 0 ${W} ${END + 150}`} role="img" aria-label="Invention and innovation compared on what each is, what each requires and the chart's examples; both need competence and money, only innovation is tied to market needs">
    <g data-step="1">
      <rect x="8" y="8" width={W - 16} height="40" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="33" textAnchor="middle" {...head}>LET'S UNDERSTAND THE DIFFERENCE</text>
      <line x1={L} y1="48" x2={L} y2="64" stroke="var(--ink-3)" strokeWidth="1.5" />
      <line x1={R} y1="48" x2={R} y2="64" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x={L} y="86" textAnchor="middle" {...head} data-label="invention">INVENTION</text>
      <text x={R} y="86" textAnchor="middle" {...head} data-label="innovation">INNOVATION</text>
    </g>
    {ROWS.map((r, i) => {
      const y = tops[i];
      return (
        <g key={r.label} data-step={i + 2}>
          <line x1="8" y1={y} x2={W - 8} y2={y} stroke="var(--ink-3)" strokeWidth="1" />
          <text x={W / 2} y={y + 20} textAnchor="middle" {...rowHead}>{r.label}</text>
          {r.left.map((t, k) => <text key={k} x={L} y={y + 44 + k * 18} textAnchor="middle" {...body}>{t}</text>)}
          {r.right.map((t, k) => <text key={k} x={R} y={y + 44 + k * 18} textAnchor="middle" {...body}>{t}</text>)}
        </g>
      );
    })}
    <g data-step="5">
      <rect x="8" y={END + 8} width={W - 16} height="48" rx="10" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x={W / 2} y={END + 28} textAnchor="middle" {...rowHead}>IN BOTH COLUMNS</text>
      <text x={W / 2} y={END + 47} textAnchor="middle" {...body} fill="var(--ink-2)">competence · money (aid / support)</text>
      <rect x="8" y={END + 70} width={W - 16} height="70" rx="10" fill="none" stroke="var(--accent)" strokeWidth="2" />
      <text x={W / 2} y={END + 92} textAnchor="middle" {...rowHead} fill="var(--ink)" data-label="economic-value">ONLY INNOVATION: THE MARKET</text>
      <text x={W / 2} y={END + 111} textAnchor="middle" {...body}>meets requirements or market needs ·</text>
      <text x={W / 2} y={END + 129} textAnchor="middle" {...body}>market needs and trends · introductions</text>
    </g>
  </svg>
);

export default function InventionVsInnovationEconomicValue() {
  return (
    <Diagram
      label="Invention against innovation: what each is, what each requires, the chart's examples, and the economic-value cue"
      terms={[
        { term: 'Invention', def: 'A novel product, device, process, or concept.' },
        { term: 'Innovation', def: 'The introduction of a newer and better solution that meets new requirements or existing market needs.' },
        { term: 'Economic value', def: "The slide's cue for telling them apart: \"Pay attention to the economic value.\"" },
      ]}
      figure={figure}
      steps={[
        { caption: "The tutorial's first comparison: let's understand the difference between invention and innovation." },
        { caption: 'What it is: invention is a novel product, device, process, or concept; innovation is the introduction of a newer and better solution that meets new requirements or existing market needs.' },
        { caption: 'What it requires: invention needs knowledge, competence, and financial aid; innovation needs technical knowledge, competence, knowledge about market needs, trends, and financial support.' },
        { caption: 'Examples: the invention of the printing press, electricity, the telephone; the introduction of the iPhone, the tablet, the flat-screen TV.' },
        { caption: 'Pay attention to the economic value. Competence and money are in both columns; only innovation is tied to the market. The slide does not spell the cue out — this is where the two columns differ.' },
      ]}
      check={{
        question: 'A firm has built a working prototype of a novel device but has not offered it to anyone. On the chart, what is it so far?',
        options: [
          { text: 'An innovation, because it is newer and better', why: 'Innovation is the introduction of a solution that meets requirements or market needs; nothing has been introduced yet.' },
          { text: 'An invention: a novel device', correct: true, why: 'A novel product, device, process or concept is an invention; it becomes innovation only once introduced to meet a need.' },
          { text: 'Neither, because it needed competence and money', why: 'Competence and money are in both columns, so they cannot decide it; the prototype is a novel device.' },
        ],
      }}
    />
  );
}
