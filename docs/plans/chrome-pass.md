# Plan — chrome, navigation, theme and glass pass (branch `chrome-pass`)

Status: proposed, waiting for "go". One commit per numbered item; after each item, screenshots at 1440 and 390 in
light and dark, then a pause for review.

## What the code says now (read before planning)

| Area | File(s) | Current state |
|---|---|---|
| Cursor | `src/lib/cursor.ts`, `src/styles/components.css` (`.cursor*`) | `.cursor__follow` carries `transform: translate3d(x,y)` from the RAF **and** `.cursor.is-down .cursor__follow { scale: .9 }`. |
| Layout, nav, rail | `src/layouts/Layout.astro` | 12-col `.shell`; `.content` is always cols 2–8 (offset left, even with no rail); `.rail` is cols 10–12, sticky at `--s-8`, only on pages that fill `slot="rail"`. |
| TOC | `src/components/Minimap.tsx`, `.minimap*` CSS | Absolutely positioned marks placed by `at × trackH`. |
| Reading progress | `Layout.astro` `.read-progress` (top hairline), `.minimap__view` (vertical bar) | Both always on. |
| Theme | `src/styles/tokens.css`, inline script in `Layout.astro`, `SettingsPanel.tsx`, `Palette.tsx` | Dark tokens exist on `[data-theme="dark"]`. The inline script resolves "auto" to light/dark, so `data-theme` is never "auto". |
| Preferences | `src/lib/prefs.ts` (localStorage only), Dexie `settings` table, `studysite:motion` / `studysite:theme` keys | There is no Zustand settings store yet. Preferences are split across keys. |
| Motion dial | `src/components/MotionDial.astro` | Segmented pill. |
| Map | `src/components/hub/KnowledgeMap.tsx` | One unit per hub; no standalone page. |
| Hard-coded colours | `components.css` (9: card hover shadow, modal/palette scrims, cursor dot, ambient glow), `ThreeScene.tsx`, `intro.ts`, `index.astro` (grain SVG), `SettingsPanel`/`Palette` (theme-color meta) | To be audited in item 4. |

### Two bugs, causes already located (to be confirmed in Playwright before fixing)

- **Cursor jump:** the CSS individual `scale` property composes as `translate · rotate · scale · transform`. Scaling
  `.cursor__follow` by 0.9 therefore scales its `translate3d(x, y)` about the viewport origin: the ring moves to
  (0.9x, 0.9y), which is up to ~140px up and to the left on a 1440px screen. It then eases back over the 160ms scale
  transition while the lerp keeps writing x/y.
- **TOC stacking:** `Minimap` returns `null` until headings are measured, so on the first effect `track.current` is
  null and `trackH` stays 0. It is never re-measured. With `trackH = 0` every mark computes to a top of ≤ 0 (the
  "pull back from the bottom" pass goes negative), so every entry lands at the same y.

## Items

1. **Cursor ring by construction.**
   - Outer `.cursor-ring` and `.cursor-dot` carry only `translate3d` written by the one RAF (gsap.ticker).
   - Inner `.cursor-ring__shape` reads `--ring-size / --ring-scale / --ring-radius / --ring-fill`, transitioned with
     `--dur-micro --ease-out`. States (link 56px, text I-beam, drag, option square) only set those variables.
   - Press is an inner `scale(.9)` for `--dur-press`, released with `--ease-out`.
   - Playwright: log the computed transform on pointerdown before the fix (proves the cause). New test: pointerdown at
     (600,400) keeps the outer translate within 2px of its pre-click value on every frame for 300ms.

2. **Centred content, sticky collapsible rail.**
   - `<html data-rail="open|collapsed|none">`. Pages opt in to the rail with a `toc` prop on `Layout`: week, concept,
     case (its IRAC fields become the TOC), authority, styleguide. Everything else is `none`.
   - The pre-paint script sets the value from the stored preference: default open ≥ 1280px, collapsed below.
   - Grid: open → content cols 2–8, rail 10–12 (as now). Collapsed/none → one centred column 66ch wide (`--measure`).
   - Hub, dashboard, exam and compare keep their wide block (cols 2–11, already centred).
   - Components that are wider than 66ch today (80ch quiz long answers, tables) break out symmetrically with a
     `.breakout-wide` utility, so the prose edge stays centred.
   - The column shift is a FLIP: measure → switch attribute → `translateX(Δ)` → 0 over `--dur-panel --ease-drawer`,
     with the rail fading. Transform and opacity only. I'll measure it at 4× throttle; a View Transition is the
     fallback if FLIP drops frames.
   - Home: the Continue row, What next?, the 2×2 unit grid (cards keep their width) and the bottom actions all sit in
     the centred column.
   - New `Toc.tsx` replaces `Minimap`: a plain vertical `<ol>` of h2 (and h3 on week pages).
     - Sticky at `top: calc(var(--nav-h) + var(--s-6))`, with its own scroll when taller than the viewport.
     - "ON THIS PAGE" label in Inter small caps +0.08em.
     - IntersectionObserver marks the active entry with a 1px accent marker. This is the only accent element in that
       viewport unless something else is highlighted.
     - Set up on astro:page-load, disconnected on astro:before-swap.
   - Collapse tab: at the rail's left edge, chevron, 36px hit area, magnetic (joins the cursor's magnet set). `]`
     toggles it. Below 1024px the same tab opens the TOC as a popover.

