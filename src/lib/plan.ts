// Day-by-day study plan to each exam from the concepts still weak or unsecured, written as if-then lines.
// Two blocks a day, interleaving units; the day before each exam is that unit's exam paper. Exams come from the unit
// files (raw/<unit>/unit.yaml): real start time and length. Each free slot goes to the unit with the most work left per
// day remaining (nearest exam on ties), and no unit with work left goes 3 days without a block. Pure: regenerates from
// live progress every time the page opens. Exports to .ics (Google Calendar).
import type { OverviewUnit } from './whatnext';
import { daysUntil } from './exam';

export interface PlanBlock { start: string; minutes: number; unit: string; code: string; kind: 'learn' | 'quiz' | 'exam-sim' | 'exam'; concepts: { id: string; title: string }[]; line: string; href: string }
export interface PlanDay { date: string; blocks: PlanBlock[] }

const DAY = 86_400_000;
const TZ = 'Australia/Sydney';
export const dayOf = (t: number) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(t);
const pretty = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
const SLOTS = [{ at: '09:30', cue: 'I have had breakfast' }, { at: '14:00', cue: 'I sit down after lunch' }];
const hhmm = (t: number) => new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(t);
const toMin = (s: string) => +s.slice(0, 2) * 60 + +s.slice(3, 5);
const FAIR_DAYS = 3;

/** Other times a block can move to when a commitment from the student's imported calendar covers a usual slot. */
const ALT_SLOTS = [{ at: '11:00', cue: 'I finish the morning' }, { at: '16:30', cue: 'I get home' }, { at: '19:30', cue: 'I have finished dinner' }];

export interface PlanOptions {
  /** Busy minutes per Sydney day (from an imported .ics, src/lib/ics-import.ts): blocks never overlap them. */
  busy?: Map<string, [number, number][]>;
}

export function buildPlan(units: OverviewUnit[], mastery: Map<string, number>, secured: Set<string>, now: number, perBlock = 3, opts: PlanOptions = {}): PlanDay[] {
  const live = units.filter((u) => u.weeks.some((w) => w.concepts.length) && u.examDate > now);
  if (!live.length) return [];
  // Remaining work per unit, weakest first; each concept needs one more pass (two if below 0.4).
  const queue = new Map(live.map((u) => {
    const cs = u.weeks.flatMap((w) => w.concepts).filter((c) => !secured.has(c.id) && (mastery.get(c.id) ?? 0) < 0.8)
      .sort((a, b) => (mastery.get(a.id) ?? 0) - (mastery.get(b.id) ?? 0));
    return [u.id, [...cs, ...cs.filter((c) => (mastery.get(c.id) ?? 0) < 0.4)]];
  }));
  const examDay = new Map(live.map((u) => [u.id, dayOf(u.examDate)]));
  const last = Math.max(...live.map((u) => u.examDate));
  const days: PlanDay[] = [];
  const lastServed = new Map<string, string>();
  for (let t = now; dayOf(t) <= dayOf(last); t += DAY) {
    const date = dayOf(t);
    const blocks: PlanBlock[] = [];
    const exams = live.filter((u) => examDay.get(u.id) === date);
    for (const u of exams) blocks.push({ start: hhmm(u.examDate), minutes: u.exam?.duration ?? 120, unit: u.id, code: u.code, kind: 'exam', concepts: [], line: `${u.code} exam today at ${hhmm(u.examDate)}. If I feel a blank, then I write the issues list first.`, href: `/${u.id}#exam` });
    const ahead = live.filter((u) => examDay.get(u.id)! > date);
    const tomorrow = dayOf(t + DAY);
    const simFor = ahead.filter((u) => examDay.get(u.id) === tomorrow);
    for (const u of simFor) blocks.push({ start: exams.length && toMin(hhmm(exams[0].examDate)) < 12 * 60 ? '15:00' : '09:30', minutes: Math.min(u.exam?.duration ?? 90, 165), unit: u.id, code: u.code, kind: 'exam-sim', concepts: [], line: `If it is the day before the ${u.code} exam, then I sit a timed paper and read the debrief.`, href: `/${u.id}/quiz?mode=paper` });
    // On an exam day keep only slots that end two hours before the first exam; the day-before paper takes a slot.
    const firstExam = exams.length ? Math.min(...exams.map((u) => toMin(hhmm(u.examDate)))) : Infinity;
    let free = SLOTS.filter((s) => toMin(s.at) + 25 + 120 <= firstExam).slice(simFor.length);
    // Calendar-aware: a slot that overlaps a commitment (with 15 minutes either side) moves to a free alternative.
    const busyToday = opts.busy?.get(date) ?? [];
    if (busyToday.length) {
      const clash = (at: string) => busyToday.some(([a, b]) => toMin(at) < b + 15 && toMin(at) + 25 > a - 15);
      const used = new Set<string>();
      free = free.flatMap((s) => {
        const pick = !clash(s.at) && !used.has(s.at) ? s : ALT_SLOTS.find((x) => !clash(x.at) && !used.has(x.at) && toMin(x.at) + 25 + 120 <= firstExam && !SLOTS.some((y) => y.at === x.at && free.includes(y)));
        if (!pick) return [];
        used.add(pick.at);
        return [pick];
      });
    }
    for (const slot of free) {
      const withWork = ahead.filter((u) => (queue.get(u.id)?.length ?? 0) > 0);
      if (!withWork.length) break;
      // Urgency = work left ÷ Sydney days to that exam. A unit with work left that has gone FAIR_DAYS without a block
      // goes first (once the plan has started); otherwise prefer a unit not already in today's blocks (interleave).
      const urgency = (u: OverviewUnit) => queue.get(u.id)!.length / Math.max(1, daysUntil(u.examDate, t));
      const idle = (u: OverviewUnit) => { const l = lastServed.get(u.id); return l ? (Date.parse(`${date}T00:00:00Z`) - Date.parse(`${l}T00:00:00Z`)) / DAY : Infinity; };
      const starved = days.length ? withWork.filter((u) => idle(u) >= FAIR_DAYS) : [];
      const fresh = withWork.filter((u) => !blocks.some((b) => b.unit === u.id));
      const pool = starved.length ? starved : fresh.length ? fresh : withWork;
      const u = [...pool].sort((a, b) => urgency(b) - urgency(a) || a.examDate - b.examDate)[0];
      lastServed.set(u.id, date);
      const cs = queue.get(u.id)!.splice(0, perBlock);
      const unseen = cs.every((c) => !mastery.has(c.id));
      const names = cs.map((c) => c.title).join(', ');
      blocks.push({
        start: slot.at, minutes: 25, unit: u.id, code: u.code, kind: unseen ? 'learn' : 'quiz', concepts: cs,
        line: `When ${slot.cue}, then I ${unseen ? 'read and pretest' : 'quiz myself on'} ${u.code}: ${names}.`,
        href: cs.length === 1 ? `/${u.id}/quiz?concept=${cs[0].id}` : `/${u.id}/quiz?mode=weakest`,
      });
    }
    if (blocks.length) days.push({ date, blocks: blocks.sort((a, b) => a.start.localeCompare(b.start)) });
  }
  return days;
}

