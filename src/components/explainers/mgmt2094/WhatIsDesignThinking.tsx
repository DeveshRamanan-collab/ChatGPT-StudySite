/*
SCENE: What design thinking is — three definitions layered around one problem, then the failure it guards against
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
BEATS: 5
INTENT: Design thinking is one idea seen three ways — the reading's process, Tim Brown's match of needs, feasibility and
  viability, the guest lecture's human-centred, creative, experimentation-driven approach — aimed at one failure (a
  product that works but nobody wants), and Verganti says why it matters (design → meaning → value).
SUBJECT: the problem box at the top; each later layer connects back to it.
STEP 1: the reading's "in essence" definition. STEP 2: Brown's three things to match. STEP 3: the lecture's three
  features. STEP 4: the failure it guards against (dashed). STEP 5: Verganti's chain.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished diagram with all five captions stacked (base).
BUDGET: < 8 KB gz (DrawSVG is in the shared motion chunk). Vertical 360-unit canvas so text stays legible on phones.
Source: concept mgmt2094-w03-what-is-design-thinking; authorities mgmt2094-reading-marketers-guide-to-design-thinking,
  mgmt2094-reading-verganti-foreword, mgmt2094-example-guest-nathan-baird.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink)' } as const;
const small = { fontFamily: 'var(--font-ui)', fontSize: 13, fill: 'var(--ink-2)' } as const;

const BROWN: [number, string, string][] = [
  [62, "people's", 'needs'],
  [180, 'technologically', 'feasible'],
  [298, 'viable', 'business'],
];
const CHAIN = ['design', 'meaning', 'value', 'innovation', 'business'];

const figure = (
  <svg viewBox={`0 0 ${W} 660`} role="img" aria-label="Design thinking: a problem at the top, Brown's three things to match, the lecture's three features, the failure it prevents, and Verganti's chain from design to business">
    <g data-step="1">
      <rect x="8" y="10" width={W - 16} height="104" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="36" textAnchor="middle" {...head} data-label="essence">THE READING: IN ESSENCE</text>
      <text x={W / 2} y="62" textAnchor="middle" {...body}>a process that harnesses creativity</text>
      <text x={W / 2} y="82" textAnchor="middle" {...body}>to resolve problems and create solutions</text>
      <text x={W / 2} y="102" textAnchor="middle" {...body}>that make a product, service or business better</text>
    </g>
    <g data-step="2">
      <text x={W / 2} y="146" textAnchor="middle" {...head} data-label="brown">TIM BROWN (IDEO): MATCH</text>
      {BROWN.map(([cx, a, b]) => (
        <g key={cx}>
          <line x1={cx} y1="114" x2={cx} y2="166" stroke="var(--ink-3)" strokeWidth="1.25" />
          <ellipse cx={cx} cy="198" rx="54" ry="32" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
          <text x={cx} y="196" textAnchor="middle" {...small} fill="var(--ink)">{a}</text>
          <text x={cx} y="212" textAnchor="middle" {...small} fill="var(--ink)">{b}</text>
        </g>
      ))}
    </g>
    <g data-step="3">
      <line x1={W / 2} y1="230" x2={W / 2} y2="262" stroke="var(--ink-3)" strokeWidth="1.25" />
      <rect x="8" y="262" width={W - 16} height="118" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="288" textAnchor="middle" {...head} data-label="lecture">THE GUEST LECTURE</text>
      <text x={W / 2} y="316" textAnchor="middle" {...body}>human-centred — the customer at the core</text>
      <text x={W / 2} y="340" textAnchor="middle" {...body}>creative — many ideas, with creators</text>
      <text x={W / 2} y="364" textAnchor="middle" {...body}>experimentation-driven — quick, cheap tests</text>
    </g>
    <g data-step="4">
      <line x1={W / 2} y1="380" x2={W / 2} y2="410" stroke="var(--ink-3)" strokeWidth="1.25" />
      <rect x="8" y="410" width={W - 16} height="96" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x={W / 2} y="436" textAnchor="middle" {...head} data-label="guards">WHAT IT GUARDS AGAINST</text>
      <text x={W / 2} y="464" textAnchor="middle" {...body}>something that works — but nobody wants</text>
      <text x={W / 2} y="488" textAnchor="middle" {...small}>more innovations fail from a lack of customers</text>
    </g>
    <g data-step="5">
      <text x={W / 2} y="546" textAnchor="middle" {...head} data-label="verganti">VERGANTI: WHY IT MATTERS</text>
      {CHAIN.map((w, i) => {
        const y = 576 + Math.floor(i / 3) * 42;
        const x = i < 3 ? 60 + i * 120 : 120 + (i - 3) * 120;
        return (
          <g key={w}>
            <rect x={x - 50} y={y - 18} width="100" height="28" rx="14" fill="none" stroke="var(--ink)" strokeWidth="1.25" />
            <text x={x} y={y + 1} textAnchor="middle" {...small} fill="var(--ink)">{w}</text>
          </g>
        );
      })}
      <text x="120" y="578" textAnchor="middle" {...small}>→</text>
      <text x="240" y="578" textAnchor="middle" {...small}>→</text>
      <text x="180" y="620" textAnchor="middle" {...small}>→</text>
    </g>
  </svg>
);

export default function WhatIsDesignThinking() {
  return (
    <Diagram
      label="What design thinking is: three definitions around one problem"
      terms={[
        { term: 'Design thinking', def: 'A process that harnesses creativity to resolve problems and make a product, service or business better.' },
        { term: 'Experimentation-driven', def: 'Testing ideas quickly and cheaply: build the minimum needed to learn whether people want it.' },
        { term: 'VUCA', def: 'Volatile, uncertain, complex and ambiguous — the conditions design thinking suits.' },
        { term: 'Designful thinking', def: 'Deloitte’s phrase: thinking like a designer is a mindset, not a trained designer’s skills.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'The reading: in essence, design thinking is a process that harnesses creativity to resolve problems and create solutions that make a product, a service or a business better.' },
        { caption: 'Tim Brown (IDEO): it matches people’s needs with what is technologically feasible and what a viable business can convert into consumer value and market opportunity.' },
        { caption: 'The guest lecture: a human-centred, creative and experimentation-driven approach to innovation — customer at the core, many ideas, quick and cheap tests.' },
        { caption: 'Why bother: more innovations and start-ups fail from a lack of customers than from a failure of the product. Gemser adds: use it for something radically new, not incremental tweaks.' },
        { caption: 'Verganti: innovation is useful only when it creates value for people, and value comes from meaning — no design, no meaning, no value, no innovation, no business.' },
      ]}
      check={{
        question: 'A council asks why it should use design thinking for a new library app. Which reason comes from the guest lecture?',
        options: [
          { text: 'It guarantees the app will work first time, because designers check the code', why: 'Design thinking does not guarantee a working product; the lecture’s worry is the opposite case — a product that works but nobody wants.' },
          { text: 'More innovations fail from a lack of customers than from a failure of the product', correct: true, why: 'The lecture’s number one reason: people make something that works, but nobody wants it — so start with the residents who would use the app.' },
          { text: 'It suits small, incremental changes to services that already work well', why: 'Gemser says the reverse: design thinking is not suited to incremental improvement; use it for something radically different.' },
        ],
      }}
    />
  );
}
