/*
SCENE: Established categories of duty — a corridor of settled relationships
LENGTH: 6 loci; pinned 360vh on desktop (scroll walks), paced otherwise
BEATS: 6 (one per locus)
INTENT: Most duty questions are answered by pointing to a recognised relationship; only genuinely novel facts
  need salient features, and unusual facts (Chapman v Hearse) can reopen an apparently settled category.
SUBJECT: the amber light standing at the current relationship.
BEAT 1: driver → other road users. BEAT 2: employer → employees. BEAT 3: doctor → patients.
BEAT 4: manufacturer → consumers (Donoghue; Grant). BEAT 5: solicitor → clients.
BEAT 6: the last frame — Chapman v Hearse: a road case whose unusual chain of events put duty back in issue.
CAMERA: 35mm-equivalent dolly along the corridor, yaw ≤ 15° toward the locus, no cuts (base).
LIGHT: one amber point at the current locus; paper fill. SOUND: none.
REDUCED MOTION: the six loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz (three is a shared vendor chunk), draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2400-w05-established-categories-of-duty; Donoghue v Stevenson, Grant, Chapman v Hearse.
*/
import { Palace } from '../bases/Palace';

export default function EstablishedCategoriesOfDuty() {
  return (
    <Palace
      label="A corridor of established duty relationships"
      terms={[
        { term: 'Established category', def: 'A relationship the courts already recognise as giving rise to a duty of care.' },
        { term: 'Novel case', def: 'Facts outside any recognised category, where the salient features approach is needed.' },
        { term: 'Salient features', def: 'The factors weighed to decide whether a duty exists in a novel case.' },
      ]}
      loci={[
        { title: 'Driver → other road users', body: 'A driver of a vehicle owes a duty of care to other road users.' },
        { title: 'Employer → employees', body: 'An employer owes a duty of care to its employees.' },
        { title: 'Doctor → patients', body: 'A doctor owes a duty of care to their patients.' },
        { title: 'Manufacturer → consumers', body: 'A manufacturer owes a duty to the consumers or users of its products — an established category since Donoghue v Stevenson and Grant v Australian Knitting Mills.' },
        { title: 'Solicitor → clients', body: 'A solicitor owes a duty to exercise due care for their clients. Inside a category, point to the case law — no full salient features analysis needed.' },
        { title: 'Unusual facts: Chapman v Hearse', body: 'A car accident between road users — an established category — but a bystander doctor killed while rendering aid put the existence of a duty back in issue. Check the category first; move to salient features only if the facts are genuinely novel.' },
      ]}
      check={{
        question: 'A consumer is injured by a defective product. How should you establish duty?',
        options: [
          { text: 'Run the full salient features analysis', why: 'Salient features is for genuinely novel facts; this relationship is already recognised.' },
          { text: 'Point to the established manufacturer/consumer category (Donoghue v Stevenson)', correct: true, why: 'Where facts fall within an established category, citing the case law recognising it is enough.' },
          { text: 'Show the manufacturer foresaw the precise sequence of events', why: 'Duty never requires foresight of the precise manner of harm (Chapman v Hearse), and the category settles duty here.' },
        ],
      }}
    />
  );
}
