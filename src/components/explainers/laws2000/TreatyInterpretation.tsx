/*
SCENE: Treaty interpretation — art 31 first, art 32 only through the gate of ambiguity or absurdity
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Interpretation is sequential, not a menu: art 31's general rule settles meaning unless it leaves ambiguity,
  obscurity or a manifestly absurd result; only then are art 32's supplementary means reached.
SUBJECT: the path down from art 31 through the question box to one of two outcomes.
STEP 1: art 31 (good faith, ordinary meaning, context, object and purpose). STEP 2: the art 32 gate question.
STEP 3: no → meaning settled (art 32 only confirms); yes → travaux, circumstances. STEP 4: South China Sea, art 121 UNCLOS.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all four captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades.
Source: concept laws2000-w03-treaty-interpretation; VCLT arts 31–32; case card south-china-sea-arbitration-philippines-v-china.
*/
import { Diagram } from '../bases/Diagram';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;
const line = { stroke: 'var(--ink)', strokeWidth: 1.5, fill: 'none' } as const;

const ART31 = ['in good faith', 'ordinary meaning of the terms', 'in their context (text, preamble, annexes)', 'in light of object and purpose'];

const figure = (
  <svg viewBox="0 0 360 540" role="img" aria-label="Flowchart: art 31 first; art 32 supplementary means only if the meaning is ambiguous, obscure or manifestly absurd">
    <g data-step="1">
      <rect x="8" y="8" width="344" height="128" rx="12" fill="none" stroke="var(--ink)" strokeWidth="2" />
      <text x="22" y="32" {...ui} data-label="art31">ART 31 · GENERAL RULE — START HERE</text>
      {ART31.map((t, i) => <text key={t} x="22" y={56 + i * 20} {...note} fill="var(--ink)">{i + 1}. {t}</text>)}
    </g>
    <g data-step="2">
      <line x1="180" y1="136" x2="180" y2="164" {...line} />
      <rect x="8" y="164" width="344" height="76" rx="10" {...line} strokeDasharray="5 4" />
      <text x="180" y="186" textAnchor="middle" {...note} fill="var(--ink)">does art 31 leave the meaning ambiguous</text>
      <text x="180" y="206" textAnchor="middle" {...note} fill="var(--ink)">or obscure, or lead to a result manifestly</text>
      <text x="180" y="226" textAnchor="middle" {...note} fill="var(--ink)">absurd or unreasonable?</text>
    </g>
    <g data-step="3">
      <line x1="92" y1="240" x2="92" y2="276" {...line} />
      <line x1="268" y1="240" x2="268" y2="276" {...line} />
      <text x="100" y="264" {...note} fontSize="12">no</text>
      <text x="276" y="264" {...note} fontSize="12">yes</text>
      <rect x="8" y="276" width="168" height="90" rx="8" {...line} />
      <text x="92" y="298" textAnchor="middle" {...ui} fontSize="12" data-label="settled">MEANING SETTLED</text>
      <text x="92" y="320" textAnchor="middle" {...note} fontSize="12.5">art 32 may only</text>
      <text x="92" y="337" textAnchor="middle" {...note} fontSize="12.5">confirm it</text>
      <rect x="184" y="276" width="168" height="90" rx="8" {...line} />
      <text x="268" y="298" textAnchor="middle" {...ui} fontSize="12" data-label="art32">ART 32 MEANS</text>
      <text x="268" y="320" textAnchor="middle" {...note} fontSize="12.5" fontStyle="italic">travaux préparatoires</text>
      <text x="268" y="337" textAnchor="middle" {...note} fontSize="12.5">and circumstances</text>
      <text x="268" y="354" textAnchor="middle" {...note} fontSize="12.5">of conclusion</text>
    </g>
    <g data-step="4">
      <rect x="8" y="380" width="344" height="150" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x="22" y="404" {...ui}>SOUTH CHINA SEA ARBITRATION</text>
      <text x="22" y="426" {...note}>art 121 UNCLOS “regime of islands”: the</text>
      <text x="22" y="444" {...note}>Spratly features were not “islands”</text>
      <line x1="22" y1="470" x2="39" y2="470" stroke="var(--ink)" strokeWidth="6" />
      <text x="48" y="475" {...note} fill="var(--ink)">rock · 12 nautical miles</text>
      <line x1="22" y1="502" x2="302" y2="502" stroke="var(--ink)" strokeWidth="6" />
      <text x="22" y="522" {...note} fill="var(--ink)">island · 200 nautical miles</text>
    </g>
  </svg>
);

export default function TreatyInterpretation() {
  return (
    <Diagram
      label="Treaty interpretation: art 31 first, then art 32 only if needed"
      terms={[
        { term: 'Ordinary meaning', def: 'The objective meaning of a treaty’s terms, read in context and in light of its object and purpose (art 31).' },
        { term: 'Travaux préparatoires', def: 'Preparatory work — a supplementary means under art 32.' },
        { term: 'Object and purpose', def: 'What the treaty as a whole sets out to achieve.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Art 31(1): interpret in good faith, by the ordinary meaning of the terms in their context and in light of object and purpose. Arts 31–32 reflect custom, so they bind non-parties too.' },
        { caption: 'The gate to art 32: does art 31 leave the meaning ambiguous or obscure, or lead to a manifestly absurd or unreasonable result?' },
        { caption: 'If not, the meaning is settled; art 32 may only confirm it, never rewrite the treaty. If so, reach for preparatory work and the circumstances of conclusion.' },
        { caption: 'South China Sea Arbitration applied both means to art 121 UNCLOS: the Spratly features were not “islands” — critical, since a rock gets 12 nautical miles against an island’s full 200.' },
      ]}
      check={{
        question: 'An answer opens by citing the travaux préparatoires to explain a treaty term. What is wrong?',
        options: [
          { text: 'Nothing: arts 31 and 32 are a menu to choose from', why: 'The regime is sequential, not a menu.' },
          { text: 'It skips art 31: art 32 is reached only once art 31 leaves real ambiguity or absurdity', correct: true, why: 'Citing travaux without first exhausting art 31 is a common, marked-down shortcut.' },
          { text: 'Travaux can never be used in interpretation', why: 'They can, under art 32 — to confirm, or when art 31 leaves the meaning unclear or absurd.' },
        ],
      }}
    />
  );
}
