/*
SCENE: ICC admissibility — a case passes art 17's filters: what a state with jurisdiction has done, how genuinely,
  and how grave the case is
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → set the national proceedings, their genuineness and the gravity → watch the case flip between
  admissible and inadmissible → one check
INTENT: Complementarity: national courts come first, so a case a state is genuinely handling (or has genuinely closed,
  or has tried) is inadmissible — unless the state is unwilling (shielding, unjustified delay, lack of independence or
  impartiality) or unable (collapse or unavailability of its judicial system); a case not grave enough never proceeds.
SUBJECT: the three filter rows; the indicator list beneath lights the one that opens the door.
BEAT 1 (0–100%): two selects and a toggle drive the rows; borders turn sage (lets the case through), clay (makes it
  inadmissible) or dashed (not reached); verdict within 200ms. Ease: CSS 180ms ease-out on border colour only.
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (no motion beyond colour).
BUDGET: < 7 KB gz, no WebGL.
Source: concept laws2000-w11-icc-admissibility-and-complementarity; rome-statute-art-17 (Week 11 Lecture Slides,
  slides 48–49). Art 20(3) is cited on the slides but its text is not given, so a prior trial is shown as
  inadmissible "where art 20(3) does not permit a trial", without modelling art 20(3) itself.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  national: 'none' | 'ongoing' | 'declined' | 'tried';
  quality: 'genuine' | 'shielding' | 'delay' | 'partial' | 'collapse';
  grave: boolean;
}

const initial: S = { national: 'ongoing', quality: 'genuine', grave: true };

type RowState = 'through' | 'blocks' | 'unreached';
interface Row { title: string; state: RowState; why: string }

const NATIONAL: Record<S['national'], string> = {
  none: 'No state with jurisdiction has acted.',
  ongoing: 'A state with jurisdiction is investigating or prosecuting (art 17(a)).',
  declined: 'A state with jurisdiction investigated and decided not to prosecute (art 17(b)).',
  tried: 'The person has already been tried for the conduct (art 17(c), art 20(3)).',
};
const QUALITY: Record<S['quality'], string> = {
  genuine: 'Genuine proceedings.',
  shielding: 'Unwilling: undertaken to shield the person from criminal responsibility.',
  delay: 'Unwilling: unjustified delay, inconsistent with an intent to bring the person to justice.',
  partial: 'Unwilling: not conducted independently or impartially, inconsistent with that intent.',
  collapse: 'Unable: total or substantial collapse or unavailability of the national judicial system.',
};

const acting = (s: S) => s.national === 'ongoing' || s.national === 'declined';

function rows(s: S): Row[] {
  const nat: Row = { title: 'National proceedings', state: s.national === 'none' ? 'through' : acting(s) && s.quality !== 'genuine' ? 'through' : 'blocks', why: NATIONAL[s.national] };
  const gen: Row = acting(s)
    ? { title: 'Genuinely carried out?', state: s.quality === 'genuine' ? 'blocks' : 'through', why: QUALITY[s.quality] }
    : { title: 'Genuinely carried out?', state: 'unreached', why: s.national === 'none' ? 'Nothing to assess — no national proceedings.' : 'For a prior trial the question is whether art 20(3) permits a trial by the Court.' };
  const grav: Row = { title: 'Sufficient gravity?', state: s.grave ? 'through' : 'blocks', why: s.grave ? 'Grave enough to justify further action by the Court.' : 'Not of sufficient gravity to justify further action (art 17(d)).' };
  return [nat, gen, grav];
}

const BORDER: Record<RowState, string> = {
  through: '1.5px solid var(--sage)',
  blocks: '2.5px solid var(--clay)',
  unreached: '1.5px dashed var(--ink-3)',
};
const LABEL: Record<RowState, string> = { through: 'lets the case through', blocks: 'makes it inadmissible', unreached: 'not in issue' };

function view(s: S): SimView {
  const rs = rows(s);
  const indicators: [S['quality'], string][] = [
    ['shielding', 'Unwilling — shielding the person'],
    ['delay', 'Unwilling — unjustified delay'],
    ['partial', 'Unwilling — not independent or impartial'],
    ['collapse', 'Unable — collapse or unavailability of the judicial system'],
  ];
  const figure = (
    <div className="xgates">
      <ol aria-label="Three admissibility filters" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--s-3)' }}>
        {rs.map((r) => (
          <li key={r.title} data-state={r.state} style={{ padding: 'var(--s-3) var(--s-4)', background: 'var(--paper)', borderRadius: 'var(--r-md)', border: BORDER[r.state], transition: 'border-color 180ms var(--ease-out)' }}>
            <p style={{ margin: 0, display: 'flex', gap: 'var(--s-3)', alignItems: 'baseline', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{r.title}</span>
              <span style={{ fontSize: 'var(--t-xs)', color: r.state === 'unreached' ? 'var(--ink-3)' : 'var(--ink-2)' }}>{LABEL[r.state]}</span>
            </p>
            <p style={{ margin: 'var(--s-1) 0 0', fontSize: 'var(--t-sm)', lineHeight: 1.4, color: 'var(--ink-2)' }}>{r.why}</p>
          </li>
        ))}
      </ol>
      <div className="xgates__circ">
        <p className="xgates__circ-title">What opens the door despite national proceedings:</p>
        <ul>
          {indicators.map(([k, t]) => (
            <li key={k} data-on={acting(s) && s.quality === k ? 'true' : undefined}>{acting(s) && s.quality === k ? '●' : '○'} {t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
  if (!s.grave) return { figure, verdict: 'Inadmissible: the case is not of sufficient gravity to justify further action by the Court (art 17(d)).', tone: 'no' };
  if (s.national === 'none') return { figure, verdict: 'Admissible: no state with jurisdiction has acted, and the case is grave enough — nothing in art 17 bars it.', tone: 'yes' };
  if (s.national === 'tried') return { figure, verdict: 'Inadmissible: the person has already been tried for the conduct, where art 20(3) does not permit a trial by the Court (art 17(c)).', tone: 'no' };
  if (s.quality === 'genuine') return { figure, verdict: s.national === 'ongoing' ? 'Inadmissible: a state with jurisdiction is genuinely investigating or prosecuting (art 17(a)) — complementarity.' : 'Inadmissible: the state genuinely investigated and decided not to prosecute (art 17(b)).', tone: 'no' };
  return { figure, verdict: s.quality === 'collapse' ? 'Admissible: the state is unable genuinely to carry out the proceedings, so they do not bar the Court.' : 'Admissible: the state is unwilling genuinely to carry out the proceedings, so they do not bar the Court.', tone: 'yes' };
}

function describe(a: S, b: S) {
  if (a.national !== b.national) return NATIONAL[b.national];
  if (a.quality !== b.quality) return acting(b) ? QUALITY[b.quality] : 'Genuineness matters only where a state is investigating or has decided not to prosecute.';
  if (a.grave !== b.grave) return b.grave ? 'Grave enough: the gravity filter lets the case through.' : 'Not grave enough: art 17(d) makes the case inadmissible whatever states have done.';
  return '';
}

export default function IccAdmissibilityAndComplementarity() {
  return (
    <Simulation<S>
      label="Whether a case is admissible before the ICC under art 17"
      terms={[
        { term: 'Complementarity', def: 'The ICC is “complementary to national criminal jurisdictions” (art 1): national courts come first.' },
        { term: 'Unwilling', def: 'Shielding the person, unjustified delay, or proceedings lacking independence or impartiality.' },
        { term: 'Unable', def: 'A total or substantial collapse or unavailability of the national judicial system.' },
        { term: 'Gravity', def: 'A case not grave enough to justify further action is inadmissible.' },
      ]}
      initial={initial}
      controls={[
        { key: 'national', label: 'What has a state with jurisdiction done?', type: 'select', options: [{ value: 'none', label: 'Nothing' }, { value: 'ongoing', label: 'Investigating or prosecuting' }, { value: 'declined', label: 'Investigated, decided not to prosecute' }, { value: 'tried', label: 'Already tried the person' }] },
        { key: 'quality', label: 'How genuine are those proceedings?', type: 'select', options: [{ value: 'genuine', label: 'Genuine' }, { value: 'shielding', label: 'Unwilling — shielding the person' }, { value: 'delay', label: 'Unwilling — unjustified delay' }, { value: 'partial', label: 'Unwilling — not independent or impartial' }, { value: 'collapse', label: 'Unable — judicial system collapsed' }] },
        { key: 'grave', label: 'Of sufficient gravity to justify further action', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'After a civil war, State Q’s courts have stopped functioning and it cannot obtain the accused or the evidence, though it says it is investigating. Is the case admissible?',
        options: [
          { text: 'No — Q has jurisdiction and is investigating', why: 'Art 17 defers only to genuine proceedings; a state unable genuinely to investigate does not bar the Court.' },
          { text: 'Yes, it may be — Q is unable genuinely to investigate', correct: true, why: 'A total or substantial collapse or unavailability of the judicial system, leaving Q unable to obtain the accused or evidence, shows inability.' },
          { text: 'No — only unwillingness, never inability, makes a case admissible', why: 'Art 17 speaks of a state “unwilling or unable” genuinely to act; inability is an express route.' },
        ],
      }}
    />
  );
}
