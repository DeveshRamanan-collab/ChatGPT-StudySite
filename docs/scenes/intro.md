# SCENE brief — Intro film (home, first visit each day)

Self-approved (autonomous run, quieter option chosen). This brief is also the comment at the top of `src/components/intro/IntroFilm.tsx`.

- **SCENE**: Intro — "four units out of one point of light".
- **LENGTH**: 450vh pinned (desktop and mobile, motion = full only).
- **BEATS**: 4, one GSAP timeline scrubbed by ScrollTrigger (scrub: true, ease: none), tweening camera z, light intensity, node targets (a single `progress` uniform per beat) and caption opacity together.
- **INTENT**: Show that everything on the site is one connected body of knowledge that resolves into the four units you sit in November.
- **SUBJECT**: the amber point of light; it becomes the brightest node and then the cluster of the nearest exam.
- **BEAT 1 (0–20%)**: a single amber point on paper; the wordmark "StudySite" reveals by character (clip-path, 12ms stagger). Ease none (scrub). Caption: "Four units. One body of knowledge."
- **BEAT 2 (20–50%)**: thin ink orbit lines (Line2-like LineSegments at 60% ink) draw in by growing their draw range; ~120 nodes (2–4px sprites, soft radial alpha) fade in on the orbits; slow rotation (≤ 15°) and noise drift. Caption: "Every concept, case and statute you have studied."
- **BEAT 3 (50–80%)**: nodes drift to four clusters (one per unit, weighted by concept count); camera dollies in 15%; clusters brighten and the unit codes appear as HTML labels projected from the cluster centres. Caption: "Torts · International law · Jurisprudence · Strategic creativity".
- **BEAT 4 (80–100%)**: canvas fades to 0; the four HTML cluster labels Flip into the four real unit cards on the home page (900ms, --ease-out) — the only >500ms transition outside explainers. Caption fades.
- **CAMERA**: 35mm equivalent (fov 38°), z 12 → 10.2 (15% dolly), orbit ≤ ±15° following pointer ±3°; never cuts.
- **LIGHT**: one amber point light #E6873F at 0.6 → 1.0 during beat 3; paper-toned hemisphere fill; bloom only on amber (approximated with an additive halo sprite — cheaper than a bloom pass).
- **SOUND**: none.
- **CURSOR**: nodes within 200px of the pointer are pulled by a spring (stiffness 0.08, damping 0.85); the nearest brightens. Off on coarse pointers.
- **SKIP**: any key, a click on "Skip intro", or a wheel/touch past the end; shown once per Sydney day; never when motion ≠ full or prefers-reduced-motion (the page shows the unit cards directly).
- **REDUCED MOTION**: no canvas; final state (unit cards) with the three captions stacked above them as a single quiet line. PNG fallback not needed because the fallback is the real DOM.
- **BUDGET**: lazy chunk ≤ 480 KB gz including three (shared vendor chunk); 1 points draw call + 1 lines draw call + 1 halo sprite; DPR ≤ 1.5; pauses off-screen; ≥ 95% frames < 16.7ms at 4× CPU throttle.
