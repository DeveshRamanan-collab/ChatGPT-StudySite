/*
SCENE: Capacity to consent — a ladder climbed in order, ending at the parens patriae override
LENGTH: 5 events, learner-dragged (Timeline base)
INTENT: Work capacity in order: adults are presumed competent (rebuttable), a competent adult may refuse (Rossiter),
  a minor can be Gillick-competent (Gillick, approved in Marion's Case), and even then the court's parens patriae
  jurisdiction can override a refusal (X v SCHN).
SUBJECT: the handle; each rung's detail beneath the track.
EVENTS: presumption (no date) → Gillick (1986) → Marion's Case (1992) → Rossiter (2009) → X v SCHN (2013).
  Chronological, so the adult rung (Rossiter) sits after the minors' test; tags name each rung.
REDUCED MOTION: same controls, no glide.
BUDGET: < 12 KB gz. Dates only from the case citations.
Source: concept laws2400-w04-consent-capacity-and-minors; case cards brightwater-care-group-v-rossiter,
  gillick-v-west-norfolk-and-wisbech-area-health-authority, secretary-department-of-health-and-community-services-v-jwb,
  x-v-sydney-childrens-hospital-network.
*/
import { Timeline } from '../bases/Timeline';

export default function ConsentCapacityAndMinors() {
  return (
    <Timeline
      label="Capacity to consent: from the adult presumption to the parens patriae override"
      terms={[
        { term: 'Competent', def: 'Having sufficient understanding to comprehend the act and its consequences.' },
        { term: 'Gillick competence', def: '"Sufficient understanding and intelligence to enable her to understand fully what is proposed".' },
        { term: 'Parens patriae', def: 'The court’s protective jurisdiction, which extends to any person under 18.' },
      ]}
      events={[
        { title: 'Adults are presumed competent', tag: 'adult', body: 'Consent must come from a competent person. The presumption is rebuttable: an adult who is drunk, asleep or unconscious may lack capacity.' },
        { when: '1986', title: 'Gillick v West Norfolk and Wisbech AHA', tag: 'minor', body: 'A minor can consent once she has "sufficient understanding and intelligence to enable her to understand fully what is proposed".' },
        { when: '1992', title: 'Marion’s Case (Secretary, DHCS v JWB)', tag: 'minor', body: 'The High Court approved the Gillick test; a child’s disability does not itself defeat capacity; parents cannot consent to non-therapeutic treatment not in the child’s interests.' },
        { when: '2009', title: 'Brightwater Care Group v Rossiter', tag: 'adult', body: 'A paralysed but mentally competent patient directed staff to stop his nutrition and fluids. Continuing against his wishes would be trespass: autonomy and self-determination.' },
        { when: '2013', title: 'X v Sydney Children’s Hospital Network', tag: 'override', body: 'The parens patriae jurisdiction extends to anyone under 18 and overrode a competent 17-year-old’s refusal of a blood transfusion; s 174 of the Care and Protection Act did not exclude it absent clear words.' },
      ]}
      check={{
        question: 'A Gillick-competent 17-year-old refuses a life-saving transfusion. After X v SCHN, is that the final word?',
        options: [
          { text: 'Yes — a competent minor’s refusal binds like an adult’s', why: 'X v SCHN held a competent minor’s refusal can still be overridden.' },
          { text: 'No — the court’s parens patriae jurisdiction can override it', correct: true, why: 'The jurisdiction extends to anyone under 18, and s 174 did not exclude it absent clear words.' },
          { text: 'Only the parents can decide', why: 'Parental consent has limits (Marion’s Case), and in X the court overrode a refusal the parents supported.' },
        ],
      }}
    />
  );
}
