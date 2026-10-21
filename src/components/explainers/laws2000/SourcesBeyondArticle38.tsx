/*
SCENE: Sources beyond Article 38 — four rooms off a corridor labelled "not in Article 38"
LENGTH: 4 loci; pinned 240vh on desktop (scroll walks), paced otherwise
BEATS: 4 (unilateral statements → jus cogens → decisions of international organisations → soft law)
INTENT: Fix the four categories and the different mechanism by which each binds or supplies evidence.
SUBJECT: the amber light standing at the current room.
BEAT 1: Eastern Greenland; Nuclear Tests. BEAT 2: VCLT art 53. BEAT 3: UN Charter art 25, Res 1373. BEAT 4: UDHR → ICCPR/ICESCR.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the locus. SOUND: none.
REDUCED MOTION: the four rooms as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2000-w02-sources-beyond-article-38; case cards legal-status-of-eastern-greenland-denmark-v-norway,
  nuclear-tests-cases-australia-v-france-new-zealand-v-france; VCLT art 53; UN Charter art 25.
*/
import { Palace } from '../bases/Palace';

export default function SourcesBeyondArticle38() {
  return (
    <Palace
      label="Four rooms not in Article 38: unilateral statements, jus cogens, decisions of international organisations, soft law"
      terms={[
        { term: 'Unilateral statement', def: 'A public declaration by which a state binds itself, with no offer, reciprocity or acceptance needed.' },
        { term: 'Jus cogens', def: 'A peremptory norm from which no derogation is permitted (VCLT art 53).' },
        { term: 'Soft law', def: 'Non-binding declarations, such as General Assembly resolutions, that can evidence practice or opinio juris.' },
      ]}
      loci={[
        { title: 'Room 1 · Unilateral statements', body: 'Eastern Greenland: Norway’s foreign minister’s promise not to make difficulties for Denmark’s claim became binding. Nuclear Tests: French statements of intent to cease atmospheric testing were a legal undertaking.' },
        { title: 'Room 2 · Jus cogens', body: 'Norms “accepted and recognized by the international community of States as a whole” with “no derogation” (VCLT art 53): genocide, crimes against humanity, aggression, slavery, torture, self-determination. A conflicting treaty rule is terminated.' },
        { title: 'Room 3 · Decisions of international organisations', body: 'Binding where the constitutive treaty says so: art 25 UN Charter makes Security Council decisions binding on members — e.g. Resolution 1373 on counter-terrorism, weeks after 9/11.' },
        { title: 'Room 4 · Soft law', body: 'Does not itself create obligations, but can evidence state practice or opinio juris, develop into custom, or prompt treaties: the Universal Declaration of Human Rights led to the ICCPR and ICESCR.' },
      ]}
      check={{
        question: 'A General Assembly resolution is cited as binding a state. What is the best response?',
        options: [
          { text: 'It binds every member, like a Security Council decision under art 25', why: 'Art 25 covers Security Council decisions; General Assembly resolutions are soft law.' },
          { text: 'It does not itself bind, but may evidence practice or opinio juris, or grow into custom or a treaty', correct: true, why: 'That is how soft law works: evidence and momentum, not an obligation of its own.' },
          { text: 'It is irrelevant because it is not listed in art 38', why: 'Art 38 is not exhaustive; soft law still shapes state behaviour.' },
        ],
      }}
    />
  );
}
