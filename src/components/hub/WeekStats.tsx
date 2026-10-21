// Live part of a hub week card: four-segment criterion ring for the week, learned/secured counts, last visit.
import { useEffect, useState } from 'react';
import { useStudy, startStudySync } from '../../lib/store';
import { ProgressRing } from '../ui/ProgressRing';
import { weekVisits } from '../../lib/continue';

const ago = (t: number) => {
  if (!t) return 'visited';
  const d = Math.floor((Date.now() - t) / 86_400_000);
  return d <= 0 ? 'visited today' : d === 1 ? 'visited yesterday' : `visited ${d} days ago`;
};

export default function WeekStats({ week, concepts }: { week: string; concepts: string[] }) {
  const criteria = useStudy((s) => s.criterion);
  const ready = useStudy((s) => s.ready);
  const [visit, setVisit] = useState<number | undefined>();
  useEffect(() => { startStudySync(); setVisit(weekVisits()[week]); }, [week]);
  const learned = concepts.filter((id) => criteria.get(id)?.learnedAt).length;
  const secured = concepts.filter((id) => criteria.get(id)?.securedAt).length;
  const n = concepts.length || 1;
  // Ring: stage = how many of the four criterion steps the week as a whole has reached.
  const stage = secured === concepts.length && concepts.length ? 4 : learned === concepts.length && concepts.length ? 2 : learned ? 1 : 0;
  const partial = stage === 2 ? secured / n : stage === 1 ? learned / n : stage === 0 ? 0 : 0;
  return (
    <span className="week-stats">
      <ProgressRing stage={ready ? stage : 0} partial={ready ? partial : 0} size={28} label={`${learned} learned, ${secured} secured of ${concepts.length}`} />
      <span>{ready ? `${learned} learned · ${secured} secured` : '…'}<br />{visit === undefined ? 'not opened yet' : ago(visit)}</span>
    </span>
  );
}
