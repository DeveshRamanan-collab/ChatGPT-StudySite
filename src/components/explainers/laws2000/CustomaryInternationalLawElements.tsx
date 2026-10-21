/*
SCENE: Customary international law — state practice and opinio juris
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → set each element → watch both dials against their thresholds → one check
INTENT: Show that custom needs BOTH elements to clear their thresholds together: general practice (objective) and
  opinio juris (subjective); either alone lights nothing.
SUBJECT: the "custom established" lamp; it lights only when both needles sit past their threshold marks.
BEAT 1 (0–100%): selects move each needle (transform only, 240ms ease-in-out, full motion only); the dial that falls
  short turns its needle clay; the verdict names the case that decides it, within 200ms.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: calm/off — needles jump to their final positions; verdict identical.
BUDGET: < 8 KB gz, no WebGL.
Source: concept card laws2000-w02-customary-international-law-elements (Nicaragua v USA; North Sea Continental Shelf;
  Asylum Case). Needle positions are a teaching scale, not a legal measure.
*/
import { Simulation, type SimView } from '../bases/Simulation';
import { useExplainer } from '../context';

interface S extends Record<string, unknown> {
  practice: 'uniform' | 'general' | 'fluctuating';
  departures: 'breaches' | 'new-rule';
  specially: boolean;
  opinio: 'obligation' | 'courtesy';
}

const initial: S = { practice: 'general', departures: 'breaches', specially: true, opinio: 'courtesy' };

function practiceOk(s: S) {
  if (s.practice === 'fluctuating') return false;
  if (!s.specially) return false;
  if (s.practice === 'general' && s.departures === 'new-rule') return false;
  return true;
}

function Dial({ x, value, ok, label }: { x: number; value: number; ok: boolean; label: string }) {
  const { motion } = useExplainer();
  const tr = motion === 'full' ? 'transform 240ms var(--ease-inout)' : 'none';
  const deg = -90 + value * 180;
  const t = (0.6 * Math.PI);
  const tx = x - 90 * Math.cos(t), ty = 130 - 90 * Math.sin(t);
  const tx2 = x - 104 * Math.cos(t), ty2 = 130 - 104 * Math.sin(t);
  return (
    <g>
      <path d={`M ${x - 90} 130 A 90 90 0 0 1 ${x + 90} 130`} fill="none" stroke="var(--paper-3)" strokeWidth="14" />
      <line x1={tx} y1={ty} x2={tx2} y2={ty2} stroke="var(--ink)" strokeWidth="3" />
      <g style={{ transform: `rotate(${deg}deg)`, transformOrigin: `${x}px 130px`, transition: tr }}>
        <line x1={x} y1="130" x2={x} y2="54" stroke={ok ? 'var(--sage)' : 'var(--clay)'} strokeWidth="4" strokeLinecap="round" />
      </g>
      <circle cx={x} cy="130" r="6" fill="var(--ink)" />
      <text x={x} y="166" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="20" fill="var(--ink)">{label}</text>
    </g>
  );
}

function view(s: S): SimView {
  const pOk = practiceOk(s);
  const oOk = s.opinio === 'obligation';
  const pv = s.practice === 'fluctuating' ? 0.2 : !s.specially || (s.practice === 'general' && s.departures === 'new-rule') ? 0.45 : s.practice === 'general' ? 0.72 : 0.9;
  const ov = oOk ? 0.85 : 0.25;
  const both = pOk && oOk;
  const figure = (
    <svg viewBox="0 0 520 250" role="img" aria-label={`Practice ${pOk ? 'clears' : 'falls short of'} its threshold; opinio juris ${oOk ? 'clears' : 'falls short of'} its threshold; custom ${both ? 'established' : 'not established'}`}>
      <Dial x={130} value={pv} ok={pOk} label="state practice" />
      <Dial x={390} value={ov} ok={oOk} label="opinio juris" />
      <circle cx="260" cy="214" r="14" fill={both ? 'var(--sage)' : 'var(--paper-3)'} stroke="var(--ink-3)" strokeWidth="1.5" style={{ transition: 'fill 180ms var(--ease-out)' }} />
      <text x="284" y="221" fontFamily="var(--font-ui)" fontSize="18" fill={both ? 'var(--ink)' : 'var(--ink-3)'}>custom established</text>
      <text x="120" y="221" textAnchor="end" fontFamily="var(--font-ui)" fontSize="14" fill="var(--ink-2)">tick = threshold</text>
    </svg>
  );
  let verdict: string;
  if (both) verdict = 'Custom established: a general practice, accepted as law. Both elements clear their thresholds together.';
  else if (s.practice === 'fluctuating') verdict = 'No custom (Asylum Case): “uncertainty and contradiction … fluctuation and discrepancy” — no constant and uniform usage.';
  else if (!s.specially) verdict = 'No custom (North Sea): practice must include that of states whose interests are specially affected.';
  else if (s.practice === 'general' && s.departures === 'new-rule') verdict = 'Practice falls short (Nicaragua): departures must be treated as breaches, not as a new rule.';
  else verdict = 'No custom: the practice is there, but done as “ceremonial and protocol” courtesy, not felt as a legal obligation (North Sea).';
  return { figure, verdict, tone: both ? 'yes' : 'no' };
}

