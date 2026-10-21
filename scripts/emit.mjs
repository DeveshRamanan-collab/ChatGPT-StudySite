// Emits typed content files from a week spec (content-src/<unit>-wNN.yaml) written during ingestion.
// Deterministic and idempotent: stamps source-hash / generator-version / generated-at; keeps generated-at when
// nothing else changed (so re-runs produce no diff); never touches locked: true files; every week file carries the
// week's id prefix (<unit>-wNN-…) so the gate's isolation check applies. Cases and authorities are shared across
// weeks: an existing one is left alone (its units list is extended), a new one is created.
// Usage: node scripts/emit.mjs content-src/laws2400-w01.yaml [--dry]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import yaml from 'js-yaml';
import { sourceHash } from './source-hash.mjs';

const ROOT = 'src/content';
const pad = (n, w = 2) => String(n).padStart(w, '0');
const dump = (o) => yaml.dump(o, { lineWidth: -1, noRefs: true, quotingType: '"' });

function readExisting(path) {
  if (!existsSync(path)) return null;
  const src = readFileSync(path, 'utf8');
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  return { data: yaml.load(m[1], { schema: yaml.JSON_SCHEMA }) ?? {}, body: m[2], src };
}

export function emit(specPath, { dry = false, now = new Date().toISOString() } = {}) {
  const spec = yaml.load(readFileSync(specPath, 'utf8'), { schema: yaml.JSON_SCHEMA });
  const { unit, week } = spec;
  if (!/^[a-z]+\d{4}$/.test(unit) || !Number.isInteger(week)) throw new Error(`${specPath}: unit/week missing`);
  const wk = `${unit}-w${pad(week)}`;
  const hash = spec.source ? sourceHash(spec.source) : 'none';
  const gen = spec.generator || 'ingest-1';
  const report = { created: [], updated: [], unchanged: [], locked: [], shared: [] };

  const localConcepts = new Set((spec.concepts || []).map((c) => c.slug));
  const conceptId = (s) => (localConcepts.has(s) ? `${wk}-${s}` : s); // full ids pass through for cross-week links
  const qKeys = new Map((spec.questions || []).map((q, i) => [q.key ?? `q${pad(i + 1, 3)}`, `${wk}-q${pad(i + 1, 3)}`]));
  const qId = (k) => qKeys.get(k) ?? k;

  function write(coll, id, data, body = '', { shared = false } = {}) {
    const path = join(ROOT, coll, `${id}.md`);
    const old = readExisting(path);
    if (old?.data.locked) return report.locked.push(`${coll}/${id}`);
    // Shared cards (cases/authorities): the week that created one (origin) owns it; other weeks only add their unit.
    const foreign = shared && old && old.data.origin !== wk;
    if (shared) data = { origin: foreign ? old.data.origin : wk, ...data };
    if (shared && old) data.units = [...new Set([...(old.data.units || []), ...(data.units || []), unit])];
    if (foreign) {
      const units = data.units;
      if (units.length === (old.data.units || []).length) return report.shared.push(`${coll}/${id}`);
      data = { ...old.data, units };
      body = old.body.replace(/^\n/, '');
    }
    const stamp = { 'source-hash': foreign ? old.data['source-hash'] : hash, 'generator-version': foreign ? old.data['generator-version'] : gen };
    const make = (at) => {
      const fm = { ...stamp, 'generated-at': at, locked: false, verify: !!data.verify, ...data };
      delete fm.verify; fm.verify = !!data.verify; // stable key order
      return `---\n${dump(fm)}---\n${body ? `\n${body.trim()}\n` : ''}`;
    };
    const keepAt = old?.data['generated-at'];
    if (old && keepAt && make(keepAt) === old.src) return report.unchanged.push(`${coll}/${id}`);
    if (!dry) {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, make(now));
    }
    report[old ? 'updated' : 'created'].push(`${coll}/${id}`);
  }

  // Week
  const w = spec.week_file; // absent for the long-question spec (week 0)
  if (w) write('weeks', wk, {
    unit, number: week, topic: w.topic, summary: w.summary,
    ...(w.thin ? { thin: true, 'thin-reason': w['thin-reason'] } : {}),
    ...(w['source-note'] ? { 'source-note': w['source-note'] } : {}),
    concepts: (spec.concepts || []).map((c) => conceptId(c.slug)),
    pretest: (spec.pretest || []).map(qId),
  }, w.notes);

  for (const c of spec.concepts || []) {
    const { slug, body, verify, ...rest } = c;
    write('concepts', conceptId(slug), {
      unit, week: wk, title: rest.title, visual: rest.visual, 'visual-brief': rest['visual-brief'],
      related: (rest.related || []).map(conceptId), 'depends-on': (rest['depends-on'] || []).map(conceptId),
      'contrasts-with': (rest['contrasts-with'] || []).map(conceptId), cases: rest.cases || [], authorities: rest.authorities || [], verify,
    }, body);
  }
  for (const k of spec.cases || []) {
    const { slug, ...d } = k;
    write('cases', slug, { ...d, units: [unit] }, '', { shared: true });
  }
  for (const a of spec.authorities || []) {
    const { slug, ...d } = a;
    write('authorities', slug, { ...d, units: [unit] }, '', { shared: true });
  }
  (spec.questions || []).forEach((q, i) => {
    const { key, concept, ...d } = q;
    const out = { type: d.type, concept: conceptId(concept), ...(w ? { week: wk } : {}), ...d };
    if (d['variant-of']) out['variant-of'] = qId(d['variant-of']);
    if (d['contrasts-with']) out['contrasts-with'] = [].concat(d['contrasts-with']).map(conceptId);
    out.type = d.type;
    write('questions', `${wk}-q${pad(i + 1, 3)}`, out);
  });
  (spec.cards || []).forEach((c, i) => {
    const { concept, ...d } = c;
    write('cards', `${wk}-c${pad(i + 1, 3)}`, { type: d.type, concept: conceptId(concept), ...(w ? { week: wk } : {}), ...d });
  });
  if (spec.audio) write('audio', wk, { unit, week: wk, title: spec.audio.title, minutes: spec.audio.minutes }, spec.audio.script);

  return report;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dry = process.argv.includes('--dry');
  for (const f of process.argv.slice(2).filter((a) => !a.startsWith('--'))) {
    const r = emit(f, { dry });
    console.log(`${f}${dry ? ' (dry run)' : ''}`);
    for (const [k, v] of Object.entries(r)) console.log(`  ${k.padEnd(9)} ${v.length}${k !== 'unchanged' && v.length && v.length <= 12 ? '  ' + v.join(', ') : ''}`);
  }
}
