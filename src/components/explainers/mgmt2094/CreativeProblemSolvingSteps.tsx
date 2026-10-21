/*
SCENE: The three steps of creative problem solving — a corridor walk
LENGTH: 4 loci; pinned 240vh on desktop (scroll walks), paced otherwise (Palace base)
BEATS: 4 (one per locus)
INTENT: Fix the order of the lecture's model — identify an interesting problem, divergent thinking, convergent
  thinking — with the phase each belongs to, and show that the process loops back rather than ending.
SUBJECT: the amber light standing at the current locus.
BEAT 1: Identify an interesting problem — prospective phase; find problems, identify needs.
BEAT 2: Divergent thinking — prospective phase; find solutions; the quota method breaks linear thinking.
BEAT 3: Convergent thinking — analytical phase; find « the » solution, or a good solution.
BEAT 4: Back to the start — the cycle: great advances are a long process of intuitions and successive progresses.
CAMERA: 35mm-equivalent, dolly along the corridor, yaw ≤ 15° toward the locus, no cuts (base).
LIGHT: one amber point at the current locus; paper fill. SOUND: none.
REDUCED MOTION: the four loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz (three is a shared vendor chunk), draw calls < 20, 60 fps at 4× throttle.
Source: concept mgmt2094-w02-creative-problem-solving-steps; week 2 lecture slides 2–7 (content-src/mgmt2094-w02.yaml).
*/
import { Palace } from '../bases/Palace';

export default function CreativeProblemSolvingSteps() {
  return (
    <Palace
      label="A corridor with four frames: identify a problem, divergent thinking, convergent thinking, and back to the start"
      terms={[
        { term: 'Prospective phase', def: 'The first two steps: identify an interesting problem, then divergent thinking.' },
        { term: 'Analytical phase', def: 'The last step: convergent thinking, which finds « the » solution or a good one.' },
        { term: 'Divergent thinking', def: 'Opening out: find solutions — at least three, not just the first.' },
        { term: 'Convergent thinking', def: 'Closing down: weigh benefits and risks, keep the best, eliminate wrong answers.' },
      ]}
      loci={[
        { title: '1 · Identify an interesting problem', body: 'Prospective phase. Find problems, identify needs. Identifying meaningful problems, asking the right questions is a key characteristic of creative people.' },
        { title: '2 · Divergent thinking', body: 'Prospective phase. Find solutions. Break the "linear thinking" habit of settling for the first idea: always ask at least three ideas (the quota method).' },
        { title: '3 · Convergent thinking', body: 'Analytical phase. Find « the » solution, or a good solution: identify benefits and risks, keep the best and eliminate wrong answers — evaluation and selection.' },
        { title: '4 · And round again', body: 'The steps form a cycle. Great advances are usually the result of a long process that is a sum of intuitions and successive progresses.' },
      ]}
      check={{
        question: 'A team is scoring its shortlisted campaign ideas on benefits and risks. Which step, and which phase?',
        options: [
          { text: 'Divergent thinking, in the prospective phase', why: 'Divergent thinking finds solutions; scoring ones already found is selection, which comes later.' },
          { text: 'Convergent thinking, in the analytical phase', correct: true, why: 'Weighing benefits and risks to keep the best is convergent thinking — the analytical phase.' },
          { text: 'Identifying an interesting problem, in the prospective phase', why: 'The problem is already set and solutions exist; the team is choosing among them, not finding needs.' },
        ],
      }}
    />
  );
}
