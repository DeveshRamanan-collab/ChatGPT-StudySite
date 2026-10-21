/*
SCENE: Reasonable foreseeability — one phrase, asked three times
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Foreseeability is asked at duty, breach and remoteness, and narrows each time "from the general to the
  particular"; a defendant's "I couldn't foresee exactly what happened" disputes only one of the three.
SUBJECT: the chain of three links, drawn top to bottom, with a narrowing funnel beside it.
STEP 1: link 1 — duty: injury of some kind to P or a class including P, as a possibility.
STEP 2: link 2 — breach: the kind of carelessness might foreseeably cause damage of some kind.
STEP 3: link 3 — remoteness: the kind of damage actually suffered was foreseeable.
STEP 4: the funnel "general → particular" and Chapman v Hearse at link 1: precise sequence not needed.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all four captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades.
Source: concept laws2400-w05-reasonable-foreseeability-meaning; Chapman v Hearse.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)', fontSize: 13, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;

const LINKS = [
  { id: 'duty', title: 'DUTY', lines: ['injury of some kind to P, or to a', 'class including P, as a possibility'] },
  { id: 'breach', title: 'BREACH', lines: ['this kind of carelessness might', 'foreseeably cause damage of some kind'] },
  { id: 'remoteness', title: 'REMOTENESS', lines: ['the kind of damage P actually', 'suffered was foreseeable'] },
];

const figure = (
  <svg viewBox={`0 0 ${W} 520`} role="img" aria-label="Three chained links: duty, breach, remoteness, narrowing from the general to the particular">
    {LINKS.map((l, i) => {
      const y = 12 + i * 130;
      return (
        <g key={l.id} data-step={i + 1}>
          {i > 0 && <line x1="120" y1={y - 26} x2="120" y2={y} stroke="var(--ink-3)" strokeWidth="1.5" />}
          <rect x="40" y={y} width={W - 48} height="104" rx="52" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
          <text x="72" y={y + 34} {...ui} data-label={l.id}>{i + 1} · {l.title}</text>
          {l.lines.map((t, k) => <text key={k} x="72" y={y + 60 + k * 20} {...note}>{t}</text>)}
        </g>
      );
    })}
    <g data-step="4">
      <polygon points="8,20 30,20 22,380 16,380" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x="8" y="412" {...ui}>GENERAL → PARTICULAR</text>
      <text x="8" y="436" {...note}>Glass JA</text>
      <rect x="8" y="452" width={W - 16} height="60" rx="10" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 5" />
      <text x="22" y="476" {...note}>Chapman v Hearse, at link 1: the precise</text>
      <text x="22" y="497" {...note}>chain of events need not be foreseen</text>
    </g>
  </svg>
);

export default function ReasonableForeseeabilityMeaning() {
  return (
    <Diagram
      label="What reasonable foreseeability means at duty, breach and remoteness"
      terms={[
        { term: 'Reasonably foreseeable', def: 'Foreseeable as a possibility by a reasonable person — asked three times in negligence.' },
        { term: 'Class of persons', def: 'A group the plaintiff belongs to, such as bystanders rendering aid at an accident.' },
        { term: 'Remoteness', def: 'Whether the kind of damage actually suffered was a foreseeable outcome of the carelessness.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Duty: was injury of some kind to the plaintiff, or to a class of persons including them, reasonably foreseeable as a possibility?' },
        { caption: 'Breach: might the kind of carelessness charged against the defendant foreseeably cause damage of some kind?' },
        { caption: 'Remoteness: was the kind of damage the plaintiff actually suffered foreseeable as a possible outcome of that carelessness?' },
        { caption: 'The inquiry moves “from the general to the particular”. In Chapman v Hearse it was enough that injury to a bystander rendering aid was foreseeable — not the exact chain of events.' },
      ]}
      check={{
        question: 'Chapman argued he owed Dr Cherry no duty because he could not foresee the exact chain of events. Why did that fail?',
        options: [
          { text: 'Because foreseeability is irrelevant to duty', why: 'Foreseeability is always required at the duty stage; the question is what must be foreseen.' },
          { text: 'Because at duty it is enough that injury to a class including Cherry was foreseeable', correct: true, why: 'The duty question is general: injury of some kind to a class of persons including the plaintiff, not the precise sequence.' },
          { text: 'Because the kind of damage Cherry suffered was foreseeable', why: 'That is the remoteness question; Chapman was disputing duty, which asks something more general.' },
        ],
      }}
    />
  );
}
