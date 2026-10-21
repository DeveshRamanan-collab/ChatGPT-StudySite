/*
SCENE: Statutory liability for misstatements — ACL s 18 beside common law negligent misstatement
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: The same false statement can travel two parallel routes: the common law route must establish a duty of
  care, then breach, causation and damage; the s 18 route asks only "in trade or commerce?", "misleading or
  deceptive?" and a lesser causal link — and "not in trade or commerce" diverts back to the common law.
SUBJECT: the two columns side by side; the s 18 column is visibly shorter, and its first gate's "no" arrow crosses
  to the common law column.
STEP 1: the statement box forks into two column headers (common law · ACL s 18).
STEP 2: common law column — duty (emphasised: the hard part) → breach → causation → damage → liability.
STEP 3: s 18 gate one, "in trade or commerce?" — the dashed "no" arrow crosses to the common law route.
STEP 4: s 18 gates two and three — misleading or deceptive (no duty, no negligence) → causal link → liability.
STEP 5: Kimberly-Clark ("made in Australia" misleading; "flushable" not) and "a plaintiff can argue both".
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all five captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades; no layout animation. Narrow 360-unit canvas for phones.
Source: concept laws2400-w07-acl-s18-misleading-or-deceptive-conduct; week 7 notes §3; authority card
  australian-consumer-law-s18; case card accc-v-kimberly-clark-australia.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 13, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const ui = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;
const small = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink-2)' } as const;
const wire = { fill: 'none', stroke: 'var(--ink-3)', strokeWidth: 1.5 } as const;
const edge = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 1.5 } as const;

// Column boxes: left (common law) x 8–174, right (ACL s 18) x 186–352.
const L = 8;
const R = 186;
const CW = 166;

function Gate({ x, y, h, title, lines, id, strong }: { x: number; y: number; h: number; title: string[]; lines: string[]; id: string; strong?: boolean }) {
  return (
    <>
      <rect x={x} y={y} width={CW} height={h} rx="10" {...edge} strokeWidth={strong ? 2.5 : 1.5} />
      {title.map((t, i) => (
        <text key={t} x={x + 12} y={y + 20 + i * 17} {...ui} data-label={i === 0 ? id : undefined}>{t}</text>
      ))}
      {lines.map((l, i) => (
        <text key={l} x={x + 12} y={y + 20 + title.length * 17 + 2 + i * 17} {...small}>{l}</text>
      ))}
    </>
  );
}

function End({ cx, y }: { cx: number; y: number }) {
  return (
    <>
      <circle cx={cx} cy={y} r="7" fill="none" stroke="var(--ink)" strokeWidth="2" />
      <text x={cx} y={y + 26} textAnchor="middle" {...ui}>LIABILITY</text>
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 650`} role="img" aria-label="One false statement, two parallel routes: common law negligent misstatement needs duty, breach, causation and damage; ACL s 18 asks whether it was in trade or commerce, whether it was misleading or deceptive, and for a causal link; not in trade or commerce diverts to the common law route">
    <g data-step="1">
      <rect x="8" y="8" width={W - 16} height="56" rx="12" {...wire} />
      <text x="24" y="32" {...head} data-label="statement">ONE FALSE STATEMENT</text>
      <text x="24" y="54" {...note}>words or conduct · negligent or intentional</text>
      <path d="M180 64 V80 H91 V96 M180 80 H269 V96" {...wire} />
      <rect x={L} y="96" width={CW} height="48" rx="10" {...edge} />
      <text x={L + 12} y="116" {...head} data-label="common-law">COMMON LAW</text>
      <text x={L + 12} y="135" {...small}>negligent misstatement</text>
      <rect x={R} y="96" width={CW} height="48" rx="10" {...edge} />
      <text x={R + 12} y="116" {...head} data-label="acl-s18">ACL s 18</text>
      <text x={R + 12} y="135" {...small}>statutory liability</text>
    </g>
    <g data-step="2">
      <path d="M91 144 V252 M91 320 V334 M91 382 V396 M91 444 V458 M91 506 V520" {...wire} />
      <Gate x={L} y={252} h={68} id="duty" strong title={['1 · DUTY OF CARE']} lines={['special relationship:', 'the salient features']} />
      <Gate x={L} y={334} h={48} id="breach" title={['2 · BREACH']} lines={['negligence proved']} />
      <Gate x={L} y={396} h={48} id="causation" title={['3 · CAUSATION']} lines={['a full causal link']} />
      <Gate x={L} y={458} h={48} id="damage" title={['4 · DAMAGE']} lines={['the economic loss']} />
      <End cx={91} y={528} />
    </g>
    <g data-step="3">
      <line x1="269" y1="144" x2="269" y2="156" {...wire} />
      <Gate x={R} y={156} h={54} id="trade-or-commerce" title={['IN TRADE OR', 'COMMERCE?']} lines={[]} />
      <path d="M186 183 H95" {...wire} strokeDasharray="5 4" />
      <polyline points="102,178 95,183 102,188" {...wire} />
      <text x="178" y="176" textAnchor="end" {...small} fontStyle="italic">no</text>
      <text x="100" y="226" {...small} fontStyle="italic">e.g. a friend</text>
      <text x="100" y="242" {...small} fontStyle="italic">at a barbecue</text>
    </g>
    <g data-step="4">
      <path d="M269 210 V252 M269 320 V334 M269 414 V428" {...wire} />
      <text x="277" y="236" {...small} fontStyle="italic">yes</text>
      <Gate x={R} y={252} h={68} id="misleading" title={['MISLEADING OR', 'DECEPTIVE?']} lines={['no duty, no negligence']} />
      <Gate x={R} y={334} h={80} id="causal-link" title={['CAUSAL LINK']} lines={['still needed, but', 'nowhere near the', 'common law extent']} />
      <End cx={269} y={436} />
    </g>
    <g data-step="5">
      <rect x={R} y="484" width={CW} height="84" rx="10" {...wire} />
      <text x={R + 12} y="504" {...ui} data-label="kimberly-clark">KIMBERLY-CLARK</text>
      <text x={R + 12} y="524" {...small}>“made in Australia”:</text>
      <text x={R + 12} y="541" {...small}>misleading</text>
      <text x={R + 12} y="558" {...small}>“flushable”: not</text>
      <rect x="8" y="584" width={W - 16} height="58" rx="12" {...wire} />
      <text x="24" y="607" {...head} data-label="argue-both">A PLAINTIFF CAN ARGUE BOTH</text>
      <text x="24" y="629" {...note}>the common law remains relevant</text>
    </g>
  </svg>
);

export default function AclS18MisleadingConduct() {
  return (
    <Diagram
      label="Australian Consumer Law s 18 beside common law negligent misstatement"
      terms={[
        { term: 'Trade or commerce', def: 'The setting s 18 requires; a friend giving advice at a barbecue is outside it.' },
        { term: 'Misleading or deceptive', def: 'Conduct or words that mislead or deceive, or are likely to (s 18).' },
        { term: 'Causal link', def: 'Still needed under s 18, but nowhere near the extent required at common law.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'The same false statement — words or conduct, negligent or intentional — can open two routes: negligent misstatement at common law, and Australian Consumer Law s 18.' },
        { caption: 'At common law the plaintiff must establish a duty of care — a special relationship, weighed through the salient features — then breach, causation and damage.' },
        { caption: 'Section 18 asks first: was the conduct “in trade or commerce”? If not — a friend at a barbecue, say — the claim must be run as negligent misstatement.' },
        { caption: 'If so: was it “misleading or deceptive or … likely to mislead or deceive”? No duty of care and no proof of negligence. A causal link is still needed, but nowhere near the extent required at common law.' },
        { caption: 'ACCC v Kimberly-Clark: “made in Australia” was false and misleading; the “flushable” claims were not (upheld by the Full Federal Court). The common law remains relevant, and a plaintiff can argue both.' },
      ]}
      check={{
        question: 'A friend gives you careless investment advice at a barbecue, and you lose money acting on it. Which route is open?',
        options: [
          {
            text: 'ACL s 18, because no duty of care is needed',
            why: 'Section 18 applies only to conduct “in trade or commerce”; a friend at a barbecue is not engaged in it.',
          },
          {
            text: 'Negligent misstatement at common law, so a duty must be shown',
            correct: true,
            why: 'Outside trade or commerce the claim must be run as negligent misstatement — and, as Lord Reid said in Hedley Byrne, a social occasion makes a duty unlikely.',
          },
          {
            text: 'Deceit, because the advice was careless',
            why: 'Derry v Peek: negligent misstatement will not suffice for deceit, which needs an intentional or reckless misstatement.',
          },
        ],
      }}
    />
  );
}
