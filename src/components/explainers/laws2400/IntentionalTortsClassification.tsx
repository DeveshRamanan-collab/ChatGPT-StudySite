/*
SCENE: Classifying intentional torts — a forked hallway
LENGTH: 5 loci; pinned 300vh on desktop (scroll walks), paced otherwise
BEATS: 5 (one per locus)
INTENT: Classify the wrong first — trespass (direct) or action on the case (indirect, consequential) — because the
  classification decides the elements and the limitation period.
SUBJECT: the amber light standing at the current locus.
BEAT 1: The fork — trespass for direct interference; case for indirect and consequential damage.
BEAT 2: Trespass wing — to the person (assault, battery, false imprisonment), to land, to goods.
BEAT 3: The four shared trespass elements — voluntary act, directness, actionable per se, fault.
BEAT 4: Case wing — Wilkinson v Downton, malicious prosecution, conversion, detinue; beyond: negligence, nuisance…
BEAT 5: Why it still matters — Williams v Milotin: one set of facts, two actions, different elements and limitation.
CAMERA: 35mm-equivalent dolly along the corridor, yaw ≤ 15°, no cuts. LIGHT: one amber point at the locus. SOUND: none.
REDUCED MOTION: the loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz (three is shared), draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2400-w01-intentional-torts-classification; case card williams-v-milotin.
*/
import { Palace } from '../bases/Palace';

export default function IntentionalTortsClassification() {
  return (
    <Palace
      label="A forked hallway: the trespass wing and the action-on-the-case wing"
      terms={[
        { term: 'Trespass', def: 'The family of actions for a direct interference with the person, land or goods.' },
        { term: 'Action on the case', def: 'The family of actions for indirect and consequential damage.' },
        { term: 'Form of action', def: 'The historical category of claim, which decided the court and the pleading rules.' },
      ]}
      loci={[
        { title: 'The fork', body: 'Two families of action developed for wrongful conduct: trespass, for a direct interference, and action on the case, for indirect and consequential damage.' },
        { title: 'Trespass wing', body: 'The "intentional torts": trespass to the person (assault, battery, false imprisonment), trespass to land, and trespass to chattels or goods.' },
        { title: 'What every trespass shares', body: 'Four common elements: a voluntary act, directness, actionable per se, and fault.' },
        { title: 'Case wing', body: 'Related actions on the case: intentional interference with the person (Wilkinson v Downton), malicious prosecution, conversion and detinue. Beyond intentional torts: negligence, nuisance, misfeasance in public office, deceit.' },
        { title: 'Why the fork still matters', body: 'Williams v Milotin (1957): being hit by a car can found trespass to the person or negligence, each with its own elements and its own limitation period.' },
      ]}
      check={{
        question: 'Why must you classify a wrong as trespass or case before analysing it?',
        options: [
          { text: 'Because only trespass can be brought in an Australian court today', why: 'Both families are still available — Williams v Milotin shows the same facts founding either.' },
          { text: 'Because the classification decides which elements must be proved and which limitation period runs', correct: true, why: 'Different elements apply to each category, and each has its own limitation period.' },
          { text: 'Because it decides which court hears the case, as it did historically', why: 'That was the historical reason; today the distinction matters for elements and limitation.' },
        ],
      }}
    />
  );
}
