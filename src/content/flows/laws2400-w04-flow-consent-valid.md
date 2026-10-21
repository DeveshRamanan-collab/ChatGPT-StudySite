---
source-hash: 3c10a41cffc6713f
generator-version: aids-1
generated-at: "2026-10-16T15:54:29.954Z"
locked: false
unit: laws2400
week: laws2400-w04
title: Does consent defeat the claim?
summary: "Walks a consent defence through the slide order: onus, giving, voluntariness, capacity (including minors) and scope."
start: n1
concepts:
  - laws2400-w04-consent-defence-nature-and-onus
  - laws2400-w04-consent-validity-and-scope
  - laws2400-w04-consent-capacity-and-minors
sources:
  - Topic 4 Lecture 1 (slides 4–20)
nodes:
  - id: n1
    kind: step
    text: Note who bears the onus on consent.
    note: "Unsettled in Australia: McHugh J (Marion's Case, obiter) treats consent as a defence the defendant proves; Leeming JA (White v Johnston, obiter) as an element the plaintiff must negative."
    concept: laws2400-w04-consent-defence-nature-and-onus
    cases:
      - secretary-department-of-health-and-community-services-v-jwb
      - white-v-johnston
    next: n2
  - id: n2
    kind: ask
    text: Did the plaintiff consent, expressly or impliedly, to the conduct?
    note: Consent may be express or implied, for example by taking part in a contact sport.
    branches:
      - label: "Yes"
        to: n3
      - label: "No"
        to: e-none
  - id: n3
    kind: ask
    text: Was the consent given freely?
    note: The plaintiff needs sufficient knowledge of what she is consenting to, and there must be no force, fraud, threat or intimidation.
    concept: laws2400-w04-consent-validity-and-scope
    branches:
      - label: "Yes"
        to: n5
      - label: There was a misrepresentation
        to: n4
      - label: "No: force, threat or intimidation"
        to: e-vitiated
  - id: n4
    kind: ask
    text: Did the plaintiff still understand the "nature and character" of the interference?
    note: "Not every misrepresentation nullifies consent: a false inducement, such as a false promise of marriage, leaves consent valid if the nature and character of the act was understood."
    exception: true
    branches:
      - label: "Yes"
        to: n5
      - label: "No"
        to: e-vitiated
  - id: n5
    kind: ask
    text: Was the person who consented competent?
    note: Capacity means sufficient understanding to comprehend the act and its consequences. Adults are presumed competent, but not if, say, drunk, asleep or unconscious.
    concept: laws2400-w04-consent-capacity-and-minors
    cases:
      - brightwater-care-group-v-rossiter
    branches:
      - label: "Yes: a competent adult"
        to: n8
      - label: The person is a minor
        to: n6
      - label: "No: an adult lacking capacity"
        to: e-none
  - id: n6
    kind: ask
    text: Has the minor achieved sufficient understanding and intelligence to understand fully what is proposed?
    note: Gillick, approved by the High Court in Marion's Case. A disability does not of itself mean the child cannot consent.
    cases:
      - gillick-v-west-norfolk-and-wisbech-area-health-authority
      - secretary-department-of-health-and-community-services-v-jwb
    branches:
      - label: "Yes"
        to: n7
      - label: "No: a parent consented instead"
        to: n6b
  - id: n6b
    kind: ask
    text: Is the parent consenting to therapeutic treatment in the child's interests?
    note: Parents cannot consent to non-therapeutic treatment not in the child's interests, such as sterilisation (Marion's Case); statute may also require court consent.
    cases:
      - secretary-department-of-health-and-community-services-v-jwb
    branches:
      - label: "Yes"
        to: n8
      - label: "No: non-therapeutic"
        to: e-court
  - id: n7
    kind: ask
    text: Has a court exercised its parens patriae jurisdiction over the minor's decision?
    note: The jurisdiction extends to any person under 18, even a competent mature minor; s 174 of the Care and Protection Act does not exclude it (X v SCHN).
    exception: true
    cases:
      - x-v-sydney-childrens-hospital-network
    authorities:
      - children-and-young-persons-care-and-protection-act-1998-nsw-s174
    branches:
      - label: "No"
        to: n8
      - label: "Yes"
        to: e-court
  - id: n8
    kind: ask
    text: Did the defendant's conduct stay within the scope of what was agreed to?
    note: Consent relates to the specific act. Deliberate injury in breach of a game's rules (McNamara v Duncan) or unnecessary treatment on a large scale (Dean v Phung) exceeds it.
    cases:
      - mcnamara-v-duncan
      - dean-v-phung
    branches:
      - label: "Yes"
        to: e-valid
      - label: "No"
        to: e-exceeded
  - id: e-valid
    kind: end
    tone: met
    text: "Valid consent: the defence answers the claim."
  - id: e-exceeded
    kind: end
    tone: not-met
    text: "Conduct exceeded the consent: no defence for the excess."
  - id: e-vitiated
    kind: end
    tone: not-met
    text: "Consent vitiated: it was not freely given."
  - id: e-court
    kind: end
    tone: qualified
    text: The decision rests with the court, not the consent of parent or child.
  - id: e-none
    kind: end
    tone: not-met
    text: "No valid consent: consider necessity, self-defence or legal process."
verify: false
---
