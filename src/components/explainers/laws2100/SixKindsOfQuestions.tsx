/*
SCENE: Six kinds of questions — six rooms in order
LENGTH: 6 loci; pinned 360vh on desktop (scroll walks), paced otherwise
BEATS: 6 (one per kind of question, each with one example)
INTENT: Label a claim by the kind of question it answers before judging it; rooms 4 and 5 ask about theories, not
  about a legal system.
SUBJECT: the amber light standing at the current room.
BEAT 1: doctrinal. BEAT 2: normative (is/ought; justificatory vs critical). BEAT 3: empirical (explanatory vs effects).
BEAT 4: metatheoretical. BEAT 5: methodological. BEAT 6: conceptual.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the room. SOUND: none.
REDUCED MOTION: the six rooms as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2100-w01-six-kinds-of-questions; authority bix-jurisprudence-theory-and-context.
*/
import { Palace } from '../bases/Palace';

export default function SixKindsOfQuestions() {
  return (
    <Palace
      label="Six rooms of questions: doctrinal, normative, empirical, metatheoretical, methodological, conceptual"
      terms={[
        { term: 'Is / ought', def: 'The line between describing how things are and claiming how they should be.' },
        { term: 'Metatheoretical', def: 'About a theory: what are the success criteria that make one theory better than another?' },
        { term: 'Conceptual', def: 'About what a concept is: what is a contract? what is law? what is justice?' },
      ]}
      loci={[
        { title: 'Room 1 · Doctrinal', body: 'What the law is on a specific issue, eg questions about domestic law. A hypothetical is a cluster of doctrinal questions.' },
        { title: 'Room 2 · Normative', body: 'Descriptive vs normative claims (the is/ought distinction). Normative claims are justificatory (defending the status quo) or critical (criticising it).' },
        { title: 'Room 3 · Empirical', body: 'Explanatory or causal claims (why something happens) vs effects claims (what a new statute actually does to a community on the ground).' },
        { title: 'Room 4 · Metatheoretical', body: 'What are the success criteria for a given theory? Picking a theory is not like picking an ice-cream flavour: we look for criteria that make it superior, at least in some respect.' },
        { title: 'Room 5 · Methodological', body: 'How should we conduct research in this field? Settled in the natural sciences, harder in the social sciences, even more debatable in philosophy.' },
        { title: 'Room 6 · Conceptual', body: 'What is a contract? What is law? What is justice? Legal philosophers tend to ask these, but even an empirical inquiry needs concepts. Rooms 4 and 5 concern the nature of jurisprudence; the rest, the nature of law.' },
      ]}
      check={{
        question: '"Hart\'s theory should be judged by whether it fits the facts of real legal systems." Which kind of claim is this?',
        options: [
          { text: 'Doctrinal', why: 'It says nothing about what the law is on any issue in a particular system.' },
          { text: 'Metatheoretical', correct: true, why: 'It proposes a success criterion for judging a theory — a question about the theory, not about law.' },
          { text: 'Empirical', why: 'Tempting because it mentions facts, but it does not explain why something happens or measure a statute\'s effects; it sets a test for theories.' },
        ],
      }}
    />
  );
}
