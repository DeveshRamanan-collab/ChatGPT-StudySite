/*
SCENE: The union of primary and secondary rules — three defects, three remedies, one hall
LENGTH: 5 loci; pinned 300vh on desktop (scroll walks), paced otherwise
BEATS: 5
INTENT: Each defect of a society of primary rules only is paired with the secondary rule that remedies it; the union
  is the heart of a legal system, and international law sits apart as separate primary rules.
SUBJECT: the amber light standing at the current room.
BEAT 1: uncertainty → rule of recognition. BEAT 2: static → rules of change. BEAT 3: inefficiency → adjudication.
BEAT 4: the hall — "the heart of a legal system". BEAT 5: the annexe — international law.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the room. SOUND: none.
REDUCED MOTION: the five loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2100-w03-primary-and-secondary-rules; authority hart-the-concept-of-law.
*/
import { Palace } from '../bases/Palace';

export default function PrimaryAndSecondaryRules() {
  return (
    <Palace
      label="Three defects and their remedies — recognition, change, adjudication — opening onto the heart of a legal system"
      terms={[
        { term: 'Primary rules', def: 'Rules of obligation: they require or forbid conduct.' },
        { term: 'Secondary rules', def: 'Rules of a different kind that supplement the primary rules and remedy their defects.' },
        { term: 'Legal system', def: "Hart's focus: unlike Austin, who looked at the individual law, he looks at the system." },
      ]}
      loci={[
        { title: 'Room 1 · Uncertainty → rule of recognition', body: 'Authoritative criteria fix the content of the rules — like the elders who know the customs.' },
        { title: 'Room 2 · Static quality → rules of change', body: 'Someone is empowered to change or create rules — an assembly deciding how to fish; a parliament.' },
        { title: 'Room 3 · Inefficiency → rules of adjudication', body: 'A third party is authorised to settle disagreements — a jury here, a judge there. The content differs; the rule type is the same.' },
        { title: 'The hall · The heart of a legal system', body: 'The union is "not only the heart of a legal system, but a most powerful tool for the analysis of much that has puzzled both the jurist and the political theorist" (CL 98). It is the centre, not the whole.' },
        { title: 'The annexe · International law', body: 'For Hart, international law is law but not a legal system: separate primary rules, similar in function and content to municipal law, different in form.' },
      ]}
      check={{
        question: 'A community disagrees about what its customary rules actually say. Which secondary rule remedies this defect?',
        options: [
          { text: 'A rule of recognition', correct: true, why: 'Uncertainty about content is remedied by authoritative criteria that fix what the rules are.' },
          { text: 'A rule of change', why: 'Rules of change cure the static quality — they let rules be created or altered, not identified.' },
          { text: 'A rule of adjudication', why: 'Adjudication cures inefficiency in settling disputes about breaches; it does not say which rules exist.' },
        ],
      }}
    />
  );
}
