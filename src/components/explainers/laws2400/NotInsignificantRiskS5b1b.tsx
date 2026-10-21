/*
SCENE: Question 1(b) — a risk that is not insignificant, as the middle of three s 5B(1) gates, with the probability scale
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → place the risk on the scale and weigh the Donald factors → watch where the path stops → one check
INTENT: Show that s 5B(1)(b) is a separate gate joined by "and" to (a) and (c), and that the Act set it deliberately
  higher than the common law: a risk that is merely not far-fetched or fanciful passes (a) (Wyong) but may still be
  insignificant; "not insignificant" sits above "not far-fetched" and below "substantial" (Ipp Report), and its
  significance is weighed by obviousness, likelihood and seriousness (Rail Corporation NSW v Donald).
SUBJECT: the risk marker on the scale, and the path line through the three gates; it stops at the first gate that fails.
BEAT 1 (0–100%): the risk select moves the marker along the scale (transform only, 240ms ease-in-out); toggles re-light
  the gates (border colour only, 180ms ease-out via the shared .xgate styles); the verdict names the deciding gate
  within 200ms.
CAMERA: none (HTML + SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical end states; the marker jumps rather than slides (bases handle calm/off via tokens).
BUDGET: < 5 KB gz, no WebGL.
Source: concept laws2400-w09-not-insignificant-risk-s5b-1b; CLA (NSW) s 5B(1); Topic 9 Lecture 1 slides 7–8, 17, 20–22
  (Wyong: a risk not far-fetched or fanciful is real and therefore foreseeable; the CLA modified the probability of harm
  to "not insignificant"; Ipp Report; Donald factors). Fixed Oct 2026: the earlier version, built from the textbook
  flowchart alone, treated "a real risk, not far-fetched" as arguably meeting (b); the slides place (b) above that.
*/
import { Simulation, type SimView } from '../bases/Simulation';

type Risk = 'fanciful' | 'remote' | 'notinsig' | 'substantial';

interface S extends Record<string, unknown> {
  risk: Risk;
  weighty: boolean;
  knowledge: boolean;
  precautions: boolean;
}

const initial: S = { risk: 'remote', weighty: false, knowledge: true, precautions: true };

// Marker positions on a 320-unit scale; thresholds at 80 (Wyong), 160 (the Act), 240 (substantial).
const X: Record<Risk, number> = { fanciful: 40, remote: 120, notinsig: 200, substantial: 280 };

type BState = 'met' | 'weighed' | 'fails' | 'stop';
function bState(s: S): BState {
  if (s.risk === 'fanciful') return 'stop';
  if (s.risk === 'notinsig' || s.risk === 'substantial') return 'met';
  return s.weighty ? 'weighed' : 'fails';
}

function Scale({ s }: { s: S }) {
  const t = { fontFamily: 'var(--font-ui)', fontSize: 10.5 } as const;
  return (
    <svg viewBox="0 0 320 96" role="img" style={{ width: '100%', maxWidth: 520, display: 'block', margin: '0 auto var(--s-4)' }}
      aria-label={`Probability scale: the risk sits ${s.risk === 'fanciful' ? 'below the common law threshold' : s.risk === 'remote' ? 'above not far-fetched but below not insignificant' : s.risk === 'notinsig' ? 'above the not insignificant threshold' : 'at a substantial risk'}`}>
      <line x1="8" y1="48" x2="312" y2="48" stroke="var(--ink-2)" strokeWidth="1.5" />
      {[80, 160, 240].map((x) => <line key={x} x1={x} y1="38" x2={x} y2="58" stroke="var(--ink)" strokeWidth={x === 160 ? 2.5 : 1.5} />)}
      <text x="80" y="74" textAnchor="middle" {...t} fill="var(--ink-2)">not far-fetched</text>
      <text x="80" y="87" textAnchor="middle" {...t} fill="var(--ink-3)">(Wyong, common law)</text>
      <text x="160" y="74" textAnchor="middle" {...t} fill="var(--ink)">not insignificant</text>
      <text x="160" y="87" textAnchor="middle" {...t} fill="var(--ink-3)">(the Act, s 5B(1)(b))</text>
      <text x="240" y="74" textAnchor="middle" {...t} fill="var(--ink-2)">substantial</text>
      <text x="8" y="30" {...t} fill="var(--ink-3)">less probable</text>
      <text x="312" y="30" textAnchor="end" {...t} fill="var(--ink-3)">more probable</text>
      <g data-marker style={{ transform: `translateX(${X[s.risk]}px)`, transition: 'transform var(--dur-ui) var(--ease-inout)' }}>
        <circle cx="0" cy="48" r="6" fill="var(--ink)" />
        <text x="0" y="22" textAnchor="middle" {...t} fill="var(--ink)">the risk</text>
      </g>
    </svg>
  );
}

