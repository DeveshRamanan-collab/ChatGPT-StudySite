/*
SCENE: The elements of negligence — a corridor walk
LENGTH: 4 loci; pinned 240vh on desktop (scroll walks), paced otherwise
BEATS: 4 (one per locus)
INTENT: Fix the order of a negligence answer: it is not actionable per se, so duty, then breach, then causation of
  compensable damage — with the Civil Liability Act's scope beside it.
SUBJECT: the amber light standing at the current locus.
BEAT 1: Duty of care — reasonable foreseeability (neighbour principle); usually an established category.
BEAT 2: Breach — largely codified by the CLA (ss 5B–5E).
BEAT 3: Causation — factual causation and scope of liability.
BEAT 4: Damage — compensable harm (physical, psychiatric or economic); negligence is not actionable per se.
CAMERA: 35mm-equivalent, dolly along the corridor, yaw ≤ 15° toward the locus, no cuts; slight breathing drift.
LIGHT: one amber point (glow sprite) at the current locus; paper fill. SOUND: none.
REDUCED MOTION: the four loci as a numbered list (no WebGL).
BUDGET: own chunk ≤ 120 KB gz (three is a shared vendor chunk), draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2400-w05-negligence-elements-overview (week 5 notes); CLA s 5A, s 3B.
*/
import { Palace } from '../bases/Palace';

export default function NegligenceElementsPalace() {
  return (
    <Palace
      label="A corridor with four frames: duty, breach, causation, damage"
      terms={[
        { term: 'Action on the case', def: 'Negligence is not actionable per se: the plaintiff must prove damage.' },
        { term: 'Duty of care', def: 'Always requires reasonable foreseeability; usually settled by an established category.' },
        { term: 'Scope of liability', def: 'The normative half of causation: should this defendant answer for this harm?' },
      ]}
      loci={[
        { title: 'Duty of care', body: 'Reasonable foreseeability, from the neighbour principle in Donoghue v Stevenson — always required, not always sufficient. Most cases fit an established category.' },
        { title: 'Breach', body: 'Did the defendant fall short of reasonable care? Breach has been substantially codified by the Civil Liability Act (ss 5B–5E).' },
        { title: 'Causation', body: 'Factual causation and the scope of liability — did the breach cause the harm, and should the defendant be liable for it?' },
        { title: 'Damage', body: 'Compensable harm — physical, psychiatric or economic. Negligence is not actionable per se, so without damage there is no claim.' },
      ]}
      check={{
        question: 'Negligence is “not actionable per se”. What does that mean for the plaintiff?',
        options: [
          { text: 'They must prove the defendant intended the harm', why: 'Intention belongs to trespass; negligence is about carelessness.' },
          { text: 'They must prove they suffered compensable damage', correct: true, why: 'Unlike trespass, negligence needs proof of damage before there is a cause of action.' },
          { text: 'They can sue without proving any loss', why: 'That describes torts actionable per se, such as trespass, not negligence.' },
        ],
      }}
    />
  );
}
