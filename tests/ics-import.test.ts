import { describe, it, expect } from 'vitest';
import { parseIcs, parseIcsTime, busyByDay } from '../src/lib/ics-import';
import { buildPlan } from '../src/lib/plan';

const ics = (body: string) => `BEGIN:VCALENDAR\r\nVERSION:2.0\r\n${body}END:VCALENDAR\r\n`;
const from = Date.UTC(2026, 9, 18, 0); // 18 Oct 2026

describe('parseIcsTime', () => {
  it('reads UTC, TZID and floating times as instants', () => {
    expect(parseIcsTime('20261020T000000Z')!.t).toBe(Date.UTC(2026, 9, 20, 0));
    // 10:00 Sydney (AEDT, +11) is 23:00 UTC the day before.
    expect(parseIcsTime('20261020T100000', 'Australia/Sydney')!.t).toBe(Date.UTC(2026, 9, 19, 23));
    expect(parseIcsTime('20261020T100000')!.t).toBe(Date.UTC(2026, 9, 19, 23));
    expect(parseIcsTime('20261020')!.allDay).toBe(true);
  });
});

describe('parseIcs', () => {
  it('turns a timed event into a Sydney-day busy interval', () => {
    const b = parseIcs(ics('BEGIN:VEVENT\r\nDTSTART;TZID=Australia/Sydney:20261020T090000\r\nDTEND;TZID=Australia/Sydney:20261020T120000\r\nSUMMARY:Work shift\r\nEND:VEVENT\r\n'), { from });
    expect(b).toEqual([{ date: '2026-10-20', from: 540, to: 720, title: 'Work shift' }]);
  });
  it('expands a weekly recurrence with BYDAY and COUNT', () => {
    const b = parseIcs(ics('BEGIN:VEVENT\r\nDTSTART;TZID=Australia/Sydney:20261019T140000\r\nDTEND;TZID=Australia/Sydney:20261019T160000\r\nRRULE:FREQ=WEEKLY;BYDAY=MO,WE;COUNT=4\r\nSUMMARY:Class\r\nEND:VEVENT\r\n'), { from });
    expect(b.map((x) => x.date)).toEqual(['2026-10-19', '2026-10-21', '2026-10-26', '2026-10-28']);
  });
  it('marks an all-day event as the whole day', () => {
    const b = parseIcs(ics('BEGIN:VEVENT\r\nDTSTART;VALUE=DATE:20261022\r\nDTEND;VALUE=DATE:20261023\r\nSUMMARY:Trip\r\nEND:VEVENT\r\n'), { from });
    expect(b).toEqual([{ date: '2026-10-22', from: 0, to: 1440, title: 'Trip' }]);
  });
});

describe('calendar-aware plan', () => {
  const now = Date.UTC(2030, 2, 1, 0);
  const cs = (u: string, n: number) => Array.from({ length: n }, (_, i) => ({ id: `${u}-w01-c${i}`, title: `${u} C${i}`, href: '' }));
  const units = [{ id: 'laws2400', code: 'LAWS2400', examDate: Date.UTC(2030, 2, 20, 0), weeks: [{ id: 'laws2400-w01', number: 1, topic: '', href: '', concepts: cs('laws2400', 30) }] }];
  it('moves blocks off busy times and drops them when nothing is free', () => {
    const busy = busyByDay([{ date: '2030-03-03', from: 9 * 60, to: 17 * 60, title: 'Work' }, { date: '2030-03-04', from: 0, to: 1440, title: 'Away' }]);
    const days = buildPlan(units, new Map(), new Set(), now, 3, { busy });
    const d3 = days.find((d) => d.date === '2030-03-03')!;
    expect(d3.blocks.map((b) => b.start)).toEqual(['19:30']);
    expect(days.find((d) => d.date === '2030-03-04')).toBeUndefined();
    expect(days.find((d) => d.date === '2030-03-05')!.blocks.map((b) => b.start)).toEqual(['09:30', '14:00']);
  });
});
