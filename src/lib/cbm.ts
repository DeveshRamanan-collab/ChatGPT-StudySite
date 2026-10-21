// Certainty-based marking (exam simulation only): C1/C2/C3 → +1/+2/+3 if right, 0/−2/−6 if wrong.
import type { Confidence } from './db';

export type Certainty = 1 | 2 | 3;
const RIGHT = { 1: 1, 2: 2, 3: 3 } as const;
const WRONG = { 1: 0, 2: -2, 3: -6 } as const;

export const cbm = (c: Certainty, correct: boolean) => (correct ? RIGHT[c] : WRONG[c]);

/** Map to the everyday confidence scale for calibration charts. */
export const certaintyToConfidence = (c: Certainty): Confidence => (c === 3 ? 'sure' : c === 2 ? 'unsure' : 'guess');

export function cbmTotals(answers: { certainty: Certainty; correct: boolean }[]) {
  const score = answers.reduce((s, a) => s + cbm(a.certainty, a.correct), 0);
  const max = answers.length * 3;
  const byLevel = ([1, 2, 3] as Certainty[]).map((level) => {
    const xs = answers.filter((a) => a.certainty === level);
    return { level, n: xs.length, accuracy: xs.length ? xs.filter((a) => a.correct).length / xs.length : 0 };
  });
  return { score, max, accuracy: answers.length ? answers.filter((a) => a.correct).length / answers.length : 0, byLevel };
}
