/*
SCENE: Provisional measures under art 41 — four conditions, then a binding order
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → change the request → watch the four conditions → switch the reading of "indicate" → one check
INTENT: The Court indicates measures only if jurisdiction is not manifestly absent, the rights are plausible, the
  measures are linked to them, and irreparable harm is real and imminent; once indicated, they bind (LaGrand).
SUBJECT: the column of four conditions feeding the order; the first unmet one turns clay.
BEAT 1 (0–100%): selects and toggles; rows and verdict update within 200ms (colour only, 180ms ease-out). The
  "reading of art 41" select shows the hortatory argument and LaGrand's answer to it.
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (no motion beyond colour); off mode shows the same controls.
BUDGET: < 8 KB gz, no WebGL.
Source: concept laws2000-w08-provisional-measures; ICJ Statute art 41; LaGrand (Germany v United States) (2001)
para 102 — Week 8 slides 33–34; tutorial question 2(b).
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  jurisdiction: 'prima-facie' | 'manifestly-absent';
  plausible: boolean;
  link: boolean;
  harm: 'irreparable' | 'compensable' | 'remote';
  reading: 'lagrand' | 'hortatory';
}

const initial: S = { jurisdiction: 'prima-facie', plausible: true, link: true, harm: 'irreparable', reading: 'lagrand' };

type RowState = 'pass' | 'stop' | 'idle';
const TONE: Record<RowState, { c: string; mark: string; word: string }> = {
  pass: { c: 'var(--sage)', mark: '●', word: 'met' },
  stop: { c: 'var(--clay)', mark: '✕', word: 'not met' },
  idle: { c: 'var(--ink-3)', mark: '○', word: 'not reached' },
};

function Row({ n, label, sub, state }: { n: number; label: string; sub: string; state: RowState }) {
  const t = TONE[state];
  return (
    <li style={{ display: 'grid', gridTemplateColumns: '1.5rem minmax(0, 1fr) auto', gap: 'var(--s-2)', alignItems: 'start', padding: 'var(--s-2) var(--s-3)', background: 'var(--paper)', borderRadius: 'var(--r-sm)', border: `1.5px solid ${t.c}`, transition: 'border-color 180ms var(--ease-out)' }}>
      <span aria-hidden="true" className="mono" style={{ color: t.c }}>{t.mark}</span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 'var(--t-sm)', color: state === 'idle' ? 'var(--ink-2)' : 'var(--ink)' }}><span className="mono" style={{ color: 'var(--ink-2)' }}>{n} </span>{label}</span>
        <span style={{ display: 'block', fontSize: 'var(--t-xs)', lineHeight: 1.35, color: 'var(--ink-2)' }}>{sub}</span>
      </span>
      <span className="label" style={{ color: 'var(--ink-2)', whiteSpace: 'nowrap' }}>{t.word}</span>
    </li>
  );
}

const CONDS = [
  { id: 'jurisdiction', label: 'Absence of jurisdiction is not manifest', sub: 'prima facie jurisdiction — not a final ruling' },
  { id: 'plausible', label: 'Rights claimed are at least plausible', sub: 'not proved — plausible is enough at this stage' },
  { id: 'link', label: 'Link between those rights and the measures', sub: 'measures appropriate and necessary to protect them' },
  { id: 'harm', label: 'Real and imminent risk of irreparable harm', sub: 'before the final decision is given' },
] as const;

const met = (s: S, id: (typeof CONDS)[number]['id']) =>
  id === 'jurisdiction' ? s.jurisdiction === 'prima-facie' : id === 'harm' ? s.harm === 'irreparable' : !!s[id];

const STOP: Record<(typeof CONDS)[number]['id'], string> = {
  jurisdiction: 'Refused: the absence of jurisdiction is manifest, so the Court cannot indicate measures.',
  plausible: 'Refused: the rights for which protection is sought are not even plausible.',
  link: 'Refused: the measures requested are not linked to the rights claimed, so they are not appropriate and necessary.',
  harm: 'Refused: harm that can later be compensated, or that is not imminent, does not justify provisional measures.',
};

function view(s: S): SimView {
  const stop = CONDS.find((c) => !met(s, c.id));
  let reached = true;
  const figure = (
    <div className="xgates" role="group" aria-label="Four conditions for provisional measures under article 41, then the order and its binding force">
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--s-2)' }}>
        {CONDS.map((c, i) => {
          const ok = met(s, c.id);
          const state: RowState = !reached ? 'idle' : ok ? 'pass' : 'stop';
          if (!ok) reached = false;
          return <Row key={c.id} n={i + 1} label={c.label} sub={c.sub} state={state} />;
        })}
      </ol>
      <p style={{ margin: 'var(--s-3) 0 0', padding: 'var(--s-2) var(--s-3)', borderRadius: 'var(--r-sm)', border: '1.5px dashed var(--ink-3)', fontSize: 'var(--t-xs)', lineHeight: 1.4, color: stop ? 'var(--ink-3)' : 'var(--ink)' }}>
        {stop ? 'No order indicated.' : s.reading === 'lagrand'
          ? 'Order indicated — binding on the parties: the power to indicate measures "entails that such measures should be binding" (LaGrand, para 102).'
          : 'Order indicated. Argument: "indicate" means merely hortatory — LaGrand rejected this as contrary to the object and purpose of art 41.'}
      </p>
      <p className="xgates__end" data-state={stop ? 'stop' : 'pass'}>{stop ? 'request refused' : 'measures indicated → binding'}</p>
    </div>
  );
  const verdict = stop
    ? STOP[stop.id]
    : s.reading === 'lagrand'
      ? 'All four conditions are met: the Court can indicate the measures, and they bind the parties (LaGrand).'
      : 'All four conditions are met. The "merely hortatory" reading fails: in LaGrand the Court held provisional measures binding.';
  return { figure, verdict, tone: stop ? 'no' : 'yes' };
}

function describe(a: S, b: S) {
  if (a.jurisdiction !== b.jurisdiction) return b.jurisdiction === 'prima-facie' ? 'A treaty clause or other basis gives prima facie jurisdiction: its absence is not manifest.' : 'No basis of consent at all: the absence of jurisdiction is manifest.';
  if (a.plausible !== b.plausible) return b.plausible ? 'The rights claimed are plausible — no more is needed now.' : 'The rights claimed are not plausible.';
  if (a.link !== b.link) return b.link ? 'The measures protect the very rights in issue.' : 'The measures requested are unrelated to the rights claimed.';
  if (a.harm !== b.harm) return b.harm === 'irreparable' ? 'Harm that cannot be undone is imminent — e.g. loss of life or destruction of a site.' : b.harm === 'compensable' ? 'The loss could be compensated after judgment: not irreparable.' : 'The risk is remote, not real and imminent.';
  if (a.reading !== b.reading) return b.reading === 'lagrand' ? 'LaGrand: read in context, art 41 makes the measures binding.' : 'Trying the argument that "indicate" means the measures only recommend.';
  return '';
}

export default function ProvisionalMeasures() {
  return (
    <Simulation<S>
      label="Provisional measures: four conditions under article 41, then a binding order"
      terms={[
        { term: 'Provisional measures', def: 'Interim orders under art 41 that preserve the parties’ rights until judgment.' },
        { term: 'Prima facie jurisdiction', def: 'Enough that the absence of jurisdiction is not manifest — not a final ruling.' },
        { term: 'Irreparable harm', def: 'Harm a later judgment could not undo; it must be real and imminent.' },
        { term: 'LaGrand', def: 'The 2001 judgment holding that provisional measures are binding (para 102).' },
      ]}
      initial={initial}
      controls={[
        { key: 'jurisdiction', label: 'Basis of jurisdiction', type: 'select', options: [{ value: 'prima-facie', label: 'Prima facie (e.g. a treaty clause)' }, { value: 'manifestly-absent', label: 'None — manifestly absent' }] },
        { key: 'plausible', label: 'Rights claimed are plausible', type: 'toggle' },
        { key: 'link', label: 'Measures linked to those rights', type: 'toggle' },
        { key: 'harm', label: 'Risk before judgment', type: 'select', options: [{ value: 'irreparable', label: 'Real, imminent, irreparable' }, { value: 'compensable', label: 'Loss compensable later' }, { value: 'remote', label: 'Remote, not imminent' }] },
        { key: 'reading', label: 'Reading of "indicate" in art 41', type: 'select', options: [{ value: 'lagrand', label: 'As read in LaGrand' }, { value: 'hortatory', label: 'Merely hortatory' }] },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'State J seeks measures to stop State K exporting a product, claiming lost sales that could be compensated later. What is J’s main problem?',
        options: [
          { text: 'The Court must first finally decide that it has jurisdiction', why: 'At this stage the Court only needs to be satisfied that the absence of jurisdiction is not manifest.' },
          { text: 'There is no real and imminent risk of irreparable harm', correct: true, why: 'Loss that can be compensated after judgment is not irreparable, so provisional measures are not justified.' },
          { text: 'Provisional measures would not bind K anyway', why: 'LaGrand held provisional measures binding; the problem is that the harm here is not irreparable.' },
        ],
      }}
    />
  );
}
