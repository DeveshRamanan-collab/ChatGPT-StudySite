/*
SCENE: Emerging actors beyond the state — satellites off the state, each tagged with rights and obligations
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: For any non-state actor, separate rights from obligations and binding from non-binding sources.
SUBJECT: the three satellite cards (individuals, groups, corporations) branching off the state's spine.
STEP 1: individuals — rights: UDHR (non-binding) then ECHR, ICCPR (binding); complaints (Torres Strait Islanders).
STEP 2: individuals — obligations under international criminal law (Milošević, ICTY 1999).
STEP 3: groups — peoples, minorities, non-state armed groups (IHL, common art 3).
STEP 4: multinational corporations — rights (investment protection), no binding obligations yet.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all four captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades.
Source: concept laws2000-w04-emerging-actors-beyond-the-state; ICCPR art 1.
*/
import { Diagram } from '../bases/Diagram';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;
const card = { fill: 'none', stroke: 'var(--ink-2)', strokeWidth: 1.5 } as const;
const spine = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 1.5 } as const;

const figure = (
  <svg viewBox="0 0 360 540" role="img" aria-label="The state with three satellites: individuals, groups and multinational corporations, each tagged with rights and obligations">
    <rect x="8" y="12" width="344" height="44" rx="8" fill="var(--paper-2)" stroke="var(--ink)" strokeWidth="1.5" />
    <text x="180" y="39" textAnchor="middle" {...ui}>THE STATE</text>
    <g data-step="1">
      <polyline points="20,56 20,150 36,150" {...spine} />
      <rect x="36" y="80" width="316" height="136" rx="10" {...card} />
      <text x="50" y="102" {...ui} data-label="individuals">INDIVIDUALS</text>
      <text x="50" y="124" {...note}>rights: UDHR 1948 (non-binding),</text>
      <text x="50" y="142" {...note}>then ECHR 1950, ICCPR 1966 (binding)</text>
      <text x="50" y="160" {...note}>complaint: Torres Strait Islanders, HRC</text>
    </g>
    <g data-step="2">
      <line x1="50" y1="172" x2="338" y2="172" stroke="var(--line)" strokeWidth="1" />
      <text x="50" y="190" {...note}>obligations: international criminal law</text>
      <text x="50" y="208" {...note}>(Milošević, indicted by the ICTY, 1999)</text>
    </g>
    <g data-step="3">
      <polyline points="20,150 20,306 36,306" {...spine} />
      <rect x="36" y="236" width="316" height="140" rx="10" {...card} />
      <text x="50" y="258" {...ui} data-label="groups">GROUPS</text>
      <text x="50" y="280" {...note}>peoples: self-determination; UNDRIP</text>
      <text x="50" y="298" {...note}>2007 not binding, ratified ILO binding</text>
      <text x="50" y="320" {...note}>minorities: usually claimed individually</text>
      <text x="50" y="342" {...note}>armed groups: bound by IHL</text>
      <text x="50" y="360" {...note}>(common art 3, Geneva Conventions)</text>
    </g>
    <g data-step="4">
      <polyline points="20,306 20,446 36,446" {...spine} />
      <rect x="36" y="396" width="316" height="104" rx="10" {...card} />
      <text x="50" y="418" {...ui} data-label="corporations">MULTINATIONAL CORPORATIONS</text>
      <text x="50" y="440" {...note}>rights: investment protection</text>
      <text x="50" y="462" {...note}>obligations: none legally binding yet</text>
      <text x="50" y="484" {...note}>2011 Guiding Principles: not binding</text>
      <text x="180" y="528" textAnchor="middle" {...note} fill="var(--ink)">rights or obligations? binding or not?</text>
    </g>
  </svg>
);

export default function EmergingActorsBeyondTheState() {
  return (
    <Diagram
      label="Emerging actors beyond the state: individuals, groups and multinational corporations"
      terms={[
        { term: 'Non-state actor', def: 'An entity other than a state: individuals, groups, corporations.' },
        { term: 'Binding / non-binding', def: 'A treaty obliges its parties; a declaration or guiding principles do not.' },
        { term: 'Common article 3', def: 'The Geneva Conventions provision binding non-state armed actors.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Individuals were once only their state of nationality’s responsibility. After WWII came rights against states: the non-binding UDHR 1948, then binding treaties (ECHR 1950, ICCPR 1966). Some let individuals complain — eight Torres Strait Islanders won a climate claim against Australia before the Human Rights Committee.' },
        { caption: 'Individuals also bear obligations under international criminal law: Slobodan Milošević, indicted by the ICTY in 1999, was the first head of state indicted before an international tribunal.' },
        { caption: 'Groups: peoples hold rights such as self-determination and indigenous rights (UNDRIP 2007 is not binding; ratified ILO conventions are). Minority rights are usually claimed individually. Non-state armed actors are bound by IHL, including common art 3.' },
        { caption: 'Multinational corporations have rights under international economic law (investment protection) but, to date, no legally binding obligations; the 2011 Guiding Principles on Business and Human Rights are not binding.' },
      ]}
      check={{
        question: 'A multinational corporation’s operations cause human rights harms abroad. Which is accurate?',
        options: [
          { text: 'It breaches binding obligations under the 2011 Guiding Principles', why: 'The Guiding Principles are not binding.' },
          { text: 'It has investment-protection rights, but to date no legally binding international obligations', correct: true, why: 'That is the split for corporations: rights under international economic law, no binding obligations yet.' },
          { text: 'It is bound by common art 3 like an armed group', why: 'Common art 3 binds non-state armed actors under IHL, not corporations as such.' },
        ],
      }}
    />
  );
}
