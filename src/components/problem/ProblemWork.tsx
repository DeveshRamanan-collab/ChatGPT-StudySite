// Problem page island: work a problem question's facts before writing. First the fact-by-fact spotting round
// (IssueSpotter); then, once finished or skipped, the full view: the prompt in layers (FactLayers), the
// element-and-evidence board (EvidenceBoard) and a closing checklist of the rubric's criteria with a link into the
// long-answer flow. The full view stays hidden during spotting so the annotation cannot give the answers away.
import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import type { Fact } from '../../lib/aids';
import { db } from '../../lib/db';
import { locateFacts, promptOrder, scoreRound, segment, type Issue, type Party, type Requirement, type RoundScore, type SpotAnswer } from '../../lib/problem';
import EvidenceBoard from './EvidenceBoard';
import FactLayers from './FactLayers';
import IssueSpotter from './IssueSpotter';
import '../../styles/problem.css';

/** Same key as BankBrowser's SET_KEY: the quiz's ?mode=set re-tests exactly these question ids. */
const RETEST_KEY = 'studysite:retest-set';

export interface ProblemProps {
  id: string;
  unit: string;
  prompt: string;
  parties: Party[];
  issues: Issue[];
  facts: Fact[];
  requirements: Record<string, Requirement[]>;
  rubric: { id: string; criterion: string }[];
}

type Saved = RoundScore & { at: number };

export default function ProblemWork(p: ProblemProps) {
  const located = useMemo(() => locateFacts(p.prompt, p.facts), [p.prompt, p.facts]);
  const order = useMemo(() => promptOrder(located), [located]);
  const paras = useMemo(() => segment(p.prompt, located), [p.prompt, located]);
  const known = useMemo(() => new Set(p.issues.map((i) => i.id)), [p.issues]);
  const [stage, setStage] = useState<'spot' | 'full'>('spot');
  const [round, setRound] = useState(0);
  const [result, setResult] = useState<RoundScore | null>(null);
  const [previous, setPrevious] = useState<Saved | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);
  useEffect(() => {
    db.settings.get(`spot:${p.id}`).then((r) => {
      const v = r?.value as Saved | undefined;
      if (v && typeof v.matched === 'number' && typeof v.total === 'number') setPrevious(v);
    }).catch(() => {});
  }, [p.id]);

  // Moving between the round and the full view puts focus (and the eye) at the start of what is new.
  useEffect(() => {
    if (!moved.current) return;
    rootRef.current?.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
    rootRef.current?.scrollIntoView({ block: 'start' });
  }, [stage, round]);

  const end = (answers: (SpotAnswer | undefined)[]) => {
    const s = scoreRound(p.facts, answers, known);
    moved.current = true;
    setResult(s.done ? s : null);
    setStage('full');
    if (s.done) {
      const v: Saved = { ...s, at: Date.now() };
      setPrevious(v);
      db.settings.put({ key: `spot:${p.id}`, value: v }).catch(() => {});
    }
  };
  const again = () => { moved.current = true; setResult(null); setRound((r) => r + 1); setStage('spot'); };

  const writeThis = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    try {
      sessionStorage.setItem(RETEST_KEY, JSON.stringify([p.id]));
      e.preventDefault();
      location.assign(`/${p.unit}/quiz?mode=set`);
    } catch { /* storage blocked: the link's own ?mode=long still works */ }
  };

  return (
    <div className="pq-work" data-stage={stage} data-ready={ready ? '' : undefined} ref={rootRef}>
      {stage === 'spot' ? (
        <IssueSpotter key={round} paras={paras} order={order} located={located} facts={p.facts} issues={p.issues} previous={previous} onDone={end} onSkip={end} />
      ) : (
        <div className="pq-full">
          <div className="pq-summary">
            {result ? (
              <p className="pq-summary__line">
                You worked {result.done} of {result.total} facts; {result.matched} matched the annotation.
                {result.essentialTotal > 0 && <> You marked {result.essentialFound} of {result.essentialTotal} essential facts as essential.</>}
                {result.issueTotal > 0 && <> You linked {result.issueHits} of {result.issueTotal} fact–issue pairs{result.issueExtra ? `, plus ${result.issueExtra} the annotation does not make` : ''}.</>}
              </p>
            ) : (
              <p className="pq-summary__line">Every fact, its weight and the issues it bears on. Spot the facts first if you have not yet tried.</p>
            )}
            <button type="button" className="btn btn--ghost btn--sm" onClick={again}>{result ? 'Spot the facts again' : 'Spot the facts'}</button>
          </div>

          <FactLayers paras={paras} facts={p.facts} order={order} parties={p.parties} issues={p.issues} />
          <EvidenceBoard qid={p.id} issues={p.issues} facts={p.facts} order={order} requirements={p.requirements} />

          <section className="pq-write" aria-labelledby="pq-write-h">
            <h2 id="pq-write-h">Write the answer</h2>
            <p className="pq-write__lede">The marking criteria. Tick each one your plan covers, then write.</p>
            <ul className="pq-write__list">
              {p.rubric.map((r) => (
                <li key={r.id}>
                  <label className="pq-write__item"><input type="checkbox" /><span>{r.criterion}</span></label>
                </li>
              ))}
            </ul>
            <a className="btn btn--primary" href={`/${p.unit}/quiz?mode=long`} onClick={writeThis}>Write the answer</a>
          </section>
        </div>
      )}
    </div>
  );
}
