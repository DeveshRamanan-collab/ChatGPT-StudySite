/*
SCENE: Why creativity resists a standardised test
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Lay a test beside each step of creative problem solving to show where measurement runs out: none for
  formulating problems, mixed results for divergent thinking, IQ and emotional intelligence only for convergent
  thinking — under the lecture's three reasons.
SUBJECT: the column of three steps; each test box draws on beside its step in turn.
STEPS: 1 the three reasons · 2 the three steps and their phases · 3 no standard test (dashed) · 4 mixed results ·
  5 IQ tests and emotional intelligence.
REDUCED MOTION: the finished diagram with all five captions stacked (base).
BUDGET: < 6 KB gz (DrawSVG is in the shared motion chunk). Narrow 360-unit canvas so text stays legible on phones.
Source: concept mgmt2094-w02-measuring-creativity; week 2 lecture slides 6, 8, 20–21 (content-src/mgmt2094-w02.yaml).
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ROWS = [
  { y: 150, step: ['Identify an', 'interesting problem'], phase: 'prospective', test: ['No standard test', 'for formulating', 'interesting problems'], dashed: true, label: 'no-test' },
  { y: 246, step: ['Divergent', 'thinking'], phase: 'prospective', test: ['Divergent thinking', 'tests produce', 'mixed results'], dashed: false, label: 'mixed' },
  { y: 342, step: ['Convergent', 'thinking'], phase: 'analytical', test: ['IQ tests', '(deductive capacity)', 'emotional intelligence'], dashed: false, label: 'iq' },
];
const H = 72;

function StepBox({ y, lines, phase }: { y: number; lines: string[]; phase: string }) {
  return (
    <>
      <rect x="8" y={y} width="152" height={H} rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      {lines.map((l, i) => (
        <text key={i} x="84" y={y + 26 + i * 18} textAnchor="middle" fontFamily="var(--font-body)" fontSize="14" fill="var(--ink)">{l}</text>
      ))}
      <text x="84" y={y + H - 9} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="0.5" fill="var(--ink-2)">{phase}</text>
    </>
  );
}

function TestBox({ y, lines, dashed, id }: { y: number; lines: string[]; dashed: boolean; id: string }) {
  return (
    <>
      <line x1="160" y1={y + H / 2} x2="192" y2={y + H / 2} stroke="var(--ink-3)" strokeWidth="1.5" />
      <rect x="192" y={y} width="160" height={H} rx="10" fill="none" stroke={dashed ? 'var(--ink-3)' : 'var(--ink)'} strokeWidth="1.5" strokeDasharray={dashed ? '6 6' : undefined} />
      {lines.map((l, i) => (
        <text key={i} x="272" y={y + 22 + i * 19} textAnchor="middle" fontFamily="var(--font-ui)" fontSize="13" fill={i === 0 ? 'var(--ink)' : 'var(--ink-2)'} data-label={i === 0 ? id : undefined}>{l}</text>
      ))}
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 424`} role="img" aria-label="Three reasons creativity resists a standardised test, above the three steps of creative problem solving, each with the test the lecture places beside it">
    <g data-step="1">
      <rect x="8" y="8" width={W - 16} height="112" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="34" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="13" letterSpacing="1.2" fill="var(--ink)" data-label="reasons">WHY NO STANDARD TEST?</text>
      {['creativity is a process', 'creativity is often a group phenomenon', 'creativity implies domain knowledge'].map((l, i) => (
        <text key={l} x={W / 2} y={60 + i * 22} textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">{l}</text>
      ))}
    </g>
    <g data-step="2">
      {ROWS.map((r, i) => (
        <g key={r.label}>
          <StepBox y={r.y} lines={r.step} phase={r.phase} />
          {i < ROWS.length - 1 && <line x1="84" y1={r.y + H} x2="84" y2={ROWS[i + 1].y} stroke="var(--ink-3)" strokeWidth="1.5" />}
        </g>
      ))}
    </g>
    {ROWS.map((r, i) => (
      <g key={r.label} data-step={i + 3}>
        <TestBox y={r.y} lines={r.test} dashed={r.dashed} id={r.label} />
      </g>
    ))}
  </svg>
);

export default function MeasuringCreativity() {
  return (
    <Diagram
      label="Why we can't create a standardised test measuring individual creativity"
      terms={[
        { term: 'Standardised test', def: 'One test, the same for everyone, giving an individual score.' },
        { term: 'Deductive capacity', def: 'Deducing the consequences — what IQ tests measure.' },
        { term: 'Domain knowledge', def: 'Knowledge of the field; the lecture says creativity implies it.' },
        { term: 'Group phenomenon', def: 'Creativity often happens in groups, not in one person alone.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Three reasons: creativity is a process, it is often a group phenomenon, and it implies domain knowledge.' },
        { caption: 'The process: identify an interesting problem and think divergently (prospective), then think convergently (analytical).' },
        { caption: 'Formulating interesting problems — the key characteristic of creative people — has no standard test at all.' },
        { caption: 'Divergent thinking tests exist, but they produce mixed results.' },
        { caption: 'Only convergent thinking has familiar measures: IQ tests (deductive capacity: deduce the consequences) and emotional intelligence.' },
      ]}
      check={{
        question: 'Which step of creative problem solving has no standard test at all?',
        options: [
          { text: 'Convergent thinking', why: 'Convergent thinking is the step with familiar measures: IQ tests and emotional intelligence.' },
          { text: 'Identifying an interesting problem', correct: true, why: 'The slide: no standard test for the ability to formulate interesting problems.' },
          { text: 'Divergent thinking', why: 'Divergent thinking tests exist; the lecture says they produce mixed results.' },
        ],
      }}
    />
  );
}
