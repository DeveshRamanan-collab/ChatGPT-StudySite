// Exam details, derived from the unit files (generated from raw/<unit>/unit.yaml by scripts/units.mjs — the single
// source). Everything is Australia/Sydney: days are Sydney calendar days, so a countdown changes at Sydney midnight
// and is unaffected by the daylight-saving switch.
export const TZ = 'Australia/Sydney';
const DAY = 86_400_000;

export interface ExamInfo {
  /** Exam start, ms since epoch. */
  start: number;
  /** Total timetabled minutes and its parts (where the timetable states them). */
  duration: number;
  reading?: number;
  working?: number;
  technical?: number;
  mode: string;
  venue?: string;
  notes?: string;
  status: 'draft' | 'final';
}

/** Sydney calendar day of an instant, as YYYY-MM-DD. */
export const sydneyDay = (t: number) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(t);
const dayIndex = (t: number) => Date.parse(`${sydneyDay(t)}T00:00:00Z`) / DAY;

/** Whole Sydney calendar days from `now` to the exam day: 0 on exam day, 1 the day before, never negative. */
export const daysUntil = (start: number, now: number) => Math.max(0, dayIndex(start) - dayIndex(now));

/** "Tue 10 Nov" */
export const examDayLabel = (start: number) =>
  new Date(start).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', timeZone: TZ });
/** "9:00 am" */
export const examTimeLabel = (start: number) =>
  new Date(start).toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: TZ }).replace(/\s?([ap])\.?m\.?$/i, ' $1m');
/** "2 h 45 min" */
export const minutesLabel = (m: number) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}` : `${m} min`);
/** "in 4 days" · "tomorrow" · "today" */
export const daysLabel = (d: number) => (d === 0 ? 'today' : d === 1 ? 'tomorrow' : `in ${d} days`);

/** The timed phases of the paper as the timetable states them; total-only when the parts are not given. */
export function phases(e: Pick<ExamInfo, 'duration' | 'reading' | 'working' | 'technical'>) {
  if (e.working == null) return [{ kind: 'paper' as const, minutes: e.duration, label: 'Paper' }];
  return [
    ...(e.reading ? [{ kind: 'reading' as const, minutes: e.reading, label: 'Reading time' }] : []),
    { kind: 'working' as const, minutes: e.working, label: 'Working time' },
    ...(e.technical ? [{ kind: 'technical' as const, minutes: e.technical, label: 'Technical time' }] : []),
  ];
}

/** Exam order: earliest exam start first (ties by id). Used for unit lists everywhere. */
export const byExam = <T extends { examDate: number; id: string }>(a: T, b: T) => a.examDate - b.examDate || a.id.localeCompare(b.id);

/** From an Astro unit entry's data. */
export function examOf(d: {
  'exam-start': Date; 'exam-duration': number; 'exam-reading'?: number; 'exam-working'?: number; 'exam-technical'?: number;
  'exam-mode': string; 'exam-venue'?: string; 'exam-notes'?: string; 'exam-status': 'draft' | 'final';
}): ExamInfo {
  return {
    start: +d['exam-start'], duration: d['exam-duration'], reading: d['exam-reading'], working: d['exam-working'],
    technical: d['exam-technical'], mode: d['exam-mode'], venue: d['exam-venue'], notes: d['exam-notes'], status: d['exam-status'],
  };
}

/** Refresh every [data-exam-days][data-exam-start] on the page (static pages are built days earlier). */
export function refreshCountdowns(root: ParentNode = document) {
  const now = Date.now();
  root.querySelectorAll<HTMLElement>('[data-exam-days][data-exam-start]').forEach((el) => {
    el.textContent = daysLabel(daysUntil(Number(el.dataset.examStart), now));
  });
}
