// Quiz page island: mode chips (Mixed, By week, Weakest first, Tell apart, Drills, Quick-fire, Match, Exam sim, Short
// answer, Problem question, Full paper, Where am I?), each addressable as ?mode=…; loads the unit's bank and progress
// once, then renders the chosen mode.
import { useEffect, useState } from 'react';
import { startStudySync, useStudy } from '../../lib/store';
import { ExamSim } from './ExamSim';
import RealPaper from './RealPaper';
import type { ExamInfo } from '../../lib/exam';
import { MatchGame } from './MatchGame';
import { QuickFire } from './QuickFire';
import QuizRunner, { type RunnerMode } from './QuizRunner';
import { loadBank, type Bank } from './types';
import { SET_KEY } from './BankBrowser';
import ContrastDrill from './ContrastDrill';
import Diagnostic from './Diagnostic';
import Drills from './Drills';

type Mode = RunnerMode | 'quickfire' | 'match' | 'exam' | 'paper' | 'revision' | 'contrast' | 'drills' | 'diagnostic';
const readSet = (): string[] => { try { return JSON.parse(sessionStorage.getItem(SET_KEY) || '[]'); } catch { return []; } };
const MODES: { id: Mode; label: string }[] = [
  { id: 'mixed', label: 'Mixed' },
  { id: 'week', label: 'By week' },
  { id: 'weakest', label: 'Weakest first' },
  { id: 'contrast', label: 'Tell apart' },
  { id: 'drills', label: 'Drills' },
  { id: 'quickfire', label: 'Quick-fire' },
  { id: 'match', label: 'Match' },
  { id: 'exam', label: 'Exam sim' },
  { id: 'short', label: 'Short answer' },
  { id: 'long', label: 'Problem question' },
  { id: 'paper', label: 'Full paper' },
  { id: 'diagnostic', label: 'Where am I?' },
  { id: 'revision', label: 'Revision set' }, // shown only when the bank has one
];
const isMode = (m: string | null): m is Mode => m === 'set' || MODES.some((x) => x.id === m);

export default function QuizModes({ unit, answerStyle, exam }: { unit: string; answerStyle: 'problem' | 'essay'; exam?: ExamInfo }) {
  const [bank, setBank] = useState<Bank | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('mixed');
  const [week, setWeek] = useState<string | undefined>();
  const [concept, setConcept] = useState<string | undefined>();
  const [seed] = useState(() => Date.now());
  const [setIds, setSetIds] = useState<string[]>([]);
  const ready = useStudy((s) => s.ready);

  useEffect(() => {
    startStudySync();
    const p = new URLSearchParams(location.search);
    const m = p.get('mode') ?? (p.get('type') === 'short' ? 'short' : p.get('type') === 'long' ? 'long' : null);
    if (isMode(m)) setMode(m);
    if (m === 'set') setSetIds(readSet());
    setWeek(p.get('week') ?? undefined);
    setConcept(p.get('concept') ?? undefined);
    loadBank(unit).then(setBank, (e) => setError(String(e)));
  }, [unit]);

  const choose = (m: Mode) => {
    setMode(m);
    const u = new URL(location.href);
    u.searchParams.set('mode', m);
    u.searchParams.delete('type');
    history.replaceState(history.state, '', u);
  };
  const chooseWeek = (w: string) => {
    setWeek(w);
    const u = new URL(location.href);
    u.searchParams.set('week', w);
    history.replaceState(history.state, '', u);
  };

  const labelFor = (m: { id: Mode; label: string }) => (m.id === 'long' && answerStyle === 'essay' ? 'Essay question' : m.label);

  return (
    <div className="quiz-modes">
      <nav className="quiz-modes__bar" aria-label="Quiz mode">
        {MODES.filter((m) => m.id !== 'revision' || bank?.questions.some((q) => q.set === 'revision')).map((m) => (
          <button key={m.id} type="button" className="chip" aria-pressed={mode === m.id} onClick={() => choose(m.id)}>{labelFor(m)}</button>
        ))}
      </nav>
      {mode === 'week' && bank && (
        <nav className="quiz-modes__weeks" aria-label="Week">
          {bank.weeks.map((w) => (
            <button key={w.id} type="button" className="chip" aria-pressed={week === w.id} onClick={() => chooseWeek(w.id)}>Week {w.number}</button>
          ))}
        </nav>
      )}
      {mode === 'set' && <p className="quiz-modes__filter">Re-testing {setIds.length} chosen {setIds.length === 1 ? 'question' : 'questions'} · <a href={`/${unit}/questions`}>back to the bank</a></p>}
      {concept && mode !== 'diagnostic' && (
        <p className="quiz-modes__filter">
          {mode === 'contrast' ? 'Starting with' : 'Only'}: {bank?.concepts[concept]?.title ?? concept} ·{' '}
          {mode === 'contrast' || mode === 'drills' ? <a href={`/${unit}/quiz?mode=${mode}`}>{mode === 'contrast' ? 'any set' : 'all drills'}</a> : <a href={`/${unit}/quiz`}>all concepts</a>}
        </p>
      )}
      {error ? (
        <p className="quiz__empty">Could not load questions. {error}</p>
      ) : !bank || !ready ? (
        <p className="quiz__empty" aria-busy="true">Loading questions…</p>
      ) : mode === 'quickfire' ? (
        <QuickFire key="qf" bank={bank} seed={seed} />
      ) : mode === 'contrast' ? (
        <ContrastDrill key={`contrast-${concept}`} bank={bank} seed={seed} concept={concept} onMixed={() => choose('mixed')} />
      ) : mode === 'drills' ? (
        <Drills key={`drills-${concept}`} bank={bank} seed={seed} concept={concept} />
      ) : mode === 'diagnostic' ? (
        <Diagnostic key="diagnostic" bank={bank} seed={seed} />
      ) : mode === 'match' ? (
        <MatchGame key="match" bank={bank} seed={seed} />
      ) : mode === 'exam' ? (
        <ExamSim key="exam" bank={bank} seed={seed} />
      ) : mode === 'revision' ? (
        <QuizRunner key="revision" bank={bank} mode="set" ids={bank.questions.filter((q) => q.set === 'revision').map((q) => q.id)} seed={seed} />
      ) : mode === 'paper' ? (
        exam ? <RealPaper key="paper" unit={unit} bank={bank} exam={exam} seed={seed} /> : <p className="quiz__empty">No exam details for this unit.</p>
      ) : mode === 'week' && !week ? (
        <p className="quiz__empty">Choose a week.</p>
      ) : (
        <QuizRunner key={`${mode}-${week}-${concept}`} bank={bank} mode={mode} week={week} concept={concept} ids={setIds} seed={seed} />
      )}
    </div>
  );
}
