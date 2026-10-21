/*
SCENE: Breach of an international obligation — an obligation from any source, a timeline, a composite stack, two lanes
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Identify the precise obligation, confirm it bound the state when the conduct occurred, then say whether the
  breach is an act, an omission or a composite of acts.
SUBJECT: the timeline strip and the obligation's start mark.
STEP 1: the obligation — any source, international not domestic (art 12).
STEP 2: the start mark; conduct before it greys out (arts 13–14; Chagos).
STEP 3: small acts stack into a composite breach (art 15).
STEP 4: split lane — breach by act or by omission (art 2; Tehran, Corfu Channel).
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all four captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades.
Source: concept laws2000-w07-breach-of-an-international-obligation; ARSIWA arts 2, 12, 13–14, 15.
*/
import { Diagram } from '../bases/Diagram';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;
const ink = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 1.5 } as const;

const figure = (
  <svg viewBox="0 0 360 420" role="img" aria-label="An obligation from any source; conduct before it binds is no breach; small acts add up to a composite breach; breach by act or omission">
    <g data-step="1">
      <rect x="8" y="12" width="344" height="68" rx="10" fill="var(--paper-2)" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="180" y="36" textAnchor="middle" {...ui} data-label="obligation">INTERNATIONAL OBLIGATION</text>
      <text x="180" y="56" textAnchor="middle" {...note}>treaty or custom — any source (art 12)</text>
      <text x="180" y="72" textAnchor="middle" {...note} fontSize="12.5">not domestic law</text>
    </g>
    <g data-step="2">
      <line x1="16" y1="140" x2="130" y2="140" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 5" />
      <line x1="130" y1="140" x2="344" y2="140" {...ink} strokeWidth="2" />
      <line x1="130" y1="118" x2="130" y2="162" {...ink} strokeWidth="2.5" />
      <text x="130" y="110" textAnchor="middle" {...ui} fontSize="11">OBLIGATION BINDS</text>
      <text x="68" y="184" textAnchor="middle" {...note} fill="var(--ink-3)">before it:</text>
      <text x="68" y="202" textAnchor="middle" {...note} fill="var(--ink-3)">no breach</text>
    </g>
    <g data-step="3">
      {[168, 196, 224, 252].map((x) => <rect key={x} x={x} y="132" width="18" height="16" rx="2" {...ink} />)}
      <polyline points="168,160 168,166 270,166 270,160" {...ink} />
      <text x="220" y="186" textAnchor="middle" {...note} fill="var(--ink)">together: a composite</text>
      <text x="220" y="204" textAnchor="middle" {...note} fill="var(--ink)">breach (art 15)</text>
    </g>
    <g data-step="4">
      <text x="16" y="240" {...ui}>ACT OR OMISSION (art 2)</text>
      <path d="M 16 300 H 56 L 86 270 H 344" {...ink} />
      <path d="M 56 300 L 86 330 H 344" {...ink} />
      <text x="96" y="262" {...ui} fontSize="11" data-label="act">ACT</text>
      <text x="96" y="290" {...note}>use of force, pollution</text>
      <text x="96" y="322" {...ui} fontSize="11" data-label="omission">OMISSION</text>
      <text x="96" y="352" {...note}>Tehran: failed to protect</text>
      <text x="96" y="370" {...note}>the US embassy and staff</text>
      <text x="96" y="392" {...note}>Corfu Channel: failed to</text>
      <text x="96" y="410" {...note}>warn of mines</text>
    </g>
  </svg>
);

export default function BreachOfAnInternationalObligation() {
  return (
    <Diagram
      label="Breach of an international obligation: source, time, composite acts, act or omission"
      terms={[
        { term: 'Breach', def: 'Conduct not in conformity with an international obligation — synonymous with violation.' },
        { term: 'Primary rule', def: 'The substantive obligation breached, in treaty or custom.' },
        { term: 'Composite act', def: 'A series of actions that together amount to a breach (art 15).' },
      ]}
      figure={figure}
      steps={[
        { caption: 'The first element of an internationally wrongful act is conduct in breach of an international obligation, whatever its source — custom or treaty (art 12). It must be international, not domestic: whether domestic law allowed the conduct is irrelevant. Failing to comply with an ICJ decision could also engage responsibility.' },
        { caption: 'The state must be under the obligation at the time of the conduct — there is no retroactivity (arts 13–14; Chagos Advisory Opinion, 2019).' },
        { caption: 'One or two actions may not amount to a breach, but taken together they eventually will — for example, pollution that adds up over time (art 15).' },
        { caption: 'A breach can be an action (use of force, pollution) or an omission (art 2). In Tehran, Iran failed to protect the US embassy and its staff, as the VCDR required. In Corfu Channel (1949), Albania knew of mines in its waters but failed to warn the approaching British warships; 45 sailors died.' },
      ]}
      check={{
        question: 'A state knows of a danger in its waters and says nothing; foreign ships are damaged. Can that silence be a breach?',
        options: [
          { text: 'No — a breach needs a positive act', why: 'Art 2 covers acts and omissions alike.' },
          { text: 'Yes — an omission can breach an obligation, as in Corfu Channel', correct: true, why: 'Albania knew of the mines and failed to notify shipping or warn the British warships.' },
          { text: 'Only if the obligation is in a treaty rather than custom', why: 'Art 12: the source of the obligation does not matter.' },
        ],
      }}
    />
  );
}
