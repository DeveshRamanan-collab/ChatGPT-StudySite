/*
SCENE: Hohfeld's four incidents — one corridor, four rooms for the positions inside "a right", then the two pairs,
  then negative and positive rights
LENGTH: 6 loci; pinned 360vh on desktop (scroll walks), paced otherwise
BEATS: 6
INTENT: "Right" is not one thing: a claim (another's duty to me), a privilege (no duty of mine not to act), a power
  (my ability to alter your position), an immunity (your inability to alter mine); claims and privileges turn on
  duties about φ, powers and immunities on the ability to alter positions.
SUBJECT: the amber light standing at the current room.
BEAT 1: claim. BEAT 2: privilege. BEAT 3: power. BEAT 4: immunity. BEAT 5: the two pairs. BEAT 6: freedom from /
  freedom to.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point. SOUND: none.
REDUCED MOTION: the six loci as a numbered list (no WebGL).
BUDGET: own chunk < 5 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2100-w09-hohfeldian-incidents; authority hohfeld-four-incidents. Examples are the week spec's
  own question scenarios.
*/
import { Palace } from '../bases/Palace';

export default function HohfeldianIncidents() {
  return (
    <Palace
      label="Hohfeld's four positions within a right, room by room"
      terms={[
        { term: 'Hohfeldian incident', def: 'One of four legal positions within the concept of a "right": claim, privilege, power, immunity.' },
        { term: 'φ (phi)', def: 'Any action the position is about: repaying a loan, walking on a beach.' },
        { term: 'Normative position', def: 'What someone must, may or can do in law: their duties, freedoms and powers.' },
      ]}
      loci={[
        { title: 'Room 1 · Claim', body: 'X has a claim-right against Y with respect to φ if and only if Y is under a duty to X to φ. Ana lends Ben $500: Ben is under a duty to Ana to repay, so Ana holds a claim against Ben.' },
        { title: 'Room 2 · Privilege', body: 'X has a privilege to φ if and only if X has no duty not to φ. No law forbids Chloe from walking on a public beach: she has a privilege to walk there. The definition is silent on whether others must let her.' },
        { title: 'Room 3 · Power', body: 'X has a (normative) power over Y if and only if X has the ability to alter (through volitional action) Y\'s normative position. By making a will, Dev changes what his executor must do.' },
        { title: 'Room 4 · Immunity', body: 'X holds an immunity against Y if and only if Y lacks the ability to alter X\'s Hohfeldian incidents. If Parliament cannot pass a law removing citizens\' freedom of religion, citizens hold an immunity against Parliament.' },
        { title: 'The two pairs', body: 'Claims and privileges are defined by duties about φ (another\'s duty owed to me; no duty of mine not to act). Powers and immunities are defined by the ability to alter positions (mine to change yours; yours lacking to change mine). When someone says "I have a right", ask which position, and against whom.' },
        { title: 'Negative and positive rights', body: 'Consider the difference between "freedom from" (eg freedom from torture) and "freedom to".' },
      ]}
      check={{
        question: 'A statute says local councils cannot revoke a licence. What does the licence-holder hold against the councils?',
        options: [
          { text: 'An immunity', correct: true, why: 'The councils lack the ability to alter the licence-holder\'s position: that is Hohfeld\'s immunity.' },
          { text: 'A claim-right', why: 'A claim needs a duty owed by the councils to the licence-holder to do something; the facts describe an inability to change the position, not a duty.' },
          { text: 'A privilege', why: 'A privilege is the absence of the holder\'s own duty not to act; it says nothing about whether others can change the position.' },
        ],
      }}
    />
  );
}
