/*
SCENE: Cessation and full reparation — from the wrongful situation to the one that would have existed, plank by plank
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: State cessation first, then match each head of damage to the form of reparation that repairs it.
SUBJECT: the ladder of planks between the two situations.
STEP 1: the two situations and the rails between (Chorzów).
STEP 2: cessation and non-repetition (art 30).
STEP 3: restitution in kind (art 35).
STEP 4: compensation for material damage (art 36).
STEP 5: satisfaction for moral damage (art 37); the Wall and Chagos orders.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all five captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades.
Source: concept laws2000-w07-cessation-and-reparation; ARSIWA arts 30, 31, 35–37; Factory at Chorzów; Wall; Chagos.
*/
import type { ReactNode } from 'react';
import { Diagram } from '../bases/Diagram';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;
const ink = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 1.5 } as const;

const plank = (n: number, y: number, h: number, title: string, lines: string[], id: string, extra?: ReactNode) => (
  <g data-step={n}>
    {extra}
    <rect x="30" y={y} width="300" height={h} rx="6" fill="var(--paper-2)" stroke="var(--ink)" strokeWidth="1.5" />
    <text x="44" y={y + 22} {...ui} data-label={id}>{title}</text>
    {lines.map((l, i) => <text key={l} x="44" y={y + 44 + i * 18} {...note}>{l}</text>)}
  </g>
);

const figure = (
  <svg viewBox="0 0 360 530" role="img" aria-label="From the wrongful situation to the situation that would have existed: cessation, then restitution, compensation and satisfaction">
    <g data-step="1">
      <rect x="8" y="12" width="344" height="52" rx="10" {...ink} />
      <text x="180" y="34" textAnchor="middle" {...ui}>THE WRONGFUL SITUATION</text>
      <text x="180" y="54" textAnchor="middle" {...note}>wrongful act; no precluding ground</text>
      <line x1="30" y1="64" x2="30" y2="452" stroke="var(--ink-3)" strokeWidth="1.5" />
      <line x1="330" y1="64" x2="330" y2="452" stroke="var(--ink-3)" strokeWidth="1.5" />
      <rect x="8" y="452" width="344" height="66" rx="10" {...ink} strokeDasharray="6 5" />
      <text x="180" y="476" textAnchor="middle" {...ui}>WHAT WOULD HAVE EXISTED</text>
      <text x="180" y="498" textAnchor="middle" {...note}>Chorzów: wipe out all consequences</text>
    </g>
    {plank(2, 80, 84, 'CESSATION · NON-REPETITION', ['cease a continuing act; assurances', 'and guarantees if needed (art 30)'], 'cessation')}
    {plank(3, 196, 60, 'RESTITUTION (art 35)', ['in kind — return the property'], 'restitution',
      <text x="180" y="186" textAnchor="middle" {...ui} fontSize="11">FULL REPARATION (art 31)</text>)}
    {plank(4, 268, 84, 'COMPENSATION (art 36)', ['money where restitution is impossible;', 'assessable material damage only'], 'compensation')}
    {plank(5, 364, 78, 'SATISFACTION (art 37)', ['moral damage: apology, regret, or', 'a judgment declaring it wrongful'], 'satisfaction')}
  </svg>
);

export default function CessationAndReparation() {
  return (
    <Diagram
      label="Cessation and full reparation as planks from the wrongful situation to the one that would have existed"
      terms={[
        { term: 'Cessation', def: 'Stopping a continuing wrongful act (art 30(a)).' },
        { term: 'Full reparation', def: 'Making good the injury — any damage, material or moral (art 31).' },
        { term: 'Moral damage', def: 'Non-financial injury, repaired by satisfaction rather than compensation.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'With an internationally wrongful act and no circumstance precluding wrongfulness, reparation must, as far as possible, “wipe out all the consequences of the illegal act and re-establish the situation which would, in all probability, have existed” (Factory at Chorzów, PCIJ 1928).' },
        { caption: 'First, art 30: cease the act if it is continuing, and offer appropriate assurances and guarantees of non-repetition if circumstances require. In the Wall opinion Israel “must offer appropriate assurances and guarantees of non-repetition”.' },
        { caption: 'Then full reparation (art 31). Restitution (art 35) is in kind — for example, the return of property.' },
        { caption: 'Compensation (art 36) is usually money where restitution is not possible (the property was damaged). It covers financially assessable material damage, not moral damage.' },
        { caption: 'Satisfaction (art 37) repairs moral damage: an apology, an expression of regret, or a court’s judgment declaring the conduct wrongful. In the Wall (2004) Israel had to stop building, dismantle and compensate; in Chagos (2019) the UK had to end its administration as rapidly as possible.' },
      ]}
      check={{
        question: 'A state’s wrongful act humiliated another state but caused no financially assessable loss. Which form of reparation fits?',
        options: [
          { text: 'Compensation', why: 'Compensation covers financially assessable material damage, not moral damage.' },
          { text: 'Satisfaction — such as an apology or a declaratory judgment', correct: true, why: 'Art 37: satisfaction repairs moral damage.' },
          { text: 'Restitution', why: 'Restitution restores something in kind, such as returning property; nothing here can be returned.' },
        ],
      }}
    />
  );
}
