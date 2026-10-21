/*
SCENE: Private conduct and art 8 — three decisions and a control threshold that drops, then is pushed back up
LENGTH: not pinned — a draggable Timeline (learner-paced), 5 events
BEATS: terms → art 8 text → Nicaragua 1986 → Tadić 1999 → Genocide 2007 → applying it → one check
INTENT: Fix that art 8 needs instructions for, or effective control of, the specific operation, and that the lower
  Tadić "overall control" test was rejected by the ICJ.
SUBJECT: the handle; the tag names the test in force at that point.
CAMERA: none (HTML track). LIGHT: none. SOUND: none.
REDUCED MOTION: the handle jumps instead of gliding (base); same controls.
BUDGET: < 5 KB gz.
Source: concept laws2000-w07-effective-control-and-private-conduct; ARSIWA art 8; Nicaragua para 115; Tadić para 117;
  Application of the Genocide Convention (2007).
*/
import { Timeline } from '../bases/Timeline';

export default function EffectiveControlAndPrivateConduct() {
  return (
    <Timeline
      label="The control threshold for attributing private conduct under art 8, from Nicaragua to the Genocide case"
      terms={[
        { term: 'Instructions', def: 'Very specific, relating to the very conduct in breach and to each operation.' },
        { term: 'Effective control', def: 'Control over each operation in which the breach occurred — a very high threshold.' },
        { term: 'Overall control', def: 'The less demanding Tadić test; rejected for state responsibility by the ICJ.' },
      ]}
      events={[
        { title: 'Art 8 ARSIWA', tag: 'The rule', body: 'A person or group’s conduct is an act of a state if it “is in fact acting on the instructions of, or under the direction or control of, that State in carrying out the conduct”. Instructions and direction or control were originally separate, now assessed together. The question came to the fore after 9/11: could Afghanistan be responsible for Al-Qaeda?' },
        { when: '1986', title: 'Nicaragua (ICJ)', tag: 'Effective control', body: 'US participation “even if preponderant or decisive” in financing, organising, training, supplying and equipping the contras, selecting targets and planning the whole operation was insufficient. The US would need “effective control of the military or paramilitary operations in the course of which the alleged violations were committed” (para 115).' },
        { when: '1999', title: 'Tadić (ICTY Appeals Chamber)', tag: 'Threshold drops: overall control', body: 'The degree of control may vary; a less demanding “overall control” test suits areas like international humanitarian and criminal law (para 117).' },
        { when: '2007', title: 'Application of the Genocide Convention (ICJ)', tag: 'Pushed back up: effective control', body: 'Overall control “stretches too far, almost to breaking point” the link between a state’s organs and its responsibility. Effective control, reflecting customary law in art 8, applies.' },
        { title: 'Applying it', tag: 'Exam use', body: 'List what the state did (funding, training, targeting), then ask whether it instructed or effectively controlled the specific operation in which the breach occurred.' },
      ]}
      check={{
        question: 'State S funds, trains and equips a rebel group and helps select its targets, but does not direct the operation in which civilians are killed. Is the killing attributable to S under art 8?',
        options: [
          { text: 'Yes — S has overall control of the group', why: 'Overall control (Tadić) was rejected by the ICJ in the Genocide case as stretching the link too far.' },
          { text: 'No — S lacked effective control of that specific operation', correct: true, why: 'Nicaragua: even preponderant or decisive participation in funding, training and targeting is insufficient without effective control of the operation.' },
          { text: 'Yes — funding and training are general instructions', why: 'Instructions must be very specific, relating to the very conduct in breach, not general and vague.' },
        ],
      }}
    />
  );
}
