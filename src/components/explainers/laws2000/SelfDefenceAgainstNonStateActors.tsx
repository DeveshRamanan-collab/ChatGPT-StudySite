/*
SCENE: Armed attacks by non-state actors — a chain from a group, through its host state, to the victim, with the
  group–host link as the hinge, a contested bypass and an uncontested side door
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Fix that the question is attribution to the host state (Nicaragua; Wall; Armed Activities), that "unwilling
  or unable" is a controversial way round it, and that an invitation from the host state removes the problem.
SUBJECT: the link between the group and the host state.
STEP 1: the group's attack on the victim — art 51 does not say who must attack.
STEP 2: the host-state frame and the hinge — sent by or on behalf of the state; effective control.
STEP 3: the ICJ — attribution to the host state matters (Wall 2004, Armed Activities 2005).
STEP 4: the dashed bypass — "unwilling or unable" (controversial).
STEP 5: the side door — an invitation from the host state.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all five captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades (base).
Source: concept laws2000-w09-self-defence-against-non-state-actors; Week 9 slides 19, 23–24; cases Nicaragua,
  Construction of a Wall, Armed Activities; authority unsc-resolution-1373-2001.
*/
import { Diagram } from '../bases/Diagram';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;
const ink = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 1.5 } as const;

const figure = (
  <svg viewBox="0 0 360 572" role="img" aria-label="A non-state group inside a host state attacks a victim state; the link between group and host state decides attribution; a dashed bypass marks the controversial unwilling-or-unable argument; an invitation from the host state is the uncontested route">
    <g data-step="1">
      <rect x="100" y="10" width="160" height="56" rx="10" fill="var(--paper-2)" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="180" y="34" textAnchor="middle" {...ui} data-label="victim">VICTIM STATE</text>
      <text x="180" y="54" textAnchor="middle" {...note}>self-defence?</text>
      <rect x="110" y="200" width="140" height="56" rx="10" {...ink} />
      <text x="180" y="224" textAnchor="middle" {...ui} data-label="group">NON-STATE GROUP</text>
      <text x="180" y="244" textAnchor="middle" {...note}>armed band, militia</text>
      <line x1="180" y1="200" x2="180" y2="68" {...ink} />
      <polyline points="174,78 180,68 186,78" {...ink} />
      <text x="192" y="112" {...note} fill="var(--ink)">armed attack?</text>
    </g>
    <g data-step="2">
      <rect x="8" y="150" width="344" height="200" rx="12" {...ink} />
      <text x="56" y="174" {...ui} data-label="host">HOST STATE</text>
      <text x="180" y="284" textAnchor="middle" {...note} fill="var(--ink)">sent by or on behalf of it?</text>
      <text x="180" y="306" textAnchor="middle" {...note}>arms, funds, logistics: not enough</text>
      <text x="180" y="328" textAnchor="middle" {...note}>effective control (Nicaragua)</text>
    </g>
    <g data-step="3">
      <text x="180" y="380" textAnchor="middle" {...ui} data-label="icj">ICJ: ATTRIBUTION TO THE HOST</text>
      <text x="180" y="402" textAnchor="middle" {...note}>Wall (2004) · Armed Activities (2005)</text>
    </g>
    <g data-step="4">
      <path d="M 100 38 H 40 V 228 H 104" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" strokeDasharray="5 5" />
      <polyline points="96,222 106,228 96,234" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <text x="180" y="440" textAnchor="middle" {...ui} data-label="bypass">BYPASS: UNWILLING OR UNABLE</text>
      <text x="180" y="462" textAnchor="middle" {...note}>strike the group without consent</text>
      <text x="180" y="482" textAnchor="middle" {...note}>controversial (Turkey v PKK in Iraq)</text>
    </g>
    <g data-step="5">
      <path d="M 330 150 V 38 H 264" {...ink} />
      <polyline points="274,32 264,38 274,44" {...ink} />
      <text x="180" y="520" textAnchor="middle" {...ui} data-label="invite">INVITATION FROM THE HOST</text>
      <text x="180" y="542" textAnchor="middle" {...note}>less contentious: consent</text>
    </g>
  </svg>
);

export default function SelfDefenceAgainstNonStateActors() {
  return (
    <Diagram
      label="Self-defence against non-state actors: attribution to the host state, the unwilling-or-unable bypass, and invitation"
      terms={[
        { term: 'Non-state actor', def: 'An armed group, band, irregulars or mercenaries — not a state’s own forces.' },
        { term: 'Host state', def: 'The state from whose territory the group operates.' },
        { term: 'Unwilling or unable', def: 'The contested claim that a victim may act if the host state will not or cannot stop the group.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'A non-state group attacks a state from another state’s territory. Can that trigger self-defence? Art 51 does not say who must carry out the armed attack.' },
        { caption: 'Nicaragua: armed bands, groups, irregulars or mercenaries can carry out an armed attack if sent by or on behalf of a state. Supplying arms, funds or logistics is not enough — effective control over the operations is needed.' },
        { caption: 'The ICJ treats attribution to the host state as important (Wall Advisory Opinion 2004; Armed Activities 2005). In the Wall opinion, art 51 did not apply because the attacks came from occupied territory, not from another state.' },
        { caption: 'State practice increasingly invokes self-defence against such groups (Islamic State; Kurdish groups in Syria), and after 9/11 the Council affirmed self-defence (Resolution 1373). Some argue force may be used if the host is unwilling or unable to act — but the doctrine remains controversial.' },
        { caption: 'Action against the group is less contentious if the host state invites it: its consent means its territory is not violated. Necessity and proportionality still apply on every route.' },
      ]}
      check={{
        question: 'A militia acting on its own fires rockets at State V from State H, whose government is trying, and failing, to stop it. Which statement is most accurate?',
        options: [
          { text: 'V may strike the militia in H without consent; this is settled law', why: 'The unwilling-or-unable argument remains controversial, and the ICJ stresses attribution to the host state.' },
          { text: 'V’s strongest route is H’s consent; without it, V must rely on the contested unwilling-or-unable argument', correct: true, why: 'Nothing attributes the militia to H, so a strike without consent depends on a controversial doctrine; an invitation from H would be far less contentious.' },
          { text: 'The rockets are attributable to H because the militia operates from its territory', why: 'Location alone does not attribute conduct: Nicaragua requires the group to be sent by or acting for the state, under its effective control.' },
        ],
      }}
    />
  );
}
