/*
SCENE: Necessity — three situations behind one two-condition gate, with Southwark as the warning sign
LENGTH: 5 loci; pinned 300vh on desktop (scroll walks), paced otherwise
BEATS: 5
INTENT: Name the situation, then test necessity and proportionality, remembering the doctrine is narrow.
SUBJECT: the amber light at the current locus.
BEAT 1: The three situations. BEAT 2: The two conditions. BEAT 3: Southwark — carefully circumscribed.
BEAT 4: Where it succeeded — Proudman v Allen; NSW v McMaster. BEAT 5: Medical — In re F, temporary vs permanent.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point. SOUND: none.
REDUCED MOTION: the loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2400-w04-necessity-defence and its case cards.
*/
import { Palace } from '../bases/Palace';

export default function NecessityDefence() {
  return (
    <Palace
      label="Necessity: three situations, one two-condition test, and Southwark's warning"
      terms={[
        { term: 'Necessity', def: 'Excuses an otherwise tortious act done to prevent serious harm to person or property.' },
        { term: 'Proportionate', def: 'The action was reasonable and in proportion to the risk.' },
        { term: 'Temporary incapacity', def: 'Eg unconsciousness: do no more than necessary until the person can decide.' },
      ]}
      loci={[
        { title: 'Three situations', body: 'Public necessity (throwing luggage from a sinking ship to save lives); protecting property (entering a neighbour’s land to rescue a pet); preserving the life or health of someone unable to consent (treating an unconscious patient).' },
        { title: 'The two conditions', body: 'The action was necessary to prevent serious harm to person or property, and it was reasonable and proportionate to the risk.' },
        { title: 'Warning · Southwark v Williams', body: 'Homeless squatters pleaded necessity and failed. Lord Denning: otherwise "no one’s house would be safe"; the doctrine "must be carefully circumscribed".' },
        { title: 'Where it succeeded', body: 'Proudman v Allen: turning a driverless car’s wheel to avoid a collision, sending it into the sea — even a stranger may protect another’s property. NSW v McMaster: pleaded alongside self-defence in trespass to the person.' },
        { title: 'Medical · In re F', body: 'Communication must be impracticable, and the action what a reasonable person would take in the person’s best interests. Temporary incapacity: no more than necessary until consciousness returns. Permanent: act in their best interests without waiting.' },
      ]}
      check={{
        question: 'A surgeon treating an unconscious patient finds a non-urgent problem. Under In re F, what should she do?',
        options: [
          { text: 'Fix it now, in the patient’s best interests', why: 'That approach is for permanent incapacity; this incapacity is temporary.' },
          { text: 'Do no more than is necessary until the patient regains consciousness', correct: true, why: 'For temporary incapacity, In re F limits necessity to what cannot wait.' },
          { text: 'Nothing — necessity never applies to medical treatment', why: 'Preserving the life or health of someone unable to consent is one of the three necessity situations.' },
        ],
      }}
    />
  );
}
