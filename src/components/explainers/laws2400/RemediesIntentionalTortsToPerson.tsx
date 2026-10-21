/*
SCENE: Remedies for intentional torts to the person — a ladder of damages
LENGTH: 5 loci; pinned 300vh on desktop (scroll walks), paced otherwise
BEATS: 5 (four rungs rising with how deliberate and egregious the conduct was, then the injunction beside them)
INTENT: Address remedy separately after liability and pick every head the facts engage; heads can be combined.
SUBJECT: the amber light standing at the current rung.
BEAT 1: Nominal. BEAT 2: Compensatory. BEAT 3: Aggravated. BEAT 4: Exemplary (punish, not compensate).
BEAT 5: Injunction for an anticipated tort.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the rung. SOUND: none.
REDUCED MOTION: the rungs as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2400-w02-remedies-intentional-torts-to-person (no cases or authorities linked).
*/
import { Palace } from '../bases/Palace';

export default function RemediesIntentionalTortsToPerson() {
  return (
    <Palace
      label="A ladder of damages: nominal, compensatory, aggravated, exemplary, then the injunction"
      terms={[
        { term: 'Actionable per se', def: 'Trespass to the person succeeds without proof of damage.' },
        { term: 'Aggravated damages', def: "Compensation for injured feelings caused by the defendant's deliberate, affronting conduct." },
        { term: 'Exemplary damages', def: 'An award to punish particularly egregious conduct, not to compensate.' },
      ]}
      loci={[
        { title: 'Rung 1 · Nominal', body: 'The tort is made out but no real harm was caused. Trespass to the person is actionable per se, so a token sum reflects that little was lost.' },
        { title: 'Rung 2 · Compensatory', body: 'The ordinary loss-based measure: put the plaintiff back where they would have been had the wrong not occurred.' },
        { title: 'Rung 3 · Aggravated', body: "Responds to deliberate conduct that itself affronted the plaintiff, over and above physical or economic loss — compensating injured feelings." },
        { title: 'Rung 4 · Exemplary', body: 'Different in purpose: punishes the defendant for particularly egregious conduct rather than compensating the plaintiff.' },
        { title: 'Beside the ladder · Injunction', body: 'A court may grant an injunction to prevent an anticipated tort, such as a threatened battery. More than one head of damages can be awarded together.' },
      ]}
      check={{
        question: 'Which head of damages aims to punish rather than compensate?',
        options: [
          { text: 'Aggravated damages', why: "Aggravated damages still compensate — for injured feelings from the defendant's affronting conduct." },
          { text: 'Exemplary damages', correct: true, why: 'Exemplary damages punish particularly egregious conduct; their purpose is not compensation.' },
          { text: 'Nominal damages', why: 'Nominal damages are a token sum where the tort is made out but little was lost.' },
        ],
      }}
    />
  );
}
