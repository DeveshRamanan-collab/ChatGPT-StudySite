// Long-question tiers: worked → faded → full. Two passes (≥ 70%) at the current tier promote the concept.
import { db, type Attempt } from './db';

export type Tier = 'worked' | 'faded' | 'full';
export const TIERS: Tier[] = ['worked', 'faded', 'full'];
export const PASS = 0.7;
export const PASSES_TO_PROMOTE = 2;

export const nextTier = (t: Tier): Tier => TIERS[Math.min(TIERS.length - 1, TIERS.indexOf(t) + 1)];

/** Pure: the tier a concept should be at, given its long-answer attempts in time order. */
export function tierFrom(attempts: Pick<Attempt, 'type' | 'tier' | 'score' | 'at'>[]): Tier {
  let tier: Tier = 'worked';
  let passes = 0;
  for (const a of [...attempts].sort((x, y) => x.at - y.at)) {
    if (a.type !== 'long' || a.tier !== tier) continue;
    if ((a.score ?? 0) >= PASS) passes += 1;
    if (passes >= PASSES_TO_PROMOTE && tier !== 'full') {
      tier = nextTier(tier);
      passes = 0;
    }
  }
  return tier;
}

export async function currentTier(concept: string): Promise<Tier> {
  return tierFrom(await db.attempts.where('concept').equals(concept).toArray());
}

/** Australian university grade bands (HD/D/Cr/P) from a 0–1 score. */
export function band(score: number) {
  if (score >= 0.85) return 'High Distinction';
  if (score >= 0.75) return 'Distinction';
  if (score >= 0.65) return 'Credit';
  if (score >= 0.5) return 'Pass';
  return 'Not yet a pass';
}
