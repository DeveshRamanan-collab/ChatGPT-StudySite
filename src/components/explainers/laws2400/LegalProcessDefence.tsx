/*
SCENE: Legal process — two checklists walked in turn: arrest, then entering or remaining on land
LENGTH: 5 loci; pinned 300vh on desktop (scroll walks), paced otherwise
BEATS: 5 (three arrest checks, two land checks)
INTENT: Acting under a lawful power answers trespass: for arrest, both limbs of s 99(1) plus reasonable force; for
  land, the implied licence first, then any separate statutory power to stay.
SUBJECT: the amber light at the current check.
BEAT 1: Reasonable suspicion (s 99(1)). BEAT 2: Reasonably necessary (s 99(1)). BEAT 3: Reasonable force (ss 230–231).
BEAT 4: Implied licence (Halliday v Nevill). BEAT 5: Statutory power to remain (Roy v O'Neill, 3:2).
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point. SOUND: none.
REDUCED MOTION: the loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2400-w04-legal-process-defence; case cards halliday-v-nevill, roy-v-oneill; LEPRA ss 99, 230–231.
*/
import { Palace } from '../bases/Palace';

export default function LegalProcessDefence() {
  return (
    <Palace
      label="Legal process: three checks for arrest, two for entering or remaining on land"
      terms={[
        { term: 'Legal process', def: 'Acting under a lawful power — a defence to trespass to the person and to land.' },
        { term: 'Reasonable suspicion', def: 'More than a mere possibility, but less than a belief.' },
        { term: 'Implied licence', def: 'Anyone may use an unobstructed path or driveway for lawful communication with the occupier.' },
      ]}
      loci={[
        { title: 'Arrest 1 · Reasonable suspicion', body: 'LEPRA s 99(1): a reasonable suspicion that the person is committing or has committed an offence.' },
        { title: 'Arrest 2 · Reasonably necessary', body: 'And satisfaction that arrest is reasonably necessary for a reason the Act lists. Both limbs of s 99(1) are needed.' },
        { title: 'Arrest 3 · Reasonable force', body: 'Sections 230–231 confine the force used in effecting an arrest to what is reasonably necessary.' },
        { title: 'Land 1 · Implied licence', body: 'Halliday v Nevill: anyone, including police, may use an unobstructed path or driveway for lawful communication with an occupier.' },
        { title: 'Land 2 · A power to remain', body: 'Roy v O’Neill (3:2): police checking a domestic violence order were within the licence; seeing the occupier’s intoxication then enlivened a separate statutory power to stay for a breath test.' },
      ]}
      check={{
        question: 'Police reasonably suspect P committed an offence, but arrest is not reasonably necessary for any listed reason. Is the arrest lawful under s 99(1)?',
        options: [
          { text: 'Yes — reasonable suspicion is enough', why: 'Suspicion is only one of the two limbs of s 99(1).' },
          { text: 'No — both limbs must be met', correct: true, why: 'Section 99(1) needs reasonable suspicion and satisfaction that arrest is reasonably necessary for a listed reason.' },
          { text: 'Yes, provided only reasonable force is used', why: 'Reasonable force (ss 230–231) is a further limit, not a substitute for the s 99(1) limbs.' },
        ],
      }}
    />
  );
}
