/*
SCENE: The conditions of self-defence — a corridor walked in order: trigger, necessity, proportionality, its
  indicators, reporting
LENGTH: 5 loci; pinned 300vh on desktop (scroll walks), paced otherwise
BEATS: 5 (armed attack → necessity → proportionality → proportionality indicators → reporting and the Council)
INTENT: Fix the order of the self-defence analysis and the ICJ indicator that goes with each condition.
SUBJECT: the amber light standing at the current frame.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the locus. SOUND: none.
REDUCED MOTION: the five loci as a numbered list (no WebGL) (base).
BUDGET: own chunk < 5 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2000-w09-necessity-proportionality-and-reporting; Week 9 slides 17, 20, 21, 27; UN Charter art 51;
  Nicaragua [237]; Oil Platforms [77]; Armed Activities [147]. The duration/third-state factors and the inference from
  a failure to report are the lecturer's (transcripts), flagged verify on the concept card.
*/
import { Palace } from '../bases/Palace';

export default function NecessityProportionalityAndReporting() {
  return (
    <Palace
      label="The conditions of self-defence, walked in order: armed attack, necessity, proportionality, its indicators, reporting"
      terms={[
        { term: 'Necessity', def: 'No other means of halting the armed attack than force — self-defence as a last resort.' },
        { term: 'Proportionality', def: 'A response in measure with the attack, or with the aim of halting it — judged on the facts.' },
        { term: 'Temporal link', def: 'The time between the attack and the response — a long delay undermines necessity.' },
      ]}
      loci={[
        { title: '1 · The trigger: an armed attack', body: 'Self-defence is only permitted in response to an armed attack (art 51). Necessity and proportionality are not written in art 51; Nicaragua confirmed them as customary international law.' },
        { title: '2 · Necessity', body: 'The state must have no other means of halting the attack than force — if it can get the same result without force, there is no justification. Indicator: the temporal link. In Nicaragua [237] measures that took effect several months after the attack were not “undertaken in the light of necessity”.' },
        { title: '3 · Proportionality', body: 'Two approaches: (1) commensurate with the armed attack; or (2) measured against the broader effects of the attack, balanced against the purpose of halting or preventing further attack. The same means are not required.' },
        { title: '4 · Proportionality indicators', body: 'Destructive scope — the Court “cannot close its eyes to the scale of the whole operation” (Oil Platforms [77]). Geographical scope — taking airports and towns hundreds of kilometres from Uganda’s border was not proportionate (Armed Activities [147]). The lecturer added duration and effects on third states.' },
        { title: '5 · Reporting, and the Council', body: 'Measures “shall be immediately reported to the Security Council” and do not affect its authority to act at any time; the right lasts “until” the Council has taken the necessary measures. In Nicaragua a failure to report suggested the state did not believe it was acting in self-defence.' },
      ]}
      check={{
        question: 'State A suffers one missile strike, then waits four months, while talks continue and no attacks follow, before bombing State B’s ports. Which condition is A most likely to fail?',
        options: [
          { text: 'Necessity — the delay and the talks show other means were available', correct: true, why: 'As in Nicaragua [237], a response months after the attack, with other means available and no further attacks, was not taken in the light of necessity.' },
          { text: 'The armed attack — a single missile strike can never qualify', why: 'One attack can be an armed attack if its scale and effects are grave enough; the clearer problem here is necessity.' },
          { text: 'Reporting — A should have told the Council before the missile hit', why: 'Art 51 requires measures taken in self-defence to be reported immediately afterwards, not advance notice of the attack suffered.' },
        ],
      }}
    />
  );
}
