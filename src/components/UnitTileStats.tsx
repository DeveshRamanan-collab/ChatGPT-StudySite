// Live part of a home unit tile: mastery ring and today's due count (cards + re-tests).
import { useEffect, useState } from 'react';
import { useStudy, startStudySync } from '../lib/store';
import { ProgressRing } from './ui/ProgressRing';
import { conceptMastery, attemptsByConcept } from '../lib/selectors';

export default function UnitTileStats({ unit, concepts }: { unit: string; concepts: string[] }) {
  const ready = useStudy((s) => s.ready);
  const attempts = useStudy((s) => s.attempts);
  const criteria = useStudy((s) => s.criterion);
  const cards = useStudy((s) => s.cards);
  const requeue = useStudy((s) => s.requeue);
  const [now] = useState(() => Date.now());
  useEffect(() => startStudySync(), []);
  const by = attemptsByConcept(attempts.filter((a) => a.unit === unit));
  const mastery = concepts.length ? concepts.reduce((s, id) => s + conceptMastery(id, criteria, by), 0) / concepts.length : 0;
  const pre = `${unit}-`;
  const due = cards.filter((c) => c.cardId.startsWith(pre) && !c.suspended && c.due <= now).length + requeue.filter((r) => !r.done && r.dueAt <= now && r.itemId.startsWith(pre)).length;
  return (
    <span className="tile-stats">
      <ProgressRing value={ready ? mastery : 0} size={32} label={`Mastery ${Math.round(mastery * 100)}%`} />
      <span className="tile-stats__due">{ready ? (due ? `${due} due today` : 'Nothing due') : '…'}</span>
    </span>
  );
}
