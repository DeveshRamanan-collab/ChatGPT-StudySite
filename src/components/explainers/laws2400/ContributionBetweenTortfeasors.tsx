/*
SCENE: Contribution between tortfeasors — who pays the plaintiff, and who carries the risk
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → choose whom Pat recovers from, whether the other tortfeasor can pay, the kind of claim → one check
INTENT: Show that where tortfeasors are jointly and severally liable the plaintiff may recover the whole amount from
  either; that contribution is a separate, statutory claim between the tortfeasors that never touches the plaintiff;
  and that the risk of the other tortfeasor's insolvency sits with the tortfeasor who paid, not the plaintiff —
  with a flag that proportionate liability may displace the whole-amount rule for property damage and economic loss.
SUBJECT: the "whole amount" line into Pat, which never shrinks whatever else changes.
BEAT 1 (0–100%): three parties in a row; the whole-amount line, the contribution line and the risk marker move with
  the controls; the verdict updates within 200ms. Colour and opacity only (--dur-micro, --ease-out).
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (duration tokens are 0 in off); no positional movement.
BUDGET: < 5 KB gz, no WebGL.
Source: concept laws2400-w10-contribution-between-tortfeasors; Tort Law Principles 3e p 433 [12.170] and nn 229–230;
  authority law-reform-miscellaneous-provisions-act-1946-nsw-s5 (text not in the materials; verify: true). The
  proportionate liability provisions are not in this week's sources, so the simulation only flags them.
*/
import type { CSSProperties } from 'react';
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  from: 'acme' | 'bolt';
  otherPays: boolean;
  claim: 'injury' | 'property';
}

const initial: S = { from: 'acme', otherPays: true, claim: 'injury' };
const NAME = { acme: 'Acme', bolt: 'Bolt' } as const;

const card = (on: boolean): CSSProperties => ({
  border: '2px solid', borderColor: on ? 'var(--ink)' : 'var(--line)', borderRadius: 'var(--r-md)', padding: 'var(--s-2) var(--s-3)',
  background: 'var(--paper)', minWidth: '7.5rem', flex: '1 1 7.5rem', display: 'grid', gap: '2px',
  transition: 'border-color var(--dur-micro) var(--ease-out)',
});
const tag: CSSProperties = { fontFamily: 'var(--font-ui)', fontSize: 'var(--t-xs)', letterSpacing: '0.08em', color: 'var(--ink-2)' };
const name: CSSProperties = { fontFamily: 'var(--font-ui)', fontSize: 'var(--t-body)', color: 'var(--ink)' };
const flow = (bar: string): CSSProperties => ({ margin: 0, fontSize: 'var(--t-sm)', lineHeight: 1.45, color: 'var(--ink)', borderLeft: `3px solid ${bar}`, paddingLeft: 'var(--s-3)', transition: 'border-color var(--dur-micro) var(--ease-out)' });

