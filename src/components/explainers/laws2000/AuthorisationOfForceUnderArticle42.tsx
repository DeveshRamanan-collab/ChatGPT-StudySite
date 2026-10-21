/*
SCENE: Authorising force under art 42 — express authorisations along a line, with Iraq 2003's claimed revival set apart
LENGTH: not pinned — a draggable Timeline (learner-paced), 8 events
BEATS: terms → art 42 and art 43 → Res 678 (1990) → Res 687 (1991) → Res 794 (1992) → Res 1441 (2002) →
  Iraq 2003 → Res 1816 (2008) → Res 1973 and 1975 (2011) → one check
INTENT: Fix that the Council authorises force through express Chapter VII words ("all necessary means") given to
  states or regional organisations, and that the 2003 claim to revive or imply authority was rejected by most states.
SUBJECT: the handle; each event's tag names its role (rule, express authorisation, ceasefire terms, no authorising
  words, claimed revival).
BEAT 1–8: drag, click or arrow to an event; its detail fades in beneath the track (base).
CAMERA: none (HTML track). LIGHT: none. SOUND: none.
REDUCED MOTION: the handle jumps instead of gliding (base); same controls, same captions.
BUDGET: < 6 KB gz, no WebGL.
Source: concept laws2000-w10-authorisation-of-force-under-article-42; Week 10 slides 24–31; UN Charter arts 2(4),
  42, 43, 53; Res 678, 687, 794, 940, 1101, 1441, 1816, 1973, 1975; US letter of 20 March 2003.
*/
import { Timeline } from '../bases/Timeline';

export default function AuthorisationOfForceUnderArticle42() {
  return (
    <Timeline
      label="Security Council authorisations of force, from Kuwait in 1990 to Libya in 2011, and the contested 2003 revival claim"
      terms={[
        { term: 'Art 42', def: 'The Council may take action by air, sea or land forces if art 41 measures would be or have proved inadequate.' },
        { term: '“All necessary means”', def: 'The express Chapter VII wording that authorises states to use force.' },
        { term: 'Revived or implied authorisation', def: 'A claim that force is authorised by reviving an old resolution, or by reading authority into one that does not give it.' },
      ]}
      events={[
        { title: 'Art 42 — and no UN army', tag: 'The rule', body: 'Art 42 is an exception to the prohibition on the use of force in art 2(4), a last resort, and relies on member states. Art 43 was never implemented, so the Council authorises coalitions of states — or regional organisations (art 53, Chapter VIII), e.g. ECOWAS in Liberia and Sierra Leone, NATO in Libya.' },
        { when: '1990', title: 'Res 678 — Kuwait', tag: 'Express authorisation', body: 'After Iraq’s illegal occupation of Kuwait, the Council, acting under Chapter VII, authorised member states co-operating with Kuwait “to use all necessary means” if Iraq did not comply by 15 January 1991 (Operation Desert Storm). Adopted 12–2 (Cuba, Yemen), China abstaining.' },
        { when: '1991', title: 'Res 687 — the ceasefire', tag: 'Ceasefire terms', body: 'Res 687 imposed obligations on Iraq — most importantly, extensive disarmament obligations — that were conditions of the ceasefire it established.' },
        { when: '1992', title: 'Res 794 — Somalia', tag: 'Humanitarian relief', body: 'In an internal conflict, “all necessary means to establish as soon as possible a secure environment for humanitarian relief operations in Somalia” (para 10). Haiti (Res 940, 1994) and Albania (Res 1101, 1997) followed.' },
        { when: '2002', title: 'Res 1441 — Iraq', tag: 'No authorising words', body: 'Acting under Chapter VII, the Council decided Iraq remained in material breach, gave it a “final opportunity” to comply, and recalled its warnings of “serious consequences” — but did not say “all necessary means”.' },
        { when: '2003', title: 'The invasion of Iraq', tag: 'Claimed revival — rejected', body: 'A US- and UK-led coalition, including Australia, claimed Iraq’s material breach of Res 687 revived the authority to use force under Res 678. Most other Council and UN members, and most legal scholars, rejected this. The UK’s Chilcot inquiry found not all peaceful options had been exhausted; Australia has held no inquiry.' },
        { when: '2008', title: 'Res 1816 — piracy', tag: 'Express authorisation', body: 'Authorisation for the repression of piracy off Somalia.' },
        { when: '2011', title: 'Res 1973 and 1975 — Libya, Côte d’Ivoire', tag: 'Protection of civilians', body: 'Protection of civilians in Libya (Res 1973, which also covered enforcement of a no-fly zone and embargos) and in Côte d’Ivoire (Res 1975).' },
      ]}
      check={{
        question: 'Res 1441 recalled warnings of “serious consequences” and gave Iraq a “final opportunity”. Did it authorise force?',
        options: [
          { text: 'Yes — any Chapter VII resolution threatening consequences authorises force', why: 'That is the implied-authorisation reasoning most states and scholars rejected; force needs express authorisation.' },
          { text: 'No — it contained no express authorising words such as “all necessary means”', correct: true, why: 'Res 678 shows what an express authorisation looks like; Res 1441 did not use such words, so the coalition argued revival instead.' },
          { text: 'Yes — the Chilcot inquiry confirmed it did', why: 'Chilcot found that not all peaceful options had been exhausted; it did not find an authorisation in Res 1441.' },
        ],
      }}
    />
  );
}
