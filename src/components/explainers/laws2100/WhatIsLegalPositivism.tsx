/*
SCENE: Five meanings of 'positivism', then three doors of legal positivism
LENGTH: 6 loci; pinned 360vh on desktop (scroll walks), paced otherwise
BEATS: 6
INTENT: Keep Hart's five meanings apart and see who holds which (Bentham and Austin 1–3; Kelsen 2, 3, 5), then split
  legal positivism into three senses by the kind of claim each makes.
SUBJECT: the amber light standing at the current room.
BEAT 1–5: one meaning per room, with its holders. BEAT 6: the hall — general theory, methodology, political theory.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the room. SOUND: none.
REDUCED MOTION: the six loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2100-w03-what-is-legal-positivism; authorities hart-positivism-and-the-separation-of-law-and-morals,
  hart-the-concept-of-law.
*/
import { Palace } from '../bases/Palace';

export default function WhatIsLegalPositivism() {
  return (
    <Palace
      label="Five rooms for five meanings of positivism, and a hall with three doors: theory, methodology, political theory"
      terms={[
        { term: 'Closed logical system', def: 'The idea that correct decisions can be deduced from predetermined rules by logic alone.' },
        { term: 'Noncognitivism', def: 'Moral judgments cannot be established or defended by rational argument, evidence or proof.' },
        { term: 'Separability thesis', def: 'There is no necessary connection between law and morals.' },
      ]}
      loci={[
        { title: 'Room 1 · Commands', body: 'Laws are commands of human beings. Held by Bentham and Austin; not by Kelsen.' },
        { title: 'Room 2 · No necessary connection', body: 'No necessary connection between law and morals, or law as it is and as it ought to be. Held by Bentham, Austin and Kelsen.' },
        { title: 'Room 3 · Analysis of legal concepts', body: 'Worth pursuing and distinct from historical and sociological inquiries and from the criticism or appraisal of law. Held by Bentham, Austin and Kelsen.' },
        { title: 'Room 4 · Closed logical system', body: 'Correct decisions deduced from predetermined rules by logic alone. Held by none of Bentham, Austin or Kelsen.' },
        { title: 'Room 5 · Noncognitivism', body: 'Moral judgments cannot be defended by rational argument, evidence or proof. Held by Kelsen; not by Bentham or Austin.' },
        { title: 'The hall · Three senses of legal positivism', body: 'Door 1, a general theory of law: descriptive and conceptual claims about the nature of law (social facts, sources, separability). Door 2, a methodology: a meta-theoretical claim that legal theory is morally neutral and descriptive. Door 3, a political theory: a prescriptive claim that law and morality should be kept separate.' },
      ]}
      check={{
        question: '"Legal theory is a morally neutral, descriptive enterprise." Which sense of legal positivism is this?',
        options: [
          { text: 'A general theory of law', why: 'Tempting, but that sense makes claims about the nature of law, not about how legal theory should be done.' },
          { text: 'A methodology', correct: true, why: 'It is a meta-theoretical claim about legal theory itself — Hart: "descriptive in that it is morally neutral".' },
          { text: 'A political theory of law', why: 'The political sense is prescriptive: law and morality should be kept separate. This claim prescribes nothing about law.' },
        ],
      }}
    />
  );
}
