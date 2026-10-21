---
source-hash: b4dcc6fc80157eae
generator-version: aids-1
generated-at: "2026-10-16T15:59:58.212Z"
locked: false
unit: laws2000
week: laws2000-w02
title: Which source makes this rule binding on the state?
summary: Works through Article 38(1) in the order an answer takes it, then the sources Article 38 leaves out.
start: s1
concepts:
  - laws2000-w02-article-38-and-sources-of-international-law
  - laws2000-w02-treaties-as-a-source
  - laws2000-w02-general-principles-of-law
  - laws2000-w02-sources-beyond-article-38
sources:
  - Week 02 - Lecture Slides - Sources of International Law (slides 3–26)
  - Week 02 - Lecture Recording (Live) - Sources of International Law - Full Transcript (03:06–49:30)
  - Week 02 - Lecture Recording (Online) - Sources of International Law - Full Transcript (00:00–36:21)
nodes:
  - id: s1
    kind: ask
    text: Is there a treaty containing the rule to which the state is a party?
    note: The most direct evidence of an obligation; the document's label does not matter, only consent to be bound (VCLT art 2(1)(a)).
    concept: laws2000-w02-treaties-as-a-source
    authorities:
      - vclt-art-2-1-a
    branches:
      - label: "Yes"
        to: s2
      - label: "No"
        to: s3
  - id: s2
    kind: ask
    text: Does the treaty provision conflict with a peremptory norm (jus cogens)?
    note: No derogation is permitted (VCLT art 53); the lecture says a treaty containing even one such provision will be terminated.
    authorities:
      - vclt-art-53
    branches:
      - label: "Yes"
        to: s9
      - label: "No"
        to: s10
  - id: s3
    kind: ask
    text: Does the rule exist as customary international law binding this state?
    note: Practice plus opinio juris; check particular custom and persistent objection. ICJ decisions and scholars help show whether a rule is custom (Art 38(1)(d)).
    concept: laws2000-w02-customary-international-law-elements
    branches:
      - label: "Yes"
        to: s11
      - label: "No"
        to: s4
  - id: s4
    kind: ask
    text: Does a general principle of law resolve the issue?
    note: "Gap-fillers recognised across legal systems and usable internationally: equity, good faith, res judicata, impartiality of judges."
    concept: laws2000-w02-general-principles-of-law
    branches:
      - label: "Yes"
        to: s12
      - label: "No"
        to: s5
  - id: s5
    kind: ask
    text: Did the state make a public unilateral declaration showing an intention to be bound?
    note: No acceptance or reciprocity is required; form is not strict (Nuclear Tests; Eastern Greenland).
    cases:
      - nuclear-tests-cases-australia-v-france-new-zealand-v-france
      - legal-status-of-eastern-greenland-denmark-v-norway
    branches:
      - label: "Yes"
        to: s13
      - label: "No"
        to: s6
  - id: s6
    kind: ask
    text: Is there a binding decision of an international organisation the state belongs to?
    note: "Binding only where the constitutive treaty says so: Security Council decisions (Art 25 UN Charter); ICAO rules on flights over the high seas."
    authorities:
      - un-charter-art-25
    branches:
      - label: "Yes"
        to: s14
      - label: "No"
        to: s15
  - id: s9
    kind: end
    tone: not-met
    exception: true
    text: "Not binding: a treaty derogating from jus cogens will be terminated."
    authorities:
      - vclt-art-53
  - id: s10
    kind: end
    tone: met
    text: "Bound by the treaty: pacta sunt servanda — honour it and keep domestic law consistent."
  - id: s11
    kind: end
    tone: met
    text: Bound by custom — even if not party to a treaty containing the same rule.
    cases:
      - nicaragua-v-united-states-of-america
  - id: s12
    kind: end
    tone: met
    text: Resolved by a general principle of law (Art 38(1)(c)).
    authorities:
      - icj-statute-art-38-1
  - id: s13
    kind: end
    tone: met
    text: Bound by its own unilateral statement, on the basis of good faith.
    cases:
      - nuclear-tests-cases-australia-v-france-new-zealand-v-france
  - id: s14
    kind: end
    tone: met
    text: Bound by the organisation's decision, through consent given in its constitutive treaty.
    authorities:
      - un-charter-art-25
  - id: s15
    kind: end
    tone: qualified
    text: No binding source found. Soft law (e.g. General Assembly declarations) may still evidence practice or opinio juris or aid interpretation, but does not bind on its own.
verify: false
---