function describe(a: S, b: S) {
  if (a.practice !== b.practice) return b.practice === 'uniform' ? 'Extensive and virtually uniform practice: enough even over a short period (North Sea).' : b.practice === 'general' ? 'Consistent “in general”, not in absolutely rigorous conformity: enough if departures are treated as breaches (Nicaragua).' : 'Fluctuating, contradictory practice: the Asylum Case failure.';
  if (a.departures !== b.departures) return b.departures === 'breaches' ? 'Departures treated as breaches — even defending conduct by an exception within the rule confirms it.' : 'Departures treated as a new rule: the practice no longer supports the old one.';
  if (a.specially !== b.specially) return b.specially ? 'Specially affected states now take part in the practice.' : 'Specially affected states stay out: North Sea requires their practice too.';
  if (a.opinio !== b.opinio) return b.opinio === 'obligation' ? 'States now act from a belief of legal obligation: opinio juris sive necessitatis.' : 'States act from courtesy, convenience or tradition: no opinio juris, however widespread the practice.';
  return '';
}

export default function CustomaryInternationalLawElements() {
  return (
    <Simulation<S>
      label="Two dials, state practice and opinio juris, which must both clear a threshold for custom"
      terms={[
        { term: 'State practice', def: 'The objective element: consistent, general repetition of conduct by states over time.' },
        { term: 'Opinio juris', def: 'The subjective element: a belief the conduct is legally required, not mere courtesy.' },
        { term: 'Specially affected states', def: 'States whose interests the rule most touches; North Sea requires their practice.' },
      ]}
      initial={initial}
      controls={[
        { key: 'practice', label: 'State practice', type: 'select', options: [{ value: 'uniform', label: 'Extensive and virtually uniform' }, { value: 'general', label: 'Consistent in general, some departures' }, { value: 'fluctuating', label: 'Fluctuating and contradictory' }] },
        { key: 'departures', label: 'Departures from the practice are', type: 'select', options: [{ value: 'breaches', label: 'Treated as breaches of the rule' }, { value: 'new-rule', label: 'Treated as a new rule' }] },
        { key: 'specially', label: 'Specially affected states take part in the practice', type: 'toggle' },
        { key: 'opinio', label: 'Why states follow the practice', type: 'select', options: [{ value: 'obligation', label: 'Belief of legal obligation' }, { value: 'courtesy', label: 'Courtesy, convenience or tradition' }] },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'States have long fired a gun salute for visiting heads of state, uniformly, out of courtesy. Is it custom?',
        options: [
          { text: 'Yes — the practice is extensive and virtually uniform', why: 'Practice alone is not enough; the second element, opinio juris, is missing.' },
          { text: 'No — there is no belief of legal obligation', correct: true, why: 'Conduct followed as “ceremonial and protocol” courtesy lacks opinio juris, so no custom arises however uniform it is.' },
          { text: 'No — practice must be in absolutely rigorous conformity', why: 'Nicaragua says the opposite: practice need only be consistent “in general”.' },
        ],
      }}
    />
  );
}
