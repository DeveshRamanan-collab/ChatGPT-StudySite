/*
SCENE: The s 5D(2) route — a corridor of four rooms
LENGTH: 4 loci; pinned 240vh on desktop (scroll walks), paced otherwise (Palace base)
BEATS: 4 (one per locus)
INTENT: Fix the parts of the s 5D(2) route in one walk: it starts only where necessary condition cannot be shown,
  needs the right kind of case, also needs a clear breach and an evidentiary gap, and ends with the court's
  responsibility question.
SUBJECT: the amber light standing at the current room.
BEAT 1: The gap — negligence cannot be established as a necessary condition of the harm.
BEAT 2: The kind of case — exceptional case (NSW text; flowchart: appropriate case): multiple sufficient causes or
  material contribution to harm.
BEAT 3: Must also be — a clear breach AND an evidentiary gap.
BEAT 4: The court's question — whether or not and why responsibility should be imposed (NSW text); the flowchart's
  extra "left to lie where it fell" is flagged as not in the NSW text.
CAMERA: 35mm-equivalent, dolly along the corridor, yaw ≤ 15° toward the room, no cuts (base).
LIGHT: one amber point at the current room; paper fill (base). SOUND: none.
REDUCED MOTION: the four rooms as a numbered list (no WebGL) (base).
BUDGET: own chunk ≤ 120 KB gz (three is a shared vendor chunk), draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2400-w10-s5d2-exceptional-cases; Topic 10 flowchart p 435 (Causation 3); Civil Liability Act
  2002 (NSW) s 5D(2) (authority civil-liability-act-2002-nsw-s5d). The flowchart presents parts 3 and 4 side by side;
  the walk orders them as prerequisites, then the court's judgment.
*/
import { Palace } from '../bases/Palace';

export default function ExceptionalCasesS5d2() {
  return (
    <Palace
      label="A corridor with four rooms: the gap, the kind of case, a clear breach and an evidentiary gap, the court's question"
      terms={[
        { term: 'Necessary condition', def: 'The ordinary statutory test (s 5D(1)(a)); s 5D(2) is for negligence that cannot meet it.' },
        { term: 'Exceptional case', def: 'The NSW words in s 5D(2); the textbook flowchart says “an appropriate case”.' },
        { term: 'Evidentiary gap', def: 'The missing proof of causation that, with a clear breach, the flowchart says the route needs.' },
      ]}
      loci={[
        { title: 'The gap', body: 'Negligence cannot be established as a “necessary condition” of the plaintiff’s harm. The ordinary test in s 5D(1)(a) has run out — only then does the flowchart turn to s 5D(2).' },
        { title: 'The kind of case', body: 's 5D(2) applies “in an exceptional case, in accordance with established principles” (the flowchart: “an appropriate case”): multiple sufficient causes, or material contribution to harm.' },
        { title: 'Must also be', body: 'A clear breach AND an evidentiary gap. Both are needed; an unclear or disputed breach does not open the route.' },
        { title: 'The court’s question', body: 'Amongst other relevant things, whether or not and why responsibility for the harm should be imposed on the negligent party. The flowchart adds whether and why the harm should be left to lie where it fell — that is not in the NSW text.' },
      ]}
      check={{
        question: 'Besides a case of the right kind, what does the flowchart say the s 5D(2) route also needs?',
        options: [
          { text: 'A clear breach and an evidentiary gap', correct: true, why: 'Causation 3: “Must also be: A clear breach and An evidentiary gap.” Both are needed.' },
          { text: 'A new intervening act and remoteness', why: 'Those are the two parts of scope of liability, the other branch of causation, not requirements of s 5D(2).' },
          { text: 'Proof that the fault was a necessary condition', why: 'If necessary condition could be proved, s 5D(2) would not be needed: the route exists for negligence that cannot be established as a necessary condition.' },
        ],
      }}
    />
  );
}
