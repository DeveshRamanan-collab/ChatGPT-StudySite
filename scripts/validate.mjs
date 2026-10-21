// Content validator: parses every content file's frontmatter, checks every cross-reference, and enforces
// ≥ 20 questions per non-seed concept. Usage: node scripts/validate.mjs [contentRoot]. Exits 1 on any error.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import yaml from 'js-yaml';

export const COLLECTIONS = ['units', 'weeks', 'concepts', 'cases', 'authorities', 'questions', 'cards', 'audio', 'aids', 'flows', 'facts', 'dossiers'];
export const MIN_QUESTIONS_PER_CONCEPT = 20;

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(md|mdx)$/.test(e)) acc.push(p);
  }
  return acc;
}

export function frontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) throw new Error('no frontmatter');
  return yaml.load(m[1], { schema: yaml.JSON_SCHEMA }) ?? {};
}

export function load(root) {
  const data = {};
  const errors = [];
  for (const coll of COLLECTIONS) {
    data[coll] = new Map();
    for (const f of walk(join(root, coll))) {
      const id = basename(f).replace(/\.(md|mdx)$/, '');
      const rel = relative(root, f);
      if (data[coll].has(id)) { errors.push(`${rel}: duplicate id "${id}" in ${coll}`); continue; }
      try {
        data[coll].set(id, { ...frontmatter(readFileSync(f, 'utf8')), __file: rel });
      } catch (e) {
        errors.push(`${rel}: ${e.message}`);
      }
    }
  }
  return { data, errors };
}

