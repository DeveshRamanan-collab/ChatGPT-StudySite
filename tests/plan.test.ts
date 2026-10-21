import { describe, it, expect } from 'vitest';
import { buildPlan, toIcs } from '../src/lib/plan';

// Synthetic fixture dates (not the real timetable: tests/exam.test.ts reads that from raw/<unit>/unit.yaml).
const now = Date.UTC(2030, 2, 1, 0);
const cs = (u: string, n: number) => Array.from({ length: n }, (_, i) => ({ id: `${u}-w01-c${i}`, title: `${u} C${i}`, href: '' }));
const units = [
  { id: 'laws2400', code: 'LAWS2400', examDate: Date.UTC(2030, 2, 9, 0), weeks: [{ id: 'laws2400-w01', number: 1, topic: '', href: '', concepts: cs('laws2400', 12) }] },
  { id: 'laws2000', code: 'LAWS2000', examDate: Date.UTC(2030, 2, 13, 0), weeks: [{ id: 'laws2000-w01', number: 1, topic: '', href: '', concepts: cs('laws2000', 12) }] },
];

describe('study plan', () => {
  it('interleaves units, puts an exam paper the day before and the exam on the day, skips secured', () => {
    const secured = new Set(['laws2400-w01-c0']);
    const days = buildPlan(units, new Map([['laws2400-w01-c1', 0.9]]), secured, now);
    const all = days.flatMap((d) => d.blocks);
    expect(all.some((b) => b.concepts.some((c) => c.id === 'laws2400-w01-c0' || c.id === 'laws2400-w01-c1'))).toBe(false);
    const first = days[0].blocks.filter((b) => b.kind === 'learn' || b.kind === 'quiz');
    expect(new Set(first.map((b) => b.unit)).size).toBe(2);
    const d8 = days.find((d) => d.date === '2030-03-08')!;
    expect(d8.blocks.some((b) => b.kind === 'exam-sim' && b.unit === 'laws2400')).toBe(true);
    expect(days.find((d) => d.date === '2030-03-09')!.blocks.some((b) => b.kind === 'exam' && b.unit === 'laws2400')).toBe(true);
    expect(all.every((b) => /^(When|If|LAWS)/.test(b.line))).toBe(true);
  });
  it('exports a valid .ics', () => {
    const ics = toIcs(buildPlan(units, new Map(), new Set(), now), 'https://x.test', '2030-03-01T00:00:00.000Z');
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics).toContain('DTSTART;TZID=Australia/Sydney:');
    expect(ics.match(/BEGIN:VEVENT/g)!.length).toBe(ics.match(/END:VEVENT/g)!.length);
    expect(ics.split('\r\n').every((l) => l.length <= 75)).toBe(true);
  });
});