interface Gate { id: 'a' | 'b' | 'c'; label: string; sub: string; ok: boolean; okText: string; noText: string }

function gates(s: S): Gate[] {
  const b = bState(s);
  return [
    { id: 'a', label: 's 5B(1)(a)', sub: 'foreseeable: knew or ought to have known; not far-fetched (Wyong)', ok: s.knowledge && s.risk !== 'fanciful', okText: 'met', noText: 'stops here' },
    { id: 'b', label: 's 5B(1)(b)', sub: 'not insignificant: above not far-fetched (Ipp Report)', ok: b === 'met' || b === 'weighed', okText: b === 'weighed' ? 'arguably met' : 'met', noText: 'likely fails' },
    { id: 'c', label: 's 5B(1)(c)', sub: 'a reasonable person would have taken the precautions', ok: s.precautions, okText: 'met', noText: 'stops here' },
  ];
}

function view(s: S): SimView {
  const gs = gates(s);
  const stop = gs.find((g) => !g.ok);
  let reached = true;
  const figure = (
    <div role="group" aria-label="A probability scale above three gates joined by and: section 5B(1)(a), (b) and (c)">
      <Scale s={s} />
      <div className="xgates">
        <ol className="xgates__row">
          {gs.map((g) => {
            const lit = reached;
            const blocked = !g.ok && reached;
            if (blocked) reached = false;
            const state = blocked ? 'stop' : lit ? 'pass' : 'idle';
            return (
              <li key={g.id} className="xgate" data-gate={g.id} data-state={state} data-lit={lit ? 'true' : undefined}>
                <span className="xgate__box">
                  <span className="xgate__label mono">{g.label}</span>
                  <span className="xgate__status">{blocked ? g.noText : lit ? g.okText : '—'}</span>
                </span>
                <span className="xgate__sub">{g.sub}</span>
              </li>
            );
          })}
        </ol>
        <p className="xgates__end" data-state={stop ? 'stop' : 'pass'}>{stop ? 'not negligent' : 'breach'}</p>
        <div className="xgates__circ">
          <p className="xgates__circ-title">Rail Corporation NSW v Donald: significance depends on factors such as —</p>
          <ul>
            <li data-on={s.weighty ? 'true' : undefined}>{s.weighty ? '● ' : '○ '}obviousness</li>
            <li data-on={s.risk === 'notinsig' || s.risk === 'substantial' ? 'true' : undefined}>{s.risk === 'notinsig' || s.risk === 'substantial' ? '● ' : '○ '}likelihood of occurrence</li>
            <li data-on={s.weighty ? 'true' : undefined}>{s.weighty ? '● ' : '○ '}seriousness of consequence</li>
          </ul>
        </div>
      </div>
    </div>
  );
  let verdict: string;
  let tone: SimView['tone'];
  if (!stop) {
    verdict = bState(s) === 'weighed'
      ? 'All three met — (b) only arguably: the likelihood is low, but an obvious risk with serious consequences can still be not insignificant once the Donald factors are weighed. Breach.'
      : 'All three met: a foreseeable risk, above the "not insignificant" threshold, and precautions a reasonable person would have taken. Breach.';
    tone = bState(s) === 'weighed' ? 'open' : 'yes';
  } else if (stop.id === 'a') {
    verdict = s.risk === 'fanciful'
      ? 'Stops at (a): a far-fetched or fanciful risk is not foreseeable (Wyong) — and it sits below the (b) threshold too. Not negligent.'
      : 'Stops at (a): the defendant neither knew nor ought to have known of the risk. Not negligent, whatever (b) and (c) say.';
    tone = 'no';
  } else if (stop.id === 'b') {
    verdict = 'Stops at (b): the risk is not far-fetched, so (a) is met — but a very low probability with nothing else to weigh may be insignificant. The Act set (b) above the Wyong threshold.';
    tone = 'no';
  } else {
    verdict = '(a) and (b) are met, but it stops at (c): a reasonable person in the defendant’s position would not have taken those precautions. Not negligent.';
    tone = 'no';
  }
  return { figure, verdict, tone };
}

