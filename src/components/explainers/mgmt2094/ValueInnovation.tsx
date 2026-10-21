/*
SCENE: Value innovation — three building blocks of strategy, each turned
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Show value innovation as a turn on each of the three building blocks of strategy — from the conventional focus
  (struck through, faint) to the value-innovation move (solid) — then the mass-buyer test and Yellow Tail.
SUBJECT: the solid value-innovation line in each block, under the faint conventional one it replaces.
STEPS: 1 definition (superior buyer value in existing markets → a quantum leap to new markets; not layering advantage,
  not segmenting) · 2 competition · 3 customers · 4 corporate capabilities · 5 the technology test and Yellow Tail.
REDUCED MOTION: the finished diagram with all five captions stacked.
BUDGET: < 6 KB gz (DrawSVG is in the shared motion chunk). Vertical 360-unit layout so text stays legible on phones.
Source: concept mgmt2094-w11-value-innovation (Week 11 slides 15–17; Week 9 recording); example yellow-tail.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)' } as const;
const serif = { fontFamily: 'var(--font-body)' } as const;

function Block({ y, title, conventional, vi, id }: { y: number; title: string; conventional: string[]; vi: string[]; id: string }) {
  const convTop = y + 22;
  const viTop = convTop + conventional.length * 18 + 14;
  const bottom = viTop + vi.length * 20 - 6;
  return (
    <>
      <line x1="16" y1={y + 6} x2="16" y2={bottom} stroke="var(--ink)" strokeWidth="2" />
      <text x="28" y={y + 12} {...ui} fontSize="11" letterSpacing="1.2" fill="var(--ink-2)" data-label={id}>{title}</text>
      {conventional.map((l, i) => (
        <g key={i}>
          <text x="28" y={convTop + 12 + i * 18} {...ui} fontSize="13" fill="var(--ink-3)">{l}</text>
          <line x1="28" y1={convTop + 7 + i * 18} x2={28 + l.length * 5.8} y2={convTop + 7 + i * 18} stroke="var(--ink-3)" strokeWidth="1" />
        </g>
      ))}
      {vi.map((l, i) => (
        <text key={i} x="28" y={viTop + 14 + i * 20} {...serif} fontSize="15" fill="var(--ink)">{l}</text>
      ))}
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 600`} role="img" aria-label="Three building blocks of strategy. Competition: from outperforming rivals to radically superior value for the mass market. Customers: from retaining existing customers to following non-customers. Capabilities: from extending current capabilities to combining them">
    <g data-step="1">
      <rect x="8" y="6" width={W - 16} height="96" rx="10" fill="var(--paper-3)" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="22" y="28" {...ui} fontSize="11" letterSpacing="1.2" fill="var(--ink-2)">VALUE INNOVATION</text>
      <text x="22" y="50" {...serif} fontSize="15" fill="var(--ink)">superior buyer value in existing markets,</text>
      <text x="22" y="70" {...serif} fontSize="15" fill="var(--ink)">a quantum leap to create new markets</text>
      <text x="22" y="91" {...ui} fontSize="12" fill="var(--ink-2)">not layering advantage · not segmenting the market</text>
    </g>
    <g data-step="2">
      <Block id="competition" y={124} title="COMPETITION" conventional={['outperforming the competition']} vi={['radically superior value to capture', 'the entire mass market']} />
    </g>
    <g data-step="3">
      <Block id="customers" y={232} title="CUSTOMERS" conventional={['retaining and better satisfying', 'existing customers']} vi={['the mass of buyers: follow non-customers,', 'willingly losing some existing ones']} />
    </g>
    <g data-step="4">
      <Block id="capabilities" y={358} title="CORPORATE CAPABILITIES" conventional={['leveraging and extending current ones']} vi={["willing to combine a company's", 'capabilities']} />
    </g>
    <g data-step="5">
      <rect x="8" y="474" width={W - 16} height="118" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="22" y="498" {...ui} fontSize="11" letterSpacing="1.2" fill="var(--ink-2)">THE TECHNOLOGY TEST</text>
      <text x="22" y="520" {...serif} fontSize="15" fill="var(--ink)">new technology counts only when it is</text>
      <text x="22" y="540" {...serif} fontSize="15" fill="var(--ink)">cheap enough for mass buyers</text>
      <text x="22" y="566" {...ui} fontSize="12" fill="var(--ink-2)">Yellow Tail: still just wine, rethought for</text>
      <text x="22" y="583" {...ui} fontSize="12" fill="var(--ink-2)">people who were not wine buyers</text>
    </g>
  </svg>
);

export default function ValueInnovation() {
  return (
    <Diagram
      label="Value innovation across the three building blocks of strategy"
      terms={[
        { term: 'Value innovation', def: 'Creating superior buyer value in existing markets that enables a quantum leap to new markets.' },
        { term: 'Non-customers', def: 'People who do not buy in the market yet; value innovation follows them closely.' },
        { term: 'Mass buyers', def: 'The broad market. New technology becomes value innovation only when they can afford it.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Value innovation offers superior buyer value in existing markets and enables a quantum leap to new markets. It is not building layers of competitive advantage, and not segmenting the market to accommodate needs.' },
        { caption: 'Competition: not outperforming the competition, but seeking radically superior value to capture the entire mass market.' },
        { caption: 'Customers: not retaining and better satisfying existing customers, but targeting the mass of buyers by following non-customers closely — willingly losing some existing customers.' },
        { caption: "Corporate capabilities: not just leveraging and extending current capabilities, but being willing to combine a company's capabilities." },
        { caption: 'New technology is not value innovation unless it is cheap enough for mass buyers. Yellow Tail was still just wine, but rethinking what wine is for created value for non-customers.' },
      ]}
      check={{
        question: 'A firm adds a fourth layer of competitive advantage to stay ahead of its main rival. Is that value innovation on the slides?',
        options: [
          { text: 'Yes: more advantage over rivals is more value', why: 'Tempting because advantage sounds like value, but the slide says value innovation is different from building layers of competitive advantage.' },
          { text: 'No: it is still outperforming the competition', correct: true, why: 'Value innovation turns from outperforming rivals to radically superior value for the mass market, often by following non-customers.' },
          { text: 'Only if the new layer is a technology', why: 'Tempting because technology features in the slides, but even new technology counts only when it is cheap enough for mass buyers.' },
        ],
      }}
    />
  );
}
