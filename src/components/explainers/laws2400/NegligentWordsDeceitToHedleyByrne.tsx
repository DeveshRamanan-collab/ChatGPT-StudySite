/*
SCENE: Negligent words — from deceit to Hedley Byrne, then into Australia with Evatt
LENGTH: 6 events, learner-dragged (Timeline base)
INTENT: See the gap Derry v Peek left (deceit needs intent or recklessness, so a merely careless statement had no
  remedy), how Hedley Byrne filled it with a duty for negligent words where a special relationship exists (yet lost
  on its own disclaimer), and how Evatt restated the conditions in Australian terms.
SUBJECT: the handle; each event's detail beneath the track, its tag naming the condition that node adds.
EVENTS: deceit (no date) → Derry v Peek (1889) → Hedley Byrne: words are not acts (1964) → Hedley Byrne: special
  relationship (1964) → Hedley Byrne: the disclaimer on the facts (1964) → Evatt (1968).
CAMERA: none. LIGHT: none. SOUND: none.
REDUCED MOTION: same controls, no glide (base).
BUDGET: < 12 KB gz. Dates only from the citations. Derry v Peek and Evatt are verify: true — facts are given as the
  lecture tells them, and Evatt's final outcome is not stated because the materials do not give it.
Source: concept laws2400-w07-negligent-words-from-deceit-to-hedley-byrne; week 7 notes §3; case cards derry-v-peek,
  hedley-byrne-v-heller, mutual-life-and-citizens-assurance-co-v-evatt.
*/
import { Timeline } from '../bases/Timeline';

export default function NegligentWordsDeceitToHedleyByrne() {
  return (
    <Timeline
      label="Negligent words: from deceit to Hedley Byrne and Evatt"
      terms={[
        { term: 'Deceit', def: 'The tort for fraudulent misstatement — an intentional tort, outside this unit.' },
        { term: 'Negligent misstatement', def: 'Careless (not dishonest) words or advice that cause loss.' },
        { term: 'Special relationship', def: 'What Hedley Byrne requires before a duty of care for negligent words arises.' },
        { term: 'Disclaimer', def: 'Words excluding responsibility, such as a reference given “without responsibility”.' },
      ]}
      events={[
        {
          title: 'Deceit',
          tag: 'covers: fraudulent misstatement',
          body: 'At common law, the remedy for fraudulent misstatement was the tort of deceit. Deceit is an intentional tort; it does not use the duty of care framework and is not covered in this unit.',
        },
        {
          when: '1889',
          title: 'Derry v Peek',
          tag: 'adds: intent or recklessness',
          body: 'As the lecture tells it, a prospectus claimed a right to run steam trains; consent was refused and investors lost money. The House of Lords held that negligent misstatement will not suffice for deceit — it must be intentional or reckless. That left a gap: no remedy for a merely careless statement.',
        },
        {
          when: '1964',
          title: 'Hedley Byrne v Heller: words are not acts',
          tag: 'adds: no duty on social occasions',
          body: 'Lord Reid: “the law must treat negligent words differently from negligent acts”. Careful people give definite opinions on social or informal occasions without the care they would take if asked professionally, and “there can be no duty of care on such occasions”.',
        },
        {
          when: '1964',
          title: 'Hedley Byrne v Heller: a special relationship',
          tag: 'adds: a special relationship',
          body: 'Hedley Byrne created liability for negligent misstatement at common law: a duty of care for negligent words where a special relationship exists. Lord Reid: the inquirer trusts the speaker to take care, reasonably relies, and the speaker knows or ought to know of the reliance. Lord Morris: a person with special skill undertakes to apply it for another who relies on it.',
        },
        {
          when: '1964',
          title: 'Hedley Byrne v Heller: on the facts',
          tag: 'adds: a disclaimer can negate the duty',
          body: 'An advertising agency, about to extend credit to a client, asked its bank to obtain a credit reference. It came back favourable but “without responsibility”; the client collapsed and the agency lost money. The disclaimer meant no duty arose on the facts.',
        },
        {
          when: '1968',
          title: 'Mutual Life & Citizens’ Assurance Co v Evatt',
          tag: 'adds: serious matter · known trust · reasonable reliance',
          body: 'Advice about investing in an associated company proved wrong and caused loss. Barwick CJ (High Court): where information or advice is given on a serious matter, the speaker realises (or should realise) they are being trusted, and it is reasonable for the recipient to act on it, a duty of reasonable care follows. The materials do not give the final outcome.',
        },
      ]}
      check={{
        question: 'Before Hedley Byrne, why could someone misled by an honest but careless statement not recover?',
        options: [
          {
            text: 'Deceit needs an intentional or reckless misstatement, and there was no duty for negligent words',
            correct: true,
            why: 'Derry v Peek held that negligent misstatement will not suffice for deceit; the gap stayed open until Hedley Byrne created liability for negligent misstatement.',
          },
          {
            text: 'Deceit did not cover fraudulent misstatements',
            why: 'It did: deceit was the remedy for fraudulent misstatement. The gap was for statements that were merely careless.',
          },
          {
            text: 'There was no special relationship between the parties',
            why: 'The special relationship test came later, from Hedley Byrne in 1964; before it there was no duty for negligent words to test at all.',
          },
        ],
      }}
    />
  );
}
