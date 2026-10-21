// Emits study aids, decision flows and problem-fact annotations from content-src/aids/<unit>-wNN.yaml.
// Same contract as emit.mjs: deterministic, idempotent (generated-at kept when nothing else changed), never touches
// locked: true files, every file carries its week's id prefix. Checks the spec before writing anything: unknown keys,
// missing fields, dangling concept/case/authority/question ids, broken flow graphs, and facts that are not verbatim
// excerpts of their question's prompt.
// Usage: node scripts/emit-aids.mjs content-src/aids/laws2400-w05.yaml [--check]   (--check validates, writes nothing)
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import yaml from 'js-yaml';
import { sourceHash } from './source-hash.mjs';
import { load } from './validate.mjs';

const ROOT = 'src/content';
const GEN = 'aids-1';
const pad = (n, w = 2) => String(n).padStart(w, '0');
const dump = (o) => yaml.dump(o, { lineWidth: -1, noRefs: true, quotingType: '"' });
const norm = (t) => String(t).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim().toLowerCase();

// ---- shape checks (mirror src/content/config.ts; the build re-checks with zod) ----
const STR = 'str', OSTR = 'ostr', IDS = 'ids', BOOL = 'bool';
const SHAPES = {
  aid: {
    concept: STR, plain: STR, concrete: OSTR, formal: OSTR, analogy: 'analogy', terms: ['term'], misconceptions: ['misc'],
    socratic: ['soc'], elements: ['element'], 'what-if': ['whatif'], boundary: ['boundary'], transfer: ['transfer'],
    objections: ['objection'], storyboard: ['frame'], sources: [STR], verify: BOOL,
  },
  analogy: { text: STR, maps: ['map'], limits: [STR] },
  map: { from: STR, to: STR },
  term: { term: STR, gloss: STR, example: OSTR },
  misc: { claim: STR, tempting: STR, correction: STR },
  soc: { ask: STR, hint: STR, answer: STR },
  element: { name: STR, test: STR, cases: IDS, authorities: IDS },
  whatif: { change: STR, effect: STR },
  boundary: { text: STR, why: STR },
  transfer: { scenario: STR, answer: STR },
  objection: { position: STR, evidence: STR, objection: STR, reply: OSTR },
  frame: { caption: STR, detail: STR },
  flow: { slug: STR, title: STR, summary: STR, start: STR, concepts: IDS, nodes: ['node'], sources: [STR], verify: BOOL },
  node: {
    id: STR, kind: STR, text: STR, note: OSTR, concept: OSTR, cases: IDS, authorities: IDS, branches: ['branch'],
    next: OSTR, tone: OSTR, exception: BOOL,
  },
  branch: { label: STR, to: STR },
  fact: { question: STR, parties: ['party'], issues: ['issue'], facts: ['factrow'], verify: BOOL },
  party: { name: STR, role: STR },
  issue: { id: STR, label: STR, concept: OSTR },
  factrow: { text: STR, weight: STR, kind: STR, issues: IDS, why: OSTR },
};
const REQUIRED = {
  aid: ['concept', 'plain'], analogy: ['text', 'maps', 'limits'], map: ['from', 'to'], term: ['term', 'gloss'],
  misc: ['claim', 'tempting', 'correction'], soc: ['ask', 'hint', 'answer'], element: ['name', 'test'],
  whatif: ['change', 'effect'], boundary: ['text', 'why'], transfer: ['scenario', 'answer'],
  objection: ['position', 'evidence', 'objection'], frame: ['caption', 'detail'],
  flow: ['slug', 'title', 'summary', 'start', 'nodes'], node: ['id', 'kind', 'text'], branch: ['label', 'to'],
  fact: ['question', 'issues', 'facts'], party: ['name', 'role'], issue: ['id', 'label'], factrow: ['text', 'weight', 'kind'],
};

function check(shape, obj, path, errors) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return errors.push(`${path}: expected an object`);
  const spec = SHAPES[shape];
  for (const k of Object.keys(obj)) if (!(k in spec)) errors.push(`${path}: unknown key "${k}"`);
  for (const k of REQUIRED[shape] || []) if (obj[k] === undefined || obj[k] === null || obj[k] === '') errors.push(`${path}: missing ${k}`);
  for (const [k, t] of Object.entries(spec)) {
    const v = obj[k];
    if (v === undefined) continue;
    const p = `${path}.${k}`;
    if (t === STR || t === OSTR) { if (typeof v !== 'string' || !v.trim()) errors.push(`${p}: expected non-empty text`); }
    else if (t === BOOL) { if (typeof v !== 'boolean') errors.push(`${p}: expected true/false`); }
    else if (t === IDS) { if (!Array.isArray(v) || v.some((x) => typeof x !== 'string')) errors.push(`${p}: expected a list of ids`); }
    else if (Array.isArray(t)) {
      if (!Array.isArray(v)) { errors.push(`${p}: expected a list`); continue; }
      v.forEach((x, i) => (t[0] === STR ? (typeof x !== 'string' || !x.trim()) && errors.push(`${p}[${i}]: expected text`) : check(t[0], x, `${p}[${i}]`, errors)));
    } else check(t, v, p, errors);
  }
}

