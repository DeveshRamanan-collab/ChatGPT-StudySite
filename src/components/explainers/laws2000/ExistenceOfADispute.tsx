/*
SCENE: Is there a dispute? — the objective test that opens the Court's door
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → change the facts → watch five conditions light in order → one check
INTENT: Show that whether a dispute exists is decided objectively from the facts — a specific issue, positive
  opposition, communication, awareness, all before filing — and that the respondent's bare denial changes nothing.
SUBJECT: the column of five conditions; the first unmet one turns clay and stops the jurisdiction lamp.
BEAT 1 (0–100%): controls for the facts; each condition row updates within 200ms (colour only, 180ms ease-out);
  the denial row stays grey whatever is chosen, because it is wired to nothing.
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (no motion beyond colour); off mode shows the same controls.
BUDGET: < 8 KB gz, no WebGL.
Source: concept laws2000-w08-existence-of-a-dispute; Mavrommatis (1924), Peace Treaties (1950), South West Africa
(1962), Marshall Islands v UK (2016), Georgia v Russian Federation (2011) — Week 8 slides 9–12.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  issue: 'specific' | 'friction';
  opposed: boolean;
  communicated: boolean;
  aware: boolean;
  timing: 'before' | 'after';
  denial: boolean;
}

const initial: S = { issue: 'specific', opposed: true, communicated: true, aware: true, timing: 'before', denial: true };

type RowState = 'pass' | 'stop' | 'idle' | 'note';
const TONE: Record<RowState, { c: string; mark: string; word: string }> = {
  pass: { c: 'var(--sage)', mark: '●', word: 'met' },
  stop: { c: 'var(--clay)', mark: '✕', word: 'not met' },
  idle: { c: 'var(--ink-3)', mark: '○', word: 'not reached' },
  note: { c: 'var(--ink-3)', mark: '–', word: 'no effect' },
};

function Row({ label, sub, state }: { label: string; sub: string; state: RowState }) {
  const t = TONE[state];
  return (
    <li style={{ display: 'grid', gridTemplateColumns: '1.5rem minmax(0, 1fr) auto', gap: 'var(--s-2)', alignItems: 'start', padding: 'var(--s-2) var(--s-3)', background: 'var(--paper)', borderRadius: 'var(--r-sm)', border: `1.5px solid ${t.c}`, borderStyle: state === 'note' ? 'dashed' : 'solid', transition: 'border-color 180ms var(--ease-out)' }}>
      <span aria-hidden="true" className="mono" style={{ color: t.c }}>{t.mark}</span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 'var(--t-sm)', color: state === 'idle' ? 'var(--ink-2)' : 'var(--ink)' }}>{label}</span>
        <span style={{ display: 'block', fontSize: 'var(--t-xs)', lineHeight: 1.35, color: 'var(--ink-2)' }}>{sub}</span>
      </span>
      <span className="label" style={{ color: 'var(--ink-2)', whiteSpace: 'nowrap' }}>{t.word}</span>
    </li>
  );
}

const CONDS = [
  { id: 'issue', label: 'A specific issue, more than mere friction', sub: 'a disagreement on a point of law or fact (Mavrommatis)' },
  { id: 'opposed', label: 'The claim is positively opposed', sub: 'clearly opposite views (South West Africa)' },
  { id: 'communicated', label: 'Communication between the parties', sub: 'notes, statements, conduct (Marshall Islands; Georgia v Russia)' },
  { id: 'aware', label: 'Respondent aware, or could not have been unaware', sub: 'of the positive opposition (South West Africa)' },
  { id: 'timing', label: 'All in place when proceedings were instituted', sub: 'no dispute at filing, no jurisdiction' },
] as const;

const met = (s: S, id: (typeof CONDS)[number]['id']) =>
  id === 'issue' ? s.issue === 'specific' : id === 'timing' ? s.timing === 'before' : !!s[id];

const STOP: Record<(typeof CONDS)[number]['id'], string> = {
  issue: 'No dispute: general friction is not enough — the views must be opposed on a specific, identifiable issue.',
  opposed: 'No dispute: the respondent has not positively opposed the claim, so there are no clearly opposite views.',
  communicated: 'No dispute shown: without some communication between the parties, opposed views cannot be demonstrated.',
  aware: 'No dispute: the respondent was not aware, and could not have been aware, that its views were positively opposed.',
  timing: 'No jurisdiction: the opposition arose only after filing, and a dispute must exist when proceedings are instituted.',
};

function view(s: S): SimView {
  const stop = CONDS.find((c) => !met(s, c.id));
  let reached = true;
  const figure = (
    <div className="xgates" role="group" aria-label="Five conditions for the existence of a dispute, tested in order, and the respondent's denial">
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--s-2)' }}>
        {CONDS.map((c) => {
          const ok = met(s, c.id);
          const state: RowState = !reached ? 'idle' : ok ? 'pass' : 'stop';
          if (!ok) reached = false;
          return <Row key={c.id} label={c.label} sub={c.sub} state={state} />;
        })}
      </ol>
      <ul style={{ listStyle: 'none', margin: 'var(--s-3) 0 0', padding: 0 }}>
        <Row label={s.denial ? 'Respondent says "there is no dispute"' : 'Respondent says nothing about it'} sub="mere denial does not prove non-existence (Peace Treaties)" state="note" />
      </ul>
      <p className="xgates__end" data-state={stop ? 'stop' : 'pass'}>{stop ? 'no jurisdiction' : 'dispute exists → on to consent'}</p>
    </div>
  );
  const verdict = stop
    ? STOP[stop.id]
    : `A dispute exists, decided objectively from the facts${s.denial ? ' — the respondent’s denial does not prove otherwise' : ''}. The Court can go on to consent.`;
  return { figure, verdict, tone: stop ? 'no' : 'yes' };
}

function describe(a: S, b: S) {
  if (a.issue !== b.issue) return b.issue === 'specific' ? 'Opposed views now concern a specific, identifiable issue.' : 'Only general friction between the states: more is needed for a dispute.';
  if (a.opposed !== b.opposed) return b.opposed ? 'The respondent rejects the claim: its position positively opposes it.' : 'The respondent has not opposed the claim, so there are no clearly opposite views.';
  if (a.communicated !== b.communicated) return b.communicated ? 'The parties have exchanged views — the strongest evidence is bilateral diplomatic exchanges.' : 'Nothing passed between the parties: opposed views cannot be shown.';
  if (a.aware !== b.aware) return b.aware ? 'The respondent knew, or could not have been unaware, of the opposition.' : 'The respondent had no way of knowing its views were opposed.';
  if (a.timing !== b.timing) return b.timing === 'before' ? 'The opposition existed before the application was filed.' : 'The opposition arose only after filing — too late for jurisdiction.';
  if (a.denial !== b.denial) return 'The denial changes nothing: the existence of a dispute is a matter for objective determination.';
  return '';
}

export default function ExistenceOfADispute() {
  return (
    <Simulation<S>
      label="Is there a dispute? Five conditions tested in order, and a denial that changes nothing"
      terms={[
        { term: 'Legal dispute', def: 'A disagreement on a point of law or fact, a conflict of legal views or interests (Mavrommatis).' },
        { term: 'Objective determination', def: 'The Court decides from the facts; a party’s denial is not decisive (Peace Treaties).' },
        { term: 'Positively opposed', def: 'One side’s claim is rejected by the other, and the respondent knew it (South West Africa).' },
        { term: 'Date of institution', def: 'The day proceedings are filed — the dispute must already exist then.' },
      ]}
      initial={initial}
      controls={[
        { key: 'issue', label: 'What divides the states', type: 'select', options: [{ value: 'specific', label: 'Opposed views on an identifiable issue' }, { value: 'friction', label: 'Only general friction' }] },
        { key: 'opposed', label: 'Respondent positively opposes the claim', type: 'toggle' },
        { key: 'communicated', label: 'Views exchanged (notes, statements, conduct)', type: 'toggle' },
        { key: 'aware', label: 'Respondent aware, or could not have been unaware', type: 'toggle' },
        { key: 'timing', label: 'When the opposition arose', type: 'select', options: [{ value: 'before', label: 'Before proceedings were instituted' }, { value: 'after', label: 'Only after filing' }] },
        { key: 'denial', label: 'Respondent tells the Court "there is no dispute"', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'State R tells the ICJ "there is no dispute between us". What decides whether one exists?',
        options: [
          { text: 'R’s denial, since a dispute needs both sides to accept that they disagree', why: 'If a denial were decisive, any respondent could escape a case; the mere denial of a dispute does not prove its non-existence (Peace Treaties).' },
          { text: 'An objective examination of the facts — opposed views the respondent knew of', correct: true, why: 'Existence is a matter for objective determination: clearly opposite views, positively opposed and known to the respondent, shown by the facts (South West Africa; Georgia v Russia).' },
          { text: 'A Security Council finding that the situation endangers peace', why: 'No Security Council finding is required; the Court itself determines objectively whether a dispute exists.' },
        ],
      }}
    />
  );
}