export const dayLabel = pretty;

const icsEsc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const fold = (l: string) => l.length <= 74 ? l : l.match(/.{1,73}/g)!.join('\r\n ');

/** RFC 5545 calendar; times are Sydney local (TZID) with a VTIMEZONE for AEST/AEDT. */
export function toIcs(days: PlanDay[], origin = 'https://studysite.local', stamp = new Date().toISOString()) {
  const dt = (d: string, hm: string) => `${d.replace(/-/g, '')}T${hm.replace(':', '')}00`;
  const add = (hm: string, min: number) => { const [h, m] = hm.split(':').map(Number); const t = h * 60 + m + min; return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`; };
  const ds = stamp.replace(/[-:]/g, '').replace(/\.\d+/, '');
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//StudySite//Study plan//EN', 'CALSCALE:GREGORIAN',
    'BEGIN:VTIMEZONE', 'TZID:Australia/Sydney',
    'BEGIN:STANDARD', 'DTSTART:19700405T030000', 'RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU', 'TZOFFSETFROM:+1100', 'TZOFFSETTO:+1000', 'TZNAME:AEST', 'END:STANDARD',
    'BEGIN:DAYLIGHT', 'DTSTART:19701004T020000', 'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU', 'TZOFFSETFROM:+1000', 'TZOFFSETTO:+1100', 'TZNAME:AEDT', 'END:DAYLIGHT',
    'END:VTIMEZONE',
  ];
  for (const d of days) for (const [i, b] of d.blocks.entries()) {
    lines.push('BEGIN:VEVENT', `UID:${d.date}-${i}-${b.unit}@studysite`, `DTSTAMP:${ds}`,
      `DTSTART;TZID=Australia/Sydney:${dt(d.date, b.start)}`, `DTEND;TZID=Australia/Sydney:${dt(d.date, add(b.start, b.minutes))}`,
      fold(`SUMMARY:${icsEsc(b.kind === 'exam' ? `${b.code} exam` : `${b.code} · ${b.kind === 'exam-sim' ? 'exam paper' : b.kind === 'learn' ? 'learn' : 'quiz'}`)}`),
      fold(`DESCRIPTION:${icsEsc(b.line)}`), fold(`URL:${origin}${b.href}`), 'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}
