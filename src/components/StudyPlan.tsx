// Study plan island: regenerates from live progress; if-then lines per block; .ics export for Google Calendar.
// 200-features pass: import your own calendar (.ics) so blocks avoid commitments (175); a note when missed days were
// replanned (173); today's pack, downloadable as Markdown for offline or another app (190, 189).
import { useEffect, useMemo, useState } from 'react';
import { useStudy, startStudySync } from '../lib/store';
import { conceptMastery, attemptsByConcept } from '../lib/selectors';
import { buildPlan, toIcs, dayLabel, dayOf, type PlanDay } from '../lib/plan';
import type { OverviewUnit } from '../lib/whatnext';
import { parseIcs, busyByDay, type Busy } from '../lib/ics-import';
import { loadAids } from '../lib/aids';
import { db } from '../lib/db';
import '../styles/plan-extras.css';

interface Calendar { name: string; at: number; busy: Busy[] }
const SNAP = 'studysite:plan-snapshot';
const readSnap = (): Record<string, number> => { try { return JSON.parse(localStorage.getItem(SNAP) || '{}'); } catch { return {}; } };

/** Past days the plan had study blocks for but no answers were recorded (most recent first, last 14 days). */
export function missedDays(snap: Record<string, number>, studied: Set<string>, today: string): string[] {
  return Object.entries(snap).filter(([d, n]) => d < today && n > 0 && !studied.has(d)).map(([d]) => d).sort().reverse().slice(0, 14);
}

