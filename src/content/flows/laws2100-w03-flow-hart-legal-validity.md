---
source-hash: fd36289da78bb23a
generator-version: aids-1
generated-at: "2026-10-16T16:10:48.394Z"
locked: false
unit: laws2100
week: laws2100-w03
title: Is this rule valid law, on Hart's account?
summary: Checks first that a legal system exists (Hart's two minimum conditions), then tests the rule against the rule of recognition, and shows what a rule's injustice does and does not change.
start: n1
concepts:
  - laws2100-w03-rule-of-recognition-and-validity
  - laws2100-w03-separation-of-law-and-morals
sources:
  - Week 03 - Lecture Slides (slides 8–11, 27)
  - Week 03 - Lecture Transcript (first half)
nodes:
  - id: n1
    kind: ask
    text: Is the rule you are testing the system's ultimate rule of recognition itself?
    note: Every other rule is tested against the rule of recognition; the ultimate rule is the test.
    concept: laws2100-w03-rule-of-recognition-and-validity
    branches:
      - label: "Yes"
        to: n2
      - label: "No"
        to: n3
  - id: n2
    kind: end
    tone: qualified
    exception: true
    text: "No question of validity arises: it is neither valid nor invalid, simply accepted as appropriate for use, like the standard metre bar (CL 109)."
  - id: n3
    kind: ask
    text: Are the rules that are valid by the system's ultimate criteria generally obeyed?
    note: "Hart's first minimum condition: the factual element Austin's theory already captured."
    authorities:
      - hart-the-concept-of-law
    branches:
      - label: "Yes"
        to: n4
      - label: "No"
        to: n10
  - id: n4
    kind: ask
    text: Do officials effectively accept the rules of recognition, change and adjudication as common public standards of official behaviour?
    note: The second condition, what Hart adds to Austin. Citizens need only obey; acceptance is required of officials.
    branches:
      - label: "Yes"
        to: n5
      - label: "No"
        to: n11
  - id: n5
    kind: step
    text: "A legal system exists. Now identify its rule of recognition from practice: how officials, above all judges, identify the primary rules."
    note: Criteria may refer to an authoritative text, legislative enactment, customary practice, declarations of specified persons, or past judicial decisions (CL 100). The rule is often implicit.
    cases:
      - r-miller-v-secretary-of-state-for-exiting-the-european-union
    next: n6
  - id: n6
    kind: ask
    text: Leaving its moral merits aside, does the rule pass all the tests the rule of recognition provides?
    note: A valid rule passes 'all the tests provided by the rule of recognition' and so is 'a rule of the system' (CL 103).
    branches:
      - label: "Yes"
        to: n7
      - label: "No"
        to: n12
  - id: n7
    kind: ask
    text: Is the objection to the rule that it is unjust or immoral?
    branches:
      - label: "No"
        to: n8
      - label: "Yes"
        to: n9
  - id: n8
    kind: end
    tone: met
    text: "Valid: the rule passes all the tests of the rule of recognition, so it is a rule of the system. Validity is membership."
  - id: n9
    kind: ask
    text: Does an express constitutional or legal provision make that moral standard one of the criteria of validity?
    note: Bentham never denied that moral principles might become part of a legal system through explicit legal provisions.
    concept: laws2100-w03-separation-of-law-and-morals
    authorities:
      - hart-positivism-and-the-separation-of-law-and-morals
    branches:
      - label: "Yes"
        to: n13
      - label: "No"
        to: n14
  - id: n10
    kind: end
    tone: not-met
    text: "No legal system exists: Hart's first minimum condition, general obedience to the valid rules, fails."
  - id: n11
    kind: end
    tone: not-met
    text: "No legal system exists: obedience alone is not enough. Officials must accept common secondary rules as public standards (CL 109)."
  - id: n12
    kind: end
    tone: not-met
    text: Not a valid rule of this system. However desirable it may be, a rule's moral merit does not make it law.
  - id: n13
    kind: end
    tone: not-met
    exception: true
    text: "The rule fails a criterion of the system: invalid because of the positive provision, not because immorality as such defeats law."
  - id: n14
    kind: end
    tone: met
    text: "Still valid law: its immorality alone does not show it is not law. It can be morally criticised, and one may have moral reason not to comply."
verify: false
---
