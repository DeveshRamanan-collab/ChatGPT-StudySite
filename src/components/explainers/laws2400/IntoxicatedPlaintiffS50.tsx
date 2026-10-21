/*
SCENE: Intoxication — CLA s 50 as a sequence of gates
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → change the facts → watch the path run down the s 50 gates → one check
INTENT: Show that s 50 is a sequence: trigger (s 50(1)), exception (s 50(5)), the no-damages gate (s 50(2)), the
  presumption and its rebuttal (s 50(3)), then the 25%-or-more reduction (s 50(4)).
SUBJECT: the path down the left spine; it stops at the first gate that sends the case out to the right.
BEAT 1 (0–100%): toggles set the court's findings; passed gates turn sage, the stopping gate clay, later gates go
  dashed; the verdict names the subsection that decides it within 200ms. Colour transitions 180ms ease-out only.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (colour changes only).
BUDGET: < 8 KB gz, no WebGL.
Source: CLA s 50 (act-2002-022.pdf, quoted in src/content/authorities/civil-liability-act-2002-nsw-s50.md);
  concept laws2400-w12-intoxicated-plaintiff-cla-s50. The simulation does not decide the findings: impaired
  capacity, likelihood and contribution are the court's findings, recorded as toggles.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  impaired: boolean;
  selfInduced: boolean;
  likely: boolean;
  noContribution: boolean;
  pct: '25' | 'more';
}

const initial: S = { impaired: true, selfInduced: true, likely: true, noContribution: false, pct: '25' };

type Stop = 'g1' | 'g2' | 'g3' | 'g4' | 'end';

interface Gate { id: Exclude<Stop, 'end'>; sec: string; q: string[]; out: string; exitOn: 'yes' | 'no' }

const GATES: Gate[] = [
  { id: 'g1', sec: 's 50(1)', q: ['Intoxicated so that capacity', 'for care and skill impaired?'], out: 's 50 not triggered', exitOn: 'no' },
  { id: 'g2', sec: 's 50(5)', q: ['Intoxication', 'self-induced?'], out: 's 50 does not apply', exitOn: 'no' },
  { id: 'g3', sec: 's 50(2)', q: ['Harm likely even', 'if not intoxicated?'], out: 'no damages', exitOn: 'no' },
  { id: 'g4', sec: 's 50(3)', q: ['Satisfied it did not', 'contribute in any way?'], out: 'no presumption', exitOn: 'yes' },
];

function stopAt(s: S): Stop {
  if (!s.impaired) return 'g1';
  if (!s.selfInduced) return 'g2';
  if (!s.likely) return 'g3';
  if (s.noContribution) return 'g4';
  return 'end';
}

const ORDER: Stop[] = ['g1', 'g2', 'g3', 'g4', 'end'];
const ui = { fontFamily: 'var(--font-ui)' } as const;

function view(s: S): SimView {
  const stop = stopAt(s);
  const at = ORDER.indexOf(stop);
  const figure = (
    <svg viewBox="0 0 360 404" role="img" style={{ maxWidth: 440, margin: '0 auto' }}
      aria-label={`Section 50 as four gates and an end box; the case ${stop === 'end' ? 'reaches the presumption and the 25% floor' : `leaves at ${GATES[at].sec}: ${GATES[at].out}`}.`}>
      {GATES.map((g, i) => {
        const y = 8 + i * 82;
        const state = i < at ? 'pass' : i === at ? 'stop' : 'idle';
        const stroke = state === 'pass' ? 'var(--sage)' : state === 'stop' ? 'var(--clay)' : 'var(--ink-3)';
        return (
          <g key={g.id} data-gate={g.id} data-state={state}>
            <rect x="8" y={y} width="206" height="62" rx="10" fill="var(--paper)" stroke={stroke} strokeWidth={state === 'stop' ? 2.5 : 1.5}
              strokeDasharray={state === 'idle' ? '4 3' : undefined} style={{ transition: 'stroke 180ms var(--ease-out)' }} />
            <text x="20" y={y + 20} {...ui} fontSize="11" letterSpacing="1" fill="var(--ink-2)">{g.sec.toUpperCase()}</text>
            {g.q.map((l, k) => <text key={k} x="20" y={y + 38 + k * 16} {...ui} fontSize="12.5" fill="var(--ink)">{l}</text>)}
            <line x1="214" y1={y + 31} x2="232" y2={y + 31} stroke={state === 'stop' ? 'var(--clay)' : 'var(--ink-3)'} strokeWidth="1.5" />
            <text x="238" y={y + 27} {...ui} fontSize="11" fill="var(--ink-2)">{g.exitOn}</text>
            <text x="238" y={y + 43} {...ui} fontSize="12.5" fontWeight={state === 'stop' ? 600 : 400} fill={state === 'stop' ? 'var(--ink)' : 'var(--ink-2)'}>{g.out}</text>
            <line x1="40" y1={y + 62} x2="40" y2={y + 82} stroke={i < at ? 'var(--sage)' : 'var(--line)'} strokeWidth="3" />
            <text x="48" y={y + 76} {...ui} fontSize="11" fill="var(--ink-2)">{g.exitOn === 'yes' ? 'no' : 'yes'}</text>
          </g>
        );
      })}
      <g data-gate="end" data-state={stop === 'end' ? 'stop' : 'idle'}>
        <rect x="8" y="336" width="344" height="60" rx="12" fill="var(--paper)" stroke={stop === 'end' ? 'var(--ink)' : 'var(--ink-3)'}
          strokeWidth={stop === 'end' ? 2.5 : 1.5} strokeDasharray={stop === 'end' ? undefined : '4 3'} />
        <text x="20" y="354" {...ui} fontSize="11" letterSpacing="1" fill="var(--ink-2)">S 50(3)–(4)</text>
        <text x="20" y="372" {...ui} fontSize="13" fill="var(--ink)">Presumed contributorily negligent:</text>
        <text x="20" y="389" {...ui} fontSize="13" fill="var(--ink)">reduce damages by {stop === 'end' && s.pct === 'more' ? 'more than 25%' : '25% or more'}</text>
      </g>
    </svg>
  );
  const verdict = {
    g1: 'Section 50 is not triggered (s 50(1)): capacity to exercise reasonable care and skill was not impaired by intoxication.',
    g2: 'Section 50 does not apply (s 50(5)): the court is satisfied the intoxication was not self-induced.',
    g3: 'No damages (s 50(2)): the court is not satisfied the harm was likely to have occurred even if the person had not been intoxicated.',
    g4: 'No presumption (s 50(3)): the court is satisfied the intoxication did not contribute in any way to the cause.',
    end: s.pct === 'more'
      ? 'Presumed contributorily negligent (s 50(3)); the court finds a percentage greater than 25% appropriate (s 50(4)).'
      : 'Presumed contributorily negligent (s 50(3)); damages reduced by at least 25% (s 50(4)).',
  }[stop];
  const tone = stop === 'g3' ? 'no' : stop === 'end' ? 'open' : 'yes';
  return { figure, verdict, tone };
}

function describe(a: S, b: S) {
  if (a.impaired !== b.impaired) return b.impaired ? 'Capacity impaired by intoxication: s 50(1) is triggered.' : 'Capacity not impaired: s 50 never starts, whatever else is true.';
  if (a.selfInduced !== b.selfInduced) return b.selfInduced ? 'Self-induced: the s 50(5) exception does not help.' : 'Not self-induced (say, a spiked drink): s 50(5) switches the whole section off.';
  if (a.likely !== b.likely) return b.likely ? 'Harm likely even if sober: past the s 50(2) gate, on to the presumption.' : 'Harm not likely without the intoxication: s 50(2) says no damages are to be awarded.';
  if (a.noContribution !== b.noContribution) return b.noContribution ? 'Court satisfied the intoxication did not contribute in any way: the presumption is displaced.' : 'Not shown that the intoxication made no contribution: the presumption stands.';
  if (a.pct !== b.pct) return b.pct === 'more' ? 'Section 50(4) lets the court go above 25% where appropriate in the circumstances.' : '25% is the floor under s 50(4), never the ceiling.';
  return '';
}

export default function IntoxicatedPlaintiffS50() {
  return (
    <Simulation<S>
      label="CLA s 50: four gates and the presumption of contributory negligence"
      terms={[
        { term: 'Intoxicated (s 50(1))', def: "So intoxicated that the person's capacity to exercise reasonable care and skill was impaired." },
        { term: 'Self-induced', def: 'Section 50 does not apply where the court is satisfied the intoxication was not self-induced (s 50(5)).' },
        { term: 'Presumption (s 50(3))', def: 'Contributory negligence is presumed unless the intoxication did not contribute in any way.' },
        { term: 'The floor (s 50(4))', def: 'A reduction of 25% or a greater percentage the court finds appropriate.' },
      ]}
      initial={initial}
      controls={[
        { key: 'impaired', label: 'Intoxicated so that capacity to exercise reasonable care and skill was impaired', type: 'toggle' },
        { key: 'selfInduced', label: 'The intoxication was self-induced', type: 'toggle' },
        { key: 'likely', label: 'Harm likely to have occurred even if not intoxicated', type: 'toggle' },
        { key: 'noContribution', label: 'Court satisfied the intoxication did not contribute in any way', type: 'toggle' },
        { key: 'pct', label: 'Reduction the court finds appropriate', type: 'select', options: [{ value: '25', label: '25% (the floor)' }, { value: 'more', label: 'A greater percentage' }] },
      ]}
      view={view}
      describe={describe}
      check={{
        question: "Leo's self-induced intoxication impaired his capacity; he would likely have tripped anyway; the court cannot say the intoxication made no contribution. Result?",
        options: [
          { text: 'No damages at all', why: 'Section 50(2) bars damages only where the harm was not likely anyway; here it was likely.' },
          { text: 'Presumed contributorily negligent; at least 25% off', correct: true, why: 'Past s 50(2), s 50(3) presumes contributory negligence and s 50(4) sets a reduction of 25% or more.' },
          { text: 'Full damages, since he would have tripped anyway', why: 'That finding is what opens the s 50(3) presumption; it does not cancel it.' },
        ],
      }}
    />
  );
}
