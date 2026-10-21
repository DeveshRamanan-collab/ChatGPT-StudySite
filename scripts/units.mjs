// Unit files from raw/<folder>/unit.yaml — the single source for exam details (date, start, duration, reading /
// working / technical time, mode, venue, notes, draft status). Writes src/content/units/<id>.md; every exam-dependent
// feature (home tiles, hub countdown, drawer, plan, dashboard readiness, FSRS retention, exam paper, palette) reads
// those. Idempotent: an unchanged unit.yaml leaves its file untouched. `--check` exits 1 if any file is out of date.
// Usage: node scripts/units.mjs [--check]
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import yaml from 'js-yaml';

const RAW = 'raw', OUT = 'src/content/units', GEN = 'units-1';
const check = process.argv.includes('--check');

export function unitFiles() {
  const out = [];
  for (const folder of readdirSync(RAW).sort()) {
    const p = join(RAW, folder, 'unit.yaml');
    if (!existsSync(p)) continue;
    const src = readFileSync(p, 'utf8');
    const u = yaml.load(src, { schema: yaml.JSON_SCHEMA });
    const id = String(u.code).toLowerCase();
    const e = u.exam ?? {};
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(u['exam-date']))) throw new Error(`${p}: exam-date must be YYYY-MM-DD`);
    if (!e.start || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?[+-]\d{2}:\d{2}$/.test(String(e.start))) throw new Error(`${p}: exam.start must be an ISO time with offset`);
    // exam-date is the Sydney calendar day of exam.start; they must agree.
    const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Sydney' }).format(new Date(e.start));
    if (day !== u['exam-date']) throw new Error(`${p}: exam-date ${u['exam-date']} is not the Sydney day of exam.start (${day})`);
    const data = {
      seed: false,
      'source-hash': createHash('sha256').update(src).digest('hex').slice(0, 16),
      'generator-version': GEN,
      'generated-at': new Date().toISOString(),
      locked: false,
      verify: e.status !== 'final',
      code: u.code,
      name: u.name,
      'exam-date': u['exam-date'],
      'answer-style': u['answer-style'],
      'weeks-expected': u['weeks-expected'],
      'exam-start': e.start,
      'exam-duration': e['duration-min'],
      ...(e['reading-min'] != null ? { 'exam-reading': e['reading-min'] } : {}),
      ...(e['working-min'] != null ? { 'exam-working': e['working-min'] } : {}),
      ...(e['technical-min'] != null ? { 'exam-technical': e['technical-min'] } : {}),
      'exam-mode': e.mode,
      ...(e.venue ? { 'exam-venue': e.venue } : {}),
      ...(e.notes ? { 'exam-notes': e.notes } : {}),
      'exam-status': e.status === 'final' ? 'final' : 'draft',
      ...(e.source ? { 'exam-source': e.source } : {}),
    };
    out.push({ id, path: join(OUT, `${id}.md`), data });
  }
  return out;
}

const fm = (d) => `---\n${yaml.dump(d, { lineWidth: 120, schema: yaml.JSON_SCHEMA })}---\n`;
const hashOf = (s) => (s.match(/^source-hash: (\S+)$/m) || [])[1]?.replace(/['"]/g, '');
const genOf = (s) => (s.match(/^generator-version: (\S+)$/m) || [])[1]?.replace(/['"]/g, '');

function main() {
let stale = 0, wrote = 0;
for (const f of unitFiles()) {
  const prev = existsSync(f.path) ? readFileSync(f.path, 'utf8') : '';
  if (hashOf(prev) === f.data['source-hash'] && genOf(prev) === GEN) continue;
  if (check) { stale++; console.error(`stale: ${f.path} (run node scripts/units.mjs)`); continue; }
  writeFileSync(f.path, fm(f.data));
  wrote++;
}
if (check && stale) process.exit(1);
if (!check) console.log(`units: ${wrote} written`);
}
if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
