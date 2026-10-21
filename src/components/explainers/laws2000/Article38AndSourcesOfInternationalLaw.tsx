/*
SCENE: Article 38(1) ICJ Statute — four chambers, primary then secondary, and two warnings at the end of the corridor
LENGTH: 6 loci; pinned 360vh on desktop (scroll walks), paced otherwise
BEATS: 6 (treaties → custom → general principles → subsidiary means → not a ranking → not exhaustive)
INTENT: Fix the primary (law-creating) / secondary (law-interpreting) split, and that art 38 is neither a hierarchy
  nor a complete list.
SUBJECT: the amber light standing at the current chamber.
BEAT 1–3: primary chambers (a)–(c). BEAT 4: subsidiary chamber (d), art 59. BEAT 5: no ranking. BEAT 6: not exhaustive.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the locus. SOUND: none.
REDUCED MOTION: the six loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2000-w02-article-38-and-sources-of-international-law; ICJ Statute arts 38(1), 59.
*/
import { Palace } from '../bases/Palace';

export default function Article38AndSourcesOfInternationalLaw() {
  return (
    <Palace
      label="Article 38(1): treaties, custom and general principles as primary sources; judicial decisions and publicists as secondary"
      terms={[
        { term: 'Article 38(1)', def: 'The ICJ Statute’s list of what the Court applies — the first place of reference for sources, not a designed catalogue.' },
        { term: 'Primary source', def: 'A real, true source of binding obligations: treaties, custom, general principles.' },
        { term: 'Secondary source', def: 'Judicial decisions and the most highly qualified publicists: they interpret law, they do not create it.' },
      ]}
      loci={[
        { title: 'Chamber (a) · Treaties — primary', body: 'A source of binding obligations by states. It can bind the same states on the same question as a customary rule, at the same time.' },
        { title: 'Chamber (b) · Customary international law — primary', body: 'A real, true source of binding obligations, standing alongside treaties rather than beneath them.' },
        { title: 'Chamber (c) · General principles of law — primary', body: 'Also law-creating, but gap-fillers: they step in only when neither a treaty nor custom is available.' },
        { title: 'Chamber (d) · Judicial decisions and publicists — secondary', body: 'They do not create law; they help interpret the principles found in the primary sources. A decision binds only the parties to that case (art 59).' },
        { title: 'Warning · Not a ranking', body: '“There is a clear hierarchy between the sources” is a claim to analyse critically. The order (a)–(d) tracks primary v secondary; it does not rank treaty above custom or custom above general principles.' },
        { title: 'Warning · Not exhaustive', body: 'Unilateral statements, jus cogens, decisions of international organisations and soft law sit outside art 38 but still shape state behaviour. An answer that stops at art 38(1) has not found every source.' },
      ]}
      check={{
        question: 'An essay says art 38(1) ranks treaties above custom because treaties are listed first. How should you treat that claim?',
        options: [
          { text: 'Accept it: the listing order is a hierarchy of sources', why: 'The card says the order does not rank treaty above custom; the two can bind the same states simultaneously.' },
          { text: 'Analyse it critically: the order tracks primary v secondary, not a ranking', correct: true, why: '(a)–(c) create law and (d) interprets it; that is what the ordering reflects.' },
          { text: 'Reject art 38 entirely because it was not drafted as a list of sources', why: 'It was not designed as a catalogue, but it remains the first place of reference.' },
        ],
      }}
    />
  );
}
