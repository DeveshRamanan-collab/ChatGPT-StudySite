// Dossier coverage: which cases and legal provisions still lack a dossier, which examinable-list items are missing,
// and every "X v Y" case name mentioned in each week's raw text that the site has no case for (a candidate list for
// the week's agent to rule in or out). Writes docs/audits/dossier-coverage.md (+ .json).
// Usage: node scripts/dossier-coverage.mjs [--unit laws2400] [--quiet] [--strict]
//   --strict exits 1 when any examinable-list item or any case lacks a dossier.
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { load } from './validate.mjs';

const args = process.argv.slice(2);
const only = args.includes('--unit') ? args[args.indexOf('--unit') + 1] : null;
const quiet = args.includes('--quiet'), strict = args.includes('--strict');
const { data } = load('src/content');
const vocab = yaml.load(readFileSync('content-src/dossiers/vocab.yaml', 'utf8'), { schema: yaml.JSON_SCHEMA });
const have = new Set([...data.dossiers.keys()]);
const specHave = new Set();
for (const sub of ['cases', 'provisions']) {
  const d = join('content-src/dossiers', sub);
  if (existsSync(d)) for (const f of readdirSync(d)) if (f.endsWith('.yaml')) specHave.add(`${sub === 'cases' ? 'case' : 'prov'}--${f.slice(0, -5)}`);
}
const covered = (k) => have.has(k) || specHave.has(k);

// A "legal provision" is a statute, treaty or ILC/ARSIWA/ARIO-style article; scholarly works and MGMT examples are not.
const LEGAL = /(^|-)(act|acts|convention|charter|statute|treaty|covenant|constitution|protocol|declaration|resolution|arsiwa|ario|ilc|cpiun|vclt|vcdr|vccr|unclos|uncsi|iccpr|icescr|echr|achr|rome|genocide|geneva|imt|icty|ictr|code|pact|basic-law|law)(-|$)/;
const isLegal = (id, a) => !id.startsWith('mgmt2094-') && (a.kind === 'statute' || a.kind === 'treaty' || ((a.kind === 'article' || a.kind === 'other') && LEGAL.test(id)));
const unitsOf = (x) => x.units || [];
const inScope = (x) => !only || unitsOf(x).includes(only);

const missingCases = [...data.cases].filter(([id, k]) => inScope(k) && !covered(`case--${id}`)).map(([id, k]) => ({ id, name: k.name, units: unitsOf(k), origin: k.origin }));
const missingProv = [...data.authorities].filter(([id, a]) => inScope(a) && isLegal(id, a) && !covered(`prov--${id}`)).map(([id, a]) => ({ id, title: a.title, units: unitsOf(a), origin: a.origin }));
const listGaps = [];
for (const [lid, l] of Object.entries(vocab.lists || {})) {
  if (only && l.unit !== only) continue;
  for (const c of l.cases || []) if (!covered(`case--${c.ref}`)) listGaps.push({ list: lid, n: c.n, ref: c.ref, as: c.as, exists: data.cases.has(c.ref) });
  for (const p of l.provisions || []) if (!covered(`prov--${p.ref}`)) listGaps.push({ list: lid, ref: p.ref, as: p.as, exists: data.authorities.has(p.ref) });
}

