/*
SCENE: Esanda and the salient features for negligent misstatement — a corridor of eight rooms
LENGTH: 8 loci; pinned 480vh on desktop (scroll walks), paced otherwise (Next/Back, ← →)
BEATS: 8 (one per locus, in the order of the lecture's closing list)
INTENT: Fix the lecture's list of salient features for negligent misstatement in order, and show where Esanda's
  claim against the auditors failed: reliance and assumption of responsibility.
SUBJECT: the amber light standing at the current room; the panel names the factor and how Esanda fared in it.
BEAT 1: Reasonable foreseeability — necessary, not sufficient (Dawson J).
BEAT 2: Indeterminacy of liability — one of McHugh J's policy reasons against auditors' liability.
BEAT 3: Category of relationship — an audit informs the company and its shareholders, not lenders.
BEAT 4: Defendant's knowledge — no request, no intention to induce Esanda to act.
BEAT 5: Reliance by the plaintiff — Esanda fails here: being one of a class who might rely was not enough.
BEAT 6: Assumption of responsibility — Esanda fails here: none assumed.
BEAT 7: Special skill — one of the Esanda factors; not a separate requirement (Shaddock).
BEAT 8: Vulnerability — not mentioned in Esanda as such, but part of the reasoning; not a rigid checklist.
CAMERA: 35mm-equivalent, dolly along the corridor, yaw ≤ 15° toward the locus, no cuts (Palace base).
LIGHT: one amber point (glow sprite) at the current locus; paper fill. SOUND: none.
REDUCED MOTION: the eight loci as a numbered list (no WebGL), via the base.
BUDGET: own chunk ≤ 120 KB gz (three is a shared vendor chunk), draw calls < 20, 60 fps at 4× throttle.
Source: concept card laws2400-w07-esanda-and-misstatement-salient-features; cases esanda-finance-corp-v-pmh,
  sullivan-v-moody; week spec §3 (Shaddock on special skill; vulnerability and Anchorage Capital). Esanda's holding
  is "no relationship of proximity"; the two "fails here" rooms follow the card's reasons (no request, no intention to
  induce, no assumption of responsibility; class-wide reliance not enough) and claim nothing further.
*/
import { Palace } from '../bases/Palace';

export default function EsandaAndMisstatementSalientFeatures() {
  return (
    <Palace
      label="A corridor of eight rooms: the salient features for negligent misstatement, walked by Esanda's claim"
      terms={[
        { term: 'Salient features', def: 'Factors the court weighs to decide whether a duty is owed; not a rigid checklist.' },
        { term: 'Proximity', def: 'The historical label for the special relationship; now treated as salient features (Sullivan v Moody).' },
        { term: 'Assumption of responsibility', def: 'An undertaking to take on a task from which acceptance of reasonable care can be inferred.' },
      ]}
      loci={[
        { title: '1 · Reasonable foreseeability', body: 'Always needed, never enough. Dawson J: “the mere foreseeability of harm does not, where the only harm is pure economic loss, give rise to a duty of care”. Esanda: foreseeability alone could not carry the claim.' },
        { title: '2 · Indeterminacy of liability', body: 'Liability to an undefined class. Esanda pleaded only that it was one of a class who might rely on audited accounts; McHugh J listed indeterminacy among his reasons against auditors’ liability.' },
        { title: '3 · Category of relationship', body: 'Auditor and a lender to the audited company. Esanda: an audit informs the company and its shareholders, not people lending to it.' },
        { title: '4 · Defendant’s knowledge', body: 'Of matters affecting the plaintiff, including reliance. Esanda: there was no request, and no intention by PMH to induce Esanda to act.' },
        { title: '5 · Reliance by the plaintiff', body: 'Was the reliance reasonable in the circumstances? Esanda fails here: being one of a class who might rely on audited accounts was not enough, and McHugh J noted how hard reliance is to prove.' },
        { title: '6 · Assumption of responsibility', body: 'With reliance, especially important in the cases. Esanda fails here: PMH assumed no responsibility to Esanda.' },
        { title: '7 · Special skill of the defendant', body: 'Special skill or knowledge is one of the Esanda factors — but there is no separate requirement that the speaker possess special skill (Shaddock).' },
        { title: '8 · Vulnerability of the plaintiff', body: 'Esanda does not mention it as such, but it is part of the reasoning. Then weigh the whole: foreseeability must be ticked; the rest are weighed, not counted.' },
      ]}
      check={{
        question: 'Esanda pleaded that it was one of a class who might reasonably rely on PMH’s audited accounts. Why was that not enough for a duty?',
        options: [
          { text: 'Esanda’s loss was not reasonably foreseeable', why: 'Tempting, but Dawson J’s point runs the other way: even foreseeable pure economic loss does not by itself give rise to a duty.' },
          { text: 'There was no request, no intention to induce Esanda to act, and no assumption of responsibility', correct: true, why: 'Without those, nothing established a relationship of proximity between Esanda and the auditors, so no duty arose.' },
          { text: 'Auditors can never owe a duty for pure economic loss', why: 'Tempting given McHugh J’s policy reasons, but the Court held that no circumstances established proximity on these facts.' },
        ],
      }}
    />
  );
}
