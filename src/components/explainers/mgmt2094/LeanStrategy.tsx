/*
SCENE: Lean strategy (Collis) — a vision, a frame, ideas at the screen, feedback that reshapes the frame
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: Show that Collis puts lean start-up experimentation inside a strategy: a permanent vision, a deliberate
  strategy (objective, scope, advantage) that screens ideas and judges results, and emergent strategy whose feedback
  reshapes the frame before the process restarts.
SUBJECT: the strategy frame — first drawn, then tested by ideas at its edge, then redrawn by feedback.
BEAT 1 (0–25%): the vision node fades in; caption: the only part meant to be permanent.
BEAT 2 (25–50%): analysis feeds the deliberate-strategy frame (objective · scope · advantage).
BEAT 3 (50–75%): two frontline ideas travel toward the frame (transform: translate, scrubbed, ease none): Business
  Select passes inside; meal service stops at the edge, struck through.
BEAT 4 (75–100%): a yardstick under the frame; a feedback arrow; the revised frame (dashed) fades in; 'restarts'.
CAMERA: none (2D SVG; wide and tall variants via .x-wide / .x-tall). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked.
BUDGET: < 6 KB gz.
Source: concept mgmt2094-w10-lean-strategy; Collis (2016) pp 63–68 and its exhibit 'The Lean Strategy Process';
  example card mgmt2094-example-southwest-airlines (Business Select, no meals, rapid turnaround).
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ui = { fontFamily: 'var(--font-ui)' } as const;
const serif = { fontFamily: 'var(--font-body)' } as const;

interface Geo {
  w: number; h: number;
  vision: [number, number]; analysis: [number, number];
  frame: { x: number; y: number; w: number; h: number };
  ideaFrom: [number, number]; passTo: [number, number]; stopTo: [number, number];
  restart: string; feedback: string; links: string[]; restartLabel: [number, number];
}

function Box({ x, y, w, title, sub, o }: { x: number; y: number; w: number; title: string; sub: string; o: number }) {
  return (
    <g opacity={o}>
      <rect x={x} y={y} width={w} height="54" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.4" />
      <text x={x + w / 2} y={y + 22} textAnchor="middle" {...ui} fontSize="13" letterSpacing="1.2" fill="var(--ink)">{title}</text>
      <text x={x + w / 2} y={y + 42} textAnchor="middle" {...serif} fontSize="13.5" fill="var(--ink-2)">{sub}</text>
    </g>
  );
}

function Idea({ from, to, p, label, pass, struck }: { from: [number, number]; to: [number, number]; p: number; label: string; pass: boolean; struck: boolean }) {
  const dx = (to[0] - from[0]) * p, dy = (to[1] - from[1]) * p;
  return (
    <g transform={`translate(${dx} ${dy})`} opacity={clamp(p * 4)}>
      <circle cx={from[0]} cy={from[1]} r="7" fill={pass ? 'var(--ink)' : 'var(--paper)'} stroke="var(--ink)" strokeWidth="1.5" />
      {struck && <line x1={from[0] - 10} y1={from[1] + 10} x2={from[0] + 10} y2={from[1] - 10} stroke="var(--clay)" strokeWidth="2" />}
      <text x={from[0]} y={from[1] + 26} textAnchor="middle" {...ui} fontSize="12.5" fill="var(--ink)">{label}</text>
    </g>
  );
}

function scene(g: Geo, t: number, cls: string) {
  const f = g.frame;
  const p = clamp((t - 2) / 0.8);
  const end = clamp((t - 3) / 0.6);
  return (
    <svg className={cls} viewBox={`0 0 ${g.w} ${g.h}`} role="img" aria-label="Collis's lean strategy process: vision, analysis, a deliberate-strategy frame that screens ideas, and feedback that reshapes it">
      <defs>
        <marker id={`ls-arrow-${cls}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--ink-3)" />
        </marker>
      </defs>
      <Box x={g.vision[0]} y={g.vision[1]} w={170} title="VISION" sub="reason for existence" o={clamp(t / 0.5)} />
      <Box x={g.analysis[0]} y={g.analysis[1]} w={170} title="ANALYSIS" sub="SWOT, resources" o={clamp((t - 1) / 0.4)} />
      <g opacity={clamp((t - 1.3) / 0.5)}>
        <rect x={f.x} y={f.y} width={f.w} height={f.h} rx="14" fill="none" stroke="var(--ink)" strokeWidth="2" />
        <text x={f.x + f.w / 2} y={f.y + 26} textAnchor="middle" {...ui} fontSize="13" letterSpacing="1.2" fill="var(--ink)">DELIBERATE STRATEGY</text>
        <text x={f.x + f.w / 2} y={f.y + 48} textAnchor="middle" {...serif} fontSize="14.5" fill="var(--ink-2)">objective · scope · advantage</text>
        {g.links.map((d) => <path key={d} d={d} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" markerEnd={`url(#ls-arrow-${cls})`} />)}
      </g>
      <g opacity={clamp((t - 2) / 0.3)}>
        <text x={g.ideaFrom[0]} y={g.ideaFrom[1] - 22} textAnchor="middle" {...ui} fontSize="12" letterSpacing="1.2" fill="var(--ink-2)">FRONTLINE IDEAS</text>
      </g>
      <Idea from={g.ideaFrom} to={g.passTo} p={p} label="Business Select" pass struck={false} />
      <Idea from={[g.ideaFrom[0], g.ideaFrom[1] + 50]} to={g.stopTo} p={p} label="meal service" pass={false} struck={p >= 1} />
      <g opacity={end}>
        <line x1={f.x + 16} y1={f.y + f.h - 16} x2={f.x + f.w - 16} y2={f.y + f.h - 16} stroke="var(--ink-2)" strokeWidth="1.5" />
        {Array.from({ length: 9 }, (_, k) => {
          const x = f.x + 16 + ((f.w - 32) * k) / 8;
          return <line key={k} x1={x} y1={f.y + f.h - 16} x2={x} y2={f.y + f.h - (k % 2 ? 22 : 26)} stroke="var(--ink-2)" strokeWidth="1.2" />;
        })}
        <text x={f.x + f.w / 2} y={f.y + f.h - 32} textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">yardstick for results</text>
        <rect x={f.x - 8} y={f.y - 8} width={f.w + 16} height={f.h + 16} rx="18" fill="none" stroke="var(--ink-3)" strokeWidth="1.3" strokeDasharray="6 6" />
        <path d={g.feedback} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" markerEnd={`url(#ls-arrow-${cls})`} />
        <path d={g.restart} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 5" markerEnd={`url(#ls-arrow-${cls})`} />
        <text x={g.restartLabel[0]} y={g.restartLabel[1]} {...ui} fontSize="12" fill="var(--ink-2)">the process restarts</text>
      </g>
    </svg>
  );
}

// Wide: vision and analysis on the left, the frame in the middle, ideas arriving from the right.
const WIDE: Geo = {
  w: 760, h: 360,
  vision: [16, 40], analysis: [16, 200],
  frame: { x: 250, y: 40, w: 300, h: 260 },
  ideaFrom: [680, 150], passTo: [400, 140], stopTo: [578, 215],
  feedback: 'M400 230 C 470 230, 470 110, 420 104',
  restart: 'M242 170 C 160 170, 101 150, 101 98',
  links: ['M186 67 L246 67', 'M186 227 L246 227'],
  restartLabel: [120, 186],
};
// Tall: everything stacked; ideas arrive from below.
const TALL: Geo = {
  w: 360, h: 640,
  vision: [10, 14], analysis: [180, 14],
  frame: { x: 30, y: 110, w: 300, h: 300 },
  ideaFrom: [120, 540], passTo: [180, 215], stopTo: [200, 428],
  feedback: 'M230 300 C 290 300, 290 220, 240 205',
  restart: 'M26 380 C 4 330, 4 120, 40 72',
  links: ['M95 68 L95 106', 'M265 68 L265 106'],
  restartLabel: [30, 438],
};

export default function LeanStrategy() {
  return (
    <ScrollExplainer
      label="Collis's lean strategy process: a vision, a strategy that screens ideas, and feedback that reshapes it"
      terms={[
        { term: 'Deliberate strategy', def: 'Agreed by senior executives: objective, scope and competitive advantage.' },
        { term: 'Emergent strategy', def: 'The sum of daily decisions and experiments by managers at all levels.' },
        { term: 'Scope', def: 'What business we are in: what the venture will and will not do.' },
        { term: 'Screen and yardstick', def: 'Strategy as the test ideas must pass, and the measure results are read against.' },
      ]}
      beats={[
        { caption: 'Vision: the organisation’s reason for existence — perhaps the only part of the strategy that should be in any sense permanent.' },
        { caption: 'Senior executives analyse strengths, weaknesses, opportunities, threats, resources and capabilities, and agree a deliberate strategy: objective, scope and competitive advantage.' },
        { caption: 'Managers at all levels experiment, and the strategy is the screen: Southwest’s Business Select kept gate turns fast and got in; meal service would have slowed turnaround, so it stayed out.' },
        { caption: 'The strategy is also the yardstick for reading results. Feedback and findings reshape it — emergent strategy — and the process restarts.' },
      ]}
      scene={(t) => <>{scene(WIDE, t, 'x-wide')}{scene(TALL, t, 'x-tall')}</>}
      check={{
        question: 'In Collis’s lean strategy process, which part should be in any sense permanent?',
        options: [
          { text: 'The scope — what business the venture is in', why: 'Scope is the most critical guide rail, but it belongs to the deliberate strategy, which feedback can revise.' },
          { text: 'The vision — the organisation’s reason for existence', correct: true, why: 'Collis says the process begins with perhaps the only aspect that should in any sense be permanent: the vision.' },
          { text: 'The current portfolio of experiments', why: 'Experiments change daily; they make up the emergent strategy, not a permanent part.' },
        ],
      }}
    />
  );
}
