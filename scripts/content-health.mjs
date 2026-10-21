// Content health report (features 123, 126, 127, 130, 160, 196, 200): one pass over raw/ and src/content that answers
//   - which generated files are stale because their raw week folder changed since they were generated (update impact),
//   - how well each concept is covered (questions, cards, explainer, study aids, decision flows) — the coverage map,
//   - where the content disagrees with itself (one term glossed differently within a unit; a case cited with a
//     different year in a concept note than on its case card),
//   - what still needs checking against the materials (verify: true), and what is locked from regeneration.
// Writes public/data/content-health.json (read by /content-health). Deterministic: no timestamps, sorted keys, so
// re-running on unchanged input produces no diff. Usage: node scripts/content-health.mjs [--quiet]
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { load } from './validate.mjs';
import { sourceHash } from './source-hash.mjs';

const OUT = 'public/data/content-health.json';
const quiet = process.argv.includes('--quiet');
const { data } = load('src/content');
const manifest = existsSync('src/components/explainers/manifest.json') ? JSON.parse(readFileSync('src/components/explainers/manifest.json', 'utf8')) : {};

// ---- 1. Update impact: raw folder hash now vs the hash stamped when each spec's files were generated.
const hashCache = new Map();
const hashOf = (src) => {
  if (!hashCache.has(src)) hashCache.set(src, existsSync(src) ? sourceHash(src) : null);
  return hashCache.get(src);
};
const stale = [];
const specs = [
  ...readdirSync('content-src').filter((f) => f.endsWith('.yaml')).map((f) => ({ path: join('content-src', f), kind: 'notes' })),
  ...(existsSync('content-src/aids') ? readdirSync('content-src/aids').filter((f) => f.endsWith('.yaml')).map((f) => ({ path: join('content-src/aids', f), kind: 'aids' })) : []),
];
for (const s of specs) {
  const spec = yaml.load(readFileSync(s.path, 'utf8'), { schema: yaml.JSON_SCHEMA });
  if (!spec?.source || !existsSync(spec.source) || !spec.unit) continue;
  if (s.kind === 'aids' && spec.week === 0) continue; // problem facts hash the pq spec file, not a raw folder
  const now = hashOf(spec.source);
  const wk = `${spec.unit}-w${String(spec.week ?? 0).padStart(2, '0')}`;
  const colls = s.kind === 'aids' ? ['aids', 'flows'] : ['weeks', 'concepts', 'questions', 'cards', 'audio'];
  const files = colls.flatMap((c) => [...data[c].entries()].filter(([id]) => id.startsWith(`${wk}-`) || id === wk).map(([, e]) => e));
  const old = files.filter((e) => e['source-hash'] && e['source-hash'] !== now && e['source-hash'] !== 'none');
  if (old.length) stale.push({ spec: s.path, kind: s.kind, week: wk, source: spec.source, files: old.length, locked: old.filter((e) => e.locked).length });
}

// ---- 2. Coverage map per concept.
const count = (coll, key) => { const m = new Map(); for (const e of data[coll].values()) m.set(e[key], (m.get(e[key]) ?? 0) + 1); return m; };
const qBy = count('questions', 'concept');
const cBy = count('cards', 'concept');
const flowConcepts = new Map();
for (const f of data.flows.values()) for (const id of new Set([...(f.concepts ?? []), ...(f.nodes ?? []).map((n) => n.concept).filter(Boolean)])) flowConcepts.set(id, (flowConcepts.get(id) ?? 0) + 1);
const coverage = [...data.concepts.entries()].filter(([, c]) => !c.seed).map(([id, c]) => ({
  id, unit: c.unit, week: c.week, title: c.title,
  questions: qBy.get(id) ?? 0, cards: cBy.get(id) ?? 0, explainer: !!manifest[id], aids: data.aids.has(id), flows: flowConcepts.get(id) ?? 0,
})).sort((a, b) => a.id.localeCompare(b.id));

// ---- 3. Self-contradictions.
const conflicts = [];
const terms = new Map();
for (const a of data.aids.values()) for (const t of a.terms ?? []) {
  const k = `${a.unit}|${t.term.toLowerCase().replace(/["“”'.]/g, '').trim()}`;
  terms.set(k, [...(terms.get(k) ?? []), { concept: a.concept, gloss: t.gloss }]);
}
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
for (const [k, list] of terms) {
  const glosses = [...new Set(list.map((x) => norm(x.gloss)))];
  if (glosses.length > 1) conflicts.push({ kind: 'term', unit: k.split('|')[0], subject: k.split('|')[1], detail: `${glosses.length} different glosses`, where: list.map((x) => x.concept) });
}
const yearOf = (s) => (String(s).match(/\b(1[5-9]\d\d|20[0-3]\d)\b/) ?? [])[1];
for (const [cid, c] of data.concepts) {
  if (c.seed) continue;
  const body = readFileSync(join('src/content', c.__file), 'utf8');
  for (const kid of c.cases ?? []) {
    const k = data.cases.get(kid);
    const y = k && yearOf(k.citation);
    if (!y || !k.name) continue;
    const short = k.name.split(/ v /)[0].replace(/[()[\]]/g, '').trim();
    const re = new RegExp(`${short.replace(/[.*+?^${}|\\]/g, '\\$&')}[^.\\n]{0,80}?[([]((1[5-9]|20)\\d\\d)[)\\]]`, 'i');
    const m = body.match(re);
    if (m && m[1] !== y) conflicts.push({ kind: 'citation-year', unit: c.unit, subject: k.name, detail: `note says ${m[1]}, case card says ${y}`, where: [cid] });
  }
}

// ---- 4. To verify and locked.
const verify = [];
const locked = [];
for (const coll of Object.keys(data)) for (const [id, e] of data[coll]) {
  if (e.seed) continue;
  if (e.verify) verify.push({ coll, id });
  if (e.locked) locked.push({ coll, id });
}

const units = [...new Set(coverage.map((c) => c.unit))].sort();
const summary = Object.fromEntries(units.map((u) => {
  const cs = coverage.filter((c) => c.unit === u);
  return [u, { concepts: cs.length, withAids: cs.filter((c) => c.aids).length, withExplainer: cs.filter((c) => c.explainer).length, withFlows: cs.filter((c) => c.flows).length, under20Questions: cs.filter((c) => c.questions < 20).length }];
}));
const report = { summary, stale, conflicts: conflicts.sort((a, b) => a.kind.localeCompare(b.kind) || a.subject.localeCompare(b.subject)), verify: verify.sort((a, b) => a.coll.localeCompare(b.coll) || a.id.localeCompare(b.id)), locked, coverage };
mkdirSync('public/data', { recursive: true });
const json = JSON.stringify(report, null, 1) + '\n';
if (!existsSync(OUT) || readFileSync(OUT, 'utf8') !== json) writeFileSync(OUT, json);
if (!quiet) {
  console.log('content health');
  for (const [u, s] of Object.entries(summary)) console.log(`  ${u}: ${s.withAids}/${s.concepts} with aids · ${s.withExplainer} explainers · ${s.withFlows} in flows · ${s.under20Questions} under 20 questions`);
  console.log(`  stale specs: ${stale.length} · conflicts: ${conflicts.length} · to verify: ${verify.length} · locked: ${locked.length}`);
}
