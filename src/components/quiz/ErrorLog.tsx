// Error log: every question answered wrongly in this unit, grouped by concept (weakest first), with what you chose,
// how sure you were, the right answer and both explanations. Re-test one item in place, or a whole concept in the quiz.
// Sure-and-wrong items carry a "watch" mark; items since answered correctly sink to the bottom as "now right".
// Misconception journal: per item, "What I believed" / "What fixed it" (settings journal:<questionId>, saved on blur);
// "Journal" lists only items with entries; "Copy as Markdown" exports the unit's journal (for Notion, Drive or notes).
import { useEffect, useMemo, useRef, useState } from 'react';
import { db } from '../../lib/db';
import { hasJournal, journalKey, journalMarkdown, JOURNAL_PREFIX, type JournalEntry } from '../../lib/learner';
import { outcome } from '../../lib/selectors';
import { startStudySync, useStudy } from '../../lib/store';
import CriterionRing from '../CriterionRing';
import { Mcq } from './Mcq';
import { asChoice, loadBank, type Bank, type McqQ, type Question, type TrueFalseQ } from './types';
import '../../styles/insight.css';

const fmt = (t: number) => new Date(t).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', timeZone: 'Australia/Sydney' });

/** The two journal fields for one item; saves on blur and says so in place. */
function JournalFields({ id, entry, onSave, autoFocus }: { id: string; entry?: JournalEntry; onSave: (id: string, e: JournalEntry) => Promise<void>; autoFocus?: boolean }) {
  const [believed, setBelieved] = useState(entry?.believed ?? '');
  const [fixed, setFixed] = useState(entry?.fixed ?? '');
  const [status, setStatus] = useState<'' | 'saving' | 'saved' | 'error'>('');
  const first = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { if (autoFocus) first.current?.focus(); }, []); // eslint-disable-line react-hooks/exhaustive-deps -- on open only
  const save = () => {
    if (believed.trim() === (entry?.believed ?? '') && fixed.trim() === (entry?.fixed ?? '')) return;
    setStatus('saving');
    onSave(id, { believed: believed.trim(), fixed: fixed.trim(), at: Date.now() }).then(() => setStatus('saved'), () => setStatus('error'));
  };
  const f = (k: 'believed' | 'fixed', label: string, value: string, set: (v: string) => void) => (
    <label className="errlog-journal__field">
      <span className="label">{label}</span>
      <textarea ref={k === 'believed' ? first : undefined} className="errlog-journal__input" rows={2} maxLength={600} value={value} onChange={(e) => { set(e.target.value); if (status) setStatus(''); }} onBlur={save} data-journal={k} />
    </label>
  );
  return (
    <div className="errlog-journal" data-journal-for={id}>
      {f('believed', 'What I believed', believed, setBelieved)}
      {f('fixed', 'What fixed it', fixed, setFixed)}
      <p className="errlog-journal__status" aria-live="polite">{status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : status === 'error' ? 'Not saved: storage is unavailable in this window.' : ''}</p>
    </div>
  );
}

