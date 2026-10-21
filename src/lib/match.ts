// Sentence matching for rubric highlighting: which sentences of a model answer best satisfy a criterion.
// Deterministic keyword overlap (stop-words removed, crude stemming); good enough to point the eye.

const STOP = new Set(
  'a an and are as at be by for from has have in into is it its of on or that the their this to was were which with not no but if then than there these those also any can may must will would should could does did do such other each more most whether where when who whom what how why under over within because therefore thus likely very about between states discusses explains identifies applies uses answer'.split(' '),
);

const stem = (w: string) => w.replace(/(ings?|edly|ed|es|s|ly|ment|ness|ion|ions)$/, '').slice(0, 7);

export function tokens(text: string): Set<string> {
  return new Set(
    text.toLowerCase().replace(/[’']/g, '').split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w)).map(stem),
  );
}

/** Split into sentences, keeping citations like "s 5B(2)" and "(1980) 146 CLR 40" intact. */
export function sentences(text: string): string[] {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-Z(“"])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Indices of the sentences that best match the criterion (score ≥ threshold, top `max`). */
export function matchSentences(model: string, criterionText: string, { max = 2, threshold = 0.12 } = {}): number[] {
  const want = tokens(criterionText);
  if (!want.size) return [];
  return sentences(model)
    .map((s, i) => {
      const t = tokens(s);
      let hit = 0;
      for (const w of want) if (t.has(w)) hit++;
      return { i, hit, score: hit / Math.sqrt(want.size * Math.max(1, t.size)) };
    })
    .filter((x) => x.score >= threshold && x.hit >= Math.min(2, want.size))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, max)
    .map((x) => x.i)
    .sort((a, b) => a - b);
}

/** Rubric score 0–1 from ticked rows. */
export function rubricScore(rows: { id: string; marks: number }[], ticked: Iterable<string>) {
  const t = new Set(ticked);
  const total = rows.reduce((s, r) => s + r.marks, 0);
  const got = rows.filter((r) => t.has(r.id)).reduce((s, r) => s + r.marks, 0);
  return { got, total, score: total ? got / total : 0 };
}
