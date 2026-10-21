/*
SCENE: Theories about the role of tort law — five rooms
LENGTH: 5 loci; pinned 300vh on desktop (scroll walks), paced otherwise
BEATS: 5 (one per theory)
INTENT: Hold the five theories apart, each with the one challenge the materials pair with it.
SUBJECT: the amber light standing at the current room.
BEAT 1: Compensation — restore the claimant's position; hard in practice.
BEAT 2: Deterrence — liability shapes future conduct (Calabresi, Posner); insurance may blunt it.
BEAT 3: Corrective justice (Weinrib) — the wrongdoer corrects; ignores the wider system.
BEAT 4: Distributive justice — spread risk and loss (no-fault schemes, taxpayers).
BEAT 5: Feminist critique — the reasonable person, unpaid work, which harms count.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the room. SOUND: none.
REDUCED MOTION: the five rooms as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2400-w01-theories-of-tort-law.
*/
import { Palace } from '../bases/Palace';

export default function TheoriesOfTortLaw() {
  return (
    <Palace
      label="Five rooms, one per theory of tort law, each with its challenge"
      terms={[
        { term: 'Descriptive theory', def: 'An account of what tort law does.' },
        { term: 'Normative theory', def: 'An account of what tort law should do.' },
        { term: 'No-fault scheme', def: 'Compensation based on causation rather than fault.' },
      ]}
      loci={[
        { title: 'Compensation', body: 'Put the injured claimant back, so far as money can, where she would have been had the wrong not occurred. Challenge: hard in practice — miscalculated future earnings, high legal costs, lump-sum problems.' },
        { title: 'Deterrence', body: 'Liability makes defendants and others avoid the conduct in future; Calabresi and Posner argue tort allocates accident costs for the most efficient outcome. Challenge: insurance may blunt the deterrent effect.' },
        { title: 'Corrective justice', body: "Weinrib: whoever wrongly harms another's rights must correct it by paying compensation, resting on free human agency. Challenge: the individual focus ignores the other people and systems involved." },
        { title: 'Distributive justice', body: 'Tort as a system for spreading risk and loss through society — no-fault schemes, or losses passed to a public authority and then taxpayers.' },
        { title: 'Feminist critique', body: "Does tort law reflect women's experiences? It challenges the reasonable person standard, the valuation of unpaid work in damages, and which harms the law recognises." },
      ]}
      check={{
        question: 'Which challenge is paired with corrective justice?',
        options: [
          { text: 'Insurance may blunt its effect', why: 'That is the challenge to deterrence: insured defendants feel less pressure to change.' },
          { text: 'Its individual focus ignores the other people and systems involved in an incident', correct: true, why: 'Corrective justice looks at the wrongdoer and the victim, which can miss systemic causes, as in a medical negligence case.' },
          { text: 'Future earnings are hard to calculate', why: 'That is a practical difficulty with the compensatory function.' },
        ],
      }}
    />
  );
}
