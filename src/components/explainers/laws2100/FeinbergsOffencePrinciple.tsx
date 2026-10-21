/*
SCENE: Feinberg's offence principle — two gates in sequence
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → set who would be offended and how easily the offence can be avoided → gate 1 (universality) and
  gate 2 (reasonable avoidability) open or close in turn → verdict → check
INTENT: Serious offence to others can support a prohibition, but only if it passes both of Feinberg's tests; failing
  either one, the offence principle gives no reason to coerce.
SUBJECT: the path through the two gates to the state.
BEAT 1 (0–100%): changing a control opens or closes a gate (gate bar rotates, transform 240ms ease-in-out); the path
  beyond a closed gate fades (opacity 180ms); verdict within 200ms.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical controls; the transform and fades are the only motion.
BUDGET: < 5 KB gz, no WebGL.
Source: concept laws2100-w10-feinbergs-offence-principle; authority feinberg-offence-principle (slide 13).
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  who: string;
  avoid: string;
}

const initial: S = { who: 'almost', avoid: 'easy' };
const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 12, fill: 'var(--ink)' } as const;
const swing = { transition: 'transform 240ms var(--ease-inout)' } as const;
const fade = { transition: 'opacity 180ms var(--ease-out)' } as const;

const WHO: Record<string, string> = { almost: 'almost anyone at random', group: 'one group only', few: 'a few sensitive people' };
const AVOID: Record<string, string> = { cannot: 'cannot reasonably avoid', inconvenient: 'avoiding is inconvenient', easy: 'easily avoided' };

function Gate({ x, open, label, sub }: { x: number; open: boolean; label: string; sub: string }) {
  return (
    <g>
      <line x1={x} y1="60" x2={x} y2="150" stroke="var(--ink)" strokeWidth="2" />
      <g style={{ ...swing, transformOrigin: `${x}px 105px`, transform: `rotate(${open ? -80 : 0}deg)` }}>
        <line x1={x - 22} y1="105" x2={x + 22} y2="105" stroke="var(--ink)" strokeWidth="3" />
      </g>
      <text x={x} y="44" textAnchor="middle" {...head}>{label}</text>
      <text x={x} y="172" textAnchor="middle" {...body} fontSize={11} fill="var(--ink-2)">{sub}</text>
      <text x={x} y="190" textAnchor="middle" {...body} fontSize={11}>{open ? 'met' : 'not met'}</text>
    </g>
  );
}

function view(s: S): SimView {
  const g1 = s.who === 'almost';
  const g2 = s.avoid !== 'easy';
  const figure = (
    <svg viewBox={`0 0 ${W} 230`} role="img" aria-label={`Universality ${g1 ? 'met' : 'not met'}; reasonable avoidability ${g2 ? 'met' : 'not met'}`}>
      <text x="16" y="110" {...body}>offence</text>
      <line x1="70" y1="105" x2="110" y2="105" stroke="var(--ink)" strokeWidth="1.5" />
      <Gate x={130} open={g1} label="UNIVERSALITY" sub={WHO[s.who]} />
      <g style={{ ...fade, opacity: g1 ? 1 : 0.2 }}>
        <line x1="152" y1="105" x2="208" y2="105" stroke="var(--ink)" strokeWidth="1.5" />
      </g>
      <g style={{ ...fade, opacity: g1 ? 1 : 0.35 }}>
        <Gate x={230} open={g2} label="AVOIDABILITY" sub={AVOID[s.avoid]} />
      </g>
      <g style={{ ...fade, opacity: g1 && g2 ? 1 : 0.2 }}>
        <path d="M252 105 L300 105 M292 99 L302 105 L292 111" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <rect x="304" y="88" width="48" height="34" rx="6" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="328" y="109" textAnchor="middle" {...head}>STATE</text>
      </g>
    </svg>
  );
  if (g1 && g2)
    return { figure, tone: 'yes', verdict: 'Both tests met: the offence is a reaction almost anyone chosen at random would have, and it cannot reasonably (or conveniently) be avoided. The offence principle gives a good reason for a prohibition, if it is effective and necessary.' };
  if (!g1)
    return { figure, tone: 'no', verdict: `Universality fails: offence felt by ${WHO[s.who]} is not a reaction expected from almost anyone chosen at random (regardless of sex, age, race, etc). The offence principle gives no reason to coerce.` };
  return { figure, tone: 'no', verdict: 'Avoidability fails: almost anyone would be offended, but the offended person can reasonably avoid the behaviour. You can only expect a response from the state if you cannot.' };
}

function describe(a: S, b: S) {
  if (a.who !== b.who) return b.who === 'almost' ? 'Universality met: almost anyone chosen at random would react this way.' : `Now only ${WHO[b.who]} would be offended: the first gate closes.`;
  return b.avoid === 'easy' ? 'The behaviour is now easy to avoid: the second gate closes.' : b.avoid === 'inconvenient' ? 'Avoiding it would be inconvenient: that is enough to meet the second test.' : 'The offended person cannot reasonably avoid it: the second test is met.';
}

export default function FeinbergsOffencePrinciple() {
  return (
    <Simulation<S>
      label="Feinberg's offence principle: the universality gate, then the reasonable avoidability gate"
      terms={[
        { term: 'Offence principle', def: 'Preventing serious offence to persons other than the actor is a good reason for a criminal prohibition (Feinberg), a supplement to the harm principle.' },
        { term: 'Universality', def: 'The offence must be a reaction expected from almost anyone chosen at random.' },
        { term: 'Reasonable avoidability', def: 'The state should respond only if you cannot reasonably avoid the behaviour, or avoiding it would be inconvenient.' },
      ]}
      initial={initial}
      controls={[
        { key: 'who', label: 'Who would be offended?', type: 'select', options: [{ value: 'almost', label: 'Almost anyone chosen at random' }, { value: 'group', label: 'Members of one group only' }, { value: 'few', label: 'A few unusually sensitive people' }] },
        { key: 'avoid', label: 'Can the offended person avoid it?', type: 'select', options: [{ value: 'easy', label: 'Easily (eg it happens behind closed doors)' }, { value: 'inconvenient', label: 'Only at real inconvenience' }, { value: 'cannot', label: 'No, not reasonably' }] },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Conduct offends almost everyone, but only those who choose to enter a signed venue see it. Does the offence principle apply?',
        options: [
          { text: 'No: it is reasonably avoidable', correct: true, why: 'Universality is met, but anyone offended can simply stay outside, so the standard of reasonable avoidability is not met.' },
          { text: 'Yes: almost everyone is offended', why: 'Universality alone is not enough: both of Feinberg\'s tests must be met.' },
          { text: 'No: offence never justifies coercion', why: 'That is Mill\'s view; Feinberg says preventing serious offence is properly the state\'s business if both tests are met.' },
        ],
      }}
    />
  );
}
