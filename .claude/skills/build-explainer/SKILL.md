---
name: build-explainer
description: Build the animated explainer, simulation or palace walk for one concept from its visual-brief, on the shared bases.
disable-model-invocation: true
argument-hint: "[concept-id] [go]"
arguments: [concept, approval]
---
Read the concept card src/content/concepts/$concept.md, its visual and visual-brief, and CLAUDE.md (design system, SCENE brief format, motion rules).

1. Write the SCENE brief as a comment block. The visual must expose the structure of the idea (limbs as gates, a calculus as a balance, sources as a stack, a spectrum as a slider, attribution as a chain). Nothing decorative. If $approval is not "go", show me the brief and wait.
2. Build src/components/explainers/<unit>/<ConceptPascal>.tsx on the matching base (ScrollExplainer | Simulation | Palace | ThreeScene): learner-paced, 20-second terms beat first, one signalled element at a time, ends with a one-question check that reports to the criterion tracker. Tokens only. Calm and off states per CLAUDE.md. Chunk ≤ 120 KB gz.
3. Append the concept id → component to src/components/explainers/manifest.json (append only; never rewrite other entries).
4. Playwright: screenshot at three scroll positions at 1440×900 and 390×844 in full and off; fix any overlap or unreadable caption.
5. npm run validate && npm run gate; commit "feat(explainer): $concept".
