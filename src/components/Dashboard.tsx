// Dashboard: mastery per unit/week/concept, criterion counts, days studied in the last 14 (a count, never a
// chain), minutes, accuracy trend, calibration and readiness vs the exam date. Hand-rolled SVG; every chart has
// hover titles and a table view. Numbers count up once (instant when motion is off).
import { useEffect, useMemo, useState } from 'react';
import { useStudy, startStudySync } from '../lib/store';
import { db } from '../lib/db';
import * as sel from '../lib/selectors';

interface OConcept { id: string; title: string; href: string }
interface OWeek { id: string; number: number; topic: string; href: string; concepts: OConcept[] }
export interface OUnit { id: string; code: string; name: string; examDate: number; weeks: OWeek[] }

const pct = (x: number) => `${Math.round(x * 100)}%`;

function useCountUp(target: number, ms = 600) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (document.documentElement.dataset.motion === 'off') { setV(target); return; }
    let raf = 0; const t0 = performance.now();
    const tick = (t: number) => { const k = Math.min(1, (t - t0) / ms); setV(target * (1 - (1 - k) ** 3)); if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v;
}
function Num({ value, format = (x: number) => String(Math.round(x)) }: { value: number; format?: (x: number) => string }) {
  return <>{format(useCountUp(value))}</>;
}

function Bar({ value, target, label }: { value: number; target?: number; label: string }) {
  return (
    <svg className="dash-bar" viewBox="0 0 100 8" preserveAspectRatio="none" role="img" aria-label={label}>
      <title>{label}</title>
      <rect x="0" y="2" width="100" height="4" rx="2" className="dash-bar__track" />
      <rect x="0" y="2" width={Math.max(0, Math.min(100, value * 100))} height="4" rx="2" className="dash-bar__fill" />
      {target !== undefined && <rect x={Math.min(99.4, target * 100)} y="0" width="0.8" height="8" className="dash-bar__target" />}
    </svg>
  );
}

