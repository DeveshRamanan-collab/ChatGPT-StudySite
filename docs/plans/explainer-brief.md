# Agent brief: explainers for one week of concepts

Build one explainer per concept for the concept ids you are given, on the shared bases. Touch ONLY:
`src/components/explainers/<unit>/<ConceptPascal>.tsx` (new files) and ONE manifest part
`src/components/explainers/manifest-parts/<unit>-wNN.json` (a JSON object: concept id → { "module": "<unit>/<ConceptPascal>", "base": "simulation|scroll|palace|diagram|timeline" }).
Never edit manifest.json, the bases, content files or anything else. Never commit. Other agents work in parallel.

1. Read CLAUDE.md (design system, motion rules, research rules: "no concept without a visual", terms beat, one check
   question, simulation before text) and .claude/skills/build-explainer/SKILL.md. Study the models:
   src/components/explainers/laws2400/MentalHarmCla.tsx (Simulation), DutyEvolution.tsx (ScrollExplainer),
   NegligenceElementsPalace.tsx (Palace), TortAndOtherBranches.tsx (Diagram), PsychiatricHarmTimeline.tsx (Timeline),
   and the base APIs in src/components/explainers/bases/*.tsx. Reuse bases; do not write new base code.
2. For each concept: read src/content/concepts/<id>.md (body, `visual`, `visual-brief`, cases, authorities).
   Base: `visual: simulation` → Simulation (controls bound to a pure state → view function; verdict updates within
   200ms); `palace` → Palace; `timeline` → Timeline; `diagram` → Diagram; `explainer` → ScrollExplainer (or Diagram
   when the idea is a static structure). Expose structure (limbs as gates, a calculus as a balance, sources as a
   stack, a spectrum as a slider, attribution as a chain). Nothing decorative.
3. Content: only what the concept card, its week spec (content-src/<unit>-wNN.yaml) and linked case/authority cards
   say. Never invent law. Every explainer: SCENE brief comment at the top (format in CLAUDE.md), a terms beat
   (2–4 terms), and ends with ONE check question (the base's `check`) with a why on every option.
   Tokens only (CSS vars); Australian English; no layout-property animation; calm/off handled by the bases.
4. Write the manifest part. Then `npx astro check 2>&1 | grep -E "explainers/<unit>/|Result"` and fix every error in
   your files. (The lead merges parts into manifest.json, builds, and screenshots afterwards.)
5. Report in under 100 words: concept ids done → base, anything skipped and why.
