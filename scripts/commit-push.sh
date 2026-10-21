#!/usr/bin/env bash
# Overnight commit helper (200-features pass, 2026-10-17): commits what is already staged and pushes to main.
# The student asked for commits not to wait on a permission prompt while they sleep; this keeps the project's own
# pre-commit checks (validate + gate, as in .claude/settings.json) and adds the attribution trailer.
# Usage: scripts/commit-push.sh "type(scope): subject" ["body paragraph"]
set -euo pipefail
cd "$(dirname "$0")/.."
subject="${1:?subject required}"
body="${2:-}"
if git diff --cached --quiet; then echo "nothing staged"; exit 1; fi
npm run validate --silent >/dev/null
npm run gate --silent >/dev/null
msg="$subject"
[ -n "$body" ] && msg="$msg

$body"
msg="$msg

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git commit -q -m "$msg"
git push -q
git log --oneline -1
