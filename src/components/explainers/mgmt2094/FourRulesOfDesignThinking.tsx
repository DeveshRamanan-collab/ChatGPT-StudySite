/*
SCENE: Meinel and Leifer's four rules of design thinking — a corridor walk
LENGTH: 4 loci; pinned 240vh on desktop (scroll walks), paced otherwise
BEATS: 4 (one per rule)
INTENT: Fix the four rules — human, ambiguity, redesign, tangibility — each as a one-line imperative plus the practice
  it justifies, so a rule can be cited to defend a design-thinking choice in an essay.
SUBJECT: the amber light standing at the current rule's frame.
BEAT 1: The Human Rule. BEAT 2: The Ambiguity Rule. BEAT 3: The Redesign Rule. BEAT 4: The Tangibility Rule.
CAMERA: 35mm-equivalent, dolly along the corridor, yaw ≤ 15° toward the locus, no cuts (Palace base).
LIGHT: one amber point at the current locus; paper fill. SOUND: none.
REDUCED MOTION: the four loci as a numbered list (no WebGL).
BUDGET: own chunk ≤ 120 KB gz (three is a shared vendor chunk), draw calls < 20, 60 fps at 4× throttle.
Source: concept mgmt2094-w03-four-rules-of-design-thinking; authority mgmt2094-meinel-leifer-four-rules (as quoted in
  the Week 3 reading, p 11).
*/
import { Palace } from '../bases/Palace';

export default function FourRulesOfDesignThinking() {
  return (
    <Palace
      label="A corridor with four frames: the human, ambiguity, redesign and tangibility rules"
      terms={[
        { term: 'Chance discovery', def: 'Finding something you were not looking for — impossible if the box is closed too tightly.' },
        { term: 'Foresight tools', def: 'Methods for estimating social and technical conditions five, 10 or even 20 years ahead.' },
        { term: 'Communication media', def: 'What prototypes are, on Meinel and Leifer’s recent finding: things people talk through.' },
      ]}
      loci={[
        { title: 'The Human Rule', body: 'All design activity is ultimately social in nature. Solve technical problems in ways that satisfy human needs, and acknowledge the human element in all technologists and managers. Justifies: research into people’s needs.' },
        { title: 'The Ambiguity Rule', body: 'Design thinkers must preserve ambiguity. No chance for chance discovery if the box is closed tightly, constraints are enumerated excessively and fear of failure is always at hand. Justifies: an open brief.' },
        { title: 'The Redesign Rule', body: 'All design is redesign. Human needs have been with us for millennia; understand how they were met in the past, then use foresight tools to look five, 10 or 20 years ahead. Justifies: studying past solutions.' },
        { title: 'The Tangibility Rule', body: 'Making ideas tangible always facilitates communication: prototypes are communication media. Justifies: building rough models early so different people can talk about the same idea.' },
      ]}
      check={{
        question: 'A bank’s innovation team writes a 40-point list of constraints and punishes pilots that fail. Which rule is it breaking?',
        options: [
          { text: 'The Tangibility Rule', why: 'A list is not a prototype, but the problem here is a closed box and fear of failure — the ambiguity rule.' },
          { text: 'The Redesign Rule', why: 'Nothing in the facts says the team ignores how needs were met in the past.' },
          { text: 'The Ambiguity Rule', correct: true, why: 'Excessive constraints and a constant fear of failure leave no chance for chance discovery: design thinkers must preserve ambiguity.' },
        ],
      }}
    />
  );
}
