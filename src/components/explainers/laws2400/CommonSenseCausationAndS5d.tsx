/*
SCENE: From common sense to s 5D — how factual causation was separated from the policy question
LENGTH: 6 events, learner-dragged (Timeline base)
INTENT: See that March v Stramare left causation to "common sense" (Mason CJ) against McHugh J's exclusive 'but for',
  that the Ipp Report objected that common sense hides policy choices, and that CLA s 5D(1) — as read in Adeels Palace
  and Strong v Woolworths — now asks a disciplined 'but for' / necessary condition question, with policy kept for
  scope of liability.
SUBJECT: the handle; each event's detail beneath the track.
EVENTS: March — Mason CJ (1991) → March — McHugh J (1991) → Ipp Report (no date given) → CLA s 5D(1) (2002) →
  Adeels Palace (2009) → Strong v Woolworths (2012).
CAMERA / LIGHT / SOUND: none (HTML track).
REDUCED MOTION: same controls, no glide (base).
BUDGET: < 8 KB gz; no WebGL. Dates only where the materials give them (case citations and the Act's title).
Source: concept laws2400-w10-common-sense-causation-and-s5d; Topic 10 Lecture 1, slides 9–21; Civil Liability Act
  2002 (NSW) s 5D(1), s 5E. Case cards march-v-stramare, adeels-palace-v-moubarak, strong-v-woolworths-ltd-tas-big-w.
*/
import { Timeline } from '../bases/Timeline';

export default function CommonSenseCausationAndS5d() {
  return (
    <Timeline
      label="From common sense to s 5D: how factual causation was separated from policy"
      terms={[
        { term: '‘But for’ test', def: 'Would the plaintiff have suffered the damage but for the defendant’s negligence?' },
        { term: 'Necessary condition', def: 'The CLA’s words for the same test: was the negligence necessary for the harm to occur? (s 5D(1)(a)).' },
        { term: 'Common sense', def: 'Mason CJ’s approach in March: causation decided by applying common sense to the facts of each case.' },
        { term: 'Scope of liability', def: 'The separate, normative question in s 5D(1)(b): should liability extend to the harm?' },
      ]}
      events={[
        {
          when: '1991', title: 'March v Stramare — Mason CJ', tag: 'High Court',
          body: 'A truck parked mid-road in the early morning; a drunk, speeding driver hit it. The defendant’s negligence was held a cause. Mason CJ: ‘but for’ was never the exclusive test — it fails where two or more acts are involved or an intervening event breaks the chain — and causation “must be determined by applying common sense to the facts of each particular case”.',
        },
        {
          when: '1991', title: 'March v Stramare — McHugh J', tag: 'High Court',
          body: '‘But for’ should be the exclusive test of causation, with a ‘scope of the risk’ test allowing policy factors to be employed as part of remoteness of damage. Same result, different path.',
        },
        {
          title: 'The Ipp Report', tag: 'review',
          body: 'Criticised ‘common sense’ causation: under what looks like a simple factual question, value judgments are made about who should be responsible and how far liability should extend. Mixing policy into factual causation made the law less transparent and less predictable.',
        },
        {
          when: '2002', title: 'Civil Liability Act 2002 (NSW) s 5D(1)', tag: 'NSW statute',
          body: 'Restructured and codified the common law (the cases are still important): (a) factual causation — the negligence was a necessary condition of the harm; (b) scope of liability. The plaintiff proves causation on the balance of probabilities (s 5E).',
        },
        {
          when: '2009', title: 'Adeels Palace v Moubarak', tag: 'High Court',
          body: 'In contrast to Mason CJ, s 5D(1) “treats factual causation and scope of liability as separate and distinct issues”, and factual causation is the ‘but for’ test. The evidence did not show security would have stopped the gunman’s re-entry: “might have made a difference” does not prove causation.',
        },
        {
          when: '2012', title: 'Strong v Woolworths', tag: 'High Court',
          body: 'Section 5D(1)(a) “is a statutory statement of the ‘but for’ test”. With no inspection system, the chip was more probably dropped in the long period before 12.10pm than in the last 20 minutes before the fall — so the missing system was a necessary condition, on the balance of probabilities.',
        },
      ]}
      check={{
        question: 'Under s 5D(1), where does a policy argument about who ought to bear the loss belong?',
        options: [
          { text: 'In factual causation, as part of applying common sense to the facts', why: 'That was Mason CJ’s approach in March, which the Ipp Report criticised; Adeels Palace says s 5D(1) separates the two questions.' },
          { text: 'In scope of liability (s 5D(1)(b)), after factual causation is decided on the evidence', correct: true, why: 'Factual causation is the ‘but for’ / necessary condition question on the evidence; whether and why responsibility should be imposed is the separate scope question (s 5D(1)(b), (4)).' },
          { text: 'Nowhere: the CLA removed policy from causation entirely', why: 'Policy remains — s 5D(4) asks whether and why responsibility should be imposed — it is simply kept out of the factual question.' },
        ],
      }}
    />
  );
}