3. **Scroll indicator.**
   - Remove the minimap's vertical view bar and the top reading-progress hairline from the default UI.
   - New setting "Reading progress line" (off) brings back one thin progress line on the rail edge.
   - Native scrollbar: `scrollbar-width: thin; scrollbar-color: var(--ink-3) transparent; scrollbar-gutter: stable`.
   - New setting "Hide scrollbar" (off) → `html[data-scrollbar="hidden"]`.

4. **Light / dark / auto.**
   - `<html data-theme="light|dark|auto">` stored as-is. `tokens.css`: dark values on `[data-theme="dark"]` and inside
     `@media (prefers-color-scheme: dark)` on `[data-theme="auto"]`. The one-block duplication is documented.
   - The pre-paint script is ~10 lines and reads the localStorage mirror.
   - `ThemeDial` pill (Light · Dark · Auto) beside the Motion pill, same visual language. Palette `>theme light|dark|auto`
     and a row in Settings.
   - Hard-coded colours go to tokens or `color-mix()` of tokens. The cursor dot stays paper-white on purpose: the
     difference blend needs it. It becomes a documented token.
   - A `studysite:theme` event is dispatched. The intro, `ThreeScene` (grain/vignette pass, amber bloom), the D3 map
     and SVG diagrams re-read tokens on that event and on astro:page-load.
   - During a switch only, `html.theme-switching` transitions colour properties over `--dur-ui` (no permanent colour
     transitions).

