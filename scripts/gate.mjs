// Regression gate: counts content, hashes files, compares to reports/gate.json.
// Fails on any decrease, or (when ADD_WEEK is set) on any changed file outside that week's id prefix.
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = 'src/content';
const MANIFEST = 'src/components/explainers/manifest.json';
const OUT = 'reports/gate.json';
const addWeek = process.env.ADD_WEEK; // e.g. laws2400-w09

function walk(dir, acc = [], re = /\.(md|mdx)$/) {
  if (!existsSync(dir)) return acc;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, acc, re); else if (re.test(e)) acc.push(p);
  }
  return acc;
}
const files = walk(ROOT).filter(f => !f.includes('/seed/'));
const counts = {};
const hashes = {};
for (const f of files) {
  const rel = relative(ROOT, f);
  const coll = rel.split('/')[0];
  const src = readFileSync(f, 'utf8');
  const type = (src.match(/^type:\s*(\S+)/m) || [])[1];
  const key = coll === 'questions' && type ? `questions.${type}` : coll;
  counts[key] = (counts[key] || 0) + 1;
  hashes[rel] = createHash('sha256').update(src).digest('hex').slice(0, 16);
}
counts.explainers = existsSync(MANIFEST) ? Object.keys(JSON.parse(readFileSync(MANIFEST, 'utf8'))).length : 0;
counts.routes = walk('src/pages', [], /\.(astro|md|mdx|ts)$/).length;

const prev = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : null;
const problems = [];
if (prev) {
  for (const [k, v] of Object.entries(prev.counts)) if ((counts[k] || 0) < v) problems.push(`count decreased: ${k} ${v} -> ${counts[k] || 0}`);
  if (addWeek) {
    const unit = addWeek.split('-w')[0];
    const weekTag = addWeek.replace(`${unit}-`, ''); // w09
    for (const [rel, h] of Object.entries(hashes)) {
      const old = prev.hashes[rel];
      if (old && old !== h) {
        const base = rel.split('/').pop();
        const belongs = base.startsWith(`${addWeek}`) || (base.startsWith(unit) && base.includes(weekTag));
        if (!belongs && !/^(cases|authorities)\//.test(rel)) problems.push(`changed outside ${addWeek}: ${rel}`);
      }
    }
  }
}
mkdirSync('reports', { recursive: true });
writeFileSync(OUT, JSON.stringify({ at: new Date().toISOString(), counts, hashes }, null, 2));
console.log('gate counts', counts);
if (problems.length) { console.error('GATE FAILED\n' + problems.join('\n')); process.exit(1); }
console.log('gate ok');
