// Simulation base: controls bound to a pure state → view function. The view renders before the concept text
// ("interact first"); a "what changed" caption explains each change; Reset returns to the starting state.
// 200-features pass: because view() is pure, an Explore panel can run it for every value of one fact (variable
// isolation, parameter sweep, threshold — 61, 64, 66), for every pair of values of two facts (sensitivity grid, 77),
// hold one set of facts beside another (linked scenarios, 62) and keep an experiment notebook (70).
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import '../../../styles/sim-explore.css';
import { useExplainer } from '../context';
import { ExplainerCheck, type CheckOption } from './ExplainerCheck';
import { TermsBeat, type Term } from './TermsBeat';

export type Control<S> =
  | { key: keyof S & string; label: string; type: 'toggle' }
  | { key: keyof S & string; label: string; type: 'select'; options: { value: string; label: string }[] };

export interface SimView { figure: ReactNode; verdict: string; tone: 'yes' | 'no' | 'open' }

interface Props<S extends Record<string, unknown>> {
  terms: Term[];
  initial: S;
  controls: Control<S>[];
  view: (s: S) => SimView;
  /** Plain sentence for the caption after a change (prev → next). */
  describe: (prev: S, next: S) => string;
  check: { question: string; options: CheckOption[] };
  label: string;
}

export function Simulation<S extends Record<string, unknown>>({ terms, initial, controls, view, describe, check, label }: Props<S>) {
  const { conceptId } = useExplainer();
  const [s, setS] = useState<S>(initial);
  const [changed, setChanged] = useState<string>('Change a control to see what happens.');
  const tick = useRef(0);
  const v = useMemo(() => view(s), [s, view]);
  const set = (patch: Partial<S>) => {
    const next = { ...s, ...patch };
    setChanged(describe(s, next));
    tick.current += 1;
    setS(next);
  };

  return (
    <div className="xsim">
      <TermsBeat terms={terms} />
      <div className="xsim__body">
        <fieldset className="xsim__controls">
          <legend className="label">Change the facts</legend>
          {controls.map((c) => {
            const id = `${conceptId}-${c.key}`;
            return c.type === 'toggle' ? (
              <label key={c.key} className="xsim__toggle" htmlFor={id}>
                <input id={id} type="checkbox" checked={!!s[c.key]} onChange={(e) => set({ [c.key]: e.currentTarget.checked } as Partial<S>)} />
                <span>{c.label}</span>
              </label>
            ) : (
              <label key={c.key} className="xsim__select" htmlFor={id}>
                <span className="label">{c.label}</span>
                <select id={id} value={String(s[c.key])} onChange={(e) => set({ [c.key]: e.currentTarget.value } as Partial<S>)}>
                  {c.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </label>
            );
          })}
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => { setS(initial); setChanged('Back to the start.'); }}>Reset</button>
        </fieldset>
        <figure className="xsim__view" aria-label={label}>
          {v.figure}
          <figcaption className="xsim__verdict" data-tone={v.tone} aria-live="polite" data-verdict>{v.verdict}</figcaption>
        </figure>
      </div>
      <p className="xsim__changed" key={tick.current} data-changed>{changed}</p>
      <SimExplore conceptId={conceptId} state={s} controls={controls} view={view} onRestore={(x) => { setS(x); setChanged('Restored a saved experiment.'); }} />
      <ExplainerCheck {...check} />
    </div>
  );
}

// ---- Explore panel ---------------------------------------------------------------------------------------------
const TONE: Record<SimView['tone'], { mark: string; word: string }> = { yes: { mark: '✓', word: 'Yes' }, no: { mark: '✕', word: 'No' }, open: { mark: '~', word: 'Open' } };
type Opt = { value: unknown; label: string };
function optionsOf<S>(c: Control<S>): Opt[] {
  return c.type === 'toggle' ? [{ value: false, label: 'No' }, { value: true, label: 'Yes' }] : c.options.map((o) => ({ value: o.value, label: o.label }));
}
function labelOf<S extends Record<string, unknown>>(c: Control<S>, v: unknown) {
  return optionsOf(c).find((o) => String(o.value) === String(v))?.label ?? String(v);
}
function factsLine<S extends Record<string, unknown>>(controls: Control<S>[], s: S) {
  return controls.map((c) => `${c.label}: ${labelOf(c, s[c.key])}`).join(' · ');
}
interface Note { at: number; state: Record<string, unknown>; verdict: string; tone: SimView['tone']; note: string }

