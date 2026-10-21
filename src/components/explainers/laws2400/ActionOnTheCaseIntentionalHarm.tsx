/*
SCENE: Action on the case for intentional harm — two doors out of trespass's dead end
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: When harm is indirect or non-physical, trespass fails on directness; case offers two doors — malicious
  prosecution (four elements plus damage) and Wilkinson v Downton (a wilful act calculated to cause harm).
SUBJECT: the branch line from the dead end to each door.
STEPS: 1 trespass's dead end · 2 door A: malicious prosecution · 3 door B: Wilkinson v Downton · 4 Naidu: reckless
  indifference is enough.
REDUCED MOTION: the finished diagram with all four captions stacked.
BUDGET: < 6 KB gz. Narrow 360-unit canvas.
Source: concept laws2400-w02-action-on-the-case-intentional-harm; case cards a-v-new-south-wales,
  wilkinson-v-downton, nationwide-news-v-naidu.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)', fontSize: 13, letterSpacing: 1.5, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 15, fill: 'var(--ink-2)' } as const;

function Door({ y, h, title, lines, id, dashed }: { y: number; h: number; title: string; lines: string[]; id: string; dashed?: boolean }) {
  return (
    <>
      <rect x="40" y={y} width={W - 48} height={h} rx="12" fill="none" stroke={dashed ? 'var(--ink-3)' : 'var(--ink)'} strokeWidth="1.5" strokeDasharray={dashed ? '6 6' : undefined} />
      <text x="58" y={y + 26} {...ui} data-label={id}>{title}</text>
      {lines.map((l, i) => <text key={i} x="58" y={y + 50 + i * 21} {...body}>{l}</text>)}
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 690`} role="img" aria-label="Trespass is a dead end for indirect harm; two doors lead to malicious prosecution and to Wilkinson v Downton">
    <g data-step="1">
      <rect x="8" y="10" width={W - 16} height="96" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x={W / 2} y="36" textAnchor="middle" {...ui} data-label="trespass">TRESPASS — DEAD END</text>
      <text x={W / 2} y="62" textAnchor="middle" {...body}>needs a direct interference, so</text>
      <text x={W / 2} y="84" textAnchor="middle" {...body}>indirect or psychiatric harm falls out</text>
    </g>
    <g data-step="2">
      <path d="M24 106 L24 250 L40 250" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <Door id="malicious-prosecution" y={140} h={230} title="DOOR A · MALICIOUS PROSECUTION" lines={['1  D initiated proceedings against P', "2  they ended in P's favour", '3  D acted maliciously', '4  without reasonable and probable', '    cause (A v New South Wales)', '+  damage: life, liberty, reputation', '    or property']} />
    </g>
    <g data-step="3">
      <path d="M24 250 L24 470 L40 470" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <Door id="wilkinson" y={400} h={140} title="DOOR B · WILKINSON v DOWNTON" lines={['wilfully doing an act calculated to', 'cause physical harm, and actually', 'causing it (a practical joke →', 'nervous shock)']} />
    </g>
    <g data-step="4">
      <path d="M200 540 L200 570" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <Door id="naidu" dashed y={570} h={110} title="NATIONWIDE NEWS v NAIDU" lines={['no actual intention to harm needed:', 'reckless indifference suffices', '(workplace bullying → PTSD)']} />
    </g>
  </svg>
);

export default function ActionOnTheCaseIntentionalHarm() {
  return (
    <Diagram
      label="Two doors out of trespass for indirect or non-physical intentional harm"
      terms={[
        { term: 'Action on the case', def: 'The family of actions for indirect harm; damage must be proved.' },
        { term: 'Malice', def: 'A positive requirement: acting for a non-legitimate purpose.' },
        { term: 'Reasonable and probable cause', def: 'Its absence is a separate, negative requirement, tested subjectively and objectively.' },
        { term: 'Reckless indifference', def: 'Not caring whether harm results — enough for Wilkinson v Downton liability.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Trespass needs directness, and negligence needs a duty of care. Indirect or psychiatric harm inflicted on purpose can fall through both.' },
        { caption: "Door A — malicious prosecution: D initiated proceedings, they ended in P's favour, D acted maliciously and without reasonable and probable cause; plus damage. Malice and no cause are distinct (A v NSW)." },
        { caption: 'Door B — Wilkinson v Downton: wilfully doing an act calculated to cause physical harm, and actually causing it.' },
        { caption: 'Actual subjective intention to harm is not required: reckless indifference to the result will suffice (Nationwide News v Naidu).' },
      ]}
      check={{
        question: 'In malicious prosecution, the plaintiff proves malice. Is the absence of reasonable and probable cause then established too?',
        options: [
          { text: 'Yes — malice implies there was no proper cause', why: 'A v New South Wales treats them as distinct elements; one does not prove the other.' },
          { text: 'No — it is a separate element that must also be proved', correct: true, why: 'Malice is a positive requirement and the absence of reasonable and probable cause a negative one; both must be met.' },
          { text: 'It does not matter, because damage alone is enough', why: 'Damage is required because this is an action on the case, but it does not replace the four elements.' },
        ],
      }}
    />
  );
}
