// Emits case and provision dossiers from content-src/dossiers/{cases,provisions}/<ref>.yaml into
// src/content/dossiers/{case,prov}--<ref>.md (brief: docs/plans/2026-10-dossier-brief.md).
// Same contract as emit.mjs: deterministic and idempotent (generated-at kept when nothing else changed), never
// touches locked: true files. Checks every spec before writing anything:
//   - unknown keys, missing or empty required fields, one-liner ≤ 30 words, plain ≥ 35 words
//   - vocab: topics belong to the dossier's units, lists and court codes exist (content-src/dossiers/vocab.yaml)
//   - refs: ref, weeks, statutes, cases, contrasts, related all exist (or are created by a `base` in this run)
//   - verbatim: every quote, and a provision's `text`, whose source is a raw/ file must appear in that file's
//     extracted text (.cache/raw-text, see scripts/extract.mjs) — unless the dossier is verify: true.
// A spec with `base:` creates the case/authority itself when it does not exist yet (origin: dossier).
// Usage: node scripts/emit-dossiers.mjs [files…] [--check]   (no files = every spec; --check writes nothing)
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { basename, dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import yaml from 'js-yaml';
import { load } from './validate.mjs';

const ROOT = 'src/content';
const SRC = 'content-src/dossiers';
const GEN = 'dossier-1';
const RAWTEXT = '.cache/raw-text';
const dump = (o) => yaml.dump(o, { lineWidth: -1, noRefs: true, quotingType: '"' });
const words = (t) => String(t).trim().split(/\s+/).filter(Boolean).length;
// Normalise for verbatim comparison: quotes, dashes, soft hyphens, section signs and whitespace.
const norm = (t) => String(t)
  .replace(/[‘’`]/g, "'").replace(/[“”]/g, '"').replace(/[–—‑−]/g, '-').replace(/­/g, '')
  .replace(/\s+/g, ' ').trim().toLowerCase();
const squash = (t) => norm(t).replace(/[^a-z0-9]/g, '');

const S = 'str', OS = 'ostr', IDS = 'ids', SA = 'strs', B = 'bool', N = 'num';
const COMMON = {
  kind: S, ref: S, base: 'base', units: IDS, weeks: IDS, topics: IDS, lists: IDS, 'one-liner': S, plain: S, analogy: OS,
  'exam-use': 'examuse', 'what-if': ['whatif'], limits: SA, sources: SA, verify: B, 'verify-notes': OS, locked: B,
};
const SHAPES = {
  case: {
    ...COMMON, court: S, year: N, judges: OS, 'key-facts': SA, parties: ['party'], timeline: ['beat'], issues: SA,
    reasoning: SA, outcome: S, ratio: S, obiter: OS, dissent: OS, contrasts: ['contrast'], statutes: IDS, quotes: ['quote'],
  },
  provision: {
    ...COMMON, instrument: S, short: S, part: OS, section: S, heading: S, text: S, elements: ['element'], logic: OS,
    'logic-note': OS, outcome: 'pout', factors: ['factor'], exceptions: SA, cases: IDS, related: IDS, examples: ['example'],
  },
  examuse: { when: S, sentence: S, pitfalls: SA },
  whatif: { change: S, effect: S },
  party: { name: S, role: S },
  beat: { label: S, text: S },
  contrast: { case: S, point: S },
  quote: { who: S, text: S, source: S },
  element: { id: S, label: S, test: S, plain: S, cases: IDS },
  pout: { met: S, failed: S },
  factor: { label: S, plain: S },
  example: { facts: S, analysis: S },
  caseBase: { name: S, citation: S, aglc: S, facts: S, issue: S, held: S, ratio: S, significance: S, 'why-here': OS },
  provBase: { title: S, kind: S, text: S, gloss: S, cases: IDS },
};
const REQUIRED = {
  case: ['kind', 'ref', 'units', 'one-liner', 'plain', 'sources', 'court', 'year', 'key-facts', 'issues', 'reasoning', 'outcome', 'ratio'],
  provision: ['kind', 'ref', 'units', 'one-liner', 'plain', 'sources', 'instrument', 'short', 'section', 'heading', 'text', 'elements', 'outcome'],
  examuse: ['when', 'sentence'], whatif: ['change', 'effect'], party: ['name', 'role'], beat: ['label', 'text'],
  contrast: ['case', 'point'], quote: ['who', 'text', 'source'], element: ['id', 'label', 'test', 'plain'], pout: ['met', 'failed'],
  factor: ['label', 'plain'], example: ['facts', 'analysis'],
  caseBase: ['name', 'citation', 'aglc', 'facts', 'issue', 'held', 'ratio', 'significance'], provBase: ['title', 'kind', 'text', 'gloss'],
};

function check(shapeName, obj, path, errors) {
  const shape = SHAPES[shapeName];
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return errors.push(`${path}: expected an object`);
  for (const k of Object.keys(obj)) if (!(k in shape)) errors.push(`${path}: unknown key "${k}"`);
  for (const k of REQUIRED[shapeName] || []) {
    const v = obj[k];
    if (v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length)) errors.push(`${path}: missing ${k}`);
  }
  for (const [k, t] of Object.entries(shape)) {
    const v = obj[k];
    if (v === undefined || v === null) continue;
    const p = `${path}.${k}`;
    if (t === S || t === OS) { if (typeof v !== 'string' || !v.trim()) errors.push(`${p}: expected text`); }
    else if (t === N) { if (!Number.isInteger(v)) errors.push(`${p}: expected a whole number`); }
    else if (t === B) { if (typeof v !== 'boolean') errors.push(`${p}: expected true/false`); }
    else if (t === IDS) { if (!Array.isArray(v) || v.some((x) => typeof x !== 'string' || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(x))) errors.push(`${p}: expected a list of kebab-case ids`); }
    else if (t === SA) { if (!Array.isArray(v) || v.some((x) => typeof x !== 'string' || !x.trim())) errors.push(`${p}: expected a list of text`); }
    else if (t === 'base') { /* checked by caller with the right shape */ }
    else if (Array.isArray(t)) { if (!Array.isArray(v)) errors.push(`${p}: expected a list`); else v.forEach((x, i) => check(t[0], x, `${p}[${i}]`, errors)); }
    else check(t, v, p, errors);
  }
}

let rawCache = null;
function rawText(source) {
  // raw/<unit-folder>/<path> → .cache/raw-text/<unit-folder>/<path>.txt (extract.mjs appends .txt)
  const rel = source.replace(/^raw\//, '').split(/\s+[—–-]\s+|\s+\(|#/)[0].trim();
  rawCache ??= new Map();
  if (rawCache.has(rel)) return rawCache.get(rel);
  let t = null;
  // File names in raw/ sometimes carry U+202F / U+00A0 (e.g. "10.21.55 am"); match on a space-normalised name.
  const sp = (x) => x.replace(/[   ]/g, ' ');
  const resolve = (p) => {
    if (existsSync(p)) return p;
    const dir = dirname(p);
    if (!existsSync(dir)) return null;
    const hit = readdirSync(dir).find((n) => sp(n) === sp(basename(p)));
    return hit ? join(dir, hit) : null;
  };
  for (const cand of [join(RAWTEXT, `${rel}.txt`), join(RAWTEXT, rel), join('raw', rel)]) {
    const p = resolve(cand);
    if (p && /\.(txt|md)$/.test(p)) { t = readFileSync(p, 'utf8'); break; }
  }
  rawCache.set(rel, t);
  return t;
}

export function specFiles() {
  const out = [];
  for (const sub of ['cases', 'provisions']) {
    const dir = join(SRC, sub);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).sort()) if (f.endsWith('.yaml') && !f.startsWith('_')) out.push(join(dir, f));
  }
  return out;
}

export function emitDossiers(files = specFiles(), { checkOnly = false, now = new Date().toISOString() } = {}) {
  const vocab = yaml.load(readFileSync(join(SRC, 'vocab.yaml'), 'utf8'), { schema: yaml.JSON_SCHEMA });
  const { data } = load(ROOT);
  const errors = [], warnings = [];
  const specs = [];
  for (const f of files) {
    try {
      const spec = yaml.load(readFileSync(f, 'utf8'), { schema: yaml.JSON_SCHEMA });
      specs.push({ f, spec, src: readFileSync(f, 'utf8') });
    } catch (e) { errors.push(`${f}: ${e.message}`); }
  }
  // Every spec in content-src counts toward "will exist" (a base created in another file of the same run).
  const willCase = new Set(data.cases.keys()), willAuth = new Set(data.authorities.keys());
  for (const f of specFiles()) {
    try {
      const s = yaml.load(readFileSync(f, 'utf8'), { schema: yaml.JSON_SCHEMA });
      if (s?.base) (s.kind === 'case' ? willCase : willAuth).add(s.ref);
    } catch { /* reported above if it's one of ours */ }
  }

  const report = { created: [], updated: [], unchanged: [], locked: [], bases: [] };
  const writes = [];
  for (const { f, spec, src } of specs) {
    const errs = [];
    const kind = spec?.kind;
    if (kind !== 'case' && kind !== 'provision') { errors.push(`${f}: kind must be case or provision`); continue; }
    check(kind, spec, f, errs);
    if (spec.ref && basename(f, '.yaml') !== spec.ref) errs.push(`${f}: file name must be <ref>.yaml (${spec.ref}.yaml)`);
    if (spec['one-liner'] && words(spec['one-liner']) > 30) errs.push(`${f}: one-liner is ${words(spec['one-liner'])} words (max 30)`);
    if (spec.plain && words(spec.plain) < 35) errs.push(`${f}: plain is ${words(spec.plain)} words (min 35)`);
    const exists = kind === 'case' ? data.cases.has(spec.ref) : data.authorities.has(spec.ref);
    if (!exists && !spec.base) errs.push(`${f}: ${spec.ref} is not in ${kind === 'case' ? 'cases' : 'authorities'} — add a base: block to create it`);
    if (spec.base) check(kind === 'case' ? 'caseBase' : 'provBase', spec.base, `${f}.base`, errs);
    if (spec.base && kind === 'provision' && !['statute', 'treaty', 'principle', 'article', 'other'].includes(spec.base.kind)) errs.push(`${f}.base.kind: statute|treaty|principle|article|other`);
    for (const u of spec.units || []) if (!data.units.has(u)) errs.push(`${f}: unknown unit ${u}`);
    for (const w of spec.weeks || []) if (!data.weeks.has(w)) errs.push(`${f}: unknown week ${w}`);
    for (const t of spec.topics || []) if (!(spec.units || []).some((u) => vocab.topics?.[u]?.[t])) errs.push(`${f}: topic ${t} is not in vocab.yaml for ${spec.units}`);
    for (const l of spec.lists || []) if (!vocab.lists?.[l]) errs.push(`${f}: unknown list ${l}`);
    if (kind === 'case' && spec.court && !vocab.courts?.[spec.court]) errs.push(`${f}: unknown court ${spec.court} (add it to vocab.yaml courts)`);
    if (kind === 'provision' && spec.logic && !['all', 'any', 'custom'].includes(spec.logic)) errs.push(`${f}: logic must be all|any|custom`);
    if (kind === 'provision' && spec.logic === 'custom' && !spec['logic-note']) errs.push(`${f}: logic custom needs logic-note`);
    const caseRef = (v, p) => { if (!willCase.has(v)) errs.push(`${f}: ${p} → unknown case ${v}`); };
    const authRef = (v, p) => { if (!willAuth.has(v)) errs.push(`${f}: ${p} → unknown authority ${v}`); };
    (spec.statutes || []).forEach((v) => authRef(v, 'statutes'));
    (spec.related || []).forEach((v) => authRef(v, 'related'));
    (spec.cases || []).forEach((v) => caseRef(v, 'cases'));
    (spec.contrasts || []).forEach((c) => caseRef(c.case, 'contrasts'));
    (spec.elements || []).forEach((e) => (e.cases || []).forEach((v) => caseRef(v, `elements.${e.id}`)));
    (spec.base?.cases || []).forEach((v) => caseRef(v, 'base.cases'));
    // List membership must match vocab: an item on a list says so, and vice versa.
    for (const [lid, l] of Object.entries(vocab.lists || {})) {
      const onList = [...(l.cases || []), ...(l.provisions || [])].some((x) => x.ref === spec.ref || (x.also || []).includes(spec.ref));
      const says = (spec.lists || []).includes(lid);
      if (onList && !says) errs.push(`${f}: on ${lid} but lists: does not include it`);
      if (!onList && says && (l.cases || l.provisions)) errs.push(`${f}: lists ${lid} but is not on that list in vocab.yaml`);
    }
    // Verbatim checks against raw text.
    if (!spec.verify) {
      for (const q of spec.quotes || []) {
        if (!/^raw\//.test(q.source)) continue;
        const t = rawText(q.source);
        if (t === null) errs.push(`${f}: quote source ${q.source} has no extracted text (run node scripts/extract.mjs)`);
        else if (!squash(t).includes(squash(q.text))) errs.push(`${f}: quote by ${q.who} is not verbatim in ${q.source} — fix it or set verify: true`);
      }
      if (kind === 'provision') {
        const rawSrc = (spec.sources || []).find((x) => /^raw\//.test(x));
        if (rawSrc) {
          const t = rawText(rawSrc);
          // Compare paragraph by paragraph so a provision quoted in parts still passes; every part must be present.
          const parts = String(spec.text).split(/\n\s*\n|\n(?=\s*\(\w+\))/).map((x) => x.trim()).filter((x) => squash(x).length > 12);
          if (t === null) warnings.push(`${f}: ${rawSrc} has no extracted text; text not checked`);
          else for (const p of parts) if (!squash(t).includes(squash(p))) { errs.push(`${f}: text is not verbatim in ${rawSrc}: "${p.slice(0, 80)}…" — fix it or set verify: true`); break; }
        }
      }
    } else if (!spec['verify-notes']) errs.push(`${f}: verify: true needs verify-notes saying what is unconfirmed`);
    if (errs.length) { errors.push(...errs); continue; }
    writes.push({ f, spec, src, kind });
  }
  if (errors.length || checkOnly) return { errors, warnings, report };

  const writeFile = (coll, id, fm, body = '') => {
    const path = join(ROOT, coll, `${id}.md`);
    const old = existsSync(path) ? readFileSync(path, 'utf8') : null;
    if (old && /^locked: true$/m.test(old)) { report.locked.push(`${coll}/${id}`); return; }
    const keepAt = old?.match(/^generated-at: "?([^"\n]+)"?$/m)?.[1];
    const clean = (at) => { const o = { ...fm }; const g = { 'source-hash': o['source-hash'], 'generator-version': o['generator-version'], 'generated-at': at, locked: false }; delete o['source-hash']; delete o['generator-version']; return `---\n${dump({ ...g, ...o })}---\n${body}`; };
    if (old && keepAt && clean(keepAt) === old) { report.unchanged.push(`${coll}/${id}`); return; }
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, clean(now));
    report[old ? 'updated' : 'created'].push(`${coll}/${id}`);
  };

  for (const { spec, src, kind } of writes) {
    const hash = createHash('sha256').update(src).digest('hex').slice(0, 16);
    const { base, kind: _k, locked: _l, ...rest } = spec;
    if (base) {
      const coll = kind === 'case' ? 'cases' : 'authorities';
      if (!(kind === 'case' ? data.cases : data.authorities).has(spec.ref)) {
        writeFile(coll, spec.ref, { 'source-hash': hash, 'generator-version': GEN, origin: 'dossier', ...base, units: spec.units, verify: !!spec.verify });
        report.bases.push(`${coll}/${spec.ref}`);
      }
    }
    const id = `${kind === 'case' ? 'case' : 'prov'}--${spec.ref}`;
    writeFile('dossiers', id, { 'source-hash': hash, 'generator-version': GEN, kind, ...rest, verify: !!spec.verify });
  }
  return { errors, warnings, report };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const checkOnly = process.argv.includes('--check');
  const files = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const { errors, warnings, report } = emitDossiers(files.length ? files : specFiles(), { checkOnly });
  for (const w of warnings) console.warn(`  warn ${w}`);
  if (errors.length) { for (const e of errors) console.error(`  ✗ ${e}`); console.error(`emit-dossiers: ${errors.length} error(s); nothing written`); process.exit(1); }
  if (checkOnly) console.log(`emit-dossiers --check: ${files.length || specFiles().length} spec(s) OK`);
  else for (const [k, v] of Object.entries(report)) console.log(`  ${k.padEnd(9)} ${v.length}${k !== 'unchanged' && v.length && v.length <= 12 ? '  ' + v.join(', ') : ''}`);
}
