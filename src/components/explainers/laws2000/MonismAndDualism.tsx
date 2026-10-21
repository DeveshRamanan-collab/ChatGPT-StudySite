/*
SCENE: Monism and dualism — one circle against two circles and a bridge, then three states placed on the line
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Monism is one legal order with direct effect; dualism two orders joined only by transformation; real systems
  are blends, with Australia primarily dualist.
SUBJECT: the circles, then the markers on the spectrum.
STEP 1: monism — one circle, direct effect.
STEP 2: dualism — two circles, a transformation bridge.
STEP 3: the spectrum; Germany near monism (Basic Law art 25).
STEP 4: the Netherlands — a blend (Dutch Constitution arts 91, 93, 94).
STEP 5: Australia — primarily dualist.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all five captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades.
Source: concept laws2000-w05-monism-and-dualism; German Basic Law art 25; Dutch Constitution 1983 arts 90–94.
*/
import { Diagram } from '../bases/Diagram';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;
const ink = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 1.5 } as const;

const mark = (x: number, name: string, sub: string) => (
  <>
    <line x1={x} y1="316" x2={x} y2="336" stroke="var(--ink)" strokeWidth="2.5" />
    <text x={x} y="358" textAnchor="middle" {...note} fill="var(--ink)" data-label={name.toLowerCase()}>{name}</text>
    <text x={x} y="376" textAnchor="middle" {...note} fontSize="12.5">{sub}</text>
  </>
);

const figure = (
  <svg viewBox="0 0 360 430" role="img" aria-label="Monism as one circle, dualism as two circles joined by a transformation bridge; Germany, the Netherlands and Australia on the line between">
    <g data-step="1">
      <text x="90" y="18" textAnchor="middle" {...ui}>MONISM</text>
      <circle cx="90" cy="112" r="78" {...ink} />
      <text x="90" y="108" textAnchor="middle" {...note} fill="var(--ink)">international law</text>
      <text x="90" y="128" textAnchor="middle" {...note} fill="var(--ink)">+ national law</text>
      <text x="90" y="222" textAnchor="middle" {...note}>one legal order</text>
      <text x="90" y="240" textAnchor="middle" {...note}>direct effect</text>
    </g>
    <g data-step="2">
      <text x="270" y="18" textAnchor="middle" {...ui}>DUALISM</text>
      <circle cx="270" cy="66" r="40" {...ink} />
      <circle cx="270" cy="162" r="40" {...ink} />
      <line x1="263" y1="106" x2="263" y2="122" {...ink} />
      <line x1="277" y1="106" x2="277" y2="122" {...ink} />
      <text x="270" y="70" textAnchor="middle" {...note} fontSize="12" fill="var(--ink)">international</text>
      <text x="270" y="166" textAnchor="middle" {...note} fontSize="12" fill="var(--ink)">national</text>
      <text x="270" y="222" textAnchor="middle" {...note}>two legal orders</text>
      <text x="270" y="240" textAnchor="middle" {...note}>transformation</text>
    </g>
    <g data-step="3">
      <line x1="30" y1="326" x2="330" y2="326" {...ink} />
      <text x="30" y="300" {...ui} fontSize="11">MONIST</text>
      <text x="330" y="300" textAnchor="end" {...ui} fontSize="11">DUALIST</text>
      {mark(64, 'Germany', 'Basic Law art 25')}
    </g>
    <g data-step="4">
      {mark(180, 'Netherlands', 'arts 91, 93, 94')}
      <text x="180" y="414" textAnchor="middle" {...note}>ideal types: most systems are blends</text>
    </g>
    <g data-step="5">{mark(296, 'Australia', 'primarily dualist')}</g>
  </svg>
);

export default function MonismAndDualism() {
  return (
    <Diagram
      label="Monism and dualism, and where three states sit between them"
      terms={[
        { term: 'Monism', def: 'National and international law form one single normative legal order.' },
        { term: 'Dualism', def: 'They are distinct legal orders; only national law has force domestically.' },
        { term: 'Direct effect (incorporation)', def: 'Courts apply international law directly, with the same authority as national law.' },
        { term: 'Transformation', def: 'International law must be made into domestic law to have effect.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Monism: one legal order. International law has direct effect and the same authority as national law, so courts can apply it directly; inconsistency is resolved, frequently in favour of international law. Often associated with the civil law tradition.' },
        { caption: 'Dualism: two distinct orders. Only national law has force domestically, so international law must be transformed. Inconsistencies do not arise — different subjects and purposes — and national law usually has priority. Often associated with the common law tradition.' },
        { caption: 'Germany is a very clear monist example: art 25 of the Basic Law makes the general rules of international law “an integral part of federal law” that “take precedence over the laws and directly create rights and duties”.' },
        { caption: 'These are ideal types; most systems blend them. The Dutch Constitution: Parliament must approve treaties (art 91), but provisions binding on all persons bind once published (art 93) and override conflicting statutory regulations (art 94).' },
        { caption: 'Australia is primarily a dualist system: treaties must be transformed, and clear Australian law prevails over international law.' },
      ]}
      check={{
        question: 'In a dualist system, a ratified treaty has not been legislated. Can a domestic court apply it directly?',
        options: [
          { text: 'Yes — ratification gives it direct effect', why: 'Direct effect belongs to monism; dualism requires transformation.' },
          { text: 'No — it must first be transformed into national law', correct: true, why: 'In dualism only national law has force domestically.' },
          { text: 'Yes, and it overrides conflicting statutes', why: 'That describes Dutch art 94, a monist feature; in dualism national law usually has priority.' },
        ],
      }}
    />
  );
}
