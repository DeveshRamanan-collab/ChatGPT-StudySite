/*
SCENE: Why states comply without a world police
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → change the weights → watch the balance tip → one check
INTENT: Show that compliance rests on reputation, quasi-enforcement and a shared sense that the order is needed, so
  the balance still tips toward compliance with the domestic-style enforcement lever removed — and how realism reads it.
SUBJECT: the beam of the balance; the pan that sinks is the side that wins.
BEAT 1 (0–100%): toggles add or remove weights; the beam rotates (transform only, 240ms ease-in-out, full motion only);
  the weights list lights what is on each pan; the verdict updates within 200ms.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: calm/off — the beam jumps to its final angle; weights and verdict identical.
BUDGET: < 8 KB gz, no WebGL.
Source: concept card laws2000-w01-compliance-and-enforcement (Hoffman 1987; Chayes & Chayes 1995; UN Charter arts 5–6,
  IMF/World Bank leverage; realism). The weights are a teaching model of the card's argument, not measured values.
*/
import { Simulation, type SimView } from '../bases/Simulation';
import { useExplainer } from '../context';

interface S extends Record<string, unknown> {
  police: boolean;
  reputation: boolean;
  quasi: boolean;
  lens: 'mainstream' | 'realist';
  interest: boolean;
}

const initial: S = { police: false, reputation: true, quasi: true, lens: 'mainstream', interest: true };

interface Weight { k: string; w: number; on: boolean }

function pans(s: S): { comply: Weight[]; breach: Weight[] } {
  if (s.lens === 'realist') {
    return {
      comply: [{ k: 'Compliance serves the powerful state’s interest', w: 3, on: s.interest }],
      breach: [{ k: 'Breach serves the powerful state’s interest', w: 3, on: !s.interest }],
    };
  }
  return {
    comply: [
      { k: 'Consciousness that the order is needed (Hoffman)', w: 1, on: true },
      { k: 'Fear of loss of reputation (Chayes & Chayes)', w: 2, on: s.reputation },
      { k: 'Quasi-enforcement: UN arts 5–6, IMF and World Bank leverage', w: 2, on: s.quasi },
      { k: 'Domestic-style police and compulsory court', w: 1, on: s.police },
    ],
    breach: [{ k: 'A state’s interest in disregarding a commitment', w: 2, on: true }],
  };
}

const total = (ws: Weight[]) => ws.reduce((n, x) => n + (x.on ? x.w : 0), 0);

function Balance({ deg }: { deg: number }) {
  const { motion } = useExplainer();
  const r = (deg * Math.PI) / 180;
  const L = 160;
  const cx = 240, cy = 70;
  const left = { x: cx - L * Math.cos(r), y: cy - L * Math.sin(r) };
  const right = { x: cx + L * Math.cos(r), y: cy + L * Math.sin(r) };
  const tr = motion === 'full' ? 'transform 240ms var(--ease-inout)' : 'none';
  const pan = (p: { x: number; y: number }, label: string) => (
    <g style={{ transform: `translate(${p.x}px, ${p.y}px)`, transition: tr }}>
      <line x1="0" y1="0" x2="-34" y2="52" stroke="var(--ink-3)" strokeWidth="1.5" />
      <line x1="0" y1="0" x2="34" y2="52" stroke="var(--ink-3)" strokeWidth="1.5" />
      <path d="M -46 52 Q 0 78 46 52 Z" fill="var(--paper-3)" stroke="var(--ink-2)" strokeWidth="1.5" />
      <text x="0" y="104" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="20" fill="var(--ink)">{label}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 480 220" role="img" aria-label={deg < 0 ? 'The balance tips toward compliance' : deg > 0 ? 'The balance tips toward breach' : 'The balance is level'}>
      <path d="M 240 70 L 214 200 L 266 200 Z" fill="var(--paper-3)" stroke="var(--ink-3)" strokeWidth="1.5" />
      <g style={{ transform: `rotate(${deg}deg)`, transformOrigin: '240px 70px', transition: tr }}>
        <line x1="80" y1="70" x2="400" y2="70" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
      </g>
      <circle cx="240" cy="70" r="5" fill="var(--ink)" />
      {pan(left, 'comply')}
      {pan(right, 'breach')}
    </svg>
  );
}

