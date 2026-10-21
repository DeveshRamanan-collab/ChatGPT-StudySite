/*
SCENE: Product liability — a supply chain with the duty of care alongside other regimes
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: Negligence became a basis for liability for defective products generally after Donoghue and Grant, alongside
  (not replacing) contract, sale of goods and the ACL — and a duty owed is not a duty breached (Graham Barclay).
SUBJECT: the negligence line running from manufacturer to consumer.
BEAT 1 (0–25%): the chain manufacturer → distributor → consumer; only a "dangerous things" duty, dashed. Ease none.
BEAT 2 (25–50%): the negligence line draws on (scaleX from the left): Donoghue v Stevenson, Grant.
BEAT 3 (50–75%): three parallel lanes fade in beneath: contract, sale of goods, Australian Consumer Law.
BEAT 4 (75–100%): Graham Barclay panel: government no duty; grower duty but no breach — a balance tips toward
  "precaution not required".
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked (base).
BUDGET: < 7 KB gz. Transform and opacity only.
Source: concept laws2400-w06-product-liability-duty-of-care; Graham Barclay Oysters v Ryan.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const W = 360;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;
const NODES = [{ x: 40, name: 'MANUFACTURER' }, { x: 180, name: 'DISTRIBUTOR' }, { x: 320, name: 'CONSUMER' }];
const LANES = ['contract', 'sale-of-goods law', 'Australian Consumer Law'];

function scene(t: number) {
  const neg = clamp((t - 1) / 0.7);
  const lanes = clamp((t - 2) * 2);
  const bal = clamp((t - 3) * 2);
  return (
    <svg viewBox={`0 0 ${W} 470`} role="img" aria-label="Manufacturer, distributor and consumer, with a negligence duty alongside contract, sale of goods and consumer law">
      {NODES.map((n) => (
        <g key={n.name}>
          <circle cx={n.x} cy="40" r="8" fill="var(--ink)" />
          <text x={n.x} y="22" textAnchor="middle" {...ui} fontSize="11.5">{n.name}</text>
        </g>
      ))}
      <line x1="48" y1="40" x2="312" y2="40" stroke="var(--ink-3)" strokeWidth="1.5" />
      <g opacity={1 - neg * 0.7}>
        <line x1="40" y1="70" x2="320" y2="70" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="5 6" />
        <text x="40" y="92" {...note}>before Donoghue: duty for “dangerous things” only</text>
      </g>
      <g opacity={neg > 0 ? 1 : 0}>
        <line x1="0" y1="0" x2="280" y2="0" stroke="var(--ink)" strokeWidth="2.5" transform={`translate(40 118) scale(${neg} 1)`} />
        <text x="40" y="142" {...ui} opacity={neg}>NEGLIGENCE: DUTY OF CARE</text>
        <text x="40" y="162" {...note} opacity={neg}>Donoghue v Stevenson · Grant v AKM</text>
      </g>
      <g opacity={lanes}>
        <text x="40" y="196" {...ui} fill="var(--ink-2)">ALONGSIDE, NOT REPLACED</text>
        {LANES.map((l, i) => (
          <g key={l}>
            <line x1="40" y1={214 + i * 26} x2="320" y2={214 + i * 26} stroke="var(--ink-3)" strokeWidth="1.5" />
            <text x="46" y={210 + i * 26} {...note} fontSize="13">{l}</text>
          </g>
        ))}
      </g>
      <g opacity={bal}>
        <rect x="8" y="296" width={W - 16} height="166" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
        <text x="24" y="322" {...ui}>GRAHAM BARCLAY OYSTERS v RYAN</text>
        <text x="24" y="344" {...note}>NSW government: no duty · grower: duty, not breached</text>
        <g transform={`rotate(${8 * bal} 180 400)`}>
          <line x1="70" y1="400" x2="290" y2="400" stroke="var(--ink)" strokeWidth="2" />
          <text x="70" y="388" {...note} fontSize="13">probability</text>
          <text x="290" y="388" textAnchor="end" {...note} fontSize="13">cost, difficulty,</text>
          <text x="290" y="420" textAnchor="end" {...note} fontSize="13">inconvenience</text>
        </g>
        <polygon points="180,402 170,420 190,420" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="24" y="448" {...note}>eliminating the risk was not reasonably required</text>
      </g>
    </svg>
  );
}

export default function ProductLiabilityDutyOfCare() {
  return (
    <ScrollExplainer
      label="Product liability: the duty of care beside contract and consumer law"
      terms={[
        { term: 'Dangerous things', def: 'Before Donoghue, the only goods whose owner had a duty to keep them from third parties.' },
        { term: 'Australian Consumer Law', def: 'Statutory consumer protection that sits alongside negligence for defective products.' },
        { term: 'Depuration', def: "The grower's cleansing process in Graham Barclay: it reduced, but could not eliminate, the viral load." },
      ]}
      beats={[
        { caption: 'Before Donoghue v Stevenson, only the owner of “dangerous things” had a duty to take reasonable precautions to keep them from third parties.' },
        { caption: 'After Donoghue and Grant v Australian Knitting Mills, ordinary negligence principles became a basis for liability for defective products generally.' },
        { caption: 'That duty sits alongside, not in place of, liability in contract, under sale-of-goods law and under the Australian Consumer Law.' },
        { caption: 'Graham Barclay: the NSW government owed no duty; the grower owed one but did not breach it — the probability of the risk did not justify the difficult, expensive and inconvenient action of eliminating it.' },
      ]}
      scene={scene}
      check={{
        question: 'In Graham Barclay Oysters v Ryan, why did the claim against the grower fail?',
        options: [
          { text: 'The grower owed the consumers no duty of care', why: 'It was the NSW government that owed no duty; the grower did owe one.' },
          { text: 'The risk of contamination was not reasonably foreseeable', why: 'The risk was reasonably foreseeable and its magnitude significant — foreseeability was not the problem.' },
          { text: 'Eliminating the risk was not a reasonable precaution given its probability', correct: true, why: 'Duty was owed but not breached: the probability did not justify the difficult, expensive and inconvenient alleviating action.' },
        ],
      }}
    />
  );
}
