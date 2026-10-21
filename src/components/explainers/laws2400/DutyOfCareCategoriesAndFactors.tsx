/*
SCENE: Categories of harm and the factors courts weigh — three chambers
LENGTH: 3 loci; pinned 180vh on desktop (scroll walks), paced otherwise
BEATS: 3 (one per chamber)
INTENT: Before applying any specific rule, classify the problem by three questions — how the harm was caused, who
  the defendant is, what the harm is — because the answers decide which body of rules is in play.
SUBJECT: the amber light standing at the current chamber.
BEAT 1: How was the harm caused? act or omission; words or acts.
BEAT 2: Who is the defendant? private individual or public authority; special relationships.
BEAT 3: What is the nature of the harm? physical (paradigm); psychiatric and pure economic loss (extra limits).
CAMERA: 35mm-equivalent dolly along the corridor, yaw ≤ 15° toward the locus, no cuts (base).
LIGHT: one amber point at the current chamber; paper fill. SOUND: none.
REDUCED MOTION: the three chambers as a numbered list (no WebGL).
BUDGET: own chunk < 5 KB gz (three is a shared vendor chunk), draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2400-w06-duty-of-care-categories-and-factors.
*/
import { Palace } from '../bases/Palace';

export default function DutyOfCareCategoriesAndFactors() {
  return (
    <Palace
      label="Three chambers: how the harm was caused, who the defendant is, what the harm is"
      terms={[
        { term: 'Omission', def: 'A failure to act; attracts a duty far less readily than a positive act.' },
        { term: 'Public authority', def: 'A defendant exercising statutory powers, often with limited resources.' },
        { term: 'Paradigm harm', def: 'Physical injury — the case the ordinary neighbour principle is built around.' },
      ]}
      loci={[
        { title: 'How was the harm caused?', body: 'By an act or an omission — omissions attract duty far less readily. And words or acts? A careless statement raises different concerns (indeterminate liability, reliance) from a careless act.' },
        { title: 'Who is the defendant?', body: 'A private individual, or a public authority exercising statutory powers with limited resources? Is there a special relationship that attracts a duty more readily — occupier and entrant, employer and employee, manufacturer and consumer?' },
        { title: 'What is the nature of the harm?', body: 'Physical injury is the paradigm. Psychiatric harm and pure economic loss are recognised, but only within extra limits the ordinary neighbour principle does not reach on its own. Misclassifying the harm is the most common way to answer the wrong question.' },
      ]}
      check={{
        question: 'Why classify a problem against the three questions before applying a specific rule?',
        options: [
          { text: 'Because the answers tell you which body of rules, and which CLA Part, is in play', correct: true, why: 'Classification decides whether, say, obvious-risk, recreational or mental-harm rules apply at all.' },
          { text: 'Because every harm is treated the same way once a duty exists', why: 'The opposite: not every harm caused by carelessness is recognised in the same way.' },
          { text: 'Because omissions and acts attract duty equally readily', why: 'Omissions attract duty far less readily than acts — which is why how the harm was caused matters.' },
        ],
      }}
    />
  );
}
