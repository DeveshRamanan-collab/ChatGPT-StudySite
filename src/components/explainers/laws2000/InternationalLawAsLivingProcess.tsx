/*
SCENE: International law as a living process — environmental law built from non-binding momentum into treaties
LENGTH: not pinned — a draggable Timeline (learner-paced), 7 events
BEATS: terms → drag from 1972 to 2025 → each node names its mechanism (soft law, treaty, protocol, opinion) → one check
INTENT: Show law evolving by named mechanisms — General Assembly momentum, then treaty, then protocol — with the ozone
  instruments showing the effect.
SUBJECT: the handle; events up to it are inked; the tag names the mechanism.
CAMERA: none (HTML track). LIGHT: none. SOUND: none.
REDUCED MOTION: off — the handle jumps instead of gliding (base); same controls.
BUDGET: < 5 KB gz. The ozone trend is described in words (the card gives no figures to plot).
Source: concept laws2000-w01-international-law-as-living-process.
*/
import { Timeline } from '../bases/Timeline';

export default function InternationalLawAsLivingProcess() {
  return (
    <Timeline
      label="Timeline of international environmental law from 1972 to 2025, each step tagged with its mechanism"
      terms={[
        { term: 'Amendment', def: 'A change to an existing treaty’s provisions.' },
        { term: 'Protocol', def: 'A further instrument that forms a whole with its parent treaty.' },
        { term: 'Custom', def: 'General state practice plus a belief that the practice is law: law developing through time and practice.' },
        { term: 'Non-binding momentum', def: 'General Assembly work that cannot itself create binding obligations but leads states to treaties.' },
      ]}
      events={[
        { when: '1972', title: 'UN Conference on the Human Environment', tag: 'Momentum', body: 'A regime built almost from scratch since the 1960s: UN conferences and agencies (the Environment Program, the FAO) begin the work.' },
        { when: '1985', title: 'Vienna Convention on the ozone layer', tag: 'Treaty', body: 'The parent treaty on ozone-depleting substances.' },
        { when: '1987', title: 'Montreal Protocol', tag: 'Protocol', body: 'Forms a whole with the Vienna Convention. Emissions of ozone-depleting substances had risen for decades, then fell sharply once the instruments took effect; the UN reported in 2023 that the ozone layer is on track to recover by 2040.' },
        { when: '1992', title: 'Rio Declaration and the UNFCCC', tag: 'Momentum → treaty', body: 'Rio is non-binding momentum — the General Assembly cannot itself create binding obligations. States turn that momentum into a binding treaty: the UN Framework Convention on Climate Change.' },
        { when: '1997', title: 'Kyoto Protocol', tag: 'Protocol', body: 'A protocol to the UNFCCC: the regime develops by adding instruments to the parent treaty.' },
        { when: '2015', title: 'Paris Agreement', tag: 'Treaty', body: 'A further binding agreement in the climate regime.' },
        { when: '2025', title: 'ICJ climate advisory opinion', tag: 'Court', body: 'The ICJ’s 2025 climate advisory opinion follows the same body of work.' },
      ]}
      check={{
        question: 'An answer says “environmental law changed after 1987”. What does a strong answer add?',
        options: [
          { text: 'The name of the mechanism — here a protocol forming a whole with the 1985 Vienna Convention', correct: true, why: 'The card’s exam use: name the mechanism (treaty, amendment, protocol or custom), not just assert change.' },
          { text: 'That the General Assembly legislated the change', why: 'The Assembly cannot itself create binding obligations; it builds momentum that states turn into treaties.' },
          { text: 'Nothing more: law changing is enough', why: 'Asserting change without the mechanism is exactly what the card warns against.' },
        ],
      }}
    />
  );
}
