/*
SCENE: Circumstances precluding wrongfulness — six doors off one corridor, and the sealed wall of art 26
LENGTH: 7 loci; pinned 420vh on desktop (scroll walks), paced otherwise
BEATS: 7 (consent → self-defence → countermeasures → force majeure → distress → necessity → art 26 wall)
INTENT: Fix each ground with the condition carved on its lintel, and that no door opens against a peremptory norm.
SUBJECT: the amber light standing at the current door.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the locus. SOUND: none.
REDUCED MOTION: the seven loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2000-w07-circumstances-precluding-wrongfulness; ARSIWA arts 20–26, 49–53; UN Charter art 51;
  Gabčíkovo-Nagymaros; Rainbow Warrior; Serbian Loans; Wall advisory opinion.
*/
import { Palace } from '../bases/Palace';

export default function CircumstancesPrecludingWrongfulness() {
  return (
    <Palace
      label="Six circumstances precluding wrongfulness (ARSIWA arts 20–25) and the art 26 wall"
      terms={[
        { term: 'Precluding wrongfulness', def: 'A circumstance that acts like a defence to a breach attributable to a state.' },
        { term: 'Countermeasure', def: 'An otherwise wrongful act against a responsible state, to induce it to comply.' },
        { term: 'Peremptory norm', def: 'Jus cogens: no circumstance precludes wrongfulness of conduct contrary to it (art 26).' },
      ]}
      loci={[
        { title: '1 · Consent (art 20)', body: 'Valid, freely given, clearly expressed before or at the time — and the act stays within its limits.' },
        { title: '2 · Self-defence (art 21)', body: 'A lawful measure in conformity with the UN Charter, read with art 51: an armed attack must have occurred.' },
        { title: '3 · Countermeasures (arts 22, 49–53)', body: 'Only against a responsible state, to induce compliance; not in breach of jus cogens (e.g. use of force); proportional; after procedural steps — negotiate, notify, stop once the wrong ceases. Czechoslovakia’s diversion of the Danube was disproportionate (Gabčíkovo-Nagymaros, 1997).' },
        { title: '4 · Force majeure (art 23)', body: 'An irresistible force or unforeseen event beyond the state’s control making performance materially impossible — “absolute and material impossibility” (Rainbow Warrior, 1990; Serbian Loans). Not if the state contributed or assumed the risk.' },
        { title: '5 · Distress (art 24)', body: 'No other reasonable way of saving the author’s life or lives in the author’s care. Not if the state caused it, or the act creates a comparable or greater peril.' },
        { title: '6 · Necessity (art 25)', body: 'Framed in the negative: the only way to safeguard an essential interest against a grave and imminent peril, without seriously impairing another’s essential interest. The Wall construction was not necessary.' },
        { title: 'Sealed wall · Art 26', body: 'None of these precludes the wrongfulness of an act contrary to a peremptory norm.' },
      ]}
      check={{
        question: 'State A, injured by B’s breach, responds with a countermeasure far more damaging than B’s wrong. Is A’s wrongfulness precluded?',
        options: [
          { text: 'Yes — any countermeasure against a responsible state is permitted', why: 'Countermeasures must also be proportional and follow procedural steps.' },
          { text: 'No — countermeasures must be proportional', correct: true, why: 'As with Czechoslovakia’s diversion of the Danube in Gabčíkovo-Nagymaros, a disproportionate response is not precluded.' },
          { text: 'Yes, if A pleads necessity instead', why: 'Necessity needs a grave and imminent peril to an essential interest, and must not seriously impair another’s — nothing suggests that.' },
        ],
      }}
    />
  );
}
