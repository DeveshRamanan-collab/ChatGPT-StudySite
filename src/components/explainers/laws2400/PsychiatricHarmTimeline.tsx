/*
SCENE: Psychiatric harm — from "nervous shock" to foreseeability, then the Civil Liability Act
LENGTH: 6 events, learner-dragged (Timeline base)
INTENT: See that the common law moved from denying "nervous shock" to one test (reasonable foreseeability of a
  recognised psychiatric illness), that Tame/Annetts dropped the control mechanisms as preconditions, and that in
  NSW the CLA (ss 30–32) now governs, as Wicks shows.
SUBJECT: the handle; each event's detail beneath the track.
EVENTS: nervous shock (no date given) → Tame (2002) → Annetts (2002) → CLA s 31 (2002) → CLA s 32 (2002) → Wicks (2010).
REDUCED MOTION: same controls, no glide.
BUDGET: < 12 KB gz. Dates only where the materials give them (case citations and the Act's title).
Source: week 6 notes (content-src/laws2400-w06.yaml §6), concept laws2400-w06-psychiatric-harm-common-law-development.
*/
import { Timeline } from '../bases/Timeline';

export default function PsychiatricHarmTimeline() {
  return (
    <Timeline
      label="Development of liability for psychiatric harm"
      terms={[
        { term: 'Nervous shock', def: 'The traditional label for psychiatric harm, which was once not recoverable.' },
        { term: 'Recognised psychiatric illness', def: 'More than grief or distress: what a plaintiff must now show.' },
        { term: 'Control mechanisms', def: 'Normal fortitude, sudden shock and direct perception, once treated as preconditions.' },
        { term: 'Normal fortitude', def: 'The ordinary resilience of a reasonable person; now the yardstick in CLA s 32.' },
      ]}
      events={[
        { title: 'Nervous shock', tag: 'common law', body: 'Psychiatric harm was traditionally labelled "nervous shock" and was not recoverable. Compensation may now be recovered for it.' },
        { when: '2002', title: 'Tame v New South Wales', tag: 'High Court', body: 'A corrected clerical error triggered an extreme, idiosyncratic reaction. The injury was not reasonably foreseeable, so no duty was owed. Normal fortitude, sudden shock and direct perception are not preconditions to liability.' },
        { when: '2002', title: 'Annetts v Australian Stations', tag: 'High Court', body: 'An employer broke its promise to supervise a 16-year-old jackaroo, who died in the desert. Harm to his parents was reasonably foreseeable, and the pre-existing relationship made them a determinate class: a duty was owed without sudden shock or direct perception.' },
        { when: '2002', title: 'Civil Liability Act 2002 (NSW) s 31', tag: 'NSW statute', body: 'No liability to pay damages for pure mental harm resulting from negligence unless the harm consists of a recognised psychiatric illness.' },
        { when: '2002', title: 'Civil Liability Act 2002 (NSW) s 32', tag: 'NSW statute', body: 'No duty unless the defendant ought to have foreseen that a person of normal fortitude might suffer a recognised psychiatric illness. Sudden shock, witnessing at the scene and the relationships are circumstances to consider, not fixed conditions — though, contrary to Tame, normal fortitude is now the yardstick.' },
        { when: '2010', title: 'Wicks v State Rail Authority (NSW)', tag: 'High Court', body: 'Police officers injured after hours helping at a derailment. Section 32 must be considered before the s 30(2) limitation, and survivors remained in peril until rescued — a series of shocking experiences may count.' },
      ]}
      check={{
        question: 'After Tame, which of these is a precondition to a duty for pure psychiatric harm at common law?',
        options: [
          { text: 'A sudden shock', why: 'Tame held that a sudden shock is not a precondition to liability for psychiatric harm.' },
          { text: 'Direct perception of the event or its aftermath', why: 'Tame and Annetts rejected direct perception as a precondition to liability.' },
          { text: 'Reasonable foreseeability of a recognised psychiatric illness', correct: true, why: 'Reasonable foreseeability of a recognised psychiatric illness is the only real test after Tame.' },
        ],
      }}
    />
  );
}
