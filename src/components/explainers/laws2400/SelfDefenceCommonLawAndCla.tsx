/*
SCENE: Self-defence — the common law test and CLA s 52
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → change the facts → watch two parallel tracks of gates → one check
INTENT: Show that the common law (Zecevic: reasonable apprehension + proportionate force) and s 52 CLA (belief in
  necessity + reasonable response as perceived, gated by the unlawfulness of the conduct responded to) run in
  parallel and move together but not identically.
SUBJECT: the two tracks; the eye follows the one whose result differs from the other.
BEAT 1 (0–100%): toggles and a select for the facts; each track's gates light sage (met) or clay (first failure);
  the verdict names which regimes protect the defendant, within 200ms. Ease: CSS 180ms ease-out on colour only.
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (colour only).
BUDGET: < 6 KB gz, no WebGL.
Source: concept card laws2400-w04-self-defence-common-law-and-cla; cases zecevic-v-dpp, fontin-v-katapodis,
  nsw-v-mcmaster; authority civil-liability-act-2002-nsw-s52 (text of s 52(1)–(3)).
The simulation does not decide reasonableness or proportionality: those are findings the learner records.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  apprehension: boolean;
  proportionate: boolean;
  belief: boolean;
  reasonable: boolean;
  responded: 'unlawful' | 'impairment' | 'lawful';
  lethalProperty: boolean;
}

const initial: S = { apprehension: true, proportionate: true, belief: true, reasonable: true, responded: 'unlawful', lethalProperty: false };

type Gate = { k: string; label: string; pass: boolean };

const commonLaw = (s: S): Gate[] => [
  { k: 'cl1', label: 'Reasonable apprehension of physical force to D or others', pass: s.apprehension },
  { k: 'cl2', label: 'Force proportionate to the threat', pass: s.proportionate },
];

const statute = (s: S): Gate[] => [
  { k: 's1', label: 's 52(1): conduct responded to was unlawful (or would be, but for impairment)', pass: s.responded !== 'lawful' },
  { k: 's2a', label: 's 52(2): D believed the conduct necessary', pass: s.belief },
  { k: 's2b', label: 's 52(2): reasonable response in the circumstances as D perceived them', pass: s.reasonable },
  { k: 's3', label: 's 52(3): not death inflicted only to protect property or stop trespass', pass: !s.lethalProperty },
];

function track(title: string, gs: Gate[]) {
  const stop = gs.findIndex((g) => !g.pass);
  const ok = stop === -1;
  return (
    <div style={{ padding: 'var(--s-4)', background: 'var(--paper)', borderRadius: 'var(--r-md)', borderLeft: `3px solid ${ok ? 'var(--sage)' : 'var(--clay)'}`, transition: 'border-color 180ms var(--ease-out)' }}>
      <p className="label" style={{ margin: '0 0 var(--s-2)' }}>{title}</p>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--s-2)' }}>
        {gs.map((g, i) => {
          const state = stop === -1 || i < stop ? 'pass' : i === stop ? 'stop' : 'idle';
          return (
            <li key={g.k} data-state={state} style={{ display: 'grid', gridTemplateColumns: '1.25rem 1fr', gap: 'var(--s-2)', fontSize: 'var(--t-sm)', lineHeight: 1.35, color: state === 'idle' ? 'var(--ink-3)' : 'var(--ink)' }}>
              <span aria-hidden="true" style={{ color: state === 'pass' ? 'var(--sage)' : state === 'stop' ? 'var(--clay)' : 'var(--ink-3)', transition: 'color 180ms var(--ease-out)' }}>
                {state === 'pass' ? '●' : state === 'stop' ? '✕' : '○'}
              </span>
              <span>{g.label}</span>
            </li>
          );
        })}
      </ol>
      <p style={{ margin: 'var(--s-3) 0 0', fontWeight: 600, color: 'var(--ink)' }}>{ok ? 'Defence made out' : 'Defence fails'}</p>
    </div>
  );
}

function view(s: S): SimView {
  const cl = commonLaw(s).every((g) => g.pass);
  const st = statute(s).every((g) => g.pass);
  const figure = (
    <div className="xgates" role="group" aria-label="The common law test and the s 52 test side by side">
      <div style={{ display: 'grid', gap: 'var(--s-4)', gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))' }}>
        {track('Common law (Zecevic)', commonLaw(s))}
        {track('CLA s 52', statute(s))}
      </div>
      <p style={{ margin: 'var(--s-3) 0 0', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>The two regimes run in parallel (ss 3A(1), 3B(1)(a)(iii)).</p>
    </div>
  );
  const verdict = cl && st
    ? 'Both tests are met: self-defence at common law and under s 52 (cf McMaster, both statutory limbs satisfied).'
    : cl
      ? `Common law defence only: s 52 fails on ${!(s.responded !== 'lawful') ? 'its extra “unlawful conduct” requirement' : !s.belief ? 'belief in necessity' : !s.reasonable ? 'reasonable response' : 's 52(3)'}.`
      : st
        ? `Section 52 only: the common law fails on ${!s.apprehension ? 'reasonable apprehension' : 'proportionality'}.`
        : 'Neither test is met: no self-defence.';
  return { figure, verdict, tone: cl || st ? (cl && st ? 'yes' : 'open') : 'no' };
}

function describe(a: S, b: S) {
  if (a.apprehension !== b.apprehension) return b.apprehension ? 'A reasonable apprehension of physical force: common law limb 1 is met.' : 'No reasonable apprehension of force: the common law test fails at limb 1.';
  if (a.proportionate !== b.proportionate) return b.proportionate ? 'Force proportionate to the threat: common law limb 2 is met.' : 'Out of proportion — like throwing glass at a face in response to a T-square blow (Fontin v Katapodis).';
  if (a.belief !== b.belief) return b.belief ? 'D believed the conduct necessary for a listed purpose: the subjective s 52(2) limb is met.' : 'No belief that the conduct was necessary: s 52(2) is not satisfied.';
  if (a.reasonable !== b.reasonable) return b.reasonable ? 'A reasonable response in the circumstances as D perceived them: the objective s 52(2) limb is met.' : 'Not a reasonable response as D perceived the circumstances: s 52(2) fails.';
  if (a.responded !== b.responded) return b.responded === 'lawful' ? 'Responding to lawful conduct: s 52(1) is not engaged — a requirement the common law lacks.' : b.responded === 'impairment' ? 'Would have been unlawful but for a mental health or cognitive impairment: s 52(1)(b) is satisfied.' : 'Responding to unlawful conduct: s 52(1)(a) is satisfied.';
  if (a.lethalProperty !== b.lethalProperty) return b.lethalProperty ? 'Death intentionally or recklessly inflicted only to protect property or stop criminal trespass: s 52(3) excludes the section.' : 'No lethal force used only for property or trespass: s 52(3) does not bite.';
  return '';
}

export default function SelfDefenceCommonLawAndCla() {
  return (
    <Simulation<S>
      label="Self-defence at common law and under section 52 of the Civil Liability Act"
      terms={[
        { term: 'Reasonable apprehension', def: 'Zecevic limb 1: a reasonable apprehension of physical force to the defendant or others.' },
        { term: 'Proportionality', def: 'Zecevic limb 2, assessed strictly: the force must be proportionate to the threat.' },
        { term: 'Reasonable response as perceived', def: 's 52(2): judged in the circumstances as the defendant perceived them.' },
        { term: 'Unlawful conduct', def: 's 52(1): the conduct responded to must itself be unlawful — the statute’s extra gate.' },
      ]}
      initial={initial}
      controls={[
        { key: 'apprehension', label: 'D reasonably apprehended physical force to self or others', type: 'toggle' },
        { key: 'proportionate', label: 'Force used was proportionate to the threat', type: 'toggle' },
        { key: 'belief', label: 'D believed the conduct necessary (eg to defend self or another)', type: 'toggle' },
        { key: 'reasonable', label: 'Reasonable response in the circumstances as D perceived them', type: 'toggle' },
        { key: 'responded', label: 'The conduct D responded to', type: 'select', options: [{ value: 'unlawful', label: 'Was unlawful' }, { value: 'impairment', label: 'Would be unlawful but for an impairment' }, { value: 'lawful', label: 'Was lawful' }] },
        { key: 'lethalProperty', label: 'D intentionally or recklessly inflicted death only to protect property or stop trespass', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Which requirement does s 52 CLA add that the common law self-defence test lacks?',
        options: [
          { text: 'That the force was proportionate to the threat', why: 'Proportionality is the common law’s second limb (Zecevic; Fontin v Katapodis), not the statute’s addition.' },
          { text: 'That the conduct responded to was itself unlawful', correct: true, why: 'Section 52(1) protects only a response to unlawful conduct (or conduct unlawful but for impairment); the common law has no such gate.' },
          { text: 'That the defendant believed the conduct necessary', why: 'Tempting, since belief is in s 52(2) — but the common law also looks to what D apprehended. The gate with no common law counterpart is unlawful conduct.' },
        ],
      }}
    />
  );
}