// Raw mentions: "Name v Name" per unit/week in .cache/raw-text, minus names the site already has.
const norm = (t) => t.toLowerCase().replace(/\(.*?\)|\[.*?\]/g, '').replace(/\b(pty|ltd|limited|co|inc|the|of|and|plc)\b/g, ' ').replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
const known = new Set([...data.cases.values()].map((k) => norm(k.name)));
const knownParts = [...data.cases.values()].map((k) => norm(k.name).split(' v ')[0]).filter((x) => x.length > 3);
const RE = /\b([A-Z][A-Za-z'’&.\-]+(?: [A-Z&(][A-Za-z'’&.\-()]*){0,6}) v ([A-Z][A-Za-z'’&.\-]+(?: [A-Za-z(][A-Za-z'’&.\-()]*){0,6})/g;
const mentions = {};
const RAW = '.cache/raw-text';
const folders = existsSync(RAW) ? readdirSync(RAW) : [];
const unitOfFolder = (f) => f.split('-')[0];
for (const folder of folders) {
  const u = unitOfFolder(folder);
  if (only && u !== only) continue;
  const walk = (dir) => readdirSync(dir).flatMap((e) => (statSync(join(dir, e)).isDirectory() ? walk(join(dir, e)) : [join(dir, e)]));
  for (const file of walk(join(RAW, folder))) {
    const week = file.match(/week-(\d+)/)?.[1] ?? 'unit-wide';
    const text = readFileSync(file, 'utf8');
    for (const m of text.matchAll(RE)) {
      const name = `${m[1]} v ${m[2]}`.replace(/\s+/g, ' ').replace(/[ ,;.:]+$/, '');
      const n = norm(name);
      if (n.length < 6 || known.has(n) || knownParts.some((p) => n.startsWith(p + ' v'))) continue;
      const key = `${u} · week ${week}`;
      (mentions[key] ??= new Map()).set(n, { name, file: file.replace(`${RAW}/`, 'raw/').replace(/\.txt$/, ''), count: (mentions[key].get(n)?.count ?? 0) + 1 });
    }
  }
}

const caseTotal = [...data.cases.values()].filter(inScope).length;
const provTotal = [...data.authorities].filter(([id, a]) => inScope(a) && isLegal(id, a)).length;
const lines = [
  `# Dossier coverage${only ? ` — ${only}` : ''}`, '',
  `Generated ${new Date().toISOString()} by scripts/dossier-coverage.mjs.`, '',
  `- Cases with a dossier: ${caseTotal - missingCases.length} of ${caseTotal}`,
  `- Legal provisions with a dossier: ${provTotal - missingProv.length} of ${provTotal}`,
  `- Examinable-list items without a dossier: ${listGaps.length}`, '',
  '## Examinable-list gaps', '', ...(listGaps.length ? listGaps.map((g) => `- [${g.list}] ${g.n ? `${g.n}. ` : ''}${g.as} → \`${g.ref}\`${g.exists ? '' : ' (no case/authority yet: needs base:)'}`) : ['None.']), '',
  '## Cases without a dossier', '', ...(missingCases.length ? missingCases.map((c) => `- \`${c.id}\` ${c.name} (${c.units.join(', ')}; origin ${c.origin ?? '—'})`) : ['None.']), '',
  '## Legal provisions without a dossier', '', ...(missingProv.length ? missingProv.map((p) => `- \`${p.id}\` ${p.title} (${p.units.join(', ')}; origin ${p.origin ?? '—'})`) : ['None.']), '',
  '## Case names in raw materials with no case record (candidates — rule each in or out)', '',
  ...Object.entries(mentions).sort().flatMap(([k, m]) => [`### ${k}`, ...[...m.values()].sort((a, b) => b.count - a.count).map((x) => `- ${x.name} ×${x.count} — ${x.file}`), '']),
];
mkdirSync('docs/audits', { recursive: true });
const out = only ? `docs/audits/dossier-coverage-${only}` : 'docs/audits/dossier-coverage';
writeFileSync(`${out}.md`, lines.join('\n') + '\n');
writeFileSync(`${out}.json`, JSON.stringify({ missingCases, missingProv, listGaps, mentions: Object.fromEntries(Object.entries(mentions).map(([k, m]) => [k, [...m.values()]])) }, null, 2));
if (!quiet) console.log(`dossier coverage${only ? ` (${only})` : ''}: cases ${caseTotal - missingCases.length}/${caseTotal}, provisions ${provTotal - missingProv.length}/${provTotal}, list gaps ${listGaps.length} → ${out}.md`);
if (strict && (listGaps.length || missingCases.length)) process.exit(1);