function view(s: S): SimView {
  const p = pans(s);
  const a = total(p.comply), b = total(p.breach);
  const deg = Math.max(-14, Math.min(14, (b - a) * 5));
  const list = (title: string, ws: Weight[]) => (
    <div className="xgates__circ">
      <p className="xgates__circ-title">{title}</p>
      <ul>{ws.map((x) => <li key={x.k} data-on={x.on ? 'true' : undefined}>{x.on ? '● ' : '○ '}{x.k}</li>)}</ul>
    </div>
  );
  const figure = (
    <div className="xgates">
      <Balance deg={deg} />
      {list('On the comply pan:', p.comply)}
      {list('On the breach pan:', p.breach)}
    </div>
  );
  let verdict: string;
  let tone: SimView['tone'];
  if (s.lens === 'realist') {
    verdict = s.interest
      ? 'Realism: the powerful state complies — but only because it perceives compliance to be in its interest.'
      : 'Realism: power decides; a militarily powerful state that sees no interest in compliance will not obey.';
    tone = s.interest ? 'yes' : 'no';
  } else if (!s.reputation && !s.quasi) {
    verdict = 'Only the sense that the order is needed is left, and the pull to breach outweighs it: take away reputation and quasi-enforcement and the model tips.';
    tone = 'no';
  } else if (s.police) {
    verdict = 'Tips toward compliance — but the police weight is the smallest: enforcement is “irrelevant to the binding quality” of the system.';
    tone = 'yes';
  } else {
    verdict = 'Tips toward compliance with no world police: reputation and quasi-enforcement carry the weight.';
    tone = 'yes';
  }
  return { figure, verdict, tone };
}

function describe(a: S, b: S) {
  if (a.police !== b.police) return b.police ? 'A world police added: international law has none, and the balance barely moves.' : 'The domestic-style enforcement lever removed, as in reality: compliance still wins.';
  if (a.reputation !== b.reputation) return b.reputation ? 'Reputation back on: other states exclude a non-complier from future cooperation, trade and alliances.' : 'Reputation off: other states no longer weigh the state’s record when choosing partners.';
  if (a.quasi !== b.quasi) return b.quasi ? 'Quasi-enforcement on: UN membership (arts 5–6) and IMF or World Bank support depend on compliance.' : 'Quasi-enforcement off: no organisation’s membership or money is at stake.';
  if (a.lens !== b.lens) return b.lens === 'realist' ? 'Realist lens: only power and self-interest count; reputation and institutions drop off the pans.' : 'Mainstream lens: reputation, quasi-enforcement and a shared sense of need explain compliance.';
  if (a.interest !== b.interest) return b.lens === 'realist' ? (b.interest ? 'Compliance now suits the powerful state, so realism predicts it obeys.' : 'Compliance no longer suits the powerful state, so realism predicts it does not obey.') : 'This switch matters only under the realist lens.';
  return '';
}

export default function ComplianceAndEnforcement() {
  return (
    <Simulation<S>
      label="A balance weighing reasons to comply with international law against reasons to breach"
      terms={[
        { term: 'Enforcement', def: 'Police, courts and sanctions; international law has no world police and no compulsory court.' },
        { term: 'Reputation', def: 'Other states become reluctant to trade or ally with a state that disregards its commitments.' },
        { term: 'Quasi-enforcement', def: 'Membership and money conditional on compliance: UN Charter arts 5–6, the IMF, the World Bank.' },
        { term: 'Realism', def: 'The view that power decides: a powerful state obeys only when it suits its interest.' },
      ]}
      initial={initial}
      controls={[
        { key: 'lens', label: 'Theory', type: 'select', options: [{ value: 'mainstream', label: 'Reputation and quasi-enforcement' }, { value: 'realist', label: 'Realism' }] },
        { key: 'police', label: 'A domestic-style police and compulsory court exists', type: 'toggle' },
        { key: 'reputation', label: 'Reputation is at stake', type: 'toggle' },
        { key: 'quasi', label: 'Membership of international organisations is at stake', type: 'toggle' },
        { key: 'interest', label: 'Realism: compliance is in this powerful state’s interest', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'A state breaches a treaty and suffers no sanction. What is the best exam response?',
        options: [
          { text: 'It proves international law is not really law, because it cannot be enforced', why: 'The card warns against this: enforcement is “irrelevant to the binding quality” of international law.' },
          { text: 'Explain it against reputation, quasi-enforcement and self-interest', correct: true, why: 'Non-compliance is analysed against the real drivers of compliance — reputation, quasi-enforcement and, for realists, self-interest.' },
          { text: 'Say the ICJ will compel the state to comply', why: 'There is no compulsory court: a state must agree to a court’s jurisdiction before it can be brought before it.' },
        ],
      }}
    />
  );
}
