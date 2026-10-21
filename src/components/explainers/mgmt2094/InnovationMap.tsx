/*
SCENE: Types of innovation and the innovation map
LENGTH: 6 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
BEATS: terms → the two axes → operational → management → product & service → strategic → how often each changes
INTENT: The innovation map sorts types of innovation on two axes — internal/external and continuous/discontinuous —
  into four quadrants, and the quadrant tells you how often that kind of innovation should change.
SUBJECT: the quadrant being drawn; the strategic quadrant's "disruptive innovation" label carries the one accent.
BEAT 1 (step 1): the vertical axis (internal ↑ / external ↓) and the horizontal axis (continuous ← / discontinuous →).
BEAT 2 (step 2): operational innovation, top left, with processes and technological innovation.
BEAT 3 (step 3): management innovation, top right, with internal structures, people management, networking, partner
  interfaces.
BEAT 4 (step 4): product & service innovation, bottom left, with brand and technological innovation.
BEAT 5 (step 5): strategic innovation, bottom right, with disruptive innovation, new markets, new offerings, channels,
  supply chain, customer interfaces and Blue Ocean Strategy.
BEAT 6 (step 6): tempo labels under each half — "change all the time" (continuous) and "change when called upon,
  then let it settle" (discontinuous).
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished map with all six captions stacked (Diagram base, off); calm plays steps quickly.
BUDGET: < 6 KB gz, no WebGL. 360-unit canvas; quadrant labels kept to two short lines.
Source: concept mgmt2094-w08-innovation-map (Week 8 slides 2, 4 and 9; lecture recording on how often each changes);
  authority mgmt2094-class-activity-is-it-really-disruptive.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const CX = 180;
const CY = 200;
const ui = { fontFamily: 'var(--font-ui)' } as const;
const serif = { fontFamily: 'var(--font-body)' } as const;

const QUADS = [
  { step: 2, id: 'operational', x: 92, y: 116, title: ['OPERATIONAL', 'INNOVATION'], labels: ['processes', 'technological'] },
  { step: 3, id: 'management', x: 268, y: 116, title: ['MANAGEMENT', 'INNOVATION'], labels: ['internal structures,', 'people management,', 'networking, partners'] },
  { step: 4, id: 'product', x: 92, y: 270, title: ['PRODUCT & SERVICE', 'INNOVATION'], labels: ['brand', 'technological'] },
  { step: 5, id: 'strategic', x: 268, y: 270, title: ['STRATEGIC', 'INNOVATION'], labels: ['new markets, offerings,', 'channels, supply chain,', 'Blue Ocean Strategy'] },
] as const;

const figure = (
  <svg viewBox={`0 0 ${W} 420`} role="img" aria-label="The innovation map: internal or external against continuous or discontinuous, giving operational, management, product and service, and strategic innovation">
    <g data-step="1">
      <line x1={CX} y1="40" x2={CX} y2="352" stroke="var(--ink)" strokeWidth="1.5" />
      <line x1="16" y1={CY} x2={W - 16} y2={CY} stroke="var(--ink)" strokeWidth="1.5" />
      <text x={CX} y="28" textAnchor="middle" {...ui} fontSize="11" letterSpacing="1.2" fill="var(--ink-2)">INTERNAL</text>
      <text x={CX} y="370" textAnchor="middle" {...ui} fontSize="11" letterSpacing="1.2" fill="var(--ink-2)">EXTERNAL</text>
      <text x="16" y={CY - 8} {...ui} fontSize="10" letterSpacing="1" fill="var(--ink-2)">CONTINUOUS</text>
      <text x={W - 16} y={CY - 8} textAnchor="end" {...ui} fontSize="10" letterSpacing="1" fill="var(--ink-2)">DISCONTINUOUS</text>
    </g>
    {QUADS.map((q) => (
      <g key={q.id} data-step={q.step} data-quadrant={q.id}>
        <rect x={q.x - 76} y={q.y - 66} width="152" height="126" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.2" />
        <text x={q.x} y={q.y - 40} textAnchor="middle" {...ui} fontSize="10.5" letterSpacing="1" fill="var(--ink)" data-label={q.id}>{q.title[0]}</text>
        <text x={q.x} y={q.y - 26} textAnchor="middle" {...ui} fontSize="10.5" letterSpacing="1" fill="var(--ink)">{q.title[1]}</text>
        {q.id === 'strategic' && (
          <>
            <rect x={q.x - 62} y={q.y - 14} width="124" height="20" rx="10" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
            <text x={q.x} y={q.y + 0} textAnchor="middle" {...serif} fontSize="12" fill="var(--ink)">disruptive innovation</text>
          </>
        )}
        {q.labels.map((l, k) => (
          <text key={l} x={q.x} y={q.y + (q.id === 'strategic' ? 22 : 0) + k * 16} textAnchor="middle" {...serif} fontSize="12" fill="var(--ink-2)">{l}</text>
        ))}
      </g>
    ))}
    <g data-step="6">
      <line x1="16" y1="384" x2={CX - 8} y2="384" stroke="var(--ink-3)" strokeWidth="1" />
      <line x1={CX + 8} y1="384" x2={W - 16} y2="384" stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="5 5" />
      <text x="92" y="402" textAnchor="middle" {...serif} fontSize="12" fill="var(--ink)">change all the time</text>
      <text x="268" y="402" textAnchor="middle" {...serif} fontSize="12" fill="var(--ink)">change when called upon,</text>
      <text x="268" y="417" textAnchor="middle" {...serif} fontSize="12" fill="var(--ink)">then let it settle</text>
    </g>
  </svg>
);

export default function InnovationMap() {
  return (
    <Diagram
      label="The innovation map: two axes and four quadrants of innovation, and how often each should change"
      terms={[
        { term: 'Continuous', def: 'Innovation that goes on all the time, in small steps.' },
        { term: 'Discontinuous', def: 'A break with the past, made once in a while when it is called for.' },
        { term: 'Internal / external', def: 'Inside the organisation (processes, structures, people) or facing customers and markets.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Two axes: internal against external (top to bottom) and continuous against discontinuous (left to right). Innovations vary in magnitude — the degree to which they deviate from the past.' },
        { caption: 'Operational innovation — internal and continuous: processes and technological innovation, improved all the time; nobody really sees much of it.' },
        { caption: 'Management innovation — internal and discontinuous: internal structures and processes, people management, networking, partner interfaces. People tire of constant change.' },
        { caption: 'Product & service innovation — external and continuous: your products, how you sell them and how you present your brand, improved continuously.' },
        { caption: 'Strategic innovation — external and discontinuous: new markets, new offerings, channels, supply chain, customer interfaces, Blue Ocean Strategy — and disruptive innovation.' },
        { caption: 'The left half changes all the time; the right half changes when it is called upon, then is left to settle so people adjust and the rewards are reaped.' },
      ]}
      check={{
        question: 'A hospital restructures its departments and how it manages its staff, then leaves the structure in place for years. Which quadrant?',
        options: [
          { text: 'Operational innovation', why: 'Operational innovation is internal but continuous — steady process and technology improvement — not a one-off restructure.' },
          { text: 'Management innovation', correct: true, why: 'Internal structures and people management, changed once and then left to settle: internal and discontinuous.' },
          { text: 'Strategic innovation', why: 'It is discontinuous, but internal: nothing changes the hospital\'s markets, offerings or channels.' },
        ],
      }}
    />
  );
}
