/*
SCENE: Self-determination and secession — a clear road in decolonisation, and a fork outside it
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Classify the claim — colonial or not, internal or external — then ask whether internal self-determination is
  being denied.
SUBJECT: the path from the right, branching.
STEP 1: the right (UN Charter art 1(2) principle; ICCPR art 1 right).
STEP 2: decolonisation — a clear road (1960 Declaration; Chagos 2019).
STEP 3: outside decolonisation — unilateral secession highly contentious.
STEP 4: internal — satisfied (Re Secession of Quebec, 1998).
STEP 5: external — contested (Kosovo, 2008); the exam question.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all five captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades.
Source: concept laws2000-w04-self-determination-and-secession; UN Charter art 1(2); ICCPR art 1; 1960 Declaration;
  Chagos; Re Secession of Quebec; Kosovo advisory opinion.
*/
import { Diagram } from '../bases/Diagram';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;
const box = { fill: 'none', stroke: 'var(--ink-2)', strokeWidth: 1.5 } as const;
const path = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 1.5 } as const;

const figure = (
  <svg viewBox="0 0 360 500" role="img" aria-label="Self-determination: a clear road in decolonisation; outside it, internal self-determination satisfied (Quebec) or external contested (Kosovo)">
    <g data-step="1">
      <rect x="8" y="12" width="344" height="56" rx="10" fill="var(--paper-2)" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="180" y="36" textAnchor="middle" {...ui}>SELF-DETERMINATION OF PEOPLES</text>
      <text x="180" y="56" textAnchor="middle" {...note}>Charter art 1(2) · ICCPR art 1</text>
    </g>
    <g data-step="2">
      <polyline points="26,68 26,130 46,130" {...path} />
      <rect x="46" y="86" width="306" height="96" rx="10" {...box} />
      <text x="60" y="108" {...ui} data-label="decolonisation">DECOLONISATION: CLEAR ROAD</text>
      <text x="60" y="130" {...note}>1960 Declaration: alien subjugation</text>
      <text x="60" y="148" {...note}>is “a denial of fundamental human rights”</text>
      <text x="60" y="168" {...note}>Chagos (2019): the UK must complete it</text>
    </g>
    <g data-step="3">
      <polyline points="26,130 26,236 46,236" {...path} />
      <rect x="46" y="204" width="306" height="64" rx="10" {...box} />
      <text x="60" y="228" {...ui} data-label="outside">OUTSIDE DECOLONISATION</text>
      <text x="60" y="250" {...note}>unilateral secession: highly contentious</text>
    </g>
    <g data-step="4">
      <line x1="150" y1="268" x2="90" y2="300" {...path} />
      <rect x="8" y="300" width="164" height="128" rx="10" {...box} />
      <text x="20" y="322" {...ui} data-label="internal">INTERNAL</text>
      {['satisfied: Re Secession', 'of Quebec (1998)', 'no ground for an', 'external claim'].map((l, i) => <text key={l} x="20" y={344 + i * 18} {...note} fontSize="13">{l}</text>)}
    </g>
    <g data-step="5">
      <line x1="250" y1="268" x2="270" y2="300" {...path} />
      <rect x="188" y="300" width="164" height="128" rx="10" {...box} />
      <text x="200" y="322" {...ui} data-label="external">EXTERNAL</text>
      {['contested: Kosovo', '(2008) — answer to', 'oppression, or breach', 'of Serbia’s integrity?'].map((l, i) => <text key={l} x="200" y={344 + i * 18} {...note} fontSize="13">{l}</text>)}
      <text x="180" y="462" textAnchor="middle" {...note} fill="var(--ink)">then ask: is the people’s internal</text>
      <text x="180" y="480" textAnchor="middle" {...note} fill="var(--ink)">self-determination being denied?</text>
    </g>
  </svg>
);

export default function SelfDeterminationAndSecession() {
  return (
    <Diagram
      label="Self-determination and secession as a branching path"
      terms={[
        { term: 'Self-determination', def: 'At a minimum, the entitlement of peoples to control their destiny and be treated respectfully.' },
        { term: 'Internal self-determination', def: 'A people pursuing its destiny within the existing state.' },
        { term: 'External self-determination', def: 'Separating from the state — secession.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'UN Charter art 1(2) refers to the “principle of equal rights and self-determination of peoples” without framing it as a right; ICCPR art 1 makes it a human right: “All peoples have the right of self-determination.”' },
        { caption: 'In the decolonisation context it is generally accepted. The 1960 Declaration called alien subjugation “a denial of fundamental human rights”; in Chagos (2019) the ICJ affirmed the Chagossians’ right and the UK’s obligation to complete the decolonisation of Mauritius.' },
        { caption: 'Outside decolonisation the right has internal and external dimensions, and a right to secede unilaterally is highly contentious.' },
        { caption: 'Re Secession of Quebec (1998): unilateral secession was inconsistent with international law and the Canadian Constitution. Quebec’s internal self-determination was fulfilled, so there was no ground for external self-determination.' },
        { caption: 'Kosovo’s 2008 secession from Serbia was argued to be legitimate as a response to systematic discrimination and oppression; opponents said it violated Serbia’s sovereignty and territorial integrity.' },
      ]}
      check={{
        question: 'A region of a non-colonial state enjoys full political participation, yet claims a right to secede. On the Quebec reasoning, does it have one?',
        options: [
          { text: 'Yes — ICCPR art 1 gives all peoples a right to secede', why: 'Art 1 gives a right of self-determination; outside decolonisation a unilateral right to secede is highly contentious.' },
          { text: 'No — its internal self-determination is fulfilled, so there is no ground for external self-determination', correct: true, why: 'That was the Supreme Court of Canada’s reasoning in Re Secession of Quebec.' },
          { text: 'Yes — as in Chagos', why: 'Chagos concerned decolonisation, where the right is generally accepted; this claim is outside it.' },
        ],
      }}
    />
  );
}
