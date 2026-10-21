// Quality gate for a week spec: fails on giveaway patterns and thin explanations.
// Usage: node scripts/qa-week.mjs content-src/<unit>-wNN.yaml [...]
import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';

export const LIMITS = { correctLongestMax: 0.35, correctShortestMax: 0.35, correctExtremeMin: 0.10, whyMin: 60, quickfire: 20, shortAnswers: 6, pretest: 5, cardsMin: 25, perConceptMin: 20 };

export function qa(spec) {
  const problems = [];
  const qs = spec.questions || [];
  const mcq = qs.filter((q) => q.type === 'mcq');
  const longest = mcq.filter((q) => {
    const L = q.options.map((o) => o.text.length);
    const c = q.options.findIndex((o) => o.correct);
    return L[c] === Math.max(...L) && L.filter((x) => x === L[c]).length === 1;
  });
  const rate = mcq.length ? longest.length / mcq.length : 0;
  if (rate > LIMITS.correctLongestMax)
    problems.push(`correct option is the unique longest in ${(rate * 100).toFixed(0)}% of MCQs (max ${LIMITS.correctLongestMax * 100}%): ${longest.slice(0, 40).map((q) => q.key).join(', ')}${longest.length > 40 ? ' …' : ''}`);
  const shortest = mcq.filter((q) => {
    const L = q.options.map((o) => o.text.length);
    const c = q.options.findIndex((o) => o.correct);
    return L[c] === Math.min(...L) && L.filter((x) => x === L[c]).length === 1;
  });
  const srate = mcq.length ? shortest.length / mcq.length : 0;
  if (srate > LIMITS.correctShortestMax)
    problems.push(`correct option is the unique shortest in ${(srate * 100).toFixed(0)}% of MCQs (max ${LIMITS.correctShortestMax * 100}%): ${shortest.slice(0, 40).map((q) => q.key).join(', ')}${shortest.length > 40 ? ' …' : ''}`);
  // Never-longest / never-shortest is a cue too: a savvy student rules out the extremes.
  if (mcq.length >= 20 && rate < LIMITS.correctExtremeMin)
    problems.push(`correct option is almost never the longest (${(rate * 100).toFixed(0)}%, min ${LIMITS.correctExtremeMin * 100}%): make it the longest in some questions`);
  if (mcq.length >= 20 && srate < LIMITS.correctExtremeMin)
    problems.push(`correct option is almost never the shortest (${(srate * 100).toFixed(0)}%, min ${LIMITS.correctExtremeMin * 100}%): make it the shortest in some questions`);
  const thin = [];
  for (const q of qs) {
    const whys = q.type === 'mcq' ? q.options.map((o) => o.why) : q.type === 'truefalse' ? [q.why] : [];
    if (whys.some((w) => !w || w.trim().length < LIMITS.whyMin)) thin.push(q.key);
    if (whys.some((w) => /see (the )?notes/i.test(w || ''))) problems.push(`${q.key}: "see notes" in a why`);
  }
  if (thin.length) problems.push(`why shorter than ${LIMITS.whyMin} chars: ${thin.join(', ')}`);
  // Thin weeks (flowchart-only sources) report count shortfalls instead of padding to the targets.
  const shortfall = [];
  const miss = (msg) => (spec.week_file?.thin ? shortfall : problems).push(msg);
  const quick = qs.filter((q) => q.set === 'quickfire').length;
  if (spec.week_file && quick !== LIMITS.quickfire) miss(`quick-fire set has ${quick} (needs ${LIMITS.quickfire})`);
  const shorts = qs.filter((q) => q.type === 'short').length;
  if (spec.week_file && shorts < LIMITS.shortAnswers) miss(`${shorts} short answers (needs ${LIMITS.shortAnswers})`);
  if (spec.week_file && (spec.pretest || []).length !== LIMITS.pretest) miss(`pretest has ${(spec.pretest || []).length} (needs ${LIMITS.pretest})`);
  if (spec.week_file && (spec.cards || []).length < LIMITS.cardsMin) miss(`${(spec.cards || []).length} cards (needs ${LIMITS.cardsMin})`);
  if (spec.week_file?.thin && !spec.week_file['thin-reason']) problems.push('thin: true needs a thin-reason naming the missing sources');
  for (const c of spec.concepts || []) {
    const n = qs.filter((q) => q.concept === c.slug).length;
    // Thin weeks (flowchart-only sources) report the shortfall instead of padding to the target.
    if (n < LIMITS.perConceptMin) miss(`concept ${c.slug}: ${n} questions (target ${LIMITS.perConceptMin})`);
    const words = (c.body || '').split(/\s+/).filter(Boolean).length;
    if (words > 250) problems.push(`concept ${c.slug}: body ${words} words (max 250)`);
  }
  return { problems, shortfall, stats: { mcq: mcq.length, correctLongest: rate, correctShortest: srate, questions: qs.length, cards: (spec.cards || []).length } };
}

for (const f of process.argv.slice(2)) {
  const { problems, shortfall, stats } = qa(yaml.load(readFileSync(f, 'utf8'), { schema: yaml.JSON_SCHEMA }));
  console.log(`${f}: ${stats.questions} questions, ${stats.mcq} MCQ, correct-longest ${(stats.correctLongest * 100).toFixed(0)}%, correct-shortest ${(stats.correctShortest * 100).toFixed(0)}%, ${stats.cards} cards`);
  for (const p of problems) console.log(`  ✗ ${p}`);
  for (const p of shortfall) console.log(`  ~ thin week, shortfall: ${p}`);
  if (problems.length) process.exitCode = 1;
  else console.log('  ✓ qa ok');
}
