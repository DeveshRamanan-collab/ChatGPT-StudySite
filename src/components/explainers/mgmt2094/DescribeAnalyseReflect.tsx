/*
SCENE: Don't just describe — analyse and reflect
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: One group-project event climbs the slide's three verbs: described (what happened), analysed (explained with the
  project's theory), reflected on (what I would do differently); the six "questions to ask myself" are what push it up.
SUBJECT: the same event, rewritten on each step of a three-step stair.
BEAT 1 (0–25%): DESCRIBE step fades in with the event as narrated. Opacity only, ease none (scrubbed).
BEAT 2 (25–50%): ANALYSE step: the event explained with the tutorial's diverging rule (defer judgement).
BEAT 3 (50–75%): REFLECT step: what I would do differently next time; its title carries the one accent.
BEAT 4 (75–100%): the six questions to ask myself fade in, with the slide's warning and the rubric reminder.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame (all three steps and the questions) with the four captions stacked.
BUDGET: < 8 KB gz, no WebGL. Wide (stairs left → right) and tall (stairs bottom → top) layouts.
Source: concept mgmt2094-w06-describe-analyse-reflect (Week 6 lecture slides 7–8; Week 9 transcript); the three
  sentences are from the week spec (q512 stem and answer; q519 model answer).
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const STEPS = [
  { title: 'DESCRIBE', text: 'In our first meeting we rejected most ideas as soon as they were suggested.' },
  { title: 'ANALYSE', text: 'We judged ideas while we were still generating them, breaking the diverging rule to defer judgement.' },
  { title: 'REFLECT', text: 'Next time I would suggest an idea round with judgement deferred, then a separate round to pick the best.' },
];

const QUESTIONS = [
  'What have I learnt from the process?',
  "What do I now know, that I didn't before?",
  'What insights have I gained?',
  'What were the challenges, and how well did I and the team handle them?',
  'What would I do better or differently next time?',
  'What have I learnt from this?',
];

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const fade = (t: number, at: number) => clamp((t - at) / 0.6);

// Greedy word wrap by character budget (SVG text does not wrap).
function wrap(s: string, max: number) {
  const out: string[] = [];
  let line = '';
  for (const w of s.split(' ')) {
    if ((line + ' ' + w).trim().length > max) { out.push(line); line = w; } else line = (line + ' ' + w).trim();
  }
  if (line) out.push(line);
  return out;
}

const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2 } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13.5 } as const;
const ui = { fontFamily: 'var(--font-ui)', fontSize: 12 } as const;

interface Box { x: number; y: number; w: number; h: number; chars: number }

function Step({ i, b, t }: { i: number; b: Box; t: number }) {
  const lines = wrap(STEPS[i].text, b.chars);
  const top = i === 2 && t >= 2;
  return (
    <g style={{ opacity: fade(t, i) }} data-step-name={STEPS[i].title}>
      <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="12" fill="none" stroke={i === 0 ? 'var(--ink-3)' : 'var(--ink)'} strokeWidth="1.5" />
      <text x={b.x + 14} y={b.y + 24} {...head} fill={top ? 'var(--accent)' : 'var(--ink-2)'}>{STEPS[i].title}</text>
      {lines.map((l, k) => (
        <text key={k} x={b.x + 14} y={b.y + 48 + k * 19} {...body} fill="var(--ink)">{l}</text>
      ))}
    </g>
  );
}

function Questions({ x, y, w, t, chars }: { x: number; y: number; w: number; t: number; chars: number }) {
  let row = 0;
  const rows = QUESTIONS.flatMap((q, k) => wrap(q, chars).map((l, j) => ({ l, k, j, r: row++ })));
  const h = 54 + rows.length * 17 + 22;
  return (
    <g style={{ opacity: fade(t, 3) }}>
      <rect x={x} y={y} width={w} height={h} rx="12" fill="var(--paper-2)" stroke="var(--line)" />
      <text x={x + 14} y={y + 24} {...head} fill="var(--ink-2)">QUESTIONS TO ASK MYSELF</text>
      {rows.map(({ l, k, j, r }) => (
        <g key={r}>
          {j === 0 && <text x={x + 14} y={y + 46 + r * 17} fontFamily="var(--font-mono)" fontSize="11" fill="var(--ink-2)">{k + 1}</text>}
          <text x={x + 30} y={y + 46 + r * 17} {...ui} fill="var(--ink)">{l}</text>
        </g>
      ))}
      <text x={x + 14} y={y + h - 14} fontFamily="var(--font-body)" fontStyle="italic" fontSize="13" fill="var(--ink-2)">Do not just describe; you must analyse and reflect.</text>
    </g>
  );
}

function wide(t: number) {
  const boxes: Box[] = [
    { x: 16, y: 300, w: 220, h: 112, chars: 28 },
    { x: 250, y: 216, w: 220, h: 196, chars: 28 },
    { x: 484, y: 100, w: 220, h: 312, chars: 28 },
  ];
  return (
    <svg className="x-wide" viewBox="0 0 720 420" role="img" aria-label="Three rising steps — describe, analyse, reflect — with the six questions to ask myself">
      <Questions x={16} y={8} w={454} t={t} chars={62} />
      {boxes.map((b, i) => <Step key={i} i={i} b={b} t={t} />)}
    </svg>
  );
}

function tall(t: number) {
  const boxes: Box[] = [
    { x: 8, y: 466, w: 344, h: 92, chars: 42 },
    { x: 8, y: 352, w: 344, h: 104, chars: 42 },
    { x: 8, y: 238, w: 344, h: 104, chars: 42 },
  ];
  return (
    <svg className="x-tall" viewBox="0 0 360 566" role="img" aria-label="Three steps from the bottom — describe, analyse, reflect — with the six questions to ask myself above">
      <Questions x={8} y={8} w={344} t={t} chars={42} />
      {boxes.map((b, i) => <Step key={i} i={i} b={b} t={t} />)}
    </svg>
  );
}

function scene(t: number) {
  return <>{wide(t)}{tall(t)}</>;
}

export default function DescribeAnalyseReflect() {
  return (
    <ScrollExplainer
      label="Don't just describe: one event described, analysed and reflected on"
      terms={[
        { term: 'Describe', def: 'Report what happened. Necessary, but the slide says not enough on its own.' },
        { term: 'Analyse', def: 'Explain it — relating it to your group project with theoretical underpinnings.' },
        { term: 'Reflect', def: 'Turn it into learning: what I now know, and what I would do differently next time.' },
      ]}
      beats={[
        { caption: 'Describe: what happened in the team. A reflection that stops here is only description.' },
        { caption: 'Analyse: explain why it happened, using theory — here, the diverging rule to defer judgement from the Week 6 tutorial.' },
        { caption: 'Reflect: what I would do better or differently next time, now that I understand what went wrong.' },
        { caption: 'The six questions to ask myself push every paragraph up the steps. Review the group project criteria and keep the marking rubric in mind.' },
      ]}
      scene={scene}
      check={{
        question: '"On Monday we met. On Wednesday we filmed. On Friday we edited." What is wrong with this paragraph?',
        options: [
          { text: 'It uses "we", but a reflective paper may only use "I"', why: 'Nothing forbids "we" when describing the team; the problem lies elsewhere.' },
          { text: 'It only describes: it neither analyses nor reflects', correct: true, why: 'It narrates events and answers none of the six questions; the slide says do not just describe.' },
          { text: 'Its sentences are fragments', why: 'Each sentence is complete; the fault is that the paragraph is pure description.' },
        ],
      }}
    />
  );
}
