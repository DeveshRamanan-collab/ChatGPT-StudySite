/*
SCENE: What is international criminal law? — one trunk (personal criminal liability) forking into two limbs, fed by
  three roots
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
BEATS: 5 (definition → substantive limb → procedural limb → hybrid roots → new and rudimentary)
INTENT: International crimes attach personal criminal liability to individuals; ICL splits into substantive law (the
  crimes, the duty to prosecute) and procedural law (the proceedings), and is new, rudimentary and hybrid.
SUBJECT: the fork under the definition box — which limb a rule belongs to.
BEAT 1 (0–20%): the definition box draws on; caption: personal criminal liability, not state responsibility.
BEAT 2 (20–40%): left limb and its four items (substantive law).
BEAT 3 (40–60%): right limb and the stages of proceedings (procedural law).
BEAT 4 (60–80%): three roots — IHL, IHRL, national criminal law — rise into both limbs (hybrid).
BEAT 5 (80–100%): the features strip — new, rudimentary. Ease: none (scrubbed); text fades.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all five captions stacked (base).
BUDGET: < 8 KB gz, no WebGL; strokes draw (DrawSVG), text fades.
Source: concept laws2000-w11-what-is-international-criminal-law (Week 11 Lecture Slides, slides 4–6).
*/
import { Diagram } from '../bases/Diagram';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 12.5, fill: 'var(--ink-2)' } as const;
const ink = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 1.5 } as const;
const faint = { fill: 'none', stroke: 'var(--ink-3)', strokeWidth: 1.5 } as const;

const lines = (x: number, y: number, items: string[]) =>
  items.map((t, i) => <text key={t} x={x} y={y + i * 18} {...note}>{t}</text>);

const figure = (
  <svg viewBox="0 0 360 512" role="img" aria-label="International crimes fork into substantive and procedural law, fed by three roots">
    <g data-step="1">
      <rect x="40" y="10" width="280" height="74" rx="12" {...ink} />
      <text x="180" y="34" textAnchor="middle" {...ui} data-label="crimes">INTERNATIONAL CRIMES</text>
      <text x="180" y="54" textAnchor="middle" {...note}>breaches of international rules</text>
      <text x="180" y="72" textAnchor="middle" {...note} fill="var(--ink)">→ personal criminal liability</text>
    </g>
    <g data-step="2">
      <path d="M180 84 V98 H92 V112" {...ink} />
      <rect x="10" y="112" width="164" height="170" rx="12" {...ink} />
      <text x="22" y="136" {...ui} data-label="substantive">SUBSTANTIVE LAW</text>
      {lines(22, 160, ['the acts: core crimes', 'subjective elements', 'when an accused is', 'nonetheless not liable', 'when states may', 'prosecute or try them'])}
    </g>
    <g data-step="3">
      <path d="M180 98 H268 V112" {...ink} />
      <rect x="186" y="112" width="164" height="170" rx="12" {...ink} />
      <text x="198" y="136" {...ui} data-label="procedural">PROCEDURAL LAW</text>
      {lines(198, 160, ['pre-trial, trial and', 'appeals processes', 'rights of the accused', 'rules of evidence', 'sentencing', 'victims’ rights', 'in tribunal statutes'])}
    </g>
    <g data-step="4">
      <text x="16" y="318" {...ui}>HYBRID ROOTS</text>
      <path d="M60 334 L92 282 M180 334 V292 M300 334 L268 282" {...faint} />
      <rect x="10" y="334" width="100" height="52" rx="10" {...ink} />
      <rect x="130" y="334" width="100" height="52" rx="10" {...ink} />
      <rect x="250" y="334" width="100" height="52" rx="10" {...ink} />
      <text x="60" y="357" textAnchor="middle" {...ui}>IHL</text>
      <text x="60" y="376" textAnchor="middle" {...note}>humanitarian</text>
      <text x="180" y="357" textAnchor="middle" {...ui}>IHRL</text>
      <text x="180" y="376" textAnchor="middle" {...note}>human rights</text>
      <text x="300" y="357" textAnchor="middle" {...ui}>NATIONAL</text>
      <text x="300" y="376" textAnchor="middle" {...note}>criminal laws</text>
    </g>
    <g data-step="5">
      <rect x="10" y="408" width="340" height="94" rx="12" {...faint} />
      <text x="22" y="432" {...ui}>NEW</text>
      <text x="96" y="432" {...note}>gradually expanding to new crimes</text>
      <text x="22" y="458" {...ui}>RUDIMENTARY</text>
      <text x="22" y="478" {...note}>actus reus and mens rea not always clear;</text>
      <text x="22" y="494" {...note}>penalties not laid down precisely</text>
    </g>
  </svg>
);

export default function WhatIsInternationalCriminalLaw() {
  return (
    <Diagram
      label="What international criminal law is: two limbs and three roots"
      terms={[
        { term: 'International crime', def: 'A breach of international rules entailing the personal criminal liability of the individual(s) concerned.' },
        { term: 'Substantive law', def: 'Governs the four core international crimes and demands that states prosecute them.' },
        { term: 'Procedural law', def: 'Regulates the stages of international criminal proceedings.' },
        { term: 'Hybrid', def: 'Drawing characteristics from IHL, international human rights law and national criminal laws.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'International crimes are breaches of international rules entailing the personal criminal liability of the individual(s) concerned — the person answers for them, which is a different question from a state’s responsibility (Week 7).' },
        { caption: 'Substantive law governs the four core international crimes and demands that states prosecute them: the acts amounting to core crimes, the subjective elements required, the circumstances in which an accused may nevertheless not be held criminally liable, and the conditions under which states may prosecute or try accused persons.' },
        { caption: 'Procedural law regulates the stages of international criminal proceedings — pre-trial, trial and appeals processes, rights of the accused, rules of evidence, sentencing and victims’ rights (victims have a prominent part). It is found in the statutes and rules of the various international(ised) criminal tribunals.' },
        { caption: 'ICL is hybrid: it presents unique characteristics deriving from international humanitarian law, international human rights law and national criminal laws.' },
        { caption: 'It is relatively new, gradually expanding to cover new crimes — and rudimentary: the actus reus and mens rea of the crimes have not always been clear, and the penalties are not laid down precisely.' },
      ]}
      check={{
        question: 'Where do the rules on sentencing in an international criminal trial belong?',
        options: [
          { text: 'Procedural law — the statutes and rules of the tribunal', correct: true, why: 'The slides list sentencing among the procedural rules, with pre-trial, trial and appeals processes, evidence and victims’ rights.' },
          { text: 'Substantive law — alongside the definitions of the crimes', why: 'Substantive law covers the acts, the subjective elements, when an accused is not liable and when states may prosecute; sentencing is listed as procedural.' },
          { text: 'The law of state responsibility', why: 'State responsibility concerns states’ internationally wrongful acts; ICL concerns individuals’ personal criminal liability.' },
        ],
      }}
    />
  );
}