function describe(a: S, b: S) {
  if (a.risk !== b.risk)
    return b.risk === 'fanciful'
      ? 'Far-fetched or fanciful: below the common law line, so (a) fails under Wyong.'
      : b.risk === 'remote'
        ? 'Not far-fetched, but very unlikely: foreseeable under (a) — Mason J said an unlikely risk can be — yet below the "not insignificant" line.'
        : b.risk === 'notinsig'
          ? 'Above the Act’s line: higher than "not far-fetched", though short of "substantial" — (b) is met.'
          : 'A substantial risk: well above what (b) requires, so (b) is met.';
  if (a.weighty !== b.weighty)
    return b.weighty
      ? 'Obvious, with serious consequences: Donald weighs these with likelihood, so a low-probability risk can still be not insignificant.'
      : 'Neither obvious nor serious: likelihood is left to decide (b) on its own.';
  if (a.knowledge !== b.knowledge)
    return b.knowledge ? 'The defendant knew or ought to have known of the risk: the knowledge half of (a) is met.' : 'Neither knew nor ought to have known: (a) fails, and the later gates are never reached.';
  if (a.precautions !== b.precautions)
    return b.precautions ? 'A reasonable person would have taken the precautions: (c) is met.' : 'A reasonable person would not have taken them: (c) fails even if (a) and (b) are met.';
  return '';
}

export default function NotInsignificantRiskS5b1b() {
  return (
    <Simulation<S>
      label="Section 5B(1)(b): the not-insignificant gate between (a) and (c), with a probability scale"
      terms={[
        { term: 'Not insignificant', def: 'The s 5B(1)(b) threshold: higher than “not far-fetched or fanciful”, lower than “a substantial risk” (Ipp Report).' },
        { term: 'Not far-fetched or fanciful', def: 'The common law line from Wyong: enough for a foreseeable risk, not by itself for (b).' },
        { term: 'Donald factors', def: 'Obviousness, likelihood of occurrence and seriousness of consequence, weighed together.' },
      ]}
      initial={initial}
      controls={[
        {
          key: 'risk', label: 'Where does the risk sit?', type: 'select', options: [
            { value: 'remote', label: 'Not far-fetched, but very unlikely' },
            { value: 'notinsig', label: 'More probable than that, short of substantial' },
            { value: 'substantial', label: 'A substantial risk' },
            { value: 'fanciful', label: 'Far-fetched or fanciful' },
          ],
        },
        { key: 'weighty', label: 'The risk was obvious and its consequences serious (Donald)', type: 'toggle' },
        { key: 'knowledge', label: 'Court finds the defendant knew or ought to have known of the risk', type: 'toggle' },
        { key: 'precautions', label: 'Court finds a reasonable person in the defendant’s position would have taken the precautions', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'A risk is not far-fetched or fanciful, so it passes s 5B(1)(a). Is s 5B(1)(b) then automatically met?',
        options: [
          { text: 'Yes: a risk that is real in the Wyong sense is not insignificant', why: 'Tempting because the flowchart offers “real risk” as a marker, but the Act deliberately moved the threshold up from “not far-fetched and fanciful”.' },
          { text: 'No: “not insignificant” is a higher bar than “not far-fetched” (Ipp Report)', correct: true, why: 'The Ipp Report places it above “not far fetched and fanciful” but below “a substantial risk”; argue (b) separately, weighing the Donald factors.' },
          { text: 'No: (b) is met only if the risk is a substantial one', why: 'Tempting because the bar rose, but the Ipp Report says “not insignificant” is not so high as “a substantial risk”.' },
        ],
      }}
    />
  );
}