5. **Warm glass, switchable, with opacity control.**
   - `<html data-glass="on|off">`, **default on** (tell me if you'd rather default off).
   - `.glass` utility exactly as specified (colour-mixed `--paper-2`, blur + saturate, inset edge and specular,
     `--r-lg`). The optional refraction is an SVG `feDisplacementMap` on the specular pseudo-element only, gated by
     `@supports` and `data-motion="full"`.
   - Applied to: nav, hamburger sheet, rail, palette, popovers, toasts, the Continue/session pills, and unit and
     concept cards on hover/expanded. Prose stays opaque paper.
   - Opacity slider (0.2–0.9, step 0.05) in Settings and in a small "…" overflow beside the Theme/Motion pills. It
     writes `--glass-opacity` live.
   - Guards:
     - `@supports not (backdrop-filter)` → opaque `--paper-2` at 0.96.
     - `prefers-reduced-transparency` → glass off.
     - `html[data-scene]` (set while the intro plays or a pinned hub scene is active) → opaque.
     - At most three layers by design: nav + rail + one overlay. Cards are glass only on hover.
   - Checks:
     - 60fps at 4× on the week page with rail + nav + a popover open.
     - axe on every glass surface at opacity 0.2 in both themes. Text must be ≥ 4.5:1, otherwise text gets
       `--glass-text-backing`.

6. **`/map`.**
   - Whole-course D3 force graph (the hub map generalised): mastery shading, depends-on / contrasts-with edges,
     unit filter chips, click → concept.
   - Top nav Units · Dashboard · Plan · Map; hamburger; palette `>map`.
   - "Replay intro" (hamburger footer + Settings) clears the day flag and opens `/?intro=1`.

7. **Hamburger sheet.**
   - ≡ button before the wordmark: 36px, magnetic, `M` opens it.
   - Native `<dialog>` sheet from the left: glass, `--dur-panel --ease-drawer`, focus trap, Esc, 20% ink scrim.
   - Sections: Units / Now / Tools / Footer as specified.
     - Units: each unit row always shows week chips 1–12. Ingested weeks are links; the others are ink-3 non-links;
       due counts show in clay. This keeps any week at ≡ → week (2 clicks) on touch as well as desktop.
     - Expanding a unit row (click, or hover on desktop) adds topics plus Hub · Quiz me · Cards · Exam paper ·
       Question bank · Error log.
     - Tools' Question bank / Error log go to the current page's unit, otherwise the unit with the nearest exam.
   - Playwright walks ≡ → every ingested week from several pages, at both widths.

8. **Settings.**
   - One `usePrefs` Zustand store (`src/lib/prefs.ts`, rewritten). It is persisted to IndexedDB (Dexie `settings`,
     key `prefs`), with theme / glass / glass-opacity / rail / motion / scrollbar / progress mirrored to localStorage
     for the pre-paint script. Old `studysite:motion` / `studysite:theme` keys are migrated.
   - `/settings` rows: Theme, Motion, Glass (+ slider), Rail default, Reading progress line, Hide scrollbar,
     Cursor on/off, Replay intro, Companion, Noise, Deep dive, Export/Import, Save for offline.

9. **Styleguide + CLAUDE.md.**
   - Styleguide: glass at 0.3 / 0.55 / 0.8 in both themes, rail open/collapsed, hamburger, cursor states, theme pill.
   - CLAUDE.md: glass tokens and the three glass rules; `data-theme` / `data-glass` / `data-rail` (+ `data-scene`,
     `data-scrollbar`) and who owns each; the ≤ 2 clicks to any week rule; the cursor "outer element = translate only"
     rule.

**Gate:**
- The section-9 automated gate: validate, gate, build, test, e2e, screenshots, CLS/LCP, CDP traces.
- Plus: cursor click test; two-click test; Lighthouse ≥ 95 (desktop preset, as `lighthouserc.cjs` uses) on home and
  a week page in both themes with glass on; zero console errors on a full crawl; TOC fixed; a rail-open vs
  rail-collapsed screenshot diff showing the column recentred.
- Content untouched.

## Files

- **Edit:**
  - `src/styles/tokens.css`, `base.css`, `components.css`
  - `src/layouts/Layout.astro`, `src/lib/cursor.ts`, `src/lib/motion.ts` (theme carry, scene flag), `src/lib/prefs.ts`
  - `MotionDial.astro`, `SettingsPanel.tsx`, `Palette.tsx`, `ui/Popover.tsx`, `ui/Toaster.tsx`, `ConceptCard.astro`
  - `pages/index.astro` (layout, replay intro), `lib/intro.ts` (tokens, scene flag), `explainers/bases/ThreeScene.tsx`,
    `hub/KnowledgeMap.tsx`
  - `pages/[unit]/week/[n].astro`, `pages/[unit]/concept/[slug].astro`, `pages/cases/[slug].astro`,
    `pages/authorities/[slug].astro`, `pages/settings.astro`, `pages/styleguide.astro`
  - `CLAUDE.md`, `e2e/cursor.spec.ts`, `e2e/reading.spec.ts` (minimap → TOC)
- **New:**
  - `src/components/Toc.tsx`, `ThemeDial.astro`, `GlassControl.tsx`, `NavSheet.tsx`, `pages/map.astro`
  - `e2e/chrome.spec.ts` (rail, theme, glass, two-click walk), `e2e/axe-glass.spec.ts`
- **Removed:** `src/components/Minimap.tsx`.
- **New dev dependency:** `@axe-core/playwright` (npm), for the glass contrast check.

## New tokens

| Token | Light | Dark | Why |
|---|---|---|---|
| `--glass-opacity` | .55 | .55 | glass tint strength (slider writes it) |
| `--glass-blur` | 18px | 18px | backdrop blur |
| `--glass-saturate` | 140% | 140% | backdrop saturation |
| `--glass-edge` | `inset 0 0 0 1px var(--line)` | same | inside hairline |
| `--glass-specular` | `inset 0 1px 0 rgba(255,255,255,.35)` | `inset 0 1px 0 rgba(241,234,224,.08)` | top-edge highlight |
| `--glass-text-backing` | `color-mix(in oklab, var(--paper) 70%, transparent)` | same | only if axe needs it |
| `--nav-h` | 64px | 64px | sticky offsets for rail, sheet, anchors |
| `--rail-w` | 3 of 12 columns (as now), 18rem cap | same | rail width |
| `--cursor-ink` | #FBF7F0 | #FBF7F0 | dot/beam colour for the difference blend (constant on purpose) |
| `--scrim` | `color-mix(in oklab, var(--ink) 20%, transparent)` | same | sheet/modal scrim, replaces two hard-coded rgba |
