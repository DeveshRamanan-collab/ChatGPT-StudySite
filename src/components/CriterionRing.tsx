// Four-segment criterion ring for one concept, live from IndexedDB: pretested/learning → learned → relearning → secured.
import { useEffect } from 'react';
import { ProgressRing, CRITERION_STAGES } from './ui/ProgressRing';
import { startStudySync, useCriterion, useStudy } from '../lib/store';
import { criterionStage } from '../lib/selectors';

export default function CriterionRing({ conceptId, size = 24, title }: { conceptId: string; size?: number; title?: string }) {
  useEffect(startStudySync, []);
  const ready = useStudy((s) => s.ready);
  const c = useCriterion(conceptId);
  const { stage, partial } = criterionStage(c);
  const words = !c ? 'not started' : c.securedAt ? 'secured' : c.learnedAt ? `learned, ${c.relearnSessions.length} of 3 spaced relearns` : `learning, ${c.correctInSession} of 3 correct this session`;
  return (
    <span className="criterion-ring" data-stage={stage} data-ready={ready || undefined} title={`${title ?? 'Concept'}: ${words}`}>
      <ProgressRing stage={stage} partial={partial} size={size} stroke={Math.max(2, size / 10)} label={`${title ?? 'Concept'}: ${words} (${CRITERION_STAGES[Math.max(0, stage - 1)] ?? 'not started'})`} />
    </span>
  );
}
