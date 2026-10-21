import { describe, it, expect } from 'vitest';
import { sessionPlan } from '../src/lib/session-plan';

const base = { unit: 'laws2400', unitCode: 'LAWS2400', dueCards: 0, dueRequeues: 0, weakest: { id: 'laws2400-w05-duty', title: 'Duty of care' }, answerStyle: 'problem' as const };
const total = (p: { minutes: number }[]) => p.reduce((s, x) => s + x.minutes, 0);

describe('sessionPlan', () => {
  it('never plans more time than is available', () => {
    for (const minutes of [10, 15, 25, 45]) for (const energy of ['low', 'steady', 'high'] as const)
      expect(total(sessionPlan({ ...base, minutes, energy, dueCards: 40, dueRequeues: 3 }))).toBeLessThanOrEqual(minutes);
  });
  it('puts due re-tests and due cards first', () => {
    const p = sessionPlan({ ...base, minutes: 25, energy: 'high', dueCards: 12, dueRequeues: 2 });
    expect(p[0].label).toMatch(/Re-test 2/);
    expect(p[1].label).toMatch(/due cards/);
  });
  it('low energy avoids full written answers; high energy includes one when time allows', () => {
    expect(sessionPlan({ ...base, minutes: 45, energy: 'low' }).some((x) => /problem question|essay/i.test(x.label))).toBe(false);
    expect(sessionPlan({ ...base, minutes: 45, energy: 'high' }).some((x) => /problem question/i.test(x.label))).toBe(true);
  });
  it('an essay unit gets an essay question at high energy', () => {
    expect(sessionPlan({ ...base, minutes: 45, energy: 'high', answerStyle: 'essay' })[0].label).toMatch(/essay/i);
  });
  it('drops items shorter than two minutes', () => {
    expect(sessionPlan({ ...base, minutes: 10, energy: 'steady' }).every((x) => x.minutes >= 2)).toBe(true);
  });
});
