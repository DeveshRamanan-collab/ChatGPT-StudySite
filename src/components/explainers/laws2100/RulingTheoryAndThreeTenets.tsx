/*
SCENE: The ruling theory and Dworkin's three tenets — two rooms with the wall struck through, then three doors
LENGTH: 5 loci; pinned 300vh on desktop (scroll walks), paced otherwise
BEATS: 5
INTENT: Bentham's ruling theory joins positivism (what law is) and utilitarianism (what law ought to be); Dworkin
  attacks both and their independence, then names positivism's three tenets — pedigree, discretion, obligation.
SUBJECT: the amber light standing at the current room or door.
BEAT 1: two rooms, what law is / what law ought to be, wall struck through. BEAT 2: Hart's version is the target.
  BEAT 3: door 1 pedigree. BEAT 4: door 2 discretion. BEAT 5: door 3 obligation; Dworkin's strategy.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point. SOUND: none.
REDUCED MOTION: the five loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2100-w05-ruling-theory-and-three-tenets; authorities dworkin-taking-rights-seriously, hart-the-concept-of-law.
*/
import { Palace } from '../bases/Palace';

export default function RulingTheoryAndThreeTenets() {
  return (
    <Palace
      label="The ruling theory's two rooms, then positivism's three tenets as doors"
      terms={[
        { term: 'The ruling theory', def: "Dworkin's name for Bentham's pair: positivism (what law is) plus utilitarianism (what law ought to be)." },
        { term: 'Pedigree', def: 'Identifying legal rules by how they were made — the rule of recognition.' },
        { term: 'Tenet', def: 'One of the three key claims of positivism in The Model of Rules I (1967).' },
      ]}
      loci={[
        { title: 'Two rooms, one wall struck through', body: 'The ruling theory has two parts from Jeremy Bentham: what law is (legal positivism) and what law ought to be (utilitarianism). Dworkin criticises both parts and the assumption that they are independent: a general theory of law must be normative as well as conceptual.' },
        { title: 'The target · Hart', body: '"Legal positivism […] is the theory that individuals have legal rights only insofar as these have been created by explicit political decisions or explicit social practice" (TRS xii). Its most powerful version is Hart\'s — the one criticised.' },
        { title: 'Door 1 · Pedigree', body: 'Legal rules can be identified in light of their pedigree: the rule of recognition.' },
        { title: 'Door 2 · Discretion', body: 'There are cases in which judges must exercise discretion.' },
        { title: 'Door 3 · Obligation', body: "Legal obligation if and only if the case falls under a valid legal rule. Dworkin's strategy is Hart's against Austin: find a feature of our law — principles, later theoretical disagreement — that the descriptive theory cannot explain." },
      ]}
      check={{
        question: 'An argument says judges in hard cases are still bound by legal standards. Which tenet does it attack first?',
        options: [
          { text: 'Pedigree', why: 'Pedigree concerns how rules are identified; the argument here is about whether judges are bound.' },
          { text: 'Discretion', correct: true, why: 'Tenet 2 says judges must exercise discretion in some cases; being bound by standards denies strong discretion.' },
          { text: 'The ruling theory\'s utilitarian half', why: 'That is the theory of what law ought to be, not one of the three tenets of positivism.' },
        ],
      }}
    />
  );
}
