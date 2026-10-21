# SCENE brief — Unit hub (/[unit])

Self-approved (autonomous run, quieter option chosen). Also the comment at the top of `src/components/hub/WeekTimeline.tsx`.

- **SCENE**: Unit hub — "the semester as a road to the exam".
- **LENGTH**: 300vh pinned on desktop (≥ 1100px, motion = full); mobile and calm/off: vertical list, unpinned.
- **BEATS**: 3, one timeline scrubbed by scroll (ease: none) translating the week track on x.
- **INTENT**: Show where each week stands and how far the exam is, so the next click is obvious.
- **SUBJECT**: the week card nearest the centre line (it lifts 2px and its ring is fully opaque; others 70%).
- **BEAT 1 (0–10%)**: week cards enter from scale 0.96 + opacity 0 with a 40ms stagger (once); each shows week number, topic, concept count, four-segment criterion ring (learned/secured counts) and last visit.
- **BEAT 2 (10–90%)**: the track scrolls horizontally (transform only) from week 1 to the last ingested week; a hairline progress bar under the track scales with progress.
- **BEAT 3 (90–100%)**: the exam card closes the timeline: exam date and a live countdown (days, hours) in mono.
- **CAMERA**: none (DOM). **LIGHT**: none. **SOUND**: none.
- **BELOW THE PIN**: start button (session ritual for this unit), due cards and re-tests, three weakest concepts, knowledge map (D3 force: nodes coloured by mastery on an ink ramp, edges from depends-on / contrasts-with / related, click → concept), backlinks live on concept pages.
- **REDUCED MOTION**: no pin; the week cards stack vertically (grid), exam card last; fades only.
- **BUDGET**: hub island ≤ 60 KB gz excluding d3-force (lazy, loaded when the map scrolls into view); no layout animation; 60 fps at 4× throttle during the scrub.
