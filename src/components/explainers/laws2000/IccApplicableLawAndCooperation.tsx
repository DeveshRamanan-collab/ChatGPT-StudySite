/*
SCENE: ICC applicable law and cooperation — a stair of art 21 sources walked in order, a side landing for previous
  decisions, a human-rights handrail, then a courtyard of who must cooperate
LENGTH: 7 loci; pinned 420vh on desktop (scroll walks), paced otherwise (Palace base)
BEATS: 7 (first place → second place → failing that → previous decisions → human rights → States Parties →
  non-parties)
INTENT: Art 21 is an explicit ranking — the Statute and its instruments, then international law, then general
  principles from national laws — and the Court depends on states: Parties (arts 86, 88), art 12(3) declarants, and UN
  members bound by Chapter VII decisions (art 25 UN Charter).
SUBJECT: the amber light standing at the current room.
BEAT 1–7: one locus per step; caption beside the scene. Ease: frame-rate independent smoothing (base).
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the locus. SOUND: none.
REDUCED MOTION: the seven loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2000-w11-icc-applicable-law-and-cooperation; rome-statute-art-21, rome-statute-arts-86-88,
  rome-statute-art-12, un-charter-art-25 (Week 11 Lecture Slides, slides 45, 50–51).
*/
import { Palace } from '../bases/Palace';

export default function IccApplicableLawAndCooperation() {
  return (
    <Palace
      label="The ICC’s applicable law in ranked order, then who must cooperate with the Court"
      terms={[
        { term: 'Elements of Crimes', def: 'One of the ICC’s own instruments, applied in the first place with the Statute and the Rules.' },
        { term: 'General principles of law', def: 'Principles the Court derives from national laws of the world’s legal systems — the last resort in art 21.' },
        { term: 'Art 12(3) declaration', def: 'A non-party’s acceptance of jurisdiction over a crime, lodged with the Registrar.' },
        { term: 'Art 25, UN Charter', def: 'Members “agree to accept and carry out the decisions of the Security Council”.' },
      ]}
      loci={[
        { title: '1 · First place — the Statute and its instruments', body: 'The Rome Statute, the Elements of Crimes and the Court’s Rules of Procedure and Evidence.' },
        { title: '2 · Second place — international law', body: 'Where appropriate, applicable treaties and the principles and rules of international law, including the established principles of the international law of armed conflict.' },
        { title: '3 · Failing that — general principles', body: 'General principles of law derived by the Court from national laws of legal systems of the world — as appropriate, those of states that would normally exercise jurisdiction — if not inconsistent with the Statute, international law and internationally recognised norms and standards.' },
        { title: 'Side landing · previous decisions', body: 'The Court may apply principles and rules of law as interpreted in its previous decisions — may, not must.' },
        { title: 'Handrail · human rights', body: 'Applying and interpreting the law must be consistent with internationally recognised human rights, without adverse distinction on grounds such as gender, age, race, colour, language, religion or belief.' },
        { title: 'Courtyard · States Parties', body: 'Art 86: States Parties shall “cooperate fully with the Court in its investigation and prosecution of crimes”. Art 88: they must have procedures under national law for every form of cooperation in Part 9.' },
        { title: 'Courtyard · non-parties', body: 'A non-party that accepts jurisdiction by art 12(3) declaration “shall cooperate with the Court without any delay or exception”. A UN member is also bound by Security Council decisions under Chapter VII: members “agree to accept and carry out the decisions of the Security Council” (art 25 UN Charter).' },
      ]}
      check={{
        question: 'The Statute, the Elements of Crimes and the Rules are silent on a point, and no treaty or rule of international law answers it. Where does art 21 send the Court next?',
        options: [
          { text: 'To general principles of law derived from national laws', correct: true, why: '“Failing that”, art 21 directs the Court to general principles derived from national laws of legal systems of the world.' },
          { text: 'To its previous decisions, which bind it', why: 'Art 21 says the Court “may” apply its previous decisions; they are not binding, and they are not the third source.' },
          { text: 'To the Security Council for an interpretation', why: 'The Council can refer situations, but it has no role in filling gaps in the Court’s applicable law.' },
        ],
      }}
    />
  );
}