function download(name: string, text: string, type: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export default function StudyPlan() {
  const ready = useStudy((s) => s.ready);
  const attempts = useStudy((s) => s.attempts);
  const criteria = useStudy((s) => s.criterion);
  const [overview, setOverview] = useState<OverviewUnit[] | null>(null);
  const [all, setAll] = useState(false);
  const [cal, setCal] = useState<Calendar | null>(null);
  const [calError, setCalError] = useState<string | null>(null);
  const cards = useStudy((s) => s.cards);
  const requeue = useStudy((s) => s.requeue);
  useEffect(() => {
    startStudySync();
    fetch('/data/overview.json').then((r) => r.json()).then(setOverview);
    db.settings.get('calendar-busy').then((r) => r?.value && setCal(r.value as Calendar)).catch(() => {});
  }, []);

  async function importIcs(file: File) {
    setCalError(null);
    try {
      const busy = parseIcs(await file.text());
      if (!busy.length) { setCalError('No upcoming events found in that file.'); return; }
      const c = { name: file.name, at: Date.now(), busy };
      await db.settings.put({ key: 'calendar-busy', value: c });
      setCal(c);
    } catch { setCalError('That file could not be read as a calendar (.ics).'); }
  }
  async function clearIcs() { await db.settings.delete('calendar-busy'); setCal(null); }

  const days = useMemo(() => {
    if (!overview || !ready) return null;
    const by = attemptsByConcept(attempts);
    const ids = overview.flatMap((u) => u.weeks.flatMap((w) => w.concepts.map((c) => c.id)));
    const mastery = new Map(ids.filter((id) => by.has(id)).map((id) => [id, conceptMastery(id, criteria, by)]));
    const secured = new Set(ids.filter((id) => criteria.get(id)?.securedAt));
    return buildPlan(overview, mastery, secured, Date.now(), 3, { busy: cal ? busyByDay(cal.busy) : undefined });
  }, [overview, ready, attempts, criteria, cal]);

  // Replanning: remember how many study blocks each day had; a past day with blocks but no answers was missed, and
  // the rebuilt plan has already spread that work over the days left.
  const today = dayOf(Date.now());
  const missed = useMemo(() => {
    if (!days) return [];
    const snap = readSnap();
    const t = days.find((d) => d.date === today);
    if (t) snap[today] = t.blocks.filter((b) => b.kind === 'learn' || b.kind === 'quiz').length;
    const keep = Object.fromEntries(Object.entries(snap).filter(([d]) => d >= dayOf(Date.now() - 14 * 86_400_000)));
    try { localStorage.setItem(SNAP, JSON.stringify(keep)); } catch {}
    return missedDays(keep, new Set(attempts.map((a) => dayOf(a.at))), today);
  }, [days, attempts, today]);

  const todayPlan: PlanDay | undefined = days?.find((d) => d.date === today);
  const dueCards = cards.filter((c) => !c.suspended && c.due <= Date.now()).length;
  const dueRe = requeue.filter((r) => !r.done && r.dueAt <= Date.now()).length;

  async function packMarkdown() {
    const lines = [`# Today's pack — ${dayLabel(today)}`, ''];
    if (dueRe) lines.push(`- Re-test ${dueRe} question${dueRe === 1 ? '' : 's'} you were sure about and got wrong`);
    if (dueCards) lines.push(`- Review ${dueCards} due card${dueCards === 1 ? '' : 's'}`);
    for (const b of todayPlan?.blocks ?? []) lines.push(`- ${b.start} — ${b.line}`);
    const concepts = (todayPlan?.blocks ?? []).flatMap((b) => b.concepts.map((c) => ({ ...c, unit: b.unit })));
    if (concepts.length) {
      lines.push('', '## Concepts for today', '');
      const bundles = new Map<string, Awaited<ReturnType<typeof loadAids>>>();
      for (const c of concepts) {
        if (!bundles.has(c.unit)) bundles.set(c.unit, await loadAids(c.unit));
        const a = bundles.get(c.unit)!.aids[c.id];
        lines.push(`### ${c.title}`, '');
        if (a?.plain) lines.push(a.plain, '');
        for (const q of (a?.socratic ?? []).slice(0, 3)) lines.push(`- Q: ${q.ask}`, `  - A: ${q.answer}`);
        lines.push('');
      }
    }
    download(`studysite-pack-${today}.md`, lines.join('\n') + '\n', 'text/markdown;charset=utf-8');
  }

  if (!days) return <p className="plan-empty" aria-busy="true">Building your plan…</p>;
  if (!days.length) return <p className="plan-empty">No exams ahead with content yet.</p>;
  const shown = all ? days : days.slice(0, 7);

  function exportIcs() {
    download('studysite-plan.ics', toIcs(days!, location.origin), 'text/calendar;charset=utf-8');
  }

  return (
    <div className="plan">
      <section className="plan-pack" aria-labelledby="pack-h">
        <h2 id="pack-h" className="plan-pack__h">Today's pack</h2>
        <ul className="plan-pack__list">
          {dueRe > 0 && <li><a href="/exam">Re-test {dueRe} {dueRe === 1 ? 'question' : 'questions'} you were sure about and got wrong</a></li>}
          {dueCards > 0 && <li><a href="/cards">Review {dueCards} due {dueCards === 1 ? 'card' : 'cards'}</a></li>}
          {(todayPlan?.blocks ?? []).map((b, i) => <li key={i}><span className="mono">{b.start}</span> <a href={b.href}>{b.line}</a></li>)}
          {!dueRe && !dueCards && !todayPlan && <li>Nothing scheduled today. The next block is below.</li>}
        </ul>
        <p><button className="btn btn--ghost btn--sm" type="button" onClick={packMarkdown}>Download today's pack (.md)</button></p>
      </section>
      {missed.length > 0 && (
        <p className="plan-replanned" role="status">
          Replanned: you had blocks on {missed.slice(0, 3).map(dayLabel).join(', ')}{missed.length > 3 ? ` and ${missed.length - 3} more` : ''} without answers. That work is already spread over the days left, nothing piles up on one day.
        </p>
      )}
      <section className="plan-cal" aria-labelledby="cal-h">
        <h2 id="cal-h" className="plan-cal__h">Your commitments</h2>
        <p className="plan-cal__note">Export your calendar (work, classes, appointments) as an .ics file and add it here. Blocks move to free times; the file stays on this device.</p>
        <p className="plan-cal__row">
          <label className="btn btn--secondary btn--sm plan-cal__pick">
            {cal ? 'Replace calendar file' : 'Add calendar file (.ics)'}
            <input type="file" accept=".ics,text/calendar" className="visually-hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) importIcs(f); e.target.value = ''; }} />
          </label>
          {cal && <button className="btn btn--ghost btn--sm" type="button" onClick={clearIcs}>Remove</button>}
        </p>
        {cal && <p className="plan-cal__status" role="status">{cal.busy.length} busy {cal.busy.length === 1 ? 'time' : 'times'} from {cal.name}, added {new Date(cal.at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}.</p>}
        {calError && <p className="plan-cal__status" role="alert">{calError}</p>}
      </section>
      <p className="plan-tools">
        <button className="btn btn--secondary btn--sm" type="button" onClick={exportIcs}>Export to calendar (.ics)</button>
        <span className="plan-note">Rebuilt from your progress each time you open it: secured concepts drop out, weak ones get two passes.</span>
      </p>
      <ol className="plan-days">
        {shown.map((d) => (
          <li key={d.date} className="plan-day">
            <h2 className="plan-day__date">{dayLabel(d.date)}</h2>
            <ul>
              {d.blocks.map((b, i) => (
                <li key={i} className="plan-block" data-kind={b.kind}>
                  <span className="plan-block__time mono">{b.start}</span>
                  <a href={b.href}>{b.line}</a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      {days.length > 7 && <p><button className="btn btn--ghost btn--sm" type="button" onClick={() => setAll((x) => !x)}>{all ? 'Show the next week only' : `Show all ${days.length} days`}</button></p>}
    </div>
  );
}
