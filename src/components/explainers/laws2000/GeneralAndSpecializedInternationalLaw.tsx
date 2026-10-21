/*
SCENE: General and specialised international law — a walk from the core chamber into the regimes built on it
LENGTH: 5 loci; pinned 300vh on desktop (scroll walks), paced otherwise
BEATS: 5 (general core → special regimes → regimes combine → global commons → shared concern)
INTENT: Fix the core/regime divide, then show that problems borrow across regimes and that two areas cut across it.
SUBJECT: the amber light standing at the current chamber.
BEAT 1: general core. BEAT 2: special regimes. BEAT 3: regimes combine (migrant rescue; agrochemicals).
BEAT 4: global commons (corridor). BEAT 5: shared concern (nationalist v internationalist route).
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the locus. SOUND: none.
REDUCED MOTION: the five chambers as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2000-w01-general-and-specialized-international-law.
*/
import { Palace } from '../bases/Palace';

export default function GeneralAndSpecializedInternationalLaw() {
  return (
    <Palace
      label="General international law as the core, special regimes built on it, and two areas that cut across the divide"
      terms={[
        { term: 'General international law', def: 'The core this unit teaches: sources, treaties, statehood, jurisdiction, immunities, responsibility, dispute settlement.' },
        { term: 'Special regime', def: 'A body of law built on that core, such as the law of the sea, human rights or trade law.' },
        { term: 'Global commons', def: 'Areas belonging to no state — the high seas, outer space, Antarctica.' },
      ]}
      loci={[
        { title: 'Chamber 1 · General international law', body: 'The core: sources, treaty law, statehood and recognition, jurisdiction and immunities, diplomatic protection, state responsibility, and peaceful settlement of disputes.' },
        { title: 'Chamber 2 · Special regimes', body: 'Built on the core: use of force, international criminal law, human rights, law of the sea, air and space, environmental and climate change, energy, trade, investment and health law.' },
        { title: 'Chamber 3 · Regimes combine', body: 'A vessel rescuing migrants and docking outside its flag state engages migration law, the law of the sea and human rights together. An agrochemicals dispute engages trade, environment, health and state responsibility.' },
        { title: 'Corridor · Global commons', body: 'The high seas, outer space and Antarctica belong to no state, so no state can impose its jurisdiction there; every state, even a land-bound one, keeps freedom of navigation and access.' },
        { title: 'Corridor · Issues of shared concern', body: 'Pandemics, global trade and climate change are transboundary: tackled by “the nationalist route” (each state alone) or “the internationalist route” (together) — increasingly the more effective.' },
      ]}
      check={{
        question: 'A ship rescues migrants in distress and seeks to dock outside its flag state. What should an answer do first?',
        options: [
          { text: 'Apply the law of the sea alone, since the facts happen at sea', why: 'Exam problems borrow across regimes: migration and human rights law are engaged too.' },
          { text: 'Name every regime engaged — migration, law of the sea, human rights — before reaching for a rule', correct: true, why: 'The card’s exam use: misidentifying the regime is as costly as misapplying it.' },
          { text: 'Treat it as a global commons problem where no law applies', why: 'The high seas are a global commons, but that means no state’s jurisdiction, not no law.' },
        ],
      }}
    />
  );
}
