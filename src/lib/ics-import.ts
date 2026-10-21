// Calendar-aware planning (feature 175): read an .ics file the student exports from their own calendar, entirely in
// the browser, into busy intervals per Sydney day. Handles UTC (Z), TZID and floating times, all-day events, and the
// common recurrences (FREQ=DAILY / WEEKLY with BYDAY, COUNT, UNTIL, INTERVAL). Nothing leaves the device.
export interface Busy { date: string; from: number; to: number; title: string }

const TZ = 'Australia/Sydney';
const DAY = 86_400_000;
const sydDay = (t: number) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(t);
const sydMin = (t: number) => { const [h, m] = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(t).split(':').map(Number); return (h % 24) * 60 + m; };

/** Offset (ms) of a zone at an instant, so a wall time in that zone can be turned into an instant. */
function zoneOffset(tz: string, t: number) {
  try {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(t).map((x) => [x.type, x.value]));
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - t;
  } catch { return zoneOffset(TZ, t); }
}

/** An ICS date-time value to an instant (ms). Floating times are read as Sydney time. */
export function parseIcsTime(value: string, tzid?: string): { t: number; allDay: boolean } | null {
  const m = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/);
  if (!m) return null;
  const [, y, mo, d, h, mi, s, z] = m;
  const wall = Date.UTC(+y, +mo - 1, +d, +(h ?? 0), +(mi ?? 0), +(s ?? 0));
  if (!h) return { t: wall - zoneOffset(TZ, wall), allDay: true };
  if (z) return { t: wall, allDay: false };
  const tz = tzid || TZ;
  const guess = wall - zoneOffset(tz, wall);
  return { t: wall - zoneOffset(tz, guess), allDay: false };
}

function unfold(text: string) {
  return text.replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '').split('\n');
}

interface Raw { start: number; end: number; allDay: boolean; title: string; rrule?: string }

export function parseIcs(text: string, { from = Date.now() - DAY, horizon = 120 } = {}): Busy[] {
  const events: Raw[] = [];
  let cur: Partial<Raw> & { tz?: string } | null = null;
  for (const line of unfold(text)) {
    if (line === 'BEGIN:VEVENT') { cur = {}; continue; }
    if (line === 'END:VEVENT') {
      if (cur?.start !== undefined) events.push({ start: cur.start, end: cur.end ?? cur.start + (cur.allDay ? DAY : 60 * 60_000), allDay: !!cur.allDay, title: cur.title ?? 'Busy', rrule: cur.rrule });
      cur = null;
      continue;
    }
    if (!cur) continue;
    const i = line.indexOf(':');
    if (i < 0) continue;
    const [name, ...params] = line.slice(0, i).split(';');
    const value = line.slice(i + 1).trim();
    const tzid = params.find((p) => p.startsWith('TZID='))?.slice(5);
    if (name === 'DTSTART') { const r = parseIcsTime(value, tzid); if (r) { cur.start = r.t; cur.allDay = r.allDay; } }
    else if (name === 'DTEND') { const r = parseIcsTime(value, tzid); if (r) cur.end = r.t; }
    else if (name === 'SUMMARY') cur.title = value.replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\n/gi, ' ');
    else if (name === 'RRULE') cur.rrule = value;
  }
  const until = from + horizon * DAY;
  const out: Busy[] = [];
  const push = (s: number, e: number, allDay: boolean, title: string) => {
    if (e < from || s > until) return;
    if (allDay) { for (let t = s; t < e; t += DAY) out.push({ date: sydDay(t + 12 * 3_600_000), from: 0, to: 24 * 60, title }); return; }
    // Split an event that crosses midnight into per-day pieces.
    let a = s;
    while (a < e) {
      const day = sydDay(a);
      const startMin = sydMin(a);
      const dayEnd = a + (24 * 60 - startMin) * 60_000;
      const b = Math.min(e, dayEnd);
      out.push({ date: day, from: startMin, to: b === dayEnd ? 24 * 60 : sydMin(b) || 24 * 60, title });
      a = b;
    }
  };
  const DAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  for (const ev of events) {
    const len = ev.end - ev.start;
    if (!ev.rrule) { push(ev.start, ev.end, ev.allDay, ev.title); continue; }
    const r = Object.fromEntries(ev.rrule.split(';').map((kv) => kv.split('=')));
    const freq = r.FREQ;
    const interval = Math.max(1, +(r.INTERVAL ?? 1));
    const count = r.COUNT ? +r.COUNT : Infinity;
    const end = r.UNTIL ? parseIcsTime(r.UNTIL)?.t ?? until : until;
    if (freq !== 'DAILY' && freq !== 'WEEKLY') { push(ev.start, ev.end, ev.allDay, ev.title); continue; }
    const byDay = freq === 'WEEKLY' && r.BYDAY ? r.BYDAY.split(',').map((d: string) => DAYS.indexOf(d.slice(-2))) : null;
    let n = 0;
    for (let k = 0; n < count; k++) {
      const t = ev.start + k * DAY;
      if (t > end || t > until) break;
      const weeks = Math.floor(k / 7);
      const okDaily = freq === 'DAILY' && k % interval === 0;
      const dow = new Date(t + zoneOffset(TZ, t)).getUTCDay();
      const okWeekly = freq === 'WEEKLY' && weeks % interval === 0 && (byDay ? byDay.includes(dow) : k % 7 === 0);
      if (!(okDaily || okWeekly)) continue;
      n++;
      push(t, t + len, ev.allDay, ev.title);
    }
  }
  return out.sort((a, b) => a.date.localeCompare(b.date) || a.from - b.from);
}

/** Busy intervals grouped by day, for the planner. */
export function busyByDay(busy: Busy[]): Map<string, [number, number][]> {
  const m = new Map<string, [number, number][]>();
  for (const b of busy) m.set(b.date, [...(m.get(b.date) ?? []), [b.from, b.to]]);
  return m;
}
