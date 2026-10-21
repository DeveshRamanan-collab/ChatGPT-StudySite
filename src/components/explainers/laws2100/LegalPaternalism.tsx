/*
SCENE: Legal paternalism — the five considerations as weights on a balance
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → set the five considerations for a risky choice → each consideration drops into one pan (the
  risk-taker's freedom, or the case for intervening for their own good) → the beam tips → verdict → check
INTENT: The paternalist rationale weighs five things; the more of them point toward intervention, the stronger the
  case for coercing someone for their own good, and the weaker it is when harm is unlikely, the goal valuable and
  the risk necessary.
SUBJECT: the beam, and which way it tips.
BEAT 1 (0–100%): changing a consideration moves its weight between pans (opacity 180ms) and re-tilts the beam
  (transform 240ms ease-in-out); verdict within 200ms.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical controls; the transform and fades are the only motion.
BUDGET: < 5 KB gz, no WebGL.
Source: concept laws2100-w10-legal-paternalism (slides 14–15; the weighing is the lecture's description).
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  pHarm: string;
  serious: string;
  pGoal: string;
  value: string;
  safer: string;
}

const initial: S = { pHarm: 'low', serious: 'minor', pGoal: 'high', value: 'high', safer: 'no' };
const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 11, fill: 'var(--ink)' } as const;
const tilt = { transition: 'transform 240ms var(--ease-inout)', transformOrigin: '180px 60px' } as const;
const fade = { transition: 'opacity 180ms var(--ease-out)' } as const;

// Each consideration: does it point toward intervening (true) or toward leaving the choice alone (false)?
const FACTORS: { key: keyof S & string; toward: string; away: string; forIntervening: (s: S) => boolean }[] = [
  { key: 'pHarm', toward: 'probable self-harm', away: 'self-harm unlikely', forIntervening: (s) => s.pHarm === 'high' },
  { key: 'serious', toward: 'serious harm', away: 'minor harm', forIntervening: (s) => s.serious === 'serious' },
  { key: 'pGoal', toward: 'goal unlikely', away: 'goal likely', forIntervening: (s) => s.pGoal === 'low' },
  { key: 'value', toward: 'goal of little value', away: 'valuable goal', forIntervening: (s) => s.value === 'low' },
  { key: 'safer', toward: 'safer way exists', away: 'risk necessary', forIntervening: (s) => s.safer === 'yes' },
];

function view(s: S): SimView {
  const toward = FACTORS.filter((f) => f.forIntervening(s)).length;
  const angle = (toward - 2.5) * 5; // positive: right pan (intervene) goes down
  const figure = (
    <svg viewBox={`0 0 ${W} 260`} role="img" aria-label={`${toward} of 5 considerations point toward intervening`}>
      <path d="M180 60 L164 200 L196 200 Z" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <line x1="140" y1="200" x2="220" y2="200" stroke="var(--ink-2)" strokeWidth="1.5" />
      <g style={{ ...tilt, transform: `rotate(${angle}deg)` }}>
        <line x1="40" y1="60" x2="320" y2="60" stroke="var(--ink)" strokeWidth="2" />
        <path d="M30 96 L110 96 L100 108 L40 108 Z" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <path d="M250 96 L330 96 L320 108 L260 108 Z" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <line x1="70" y1="60" x2="70" y2="96" stroke="var(--ink-3)" strokeWidth="1" />
        <line x1="290" y1="60" x2="290" y2="96" stroke="var(--ink-3)" strokeWidth="1" />
      </g>
      {FACTORS.map((f, k) => {
        const right = f.forIntervening(s);
        return (
          <g key={f.key}>
            <text x="16" y={136 + k * 16} {...body} style={{ ...fade, opacity: right ? 0.15 : 1 }}>{`· ${f.away}`}</text>
            <text x={W - 16} y={136 + k * 16} textAnchor="end" {...body} style={{ ...fade, opacity: right ? 1 : 0.15 }}>{`${f.toward} ·`}</text>
          </g>
        );
      })}
      <text x="16" y="24" {...head}>LEAVE THE CHOICE</text>
      <text x={W - 16} y="24" textAnchor="end" {...head}>INTERVENE FOR THEIR GOOD</text>
      <text x="180" y="240" textAnchor="middle" {...body} fill="var(--ink-2)">{`${toward} of 5 considerations favour intervening`}</text>
    </svg>
  );
  if (toward >= 4)
    return { figure, tone: 'open', verdict: 'Relatively strong paternalist case: harm to oneself is probable and serious, the goal is doubtful or of little worth, or a less risky way exists. A liberal following Mill or Feinberg still rejects paternalism in principle.' };
  if (toward <= 1)
    return { figure, tone: 'no', verdict: 'Weak paternalist case: self-harm is unlikely or minor, the goal is likely and worthwhile, and the risk is necessary to reach it. Coercing this person for their own good is hard to justify.' };
  return { figure, tone: 'open', verdict: 'Arguable either way: the considerations pull in both directions. They are weighed against the interference with freedom, and measures short of public coercion should be considered first.' };
}

const NAMES: Record<string, string> = { pHarm: 'probability of harm to oneself', serious: 'seriousness of the harm', pGoal: 'probability the goal results', value: 'value of the goal', safer: 'necessity of the risk' };

function describe(a: S, b: S) {
  const k = (Object.keys(NAMES) as (keyof S & string)[]).find((x) => a[x] !== b[x]);
  if (!k) return 'No change.';
  const f = FACTORS.find((x) => x.key === k)!;
  return `You changed the ${NAMES[k]}: it now weighs ${f.forIntervening(b) ? 'toward intervening' : 'toward leaving the choice alone'}.`;
}

const lh = (lo: string, hi: string) => [{ value: 'low', label: lo }, { value: 'high', label: hi }];

export default function LegalPaternalism() {
  return (
    <Simulation<S>
      label="Legal paternalism: five considerations weighed on a balance"
      terms={[
        { term: 'Legal paternalism', def: 'State coercion to protect individuals from self-inflicted harm, or to guide them toward their own good.' },
        { term: 'Soft paternalism', def: 'Found in all states: eg no consenting to one\'s own disablement; no contract selling oneself into slavery.' },
        { term: 'Hard paternalism', def: 'The state intervenes for the person\'s own good; some drug laws may be soft or hard.' },
      ]}
      initial={initial}
      controls={[
        { key: 'pHarm', label: '1. Probability of harm to oneself', type: 'select', options: lh('Low', 'High') },
        { key: 'serious', label: '2. Seriousness of the harm risked', type: 'select', options: [{ value: 'minor', label: 'Minor' }, { value: 'serious', label: 'Serious' }] },
        { key: 'pGoal', label: '3. Probability the goal will result', type: 'select', options: lh('Low', 'High') },
        { key: 'value', label: '4. Value of achieving the goal', type: 'select', options: lh('Little', 'Great') },
        { key: 'safer', label: '5. Is there a less risky way to the goal?', type: 'select', options: [{ value: 'no', label: 'No: the risk is necessary' }, { value: 'yes', label: 'Yes: a safer way exists' }] },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Which consideration asks "is there a less risky way of achieving that goal?"',
        options: [
          { text: 'The necessity of the risk', correct: true, why: 'The fifth consideration on the slide: if a safer route to the same goal exists, the risk is unnecessary.' },
          { text: 'The seriousness of the harm', why: 'Seriousness asks how bad the harm risked would be, not whether a safer route exists.' },
          { text: 'The value of the goal', why: 'This asks how worthwhile the goal is; it does not compare routes to it.' },
        ],
      }}
    />
  );
}
