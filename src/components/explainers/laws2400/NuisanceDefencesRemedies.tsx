/*
SCENE: Nuisance — two menus, defences then remedies
LENGTH: 6 loci; pinned 360vh on desktop (scroll walks), paced otherwise
BEATS: 6 (four defences on the walk in, then the remedies)
INTENT: After the elements, check each defence in turn — "came to the nuisance" is the trap that fails — then
  choose a remedy, preferring an injunction for ongoing interference.
SUBJECT: the amber light at the current menu item.
BEAT 1: Prescriptive right (> 20 years). BEAT 2: Plaintiff's conduct or consent (not "came to the nuisance").
BEAT 3: Statutory authorisation. BEAT 4: Contributory negligence. BEAT 5: Damages (foreseeable type).
BEAT 6: Injunction, then abatement as cautious self-help.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point. SOUND: none.
REDUCED MOTION: the loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2400-w03-nuisance-defences-remedies (week 3 notes).
*/
import { Palace } from '../bases/Palace';

export default function NuisanceDefencesRemedies() {
  return (
    <Palace
      label="Nuisance: four defences, then three remedies"
      terms={[
        { term: 'Prescriptive right', def: 'A right to continue an interference that has gone on for more than 20 years.' },
        { term: 'Came to the nuisance', def: 'Moving in next to an existing activity — no defence.' },
        { term: 'Abatement', def: 'Self-help: the plaintiff removes the nuisance without going to court.' },
      ]}
      loci={[
        { title: 'Defence 1 · Prescriptive right', body: 'A right to continue the interference, which must have continued for more than 20 years.' },
        { title: 'Defence 2 · Plaintiff’s conduct or consent', body: 'The most commonly pleaded defence. But it is no defence that the plaintiff "came to the nuisance" by moving in next to an existing activity.' },
        { title: 'Defence 3 · Statutory authorisation', body: 'Available only if the authorised activity could not have been carried out without committing the nuisance.' },
        { title: 'Defence 4 · Contributory negligence', body: 'May also be pleaded to a nuisance claim.' },
        { title: 'Remedy · Damages', body: 'Damage to the land, financial loss (lost trade, falling property value) and loss of subjective enjoyment — but the type of harm must have been reasonably foreseeable.' },
        { title: 'Remedy · Injunction, then abatement', body: 'An injunction where damages are inadequate; likely recurrence is key. Abatement is cautious, last-resort self-help using only reasonable methods.' },
      ]}
      check={{
        question: 'P buys a house beside a long-running piggery and sues in nuisance. D pleads that P "came to the nuisance". Does it work?',
        options: [
          { text: 'Yes — P chose to move in', why: 'Coming to the nuisance is expressly no defence.' },
          { text: 'No — coming to the nuisance is not a defence', correct: true, why: 'It is the common trap answer; D should look instead to, say, a prescriptive right if the interference has run more than 20 years.' },
          { text: 'Yes, if P consented in writing', why: 'Consent is a separate defence; moving in next door is not consent.' },
        ],
      }}
    />
  );
}
