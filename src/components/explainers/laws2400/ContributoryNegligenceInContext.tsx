/*
SCENE: Contributory negligence in context — a corridor walk through three rooms
LENGTH: 4 loci; pinned 240vh on desktop (scroll walks), paced otherwise (Palace base)
BEATS: 4 (one per locus)
INTENT: Fix the three situations the flowchart singles out when careless-looking conduct is weighed — the employee,
  the perceived emergency, the rescuer — and the s 5R question that sits under all of them.
SUBJECT: the amber light standing at the current locus.
BEAT 1: Momentary thoughtlessness by employees (McLean v Tedman; Staveley Iron and Chemical Co v Jones).
BEAT 2: Agony of the moment (Avram v Gusakoski; Caterson v Commissioner for Railways).
BEAT 3: Rescuers (CLA s 56; ACT s 5) — with the honest note that the NSW sections protect the good samaritan from
  liability and the materials say no more about a rescuer's own carelessness.
BEAT 4: Underneath: s 5R — a reasonable person in the plaintiff's position, on what they knew or ought to have known.
CAMERA: 35mm-equivalent, dolly along the corridor, yaw ≤ 15° toward the locus, no cuts (base).
LIGHT: one amber point at the current locus; paper fill. SOUND: none.
REDUCED MOTION: the four loci as a numbered list (no WebGL).
BUDGET: own chunk ≤ 120 KB gz (three is a shared vendor chunk), draw calls < 20, 60 fps at 4× throttle.
Source: Tort Law Principles 3e p 478 flowchart; CLA ss 5R, 56, 57(1) (act-2002-022.pdf); concept
  laws2400-w12-contributory-negligence-employees-emergencies-rescuers (verify: true for the rescuer point).
*/
import { Palace } from '../bases/Palace';

export default function ContributoryNegligenceInContext() {
  return (
    <Palace
      label="A corridor with four frames: employees, the agony of the moment, rescuers, and the s 5R standard"
      terms={[
        { term: 'Contributory negligence', def: "The plaintiff's own lack of care for their own safety, reducing damages in part." },
        { term: 'Perceived emergency', def: 'The situation in which careless-looking action may be justified: the agony of the moment.' },
        { term: 'Good samaritan', def: 'CLA s 56: one who, in good faith and expecting no payment or reward, assists a person apparently injured or at risk.' },
      ]}
      loci={[
        { title: 'Momentary thoughtlessness by employees', body: "At work, inattention bred of familiarity and repetition, the urgency of the task, the plaintiff's preoccupation with the matter in hand and other prevailing conditions may be taken into account (McLean v Tedman; Staveley Iron and Chemical Co v Jones)." },
        { title: 'Agony of the moment', body: "Action that may seem to show a lack of reasonable care for the plaintiff's own safety may not amount to contributory negligence where it can be justified in a situation of perceived emergency (Avram v Gusakoski; Caterson v Commissioner for Railways)." },
        { title: 'Rescuers', body: 'Law in most jurisdictions now protects those who act in good faith and without recklessness (CLA s 56; ACT s 5). In NSW, s 57(1) frees a good samaritan from personal civil liability; the materials say no more about how a rescuer\'s own carelessness is weighed.' },
        { title: 'Underneath all three: s 5R', body: "Each is weighed against the s 5R standard: a reasonable person in the plaintiff's position, judged on what they knew or ought to have known at the time." },
      ]}
      check={{
        question: 'A passenger jumps from a bus she believes is about to crash and breaks her leg. Which argument does the flowchart give her against contributory negligence?',
        options: [
          { text: 'Rescuers: she acted in good faith to save herself', why: 'CLA s 56 is about coming to the assistance of another person who is apparently injured or at risk.' },
          { text: 'Agony of the moment: justified in a perceived emergency', correct: true, why: 'Careless-looking action may not be contributory negligence where it can be justified in a situation of perceived emergency.' },
          { text: 'Employees: urgency may be taken into account', why: 'That box applies in the employment context; she is a passenger, not an employee at work.' },
        ],
      }}
    />
  );
}