function view(s: S): SimView {
  const sued = NAME[s.from];
  const other = NAME[s.from === 'acme' ? 'bolt' : 'acme'];
  const property = s.claim === 'property';
  const figure = (
    <div style={{ display: 'grid', gap: 'var(--s-3)', fontFamily: 'var(--font-body)' }} role="group" aria-label="Plaintiff and two concurrent tortfeasors">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-3)' }}>
        <div style={card(true)} data-party="pat"><span style={tag}>PLAINTIFF</span><span style={name}>Pat</span><span style={tag}>recovers the whole amount</span></div>
        <div style={card(true)} data-party={s.from}><span style={tag}>TORTFEASOR · SUED</span><span style={name}>{sued}</span><span style={tag}>{s.otherPays ? 'pays in full' : 'pays in full · bears the risk'}</span></div>
        <div style={{ ...card(false), opacity: s.otherPays ? 1 : 0.6, transition: 'opacity var(--dur-micro) var(--ease-out), border-color var(--dur-micro) var(--ease-out)' }} data-party="other">
          <span style={tag}>TORTFEASOR · NOT SUED</span><span style={name}>{other}</span><span style={tag}>{s.otherPays ? 'can pay its share' : 'insolvent — cannot pay'}</span>
        </div>
      </div>
      <p style={flow('var(--ink)')} data-line="whole">Pat ← whole amount ← {sued}. Joint and several liability lets Pat choose one tortfeasor, eg the one with the “deeper pockets”.</p>
      <p style={flow(s.otherPays ? 'var(--ink-3)' : 'var(--ink)')} data-line="contribution">
        {sued} → seeks a contribution → {other}. {s.otherPays ? 'A statutory claim between the tortfeasors; it in no way affects Pat.' : `${other} cannot pay, so ${sued} carries that loss — not Pat.`}
      </p>
      {property && (
        <p style={{ ...flow('var(--ink-3)'), animation: 'fade-in var(--dur-ui) var(--ease-out) both' }} data-flag="proportionate">
          Check first: the textbook (n 229) qualifies the whole-amount rule where proportionate liability provisions apply to claims for property damage and economic loss. Those provisions are not in this week’s pages.
        </p>
      )}
      <p style={{ margin: 0, ...tag }}>NSW contribution: Law Reform (Miscellaneous Provisions) Act 1946 s 5(1)(c), 5(2) — cited by the textbook, n 230.</p>
    </div>
  );
  const verdict = property
    ? `Check proportionate liability first: for a property damage or economic loss claim, Pat may not be able to take the whole amount from ${sued}.`
    : s.otherPays
      ? `Pat recovers the whole amount from ${sued}; ${sued} may seek a contribution against ${other}. Pat is unaffected.`
      : `Pat still recovers the whole amount from ${sued}; ${other}'s insolvency is ${sued}'s risk, not Pat's.`;
  return { figure, verdict, tone: property ? 'open' : 'yes' };
}

function describe(a: S, b: S) {
  if (a.from !== b.from) return `Pat now recovers from ${NAME[b.from]}: the plaintiff's choice. The contribution claim simply runs the other way.`;
  if (a.otherPays !== b.otherPays) return b.otherPays ? 'The other tortfeasor can pay: contribution evens things out between the tortfeasors.' : 'The other tortfeasor is insolvent: Pat\'s recovery is unchanged; the tortfeasor who paid bears the loss.';
  if (a.claim !== b.claim) return b.claim === 'property' ? 'Property damage or economic loss: the textbook flags proportionate liability as a qualification (n 229).' : 'Personal injury: the footnoted proportionate liability qualification is not engaged.';
  return '';
}

export default function ContributionBetweenTortfeasors() {
  return (
    <Simulation<S>
      label="Contribution between tortfeasors: the plaintiff's recovery and the tortfeasors' risk"
      terms={[
        { term: 'Jointly and severally liable', def: 'Each tortfeasor can be made to pay the whole amount; the plaintiff may choose whom to recover from.' },
        { term: 'Contribution', def: 'A statutory mechanism by which a tortfeasor liable for the full amount seeks a contribution from another tortfeasor.' },
        { term: 'Concurrent tortfeasors', def: 'Joint or separate wrongdoers liable for the same damage.' },
      ]}
      initial={initial}
      controls={[
        { key: 'from', label: 'Pat recovers the whole amount from', type: 'select', options: [{ value: 'acme', label: 'Acme' }, { value: 'bolt', label: 'Bolt' }] },
        { key: 'otherPays', label: 'The other tortfeasor can pay its share', type: 'toggle' },
        { key: 'claim', label: 'Kind of claim', type: 'select', options: [{ value: 'injury', label: 'Personal injury' }, { value: 'property', label: 'Property damage or economic loss' }] },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Pat recovered in full from Acme. Bolt, the other concurrent tortfeasor, is insolvent. Who bears the loss of Bolt’s share?',
        options: [
          { text: 'Acme, the tortfeasor who paid', correct: true, why: 'The textbook puts the risk that one tortfeasor is insolvent on the other tortfeasors, not the plaintiff.' },
          { text: 'Pat, whose award is reduced by Bolt’s share', why: 'Contribution in no way affects the plaintiff; Pat keeps the whole amount recovered from Acme.' },
          { text: 'Pat and Acme, half each', why: 'Nothing in the textbook splits the risk with the plaintiff: it lies with the other tortfeasors alone.' },
        ],
      }}
    />
  );
}
