// Byte budgets after `npm run build` (CLAUDE.md rule 12): every explainer chunk ≤ 120 KB gz (its own module plus
// the chunks only it imports); the shared three.js/vendor chunks are reported separately against 180 KB gz, because
// they load once for all 3D explainers.
import { gzipSync } from 'node:zlib';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'dist/_astro';
const EXPLAINER_MAX = 120 * 1024;
const SHARED_MAX = 180 * 1024;
if (!existsSync(DIR)) { console.error('dist/_astro missing: run npm run build first'); process.exit(1); }

const manifest = JSON.parse(readFileSync('src/components/explainers/manifest.json', 'utf8'));
const files = readdirSync(DIR).filter((f) => f.endsWith('.js'));
const src = Object.fromEntries(files.map((f) => [f, readFileSync(join(DIR, f), 'utf8')]));
const gz = (f) => gzipSync(src[f]).length;
const importsOf = (f) => [...src[f].matchAll(/from\s*"\.\/([^"]+\.js)"|import\s*"\.\/([^"]+\.js)"/g)].map((m) => m[1] || m[2]).filter((x) => src[x]); // static only: the host lazy-loads every explainer
// Which chunks import each chunk (to tell shared from exclusive dependencies).
const importers = {};
for (const f of files) for (const d of importsOf(f)) (importers[d] ??= new Set()).add(f);

const problems = [];
const report = [];
const sharedSeen = new Set();
for (const [concept, { module }] of Object.entries(manifest)) {
  const base = module.split('/').pop();
  const entry = files.find((f) => f.startsWith(`${base}.`));
  if (!entry) { problems.push(`${concept}: no built chunk for ${module}`); continue; }
  // Exclusive deps: reachable from the entry and imported by nothing outside this explainer's own subgraph.
  const own = new Set([entry]);
  const stack = [entry];
  while (stack.length) for (const d of importsOf(stack.pop())) if (!own.has(d)) { own.add(d); stack.push(d); }
  const isVendor = (f) => /^three\./.test(f); // declared shared vendor chunk (astro.config.mjs manualChunks)
  const exclusive = [...own].filter((f) => f === entry || (!isVendor(f) && [...(importers[f] ?? [])].every((i) => own.has(i))));
  const shared = [...own].filter((f) => !exclusive.includes(f));
  const size = exclusive.reduce((s, f) => s + gz(f), 0);
  report.push(`${concept}: ${(size / 1024).toFixed(1)} KB gz (${exclusive.length} chunk${exclusive.length > 1 ? 's' : ''})`);
  if (size > EXPLAINER_MAX) problems.push(`${concept}: ${(size / 1024).toFixed(1)} KB gz > 120 KB`);
  for (const s of shared) sharedSeen.add(s);
}
for (const s of sharedSeen) {
  const size = gz(s);
  if (size > 20 * 1024) report.push(`shared ${s}: ${(size / 1024).toFixed(1)} KB gz`);
  if (size > SHARED_MAX) problems.push(`shared ${s}: ${(size / 1024).toFixed(1)} KB gz > 180 KB`);
}
// Intro film: its lazy chunk plus every chunk it imports (three included) ≤ 480 KB gz.
const introEntry = Object.keys(src).find((f) => /^intro\./.test(f));
if (introEntry) {
  const seen = new Set();
  const walk = (f) => { if (seen.has(f)) return; seen.add(f); importsOf(f).forEach(walk); };
  walk(introEntry);
  const size = [...seen].reduce((t, f) => t + gz(f), 0);
  report.push(`intro film: ${(size / 1024).toFixed(1)} KB gz (${seen.size} chunks)`);
  if (size > 480 * 1024) problems.push(`intro film: ${(size / 1024).toFixed(1)} KB gz > 480 KB`);
}
console.log(report.join('\n') || 'no explainers registered');
if (problems.length) { console.error('BUDGET FAILED\n' + problems.join('\n')); process.exit(1); }
console.log('budget ok');
