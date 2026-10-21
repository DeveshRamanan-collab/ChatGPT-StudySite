/*
SCENE: Sport and recreational injury — a decision flow ending in "no duty / no liability" or "duty, ask breach"
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Separate the sport's inherent risk from a distinct failure (Rootes v Shelton), then check whether CLA s 5L
  (obvious risk of a dangerous recreational activity) or s 5M (risk warning) removes liability regardless.
SUBJECT: the spine of three questions; each exit to the right is a way out for the defendant.
STEP 1: Q1 inherent risk of the sport? → accepted (Rootes; Agar v Hyde); a distinct failure (duty to warn) → continue.
STEP 2: Q2 obvious risk of a dangerous recreational activity? → s 5L: no liability, whether or not P knew.
STEP 3: Q3 recreational risk subject of a risk warning? → s 5M: no duty, whether or not understood.
STEP 4: bottom outcome — duty owed; ask breach.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished flow with all four captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades.
Source: concept laws2400-w06-sport-and-recreational-injury; Rootes v Shelton, Agar v Hyde; CLA ss 5L, 5M.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;

function Step({ y, q, exit, sub, id, n }: { y: number; q: string[]; exit: string; sub: string[]; id: string; n: number }) {
  return (
    <g data-step={n}>
      <rect x="8" y={y} width="196" height="84" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      {q.map((l, i) => <text key={i} x="20" y={y + 24 + i * 19} {...note} fill="var(--ink)" data-label={i === 0 ? id : undefined}>{l}</text>)}
      <line x1="204" y1={y + 30} x2="226" y2={y + 30} stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x="232" y={y + 34} {...ui}>{exit}</text>
      {sub.map((l, i) => <text key={i} x="232" y={y + 54 + i * 18} {...note} fontSize="12.5">{l}</text>)}
      <line x1="106" y1={y + 84} x2="106" y2={y + 116} stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x="114" y={y + 106} {...note} fontSize="12">no</text>
    </g>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 460`} role="img" aria-label="Three questions, each with an exit: inherent risk, section 5L obvious risk, section 5M risk warning; otherwise duty, ask breach">
    <Step n={1} id="inherent" y={8} q={['Harm from a risk', 'inherent in the sport?', '(not a distinct failure)']} exit="ACCEPTED" sub={['Rootes v Shelton;', 'Agar v Hyde']} />
    <Step n={2} id="s5l" y={124} q={['Obvious risk of a', 'dangerous recreational', 'activity?']} exit="s 5L: NO" sub={['LIABILITY — whether', 'or not P knew']} />
    <Step n={3} id="s5m" y={240} q={['Recreational risk the', 'subject of a risk', 'warning?']} exit="s 5M: NO" sub={['DUTY — whether or', 'not understood']} />
    <g data-step="4">
      <rect x="8" y="364" width={W - 16} height="84" rx="12" fill="none" stroke="var(--ink)" strokeWidth="2" />
      <text x="24" y="392" {...ui} data-label="breach">DUTY OWED — NOW ASK BREACH</text>
      <text x="24" y="414" {...note}>e.g. the observer's separate duty to warn</text>
      <text x="24" y="434" {...note}>the skier in Rootes v Shelton</text>
    </g>
  </svg>
);

export default function SportAndRecreationalInjury() {
  return (
    <Diagram
      label="Sport and recreational injury: a decision flow"
      terms={[
        { term: 'Inherent risk', def: 'A risk participants accept as part of the sport or pastime itself.' },
        { term: 'Dangerous recreational activity', def: 'The CLA regime in s 5L: no liability for harm from its obvious risks.' },
        { term: 'Risk warning', def: 'Spoken or written, general or specific; under s 5M it removes the duty over a recreational risk.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Participants accept risks inherent in the sport, but that “does not eliminate all duty of care” (Rootes v Shelton). Agar v Hyde: no duty on rugby’s governing body — the answer is fact-specific.' },
        { caption: 'Section 5L: no liability for harm from an obvious risk of a dangerous recreational activity, whether or not the plaintiff knew of it.' },
        { caption: 'Section 5M: no duty of care over a recreational risk that was the subject of a risk warning, whether or not it was understood.' },
        { caption: 'Otherwise a duty is owed and breach is in issue — as with the observer’s separate duty to warn the skier in Rootes v Shelton.' },
      ]}
      check={{
        question: 'A water-skier hits a boat the observer failed to warn about. What did Rootes v Shelton hold?',
        options: [
          { text: 'No duty: collisions are an inherent risk of water-skiing', why: 'The collision was not an inherent risk; it followed a distinct failure to warn.' },
          { text: 'A duty was owed and breached by the observer’s failure to warn', correct: true, why: 'Accepting inherent risks does not eliminate all duty; the observer had a separate duty to warn.' },
          { text: 'No liability because the skier knew skiing was dangerous', why: 'The skier’s knowledge was not the point: the observer’s distinct failure to warn founded the breach.' },
        ],
      }}
    />
  );
}
