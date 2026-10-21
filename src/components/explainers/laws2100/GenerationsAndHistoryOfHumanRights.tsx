/*
SCENE: A short history of human rights — national documents, the 1948 turn to universality, the covenants, and the
  three generations
LENGTH: not pinned — a Timeline (learner-paced; drag, click or arrow keys)
BEATS: 12 stops
INTENT: The slide's history runs from national documents (Magna Carta to the French Declaration) to the UDHR, which
  puts universality at the centre, and on to international covenants and conventions; the generations of rights
  build upon each other, and the third is the hardest to justify and implement.
SUBJECT: the handle and the stop it sits on; stops up to it drawn in ink.
BEAT 1–5: Magna Carta, English Bill of Rights, US Constitution, French Declaration, US Bill of Rights. BEAT 6: UDHR.
  BEAT 7–10: ICCPR, ICESCR, CEDAW, CRC. BEAT 11: UK Human Rights Act. BEAT 12: the third generation (undated).
CAMERA: none. LIGHT: none. SOUND: none.
REDUCED MOTION: same controls, no glide (base).
BUDGET: < 5 KB gz.
Source: concept laws2100-w09-generations-and-history-of-human-rights; authority universal-declaration-of-human-rights-1948.
  Generation tags appear only where an instrument's own title names that generation's rights.
*/
import { Timeline } from '../bases/Timeline';

export default function GenerationsAndHistoryOfHumanRights() {
  return (
    <Timeline
      label="A short history of human rights instruments, from Magna Carta to the UK Human Rights Act"
      terms={[
        { term: 'Generations of rights', def: '1st civil and political; 2nd social, economic and cultural; 3rd group and collective ("solidarity").' },
        { term: 'Universality', def: 'Rights belonging to each and every human being, not to members of one political community.' },
        { term: 'Recognition and observance', def: 'Recognising a right in a document comes first; observing it in practice is a separate step.' },
      ]}
      events={[
        { when: '1215', title: 'Magna Carta', tag: 'England', body: 'The first document on the slide\'s list. Have human rights always existed? The list dates legal recognition; whether rights existed earlier as moral rights is the foundational question.' },
        { when: '1689', title: 'English Bill of Rights', tag: 'England', body: 'A national document, recognising rights within one political community.' },
        { when: '1789', title: 'Constitution of the United States', tag: 'United States', body: 'Connected with the American Revolution and European modernity: a national document, even where it speaks of universal entitlements.' },
        { when: '1789', title: 'French Declaration of the Rights of Man and of the Citizen', tag: 'France', body: 'Connected with the French Revolution and the Enlightenment; like the US documents, focused on a particular political community.' },
        { when: '1791', title: 'US Bill of Rights', tag: 'United States', body: 'Rights recognised at the constitutional level, in a source high in the hierarchy of legal sources.' },
        { when: '1948', title: 'Universal Declaration of Human Rights', tag: 'international', body: 'After the Second World War: "a common standard of achievement for all peoples and all nations". A declaration without real binding force, but universality is now at the centre.' },
        { when: '1966', title: 'International Covenant on Civil and Political Rights', tag: '1st generation', body: 'Civil and political rights: the first generation, eg the right to life, equality before the law, freedom of speech and religion, a fair trial and voting.' },
        { when: '1966', title: 'International Covenant on Economic, Social and Cultural Rights', tag: '2nd generation', body: 'Social, economic and cultural rights: the second generation, eg just employment, food, housing and health care.' },
        { when: '1979', title: 'Convention on the Elimination of All Forms of Discrimination against Women', tag: 'international', body: 'Part of the recognition of human rights at the international level through covenants and treaties after 1948.' },
        { when: '1989', title: 'Convention on the Rights of the Child', tag: 'international', body: 'Another international instrument; Australia is among the parties to these treaties, but recognition there does not automatically become domestic law.' },
        { when: '1998', title: 'UK Human Rights Act', tag: 'United Kingdom', body: 'The UK has no codified constitution, so no bill of rights in the US or Canadian sense; it recognised rights by statute. Australian state acts try to replicate it.' },
        { title: 'The third generation', tag: '3rd generation', body: 'Group and collective ("solidarity") rights: self-determination, development, a healthy environment, natural resources, intergenerational equity. The generations build upon each other; the third is more problematic in authority, justification and implementation.' },
      ]}
      check={{
        question: 'What changes with the UDHR (1948), on the lecture\'s account?',
        options: [
          { text: 'Universality moves to the centre', correct: true, why: 'The earlier documents were national, focused on one political community; the UDHR puts universality at its centre.' },
          { text: 'Rights become binding in every state', why: 'The UDHR is mainly a political declaration without real binding force: "a common standard of achievement".' },
          { text: 'Third-generation rights are first recognised', why: 'Nothing in the materials says so; the generations build upon each other, and the third is the most recent.' },
        ],
      }}
    />
  );
}
