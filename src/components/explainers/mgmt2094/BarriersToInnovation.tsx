/*
SCENE: Barriers to innovation — drawn across the firm's boundary
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Classify a barrier by where it sits first (outside the firm: external; inside: internal), then name its type.
SUBJECT: the dashed boundary of the firm; external boxes draw above it, internal boxes inside it.
STEPS: 1 the boundary and the two zones · 2 market-related; government and its policies · 3 others: technical,
  societal, inter-organisational · 4 internal: people-related, structural, strategy-related.
REDUCED MOTION: the finished diagram with all four captions stacked.
BUDGET: < 8 KB gz (DrawSVG is in the shared motion chunk). Vertical 360-unit layout so text stays legible on phones.
Source: concept mgmt2094-w12-barriers-to-innovation (Week 12 slide 11); examples
  mgmt2094-example-guest-shelley-simpson (compliance), mgmt2094-example-gilbert-tobin-legalvision.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)' } as const;
const serif = { fontFamily: 'var(--font-body)' } as const;

function Box({ y, h = 46, title, sub, id }: { y: number; h?: number; title: string; sub?: string[]; id: string }) {
  return (
    <>
      <rect x="24" y={y} width={W - 48} height={h} rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y={y + 29} textAnchor="middle" {...serif} fontSize="16" fill="var(--ink)" data-label={id}>{title}</text>
      {sub?.map((l, i) => (
        <text key={i} x={W / 2} y={y + 52 + i * 20} textAnchor="middle" {...ui} fontSize="13" fill="var(--ink-2)">{l}</text>
      ))}
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 560`} role="img" aria-label="External barriers outside the firm's dashed boundary: market-related, government and its policies, and others. Internal barriers inside it: people-related, structural and strategy-related">
    <g data-step="1">
      <text x="8" y="18" {...ui} fontSize="12" letterSpacing="1.2" fill="var(--ink-2)">OUTSIDE THE FIRM · EXTERNAL</text>
      <rect x="8" y="300" width={W - 16} height="252" rx="16" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="7 6" />
      <text x="24" y="326" {...ui} fontSize="12" letterSpacing="1.2" fill="var(--ink-2)">INSIDE THE FIRM · INTERNAL</text>
    </g>
    <g data-step="2">
      <Box id="market" y={32} title="Market-related" />
      <Box id="government" y={90} title="Government and its policies" />
    </g>
    <g data-step="3">
      <Box id="others" y={148} h={128} title="Others" sub={['technical', 'societal', 'inter-organisational']} />
    </g>
    <g data-step="4">
      <Box id="people" y={342} title="People-related" />
      <Box id="structural" y={408} title="Structural" />
      <Box id="strategy" y={474} title="Strategy-related" />
    </g>
  </svg>
);

export default function BarriersToInnovation() {
  return (
    <Diagram
      label="Barriers to innovation, external and internal"
      terms={[
        { term: 'External barrier', def: 'An obstacle outside the organisation: market, government and its policies, or others.' },
        { term: 'Internal barrier', def: 'An obstacle inside the organisation: its people, its structure or its strategy.' },
        { term: 'Inter-organisational', def: 'One of the "other" external barriers: an obstacle arising between organisations.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Draw the firm\'s boundary first: external barriers sit outside the organisation, internal barriers inside it.' },
        { caption: 'External: market-related barriers, and government and its policies (Shelley Simpson\'s duties and taxes in each market).' },
        { caption: 'External, others: technical, societal and inter-organisational barriers.' },
        { caption: 'Internal: people-related, structural and strategy-related barriers. Classify outside or inside, then name the type.' },
      ]}
      check={{
        question: 'A company wants to co-develop a product with its supplier, but the supplier refuses to share its data. Which barrier is this?',
        options: [
          { text: 'Internal, people-related', why: 'The people refusing work for another organisation, so the obstacle sits outside the company.' },
          { text: 'External, inter-organisational', correct: true, why: 'Another organisation\'s refusal to cooperate is an inter-organisational barrier, one of the external "others".' },
          { text: 'External, market-related', why: 'The supplier is a trading partner, but the obstacle is the relationship between organisations, not the market.' },
        ],
      }}
    />
  );
}
