/*
SCENE: Question 2 — the reasonable response: s 5B(1)(c) and the four s 5B(2) considerations, a corridor walk
LENGTH: 5 loci; pinned 300vh on desktop (scroll walks), paced otherwise
BEATS: 5 (one per locus)
INTENT: Fix the statutory order of the response question: the s 5B(1)(c) question first, then the four matters the
  court is to consider under s 5B(2) — probability, seriousness, burden, social utility — amongst other things.
SUBJECT: the amber light standing at the current locus.
BEAT 1: s 5B(1)(c) — would a reasonable person in the defendant's position have taken those precautions?
BEAT 2: s 5B(2)(a) — the probability that the harm would occur if care were not taken.
BEAT 3: s 5B(2)(b) — the likely seriousness of the harm.
BEAT 4: s 5B(2)(c) — the burden of taking precautions to avoid the risk of harm.
BEAT 5: s 5B(2)(d) — the social utility of the activity that creates the risk; and "amongst other relevant things".
CAMERA: 35mm-equivalent, dolly along the corridor, yaw ≤ 15° toward the locus, no cuts (Palace base).
LIGHT: one amber point (glow sprite) at the current locus; paper fill. SOUND: none.
REDUCED MOTION: the five loci as a numbered list (no WebGL).
BUDGET: own chunk ≤ 120 KB gz (three is a shared vendor chunk), draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2400-w09-reasonable-response-s5b-1c-and-2; Civil Liability Act 2002 (NSW) s 5B(1)(c), (2);
  Topic 9 flowchart p 381 (the RESPONSE question). Updated Oct 2026: the check's (b) option no longer says (b) is
  "arguably a real, non-fanciful risk" — Topic 9 Lecture 1 (slides 8, 21) places "not insignificant" above "not
  far-fetched". The cases on each consideration (Dederer, Paris, Woods, Red Cross) are in the concept card and notes.
*/
import { Palace } from '../bases/Palace';

export default function ReasonableResponseS5b1cAnd2() {
  return (
    <Palace
      label="A corridor with five frames: section 5B(1)(c), then the four section 5B(2) considerations"
      terms={[
        { term: 'Precautions', def: 'The steps the plaintiff says the defendant should have taken against the risk of harm.' },
        { term: 'Reasonable person in the person’s position', def: 'The objective yardstick in s 5B(1)(c) — not what the defendant believed.' },
        { term: 'Amongst other relevant things', def: 'The s 5B(2) list is not exhaustive, but the court is to consider each listed matter.' },
      ]}
      loci={[
        { title: 's 5B(1)(c) — the question', body: 'Has the standard been met? A person is not negligent unless, in the circumstances, a reasonable person in the person’s position would have taken those precautions.' },
        { title: '(a) Probability', body: 'The probability that the harm would occur if care were not taken.' },
        { title: '(b) Seriousness', body: 'The likely seriousness of the harm.' },
        { title: '(c) Burden', body: 'The burden of taking precautions to avoid the risk of harm.' },
        { title: '(d) Social utility', body: 'The social utility of the activity that creates the risk of harm — then anything else relevant: the court considers the list “amongst other relevant things”.' },
      ]}
      check={{
        question: 'A precaution would cost little and the harm would be serious. Where does s 5B tell the court to weigh those facts?',
        options: [
          { text: 's 5B(1)(a), the foreseeability of the risk', why: 'Tempting because the facts concern the risk, but (a) asks only whether the defendant knew or ought to have known of it.' },
          { text: 's 5B(2), deciding whether a reasonable person would have taken precautions', correct: true, why: 'Burden is s 5B(2)(c) and seriousness s 5B(2)(b): matters the court considers in answering s 5B(1)(c).' },
          { text: 's 5B(1)(b), whether the risk was not insignificant', why: '(b) is about the probability of the risk itself — a threshold above “not far-fetched” — not the cost of precautions or the size of the harm.' },
        ],
      }}
    />
  );
}
