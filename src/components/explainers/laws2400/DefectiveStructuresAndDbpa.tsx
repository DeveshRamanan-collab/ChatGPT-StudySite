/*
SCENE: Defective structures — Bryan v Maloney, Woolcock, then the Design and Building Practitioners Act 2020 (NSW)
LENGTH: 5 events, learner-dragged (Timeline base)
INTENT: Latent defects that only cut a building's value are pure economic loss; the common law gave a later
  homeowner a duty (Bryan) but not a commercial buyer that could protect itself (Woolcock); in NSW the DBPA s 37 now
  owes the duty to every subsequent owner, so the vulnerability question never has to be asked.
SUBJECT: the handle; each event's tag carries the vulnerability marker — vulnerable (Bryan), not vulnerable
  (Woolcock), bypassed (s 37).
EVENTS: latent defects (no date) → Bryan v Maloney (1995) → Woolcock (2004) → DBPA s 37 (2020) → DBPA ss 36, 39–40
  (2020, paraphrase).
CAMERA: none. LIGHT: none. SOUND: none.
REDUCED MOTION: same controls, no glide (base).
BUDGET: < 12 KB gz. Dates only from the citations and the Act's title. s 37 is quoted from the authority card; ss 36
  and 39–40 are verify: true slide paraphrases, so the event says so and quotes nothing.
Source: concept laws2400-w07-defective-structures-and-the-dbpa; week 7 notes §5; case cards bryan-v-maloney,
  woolcock-street-investments-pty-ltd-v-cdg-pty-ltd; authority cards design-and-building-practitioners-act-2020-nsw-s37,
  -s36, -ss39-40.
*/
import { Timeline } from '../bases/Timeline';

export default function DefectiveStructuresAndDbpa() {
  return (
    <Timeline
      label="Defective structures: from Bryan v Maloney and Woolcock to the Design and Building Practitioners Act"
      terms={[
        { term: 'Latent defect', def: 'A defect not identifiable until years later, often found by a later owner.' },
        { term: 'Subsequent owner', def: 'Someone who buys the building after the owner it was built for.' },
        { term: 'Vulnerability', def: 'Being unable to protect yourself, for example through inspections or insurance.' },
        { term: 'Construction work', def: 'Under DBPA s 36: building work, and also designs, building products and supervision.' },
      ]}
      events={[
        {
          title: 'Latent defects',
          tag: 'contract or tort?',
          body: 'Parties can deal with obvious defects by contract; tort comes in for latent defects, found perhaps after the building has been sold three or four times. A defect causing physical injury makes the builder or architect generally liable to anyone foreseeably injured; a defect that only diminishes the value of the property has been viewed as pure economic loss.',
        },
        {
          when: '1995',
          title: 'Bryan v Maloney',
          tag: 'High Court · house · vulnerable → duty',
          body: 'A builder built a house with defective foundations; Mrs Maloney, the third owner since construction, found cracks in the walls. Duty owed to a subsequent purchaser to take reasonable care in building a house. The Court used the proximity principle and distinguished dwellings: a homeowner is thought more vulnerable and less sophisticated than a commercial party.',
        },
        {
          when: '2004',
          title: 'Woolcock Street Investments v CDG',
          tag: 'High Court · commercial · not vulnerable → no duty',
          body: 'CDG designed a commercial complex; an owner refused to pay for a geotechnical inspection, so none was done. Woolcock bought from the original owners and the building settled. No duty: no reliance or assumption of responsibility, and Woolcock was not vulnerable — a commercial buyer could have protected itself through due diligence, inspections or insurance.',
        },
        {
          when: '2020',
          title: 'Design and Building Practitioners Act 2020 (NSW) s 37',
          tag: 'NSW statute · vulnerability bypassed',
          body: 'A person who carries out construction work “has a duty to exercise reasonable care to avoid economic loss caused by defects”, owed “to each owner of the land … and to each subsequent owner”, with damages “as if the duty were a duty established by the common law”. In NSW, start here: no common law duty needs to be established.',
        },
        {
          when: '2020',
          title: 'DBPA ss 36, 39 and 40',
          tag: 'NSW statute · paraphrase of the lecture slides',
          body: 'Paraphrased from the lecture slides, not the Act’s words. Section 36 defines “construction work” broadly: besides building work, it includes preparing designs, manufacturing or supplying building products, and supervising, coordinating or project-managing building work. The s 37 duty is non-delegable (s 39) and cannot be contracted out (s 40).',
        },
      ]}
      check={{
        question: 'In NSW, a later owner sues a builder for economic loss from a latent defect. Where should the answer start?',
        options: [
          {
            text: 'Bryan v Maloney: show a common law duty to a vulnerable homeowner',
            why: 'Bryan is the common law route, but in NSW the DBPA means no common law duty needs to be established.',
          },
          {
            text: 'DBPA s 37: a statutory duty owed to each subsequent owner',
            correct: true,
            why: 'Section 37 owes the duty to each owner and each subsequent owner, with damages as if at common law, so start with s 37.',
          },
          {
            text: 'Woolcock: later owners are never owed a duty',
            why: 'Woolcock turned on a commercial buyer that could have protected itself; Bryan found a duty to a later homeowner.',
          },
        ],
      }}
    />
  );
}
