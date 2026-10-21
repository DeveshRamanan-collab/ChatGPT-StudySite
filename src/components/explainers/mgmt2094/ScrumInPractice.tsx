/*
SCENE: How a scrum team works — one sprint as a structure
LENGTH: 6 steps, scroll-drawn when pinned (≈ 480vh); Next/Back otherwise (Diagram base)
INTENT: Show who does what in scrum — the initiative owner ranks the backlog, a small self-managing team builds in
  sprints of under a month, the process facilitator shields it — and how each cycle ends with customers and a review.
SUBJECT: the team at the centre; each role and stage draws on around it in turn.
STEPS: 1 initiative owner + ranked backlog · 2 team of three to nine takes the top items · 3 process facilitator
  (dashed shield) · 4 sprint loop under a month, daily stand-ups · 5 prototype tested with a few customers ·
  6 review: improve the next cycle, back to the next top priority.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished diagram with all six captions stacked (base 'off' state).
BUDGET: < 6 KB gz (DrawSVG is in the shared motion chunk). Narrow 360-unit canvas with ≥ 13-unit text so it stays
  legible on phones.
Source: concept mgmt2094-w10-scrum-in-practice; Embracing Agile pp 42–43 (notes "How agile really works: scrum");
  example card mgmt2094-example-ge-digital.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)' } as const;
const body = { fontFamily: 'var(--font-body)' } as const;

function Title({ x, y, children, id }: { x: number; y: number; children: string; id?: string }) {
  return <text x={x} y={y} textAnchor="middle" {...ui} fontSize="13.5" letterSpacing="1.2" fill="var(--ink)" data-label={id}>{children}</text>;
}
function Line({ x, y, children, anchor = 'middle' }: { x: number; y: number; children: string; anchor?: 'middle' | 'start' }) {
  return <text x={x} y={y} textAnchor={anchor} {...body} fontSize="15" fill="var(--ink-2)">{children}</text>;
}

const figure = (
  <svg viewBox={`0 0 ${W} 600`} role="img" aria-label="A scrum sprint: the initiative owner ranks the backlog; the team takes the top items; the process facilitator shields the team; the sprint runs under a month; a prototype goes to a few customers; a review improves the next cycle">
    <defs>
      <marker id="scrum-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill="var(--ink-3)" />
      </marker>
    </defs>
    <g data-step="1">
      <rect x="20" y="8" width={W - 28} height="58" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <Title x={(W + 12) / 2} y={32} id="initiative-owner">INITIATIVE OWNER</Title>
      <Line x={(W + 12) / 2} y={54}>responsible for value · ranks the backlog</Line>
      {[0, 1, 2].map((k) => (
        <rect key={k} x="96" y={80 + k * 24} width="150" height="20" rx="4" fill="none" stroke={k === 0 ? 'var(--ink)' : 'var(--ink-3)'} strokeWidth="1.2" />
      ))}
      <text x="106" y="95" {...ui} fontSize="13" fill="var(--ink)">1 · highest value</text>
      <text x="106" y="119" {...ui} fontSize="13" fill="var(--ink-2)">2</text>
      <text x="106" y="143" {...ui} fontSize="13" fill="var(--ink-2)">3</text>
      <text x="256" y="104" {...ui} fontSize="13" fill="var(--ink-2)" data-label="backlog">portfolio</text>
      <text x="256" y="121" {...ui} fontSize="13" fill="var(--ink-2)">backlog</text>
    </g>
    <g data-step="2">
      <line x1="171" y1="150" x2="171" y2="196" stroke="var(--ink-3)" strokeWidth="1.5" markerEnd="url(#scrum-arrow)" />
      <text x="182" y="178" {...ui} fontSize="12.5" fill="var(--ink-2)">top items first</text>
      <rect x="70" y="200" width="220" height="96" rx="48" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <Title x={180} y={232} id="team">TEAM · 3–9 PEOPLE</Title>
      <Line x={180} y={256}>cross-functional</Line>
      <Line x={180} y={278}>self-managing</Line>
    </g>
    <g data-step="3">
      <rect x="50" y="188" width="260" height="120" rx="60" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x={W / 2} y="330" textAnchor="middle" {...ui} fontSize="13" fill="var(--ink)" data-label="process-facilitator">PROCESS FACILITATOR</text>
      <Line x={W / 2} y={350}>guides the process, shields from distractions</Line>
    </g>
    <g data-step="4">
      <path d="M318 214 C 352 234, 352 262, 318 282" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" markerEnd="url(#scrum-arrow)" />
      <path d="M42 282 C 8 262, 8 234, 42 214" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" markerEnd="url(#scrum-arrow)" />
      <text x={W / 2} y="378" textAnchor="middle" {...ui} fontSize="13" fill="var(--ink)" data-label="sprint">SPRINT · UNDER A MONTH</text>
      <Line x={W / 2} y={398}>daily stand-ups: progress and roadblocks</Line>
    </g>
    <g data-step="5">
      <line x1="180" y1="406" x2="180" y2="428" stroke="var(--ink-3)" strokeWidth="1.5" markerEnd="url(#scrum-arrow)" />
      <rect x="20" y="432" width={W - 28} height="70" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <Title x={(W + 12) / 2} y={455} id="prototype">PROTOTYPE → A FEW CUSTOMERS</Title>
      <Line x={(W + 12) / 2} y={476}>tested for a short period;</Line>
      <Line x={(W + 12) / 2} y={494}>if they get excited, it may be released</Line>
    </g>
    <g data-step="6">
      <rect x="20" y="520" width={W - 28} height="70" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <Title x={(W + 12) / 2} y={543} id="review">REVIEW</Title>
      <Line x={(W + 12) / 2} y={566}>brainstorm how to improve the next cycle</Line>
      <path d="M20 555 L 6 555 L 6 92 L 92 92" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" markerEnd="url(#scrum-arrow)" />
    </g>
  </svg>
);

export default function ScrumInPractice() {
  return (
    <Diagram
      label="How a scrum team works, one sprint at a time"
      terms={[
        { term: 'Initiative owner', def: 'Also called the product owner: responsible for value; ranks the portfolio backlog.' },
        { term: 'Process facilitator', def: 'Often a trained scrum master: guides the process and protects the team.' },
        { term: 'Sprint', def: 'A short cycle, under a month, in which the team builds a working version.' },
        { term: 'Stand-up', def: 'A brief daily meeting to review progress and identify roadblocks.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'The initiative owner, responsible for value to customers and the business, continually and ruthlessly rank-orders a portfolio backlog of opportunities.' },
        { caption: 'A small team — usually three to nine, mostly full-time, cross-functional — takes the top items, breaks them into small modules and decides how to do the work. The owner never says who does what.' },
        { caption: 'The process facilitator, often a trained scrum master, guides the process, protects the team from distractions and helps it use its collective intelligence.' },
        { caption: 'The team builds working versions in sprints of under a month, planning in detail only what won’t change; daily stand-ups review progress and roadblocks.' },
        { caption: 'Small prototypes are tested with a few customers for a short period. Disagreements are settled by experiment, and an exciting prototype may be released at once.' },
        { caption: 'The team brainstorms how to improve future cycles, then attacks the next top priority. GE Digital’s leaders work this way, in two-week sprints.' },
      ]}
      check={{
        question: 'Who decides which team member builds which feature in scrum?',
        options: [
          { text: 'The initiative owner, who is accountable for value', why: 'The owner ranks the backlog but, the reading says, does not tell the team who should do what or how long tasks take.' },
          { text: 'The process facilitator, who runs the process', why: 'The facilitator guides the process and shields the team; allocating the work is not its job.' },
          { text: 'The self-managing team itself', correct: true, why: 'The team decides how much work to take on and how to accomplish it: it manages itself and is accountable for the work.' },
        ],
      }}
    />
  );
}
