/*
SCENE: Duty for pure economic loss — foreseeability, four Hedley Byrne gates, then a separate vulnerability check
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Foreseeability of pure economic loss is necessary but never sufficient: a negligent-advice claim must pass
  all four Hedley Byrne factors and then, separately, show the plaintiff was vulnerable.
SUBJECT: the column of gates, drawn top to bottom; the eye follows the claim down the spine.
STEP 1: foreseeability box — "necessary, never sufficient" (Perre v Apand; indeterminate liability).
STEP 2: the four Hedley Byrne gates: special relationship, assumption of responsibility, reliance, reasonable reliance.
STEP 3: a separate vulnerability gate (Woolcock): could the plaintiff have protected themselves?
STEP 4: outcome — duty; side note: Heller's disclaimer defeated Hedley Byrne itself.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all four captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades; no layout animation.
Source: concept laws2400-w05-duty-of-care-and-pure-economic-loss; Hedley Byrne, Perre v Apand, Woolcock; CLA s 5.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)', fontSize: 13, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;

function Gate({ y, title, sub, id, dashed }: { y: number; title: string; sub: string; id: string; dashed?: boolean }) {
  return (
    <>
      <rect x="40" y={y} width={W - 48} height="52" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray={dashed ? '6 5' : undefined} />
      <text x="56" y={y + 22} {...ui} data-label={id}>{title}</text>
      <text x="56" y={y + 41} {...note}>{sub}</text>
    </>
  );
}

const HB = [
  { id: 'special', title: '1 · SPECIAL RELATIONSHIP', sub: 'between adviser and advisee' },
  { id: 'assumption', title: '2 · ASSUMPTION OF RESPONSIBILITY', sub: 'voluntary, by the adviser' },
  { id: 'reliance', title: '3 · RELIANCE', sub: 'the other party relied on it' },
  { id: 'reasonable', title: '4 · REASONABLE RELIANCE', sub: 'the reliance was reasonable' },
];

const figure = (
  <svg viewBox={`0 0 ${W} 640`} role="img" aria-label="Foreseeability, then four Hedley Byrne gates, then a separate vulnerability check, then duty">
    <g data-step="1">
      <rect x="8" y="8" width={W - 16} height="70" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x="24" y="34" {...ui} data-label="foreseeability">REASONABLE FORESEEABILITY OF THE LOSS</text>
      <text x="24" y="58" {...note}>necessary, never sufficient (Perre v Apand)</text>
    </g>
    <g data-step="2">
      <line x1="22" y1="78" x2="22" y2="414" stroke="var(--ink-3)" strokeWidth="1.5" />
      {HB.map((g, i) => <Gate key={g.id} y={100 + i * 74} {...g} />)}
    </g>
    <g data-step="3">
      <line x1="22" y1="414" x2="22" y2="520" stroke="var(--ink-3)" strokeWidth="1.5" />
      <Gate y={440} id="vulnerability" title="THEN, SEPARATELY: VULNERABILITY" sub="could P have protected themselves?" dashed />
      <text x="56" y="514" {...note}>Woolcock v CDG</text>
    </g>
    <g data-step="4">
      <circle cx="22" cy="560" r="8" fill="none" stroke="var(--ink)" strokeWidth="2" />
      <text x="40" y="565" {...ui} data-label="duty">DUTY OF CARE FOR PEL</text>
      <text x="40" y="598" {...note}>Hedley Byrne itself lost: Heller had</text>
      <text x="40" y="618" {...note}>disclaimed responsibility (gate 2 shut)</text>
    </g>
  </svg>
);

export default function DutyOfCareAndPureEconomicLoss() {
  return (
    <Diagram
      label="Duty of care for pure economic loss"
      terms={[
        { term: 'Pure economic loss', def: 'Loss not consequent on physical injury to person or property; within “harm” in CLA s 5.' },
        { term: 'Indeterminate liability', def: 'Liability in an indeterminate amount (Ultramares) — why foreseeability alone is not enough.' },
        { term: 'Vulnerability', def: "The plaintiff's inability to protect themselves from the defendant's want of care." },
      ]}
      figure={figure}
      steps={[
        { caption: 'Pure economic loss must be reasonably foreseeable — but that is never enough on its own (Perre v Apand), because of indeterminate liability and disproportion to blameworthiness.' },
        { caption: 'For negligent misstatement, Hedley Byrne adds four factors: a special relationship, a voluntary assumption of responsibility, reliance, and reasonable reliance.' },
        { caption: 'Then check vulnerability separately (Woolcock): could the plaintiff have protected themselves another way?' },
        { caption: 'Only then is a duty owed. Hedley Byrne itself failed because Heller had disclaimed responsibility for its reference.' },
      ]}
      check={{
        question: 'An adviser clearly disclaimed responsibility for a reference that P relied on. Which Hedley Byrne factor fails?',
        options: [
          { text: 'Reasonable foreseeability of the loss', why: 'The loss may still be foreseeable; foreseeability is necessary but is not the factor a disclaimer defeats.' },
          { text: 'A voluntary assumption of responsibility by the adviser', correct: true, why: 'A disclaimer means the adviser did not assume responsibility — which is why Hedley Byrne itself lost.' },
          { text: 'Vulnerability of the plaintiff', why: 'Vulnerability is a separate check after the four factors; the disclaimer goes to assumption of responsibility.' },
        ],
      }}
    />
  );
}
