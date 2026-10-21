/*
SCENE: Children — four rooms on the direction of the duty
LENGTH: 4 loci; pinned 240vh on desktop (scroll walks), paced otherwise
BEATS: 4 (one per room, in the order of the lecture)
INTENT: Fix who owes whom: parents to others (control the child), parents and carers to the child (only not to lead
  the child into danger), the child for pre-natal injuries once born alive, and the controversial actions around
  conception and birth.
SUBJECT: the amber light standing at the current room.
BEAT 1: Parents → others: duty to control the child; Smith v Leurs (owed, not breached).
BEAT 2: Parents → child: no duty for raising; drive carefully, create no danger; Hahn v Conley (no duty on the facts).
BEAT 3: Pre-natal injuries: the child sues once born alive.
BEAT 4: Wrongful conception and birth (parents), wrongful life (child) — controversial.
CAMERA: 35mm-equivalent, dolly along the corridor, yaw ≤ 15° toward the locus, no cuts (Palace base).
LIGHT: one amber point at the current locus; paper fill. SOUND: none.
REDUCED MOTION: the four loci as a numbered list (no WebGL).
BUDGET: own chunk ≤ 120 KB gz (three is a shared vendor chunk), draw calls < 20, 60 fps at 4× throttle.
Source: concept card laws2400-w08-children-parents-and-the-unborn; cases smith-v-leurs, hahn-v-conley (Topic 8
  Lecture 2 slides 11–16).
*/
import { Palace } from '../bases/Palace';

export default function ChildrenParentsAndUnborn() {
  return (
    <Palace
      label="A corridor with four frames: duties involving children"
      terms={[
        { term: 'In loco parentis', def: 'Standing in the place of a parent — like the grandfather in Hahn v Conley.' },
        { term: 'Pre-natal injury', def: 'Injury to a child in the womb; actionable by the child once born alive.' },
        { term: 'Wrongful birth', def: 'Parents’ claim that the pregnancy would have been terminated but for negligence.' },
      ]}
      loci={[
        { title: 'Parents → others', body: 'Parents may owe others a duty to control their child. Smith v Leurs: a 13-year-old’s sling-shot stone injured the plaintiff’s eye; a duty was owed but not breached — the parents had told him not to use it outside their home.' },
        { title: 'Parents → the child', body: 'Generally no duty in feeding, clothing or raising a child, but parents must drive carefully and not create danger; they are liable if they lead the child into danger. Hahn v Conley: the grandfather only answered the girl’s call — no duty.' },
        { title: 'Before birth', body: 'Until she is born a child cannot sue. But a child injured in the womb may bring an action for pre-natal injuries, provided she is later born alive.' },
        { title: 'Conception, birth and life', body: 'Parents have sued for wrongful conception (would not have conceived but for negligence) and wrongful birth (would have terminated); children for wrongful life. Controversial — how do you put a value on life?' },
      ]}
      check={{
        question: 'In Hahn v Conley, why did the grandfather owe the girl no duty to protect her from the traffic?',
        options: [
          { text: 'Carers never owe any duty to children in their care', why: 'Too wide: a parent or carer can be liable if the child is led into danger by their actions.' },
          { text: 'He did not lead her into danger — he answered her call, but did not call her to come to him', correct: true, why: 'The Court held that on these facts he did not lead her into danger, so no duty to protect her arose.' },
          { text: 'The driver alone was responsible, so the question never arose', why: 'The question arose precisely because the driver claimed an indemnity from the grandfather.' },
        ],
      }}
    />
  );
}
