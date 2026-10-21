/*
SCENE: State coercion vs individual freedom — five rooms, one per justifying principle, then the liberal verdict
LENGTH: 6 loci; pinned 360vh on desktop (scroll walks), paced otherwise
BEATS: 6
INTENT: Every use of public force against freedom needs a justification, and there are five on offer; each room
  answers "whose interest is protected?", and the last room shows why the liberal accepts the first two and rejects
  immorality without harm.
SUBJECT: the amber light standing at the current room.
BEAT 1: harm to others (Mill). BEAT 2: offence (Feinberg). BEAT 3: harm to self (legal paternalism). BEAT 4:
  immorality (legal moralism), splitting popular from critical morality. BEAT 5: general welfare. BEAT 6: the
  liberal verdict and the moral, not practical, limits of law.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point. SOUND: none.
REDUCED MOTION: the six loci as a numbered list (no WebGL).
BUDGET: own chunk < 5 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2100-w10-liberty-limiting-principles (slides 3, 16, 17; the negative/positive contrast is the
  lecture's).
*/
import { Palace } from '../bases/Palace';

export default function LibertyLimitingPrinciples() {
  return (
    <Palace
      label="Five principles used to justify state coercion, room by room"
      terms={[
        { term: 'Public force', def: 'Coercion by the state and its legal system, which limits individual freedom and so needs a justification.' },
        { term: 'Popular morality', def: 'What a society conventionally regards as morally right.' },
        { term: 'Critical morality', def: 'What is objectively (truly) right, whatever the majority thinks.' },
      ]}
      loci={[
        { title: 'Room 1 · Harm to others', body: 'The harm principle (John Stuart Mill): public force may be used to prevent harm to others. Whose interest? Someone other than the actor. The state may stop A assaulting B.' },
        { title: 'Room 2 · Offence', body: 'The offence principle (Joel Feinberg), a supplement to the harm principle: preventing serious offence to persons other than the actor, if the offence is universal and cannot reasonably be avoided.' },
        { title: 'Room 3 · Harm to self', body: 'Legal paternalism: coercion to protect individuals from self-inflicted harm, or to guide them toward their own good. Whose interest? The actor\'s own. Both the harm and offence principles reject it.' },
        { title: 'Room 4 · Immorality', body: 'Legal moralism: preventing immoral conduct even when there is no harm or offence. Two doors: popular morality (the majority\'s judgment, eg Devlin) or critical morality (what is objectively immoral, eg George).' },
        { title: 'Room 5 · General welfare', body: 'The welfare principle: intervention for the general welfare or public interest, eg compulsory taxation to support public projects some citizens may not benefit from. Is it paternalism? A matter of social justice?' },
        { title: 'The liberal verdict', body: 'From a liberal point of view, preventing immorality in the absence of harm is not a legitimate reason to limit our freedom. Practical limits on enforcement are mere facts; the real question is the moral limits of positive law.' },
      ]}
      check={{
        question: 'A law bans a private practice that harms no one because most people think it degrading. Which room is it in?',
        options: [
          { text: 'Room 4: legal moralism, popular version', correct: true, why: 'The only ground is the majority\'s judgment that the conduct is immoral or degrading: popular legal moralism, as in Devlin.' },
          { text: 'Room 2: the offence principle', why: 'A private practice can reasonably be avoided, so Feinberg\'s avoidability test fails; and the ground given is immorality, not offence.' },
          { text: 'Room 3: legal paternalism', why: 'Nothing protects the participants from harm to themselves; the law rests on the majority\'s moral view.' },
        ],
      }}
    />
  );
}
