/*
SCENE: Types of (legal) reasoning and of (legal) rules — one corridor, six reasoning rooms then five rule rooms
LENGTH: 11 loci; pinned 660vh on desktop (scroll walks), paced otherwise
BEATS: 11
INTENT: Name the type of reasoning or rule a judge is using: six shapes of reasoning (each with its arrow), then five
  kinds of rule; none is unique to law.
SUBJECT: the amber light standing at the current room.
BEAT 1–6: deductive (rule → case), inductive (cases → rule), analogical (case ↔ case), abductive (facts → best
  hypothesis), purposive (rule → purpose), by principle (weighing). BEAT 7–11: mandatory, prohibitive, permissive,
  power-conferring, constitutive.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point. SOUND: none.
REDUCED MOTION: the eleven loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2100-w07-types-of-reasoning-and-rules; authority hart-the-concept-of-law.
*/
import { Palace } from '../bases/Palace';

export default function TypesOfReasoningAndRules() {
  return (
    <Palace
      label="Six types of legal reasoning and five types of legal rule, room by room"
      terms={[
        { term: 'Practical reasoning', def: 'Reasoning geared towards action — in law, a decision.' },
        { term: 'Duty-imposing vs power-conferring', def: "Hart's distinction against Austin: an invalid will is a nullity, not a punishment." },
        { term: 'Constitutive rule', def: 'A rule that creates the activity or institution itself.' },
      ]}
      loci={[
        { title: 'Reasoning 1 · Deductive (rule → case)', body: 'General rule → specific conclusion. All documents with these characteristics are valid wills; this one has them; so it is a valid will.' },
        { title: 'Reasoning 2 · Inductive (cases → rule)', body: 'Specific cases → general principle, as in common law development.' },
        { title: 'Reasoning 3 · Analogical (case ↔ case)', body: 'Comparing cases: similar facts → similar outcomes (precedent). Particularly important in law.' },
        { title: 'Reasoning 4 · Abductive (facts → best hypothesis)', body: 'Inference to the best explanation: from the facts to the best available hypothesis explaining them. Plausibility, not certainty.' },
        { title: 'Reasoning 5 · Purposive (rule → purpose)', body: "Reasoning in light of a rule's underlying purpose or rationale." },
        { title: 'Reasoning 6 · By principle (weighing)', body: 'Weighing and balancing competing principles or values, not fixed rules.' },
        { title: 'Rule 1 · Mandatory', body: "Imposes a duty to act: 'X must do Y'." },
        { title: 'Rule 2 · Prohibitive', body: "Imposes a duty not to act: 'X must not do Y'." },
        { title: 'Rule 3 · Permissive', body: "Grants a liberty or option: 'X may do Y'." },
        { title: 'Rule 4 · Power-conferring', body: 'Confers legal power to create, change or extinguish legal relations: making a will, passing legislation.' },
        { title: 'Rule 5 · Constitutive', body: 'Creates the activity or institution itself: contracts, marriage, corporations — outside law, a goal in football. None of these types is unique to law.' },
      ]}
      check={{
        question: 'A judge says: "The earlier case had similar facts, so it should have a similar outcome." Which type of reasoning is this?',
        options: [
          { text: 'Deductive', why: 'Deduction runs from a general rule to a specific conclusion, not from case to case.' },
          { text: 'Analogical', correct: true, why: 'Comparing cases — similar facts, similar outcomes — is analogical reasoning, the basis of precedent.' },
          { text: 'Abductive', why: 'Abduction infers the best explanation of the facts; it does not compare cases.' },
        ],
      }}
    />
  );
}
