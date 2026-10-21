/*
SCENE: Agile, lean start-up and lean strategy together (Week 10 tutor slides)
LENGTH: 6 steps, scroll-drawn when pinned (≈ 480vh); Next/Back otherwise (Diagram base)
INTENT: Show that the week's three approaches answer three different questions and complement one another; that the
  UniConnect challenge practises three levels of decision-making (tasks, change, barriers); and that agile alone can
  fail, as the financial services app pilot shows.
SUBJECT: the stack of three pieces; then the three levels beneath them; then the one example of a missing piece.
STEPS: 1 Agile — organise teams · 2 Lean start-up — test value for customers · 3 Lean strategy — stay aligned with
  strategic direction · 4 the brace: they complement one another · 5 UniConnect's three levels: tasks, change,
  barriers · 6 agile alone can fail: the app pilot whose release time barely moved.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished diagram with all six captions stacked (base 'off' state).
BUDGET: < 6 KB gz. Narrow 360-unit canvas with ≥ 12.5-unit text so it stays legible on phones.
Source: concept mgmt2094-w10-agile-lean-start-up-lean-strategy; Week 10 tutor slides (SW) 8–10; example cards
  mgmt2094-example-uniconnect-challenge and mgmt2094-example-financial-services-app-pilot; Collis (2016).
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)' } as const;
const body = { fontFamily: 'var(--font-body)' } as const;

function Title({ x, y, children, id }: { x: number; y: number; children: string; id?: string }) {
  return <text x={x} y={y} textAnchor="middle" {...ui} fontSize="13.5" letterSpacing="1.2" fill="var(--ink)" data-label={id}>{children}</text>;
}
function Line({ x, y, children }: { x: number; y: number; children: string }) {
  return <text x={x} y={y} textAnchor="middle" {...body} fontSize="15" fill="var(--ink-2)">{children}</text>;
}
function Small({ x, y, children }: { x: number; y: number; children: string }) {
  return <text x={x} y={y} textAnchor="middle" {...ui} fontSize="12.5" fill="var(--ink-2)">{children}</text>;
}

const cx = (W + 20) / 2;
function Piece({ y, title, id, q1, q2, does }: { y: number; title: string; id: string; q1: string; q2: string; does: string }) {
  return (
    <>
      <rect x="24" y={y} width={W - 36} height="98" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <Title x={cx} y={y + 24} id={id}>{title}</Title>
      <Line x={cx} y={y + 47}>{q1}</Line>
      <Line x={cx} y={y + 66}>{q2}</Line>
      <Small x={cx} y={y + 87}>{does}</Small>
    </>
  );
}

const levels: [string, string, string][] = [
  ['TASKS', 'value ·', 'capacity'],
  ['CHANGE', 'test ·', 'adapt'],
  ['BARRIERS', 'remove ·', 'collaborate'],
];

const figure = (
  <svg viewBox={`0 0 ${W} 640`} role="img" aria-label="Three stacked pieces: agile organises teams, lean start-up tests value for customers, lean strategy keeps experiments aligned with strategic direction; they complement one another; beneath them the UniConnect challenge's three levels, tasks, change and barriers; finally, an agile app pilot whose release time barely improved">
    <g data-step="1">
      <Piece y={8} title="AGILE" id="agile" q1="How do we organise teams to" q2="develop and improve innovations?" does="sprints · collaboration · continuous improvement" />
    </g>
    <g data-step="2">
      <Piece y={116} title="LEAN START-UP" id="lean-start-up" q1="How do we test whether our" q2="innovation creates customer value?" does="test with real users · learn · adapt" />
    </g>
    <g data-step="3">
      <Piece y={224} title="LEAN STRATEGY" id="lean-strategy" q1="How do we keep experimentation" q2="aligned with strategic direction?" does="direction · scope · guardrails · resources" />
    </g>
    <g data-step="4">
      <path d="M20 12 Q10 12 10 26 L10 152 Q10 166 4 166 Q10 166 10 180 L10 306 Q10 320 20 320" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <Title x={W / 2} y={348} id="complement">THEY COMPLEMENT ONE ANOTHER</Title>
    </g>
    <g data-step="5">
      <Small x={W / 2} y={378}>UniConnect challenge: three levels of decisions</Small>
      {levels.map(([t, a, b], k) => (
        <g key={t}>
          <rect x={24 + k * 108} y="388" width="96" height="74" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
          <text x={72 + k * 108} y="410" textAnchor="middle" {...ui} fontSize="12.5" letterSpacing="1" fill="var(--ink)" data-label={t.toLowerCase()}>{t}</text>
          <Small x={72 + k * 108} y={432}>{a}</Small>
          <Small x={72 + k * 108} y={450}>{b}</Small>
        </g>
      ))}
    </g>
    <g data-step="6">
      <rect x="24" y="480" width={W - 36} height="150" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <Title x={cx} y={505} id="agile-alone">AGILE ALONE CAN FAIL</Title>
      <Line x={cx} y={530}>an agile team built an app</Line>
      <Line x={cx} y={550}>customers praised, but funding,</Line>
      <Line x={cx} y={570}>testing and integration stayed</Line>
      <Line x={cx} y={590}>waterfall: release time</Line>
      <Line x={cx} y={610}>barely improved</Line>
    </g>
  </svg>
);

export default function AgileLeanStartUpLeanStrategy() {
  return (
    <Diagram
      label="Agile, lean start-up and lean strategy: three questions that complement one another"
      terms={[
        { term: 'Agile', def: 'Organises teams to develop and improve innovations in short, iterative cycles (sprints).' },
        { term: 'Lean start-up', def: 'Tests whether an innovation creates value for customers, with real users.' },
        { term: 'Lean strategy', def: 'Keeps experimentation aligned with strategic direction: direction, scope, guardrails.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Agile asks: how do we organise teams to develop and improve innovations? Organise work into short, iterative cycles (sprints), enable collaboration and quick adaptation, and continuously improve the product.' },
        { caption: 'Lean start-up asks: how do we test whether our innovation creates value for customers? Test assumptions with real users, learn from feedback and adapt.' },
        { caption: 'Lean strategy asks: how do we ensure experimentation remains aligned with strategic direction? Set direction, scope and guardrails, prioritise the right opportunities and allocate resources effectively.' },
        { caption: 'The tutor slide’s point: the three approaches complement one another to help organisations innovate more effectively. Each does a job the others do not.' },
        { caption: 'The UniConnect challenge practises three levels of decisions: managing tasks (prioritise on value and capacity), managing change (test assumptions, adapt on evidence) and managing barriers (remove them, enable cross-functional collaboration).' },
        { caption: 'Can an organisation be agile and still fail to innovate? Yes: a financial services company’s agile team built an app customers praised, but annual funding and waterfall testing and integration meant release time barely improved.' },
      ]}
      check={{
        question: 'A team runs disciplined two-week sprints and ships features on time, but never checks whether users want them. Which piece is missing?',
        options: [
          { text: 'Lean start-up', correct: true, why: 'Lean start-up asks whether the innovation creates value for customers, by testing assumptions with real users; this team never tests.' },
          { text: 'Lean strategy', why: 'Direction may also be weak, but the clearest gap is that nothing is tested with real users.' },
          { text: 'Agile', why: 'Two-week sprints and on-time delivery show agile is already in place; the gap is testing customer value.' },
        ],
      }}
    />
  );
}
