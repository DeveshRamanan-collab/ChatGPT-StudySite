/*
SCENE: Trespass to land — four gates in sequence
LENGTH: 4 loci; pinned 240vh on desktop (scroll walks), paced otherwise
BEATS: 4 (one per element; the plaintiff must clear all four)
INTENT: Fix the four elements in order, with the two points that win marks: actionable per se, and the defendant
  bears the onus of disproving fault (except in highway cases).
SUBJECT: the amber light standing at the current gate.
BEAT 1: Direct and positive act (walking, driving, throwing, remaining, encroaching structures).
BEAT 2: Intentional or negligent (mistake no defence; onus on D). BEAT 3: Land in P's possession.
BEAT 4: No consent (express or implied) or other lawful justification.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the gate. SOUND: none.
REDUCED MOTION: the four gates as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2400-w03-trespass-to-land-elements (week 3 notes).
*/
import { Palace } from '../bases/Palace';

export default function TrespassToLandElements() {
  return (
    <Palace
      label="Four gates of trespass to land: direct and positive act, intentional or negligent, plaintiff's possession, no consent or lawful justification"
      terms={[
        { term: 'Trespass to land', def: "Direct interference with land in the plaintiff's possession." },
        { term: 'Actionable per se', def: 'The plaintiff need not prove damage.' },
        { term: 'Lawful justification', def: 'Consent (express or implied) or another lawful excuse, eg exercise of a lawful duty.' },
      ]}
      loci={[
        { title: 'Gate 1 · Direct and positive act', body: 'Walking or driving onto land, remaining after permission is withdrawn, throwing an object or animal onto it, or encroaching scaffolding or cranes. Parking on, graffiti, gatecrashing, dumping furniture.' },
        { title: 'Gate 2 · Intentional or negligent', body: 'Except in highway cases, the onus is on the defendant to disprove fault. Mistake is no defence: honestly but wrongly believing the land is yours is still trespass.' },
        { title: "Gate 3 · In the plaintiff's possession", body: 'The interference must be with land the plaintiff possesses at the time.' },
        { title: 'Gate 4 · No consent or lawful justification', body: 'No express or implied consent (such as an implied licence) and no other lawful justification. Then ask: direct enough for trespass, or is this nuisance?' },
      ]}
      check={{
        question: 'D builds a fence a metre onto P’s land, honestly believing the strip is D’s. Is this trespass?',
        options: [
          { text: 'No — D made an honest mistake', why: 'Mistake is no defence where the act itself was intentional.' },
          { text: 'Yes — the act was intentional, and mistake is no defence', correct: true, why: 'Building the fence was a deliberate act; a mistaken belief about title does not stop it being trespass.' },
          { text: 'Only if P proves damage', why: 'Trespass to land is actionable per se; no damage need be proved.' },
        ],
      }}
    />
  );
}
