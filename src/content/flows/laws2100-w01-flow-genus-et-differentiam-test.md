---
source-hash: bc267c34de45b8ad
generator-version: aids-1
generated-at: "2026-10-16T15:54:28.036Z"
locked: false
unit: laws2100
week: laws2100-w01
title: Does a definition per genus et differentiam work for this term?
summary: Walks the triangle-and-elephant method step by step, then, where it fails (as Hart says it does for law), makes you choose between the impossibility claim and the better-definition claim.
start: n1
concepts:
  - laws2100-w01-definition-per-genus-et-differentiam
  - laws2100-w01-harts-project
sources:
  - Week 01 - Lecture Slides (slide 24)
  - Week 01 - Lecture Transcript (second half)
nodes:
  - id: n1
    kind: ask
    text: Can the thing be placed in a wider, well-understood kind (a genus)?
    note: "Triangle: rectilinear figure. Elephant: quadruped. For law, theorists such as Austin and Kelsen tried a broader category alongside games, social etiquette and religion."
    authorities:
      - hart-the-concept-of-law
    branches:
      - label: "Yes"
        to: n2
      - label: "No"
        to: n5
  - id: n2
    kind: ask
    text: Within that genus, are there features only this kind has (a differentia)?
    note: Three sides mark triangles off from other rectilinear figures; thick skin, tusks and trunk mark elephants off from other quadrupeds.
    branches:
      - label: "Yes"
        to: n3
      - label: "No"
        to: n5
  - id: n3
    kind: ask
    text: Do genus and differentia together capture all the essential properties?
    note: "Every triangle has three sides, and a four-sided figure is not a triangle: the definition takes in every member and excludes everything else."
    branches:
      - label: "Yes"
        to: n4
      - label: "No"
        to: n5
  - id: n4
    kind: end
    tone: met
    text: "The definition works: it translates the word into well-understood terms and locates the kind of thing within its wider family."
  - id: n5
    kind: step
    text: "The definition fails for this term. For law, this is Hart's claim: this type of definition does not work."
    note: "The lecture calls this a big claim that many disagree with: think it through rather than picking a team."
    concept: laws2100-w01-definition-per-genus-et-differentiam
    next: n6
  - id: n6
    kind: ask
    text: Which claim are you making about the failure?
    note: "The lecture separates two claims: that it is impossible to define the term this way, or that it may be possible but there are better definitions."
    branches:
      - label: It cannot be done at all
        to: n7
      - label: It can be done, but a better definition exists
        to: n8
  - id: n7
    kind: end
    tone: not-met
    text: Impossibility claim, Hart's stronger one. It needs an argument that no definition of this type can work, and the term must then be defined by another method.
  - id: n8
    kind: end
    tone: qualified
    exception: true
    text: Better-definition claim, the weaker one. It needs an argument comparing definitions, such as Hart's map of law's relations to coercion, morality and rules.
    concept: laws2100-w01-harts-project
verify: false
---
