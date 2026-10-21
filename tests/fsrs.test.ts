import { describe, it, expect } from 'vitest';
import { review, retentionFor, optimise, ankiCsv, renderCloze, DAY, Rating, fromStored, type ReviewLogRow } from '../src/lib/fsrs';
import { forgetting_curve, default_w, type Grade } from 'ts-fsrs';
import type { CardState } from '../src/lib/db';

// Deterministic PRNG so the simulation is repeatable.
function rng(seed: number) { return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32); }

describe('FSRS 30-day simulation', () => {
  it('schedules a 60-card deck sensibly over 30 days', () => {
    const rand = rng(7);
    const start = Date.UTC(2026, 9, 1, 22);
    const states = new Map<string, CardState>();
    const logs: ReviewLogRow[] = [];
    const ids = Array.from({ length: 60 }, (_, i) => `c${i}`);
    let recalled = 0, reviewed = 0, maxDaily = 0;
    for (let day = 0; day < 30; day++) {
      const now0 = start + day * DAY;
      // 20 new cards a day for the first three days, then due cards only.
      const fresh = day < 3 ? ids.slice(day * 20, day * 20 + 20) : [];
      let today = 0;
      for (let pass = 0; pass < 4; pass++) {
        const now = now0 + pass * 15 * 60_000;
        const due = [...states.values()].filter((s) => s.due <= now).map((s) => s.cardId);
        for (const id of pass === 0 ? [...fresh, ...due] : due) {
          const prev = states.get(id);
          const card = fromStored(prev?.fsrs, now);
          const elapsed = card.last_review ? (now - +card.last_review) / DAY : 0;
          const p = prev && card.stability > 0 ? forgetting_curve([...default_w], elapsed, card.stability) : 0.6;
          const ok = rand() < p;
          const grade = (ok ? Rating.Good : Rating.Again) as Grade;
          if (prev && card.state === 2) { reviewed++; if (ok) recalled++; }
          const r = review(id, 'laws2400', prev, grade, now, { retention: 0.9 });
          states.set(id, r.state);
          logs.push(r.log);
          today++;
        }
      }
      maxDaily = Math.max(maxDaily, today);
    }
    const retention = recalled / reviewed;
    expect(reviewed).toBeGreaterThan(50);
    expect(retention).toBeGreaterThan(0.8);
    expect(retention).toBeLessThan(0.99);
    // Every card has a due date in the future of its last review, and good cards have grown intervals.
    for (const s of states.values()) expect(s.due).toBeGreaterThan(s.lastReview!);
    const longest = Math.max(...[...states.values()].map((s) => (s.due - s.lastReview!) / DAY));
    expect(longest).toBeGreaterThan(7);
    expect(maxDaily).toBeLessThan(120);
  });

  it('raises desired retention to 0.93 within 14 days of the exam, which shortens intervals', () => {
    const exam = Date.UTC(2026, 10, 12);
    expect(retentionFor(exam, exam - 20 * DAY)).toBe(0.9);
    expect(retentionFor(exam, exam - 10 * DAY)).toBe(0.93);
    expect(retentionFor(exam, exam + DAY)).toBe(0.9);
    const now = Date.UTC(2026, 9, 1);
    let a: CardState | undefined, b: CardState | undefined;
    for (let i = 0; i < 4; i++) {
      const t = now + i * 10 * DAY;
      a = review('x', 'd', a, Rating.Good as Grade, Math.max(t, a?.due ?? 0), { retention: 0.9 }).state;
      b = review('x', 'd', b, Rating.Good as Grade, Math.max(t, b?.due ?? 0), { retention: 0.93 }).state;
    }
    expect(b!.due - b!.lastReview!).toBeLessThan(a!.due - a!.lastReview!);
  });

  it('optimises a deck only after 400 reviews and moves toward the true stability', () => {
    const few: ReviewLogRow[] = Array.from({ length: 100 }, (_, i) => ({ cardId: `c${i}`, deck: 'd', grade: 3, state: 2, elapsed: 5, stability: 5, at: i }));
    expect(optimise(few)).toBeUndefined();
    // Learner forgets faster than the model thinks: true stability is half the model's.
    const rand = rng(3);
    const many: ReviewLogRow[] = Array.from({ length: 600 }, (_, i) => {
      const s = 2 + (i % 20), t = 1 + (i % 15);
      const p = forgetting_curve([...default_w], t, s * 0.5);
      return { cardId: `c${i}`, deck: 'd', grade: (rand() < p ? 3 : 1) as Grade, state: 2, elapsed: t, stability: s, at: i };
    });
    const o = optimise(many)!;
    expect(o).toBeDefined();
    expect(o.loss).toBeLessThan(o.baseline);
    expect(o.w[0]).toBeLessThan(default_w[0]);
  });

  it('exports Anki CSV and renders cloze', () => {
    const csv = ankiCsv([{ front: 'A "quoted" front', back: 'line1\nline2', tags: ['laws2400', 'w01'] }]);
    expect(csv).toContain('#separator:semicolon');
    expect(csv).toContain('"A ""quoted"" front";"line1<br>line2";"laws2400 w01"');
    expect(renderCloze('Duty needs {{c1::foreseeability}} and {{c2::proximity::p}}.', false)).toBe('Duty needs ⟦…⟧ and ⟦p…⟧.');
    expect(renderCloze('Duty needs {{c1::foreseeability}}.', true)).toBe('Duty needs ⟦foreseeability⟧.');
  });
});

import { makeCloze } from '../src/lib/sentence-card';
import { buildQueue, NEW_PER_DAY, type DeckCard } from '../src/components/cards/CardReview';

describe('sentence-to-card and queue', () => {
  it('makes a cloze of the selection inside its sentence', () => {
    const p = 'Duty is the first element. Breach asks whether the defendant fell below the standard of care. Damage follows.';
    expect(makeCloze(p, 'standard of care')).toEqual({ sentence: 'Breach asks whether the defendant fell below the standard of care.', cloze: 'Breach asks whether the defendant fell below the {{c1::standard of care}}.' });
    expect(makeCloze(p, 'Damage follows')).toBeNull();
    expect(makeCloze(p, 'not here')).toBeNull();
  });
  it('puts due cards first, caps new cards per day, skips suspended, interleaves weeks', () => {
    const now = 1_000_000_000_000;
    const cards: DeckCard[] = Array.from({ length: 40 }, (_, i) => ({ id: `c${i}`, unit: 'u', concept: 'k', type: 'basic', week: `u-w0${(i % 2) + 1}` }));
    const states = new Map<string, any>([
      ['c0', { cardId: 'c0', due: now - 10, fsrs: {}, reps: 1, lapses: 0 }],
      ['c1', { cardId: 'c1', due: now - 1000, fsrs: {}, reps: 1, lapses: 0 }],
      ['c2', { cardId: 'c2', due: now + 1e6, fsrs: {}, reps: 1, lapses: 0 }],
      ['c3', { cardId: 'c3', due: now - 5, fsrs: {}, reps: 1, lapses: 0, suspended: 1 }],
    ]);
    const q = buildQueue(cards, states, now, 5);
    expect(q.due.map((c) => c.id)).toEqual(['c1', 'c0']);
    expect(q.fresh.length).toBe(NEW_PER_DAY - 5);
    expect(q.fresh[0].week).not.toBe(q.fresh[1].week);
    expect(q.fresh.some((c) => c.id === 'c3')).toBe(false);
  });
});
