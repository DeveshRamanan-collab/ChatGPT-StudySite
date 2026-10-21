/*
SCENE: The Montevideo criteria — four rooms, each with its threshold rule and one example, and a doorway of continuity
LENGTH: 5 loci; pinned 300vh on desktop (scroll walks), paced otherwise
BEATS: 5 (population → territory → effective government → capacity for relations → presumption of continuity)
INTENT: Fix the four art 1 criteria in order with their thresholds, and that established states do not lose
  statehood when government fails.
SUBJECT: the amber light standing at the current room.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the locus. SOUND: none.
REDUCED MOTION: the five loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2000-w04-montevideo-criteria-for-statehood; Montevideo Convention art 1; North Sea Continental Shelf [46].
*/
import { Palace } from '../bases/Palace';

export default function MontevideoCriteriaForStatehood() {
  return (
    <Palace
      label="The four Montevideo criteria for statehood, and the presumption of continuity"
      terms={[
        { term: 'Montevideo Convention', def: 'A 1933 regional convention with few parties, widely regarded as codifying custom (art 1).' },
        { term: 'Effective government', def: 'A coherent, effective exercise of public power.' },
        { term: 'Presumption of continuity', def: 'Once statehood is established, ineffective government does not end it.' },
      ]}
      loci={[
        { title: 'a · Permanent population', body: 'No minimum (Nauru about 12,000, China about 1.4 billion): a core population living there permanently, whatever its nationality.' },
        { title: 'b · Defined territory', body: 'No minimum size (Vatican about 0.5 sq km). Boundaries must be defined but need not be fixed or undisputed — “no rule that the land frontiers of a State must be fully delimited” (North Sea Continental Shelf [46]).' },
        { title: 'c · Government', body: 'The most tricky: a coherent, effective exercise of public power. A colony would not qualify.' },
        { title: 'd · Capacity to enter into relations', body: 'Arises from independence. Scotland may meet the first three but cannot conduct international relations on its own.' },
        { title: 'Doorway · Presumption of continuity', body: 'Once established, ineffective government (Somalia, Syria, Yemen) does not end statehood, and the form of government is irrelevant. New entities face a stricter effectiveness test than established states.' },
      ]}
      check={{
        question: 'An established state’s government collapses into civil war and controls little territory. Is it still a state?',
        options: [
          { text: 'No — it now fails the effective government criterion', why: 'That strict test applies to new entities; established states keep the presumption of continuity.' },
          { text: 'Yes — the presumption of continuity preserves its statehood', correct: true, why: 'Somalia, Syria and Yemen remain states despite ineffective government.' },
          { text: 'Only if its boundaries are fully delimited', why: 'There is no rule that frontiers must be fully delimited (North Sea Continental Shelf [46]), and that is not the issue here.' },
        ],
      }}
    />
  );
}
