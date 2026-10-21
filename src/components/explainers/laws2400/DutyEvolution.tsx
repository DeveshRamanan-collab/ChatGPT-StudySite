/*
SCENE: How duty of care developed — Donoghue to salient features
LENGTH: 5 screens pinned (desktop, full motion); 5 paced beats otherwise
BEATS: 5
INTENT: Show that Australia started from the neighbour principle, looked at but did not adopt the English general
  tests (Anns, Caparo), and moved from proximity to the salient-features approach.
SUBJECT: the timeline line, revealed left → right; the Australian lane is the one the eye follows.
BEAT 1 (0–20%): 1932 Donoghue v Stevenson node; caption: the neighbour principle. Reveal: clip-path, ease none (scrubbed).
BEAT 2 (20–40%): 1936 Grant v Australian Knitting Mills; caption: manufacturer to consumer.
BEAT 3 (40–60%): English lane — 1964 Hedley Byrne, then Anns (proximity, then policy).
BEAT 4 (60–80%): Caparo (foreseeability, proximity, fairness) in the English lane; 1985 Heyman marks Australia
  rejecting Anns; both English tests crossed through where they meet the Australian lane.
BEAT 5 (80–100%): Australian lane — proximity as "touchstone" in the 1980s → salient features from the late 1990s
  (Sullivan v Moody 2001; Caltex v Stavar 2009).
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all five captions stacked.
BUDGET: < 12 KB gz. Dates only where the materials give them (Anns and Caparo carry no year here).
Source: week 5 notes and concept laws2400-w05-neighbour-principle-and-duty-evolution.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

interface Node { lane: 'aus' | 'uk'; year?: string; name: string; note: string; at: number; rejected?: boolean; x: number; side: 'above' | 'below' }

// Time order. Wide: x along the lanes, labels alternating above/below so neighbours never share a side.
const NODES: Node[] = [
  { lane: 'aus', year: '1932', name: 'Donoghue v Stevenson', note: 'neighbour principle', at: 0.2, x: 80, side: 'below' },
  { lane: 'aus', year: '1936', name: 'Grant v Australian Knitting Mills', note: 'manufacturer → consumer', at: 1.2, x: 170, side: 'above' },
  { lane: 'uk', year: '1964', name: 'Hedley Byrne v Heller', note: 'pure economic loss', at: 2.2, x: 345, side: 'above' },
  { lane: 'uk', name: 'Anns v Merton', note: 'proximity, then policy', at: 2.6, rejected: true, x: 420, side: 'below' },
  { lane: 'aus', year: '1985', name: 'Sutherland Shire Council v Heyman', note: 'Anns rejected', at: 3.2, x: 430, side: 'below' },
  { lane: 'uk', name: 'Caparo v Dickman', note: 'foreseeability, proximity, fairness', at: 3.5, rejected: true, x: 540, side: 'above' },
  { lane: 'aus', year: '2001', name: 'Sullivan v Moody', note: 'salient features', at: 4.2, x: 590, side: 'above' },
  { lane: 'aus', year: '2009', name: 'Caltex v Stavar', note: 'salient features listed', at: 4.6, x: 700, side: 'below' },
];

const Y = { uk: 90, aus: 230 };
const fade = (on: boolean) => ({ opacity: on ? 1 : 0, transition: 'opacity 240ms var(--ease-out)' });

function Cross({ x, y }: { x: number; y: number }) {
  return <line x1={x - 9} y1={y + 9} x2={x + 9} y2={y - 9} stroke="var(--clay)" strokeWidth="2" />;
}

function wide(t: number) {
  const reveal = Math.min(100, (t / 5) * 100);
  return (
    <svg className="x-wide" viewBox="0 0 780 330" role="img" aria-label="Timeline of duty of care from 1932 to 2009, with English and Australian lanes">
      <text x="0" y="14" fontFamily="var(--font-ui)" fontSize="12" letterSpacing="1" fill="var(--ink-2)">ENGLAND</text>
      <text x="0" y="326" fontFamily="var(--font-ui)" fontSize="12" letterSpacing="1" fill="var(--ink-2)">AUSTRALIA</text>
      <g style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}>
        <line x1="40" y1={Y.aus} x2="750" y2={Y.aus} stroke="var(--ink)" strokeWidth="2" />
        <line x1="305" y1={Y.uk} x2="600" y2={Y.uk} stroke="var(--ink-3)" strokeWidth="1.5" />
        <path d={`M280 ${Y.aus} C 295 ${Y.aus - 60}, 300 ${Y.uk + 40}, 305 ${Y.uk}`} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
        <text x="430" y={Y.aus - 14} textAnchor="middle" fontFamily="var(--font-ui)" fontSize="12" fill="var(--ink-2)">proximity as touchstone (1980s)</text>
      </g>
      {NODES.map((n) => {
        const y = Y[n.lane];
        const up = n.side === 'above';
        const row = (k: number) => (up ? y - 44 + k * 15 : y + 22 + k * 15);
        return (
          <g key={n.name} style={fade(t >= n.at)} data-node={n.name}>
            <circle cx={n.x} cy={y} r="6" fill={n.lane === 'aus' ? 'var(--ink)' : 'var(--paper)'} stroke="var(--ink)" strokeWidth="1.5" />
            {n.rejected && t >= 3.2 && <Cross x={n.x} y={y} />}
            <text x={n.x} y={row(0)} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="12" fill="var(--ink-2)">{n.year ?? ''}</text>
            <text x={n.x} y={row(1)} textAnchor="middle" fontFamily="var(--font-body)" fontStyle="italic" fontSize="13" fill="var(--ink)">{n.name}</text>
            <text x={n.x} y={row(2)} textAnchor="middle" fontFamily="var(--font-ui)" fontSize="11.5" fill="var(--ink-2)">{n.note}</text>
          </g>
        );
      })}
    </svg>
  );
}

// Narrow: one column in time order, the English cases on a short side branch, revealed top → bottom.
function tall(t: number) {
  const reveal = Math.min(100, (t / 5) * 100);
  const ROW = 56, TOP = 24;
  const ys = NODES.map((_, i) => TOP + i * ROW);
  const ukIdx = NODES.map((n, i) => (n.lane === 'uk' ? i : -1)).filter((i) => i >= 0);
  const [u0, u1] = [ukIdx[0], ukIdx[ukIdx.length - 1]];
  const H = TOP + NODES.length * ROW;
  return (
    <svg className="x-tall" viewBox={`0 0 360 ${H}`} role="img" aria-label="Timeline of duty of care from 1932 to 2009; English cases on a side branch">
      <g style={{ clipPath: `inset(0 0 ${100 - reveal}% 0)` }}>
        <line x1="20" y1={ys[0]} x2="20" y2={ys[ys.length - 1]} stroke="var(--ink)" strokeWidth="2" />
        <path d={`M20 ${ys[u0] - 30} C 20 ${ys[u0] - 14}, 48 ${ys[u0] - 18}, 48 ${ys[u0]}`} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
        <line x1="48" y1={ys[u0]} x2="48" y2={ys[u1]} stroke="var(--ink-3)" strokeWidth="1.5" />
      </g>
      {NODES.map((n, i) => {
        const cx = n.lane === 'uk' ? 48 : 20;
        return (
          <g key={n.name} style={fade(t >= n.at)} data-node={n.name}>
            <circle cx={cx} cy={ys[i]} r="6" fill={n.lane === 'aus' ? 'var(--ink)' : 'var(--paper)'} stroke="var(--ink)" strokeWidth="1.5" />
            {n.rejected && t >= 3.2 && <Cross x={cx} y={ys[i]} />}
            <text x="72" y={ys[i] + 1} fontFamily="var(--font-body)" fontSize="14" fill="var(--ink)">
              {n.year && <tspan fontFamily="var(--font-mono)" fontSize="12" fill="var(--ink-2)">{n.year}  </tspan>}
              <tspan fontStyle="italic">{n.name}</tspan>
            </text>
            <text x="72" y={ys[i] + 19} fontFamily="var(--font-ui)" fontSize="12" fill="var(--ink-2)">{n.lane === 'uk' ? 'England · ' : ''}{n.note}</text>
          </g>
        );
      })}
    </svg>
  );
}

function scene(t: number) {
  return <>{wide(t)}{tall(t)}</>;
}

export default function DutyEvolution() {
  return (
    <ScrollExplainer
      label="How the duty of care developed, 1932 to 2009"
      terms={[
        { term: 'Neighbour principle', def: 'Take reasonable care not to injure those you ought reasonably to have in contemplation.' },
        { term: 'Proximity', def: 'Closeness of relationship; once treated in Australia as the touchstone limiting foreseeability.' },
        { term: 'Salient features', def: 'The modern Australian approach: weigh the features of the relationship in a novel case.' },
        { term: 'Established category', def: 'A relationship the law already recognises as carrying a duty.' },
      ]}
      beats={[
        { caption: '1932 — Donoghue v Stevenson: the neighbour principle is the starting point for duty.' },
        { caption: '1936 — Grant v Australian Knitting Mills applies it: a manufacturer owes the consumer a duty of care.' },
        { caption: 'In England the law expands — Hedley Byrne to pure economic loss — and Anns proposes a two-stage general test.' },
        { caption: 'Caparo proposes three stages. Australia adopts neither: Heyman (1985) rejects Anns, and Caparo has never been taken up.' },
        { caption: 'Australia uses proximity as a touchstone through the 1980s, then turns to salient features from the late 1990s.' },
      ]}
      scene={scene}
      check={{
        question: 'In a novel duty case today, which approach does an Australian court use?',
        options: [
          { text: 'The Caparo three-stage test', why: 'Caparo has never been incorporated into Australian law.' },
          { text: 'The salient features approach', correct: true, why: 'From the late 1990s the High Court has weighed the salient features of the relationship.' },
          { text: 'The Anns two-stage test', why: 'Sutherland Shire Council v Heyman rejected Anns in Australia.' },
        ],
      }}
    />
  );
}
