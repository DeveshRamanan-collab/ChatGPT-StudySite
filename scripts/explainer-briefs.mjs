// Usage: node scripts/explainer-briefs.mjs <week-id>. Appends a week's explainer briefs (pre-approved by the user, 7 Oct 2026) to docs/plans/explainers-2026-10.md.
import { readdirSync, readFileSync, existsSync, writeFileSync, appendFileSync } from 'node:fs';
const wk = process.argv[2]; // e.g. laws2400-w07
const out = 'docs/plans/explainers-2026-10.md';
if (!existsSync(out)) writeFileSync(out, '# Explainer briefs — October 2026 ingest\n\nPre-approved by the user (7 Oct 2026): each brief is written here, built straight away, and listed in the report.\nOne line per concept: id · visual base · the brief from the concept card.\n');
const rows = readdirSync('src/content/concepts').filter((f) => f.startsWith(wk + '-')).sort().map((f) => {
  const s = readFileSync(`src/content/concepts/${f}`, 'utf8');
  const v = s.match(/^visual: (.*)$/m)[1], b = s.match(/^visual-brief: (.*)$/m)[1].replace(/^"|"$/g, '').replace(/\\"/g, '"');
  return `- \`${f.replace('.md', '')}\` · ${v} · ${b}`;
});
appendFileSync(out, `\n## ${wk}\n${rows.join('\n')}\n`);
console.log(rows.length, 'briefs');
