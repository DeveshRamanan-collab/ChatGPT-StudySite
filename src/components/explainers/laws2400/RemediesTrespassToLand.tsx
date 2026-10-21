/*
SCENE: Remedies for trespass to land — three branches, with the damages branch opened up
LENGTH: 5 loci; pinned 300vh on desktop (scroll walks), paced otherwise
BEATS: 5
INTENT: Once trespass is made out, answer remedy separately: pick from damages, injunction or self-help, and justify
  the measure of damages.
SUBJECT: the amber light standing at the current remedy.
BEAT 1: Damages — four kinds. BEAT 2: The measure — diminution vs reinstatement. BEAT 3: Consequential loss.
BEAT 4: Injunction — prohibitory or mandatory. BEAT 5: Self-help — reasonable force.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point. SOUND: none.
REDUCED MOTION: the loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2400-w03-remedies-trespass-to-land (week 3 notes).
*/
import { Palace } from '../bases/Palace';

export default function RemediesTrespassToLand() {
  return (
    <Palace
      label="Remedies for trespass to land: damages, injunction, self-help"
      terms={[
        { term: 'Nominal damages', def: 'A token award: available without proof of loss because trespass is actionable per se.' },
        { term: 'Diminution in value', def: 'The usual measure: how much less the property is worth.' },
        { term: 'Reinstatement', def: 'The cost of restoring the land — sometimes higher, ordered in suitable cases.' },
      ]}
      loci={[
        { title: 'Damages · four kinds', body: 'Nominal, compensatory, aggravated or exemplary. Deliberate or high-handed conduct supports aggravated or exemplary damages.' },
        { title: 'Damages · the measure', body: 'Put P where they would have been had no wrong been committed. Generally diminution in value; in suitable cases, the higher cost of reinstatement.' },
        { title: 'Damages · consequential loss', body: 'Injury or damage flowing from the trespass is recoverable too — for example, a psychiatric injury the trespass caused.' },
        { title: 'Injunction', body: 'Prohibitory or mandatory. An ongoing or repeated trespass suits an injunction better than damages alone.' },
        { title: 'Self-help', body: 'Eg physically removing a trespasser, using reasonable force.' },
      ]}
      check={{
        question: 'D walks across P’s paddock every morning, causing no loss. What is P’s best remedy?',
        options: [
          { text: 'Nothing: no loss, no claim', why: 'Trespass to land is actionable per se, so at least nominal damages are available.' },
          { text: 'An injunction, with nominal damages', correct: true, why: 'The trespass is repeated, which suits an injunction better than damages alone; nominal damages need no proof of loss.' },
          { text: 'Reinstatement damages', why: 'Nothing needs restoring; reinstatement measures the cost of repairing the land.' },
        ],
      }}
    />
  );
}
