---
source-hash: 487ae9e623fceb06
generator-version: aids-1
generated-at: "2026-10-16T16:00:02.572Z"
locked: false
unit: mgmt2094
week: mgmt2094-w02
title: Where am I in creative problem solving, and what comes next?
summary: Walks a problem through the three steps (identify, diverge, converge), using the quota method to decide whether you are ready to choose.
start: n1
concepts:
  - mgmt2094-w02-creative-problem-solving-steps
  - mgmt2094-w02-problem-identification
  - mgmt2094-w02-divergent-thinking
sources:
  - Marketing - Week 02 - Lecture Materials - Exploring the Creativity Problem (slides 2–7, 10)
nodes:
  - id: n1
    kind: ask
    text: "Have you identified an interesting problem: a found problem or an identified need, framed as a question?"
    note: Identifying meaningful problems, asking the right questions, is a key characteristic of creative people (slide 3). A brief such as 'make it better' is not yet a problem.
    branches:
      - label: "Yes"
        to: n3
      - label: No, only a vague brief
        to: n2
  - id: n2
    kind: step
    text: "Identify an interesting problem: find problems, identify needs."
    note: Listen to the unusual; identify consequences that make the subject essential (slide 4). Einstein would spend 59 minutes of an hour defining the problem.
    concept: mgmt2094-w02-problem-identification
    authorities:
      - mgmt2094-example-einstein-relativity
      - mgmt2094-example-decaux
    next: n3
  - id: n3
    kind: ask
    text: Do you already have at least three different options or alternate solutions?
    branches:
      - label: "Yes"
        to: n7
      - label: No, one idea or none
        to: n4
  - id: n4
    kind: step
    text: "Think divergently: apply the quota method."
    note: "Always ask at least three ideas from your team (& yourself!). A brainstorm can help: as many ideas as possible in a short time, without censorship, sorted afterwards."
    concept: mgmt2094-w02-divergent-thinking
    next: n5
  - id: n5
    kind: ask
    text: Did at least three good options emerge?
    branches:
      - label: "Yes"
        to: n7
      - label: "No"
        to: n6
  - id: n6
    kind: end
    tone: not-met
    text: "Not ready to choose: refuse to decide rather than settle for the first idea."
    note: "Slide 5: break the 'linear thinking' propensity to settle for the first idea, and logical reasoning that locks you in the first solution."
  - id: n7
    kind: step
    text: "Think convergently: identify benefits and risks, keep the best and eliminate wrong answers."
    note: Evaluation and selection; positive and critical thinking (slide 6). This is the analytical phase.
    concept: mgmt2094-w02-creative-problem-solving-steps
    next: n8
  - id: n8
    kind: end
    tone: met
    text: « The » solution, or a good solution, found.
    note: "The steps form a cycle (slide 7): great advances are usually the result of a long process that is a sum of intuitions and successive progresses, so expect to go round again."
verify: false
---
