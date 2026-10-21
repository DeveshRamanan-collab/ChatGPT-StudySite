/*
SCENE: Austin's command — three rooms onto one hall
LENGTH: 5 loci; pinned 300vh on desktop (scroll walks), paced otherwise
BEATS: 5
INTENT: A command is built from three ideas (wish, evil, expression); in the hall command, duty and sanction stand
  chained together, and a law is a general command from a superior (might) to an inferior.
SUBJECT: the amber light standing at the current room.
BEAT 1: a wish. BEAT 2: an evil for non-compliance. BEAT 3: expression by words or signs.
BEAT 4: the hall — command, duty, sanction inseparable. BEAT 5: generality and superiority as might; positive law.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the room. SOUND: none.
REDUCED MOTION: the five loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2100-w02-austins-command-theory; authority austin-province-of-jurisprudence-determined.
*/
import { Palace } from '../bases/Palace';

export default function AustinsCommandTheory() {
  return (
    <Palace
      label="Austin's command: a wish, an evil, an expression, then command, duty and sanction chained together"
      terms={[
        { term: 'Command', def: 'For Austin, laws properly so called are a species of commands.' },
        { term: 'Sanction', def: 'The evil incurred for non-compliance; punishments are one class of sanctions.' },
        { term: 'Positive law', def: 'Law set by political superiors to political inferiors — "the matter of jurisprudence".' },
      ]}
      loci={[
        { title: 'Room 1 · A wish', body: 'A wish that another shall do or forbear from doing something.' },
        { title: 'Room 2 · An evil', body: 'An evil to be incurred if the other does not comply. Evil means sanction.' },
        { title: 'Room 3 · An expression', body: 'The wish is expressed by words or other signs.' },
        { title: 'The hall · Command, duty, sanction', body: 'Command and duty are correlative: wherever a duty lies, a command has been signified; wherever a command is signified, a duty is imposed. Command, duty and sanction are inseparably connected.' },
        { title: 'Above the hall · Superior and inferior', body: 'A law obliges generally to acts or forbearances of a class — not an individual command. Superiority means might: whoever can oblige another to comply is the superior.' },
      ]}
      check={{
        question: 'On Austin\'s account, what makes someone a superior?',
        options: [
          { text: 'Moral authority recognised by the inferior', why: 'Austin does not rest superiority on authority or recognition; that is closer to what Hart later says a command involves.' },
          { text: 'Might: the power to enforce compliance with a wish', correct: true, why: 'Superiority means might — whoever can oblige another to comply is the superior.' },
          { text: 'Being elected by the community', why: 'Nothing in the command theory turns on election; the relation is one of power.' },
        ],
      }}
    />
  );
}
