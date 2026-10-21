// Content audit (the /audit-content skill as a script). Usage: node scripts/audit.mjs [unit|all] [--out reports/...].
// Runs the validator, then per unit: weeks ingested vs expected, concepts, explainer coverage, cases/authorities,
// verify: true items with their source sentence, questions/concept vs 20, short answers/week vs 6, long questions
// per tier vs 4, cards/week vs 25, pretests, audio, locked files, the 10 weakest `why`s and longest-correct MCQs.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { load, validate } from './validate.mjs';

const ROOT = 'src/content';
const args = process.argv.slice(2);
const want = (args.find((a) => !a.startsWith('--')) ?? 'all').toLowerCase();
const outIdx = args.indexOf('--out');
const date = new Date().toISOString().slice(0, 10);
const out = outIdx >= 0 ? args[outIdx + 1] : `reports/audit-${date}.md`;

const v = validate(ROOT);
const { data } = load(ROOT);
const manifest = JSON.parse(readFileSync('src/components/explainers/manifest.json', 'utf8'));
const real = (m) => [...m.entries()].filter(([id, x]) => !id.startsWith('seed-') && !x.seed);
const weekOf = (q) => q.week ?? '';
const clip = (s, n = 160) => { const t = String(s ?? '').replace(/\s+/g, ' ').trim(); return t.length > n ? `${t.slice(0, n - 1)}…` : t; };

const units = real(data.units).map(([id, u]) => ({ id, ...u })).filter((u) => want === 'all' || u.id === want || u.code?.toLowerCase() === want);
if (!units.length) { console.error(`no unit "${want}"`); process.exit(1); }

const lines = [`# Content audit — ${date}`, '', `Scope: ${want}. Validator: ${v.errors.length ? `**${v.errors.length} errors**` : 'ok'}${v.warnings?.length ? `, ${v.warnings.length} warnings` : ''}.`, ''];
if (v.errors.length) lines.push(...v.errors.map((e) => `- ${e}`), '');
const summary = [];

