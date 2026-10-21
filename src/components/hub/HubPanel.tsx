// Unit hub panel: start a block for this unit, what is due (cards + re-tests), and the three weakest concepts.
import { useEffect, useMemo, useState } from 'react';
import { navigate } from 'astro:transitions/client';
import { useStudy, startStudySync } from '../../lib/store';
import { conceptMastery, attemptsByConcept } from '../../lib/selectors';
import { startBlock } from '../../lib/block';
import { whatNext, type OverviewUnit } from '../../lib/whatnext';
import { visitedWeeks } from '../../lib/continue';

export default function HubPanel({ unit, code }: { unit: string; code: string }) {
  const ready = useStudy((s) => s.ready);
  const attempts = useStudy((s) => s.attempts);
  const criteria = useStudy((s) => s.criterion);
  const cards = useStudy((s) => s.cards);
  const requeue = useStudy((s) => s.requeue);
  const [ov, setOv] = useState<OverviewUnit[] | null>(null);
  const [now] = useState(() => Date.now());
  useEffect(() => { startStudySync(); fetch('/data/overview.json').then((r) => r.json()).then(setOv); }, []);
  const u = ov?.find((x) => x.id === unit);
  const pre = `${unit}-`;
  const dueCards = cards.filter((c) => c.cardId.startsWith(pre) && !c.suspended && c.due <= now).length;
  const dueRe = requeue.filter((r) => !r.done && r.dueAt <= now && r.itemId.startsWith(pre)).length;
  const weakest = useMemo(() => {
    if (!u) return [];
    const by = attemptsByConcept(attempts);
    return u.weeks.flatMap((w) => w.concepts).filter((c) => by.has(c.id)).map((c) => ({ c, m: conceptMastery(c.id, criteria, by) })).sort((a, b) => a.m - b.m).slice(0, 3);
  }, [u, attempts, criteria]);

  function start() {
    const b = startBlock({ kind: 'block', unit, ifThen: `When I open ${code}, then I answer 10 questions before rereading`, minutes: 25 });
    const n = ov ? whatNext({ units: ov, attempts, criteria, requeue, cards, visited: visitedWeeks(), now: b.startAt, only: unit }) : null;
    navigate(n?.href ?? `/${unit}/quiz`);
  }

  return (
    <section className="hub-panel" aria-label={`${code} today`}>
      <div className="hub-panel__start">
        <button className="btn btn--primary" type="button" onClick={start} disabled={!ready}>Start a 25-minute block</button>
        <a className="btn btn--ghost" href={`/${unit}/quiz`}>Just quiz</a>
      </div>
      <div className="hub-panel__cols">
        <div>
          <h3 className="label">Due today</h3>
          {ready ? (
            <ul className="hub-panel__list">
              <li><a href={`/${unit}/cards`}>{dueCards} {dueCards === 1 ? 'card' : 'cards'}</a></li>
              <li><a href={`/${unit}/quiz`}>{dueRe} {dueRe === 1 ? 're-test' : 're-tests'}</a> <span className="hub-panel__note">sure-and-wrong items come back first</span></li>
            </ul>
          ) : <p className="hub-panel__note">…</p>}
        </div>
        <div>
          <h3 className="label">Weakest concepts</h3>
          {weakest.length ? (
            <ol className="hub-panel__list">
              {weakest.map(({ c, m }) => <li key={c.id}><a href={`/${unit}/quiz?concept=${c.id}`}>{c.title}</a> <span className="hub-panel__note mono">{Math.round(m * 100)}%</span></li>)}
            </ol>
          ) : <p className="hub-panel__note">Answer a few questions and your three weakest concepts show here.</p>}
        </div>
      </div>
    </section>
  );
}
