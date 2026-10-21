/*
SCENE: Trespass — directness as "an issue of time" (Hutchins v Maughan)
LENGTH: 6 events, learner-dragged (Timeline base)
INTENT: See that the direct/consequential cut-off sits at the moment of the defendant's act: anything that needs a
  later intervening act (here, the complainant bringing his dogs) is consequential, so the remedy lies in case.
SUBJECT: the handle; the cut-off event ("the defendant's act ends here") and what follows it.
EVENTS: baits laid (cut-off) → days pass → dogs brought onto the land → dogs take baits and die → held (1947) →
  the counterfactual, with Williams v Milotin (1957) in its detail.
REDUCED MOTION: same controls, no glide.
BUDGET: < 6 KB gz. Dates only where the materials give them (the citations).
Source: concept laws2400-w01-trespass-directness; case cards hutchins-v-maughan, williams-v-milotin.
*/
import { Timeline } from '../bases/Timeline';

export default function TrespassDirectness() {
  return (
    <Timeline
      label="Timeline of the Hutchins baits, with the direct / consequential cut-off at the defendant's act"
      terms={[
        { term: 'Direct', def: "The injury is the immediate result of the defendant's act — the mark of trespass." },
        { term: 'Consequential', def: 'The injury needs an intervening event to happen — the mark of action on the case.' },
        { term: 'Intervening act', def: "A later act, by the plaintiff or a third party, that turns the defendant's act into harm." },
      ]}
      events={[
        { title: 'The baits are laid', tag: "defendant's act — cut-off", body: "The defendant lays poisonous baits on unfenced land. This is the moment of the defendant's act: only harm that follows immediately from it is direct." },
        { title: 'Days pass', tag: 'gap in time', body: 'Nothing happens to the dogs yet. The baits simply lie on the land — like a log already lying in the road.' },
        { title: 'The dogs are brought onto the land', tag: "complainant's act", body: 'The complainant himself brings his dogs there. This is the intervening event the harm depends on.' },
        { title: 'The dogs take the baits and die', tag: 'harm', body: 'The injury is real, but it is consequential upon the complainant bringing the dogs, not immediately occasioned by the laying of the baits.' },
        { when: '1947', title: 'Hutchins v Maughan [1947] VLR 131', tag: 'held', body: "Herring CJ: trespass did not lie; the remedy lay in case. He drew on Reynolds v Clarke, Leame v Bray and Scott v Shepherd's log — trespass if it hits someone as it is thrown, merely case if someone later trips over it." },
        { title: 'Had the baits been thrown at the dogs…', tag: 'an issue of time', body: 'Trespass would have been made out. The distinction still bites: in Williams v Milotin (1957) 97 CLR 465 a pedestrian hit directly by a car could plead trespass or negligence, with different elements and limitation periods.' },
      ]}
      check={{
        question: 'Why was the loss of the dogs not a trespass in Hutchins v Maughan?',
        options: [
          { text: 'Because the defendant did not intend to kill the dogs', why: 'The court decided on directness, not fault: the harm was consequential on a later act.' },
          { text: "Because the harm depended on the complainant's own later act of bringing the dogs onto the land", correct: true, why: 'An intervening act was needed to turn the laying of the baits into harm, so the injury was consequential — case, not trespass.' },
          { text: 'Because dogs are not goods that trespass protects', why: 'The case turned on directness; the baits were laid before the dogs arrived.' },
        ],
      }}
    />
  );
}
