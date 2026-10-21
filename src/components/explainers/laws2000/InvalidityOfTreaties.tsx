/*
SCENE: Invalidity of treaties — the relative chamber, the absolute chamber, and the narrow art 46 door
LENGTH: 7 loci; pinned 420vh on desktop (scroll walks), paced otherwise
BEATS: 7 (arts 48, 49, 50 relative → arts 51, 52, 53 absolute → art 46 internal law, Cameroon v Nigeria)
INTENT: Fix each named ground in its chamber, and that breach of internal law is deliberately not a ground save narrowly.
SUBJECT: the amber light standing at the current ground.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the locus. SOUND: none.
REDUCED MOTION: the seven loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2000-w03-invalidity-of-treaties; VCLT arts 46, 48–53; case card land-and-maritime-boundary-cameroon-v-nigeria.
*/
import { Palace } from '../bases/Palace';

export default function InvalidityOfTreaties() {
  return (
    <Palace
      label="Invalidity of treaties: relative grounds (arts 48–50), absolute grounds (arts 51–53) and the narrow art 46 exception"
      terms={[
        { term: 'Invalidity', def: 'A defect infecting a treaty that was otherwise properly concluded — not a timing problem.' },
        { term: 'Relative invalidity', def: 'Grounds that go to consent: error, fraud, corruption of a representative.' },
        { term: 'Absolute invalidity', def: 'Grounds that void the treaty: coercion of a representative, force against the state, jus cogens.' },
      ]}
      loci={[
        { title: 'Relative · Error (art 48)', body: 'A material factual mistake, like an erroneous map, important to the decision to join.' },
        { title: 'Relative · Fraud (art 49)', body: 'A representative fraudulently misled into signing.' },
        { title: 'Relative · Corruption of a representative (art 50)', body: 'A non-due advantage induces a representative to sign who otherwise would not have.' },
        { title: 'Absolute · Coercion of a representative (art 51)', body: 'Economic pressure, blackmail, or a threat to the representative’s life.' },
        { title: 'Absolute · Threat or use of force (art 52)', body: 'Force against the state itself voids the treaty ab initio.' },
        { title: 'Absolute · Jus cogens (art 53)', body: 'Conflict with a peremptory norm from which no derogation is permitted — the prohibitions on torture, genocide, aggression and piracy, and self-determination — also voids the treaty.' },
        { title: 'Narrow door · Internal law (art 46)', body: 'Breaching your own internal law on who may conclude treaties is deliberately not a ground, “unless the violation was manifest and concerned a rule of its internal law of fundamental importance” (Cameroon v Nigeria), protecting the other party’s reliance.' },
      ]}
      check={{
        question: 'A state signed a treaty through an official who lacked authority under its own constitution. It now says the treaty is invalid. What is the starting point?',
        options: [
          { text: 'Invalid under art 49, because the other party misled it', why: 'Nothing suggests fraud; the defect is in the state’s own internal law.' },
          { text: 'Not a ground unless the violation was manifest and of fundamental importance (art 46)', correct: true, why: 'Cameroon v Nigeria: internal-law violations rarely invalidate, to protect the other party’s reliance.' },
          { text: 'Void ab initio, like a treaty procured by force', why: 'Only force against the state (art 52) and jus cogens conflict (art 53) void a treaty that way.' },
        ],
      }}
    />
  );
}