export default function ErrorLog({ unit }: { unit: string }) {
  const [bank, setBank] = useState<Bank | null>(null);
  const [watchOnly, setWatchOnly] = useState(false);
  const [retest, setRetest] = useState<string | null>(null);
  const [journal, setJournal] = useState<Map<string, JournalEntry> | null>(null);
  const [journalOnly, setJournalOnly] = useState(false);
  const [opened, setOpened] = useState<Set<string>>(new Set());
  const [copy, setCopy] = useState<{ state: '' | 'copied' | 'failed'; text?: string }>({ state: '' });
  const attempts = useStudy((s) => s.attempts);
  const ready = useStudy((s) => s.ready);

  useEffect(() => {
    db.settings.where('key').startsWith(JOURNAL_PREFIX).toArray()
      .then((rows) => setJournal(new Map(rows.map((r) => [r.key.slice(JOURNAL_PREFIX.length), r.value as JournalEntry]))))
      .catch(() => setJournal(new Map()));
  }, []);
  const saveJournal = async (id: string, e: JournalEntry) => {
    setJournal((m) => new Map(m ?? []).set(id, e));
    setOpened((o) => (o.has(id) ? o : new Set(o).add(id))); // keep the fields in place even if both are cleared
    await db.settings.put({ key: journalKey(id), value: e });
  };

  useEffect(() => {
    startStudySync();
    loadBank(unit).then(setBank).catch(() => setBank({ unit, concepts: {}, weeks: [], cases: [], questions: [] }));
  }, [unit]);

  const groups = useMemo(() => {
    if (!bank) return [];
    const byId = new Map<string, Question>(bank.questions.map((q) => [q.id, q]));
    const perQ = new Map<string, typeof attempts>();
    for (const a of attempts) if (byId.has(a.questionId)) perQ.set(a.questionId, [...(perQ.get(a.questionId) ?? []), a]);
    const items = [...perQ].flatMap(([id, as]) => {
      const sorted = [...as].sort((a, b) => a.at - b.at);
      const wrongs = sorted.filter((a) => outcome(a) !== null && outcome(a)! < 0.5);
      if (!wrongs.length) return [];
      const lastWrong = wrongs[wrongs.length - 1];
      const latest = sorted[sorted.length - 1];
      return [{ q: byId.get(id)!, wrong: lastWrong, times: wrongs.length, watch: wrongs.some((a) => a.confidence === 'sure'), fixed: outcome(latest) === 1 && latest.at > lastWrong.at }];
    }).filter((x) => (!watchOnly || x.watch) && (!journalOnly || hasJournal(journal?.get(x.q.id))));
    const byConcept = new Map<string, typeof items>();
    for (const it of items) byConcept.set(it.q.concept, [...(byConcept.get(it.q.concept) ?? []), it]);
    return [...byConcept]
      .map(([concept, xs]) => ({ concept, open: xs.filter((x) => !x.fixed).length, items: xs.sort((a, b) => Number(a.fixed) - Number(b.fixed) || b.wrong.at - a.wrong.at) }))
      .sort((a, b) => b.open - a.open);
  }, [bank, attempts, watchOnly, journalOnly, journal]);

  if (!bank || !ready || !journal) return <p className="quiz__empty" aria-busy="true">Loading your answers…</p>;
  const total = groups.reduce((s, g) => s + g.open, 0);
  const entries = bank.questions.flatMap((q) => {
    const entry = journal.get(q.id);
    if (!hasJournal(entry)) return [];
    const stem = q.type === 'mcq' || q.type === 'truefalse' ? asChoice(q).stem : q.prompt;
    return [{ concept: bank.concepts[q.concept]?.title ?? q.concept, stem, entry }];
  });
  const copyJournal = async () => {
    const text = journalMarkdown(`${unit.toUpperCase()} misconception journal`, entries);
    try {
      await navigator.clipboard.writeText(text);
      setCopy({ state: 'copied' });
    } catch {
      setCopy({ state: 'failed', text });
    }
  };

  return (
    <div className="errlog">
      <div className="errlog__bar">
        <p className="errlog__count" aria-live="polite">{total ? `${total} to revisit across ${groups.filter((g) => g.open).length} concepts` : groups.length ? 'All caught up — everything here is now right.' : 'Nothing here yet. Wrong answers collect here as you quiz.'}</p>
        <div className="errlog-tools">
          <button type="button" className="chip" aria-pressed={watchOnly} onClick={() => setWatchOnly((w) => !w)}>Sure but wrong only</button>
          <button type="button" className="chip" aria-pressed={journalOnly} onClick={() => setJournalOnly((j) => !j)}>Journal{entries.length ? ` (${entries.length})` : ''}</button>
          <button type="button" className="btn btn--ghost btn--sm" disabled={!entries.length} onClick={copyJournal}>Copy as Markdown</button>
        </div>
      </div>
      <p className="errlog-tools__status" aria-live="polite">
        {copy.state === 'copied' ? `Copied ${entries.length} journal ${entries.length === 1 ? 'entry' : 'entries'} as Markdown.` : copy.state === 'failed' ? 'Could not reach the clipboard: select the text below and copy it.' : journalOnly && !entries.length ? 'No journal entries yet. Add one under any wrong answer.' : ''}
      </p>
      {copy.state === 'failed' && <textarea className="errlog-copy" readOnly value={copy.text} aria-label="Journal as Markdown" onFocus={(e) => e.currentTarget.select()} />}
      {groups.map((g) => {
        const meta = bank.concepts[g.concept];
        return (
          <section key={g.concept} className="errlog__group" aria-labelledby={`el-${g.concept}`}>
            <div className="errlog__head">
              <CriterionRing conceptId={g.concept} title={meta?.title} size={20} />
              <h2 id={`el-${g.concept}`} className="errlog__title"><a href={meta?.href}>{meta?.title ?? g.concept}</a></h2>
              <span className="errlog__n mono">{g.open}</span>
              <a className="btn btn--secondary btn--sm" href={`/${unit}/quiz?concept=${g.concept}`}>Re-test concept</a>
            </div>
            <ol className="errlog__items">
              {g.items.map(({ q, wrong, times, watch, fixed }) => {
                const choice = q.type === 'mcq' || q.type === 'truefalse' ? asChoice(q) : null;
                const chose = choice && typeof wrong.answer === 'number' ? choice.options[wrong.answer as number] : null;
                const right = choice?.options.find((o) => o.correct);
                const stem = choice?.stem ?? ('prompt' in q ? q.prompt : '');
                return (
                  <li key={q.id} className="errlog__item" data-fixed={fixed || undefined} data-watch={watch || undefined}>
                    {retest === q.id && choice ? (
                      <Mcq q={q as McqQ | TrueFalseQ} concept={meta} mode="retest" onNext={() => setRetest(null)} />
                    ) : (
                      <>
                        <p className="errlog__stem">{stem}</p>
                        <p className="errlog__meta">
                          {fixed ? <strong>Now right</strong> : <>Wrong {times > 1 ? `${times} times` : 'once'}</>} · last {fmt(wrong.at)}
                          {wrong.confidence && <> · you were {wrong.confidence}</>}
                          {watch && !fixed && <span className="errlog__watch"> · watch</span>}
                        </p>
                        {chose && right && (
                          <div className="errlog__why">
                            <p><span className="label">You chose</span> {chose.text} — <em>{chose.why}</em></p>
                            <p><span className="label">Right answer</span> {right.text} — <em>{right.why}</em></p>
                          </div>
                        )}
                        {!choice && typeof wrong.score === 'number' && <p className="errlog__why">Marked {Math.round(wrong.score * 100)}% against the rubric.</p>}
                        {choice && <button type="button" className="btn btn--ghost btn--sm" onClick={() => setRetest(q.id)}>Re-test this one</button>}
                        {hasJournal(journal.get(q.id)) || opened.has(q.id) ? (
                          <JournalFields id={q.id} entry={journal.get(q.id)} onSave={saveJournal} autoFocus={opened.has(q.id)} />
                        ) : (
                          <button type="button" className="btn btn--ghost btn--sm errlog-journal__open" onClick={() => setOpened((o) => new Set(o).add(q.id))}>Add to journal</button>
                        )}
                      </>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