for (const u of units) {
  const inUnit = (id) => id.startsWith(`${u.id}-`);
  const weeks = real(data.weeks).filter(([id]) => inUnit(id)).sort(([a], [b]) => a.localeCompare(b));
  const concepts = real(data.concepts).filter(([id]) => inUnit(id));
  const questions = real(data.questions).filter(([id]) => inUnit(id));
  const cards = real(data.cards).filter(([id]) => inUnit(id));
  const audio = real(data.audio).filter(([id]) => inUnit(id));
  const cases = real(data.cases).filter(([, c]) => (c.units ?? []).includes(u.id) || String(c.origin ?? '').startsWith(u.id));
  const auths = real(data.authorities).filter(([, a]) => (a.units ?? []).includes(u.id) || String(a.origin ?? '').startsWith(u.id));
  const all = [...weeks, ...concepts, ...questions, ...cards, ...audio, ...cases, ...auths];
  const verify = [...(u.verify ? [[u.id, { ...u, __file: `units/${u.id}.md` }]] : []), ...all.filter(([, x]) => x.verify)];
  const locked = all.filter(([, x]) => x.locked);
  const noExplainer = concepts.filter(([id]) => !manifest[id]);
  const perConcept = new Map(concepts.map(([id]) => [id, 0]));
  for (const [, q] of questions) if (perConcept.has(q.concept)) perConcept.set(q.concept, perConcept.get(q.concept) + 1);
  const under = [...perConcept].filter(([, n]) => n < 20);
  const byWeek = (items, pred = () => true) => {
    const m = new Map(weeks.map(([id]) => [id, 0]));
    for (const [, x] of items) if (pred(x) && m.has(weekOf(x))) m.set(weekOf(x), m.get(weekOf(x)) + 1);
    return m;
  };
  const shortW = byWeek(questions, (q) => q.type === 'short');
  const cardW = byWeek(cards);
  const tiers = { worked: 0, faded: 0, full: 0 };
  for (const [, q] of questions) if (q.type === 'long' && q.tier in tiers) tiers[q.tier]++;
  const audioWeeks = new Set(audio.map(([id]) => id));

  lines.push(`## ${u.code} ${u.name}`, '');
  lines.push('| Measure | Value | Target |', '|---|---|---|');
  lines.push(`| Weeks ingested | ${weeks.length} (${weeks.map(([id]) => id.slice(-3)).join(', ') || '—'}) | ${u['weeks-expected'] ?? '?'} |`);
  lines.push(`| Concepts | ${concepts.length} | — |`);
  lines.push(`| Concepts with an explainer | ${concepts.length - noExplainer.length} | — |`);
  lines.push(`| Cases / authorities | ${cases.length} / ${auths.length} | — |`);
  lines.push(`| verify: true items | ${verify.length} | 0 after review |`);
  lines.push(`| Questions per concept (min–max) | ${Math.min(...perConcept.values())}–${Math.max(...perConcept.values())}; ${under.length} under target | 20 |`);
  lines.push(`| Short answers per week | ${[...shortW.values()].join(', ')} | 6 |`);
  lines.push(`| Long questions per tier (worked/faded/full) | ${tiers.worked}/${tiers.faded}/${tiers.full} | 4/4/4 |`);
  lines.push(`| Cards per week | ${[...cardW.values()].join(', ')} | 25 |`);
  lines.push(`| Pretests present | ${weeks.filter(([, w]) => (w.pretest ?? []).length).length} of ${weeks.length} | all |`);
  lines.push(`| Audio scripts present | ${weeks.filter(([id]) => audioWeeks.has(id)).length} of ${weeks.length} | all |`);
  lines.push(`| Locked files | ${locked.length} | — |`, '');

  if (under.length) lines.push('**Concepts under 20 questions:** ' + under.map(([id, n]) => `${id} (${n})`).join(', '), '');

  lines.push(`### verify: true (${verify.length})`, '');
  lines.push('Each item with the sentence it rests on. Check against raw/ or the primary source, correct it, then set `locked: true`.', '');
  for (const [id, x] of verify) {
    const basis = x.citation
      ? `${x.name} — ${x.citation}. ${clip(x.ratio ?? x.significance)}`
      : x['exam-date']
        ? `exam date ${x['exam-date']} (placeholder until the timetable is confirmed)`
        : x.kind && x.text
          ? `${x.title}: ${clip(x.text)}`
          : clip(x.stem ?? x.front ?? x.title ?? x.text ?? x.summary);
    lines.push(`- \`${x.__file}\` — ${basis}${x.source ? ` _(source: ${clip(x.source, 80)})_` : ''}`);
  }
  lines.push('');

  const whys = [];
  for (const [id, q] of questions) for (const o of q.options ?? []) if (o.why) whys.push({ id, why: o.why });
  if (!questions.some(([, q]) => q.options)) for (const [id, q] of questions) if (q.why) whys.push({ id, why: q.why });
  whys.sort((a, b) => a.why.length - b.why.length);
  const seen = new Set();
  const weakest = whys.filter((w) => !seen.has(w.id) && seen.add(w.id)); // one (the shortest) per question
  lines.push('### 10 weakest explanations (shortest `why`)', '');
  for (const w of weakest.slice(0, 10)) lines.push(`- ${w.id} (${w.why.length} chars): ${clip(w.why, 140)}`);
  lines.push('');

  const mcqs = questions.filter(([, q]) => q.type === 'mcq' && q.options?.length);
  const longest = mcqs.filter(([, q]) => {
    const lens = q.options.map((o) => o.text.length);
    const c = q.options.findIndex((o) => o.correct);
    return lens[c] === Math.max(...lens) && lens.filter((l) => l === lens[c]).length === 1;
  });
  const pct = mcqs.length ? Math.round((longest.length / mcqs.length) * 100) : 0;
  lines.push(`### Correct option is the unique longest: ${longest.length} of ${mcqs.length} MCQs (${pct}%)`, '');
  lines.push(`Within the 10–35% band the QA gate allows, so length is not a giveaway overall.${pct > 35 ? ' **Above the band — rebalance.**' : ''}`, '');
  const worst = longest.map(([id, q]) => {
    const lens = q.options.map((o) => o.text.length).sort((a, b) => b - a);
    return { id, ratio: lens[0] / lens[1] };
  }).sort((a, b) => b.ratio - a.ratio).slice(0, 10);
  if (worst.length) lines.push('Most conspicuous (correct option much longer than the next): ' + worst.map((w) => `${w.id} (×${w.ratio.toFixed(2)})`).join(', '), '');

  summary.push({ u, weeks, verify, under, noExplainer, pct, cardW, shortW });
}

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, lines.join('\n') + '\n');
for (const s of summary)
  console.log(`${s.u.code}: ${s.weeks.length}/${s.u['weeks-expected']} weeks, ${s.verify.length} verify, ${s.under.length} concepts < 20 q, ${s.noExplainer.length} concepts without explainer, longest-correct ${s.pct}%`);
console.log(`wrote ${out}`);
