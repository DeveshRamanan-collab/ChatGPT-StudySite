---
source-hash: 9024868a0e135b5d
generator-version: aids-1
generated-at: "2026-10-16T22:01:04.143Z"
locked: false
unit: mgmt2094
week: mgmt2094-w05
title: Running creative problem solving, stage by stage
summary: Takes a problem area through the six stages, marking where to diverge and where to converge, and where to redescribe the problem.
start: n1
concepts:
  - mgmt2094-w05-creative-problem-solving-process
  - mgmt2094-w05-defining-the-problem
sources:
  - Marketing - Week 05 - Lecture Materials - Creative Theories and Thinking (slides 15–21)
  - Marketing - Week 05 - Reading - How You Define Problems Determines How You Solve It (Markman 2017, pp 2–3)
nodes:
  - id: n1
    kind: step
    text: "Objective finding: diverge to list possible problem areas."
    note: Divergent thinking generates the list; convergence then picks the most relevant areas to explore.
    concept: mgmt2094-w05-creative-problem-solving-process
    next: n2
  - id: n2
    kind: ask
    text: "For this area: are we motivated to solve it, is it important, and is it urgent?"
    note: "Ownership, priority and critical nature: the questions that identify hits and hotspots."
    branches:
      - label: "Yes: it is a hit or hotspot"
        to: n4
      - label: "No"
        to: n3
  - id: n3
    kind: end
    tone: not-met
    text: Set this area aside; it is not one of the most relevant problem areas.
  - id: n4
    kind: step
    text: "Fact finding: gather the relevant information."
    note: It increases comprehension, helps new ideas, and may show the problem from a new perspective.
    next: n5
  - id: n5
    kind: step
    text: "Problem finding: use the hits to define the most productive problem."
    next: n6
  - id: n6
    kind: ask
    text: How many ways have you described the problem?
    branches:
      - label: One, naming the objects involved
        to: n7
      - label: Several, both specific and abstract
        to: n8
  - id: n7
    kind: step
    text: "Redescribe it: generalise the problem and leave out the usual components."
    note: "Markman: the statement of the problem is the cue to memory. 'Separate dirt from air' leaves the bag out and brings industrial cyclones to mind."
    concept: mgmt2094-w05-defining-the-problem
    authorities:
      - mgmt2094-example-dyson-bagless-vacuum
    exception: true
    next: n8
  - id: n8
    kind: step
    text: "Idea finding: diverge to generate many possible solutions."
    note: Use a variety of idea generation aids.
    next: n9
  - id: n9
    kind: step
    text: "Solution finding: converge on the ideas that can become workable solutions."
    next: n10
  - id: n10
    kind: step
    text: "Acceptance finding: diverge again on how to implement it."
    note: List obstacles and ways to overcome them, develop preventive actions and contingency plans, and generate an action plan.
    next: n11
  - id: n11
    kind: end
    tone: met
    text: Implement the chosen solution using the action plan.
verify: false
---
