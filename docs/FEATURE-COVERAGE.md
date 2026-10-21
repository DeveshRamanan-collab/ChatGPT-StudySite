# Feature coverage — the 200-feature list (Oct 2026)

Status of every item in `Study_Website_200_Features.md` against this site. **Live** = built and deployed.
**Stand-in** = the offline version (the site has no server, accounts, paid services or live AI, by design).
**Partial** = part of the idea is there. **Not done** = feasible but not built. **N/A** = does not fit these four
units (no maths, finance or code) or needs a server. "Already" marks things the site had before this pass.

Where to find things: `/<unit>` hub buttons (Work the facts, Decision flows, Visual practice, Unit on one page …),
every concept page's **Ways in** section, `/<unit>/quiz` mode chips, `/insight`, `/glossary`, `/cases`, `/plan`,
`/settings`, and ⌘K for everything.

## Summary (17 Oct 2026)
- **136 Live**; 28 rows across all statuses are marked "already" (the site had them before this pass), the rest are new, **12 Stand-in**
  (offline versions of AI or server features), **25 Partial**, **5 Not done** (majority/dissent, visual version
  comparison, revision comparison, pinpoint links, transcript timestamps), **22 N/A** (maths, finance, code, group
  and live-AI features that do not fit these units or need a server).
- Content behind it: study aids for every concept of all four units (332 concepts), 67 decision flows, fact annotations
  for 48 problem questions; new material gets all of it automatically (see CLAUDE.md "Study aids and the 200-features
  pass").
- Verification: unit tests 27 files / 436 passing; full e2e on a production build 2,848 passed, 30 skipped, 2
  intermittent (drawer keyboard End on desktop, motion navigation on mobile — they also fail intermittently without
  this pass's selection toolbar, so likely timing); sampled alignment sweep 627 passed; Lighthouse (desktop, median): perf 0.96–1.00, accessibility 100 and CLS ≤ 0.01 on
  the 7 standard pages and 10 new ones (concept page 0.96, settings CLS 0).

| # | Feature | Status | Where |
| --- | --- | --- | --- |
| 1 | Coherent visual identity | Live (already) | tokens, Fraunces/Inter, one accent |
| 2 | Task-specific workspaces | Live (already) | notes, cards, quiz modes, exam sim, focus mode, /insight |
| 3 | Progressive explanations | Live | concept page → Ways in: one line → example → rule → sources |
| 4 | Semantic zoom | Partial | unit on one page → week sheet → concept → Ways in; knowledge map |
| 5 | Adjustable workspace | Partial (already) | Compare mode (side by side), contents rail toggle |
| 6 | Synchronised representations | Partial | concept page gathers text, explainer, aids, flows, cases, quiz |
| 7 | Contextual tools on selection | Live | selection toolbar: explain (glossary), make a card, quiz me, read aloud |
| 8 | Distraction control | Live | focus mode (already) + low stimulation |
| 9 | Customisable reading | Live | Settings → Text: size, spacing, width, contrast, density |
| 10 | Purposeful motion | Live (already) | motion dial Full/Calm/Off |
| 11 | Explorable concept maps | Live | /map and each unit hub (rows 51–60) |
| 12 | Branching decision trees | Live | /<unit>/flows, /<unit>/flow/… |
| 13 | What-if simulations | Live | Ways in → What if…; Drills; simulations (already) + Explore |
| 14 | Animated mechanisms | Live (already) | explainers |
| 15 | Equation playback | N/A | no calculations in these units |
| 16 | Interactive timelines | Live | /cases timeline; timeline explainers (already) |
| 17 | Comparison overlays | Partial | Compare mode, Tell apart, scenario pair in simulations |
| 18 | Evidence maps | Live | element-and-evidence board (problems); argument cards |
| 19 | Manipulable 3D models | Live (already) | palace explainers |
| 20 | Playable scenarios | Live | work the facts, decision-flow walk, drills |
| 21 | "Visualise this" buttons | Partial | "See it" on concept cards (already); selection toolbar |
| 22 | Paragraph-to-infographic | Stand-in | pre-built rule checklists and sheets (no live AI) |
| 23 | Chapter-to-poster | Live | /<unit>/sheet (unit on one page) |
| 24 | Procedure-to-flowchart | Live | decision flows built from the lecturer flowcharts |
| 25 | Rule-to-visual-checklist | Live | Ways in → rule checklist; week sheets |
| 26 | Illustrated terminology | Stand-in | /glossary with examples (no decorative imagery, by design) |
| 27 | Mapped visual analogies | Live | Ways in → analogy map |
| 28 | Analogy boundary markers | Live | Ways in → "Where it breaks" |
| 29 | Storyboard explanations | Live | Ways in → storyboard frames |
| 30 | Abstraction ladder | Live | Ways in ladder (one line / example / rule) |
| 31 | Animated whiteboard lessons | Live (already) | self-drawing diagram explainers |
| 32 | Moving reasoning highlights | Live | flow map highlights the path as you walk |
| 33 | Prediction pauses | Live | explainers pause before the last step; what-if predict-then-reveal |
| 34 | Correct-vs-incorrect | Partial | common mistakes side by side; option feedback (already) |
| 35 | Targeted transition replay | Live | explainer "Replay step" |
| 36 | Alternative-path playback | Partial | flow "trace back" shows every route to an outcome |
| 37 | Embedded animation questions | Live (already) | every explainer ends with a check |
| 38 | Fact-by-fact scenario playback | Live | /<unit>/problem/… spotting |
| 39 | Backward explanations | Live | flow trace back |
| 40 | Synchronised narration/labels | Live | read-aloud with highlighting (already); /<unit>/listen captions in step with speech |
| 41 | One-page topic infographics | Live | /<unit>/week/N/sheet |
| 42 | Visual case cards | Live (already) | case cards, three densities |
| 43 | Concept-family infographics | Partial | glossary, Tell apart |
| 44 | Essential vs background facts | Live | problem fact layers |
| 45 | Exception diagrams | Live | exception nodes in flows |
| 46 | Common-mistake infographics | Live | Ways in → common mistakes |
| 47 | Magnitude illustrations | N/A | |
| 48 | Argument summary cards | Live | Ways in → argument card |
| 49 | Visual revision sheets | Live | printable week sheets |
| 50 | Assessment process infographics | Partial (already) | hub "Your exam" panel |
| 51 | Diagram layers | Live | knowledge map: edge kinds and labels toggle independently |
| 52 | Relationship tracing | Live | map: trace from one concept to another, path in words |
| 53 | Neighbourhood inspection | Live | map: focus a concept, everything else dims |
| 54 | Connection summaries | Live | map: "Most connected" with why |
| 55 | Source-filtered maps | Live | map: week (and unit) filters |
| 56 | Visual prerequisite routes | Live | map: "What do I need first?" in order |
| 57 | Expandable diagram nodes | Live | map side panel; flow map notes open in place |
| 59 | Relationship status indicators | Live | map legend: line styles for prerequisite / often confused / related |
| 60 | Diagram reconstruction comparisons | Live | map: rebuild a week, then check missing / extra / correct links |
| 58 | Sketch-to-diagram | Stand-in | Visual practice → Draw it, then compare |
| 61 | Variable isolation | Live | simulation Explore → one fact at a time |
| 62 | Linked scenario comparisons | Live | Explore → compare two scenarios |
| 63 | Repeated simulated trials | N/A | no random models |
| 64 | Parameter sweeps | Live | Explore → one fact at a time |
| 65 | Contribution tracing | N/A | |
| 66 | Threshold explorers | Live | Explore marks the values that change the outcome |
| 67 | Stock-and-flow | N/A | |
| 68 | Event-order experiments | Partial | flows → order the steps |
| 69 | Visible model assumptions | Partial | Explore states the model's scope |
| 70 | Experiment notebooks | Live | Explore → notebook |
| 71 | Linked numbers and diagrams | Live (already) | simulations |
| 72 | Draggable graphs | Partial (already) | draggable timelines |
| 73–80 | Sampling, geometric proofs, waterfalls, formula tracing, unit checking, constraints, code visualisers | N/A (77 Live: Explore → two facts together) | |
| 81 | Illustrated fact patterns | Live | problem fact layers: parties |
| 82 | Action and mental-state overlays | Live | problem fact layers |
| 83 | Fact-change branches | Live | what-if items |
| 84 | Causation pathway diagrams | Live | causation decision flows (Torts weeks 10–11) |
| 85 | Element-and-evidence boards | Live | problem evidence board |
| 86 | Proof requirement displays | Live | "No support yet" on the board |
| 87 | Procedural route maps | Live | flows (e.g. ICJ jurisdiction, ICC) |
| 88 | Annotated statutory structures | Live | /statutes: provisions by instrument, cases, concepts, refers-to / referred-by |
| 89 | Timing requirement diagrams | Live | problem timing layer |
| 90 | Majority-and-dissent | Not done | sources rarely give dissents |
| 91 | Image-occlusion flashcards | Live (already) | |
| 92 | Drag-and-drop labelling | Live | Visual practice → Label parts |
| 93 | Sequence reconstruction | Live | flows → order the steps |
| 94 | Arrow reconstruction | Live | map: rebuild a week |
| 95 | Spot-the-error | Live | quiz → Drills |
| 96 | Predict-the-final-frame | Live | explainer prediction pause |
| 97 | Visual matching | Live | Visual practice → Match |
| 98 | Draw-your-answer | Live | Visual practice → Draw it |
| 99 | Visual classification | Live | Visual practice → Sort |
| 100 | Spatial memory routes | Live (already) | palace |
| 101 | Playback controls | Live | explainers: play/pause, speed, step, restart |
| 102 | Independent media controls | Live | listen: sound and captions toggle separately |
| 103 | Text equivalents | Live | explainer captions (already); every new visual has a list form |
| 104 | Keyboard operation | Live | |
| 105 | Multiple visual encodings | Live | ✓ ✕ ~ marks, line styles, labels |
| 106 | Low-stimulation mode | Live | Settings → Low stimulation |
| 107 | Mobile diagram layouts | Live | |
| 108 | Sharp diagram zoom | Live | SVG throughout |
| 109 | Static storyboard alternatives | Live | explainers → "See every step" |
| 110 | Branch-density controls | Live | flow walk shows one node at a time |
| 111 | Preferred visual formats | Live | format tracking per concept (explainer, flow, Ways in) |
| 112 | Performance-informed presentation | Live | /insight "What works for you" |
| 113 | Consistent semantic colours | Live (already) | |
| 114 | Reusable visual anchors | Partial | case chips, criterion rings |
| 115 | Saved visual states | Live | explainer ?step=N; flow ?view=; visual ?kind=&week= |
| 116 | Personal visual annotations | Partial | annotations (already), saved sketches |
| 117 | Visual exports | Live | print/PDF sheets; knowledge map SVG/PNG download |
| 118 | Offline visual lessons | Live | PWA + Settings "Save for offline" now lists the new pages |
| 119 | Visual version comparisons | Not done | |
| 120 | Visual correctness checks | Live | emitter checks flow graphs and verbatim facts |
| 121 | Course ingestion pipeline | Live (already) | |
| 122 | Handwritten-note interpretation | N/A | needs OCR/AI |
| 123 | Syllabus coverage map | Live | /content-health coverage map |
| 124 | Automatic glossary | Live | /glossary |
| 125 | Cross-document synthesis | Live | notes (already) + aids built from slides, transcripts, tutorials |
| 126 | Contradiction detection | Live | /content-health "Worth a look"; agents' conflict list |
| 127 | Version-aware content | Partial | stale-vs-raw report, source notes |
| 128 | Meaning-based search | Partial (already) | Pagefind + fuzzy palette |
| 129 | Exact source navigation | Partial | "Built from" lists file and slide |
| 130 | Update impact mapping | Live | /content-health "Needs regenerating" |
| 131 | Diagnostic onboarding | Live | quiz → Where am I? |
| 132 | Persistent learner model | Live | /insight |
| 133 | Misconception diagnosis | Live | wrong-answer panel |
| 134 | Prerequisite repair | Live | wrong-answer panel |
| 135 | Socratic questioning | Stand-in | Ways in → Work it out |
| 136 | Controlled hint ladder | Live | short and long answers |
| 137 | Teach-back mode | Stand-in | explain it back + coverage check |
| 138 | Alternative explanations | Live | Ways in |
| 139 | Counterexample challenges | Live | Ways in edge cases; Drills |
| 140 | Transfer exercises | Live | Ways in; Drills |
| 141 | Source-based question generation | Live (already) | 6,883 questions |
| 142 | Adaptive difficulty | Live | picker |
| 143 | Mistake-specific practice | Live | wrong-answer panel |
| 144 | Contrast exercises | Live | quiz → Tell apart |
| 145 | Spaced retrieval | Live (already) | FSRS |
| 146 | Mixed-topic practice | Live | interleaving (already), Tell apart |
| 147 | Confidence calibration | Live | dashboard (already), /insight |
| 148 | Timed exam simulations | Live (already) | |
| 149 | Rubric-based feedback | Live (already) | |
| 150 | Exam debriefs | Live | exam sim "Where the marks went" |
| 151 | Case explorer | Live | /cases |
| 152 | Pinpoint-linked explanations | Not done | pinpoints rarely in the materials |
| 153 | Authority relationship map | Live | /cases court lanes + taught-alongside |
| 154 | Ratio-and-obiter exercises | Stand-in | /<unit>/case-anatomy (facts / issue / held / ratio); ratio–obiter spectrum explainer (already) |
| 155 | Fact comparison | Live | case anatomy → Compare facts (word-overlap aid) |
| 156 | Doctrinal decision trees | Live | flows |
| 157 | Issue-spotting simulations | Live | work the facts |
| 158 | Argument adversary | Stand-in | /<unit>/argue (pre-written strongest objections from the sources) |
| 159 | IRAC feedback workspace | Live | long answers → "Before you mark" |
| 160 | Authority currency checks | Partial | verify list on /content-health (no external database offline) |
| 161 | Assessment brief interpreter | N/A | assessments are finished; exam details already from unit.yaml |
| 162 | Rubric evidence map | Partial (already) | rubric ticks + margin notes |
| 163 | Research question workshop | N/A | not an exam skill |
| 164 | Argument builder | Partial | answer-plan step (already), /argue |
| 165 | Claim support audit | Partial | IRAC check flags rules without authority |
| 166 | Source comparison matrix | Partial (already) | Compare mode |
| 167 | Annotated draft review | Partial (already) | rubric margin notes |
| 168 | Revision comparison | Not done | |
| 169 | Citation assistant | Partial (already) | AGLC4 copy on case cards |
| 170 | Submission readiness | N/A | no submissions left |
| 171 | Exam-backwards planner | Live (already) | /plan |
| 172 | Priority recommendations | Live (already) | What next, plan urgency |
| 173 | Automatic replanning | Live | /plan "Replanned" note |
| 174 | Time-budgeted sessions | Live | home → Start a session |
| 175 | Calendar-aware suggestions | Live | /plan → Your commitments (.ics) |
| 176 | Persistent session state | Live | Continue (already) + leave a note for next time |
| 177 | Misconception journal | Live | error log journal |
| 178 | Recall estimates | Live | /insight |
| 179 | Explainable progress | Live | /insight "Why?" |
| 180 | Energy-sensitive sessions | Live | home → Start a session |
| 181 | Conversational oral practice | Stand-in | /<unit>/listen → Viva (spoken questions, follow-up challenges, self-rated) |
| 182 | Mock vivas | Stand-in | same; concept pages link "Viva" |
| 183 | Lecture-to-study conversion | Live (already) | transcripts → notes |
| 184 | Transcript-linked navigation | Not done | transcripts carry no timestamps |
| 185 | Dictated thinking capture | Stand-in | open questions + macOS dictation in any field |
| 186 | Audio revision | Live | /<unit>/listen + audio recap (already) |
| 187 | Shared group workspaces | N/A | needs a server |
| 188 | Peer-teaching exercises | N/A | needs a server |
| 189 | Notion/Drive sync | Stand-in | Markdown exports (journal, today's pack), JSON backup (already) |
| 190 | Scheduled preparation | Stand-in | today's pack, rebuilt each day |
| 191 | Exercises on demand | Partial | drills and visual practice built from aids on demand |
| 192 | Tutor that uses the interface | N/A | no live AI |
| 193–195 | Async preparation, mid-task redirection, difficulty-sensitive reasoning | N/A | AI-system features |
| 196 | Independent checking pass | Live | emitter checks, validate, gate, content health |
| 197 | Inspectable evidence trails | Live | Ways in "Built from" + verify notes |
| 198 | Browser-based quality checks | Live | Playwright suites (+ production-preview config) |
| 199 | Offline study packs | Live | PWA, today's pack download |
| 200 | Controlled content maintenance | Live | git history, locked files, gate, content health |
