/*
SCENE: Powers and responsibility of IOs — a box of conferred powers, then an attribution switch for a peacekeeper
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: An IO has only the powers its members give it (express inside, implied at the dotted edge); it answers for
  its own wrongs, and a lent organ's conduct is routed by who has effective control.
SUBJECT: the box of powers, then the switch beneath it.
STEP 1: members confer powers; speciality, no general competence (Nuclear Weapons [25]).
STEP 2: express powers (UN Charter art 42).
STEP 3: implied powers at the dotted edge (Reparation, 182); disputed (ICTY, ICTR).
STEP 4: responsibility follows personality (International Tin Council; ARIO arts 3, 4, 6).
STEP 5: the switch — peacekeeper to the UN or the contributing state by effective control (ARIO art 7).
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all five captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades.
Source: concept laws2000-w04-powers-and-responsibility-of-international-organisations; ARIO arts 3, 4, 6, 7.
*/
import { Diagram } from '../bases/Diagram';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;
const ink = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 1.5 } as const;

const figure = (
  <svg viewBox="0 0 360 540" role="img" aria-label="Members confer express and implied powers on an organisation; a peacekeeper's conduct goes to the UN or the contributing state by effective control">
    <g data-step="1">
      {[120, 180, 240].map((x) => <circle key={x} cx={x} cy="22" r="9" {...ink} />)}
      <text x="180" y="52" textAnchor="middle" {...ui}>MEMBERS CONFER POWERS</text>
      <text x="180" y="70" textAnchor="middle" {...note}>speciality: no general competence</text>
      <polyline points="180,76 180,94 175,88 180,94 185,88" {...ink} />
    </g>
    <g data-step="3">
      <rect x="16" y="98" width="328" height="176" rx="12" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" strokeDasharray="5 5" />
      <text x="30" y="118" {...ui} fontSize="11.5" data-label="implied">IMPLIED · AT THE EDGE</text>
      <text x="180" y="236" textAnchor="middle" {...note}>by necessary implication, essential</text>
      <text x="180" y="254" textAnchor="middle" {...note}>to its duties (Reparation, 182)</text>
    </g>
    <g data-step="2">
      <rect x="50" y="130" width="260" height="80" rx="8" fill="var(--paper-2)" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="180" y="156" textAnchor="middle" {...ui} data-label="express">EXPRESS POWERS</text>
      <text x="180" y="178" textAnchor="middle" {...note}>art 42: the Security Council</text>
      <text x="180" y="196" textAnchor="middle" {...note}>can authorise force</text>
    </g>
    <g data-step="4">
      <text x="180" y="300" textAnchor="middle" {...ui} fontSize="11.5">RESPONSIBILITY FOLLOWS PERSONALITY</text>
      <text x="180" y="320" textAnchor="middle" {...note}>the IO, not its members, answers</text>
      <text x="180" y="338" textAnchor="middle" {...note}>(Tin Council · ARIO arts 3, 4, 6)</text>
    </g>
    <g data-step="5">
      <rect x="120" y="356" width="120" height="34" rx="8" {...ink} />
      <text x="180" y="378" textAnchor="middle" {...ui} fontSize="11.5">PEACEKEEPER</text>
      <line x1="180" y1="390" x2="90" y2="440" {...ink} />
      <line x1="180" y1="390" x2="270" y2="440" {...ink} />
      <rect x="30" y="440" width="120" height="44" rx="8" {...ink} />
      <text x="90" y="467" textAnchor="middle" {...ui} data-label="un">THE UN</text>
      <rect x="200" y="440" width="140" height="44" rx="8" {...ink} />
      <text x="270" y="459" textAnchor="middle" {...ui} fontSize="11.5" data-label="state">CONTRIBUTING</text>
      <text x="270" y="475" textAnchor="middle" {...ui} fontSize="11.5">STATE</text>
      <text x="180" y="512" textAnchor="middle" {...note} fill="var(--ink)">who has effective control?</text>
      <text x="180" y="530" textAnchor="middle" {...note}>(ARIO art 7)</text>
    </g>
  </svg>
);

export default function PowersAndResponsibilityOfInternationalOrganisations() {
  return (
    <Diagram
      label="Powers and responsibility of international organisations"
      terms={[
        { term: 'Speciality', def: 'IOs have no general competence — only the powers their members confer (Nuclear Weapons [25]).' },
        { term: 'Implied powers', def: 'Powers not express but conferred by necessary implication as essential to the IO’s duties (Reparation).' },
        { term: 'Effective control', def: 'The ARIO art 7 test routing a lent organ’s conduct to the IO or the state.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'IOs have no general competence, only the powers their members give them. In Nuclear Weapons (1996, [25]) the ICJ applied “the principle of speciality”: the WHO could not address the legality of nuclear weapons.' },
        { caption: 'Some powers are express: UN Charter art 42 lets the Security Council authorise force.' },
        { caption: 'Others are implied: the UN “must be deemed to have those powers which … are conferred upon it by necessary implication as being essential to the performance of its duties” (Reparation, 182). Implied powers can be disputed, as when the Security Council created the ICTY and ICTR.' },
        { caption: 'Responsibility follows distinct personality: the organisation, not its members, answers (the International Tin Council). ARIO art 3: every wrongful act of an IO entails its responsibility; art 4: attributable conduct in breach; art 6: its organs or agents performing their functions.' },
        { caption: 'Art 7: a state organ placed at an IO’s disposal acts for the IO “if the organization exercises effective control over that conduct” — so a contributing state that kept control of its peacekeepers can be responsible. ARIO is not binding and is criticised for modelling one framework for very different IOs.' },
      ]}
      check={{
        question: 'Peacekeepers lent to the UN commit a wrong, but their contributing state kept effective control of the operation. Who is responsible under ARIO art 7?',
        options: [
          { text: 'The UN — they were placed at its disposal', why: 'Placement alone is not enough: art 7 asks who exercised effective control over the conduct.' },
          { text: 'The contributing state, which kept effective control', correct: true, why: 'Conduct goes to the IO only if the IO exercises effective control; here the state did.' },
          { text: 'All UN members jointly', why: 'Responsibility follows the IO’s distinct personality, and here attribution runs to the controlling state, not the membership.' },
        ],
      }}
    />
  );
}
