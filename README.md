# ChatGPT StudySite

A personal, static exam-revision site for LAWS2400 Torts, LAWS2000 Public International Law, LAWS2100
Jurisprudence and MGMT2094 Strategic Creativity and Innovation (exams 9–27 November 2026). No accounts, no
server: everything you do is stored in your browser (IndexedDB) and can be exported from **Settings → Your data**.

## Run it

```bash
npm ci
npm run dev        # http://localhost:4321
npm run build      # validate content → astro build → Pagefind search index (output: dist/)
npm run preview    # serve dist/ at http://localhost:4321
```

Checks: `npm test` (Vitest) · `npm run e2e` (Playwright; run `npm run build` first) · `npm run validate` ·
`npm run gate` (regression counts) · `npm run budget` (bundle budgets) · `npm run lh` (Lighthouse CI) ·
`node scripts/audit.mjs all` (content audit → reports/).

## Add a week

1. Put the week's files in `raw/<unit-folder>/week-NN/` (unit folders: `laws2400-torts`, `laws2000-pil`,
   `laws2100-juris`, `mgmt2094-sci`). Slides (PDF/PPTX), notes (MD/DOCX), transcripts and tutorial sheets all work.
2. In Claude Code run `/add-week <UNIT> <N>` (for example `/add-week LAWS2000 8`). It extracts the text, writes the
   week spec `content-src/<unit>-wNN.yaml` (notes, concepts, cases, authorities, ≥ 20 questions per concept,
   cards, pretest, audio recap), checks it with `node scripts/qa-week.mjs`, emits the content files with
   `node scripts/emit.mjs`, and runs `npm run validate` and the gate.
   The same run writes the week's study aids (`content-src/aids/<unit>-wNN.yaml`: the concept pages' "Ways in",
   decision flows, glossary terms, drills, visual practice, listen/viva) and, for new problem questions, their fact
   annotations; `npm run health` (or /content-health) shows any concept still missing aids.
3. Re-running on unchanged files changes nothing (content is stamped with a source hash). Changing one week only
   touches that week's files. A file you hand-correct should get `locked: true` so it is never regenerated.

Long (problem / essay) questions: `/generate-questions <UNIT> pq` writes `content-src/<unit>-pq.yaml`.
Explainers: `/build-explainer <concept-id>` (see `docs/plans/explainer-brief.md`).

## Audit

`node scripts/audit.mjs all` writes `reports/audit-<date>.md`: per unit, weeks ingested, question counts per
concept, answer-length balance, concepts without an explainer, and every item marked `verify: true` (an authority,
citation or holding that is not fully supported by your materials). Check those against your readings; correct the
file and set `locked: true`.

## Deploy the separate ChatGPT copy

The source is a copy of `DeveshRamanan-collab/study-site` at commit
`5737bd193c1d44b396a61c3e11a8eb3bac0aa21b`. That repository and the live site are read-only.
This repository targets the separate Worker `chatgpt-studysite`. The original repository and live
deployment remain outside its write scope. The included GitHub Actions run checks only.

A completed release is stored in `release-assets/` as a deterministic tar.gz split into parts of at
most 4 MiB, with checksums for the archive, every part and every built file. This keeps the originals,
source visuals and the tested site together without thousands of separate binary uploads.

During normal `npm ci` or `npm install`, `postinstall` runs `scripts/restore-release.mjs`. It verifies
the complete local release before restoring `dist/`, then seeds missing `public/source-corpus/` and
`public/source-originals/` directories for future source builds. Existing public source directories
are preserved. Corrupt or missing committed parts stop installation before an incomplete build is used.
An already restored build is checked against the file manifest and reused.

The existing Cloudflare settings can remain:

| Setting | Value |
| --- | --- |
| Root directory | `/` |
| Build command | None |
| Deploy command | `npx wrangler deploy` |
| Node version | `22` |

Automatic dependency installation and npm lifecycle scripts must be enabled. Do not set
`SKIP_DEPENDENCY_INSTALL=1` or `ignore-scripts` for this prebuilt route. Cloudflare's normal install
step restores the tested static files before Wrangler looks for `dist/`.
Wrangler is pinned in `devDependencies` and the lockfile, so `npx wrangler deploy` uses the checked
local version after installation.

For a normal source build, use Build command `npm run build`, Deploy command `npx wrangler deploy`.
Alternatively Deploy command `npm run deploy` builds first. Run `npm run deploy:check` for a build and
Wrangler dry-run without publication. Wrangler custom-build settings alone do not replace a Workers
Builds dashboard build command.

After changing source, build and complete the audit checks, then run `npm run release:pack` to freeze
that verified output. Commit the manifest and all release parts together. Do not package a partial
build. `npm run release:restore` requires a committed snapshot and performs the same local verification
as the installation hook. No release helper downloads files or uses a paid service.

References: [Cloudflare build configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
and [automatic dependency installation](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/).

## October 2026 exam rebuild

- `/exams/` and each unit’s `/exam/`: sourced exam rules, scope, rubrics, conflicts and continuous revision notes.
- `/cases/` and `/statutes/`: every original record plus audited Torts law-list dossiers, full provision text, filters and dual explanations.
- `/studio/`: twenty connected learning tools, including authored scenario variants, fact annotation drills, recall, source retrieval, rubric review, timed practice and measured A4 notes.
- `/plan/`: the saved Google Calendar preferred blocks and protected reserve time. No live sync or calendar writes.
- `/everything/` and global Jump: direct access to every route, topic and authority, with pinned and recent pages.
- Weekly pages open centred in continuous visual mode, with continuous text and optional topic navigation.
- Refresh/revisit returns home by default; Settings → Start turns this off. Custom cursor defaults off, and top-layer navigation retains a native pointer.
- Background uses a quiet local paper treatment. It needs no video, paid generation service or ongoing model credits.

The coverage page distinguishes list inclusion from verification. All original teaching records and supplied exam documents remain intact. Source gaps are flagged, not filled with invented details. Study tools use authored content and local retrieval; they do not claim to run Opus, an on-device LLM, or an automated legal grading system.

New studio notes, answers and self-ratings are browser-local. Use “Keep a copy of my studio work” in the studio to export or restore all studio drafts and logs. The existing Settings export covers the original IndexedDB learning store.

## Where things are

- `src/content/` — typed content collections (generated; see `docs/content-spec.md`).
- `content-src/` — the week specs the content is generated from.
- `src/components/` — islands (quiz, cards, dashboard, palette, explainers…); `src/lib/` — learning engine
  (criterion loop, picker, FSRS, selectors), motion, speech, annotations, backup.
- `docs/` — plan, prompts, SCENE briefs (`docs/scenes/`), agent briefs (`docs/plans/`).
- `STATE.md` — build ladder and log.
