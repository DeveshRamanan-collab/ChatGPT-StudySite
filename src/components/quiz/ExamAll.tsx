// All-units exam paper: merges every unit's bank; the exam picker interleaves units (CLAUDE.md research rules).
import { useEffect, useState } from 'react';
import { startStudySync, useStudy } from '../../lib/store';
import { ExamSim } from './ExamSim';
import { loadBank, type Bank } from './types';

export default function ExamAll({ units }: { units: { id: string; code: string }[] }) {
  const [bank, setBank] = useState<Bank | null>(null);
  const [seed] = useState(() => Date.now());
  const ready = useStudy((s) => s.ready);
  useEffect(() => {
    startStudySync();
    Promise.all(units.map((u) => loadBank(u.id).catch(() => null))).then((banks) => {
      const bs = banks.filter((b): b is Bank => !!b);
      setBank({
        unit: 'all',
        concepts: Object.assign({}, ...bs.map((b) => b.concepts)),
        weeks: bs.flatMap((b) => b.weeks),
        cases: bs.flatMap((b) => b.cases),
        questions: bs.flatMap((b) => b.questions),
      });
    });
  }, [units]);
  if (!bank || !ready) return <p className="quiz__empty" aria-busy="true">Loading every unit…</p>;
  const present = [...new Set(bank.questions.map((q) => q.unit))];
  return (
    <>
      <p className="quiz-modes__filter" data-units={present.join(',')}>Drawing from {present.length} {present.length === 1 ? 'unit' : 'units'}: {units.filter((u) => present.includes(u.id)).map((u) => u.code).join(', ')}.</p>
      <ExamSim bank={bank} seed={seed} />
    </>
  );
}