export function validate(root = 'src/content') {
  const { data, errors } = load(root);
  const warnings = [];
  const ref = (entry, field, coll, value) => {
    if (value === undefined || value === null) return;
    for (const v of Array.isArray(value) ? value : [value])
      if (!data[coll].has(v)) errors.push(`${entry.__file}: ${field} → unknown ${coll} id "${v}"`);
  };

  for (const w of data.weeks.values()) {
    ref(w, 'unit', 'units', w.unit);
    ref(w, 'concepts', 'concepts', w.concepts);
    ref(w, 'pretest', 'questions', w.pretest);
  }
  for (const [id, c] of data.concepts) {
    ref(c, 'unit', 'units', c.unit);
    ref(c, 'week', 'weeks', c.week);
    ref(c, 'cases', 'cases', c.cases);
    ref(c, 'authorities', 'authorities', c.authorities);
    ref(c, 'related', 'concepts', c.related);
    ref(c, 'depends-on', 'concepts', c['depends-on']);
    ref(c, 'contrasts-with', 'concepts', c['contrasts-with']);
    if ((c['depends-on'] || []).includes(id)) errors.push(`${c.__file}: depends-on itself`);
    const week = data.weeks.get(c.week);
    if (week && week.unit !== c.unit) errors.push(`${c.__file}: week ${c.week} belongs to ${week.unit}, not ${c.unit}`);
    if (week && !(week.concepts || []).includes(id)) warnings.push(`${c.__file}: not listed in ${c.week}.concepts`);
  }
  for (const k of data.cases.values()) ref(k, 'units', 'units', k.units);
  for (const a of data.authorities.values()) {
    ref(a, 'units', 'units', a.units);
    ref(a, 'cases', 'cases', a.cases);
  }
  for (const q of data.questions.values()) {
    ref(q, 'concept', 'concepts', q.concept);
    ref(q, 'week', 'weeks', q.week);
    ref(q, 'variant-of', 'questions', q['variant-of']);
    ref(q, 'cases', 'cases', q.cases);
    ref(q, 'contrasts-with', 'concepts', q['contrasts-with']);
    for (const r of q.rubric || []) ref(q, `rubric.${r.id}.authorities`, 'authorities', r.authorities);
    if (!q.concept) errors.push(`${q.__file}: missing concept`);
    if (q.type === 'mcq') for (const [i, o] of (q.options || []).entries()) if (!o.why) errors.push(`${q.__file}: option ${i + 1} has no why`);
  }
  for (const c of data.cards.values()) {
    ref(c, 'concept', 'concepts', c.concept);
    ref(c, 'week', 'weeks', c.week);
  }
  for (const a of data.audio.values()) {
    ref(a, 'unit', 'units', a.unit);
    ref(a, 'week', 'weeks', a.week);
  }

  // Study aids, decision flows, problem-fact annotations (scripts/emit-aids.mjs checks graph shape and verbatim facts).
  for (const a of data.aids.values()) {
    ref(a, 'concept', 'concepts', a.concept);
    ref(a, 'unit', 'units', a.unit);
    ref(a, 'week', 'weeks', a.week);
    for (const e of a.elements || []) { ref(a, 'elements.cases', 'cases', e.cases); ref(a, 'elements.authorities', 'authorities', e.authorities); }
  }
  for (const f of data.flows.values()) {
    ref(f, 'unit', 'units', f.unit);
    ref(f, 'week', 'weeks', f.week);
    ref(f, 'concepts', 'concepts', f.concepts);
    const ids = new Set((f.nodes || []).map((n) => n.id));
    if (!ids.has(f.start)) errors.push(`${f.__file}: start ${f.start} is not a node`);
    for (const n of f.nodes || []) {
      ref(f, `nodes.${n.id}.concept`, 'concepts', n.concept);
      ref(f, `nodes.${n.id}.cases`, 'cases', n.cases);
      ref(f, `nodes.${n.id}.authorities`, 'authorities', n.authorities);
      for (const t of [...(n.branches || []).map((b) => b.to), ...(n.next ? [n.next] : [])]) if (!ids.has(t)) errors.push(`${f.__file}: ${n.id} → unknown node ${t}`);
    }
  }
  for (const f of data.facts.values()) {
    ref(f, 'question', 'questions', f.question);
    ref(f, 'unit', 'units', f.unit);
    for (const i of f.issues || []) ref(f, `issues.${i.id}.concept`, 'concepts', i.concept);
  }

  // Dossiers (scripts/emit-dossiers.mjs checks vocab, lengths and verbatim text): each points at its case/authority.
  for (const [id, d] of data.dossiers) {
    const coll = d.kind === 'case' ? 'cases' : 'authorities';
    ref(d, 'ref', coll, d.ref);
    if (id !== `${d.kind === 'case' ? 'case' : 'prov'}--${d.ref}`) errors.push(`${d.__file}: id must be ${d.kind === 'case' ? 'case' : 'prov'}--${d.ref}`);
    ref(d, 'units', 'units', d.units);
    ref(d, 'weeks', 'weeks', d.weeks);
    ref(d, 'statutes', 'authorities', d.statutes);
    ref(d, 'cases', 'cases', d.cases);
    ref(d, 'related', 'authorities', d.related);
    for (const c of d.contrasts || []) ref(d, 'contrasts.case', 'cases', c.case);
    for (const e of d.elements || []) ref(d, `elements.${e.id}.cases`, 'cases', e.cases);
  }

  // Coverage: ≥ 20 questions per non-seed concept.
  const perConcept = new Map();
  for (const q of data.questions.values()) perConcept.set(q.concept, (perConcept.get(q.concept) || 0) + 1);
  const coverage = [];
  for (const [id, c] of data.concepts) {
    const n = perConcept.get(id) || 0;
    coverage.push({ id, n, seed: !!c.seed });
    const thin = data.weeks.get(c.week)?.thin === true; // a thin week reports the shortfall (audit) instead of failing
    if (!c.seed && n < MIN_QUESTIONS_PER_CONCEPT) (thin ? warnings : errors).push(`${c.__file}: ${n} questions (${thin ? 'thin week; target' : 'needs ≥'} ${MIN_QUESTIONS_PER_CONCEPT})`);
  }

  // Explainer manifest: every key a real concept, every module file present.
  const manifestPath = join(root, '..', 'components/explainers/manifest.json');
  if (existsSync(manifestPath)) {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    for (const [cid, e] of Object.entries(manifest)) {
      if (!data.concepts.has(cid)) errors.push(`explainers/manifest.json: unknown concept "${cid}"`);
      if (!existsSync(join(root, '..', 'components/explainers', `${e.module}.tsx`))) errors.push(`explainers/manifest.json: missing module ${e.module}.tsx for ${cid}`);
    }
  }

  const counts = Object.fromEntries(COLLECTIONS.map((k) => [k, data[k].size]));
  const verify = COLLECTIONS.flatMap((k) => [...data[k].values()].filter((e) => e.verify && !e.seed).map((e) => e.__file));
  return { errors, warnings, counts, coverage, verify };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = process.argv[2] || 'src/content';
  const r = validate(root);
  console.log(`validate ${root}`);
  console.log('  counts', r.counts);
  for (const c of r.coverage) console.log(`  ${c.seed ? 'seed ' : '     '}${c.id}: ${c.n} questions`);
  if (r.verify.length) console.log(`  verify: true (${r.verify.length})\n    ` + r.verify.join('\n    '));
  for (const w of r.warnings) console.warn('  warn', w);
  if (r.errors.length) {
    console.error(`VALIDATE FAILED (${r.errors.length})\n  ` + r.errors.join('\n  '));
    process.exit(1);
  }
  console.log('validate ok');
}
