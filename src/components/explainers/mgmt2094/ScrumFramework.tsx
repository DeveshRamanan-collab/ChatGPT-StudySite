/*
SCENE: The Scrum framework — roles, events and artifacts in one sprint (Scrum Guide, via the tutor slides)
LENGTH: 6 steps, scroll-drawn when pinned (≈ 480vh); Next/Back otherwise (Diagram base)
INTENT: Show Scrum as one structure: the Product Owner's backlog feeds Sprint Planning, the self-managing
  Development Team works through a sprint of one month or less with a 15-minute Daily Scrum, the Scrum Master
  facilitates, and the increment goes to the Sprint Review and then the Retrospective, whose learning plans the next sprint.
SUBJECT: the sprint loop at the centre; each event and artifact draws on around it in turn.
STEPS: 1 Product Backlog (Product Owner) · 2 Sprint Planning → Sprint Goal + Sprint Backlog · 3 the sprint loop
  (≤ 1 month), Development Team, Daily Scrum · 4 Scrum Master (dashed ring) · 5 Increment → Sprint Review with
  stakeholders · 6 Sprint Retrospective, then the repeat arrow back to planning.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished diagram with all six captions stacked (base 'off' state).
BUDGET: < 6 KB gz (DrawSVG is in the shared motion chunk). Narrow 360-unit canvas with ≥ 12.5-unit text so it stays
  legible on phones.
Source: concept mgmt2094-w10-scrum-framework; Week 10 tutor slides (SW) 6–7, citing Schwaber and Sutherland (2020),
  The Scrum Guide (authority mgmt2094-schwaber-sutherland-2020-scrum-guide); example card mgmt2094-example-ge-digital.
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

const figure = (
  <svg viewBox={`0 0 ${W} 600`} role="img" aria-label="The Scrum framework: the Product Owner's Product Backlog feeds Sprint Planning; the Development Team works through a sprint of one month or less with a daily scrum; the Scrum Master facilitates; the increment goes to the Sprint Review, then the Retrospective, and the learning plans the next sprint">
    <defs>
      <marker id="scrumfw-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill="var(--ink-3)" />
      </marker>
    </defs>
    <g data-step="1">
      <rect x="20" y="8" width={W - 28} height="58" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <Title x={(W + 12) / 2} y={32} id="product-backlog">PRODUCT BACKLOG</Title>
      <Line x={(W + 12) / 2} y={54}>prioritised work · kept by the Product Owner</Line>
    </g>
    <g data-step="2">
      <line x1="180" y1="68" x2="180" y2="94" stroke="var(--ink-3)" strokeWidth="1.5" markerEnd="url(#scrumfw-arrow)" />
      <rect x="66" y="98" width="228" height="56" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <Title x={180} y={121} id="sprint-planning">SPRINT PLANNING</Title>
      <Line x={180} y={143}>Sprint Goal · Sprint Backlog</Line>
    </g>
    <g data-step="3">
      <line x1="180" y1="156" x2="180" y2="176" stroke="var(--ink-3)" strokeWidth="1.5" markerEnd="url(#scrumfw-arrow)" />
      <rect x="70" y="180" width="220" height="108" rx="54" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <Title x={180} y={212} id="sprint">SPRINT · ≤ 1 MONTH</Title>
      <Line x={180} y={238}>Development Team builds</Line>
      <Line x={180} y={260}>a usable increment</Line>
      <path d="M318 206 C 350 226, 350 254, 318 274" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" markerEnd="url(#scrumfw-arrow)" />
      <path d="M42 274 C 10 254, 10 226, 42 206" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" markerEnd="url(#scrumfw-arrow)" />
      <text x={W / 2} y="318" textAnchor="middle" {...ui} fontSize="13" fill="var(--ink)" data-label="daily-scrum">DAILY SCRUM · 15 MIN</text>
    </g>
    <g data-step="4">
      <rect x="50" y="168" width="260" height="132" rx="66" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x={W / 2} y="344" textAnchor="middle" {...ui} fontSize="13" fill="var(--ink)" data-label="scrum-master">SCRUM MASTER</text>
      <Line x={W / 2} y={364}>facilitates · removes obstacles</Line>
    </g>
    <g data-step="5">
      <line x1="180" y1="372" x2="180" y2="394" stroke="var(--ink-3)" strokeWidth="1.5" markerEnd="url(#scrumfw-arrow)" />
      <rect x="20" y="398" width={W - 28} height="72" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <Title x={(W + 12) / 2} y={421} id="sprint-review">INCREMENT → SPRINT REVIEW</Title>
      <Line x={(W + 12) / 2} y={443}>inspect outcomes, gather feedback</Line>
      <Line x={(W + 12) / 2} y={462}>from stakeholders</Line>
    </g>
    <g data-step="6">
      <rect x="20" y="486" width={W - 28} height="64" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <Title x={(W + 12) / 2} y={510} id="retrospective">SPRINT RETROSPECTIVE</Title>
      <Line x={(W + 12) / 2} y={534}>how can the team work better?</Line>
      <path d="M20 518 L 6 518 L 6 126 L 62 126" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" markerEnd="url(#scrumfw-arrow)" />
      <Line x={W / 2} y={580}>repeat: the learning plans the next sprint</Line>
    </g>
  </svg>
);

export default function ScrumFramework() {
  return (
    <Diagram
      label="The Scrum framework: roles, events and artifacts in one sprint"
      terms={[
        { term: 'Scrum', def: 'One Agile framework that organises work into short, structured cycles called sprints. Not all Agile teams use it.' },
        { term: 'Sprint', def: 'A fixed-length cycle of one month or less, worked towards a Sprint Goal, ending in a usable increment.' },
        { term: 'Product Owner', def: 'Represents the customer, maximises the product’s value and maintains the Product Backlog.' },
        { term: 'Scrum Master', def: 'Facilitates the process, removes obstacles and helps the team improve.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'The Product Backlog is the prioritised list of features and work. The Product Owner, who represents the customer and maximises the value of the product, maintains it.' },
        { caption: 'Sprint Planning (typically two to eight hours) agrees a Sprint Goal and selects achievable work: that selection is the Sprint Backlog.' },
        { caption: 'The sprint runs one month or less, typically one to four weeks. The cross-functional, self-managing Development Team builds a usable increment, checking progress in a 15-minute Daily Scrum.' },
        { caption: 'The Scrum Master facilitates the process, removes obstacles and helps the team improve. (In the reading, this is the process facilitator; the Product Owner is the initiative owner.)' },
        { caption: 'The Increment, a usable product outcome, goes to the Sprint Review: inspect the outcomes and gather feedback from stakeholders, then adapt the backlog.' },
        { caption: 'The Sprint Retrospective reflects on how the team can improve its work. Then the team uses what it has learned to plan the next sprint, as GE Digital’s leaders do in two-week sprints.' },
      ]}
      check={{
        question: 'At the end of a sprint, the team meets on its own to work out why handovers keep slipping. Which event is this?',
        options: [
          { text: 'The Sprint Review', why: 'The review inspects the product’s outcomes with stakeholders; this meeting is about how the team works.' },
          { text: 'The Sprint Retrospective', correct: true, why: 'The retrospective reflects on how the team can improve its work, which is exactly what this meeting does.' },
          { text: 'The Daily Scrum', why: 'The Daily Scrum is a 15-minute check on progress towards the Sprint Goal, not a reflection on working practices.' },
        ],
      }}
    />
  );
}
