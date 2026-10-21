/*
SCENE: Treaties in Australian law — a constitutional gateway, then five rooms of transformation
LENGTH: 6 loci; pinned 360vh on desktop (scroll walks), paced otherwise
BEATS: 6 (gateway ss 51(xxix), 61, 75(i) → new Act → amended Act → schedule → existing law → force of law)
INTENT: Ratification alone creates no justiciable rights; a treaty enters domestic law only through one of five
  legislative rooms, reached through the external affairs power.
SUBJECT: the amber light standing at the current room.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the locus. SOUND: none.
REDUCED MOTION: the six loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2000-w05-treaties-in-australian-law; Constitution ss 51(xxix), 61, 75(i); Tasmanian Dam;
  Koowarta; NSW v Commonwealth; Dietrich; Diplomatic Privileges and Immunities Act 1967 s 7.
*/
import { Palace } from '../bases/Palace';

export default function TreatiesInAustralianLaw() {
  return (
    <Palace
      label="Treaties in Australian law: the constitutional gateway and five ways of transforming a treaty"
      terms={[
        { term: 'External affairs power', def: 's 51(xxix): federal Parliament may legislate with respect to “external affairs”.' },
        { term: 'Direct effect', def: 'A treaty operating in domestic law without legislation — which treaties lack in Australia (bar a very limited class).' },
        { term: 'Transformation', def: 'Legislation that gives a treaty effect in domestic law.' },
      ]}
      loci={[
        { title: 'Gateway · ss 51(xxix), 61, 75(i)', body: 's 61 vests treaty-making in the executive; s 51(xxix) lets Parliament legislate on external affairs — treaty or custom obligations, relations with international persons, matters of “international concern” (Koowarta). In the Tasmanian Dam Case the World Heritage Convention supported stopping the dam; a mere “device” would probably not. s 75(i): High Court jurisdiction in “matters arising under a treaty”. Dietrich: ratifying the ICCPR “has no direct legal effect upon domestic law”.' },
        { title: '1 · New legislation', body: 'Parliament enacts a new Act implementing the treaty.' },
        { title: '2 · Amending existing legislation', body: 'The Criminal Code was amended for the Genocide Convention.' },
        { title: '3 · Scheduling it to an Act', body: 'The treaty text is scheduled to an Act — not full incorporation.' },
        { title: '4 · Relying on existing legislation', body: 'Existing law already gives effect to the obligation.' },
        { title: '5 · Giving it the force of law', body: 'Diplomatic Privileges and Immunities Act 1967 s 7.' },
      ]}
      check={{
        question: 'Australia has ratified a human rights treaty but passed no legislation on it. Can a person sue in an Australian court to enforce a right in it?',
        options: [
          { text: 'Yes — ratification gives the treaty direct effect', why: 'Treaties do not have direct effect in Australia, bar a very limited class such as certain peace and boundary treaties.' },
          { text: 'No — ratification alone creates no justiciable rights', correct: true, why: 'Dietrich: ratification has no direct legal effect on domestic law until legislation implements it.' },
          { text: 'Yes — s 75(i) makes every treaty enforceable in the High Court', why: 's 75(i) gives jurisdiction over matters arising under a treaty; it does not transform the treaty into domestic law.' },
        ],
      }}
    />
  );
}
