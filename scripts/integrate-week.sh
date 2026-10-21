#!/bin/zsh
# Usage: scripts/integrate-week.sh <week-id> — after a week's builder finishes: merge its explainer manifest part, re-run
# qa, validate and the ADD_WEEK gate, prove re-emit is a no-op, register its explainer briefs, emit its study aids
# (content-src/aids/<week>.yaml) and refresh the content-health report. Then:
# npm run build && npm run preview (another terminal) → node scripts/render-check.mjs <week-id> → scripts/commit-week.sh.
set -e
W=$1; cd "$(dirname "$0")/.."
[[ -f src/components/explainers/manifest-parts/$W.json ]] && node scripts/merge-manifest.mjs $W
if [[ -f content-src/$W.yaml ]]; then   # a week spec (the problem-fact set <unit>-w00 has only an aids spec)
  node scripts/qa-week.mjs content-src/$W.yaml | tail -8
  npm run validate --silent 2>&1 | tail -1
  ADD_WEEK=$W npm run gate --silent 2>&1 | tail -1
  node scripts/emit.mjs content-src/$W.yaml >/dev/null
  n=$(git status --short src/content | grep -c "^ M" || true); echo "re-emit: $n modified tracked files (0 for an unchanged week)"
  node scripts/explainer-briefs.mjs $W >/dev/null && echo "briefs registered"
fi
# Study aids, decision flows and problem-fact annotations (docs/plans/2026-10-aids-brief.md).
if [[ -f content-src/aids/$W.yaml ]]; then
  node scripts/emit-aids.mjs content-src/aids/$W.yaml | tail -1
  node scripts/emit-aids.mjs content-src/aids/$W.yaml | grep -q " 0 created, 0 updated" && echo "aids re-emit: no-op" || echo "aids re-emit changed files — check"
else
  echo "NO STUDY AIDS for $W yet: write content-src/aids/$W.yaml (aids brief) or the week gets no Ways in, flows, drills"
fi
node scripts/content-health.mjs --quiet && echo "content health refreshed (/content-health)"
