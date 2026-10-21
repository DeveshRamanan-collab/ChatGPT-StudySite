---
source-hash: 792e3999fedfdc08
generator-version: aids-1
generated-at: "2026-10-16T22:20:27.117Z"
locked: false
unit: laws2400
week: laws2400-w11
title: Is the harm too remote?
summary: "Follows the textbook flowchart Causation 6: reasonable foreseeability of the kind of harm (a real risk), extent and manner, and the egg-shell skull rule."
start: m1
concepts:
  - laws2400-w11-remoteness-kind-of-harm
  - laws2400-w11-egg-shell-skull-rule
  - laws2400-w11-scope-of-liability-decision-flow
sources:
  - Topic 11 Flowcharts (p 438)
  - Topic 5 Lecture 2 (slide 9)
nodes:
  - id: m1
    kind: step
    text: Remoteness concerns the extent of the defendant's liability for losses, determined by a reasonable foreseeability test.
    note: The leading case is The Wagon Mound (No 1). The court asks what damage was reasonably foreseeable as a consequence of the defendant's negligence.
    concept: laws2400-w11-remoteness-kind-of-harm
    cases:
      - overseas-tankship-v-morts-dock-the-wagon-mound-no-1
    next: m2
  - id: m2
    kind: step
    text: Identify the kind or type of harm the plaintiff suffered.
    note: See Tremain v Pike; Nader; Commonwealth v McLean; Metrolink Victoria v Inglis. For psychiatric harm, the class of injury, psychiatric illness, not the particular disorder (Tame).
    cases:
      - tremain-v-pike
      - nader-v-urban-transit-authority-of-new-south-wales
      - commonwealth-v-mclean
      - metrolink-victoria-pty-ltd-v-inglis
      - tame-v-new-south-wales
    next: m3
  - id: m3
    kind: ask
    text: "Was harm of that kind reasonably foreseeable as a consequence of the negligence: a real risk, not one brushed aside as far-fetched?"
    note: "'Reasonable foreseeability' means the same as at duty and breach (The Wagon Mound (No 2)). The kind of damage must be foreseeable as a possible outcome of the kind of carelessness charged (San Sebastian, citing Pusey)."
    cases:
      - overseas-tankship-v-miller-steamship-the-wagon-mound-no-2
      - mount-isa-mines-ltd-v-pusey
    branches:
      - label: "Yes"
        to: m4
      - label: "No"
        to: e-remote
  - id: m4
    kind: ask
    text: Does the defendant argue that the harm was worse, or happened differently, than could be foreseen?
    branches:
      - label: "Yes"
        to: m5
      - label: "No"
        to: m6
  - id: m5
    kind: step
    text: "Answer it: the extent of the harm and the precise manner of its occurrence need not be reasonably foreseeable."
    cases:
      - hughes-v-lord-advocate
      - jolley-v-sutton-london-borough-council
      - mount-isa-mines-ltd-v-pusey
      - gittani-stone-pty-ltd-v-pavkovic
      - waller-v-james
    next: m6
  - id: m6
    kind: ask
    text: Is the harm greater because of the plaintiff's own weaknesses, beliefs or reactions, or capacities and attributes?
    branches:
      - label: "Yes"
        to: m7
      - label: "No"
        to: e-within
  - id: m7
    kind: step
    text: "Apply the egg-shell skull rule: the defendant takes the plaintiff with all his weaknesses, beliefs and reactions, and his capacities and attributes, physical, social and economic."
    note: Nader v Urban Transit Authority of NSW; see Kavanagh v Akhtar. The rule applies to damages once liability is established; it does not create liability (Tame).
    exception: true
    concept: laws2400-w11-egg-shell-skull-rule
    cases:
      - nader-v-urban-transit-authority-of-new-south-wales
      - kavanagh-v-akhtar
    next: e-within
  - id: e-within
    kind: end
    tone: met
    text: "Not too remote: the harm is within the scope of liability, subject to any intervening act and the s 5D(4) question."
  - id: e-remote
    kind: end
    tone: not-met
    text: "Too remote: harm of that kind was not reasonably foreseeable, so it falls outside the scope of liability."
verify: false
---
