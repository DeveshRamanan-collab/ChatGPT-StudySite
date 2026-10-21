/*
SCENE: Private nuisance — a three-step checklist with a side room of balancing factors
LENGTH: 5 loci; pinned 300vh on desktop (scroll walks), paced otherwise
BEATS: 5 (title → substantial and unreasonable, opened into its factors → created/authorised/continued)
INTENT: Work private nuisance in order: title to sue, then the balancing factors (flagging motive), then the right
  defendant.
SUBJECT: the amber light at the current step.
BEAT 1: Title to sue (Oldham; Bush and Deasy; Hunter). BEAT 2: Substantial and unreasonable — objective (Munro).
BEAT 3: Not enough — lawful competition, being overlooked (Victoria Park). BEAT 4: Motive (Hollywood Silver Fox).
BEAT 5: Created, authorised or continued.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point. SOUND: none.
REDUCED MOTION: the loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2400-w03-private-nuisance-elements and its case cards.
*/
import { Palace } from '../bases/Palace';

export default function PrivateNuisanceElements() {
  return (
    <Palace
      label="Private nuisance: title to sue, substantial and unreasonable interference, created, authorised or continued"
      terms={[
        { term: 'Private nuisance', def: "An action on the case for tangible or intangible interference with a person's use and enjoyment of land." },
        { term: 'Proprietary interest', def: 'An owner or tenant in possession — a mere licensee has none.' },
        { term: 'Continuer', def: 'An occupier who becomes aware of a nuisance and neglects to remedy it.' },
      ]}
      loci={[
        { title: 'Step 1 · Title to sue', body: 'Only a proprietary interest — owner or tenant in possession; a mere licensee cannot (Oldham v Lawson). Khorasandjian v Bush and Deasy let a licensee sue, until Hunter v Canary Wharf overruled Bush.' },
        { title: 'Step 2 · Substantial and unreasonable', body: 'Balance neighbours’ rights: frequency, duration, time, locality, distance. The standard is objective — the ordinary person in the claimant’s position, not the abnormally sensitive (Munro v Southern Dairies).' },
        { title: 'Step 2 · What is not enough', body: 'Mere loss of profit from lawful competition, or being overlooked (Victoria Park Racing v Taylor).' },
        { title: 'Step 2 · Motive', body: 'Motive or malice can tip otherwise-lawful conduct into nuisance (Hollywood Silver Fox Farm v Emmett).' },
        { title: 'Step 3 · Created, authorised or continued', body: 'Not only the creator: an occupier who authorises the activity, or knows of a nuisance and neglects to remedy it, can be liable.' },
      ]}
      check={{
        question: 'P lodges as a licensee in a flat next to a noisy factory. After Hunter v Canary Wharf, can P sue in private nuisance?',
        options: [
          { text: 'Yes — Khorasandjian v Bush lets a licensee sue', why: 'Hunter v Canary Wharf overruled Bush.' },
          { text: 'No — P has no proprietary interest', correct: true, why: 'Hunter restored the requirement of a proprietary interest: an owner or tenant in possession.' },
          { text: 'Yes, if the noise is substantial', why: 'Substantial interference is step 2; without title to sue, P fails at step 1.' },
        ],
      }}
    />
  );
}
