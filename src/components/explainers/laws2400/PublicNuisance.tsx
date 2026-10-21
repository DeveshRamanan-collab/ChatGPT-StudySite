/*
SCENE: Public nuisance — a three-step checklist, read top to bottom
LENGTH: 4 loci; pinned 240vh on desktop (scroll walks), paced otherwise
BEATS: 4 (what it is → special damage → public right → substantial and unreasonable)
INTENT: A crime the state usually answers; a private plaintiff sues in tort only with special damage, which
  Walsh v Ervin shows need not be money.
SUBJECT: the amber light at the current step.
BEAT 1: Definition. BEAT 2: Title — special or particular damage (Walsh v Ervin). BEAT 3: Public right.
BEAT 4: Substantial and unreasonable.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point. SOUND: none.
REDUCED MOTION: the loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2400-w03-public-nuisance; case card walsh-v-ervin.
*/
import { Palace } from '../bases/Palace';

export default function PublicNuisance() {
  return (
    <Palace
      label="Public nuisance: special damage, interference with a public right, substantial and unreasonable"
      terms={[
        { term: 'Public nuisance', def: 'An unlawful act or omission endangering the public, or obstructing a right common to all.' },
        { term: 'Special damage', def: 'Damage different from that suffered by the public generally — not only money.' },
        { term: 'Public right', def: 'A right common to all, such as passage along a highway.' },
      ]}
      loci={[
        { title: 'First · What it is', body: 'A common law crime: an unlawful act or omission that endangers the lives, safety, property or comfort of the public, or obstructs a right common to all. A private person may sue in tort only with special damage.' },
        { title: 'Step 1 · Title to sue', body: 'Special or particular damage, different from the public’s. In Walsh v Ervin, crops and gates on the highway blocked P’s access: substantial delay and inconvenience, different in kind, was enough without financial loss.' },
        { title: 'Step 2 · A public right', body: 'The general public must be affected — ordinarily the community’s or the state’s responsibility to address.' },
        { title: 'Step 3 · Substantial and unreasonable', body: 'Not every annoyance or temporary inconvenience qualifies.' },
      ]}
      check={{
        question: 'A highway is blocked. P, whose only access to his farm is cut off, lost no money but suffered long delays. Title to sue?',
        options: [
          { text: 'No — special damage must be financial', why: 'Walsh v Ervin held special damage is not limited to pecuniary loss.' },
          { text: 'Yes — his delay and inconvenience differ in kind from the public’s', correct: true, why: 'As in Walsh v Ervin, substantial inconvenience different from the general public’s gives title to sue.' },
          { text: 'No — only the state can sue for public nuisance', why: 'A private individual can sue in tort if they suffered special or particular damage.' },
        ],
      }}
    />
  );
}
