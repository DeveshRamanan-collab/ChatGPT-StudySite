// Exam details come from ONE source (raw/<unit>/unit.yaml → scripts/units.mjs → unit files). These tests read that
// source and check that countdowns, unit order, the study plan and FSRS scheduling all derive from it — and move
// together when one date changes. Times are Australia/Sydney throughout.
import { describe, it, expect } from 'vitest';
import { unitFiles } from '../scripts/units.mjs';
import { byExam, daysUntil, sydneyDay, examTimeLabel, phases } from '../src/lib/exam';
import { buildPlan } from '../src/lib/plan';
import { readiness } from '../src/lib/selectors';
import { beforeExam } from '../src/lib/fsrs';
import type { OverviewUnit } from '../src/lib/whatnext';

const DAY = 86_400_000;
const cs = (u: string, n: number) => Array.from({ length: n }, (_, i) => ({ id: `${u}-w01-c${i}`, title: `${u} C${i}`, href: '' }));
/** Overview-shaped units built from the single source, as /data/overview.json builds them. */
function fromSource(shift: Record<string, number> = {}): OverviewUnit[] {
  return unitFiles().map(({ id, data: d }) => {
    const start = Date.parse(d['exam-start']) + (shift[id] ?? 0) * DAY;
    return {
      id, code: d.code, examDate: start,
      exam: { start, duration: d['exam-duration'], reading: d['exam-reading'], working: d['exam-working'], technical: d['exam-technical'], mode: d['exam-mode'], status: d['exam-status'] },
      weeks: [{ id: `${id}-w01`, number: 1, topic: '', href: '', concepts: cs(id, 10) }],
    } as OverviewUnit;
  });
}

describe('exam timetable: single source', () => {
  it('every unit.yaml has an exam start whose Sydney day is its exam-date', () => {
    const us = unitFiles();
    expect(us.length).toBe(4);
    for (const { data: d } of us) expect(sydneyDay(Date.parse(d['exam-start']))).toBe(d['exam-date']);
  });

  it('unit order is exam order, and changes when a date changes', () => {
    expect(fromSource().sort(byExam).map((u) => u.id)).toEqual(['mgmt2094', 'laws2400', 'laws2100', 'laws2000']);
    expect(fromSource({ mgmt2094: 30 }).sort(byExam).map((u) => u.id)).toEqual(['laws2400', 'laws2100', 'laws2000', 'mgmt2094']);
  });

  it('the timetable phases come through (MGMT2094: 10 reading + 120 working + 30 technical)', () => {
    const m = fromSource().find((u) => u.id === 'mgmt2094')!.exam!;
    expect(phases(m).map((p) => p.minutes)).toEqual([10, 120, 30]);
    expect(m.duration).toBe(160);
    expect(examTimeLabel(m.start)).toBe('9:00 am');
  });
});

describe('countdowns: Sydney calendar days', () => {
  const torts = () => fromSource().find((u) => u.id === 'laws2400')!.examDate; // Wed 11 Nov 2026, 5:30 pm AEDT
  it('changes at Sydney midnight, not at a UTC boundary or 24 h before the start', () => {
    expect(daysUntil(torts(), Date.parse('2026-11-10T23:59:00+11:00'))).toBe(1);
    expect(daysUntil(torts(), Date.parse('2026-11-11T00:01:00+11:00'))).toBe(0);
    expect(daysUntil(torts(), Date.parse('2026-11-10T17:00:00+11:00'))).toBe(1); // 24.5 h before: still "tomorrow"
    expect(daysUntil(torts(), Date.parse('2026-11-12T09:00:00+11:00'))).toBe(0); // never negative
  });
  it('counts whole days across the daylight-saving switch (4 Oct 2026, AEST → AEDT)', () => {
    // 00:30 on 4 Oct AEST is still before the 2 am switch; 3 am that day is AEDT. Both are 4 Oct in Sydney.
    expect(sydneyDay(Date.parse('2026-10-04T00:30:00+10:00'))).toBe('2026-10-04');
    expect(sydneyDay(Date.parse('2026-10-04T03:30:00+11:00'))).toBe('2026-10-04');
    expect(daysUntil(torts(), Date.parse('2026-10-03T23:30:00+10:00'))).toBe(39); // 3 Oct → 11 Nov
    expect(daysUntil(torts(), Date.parse('2026-10-04T23:30:00+11:00'))).toBe(38);
  });
  it('readiness uses the same count', () => {
    const now = Date.parse('2026-11-01T08:00:00+11:00');
    expect(readiness([], new Map(), [], torts(), now).daysToExam).toBe(10);
  });
});

describe('study plan derives from the timetable', () => {
  const now = Date.parse('2026-11-01T07:00:00+11:00');
  it('puts each exam on its day at its real start and length, a full paper the day before, and every unit gets time before its exam', () => {
    const days = buildPlan(fromSource(), new Map(), new Set(), now);
    for (const u of fromSource()) {
      const examDay = days.find((d) => d.date === sydneyDay(u.examDate))!;
      const b = examDay.blocks.find((x) => x.kind === 'exam' && x.unit === u.id)!;
      expect(b.start).toBe(new Intl.DateTimeFormat('en-GB', { timeZone: 'Australia/Sydney', hour: '2-digit', minute: '2-digit', hour12: false }).format(u.examDate));
      expect(b.minutes).toBe(u.exam!.duration);
      const eve = days.find((d) => d.date === sydneyDay(u.examDate - DAY))!;
      expect(eve.blocks.some((x) => x.kind === 'exam-sim' && x.unit === u.id)).toBe(true);
      const before = days.filter((d) => d.date < sydneyDay(u.examDate)).flatMap((d) => d.blocks).filter((x) => x.unit === u.id && (x.kind === 'learn' || x.kind === 'quiz'));
      expect(before.length, `${u.id} revision blocks`).toBeGreaterThan(0);
    }
    // Nearest exam first: the first study block goes to MGMT2094 (10 Nov).
    expect(days[0].blocks.find((x) => x.kind === 'learn' || x.kind === 'quiz')!.unit).toBe('mgmt2094');
  });
  it('moves with the source: shifting one exam moves its exam block and its day-before paper', () => {
    const moved = buildPlan(fromSource({ laws2400: 3 }), new Map(), new Set(), now);
    const t = fromSource({ laws2400: 3 }).find((u) => u.id === 'laws2400')!.examDate;
    expect(moved.find((d) => d.date === sydneyDay(t))!.blocks.some((b) => b.kind === 'exam' && b.unit === 'laws2400')).toBe(true);
    expect(moved.find((d) => d.date === sydneyDay(t - DAY))!.blocks.some((b) => b.kind === 'exam-sim' && b.unit === 'laws2400')).toBe(true);
    expect(moved.some((d) => d.date === '2026-11-11' && d.blocks.some((b) => b.kind === 'exam' && b.unit === 'laws2400'))).toBe(false);
  });
});

describe('FSRS lands relearning before the exam', () => {
  it('cuts an interval that would jump past the day before the exam', () => {
    const exam = Date.parse('2026-11-11T17:30:00+11:00');
    const now = Date.parse('2026-11-01T10:00:00+11:00');
    expect(beforeExam(now + 20 * DAY, now, exam)).toBe(exam - DAY);
    expect(beforeExam(now + 2 * DAY, now, exam)).toBe(now + 2 * DAY);
    expect(beforeExam(now + 20 * DAY, exam - DAY / 2, exam)).toBe(now + 20 * DAY); // inside the last day: leave it
  });
});