export default function Dashboard() {
  useEffect(() => startStudySync(), []);
  const ready = useStudy((s) => s.ready);
  const attempts = useStudy((s) => s.attempts);
  const criteria = useStudy((s) => s.criterion);
  const sessions = useStudy((s) => s.sessions);
  const [overview, setOverview] = useState<OUnit[] | null>(null);
  const [reviews, setReviews] = useState<number[]>([]);
  const [table, setTable] = useState(false);
  const now = useMemo(() => Date.now(), [ready]);

  useEffect(() => {
    fetch('/data/overview.json').then((r) => r.json()).then(setOverview);
    db.reviews.where('at').aboveOrEqual(Date.now() - 14 * 86_400_000).toArray().then((rs) => setReviews(rs.map((r) => r.at))).catch(() => {});
  }, []);

  const byConcept = useMemo(() => sel.attemptsByConcept(attempts), [attempts]);
  const series = useMemo(() => sel.dailySeries(attempts, [...reviews, ...sessions.map((s) => s.start)], now), [attempts, reviews, sessions, now]);
  const calib = useMemo(() => sel.calibration(attempts), [attempts]);
  const studied = series.filter((d) => d.studied).length;
  const minutes = sel.minutesRecent(attempts, now);
  const week = attempts.filter((a) => a.at >= now - 7 * 86_400_000).length;

  if (!overview || !ready) return <p className="dash-loading" aria-busy="true">Loading your progress…</p>;

  const accPts = series.map((d, i) => ({ ...d, x: 4 + (i * 92) / 13, y: d.accuracy === null ? null : 34 - d.accuracy * 30 }));
  const path = accPts.reduce((p, d, i) => (d.y === null ? p : `${p}${p && accPts[i - 1]?.y !== null ? 'L' : 'M'}${d.x.toFixed(1)} ${d.y.toFixed(1)}`), '');
  const expected: Record<string, number> = { sure: 0.9, unsure: 0.6, guess: 0.33 };
  const sure = calib.sure;

  return (
    <div className="dash">
      <section className="dash-row" aria-label="This fortnight">
        <div className="dash-stat">
          <p className="label">Days studied</p>
          <p className="dash-stat__n"><Num value={studied} /> <span>of the last 14</span></p>
          <ol className="dash-days" aria-label={`Studied on ${studied} of the last 14 days`}>
            {series.map((d) => <li key={d.day} data-on={d.studied || undefined} title={`${d.day}${d.studied ? ': studied' : ''}`} />)}
          </ol>
        </div>
        <div className="dash-stat"><p className="label">Minutes, last 7 days</p><p className="dash-stat__n"><Num value={minutes} /></p></div>
        <div className="dash-stat"><p className="label">Answers, last 7 days</p><p className="dash-stat__n"><Num value={week} /></p></div>
        <div className="dash-stat"><p className="label">Cards reviewed, 14 days</p><p className="dash-stat__n"><Num value={reviews.length} /></p></div>
      </section>

      <section aria-labelledby="dash-ready">
        <h2 id="dash-ready">Readiness</h2>
        <ul className="dash-units">
          {overview.map((u) => {
            const ids = u.weeks.flatMap((w) => w.concepts.map((c) => c.id));
            const r = sel.readiness(ids, criteria, attempts, u.examDate, now);
            const learned = ids.filter((id) => criteria.get(id)?.learnedAt).length;
            const secured = ids.filter((id) => criteria.get(id)?.securedAt).length;
            const line = !ids.length ? 'No concepts yet.'
              : r.coverage === 0 ? `Not started. ${r.daysToExam} days to the exam.`
              : r.target === 0 ? `Ahead of schedule: ${pct(r.readiness)} ready; the target starts rising six weeks before the exam (${r.daysToExam} days out).`
              : r.onTrack ? `On track: ${pct(r.readiness)} ready against a target of ${pct(r.target)} for ${r.daysToExam} days out.`
              : `Behind the target: ${pct(r.readiness)} ready, ${pct(r.target)} expected at ${r.daysToExam} days out. The weakest concepts come first in the quiz.`;
            return (
              <li key={u.id} className="dash-unit">
                <p className="dash-unit__head"><a href={`/${u.id}`}>{u.code}</a> <span>{u.name}</span></p>
                <Bar value={r.readiness} target={r.target} label={`${u.code} readiness ${pct(r.readiness)}, target ${pct(r.target)}`} />
                <p className="dash-unit__line">{line}</p>
                <p className="dash-unit__counts"><Num value={learned} /> learned · <Num value={secured} /> secured · {ids.length} concepts · {pct(r.coverage)} seen</p>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="dash-two">
        <section aria-labelledby="dash-trend">
          <h2 id="dash-trend">Accuracy, last 14 days</h2>
          <svg className="dash-trend" viewBox="0 0 100 40" role="img" aria-label="Daily accuracy over the last 14 days">
            {[0, 0.5, 1].map((g) => <line key={g} x1="4" x2="96" y1={34 - g * 30} y2={34 - g * 30} className="dash-grid" />)}
            {path && <path d={path} className="dash-line" />}
            {accPts.map((d) => d.y !== null && (
              <g key={d.day}><circle cx={d.x} cy={d.y} r="1.6" className="dash-dot" /><circle cx={d.x} cy={d.y} r="4" className="dash-hit"><title>{`${d.day}: ${pct(d.accuracy!)} of ${d.n}`}</title></circle></g>
            ))}
          </svg>
          <p className="dash-note">{series.some((d) => d.n) ? 'Hover a point for the day.' : 'Answer questions to see the trend.'}</p>
        </section>

        <section aria-labelledby="dash-cal">
          <h2 id="dash-cal">Calibration</h2>
          <ul className="dash-cal">
            {(['sure', 'unsure', 'guess'] as const).map((k) => (
              <li key={k}>
                <span className="dash-cal__k">{k[0].toUpperCase() + k.slice(1)}</span>
                <Bar value={calib[k].accuracy} target={expected[k]} label={`${k}: right ${pct(calib[k].accuracy)} of ${calib[k].n}; well calibrated is about ${pct(expected[k])}`} />
                <span className="dash-cal__n mono">{calib[k].n ? pct(calib[k].accuracy) : '—'}</span>
              </li>
            ))}
          </ul>
          <p className="dash-note">{sure.n >= 5 ? `When you say sure you are right ${pct(sure.accuracy)} of the time${sure.accuracy < 0.8 ? ' — slow down on those; sure-and-wrong items come back at 10 minutes, 1 day and 4 days.' : '.'}` : 'The tick marks show well-calibrated accuracy for each confidence level.'}</p>
        </section>
      </div>

      <p className="dash-note" data-insight-link><a href="/insight">What I know</a>: strengths, recurring errors and what is fading, each with its evidence.</p>

      <section aria-labelledby="dash-mastery">
        <h2 id="dash-mastery">Mastery by week and concept</h2>
        {overview.filter((u) => u.weeks.length).map((u) => (
          <details key={u.id} className="dash-mastery">
            <summary>{u.code} · {u.weeks.length} {u.weeks.length === 1 ? 'week' : 'weeks'}</summary>
            <ul>
              {u.weeks.map((w) => {
                const ms = w.concepts.map((c) => sel.conceptMastery(c.id, criteria, byConcept));
                const avg = ms.length ? ms.reduce((a, b) => a + b, 0) / ms.length : 0;
                return (
                  <li key={w.id}>
                    <details>
                      <summary className="dash-week"><span>Week {w.number} · {w.topic}</span><Bar value={avg} label={`Week ${w.number} mastery ${pct(avg)}`} /><span className="mono">{pct(avg)}</span></summary>
                      <ul className="dash-concepts">
                        {w.concepts.map((c, i) => (
                          <li key={c.id}><a href={c.href}>{c.title}</a><Bar value={ms[i]} label={`${c.title} mastery ${pct(ms[i])}`} /><span className="mono">{pct(ms[i])}</span></li>
                        ))}
                      </ul>
                    </details>
                  </li>
                );
              })}
            </ul>
          </details>
        ))}
      </section>

      <p><button className="btn btn--ghost btn--sm" type="button" aria-expanded={table} onClick={() => setTable((t) => !t)}>{table ? 'Hide' : 'Show'} the numbers as a table</button></p>
      {table && (
        <table className="dash-table">
          <caption className="visually-hidden">Daily activity and accuracy</caption>
          <thead><tr><th scope="col">Day</th><th scope="col">Studied</th><th scope="col">Answers marked</th><th scope="col">Accuracy</th></tr></thead>
          <tbody>{series.map((d) => <tr key={d.day}><td>{d.day}</td><td>{d.studied ? 'yes' : '—'}</td><td>{d.n}</td><td>{d.accuracy === null ? '—' : pct(d.accuracy)}</td></tr>)}</tbody>
        </table>
      )}
    </div>
  );
}
