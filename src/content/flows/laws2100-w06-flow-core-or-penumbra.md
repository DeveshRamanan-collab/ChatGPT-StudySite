---
source-hash: 84edbceb797cd559
generator-version: aids-1
generated-at: "2026-10-16T22:13:51.311Z"
locked: false
unit: laws2100
week: laws2100-w06
title: Does the rule settle this case, or must the judge choose?
summary: "Hart's middle way from chapter VII: plain cases in a rule's core are settled by the rule; penumbral and gap cases call for a fresh choice. Shows where empirical rule-sceptics and Dworkin's Noble Dream depart from Hart."
start: n1
concepts:
  - laws2100-w06-open-texture-and-harts-middle-way
  - laws2100-w06-conceptual-and-empirical-rule-scepticism
  - laws2100-w06-nightmare-and-noble-dream
sources:
  - Week 06 - Lecture Slides (slides 7, 13–15, 18, 20–22)
  - Week 06 - Lecture Transcript (first half)
  - Week 06 - Lecture Transcript (second half)
nodes:
  - id: n1
    kind: ask
    text: Is the case a plain case, clearly within the rule's general term?
    note: "'If anything is a vehicle a motor-car is one' (CL 126). Without clear, familiar cases general terms would be useless."
    concept: laws2100-w06-open-texture-and-harts-middle-way
    authorities:
      - hart-the-concept-of-law
    branches:
      - label: "Yes"
        to: n2
      - label: "No"
        to: n4
  - id: n2
    kind: ask
    text: Does the rule, rather than the underlying facts, explain the decision?
    note: The empirical rule-sceptic says judges respond to the facts and pick doctrine afterwards. For Leiter, whether rules play a causal role is an empirical question.
    concept: laws2100-w06-conceptual-and-empirical-rule-scepticism
    branches:
      - label: "Yes: the rule guides (Hart)"
        to: n3
      - label: "No: the facts drive it"
        to: n10
  - id: n3
    kind: end
    tone: met
    text: "Core: the rule settles the case. Individuals can apply such rules to themselves without fresh official guidance (CL 130); not every legal question is a hard case."
  - id: n4
    kind: ask
    text: Why is it not a plain case?
    branches:
      - label: Reasons for and against applying the term
        to: n5
      - label: "The law is silent: a gap"
        to: n6
  - id: n5
    kind: step
    text: "Penumbra: the open texture of the general term means the language itself gives no answer."
    note: "'Uncertainty at the borderline is the price to be paid for the use of general classifying terms' (CL 128). Rule-makers are human beings, not gods: relatively ignorant of fact and of aim."
    next: n7
  - id: n6
    kind: step
    text: "A gap: no rule gives the judge a straightforward answer, so this is a hard case."
    next: n7
  - id: n7
    kind: ask
    text: Does the law nonetheless already contain an answer for the judge to find?
    note: "The Noble Dream: even where positive law is indeterminate, there is an existing law somewhere which judges can and should apply. For Hart, Dworkin is 'the noblest dreamer of all'."
    concept: laws2100-w06-nightmare-and-noble-dream
    authorities:
      - hart-the-nightmare-and-the-noble-dream
    branches:
      - label: Yes (Dworkin)
        to: n8
      - label: No (Hart)
        to: n9
  - id: n8
    kind: end
    tone: qualified
    exception: true
    text: "The Noble Dream: the judge never makes law, and principles yield one right answer. Hart treats this as an exaggeration, like the Nightmare at the other extreme."
  - id: n9
    kind: end
    tone: not-met
    text: "The rule does not settle it: a fresh choice between open alternatives must be made. Judicial discretion: judges make law here, but only in hard cases (CL 126–130)."
  - id: n10
    kind: end
    tone: qualified
    exception: true
    text: "Empirical rule-scepticism: rules may exist but do not cause decisions. Hart's arguments hit conceptual scepticism; Leiter says none answers this empirical claim."
    authorities:
      - leiter-legal-realism-and-legal-positivism-reconsidered
verify: false
---
