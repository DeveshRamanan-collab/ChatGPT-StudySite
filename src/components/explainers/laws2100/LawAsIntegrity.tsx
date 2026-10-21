/*
SCENE: Constructive interpretation and law as integrity — a draggable path from courtesy to one right answer
LENGTH: not pinned — a Timeline (learner-paced; drag, click or arrow keys)
BEATS: 9 stops
INTENT: Dworkin's three interpretive stages, applied to law's point (justifying state coercion), give law as
  integrity — consistency in principle — worked by the chain novel and Judge Hercules on fit and justification.
SUBJECT: the handle and the stop it sits on; stops up to it drawn in ink.
BEAT 1–3: courtesy's three stages. BEAT 4: the point of law. BEAT 5: integrity. BEAT 6: chain novel. BEAT 7: Hercules.
  BEAT 8: fit and justification. BEAT 9: one right answer; Finnis's pushback.
CAMERA: none. LIGHT: none. SOUND: none.
REDUCED MOTION: same controls, no glide (base).
BUDGET: < 5 KB gz.
Source: concept laws2100-w05-law-as-integrity; authorities dworkin-laws-empire, finnis-on-reason-and-authority-in-laws-empire.
*/
import { Timeline } from '../bases/Timeline';

export default function LawAsIntegrity() {
  return (
    <Timeline
      label="Constructive interpretation and law as integrity, stop by stop"
      terms={[
        { term: 'Constructive interpretation', def: 'Interpreting a practice by asking its point, then revisiting its examples in that light.' },
        { term: 'Integrity', def: 'Consistency in principle: the system\'s political morality, not its structure, gives it unity.' },
        { term: 'Fit and justification', def: 'The two dimensions on which Hercules tests an answer (LE 255).' },
      ]}
      events={[
        { title: 'Pre-interpretive stage', tag: 'courtesy', body: 'Identify the actions we associate with courtesy: letting people go first, removing a hat. Because law is argumentative, Law\'s Empire builds a theory of law on interpretation — of practices as well as texts.' },
        { title: 'Interpretive stage', tag: 'courtesy', body: 'Ask what the point of the practice is.' },
        { title: 'Post-interpretive stage', tag: 'courtesy', body: 'Revisit the examples in light of that point and decide which really count.' },
        { title: 'The point of law', tag: 'law', body: 'The crucial question: what is the point of the law? For Dworkin, a liberal, it is to justify the exercise of state coercion. Hart\'s conditions for a legal system are about structure and say nothing about its point.' },
        { title: 'Law as integrity', tag: 'law', body: 'Integrity → consistency in principle. The principles of the system\'s political morality, not its structure, give it unity.' },
        { title: 'The chain novel', tag: 'LE 228', body: "Dworkin's analogy for interpretation in the legal context." },
        { title: 'Judge Hercules', tag: 'LE 239', body: '"An imaginary judge of superhuman intellectual power and patience who accepts law as integrity."' },
        { title: 'Fit and justification', tag: 'LE 255', body: 'Hercules tests an answer on two dimensions: the dimension of fit and the dimension of justification.' },
        { when: '1987', title: 'One right answer', body: "Even in hard cases there is one correct legal answer. Positivists and realists reject it; Finnis, 'On reason and authority in Law's Empire', pushes back on the incommensurability of fit and justification." },
      ]}
      check={{
        question: 'What does Dworkin say Hart\'s conditions for a legal system leave out?',
        options: [
          { text: 'The point of the law', correct: true, why: "Hart's conditions are about structure; Dworkin's interpretive stage asks the practice's point — for law, justifying state coercion." },
          { text: 'The rule of recognition', why: 'The rule of recognition is part of Hart\'s structural account, not what it omits.' },
          { text: 'Any role for officials', why: "Officials' acceptance of secondary rules is central to Hart's conditions." },
        ],
      }}
    />
  );
}
