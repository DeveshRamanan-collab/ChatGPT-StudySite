/*
SCENE: International law's view of national law — a scale on which "lawful at home" weighs nothing, then four feeds
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Domestic legality and international legality are two different questions — yet national law still feeds
  international law in four ways.
SUBJECT: the tilted scale, then the box that national law feeds.
STEP 1: the scale — the breach outweighs a domestic "lawful" label.
STEP 2: arts 27 and 46 VCLT.
STEP 3: art 3 of the 2001 Draft Articles on State Responsibility.
STEP 4: national law feeds international law — fulfilment, evidence, subsidiary source, interpretation.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all four captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades.
Source: concept laws2000-w05-il-perspective-on-national-law; VCLT arts 27, 46; ILC Draft Articles 2001 art 3.
*/
import { Diagram } from '../bases/Diagram';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;
const ink = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 1.5 } as const;
const FEEDS = [
  { x: 95, y: 430, a: 'fulfilment of', b: 'obligations' },
  { x: 265, y: 430, a: 'evidence: practice,', b: 'opinio juris' },
  { x: 95, y: 490, a: 'subsidiary source', b: '(art 38, ICJ Statute)' },
  { x: 265, y: 490, a: 'interpretation,', b: 'general principles' },
];

const figure = (
  <svg viewBox="0 0 360 530" role="img" aria-label="On the international scale a breach outweighs a domestic lawful label; national law still feeds international law in four ways">
    <g data-step="1">
      <text x="180" y="22" textAnchor="middle" {...ui}>ON THE INTERNATIONAL SCALE</text>
      <line x1="60" y1="110" x2="300" y2="70" {...ink} strokeWidth="2" />
      <line x1="180" y1="90" x2="180" y2="186" {...ink} />
      <line x1="140" y1="186" x2="220" y2="186" {...ink} />
      <line x1="60" y1="110" x2="60" y2="136" {...ink} />
      <path d="M 24 136 Q 60 152 96 136" {...ink} />
      <text x="60" y="170" textAnchor="middle" {...ui} data-label="breach">BREACH</text>
      <line x1="300" y1="70" x2="300" y2="92" {...ink} />
      <path d="M 264 92 Q 300 108 336 92" {...ink} />
      <text x="300" y="124" textAnchor="middle" {...note} data-label="lawful">“lawful at</text>
      <text x="300" y="142" textAnchor="middle" {...note}>home”</text>
    </g>
    <g data-step="2">
      <text x="16" y="216" {...note} fill="var(--ink)">art 27 VCLT: internal law is no excuse</text>
      <text x="16" y="236" {...note}>art 46: a consent defect counts only if</text>
      <text x="16" y="254" {...note}>manifest and of fundamental importance</text>
    </g>
    <g data-step="3">
      <text x="16" y="282" {...note} fill="var(--ink)">art 3 (2001): wrongfulness is governed</text>
      <text x="16" y="300" {...note}>by international law, not internal labels</text>
    </g>
    <g data-step="4">
      <rect x="80" y="330" width="200" height="38" rx="8" fill="var(--paper-2)" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="180" y="354" textAnchor="middle" {...ui} fontSize="11.5">INTERNATIONAL LAW</text>
      {FEEDS.map((f) => (
        <g key={f.a}>
          <line x1={f.x} y1={f.y - 16} x2={f.x < 180 ? 150 : 210} y2="368" {...ink} strokeDasharray={f.y > 450 ? '3 4' : undefined} />
          <text x={f.x} y={f.y} textAnchor="middle" {...note} fontSize="12.5">{f.a}</text>
          <text x={f.x} y={f.y + 17} textAnchor="middle" {...note} fontSize="12.5">{f.b}</text>
        </g>
      ))}
    </g>
  </svg>
);

export default function IlPerspectiveOnNationalLaw() {
  return (
    <Diagram
      label="International law's view of national law: a scale and four feeds"
      terms={[
        { term: 'Internal law', def: 'A state’s own national law, including its constitution.' },
        { term: 'Manifest', def: 'Objectively evident to any state acting in accordance with normal practice and in good faith (VCLT art 46).' },
        { term: 'Characterisation', def: 'How internal law labels an act — lawful or not — which does not decide international wrongfulness.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'From an international law perspective, a state cannot justify a breach of international law based on its internal law: “our law allows it” weighs nothing.' },
        { caption: 'Art 27 VCLT: “A party may not invoke the provisions of its internal law as justification for its failure to perform a treaty”. Art 46: consent given in breach of internal rules on competence does not escape the treaty unless the violation was “manifest” and concerned a rule “of fundamental importance”.' },
        { caption: 'Beyond treaties, art 3 of the ILC Draft Articles on State Responsibility (2001), mostly recognised as custom: wrongfulness “is governed by international law” and “is not affected by the characterization of the same act as lawful by internal law”.' },
        { caption: 'Yet national law still matters: it fulfils obligations that need legislation; it is evidence of compliance and of state practice and opinio juris; national decisions can be subsidiary sources (art 38); and it can interpret international law and help identify general principles.' },
      ]}
      check={{
        question: 'A state detained foreign nationals in breach of a treaty, but its parliament had authorised the detention. What is the international law position?',
        options: [
          { text: 'No breach — the detention was lawful under national law', why: 'Domestic legality does not affect international wrongfulness (art 3).' },
          { text: 'Still a breach — internal law cannot justify failing to perform a treaty', correct: true, why: 'Art 27 VCLT and art 3: domestic and international legality are two different questions.' },
          { text: 'No breach if the authorising statute is of fundamental importance', why: 'That is the art 46 test for defects in consent to a treaty, not a justification for breaching one.' },
        ],
      }}
    />
  );
}