function SimExplore<S extends Record<string, unknown>>({ conceptId, state, controls, view, onRestore }: { conceptId: string; state: S; controls: Control<S>[]; view: (s: S) => SimView; onRestore: (s: S) => void }) {
  const [tab, setTab] = useState<'one' | 'two' | 'compare' | 'notes'>('one');
  const [a, setA] = useState(controls[0]?.key ?? '');
  const [b, setB] = useState(controls[1]?.key ?? controls[0]?.key ?? '');
  const [held, setHeld] = useState<S | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState('');
  const key = `simnotes:${conceptId}`;
  useEffect(() => { import('../../../lib/db').then(({ db }) => db.settings.get(key)).then((r) => setNotes((r?.value as Note[]) ?? [])).catch(() => {}); }, [key]);
  const saveNotes = (n: Note[]) => { setNotes(n); import('../../../lib/db').then(({ db }) => db.settings.put({ key, value: n })).catch(() => {}); };
  if (!controls.length) return null;
  const now = view(state);
  const ca = controls.find((c) => c.key === a) ?? controls[0];
  const cb = controls.find((c) => c.key === b && c.key !== ca.key) ?? controls.find((c) => c.key !== ca.key);
  const verdictFor = (patch: Partial<S>) => view({ ...state, ...patch });
  const tabs: [typeof tab, string][] = [['one', 'One fact at a time'], ...(controls.length > 1 ? [['two', 'Two facts together'] as [typeof tab, string]] : []), ['compare', 'Compare two scenarios'], ['notes', `Notebook${notes.length ? ` (${notes.length})` : ''}`]];
  return (
    <details className="sim-explore">
      <summary>Explore this model</summary>
      <p className="sim-explore__note">A simplified model: it follows only the facts you can change above, with everything else held as you set it. Real cases turn on more.</p>
      <div className="sim-explore__tabs" role="group" aria-label="Explore">
        {tabs.map(([t, l]) => <button key={t} type="button" className="chip" aria-pressed={tab === t} onClick={() => setTab(t)}>{l}</button>)}
      </div>
      {tab === 'one' && (
        <div>
          <div className="sim-explore__pick"><label className="label" htmlFor={`${conceptId}-sweep`}>Change only</label>
            <select id={`${conceptId}-sweep`} value={ca.key} onChange={(e) => setA(e.currentTarget.value)}>{controls.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}</select>
          </div>
          <table className="sim-explore__table">
            <caption className="visually-hidden">Outcome for each value of {ca.label}, other facts held</caption>
            <thead><tr><th scope="col">{ca.label}</th><th scope="col">Outcome</th></tr></thead>
            <tbody>{optionsOf(ca).map((o) => {
              const v = verdictFor({ [ca.key]: o.value } as Partial<S>);
              const current = String(state[ca.key]) === String(o.value);
              return <tr key={String(o.value)} data-current={current || undefined}><th scope="row">{o.label}{current && <span className="sim-explore__now"> (now)</span>}</th><td><span className="sim-explore__mark" data-tone={v.tone} aria-hidden="true">{TONE[v.tone].mark}</span> {v.verdict}{v.tone !== now.tone && <span className="sim-explore__flip"> — changes the outcome</span>}</td></tr>;
            })}</tbody>
          </table>
        </div>
      )}
      {tab === 'two' && cb && (
        <div>
          <p className="sim-explore__pickrow">
            <span className="sim-explore__pick"><label className="label" htmlFor={`${conceptId}-rows`}>Rows</label><select id={`${conceptId}-rows`} value={ca.key} onChange={(e) => setA(e.currentTarget.value)}>{controls.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}</select></span>
            <span className="sim-explore__pick"><label className="label" htmlFor={`${conceptId}-cols`}>Columns</label><select id={`${conceptId}-cols`} value={cb.key} onChange={(e) => setB(e.currentTarget.value)}>{controls.filter((c) => c.key !== ca.key).map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}</select></span>
          </p>
          <div className="sim-explore__scroll">
            <table className="sim-explore__grid">
              <caption className="visually-hidden">Outcome for each pair of values of {ca.label} and {cb.label}</caption>
              <thead><tr><td /> {optionsOf(cb).map((o) => <th key={String(o.value)} scope="col">{o.label}</th>)}</tr></thead>
              <tbody>{optionsOf(ca).map((r) => (
                <tr key={String(r.value)}><th scope="row">{r.label}</th>{optionsOf(cb).map((c) => {
                  const v = verdictFor({ [ca.key]: r.value, [cb.key]: c.value } as Partial<S>);
                  return <td key={String(c.value)} data-tone={v.tone} title={v.verdict}><span aria-hidden="true">{TONE[v.tone].mark}</span> <span className="sim-explore__word">{TONE[v.tone].word}</span></td>;
                })}</tr>
              ))}</tbody>
            </table>
          </div>
          <p className="sim-explore__legend">✓ yes · ✕ no · ~ open (other facts held as you set them)</p>
        </div>
      )}
      {tab === 'compare' && (
        <div>
          {!held ? (
            <p><button type="button" className="btn btn--secondary btn--sm" onClick={() => setHeld(state)}>Hold these facts as scenario A</button> then change the facts above to build scenario B.</p>
          ) : (
            <>
              <div className="sim-explore__pair">
                {[['A (held)', held], ['B (now)', state]].map(([name, st]) => {
                  const v = view(st as S);
                  return <div key={name as string} className="sim-explore__side"><p className="label">Scenario {name as string}</p><p><span className="sim-explore__mark" data-tone={v.tone} aria-hidden="true">{TONE[v.tone].mark}</span> {v.verdict}</p><p className="sim-explore__facts">{factsLine(controls, st as S)}</p></div>;
                })}
              </div>
              <p className="sim-explore__diff">{controls.filter((c) => String(held[c.key]) !== String(state[c.key])).map((c) => `${c.label}: ${labelOf(c, held[c.key])} → ${labelOf(c, state[c.key])}`).join(' · ') || 'The two scenarios have the same facts.'}</p>
              <p><button type="button" className="btn btn--ghost btn--sm" onClick={() => setHeld(null)}>Clear scenario A</button></p>
            </>
          )}
        </div>
      )}
      {tab === 'notes' && (
        <div>
          <div className="sim-explore__pick sim-explore__pick--wide"><label className="label" htmlFor={`${conceptId}-note`}>What did you expect, and what did you see?</label>
            <textarea id={`${conceptId}-note`} rows={2} value={draft} onChange={(e) => setDraft(e.currentTarget.value)} />
          </div>
          <p><button type="button" className="btn btn--secondary btn--sm" onClick={() => { saveNotes([{ at: Date.now(), state: { ...state }, verdict: now.verdict, tone: now.tone, note: draft.trim() }, ...notes].slice(0, 30)); setDraft(''); }}>Save this experiment</button></p>
          {notes.length > 0 && (
            <ol className="sim-explore__notes">{notes.map((n, i) => (
              <li key={n.at}>
                <p className="sim-explore__facts">{factsLine(controls, n.state as S)}</p>
                <p><span className="sim-explore__mark" data-tone={n.tone} aria-hidden="true">{TONE[n.tone].mark}</span> {n.verdict}</p>
                {n.note && <p className="sim-explore__mine">“{n.note}”</p>}
                <p className="sim-explore__acts">
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => onRestore({ ...state, ...(n.state as S) })}>Restore</button>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => saveNotes(notes.filter((_, j) => j !== i))}>Delete</button>
                </p>
              </li>
            ))}</ol>
          )}
        </div>
      )}
    </details>
  );
}
