/*
SCENE: McHugh J's six questions — a corridor walk through Crimmins
LENGTH: 6 loci; pinned 360vh on desktop (scroll walks), paced otherwise
BEATS: 6 (one per question, in McHugh J's order)
INTENT: Fix the order of McHugh J's test for an affirmative duty of a statutory authority in a novel case, and show
  that questions 5 and 6 point the other way: a "yes" there tells against a duty.
SUBJECT: the amber light standing at the current question.
BEAT 1: Foreseeability (including a failure to exercise statutory powers) — always needed, never enough.
BEAT 2: Power to protect a specific class, not the public at large — the waterside workers the Authority directed.
BEAT 3: Vulnerability — casual employment and the obligation to obey directions.
BEAT 4: Knowledge — the Authority was, or ought to have been, aware of the risks.
BEAT 5: Core policy / quasi-legislative function — a "yes" points against a duty; Hayne J's dissent hangs here.
BEAT 6: Other supervening policy reasons — e.g. indeterminate liability; a "yes" points against a duty.
CAMERA: 35mm-equivalent, dolly along the corridor, yaw ≤ 15° toward the locus, no cuts (Palace base).
LIGHT: one amber point at the current locus; paper fill. SOUND: none.
REDUCED MOTION: the six loci as a numbered list (no WebGL).
BUDGET: own chunk ≤ 120 KB gz (three is a shared vendor chunk), draw calls < 20, 60 fps at 4× throttle.
Source: concept card laws2400-w08-crimmins-and-mchugh-six-questions; case
  crimmins-v-stevedoring-industry-finance-committee (slides 8–14); week spec §2 (the six questions verbatim; "not all
  need a yes"; the text compresses them to four).
*/
import { Palace } from '../bases/Palace';

export default function CrimminsSixQuestions() {
  return (
    <Palace
      label="A corridor with six frames: McHugh J's six questions in Crimmins"
      terms={[
        { term: 'Affirmative duty', def: 'A duty to act — here, for a statutory authority to use its powers to protect.' },
        { term: 'Specific class', def: 'A defined group the authority can protect, as opposed to the public at large.' },
        { term: 'Vulnerability', def: 'The plaintiff could not reasonably be expected to safeguard herself from the harm.' },
        { term: 'Quasi-legislative', def: 'Rule-making of a policy kind — courts are reluctant to impose a duty over it.' },
      ]}
      loci={[
        { title: '1 · Foreseeability', body: 'Was it reasonably foreseeable that an act or omission of the defendant — including a failure to exercise its statutory powers — would injure the plaintiff? Always needed; for a public authority never enough.' },
        { title: '2 · A specific class', body: 'Did its statutory obligations give it power to protect a specific class including the plaintiff, rather than the public at large? In Crimmins: the waterside workers the Authority directed where to work.' },
        { title: '3 · Vulnerability', body: 'Could the plaintiff reasonably be expected to safeguard herself? Crimmins could not: his vulnerability came from his casual employment and his obligation to obey the Authority’s directions.' },
        { title: '4 · Knowledge', body: 'Did the defendant know, or ought it to have known, of the risk to that class if it did not use its powers? The Authority was, or ought to have been, aware of the risks where it sent him.' },
        { title: '5 · Core policy?', body: 'Would a duty impose liability for “core policy making” or “quasi-legislative” functions? A yes points against a duty. Hayne J, dissenting, found no duty in deciding whether to order respirators.' },
        { title: '6 · Other policy reasons', body: 'Are there other supervening policy reasons, such as indeterminate liability, to deny a duty? A yes points against. The majority found a duty: an overarching supervisory and regulatory role over safety.' },
      ]}
      check={{
        question: 'Which answer to McHugh J’s questions points AGAINST a duty of care?',
        options: [
          { text: 'Yes to question 3 — the plaintiff could not safeguard herself', why: 'Vulnerability supports a duty: it was central to the duty found for Crimmins.' },
          { text: 'Yes to question 5 — the duty would bite on core policy-making', correct: true, why: 'Questions 5 and 6 point the other way: a duty over core policy or quasi-legislative functions is resisted.' },
          { text: 'Yes to question 2 — the power protects a specific class', why: 'A specific class supports a duty; powers for the public at large point away from one.' },
        ],
      }}
    />
  );
}