function fileHash(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex').slice(0, 16);
}

function readExisting(path) {
  if (!existsSync(path)) return null;
  const src = readFileSync(path, 'utf8');
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  return { data: yaml.load(m[1], { schema: yaml.JSON_SCHEMA }) ?? {}, src };
}

const strip = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0)));

export function emitAids(specPath, { checkOnly = false, now = new Date().toISOString(), content = ROOT } = {}) {
  const spec = yaml.load(readFileSync(specPath, 'utf8'), { schema: yaml.JSON_SCHEMA });
  const errors = [];
  const { unit, week } = spec || {};
  if (!/^[a-z]+\d{4}$/.test(unit || '') || !Number.isInteger(week)) throw new Error(`${specPath}: unit/week missing`);
  for (const k of Object.keys(spec)) if (!['unit', 'week', 'source', 'generator', 'aids', 'flows', 'facts'].includes(k)) errors.push(`${specPath}: unknown top-level key "${k}"`);
  const wk = `${unit}-w${pad(week)}`;
  const src = spec.source;
  if (!src || !existsSync(src)) errors.push(`${specPath}: source "${src}" not found (raw week folder, or the pq spec for week 0)`);
  const hash = src && existsSync(src) ? (statSync(src).isDirectory() ? sourceHash(src) : fileHash(src)) : 'none';
  const gen = spec.generator || GEN;

  const { data } = load(content);
  const has = (coll, v) => data[coll].has(v);
  const refCheck = (path, coll, list) => { for (const v of list || []) if (!has(coll, v)) errors.push(`${path}: unknown ${coll} id "${v}"`); };

  // ---- aids ----
  const seen = new Set();
  (spec.aids || []).forEach((a, i) => {
    const p = `aids[${i}]`;
    check('aid', a, p, errors);
    if (!a?.concept) return;
    if (!a.concept.startsWith(`${wk}-`)) errors.push(`${p}: concept ${a.concept} is not in ${wk}`);
    if (!has('concepts', a.concept)) errors.push(`${p}: unknown concept "${a.concept}"`);
    if (seen.has(a.concept)) errors.push(`${p}: duplicate concept ${a.concept}`);
    seen.add(a.concept);
    (a.elements || []).forEach((e, j) => { refCheck(`${p}.elements[${j}].cases`, 'cases', e.cases); refCheck(`${p}.elements[${j}].authorities`, 'authorities', e.authorities); });
  });

  // ---- flows ----
  const slugs = new Set();
  (spec.flows || []).forEach((f, i) => {
    const p = `flows[${i}]`;
    check('flow', f, p, errors);
    if (!f?.nodes) return;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(f.slug || '')) errors.push(`${p}: slug must be kebab-case`);
    if (slugs.has(f.slug)) errors.push(`${p}: duplicate slug ${f.slug}`);
    slugs.add(f.slug);
    refCheck(`${p}.concepts`, 'concepts', f.concepts);
    const ids = new Map(f.nodes.map((n) => [n.id, n]));
    if (ids.size !== f.nodes.length) errors.push(`${p}: duplicate node ids`);
    if (!ids.has(f.start)) errors.push(`${p}: start "${f.start}" is not a node`);
    f.nodes.forEach((n, j) => {
      const q = `${p}.nodes[${j}] (${n.id})`;
      if (!['ask', 'step', 'end'].includes(n.kind)) errors.push(`${q}: kind must be ask, step or end`);
      if (n.kind === 'ask' && (n.branches || []).length < 2) errors.push(`${q}: an ask needs ≥ 2 branches`);
      if (n.kind === 'step' && !n.next) errors.push(`${q}: a step needs next`);
      if (n.kind === 'end' && ((n.branches || []).length || n.next)) errors.push(`${q}: an end has no branches or next`);
      if (n.kind === 'end' && !['met', 'not-met', 'qualified'].includes(n.tone)) errors.push(`${q}: an end needs tone met | not-met | qualified`);
      if (n.kind !== 'end' && n.tone) errors.push(`${q}: only an end has a tone`);
      for (const b of n.branches || []) if (!ids.has(b.to)) errors.push(`${q}: branch "${b.label}" → unknown node ${b.to}`);
      if (n.next && !ids.has(n.next)) errors.push(`${q}: next → unknown node ${n.next}`);
      if (n.concept && !has('concepts', n.concept)) errors.push(`${q}: unknown concept "${n.concept}"`);
      refCheck(`${q}.cases`, 'cases', n.cases);
      refCheck(`${q}.authorities`, 'authorities', n.authorities);
    });
    // Reachability and acyclicity from start.
    const state = new Map();
    const visit = (id, trail) => {
      if (state.get(id) === 1) return errors.push(`${p}: cycle through ${[...trail, id].join(' → ')}`);
      if (state.get(id) === 2) return;
      state.set(id, 1);
      const n = ids.get(id);
      for (const t of [...(n?.branches || []).map((b) => b.to), ...(n?.next ? [n.next] : [])]) if (ids.has(t)) visit(t, [...trail, id]);
      state.set(id, 2);
    };
    if (ids.has(f.start)) visit(f.start, []);
    for (const id of ids.keys()) if (!state.has(id)) errors.push(`${p}: node ${id} is unreachable from start`);
  });

  // ---- facts (problem questions) ----
  const qs = new Set();
  (spec.facts || []).forEach((f, i) => {
    const p = `facts[${i}]`;
    check('fact', f, p, errors);
    if (!f?.question) return;
    const q = data.questions.get(f.question);
    if (!q) return errors.push(`${p}: unknown question "${f.question}"`);
    if (!f.question.startsWith(`${wk}-`)) errors.push(`${p}: question ${f.question} is not in ${wk}`);
    if (qs.has(f.question)) errors.push(`${p}: duplicate question ${f.question}`);
    qs.add(f.question);
    const prompt = norm(q.prompt || q.stem || '');
    const issueIds = new Set((f.issues || []).map((x) => x.id));
    (f.issues || []).forEach((x, j) => { if (x.concept && !has('concepts', x.concept)) errors.push(`${p}.issues[${j}]: unknown concept "${x.concept}"`); });
    (f.facts || []).forEach((r, j) => {
      const fp = `${p}.facts[${j}]`;
      if (r.text && !prompt.includes(norm(r.text))) errors.push(`${fp}: not a verbatim excerpt of the prompt: "${String(r.text).slice(0, 60)}…"`);
      if (!['essential', 'background'].includes(r.weight)) errors.push(`${fp}: weight must be essential | background`);
      if (!['party', 'conduct', 'mental', 'harm', 'relationship', 'timing', 'statement', 'context'].includes(r.kind)) errors.push(`${fp}: bad kind ${r.kind}`);
      for (const x of r.issues || []) if (!issueIds.has(x)) errors.push(`${fp}: unknown issue id ${x}`);
    });
  });

  if (errors.length) return { ok: false, errors, report: null };
  const report = { created: [], updated: [], unchanged: [], locked: [] };
  if (checkOnly) return { ok: true, errors, report };

  function write(coll, id, body) {
    const path = join(content, coll, `${id}.md`);
    const old = readExisting(path);
    if (old?.data.locked) return report.locked.push(`${coll}/${id}`);
    const { verify, ...rest } = body;
    const make = (at) => `---\n${dump({ 'source-hash': hash, 'generator-version': gen, 'generated-at': at, locked: false, ...rest, verify: !!verify })}---\n`;
    const keepAt = old?.data['generated-at'];
    if (old && keepAt && make(keepAt) === old.src) return report.unchanged.push(`${coll}/${id}`);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, make(now));
    report[old ? 'updated' : 'created'].push(`${coll}/${id}`);
  }

  for (const a of spec.aids || []) {
    const { concept, ...d } = a;
    write('aids', concept, strip({ concept, unit, week: wk, ...d }));
  }
  for (const f of spec.flows || []) {
    const { slug, nodes, ...d } = f;
    write('flows', `${wk}-flow-${slug}`, strip({ unit, week: wk, ...d, nodes: nodes.map((n) => strip(n)) }));
  }
  for (const f of spec.facts || []) {
    const { question, ...d } = f;
    write('facts', question, strip({ question, unit, ...d, facts: d.facts.map((r) => strip(r)) }));
  }
  return { ok: true, errors, report };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const checkOnly = args.includes('--check');
  let failed = false;
  for (const f of args.filter((a) => !a.startsWith('--'))) {
    const r = emitAids(f, { checkOnly });
    if (!r.ok) {
      failed = true;
      console.error(`✗ ${f} (${r.errors.length})\n  ` + r.errors.join('\n  '));
      continue;
    }
    const n = (k) => r.report[k].length;
    console.log(`✓ ${f}${checkOnly ? ' (check only)' : `: ${n('created')} created, ${n('updated')} updated, ${n('unchanged')} unchanged, ${n('locked')} locked`}`);
  }
  if (failed) process.exit(1);
}
