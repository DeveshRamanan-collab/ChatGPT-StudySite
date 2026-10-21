/*
SCENE: Derogations in emergencies (ICCPR art 4) and limitations outside them
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → set the emergency, the right, how far the measure goes and the safeguards → watch the checklist stop at
  the first failed condition → one check
INTENT: Show art 4 as an ordered checklist — qualifying, proclaimed emergency; not an art 4(2) right; strictly required
  (nature, duration, impact); consistent with other obligations incl. jus cogens; no discrimination on the listed
  grounds; notified — and that without an emergency the different limitation test applies.
SUBJECT: the checklist's first red row, or the green verdict when every row passes.
BEAT 1 (0–100%): toggles and selects relight the rows (passed / stops here / not reached / not applicable); verdict
  within 200ms. Ease: CSS 180ms ease-out on colour only.
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (no motion beyond colour).
BUDGET: < 7 KB gz, no WebGL.
Source: concept laws2000-w12-derogations-and-limitations; authorities iccpr-art-4, achr-art-27, vclt-art-53; case
  aksoy-v-turkey (para 78); Week 12 lecture slides 19–21. The rights offered are those on the slides' ICCPR list,
  split by whether art 4(2) names them.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  emergency: boolean;
  proclaimed: boolean;
  right: 'a6' | 'a7' | 'a11' | 'a9' | 'a12';
  measure: 'strict' | 'excessive';
  consistent: boolean;
  discriminates: boolean;
  notified: boolean;
  lawAndAim: boolean;
}

const initial: S = { emergency: true, proclaimed: true, right: 'a9', measure: 'excessive', consistent: true, discriminates: false, notified: true, lawAndAim: true };

const RIGHT: Record<S['right'], { label: string; nonDerogable: boolean }> = {
  a9: { label: 'Art 9 — liberty and security', nonDerogable: false },
  a12: { label: 'Art 12 — freedom of movement', nonDerogable: false },
  a7: { label: 'Art 7 — prohibition on torture', nonDerogable: true },
  a6: { label: 'Art 6 — right to life', nonDerogable: true },
  a11: { label: 'Art 11 — no imprisonment for breach of contract', nonDerogable: true },
};

type Row = { id: string; text: string; pass: boolean; why: string };

function rows(s: S): Row[] {
  const r = RIGHT[s.right];
  if (!s.emergency)
    return [
      { id: 'mode', text: 'No public emergency: art 4 is not available — use the limitation test', pass: true, why: '' },
      { id: 'abs', text: 'The right can be limited at all', pass: s.right !== 'a7', why: 'Art 7 is non-derogable and the prohibition of torture is considered jus cogens: no restriction can be justified.' },
      { id: 'law', text: 'Provided by law, for a legitimate aim in the limitation clause', pass: s.lawAndAim, why: 'Not a valid limitation: a restriction must be provided by law and serve a legitimate aim described in the limitation clause.' },
      { id: 'nec', text: 'Necessary in a democratic society — public need, proportionate', pass: s.measure === 'strict', why: 'Not a valid limitation: the measure goes beyond what a public need requires, so it is not proportionate or necessary in a democratic society.' },
    ];
  return [
    { id: 'emg', text: 'Public emergency threatening the life of the nation', pass: true, why: '' },
    { id: 'proc', text: 'Officially proclaimed', pass: s.proclaimed, why: 'Not a valid derogation: art 4(1) requires the emergency’s existence to be officially proclaimed.' },
    { id: 'nd', text: 'Not a right listed in art 4(2)', pass: !r.nonDerogable, why: `Not a valid derogation: ${r.label.split(' — ')[0]} is listed in art 4(2) — no derogation, however grave the emergency.${s.right === 'a7' ? ' The prohibition of torture is also considered jus cogens.' : ''}` },
    { id: 'nec', text: 'Strictly required — nature, duration, impact', pass: s.measure === 'strict', why: 'Not a valid derogation: the measure goes beyond what the exigencies strictly require — as fourteen days without a judge, with no detailed reasons, did in Aksoy v Turkey (para 78).' },
    { id: 'cons', text: 'Consistent with other international obligations, especially jus cogens', pass: s.consistent, why: 'Not a valid derogation: art 4(1) measures must not be inconsistent with the state’s other obligations under international law.' },
    { id: 'disc', text: 'No discrimination solely on race, colour, sex, language, religion or social origin', pass: !s.discriminates, why: 'Not a valid derogation: art 4(1) forbids measures involving discrimination solely on those grounds.' },
    { id: 'note', text: 'Notified', pass: s.notified, why: 'Not a valid derogation yet: notification is one of the four substantive requirements.' },
  ];
}

function view(s: S): SimView {
  const rs = rows(s);
  const stop = rs.findIndex((r) => !r.pass);
  const figure = (
    <div className="xgates" role="group" aria-label={`${s.emergency ? 'Derogation' : 'Limitation'} checklist${stop >= 0 ? `, stops at: ${rs[stop].text}` : ', every condition met'}`}>
      <p className="xgates__circ-title">{s.emergency ? 'ICCPR art 4 — tested in order' : 'Outside an emergency — the limitation test'}</p>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--s-2)' }}>
        {rs.map((r, i) => {
          const state = stop < 0 || i < stop ? 'pass' : i === stop ? 'stop' : 'idle';
          return (
            <li key={r.id} data-state={state} style={{ display: 'grid', gridTemplateColumns: '7.5rem minmax(0, 1fr)', gap: 'var(--s-3)', alignItems: 'baseline', padding: 'var(--s-2) var(--s-3)', background: 'var(--paper)', borderRadius: 'var(--r-sm)', borderLeft: `3px solid ${state === 'pass' ? 'var(--sage)' : state === 'stop' ? 'var(--clay)' : 'var(--line)'}`, transition: 'border-color 180ms var(--ease-out)' }}>
              <span className="mono" style={{ fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>{state === 'pass' ? 'passed' : state === 'stop' ? 'stops here' : 'not reached'}</span>
              <span style={{ fontSize: 'var(--t-sm)', color: state === 'idle' ? 'var(--ink-2)' : 'var(--ink)' }}>{r.text}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
  const verdict = stop >= 0
    ? rs[stop].why
    : s.emergency
      ? `Valid derogation from ${RIGHT[s.right].label.split(' — ')[0]}: a proclaimed emergency, a derogable right, a strictly required, consistent, non-discriminatory and notified measure.`
      : 'Valid limitation: provided by law, for a legitimate aim, and necessary in a democratic society.';
  return { figure, verdict, tone: stop >= 0 ? 'no' : 'yes' };
}

function describe(a: S, b: S) {
  if (a.emergency !== b.emergency) return b.emergency ? 'A public emergency threatening the life of the nation: art 4 derogation is in play.' : 'No emergency: art 4 is unavailable, so the restriction must pass the limitation test instead.';
  if (a.proclaimed !== b.proclaimed) return b.proclaimed ? 'The emergency is officially proclaimed.' : 'Not proclaimed: art 4(1) requires official proclamation.';
  if (a.right !== b.right) return `${RIGHT[b.right].label}: ${RIGHT[b.right].nonDerogable ? 'listed in art 4(2), so it cannot be derogated from.' : 'not in art 4(2), so it can be derogated from if every other condition holds.'}`;
  if (a.measure !== b.measure) return b.measure === 'strict' ? 'The measure is limited to what the situation strictly requires.' : 'The measure goes further than needed — think of Aksoy’s fourteen days without a judge.';
  if (a.consistent !== b.consistent) return b.consistent ? 'Consistent with the state’s other international obligations.' : 'Inconsistent with another obligation under international law.';
  if (a.discriminates !== b.discriminates) return b.discriminates ? 'The measure targets a group solely on a listed ground.' : 'No discrimination on the listed grounds.';
  if (a.notified !== b.notified) return b.notified ? 'The other states parties are notified.' : 'No notification given.';
  if (a.lawAndAim !== b.lawAndAim) return b.lawAndAim ? 'The restriction is provided by law and pursues a legitimate aim.' : 'No legal basis or legitimate aim — this matters for the limitation test.';
  return '';
}

export default function DerogationsAndLimitations() {
  return (
    <Simulation<S>
      label="Testing an emergency measure against ICCPR art 4, or a restriction against the limitation test"
      terms={[
        { term: 'Derogation', def: 'Suspending Covenant obligations in a public emergency threatening the life of the nation (art 4).' },
        { term: 'Non-derogable', def: 'A right art 4(2) protects from any derogation: arts 6, 7, 8(1)–(2), 11, 15, 16 and 18.' },
        { term: 'Strictly required', def: 'Necessity and proportionality, judged by the measure’s nature, duration and impact.' },
        { term: 'Limitation', def: 'A restriction outside an emergency: provided by law, a legitimate aim, necessary in a democratic society.' },
      ]}
      initial={initial}
      controls={[
        { key: 'emergency', label: 'A public emergency threatens the life of the nation', type: 'toggle' },
        { key: 'proclaimed', label: 'Its existence is officially proclaimed', type: 'toggle' },
        { key: 'right', label: 'Right restricted', type: 'select', options: (Object.keys(RIGHT) as S['right'][]).map((k) => ({ value: k, label: RIGHT[k].label })) },
        { key: 'measure', label: 'How far the measure goes', type: 'select', options: [{ value: 'strict', label: 'Only as far as strictly required' }, { value: 'excessive', label: 'Further — e.g. 14 days without a judge, no reasons' }] },
        { key: 'consistent', label: 'Consistent with other international obligations (incl. jus cogens)', type: 'toggle' },
        { key: 'discriminates', label: 'Targets people solely by race, colour, sex, language, religion or social origin', type: 'toggle' },
        { key: 'notified', label: 'Other states parties notified', type: 'toggle' },
        { key: 'lawAndAim', label: 'No emergency: provided by law, for a legitimate aim', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Which emergency measure can never be a valid derogation under the ICCPR, however grave the emergency?',
        options: [
          { text: 'Restricting movement between provinces for three weeks', why: 'Freedom of movement (art 12) is not in art 4(2); a strictly required, notified, non-discriminatory restriction can be valid.' },
          { text: 'Permitting interrogators to torture terrorism suspects', correct: true, why: 'Art 7 is listed in art 4(2), so no derogation is ever possible — and the prohibition of torture is considered jus cogens.' },
          { text: 'Detaining suspects for a short period before judicial review', why: 'Liberty (art 9) is derogable; the question is whether the period is strictly required — Aksoy shows fourteen days went too far.' },
        ],
      }}
    />
  );
}
