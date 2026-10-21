/*
SCENE: Prototyping and testing — the cost of failing rises from a rough mock-up to a full launch
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → set how sure the team is and how finished the prototype is → read the verdict → one check
INTENT: Fail early, while it is cheap: match how finished (and costly) a prototype is to how sure the team is that people
  want the idea, and make sure customers actually try it — launching untested is the most expensive way to learn.
SUBJECT: the accent marker on the cost-of-failure curve, against the shaded band of what this much certainty can afford.
BEAT 1 (0–100%): two selects and a toggle; marker, band and verdict update within 200ms (opacity fades only).
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical apart from the opacity fade; off mode shows the same controls.
BUDGET: < 6 KB gz, no WebGL.
Source: concept mgmt2094-w03-prototyping-and-experimentation (guest lecture: think with your hands, fail early, a
  prototype can be anything, more finished prototypes only as uncertainty falls; reading p 12 step 4 and p 11
  tangibility rule). The four rungs are an illustrative scale of the lecture's "rough to more finished" principle.
*/
import { Simulation, type SimView } from '../bases/Simulation';

type Proto = 'rough' | 'working' | 'finished' | 'launch';
interface S extends Record<string, unknown> {
  certainty: 'low' | 'medium' | 'high';
  prototype: Proto;
  tested: boolean;
}

const initial: S = { certainty: 'low', prototype: 'finished', tested: true };

const W = 360;
const COST: Record<Proto, number> = { rough: 1, working: 2, finished: 3, launch: 4 };
const AFFORD: Record<S['certainty'], number> = { low: 1, medium: 2, high: 4 };
const RUNGS: { id: Proto; x: number; a: string; b: string }[] = [
  { id: 'rough', x: 70, a: 'storyboard,', b: 'mock-up' },
  { id: 'working', x: 150, a: 'working', b: 'prototype' },
  { id: 'finished', x: 230, a: 'finished', b: 'prototype' },
  { id: 'launch', x: 310, a: 'full', b: 'launch' },
];
const curveY = (x: number) => 200 - 160 * Math.pow(Math.max(0, x - 40) / 290, 2.5);
const CURVE = Array.from({ length: 30 }, (_, i) => 40 + i * 10).map((x) => `${x},${curveY(x).toFixed(1)}`).join(' ');
const small = { fontFamily: 'var(--font-ui)', fontSize: 12, fill: 'var(--ink-2)' } as const;

function view(s: S): SimView {
  const cost = COST[s.prototype];
  const afford = AFFORD[s.certainty];
  const bandRight = RUNGS[Math.min(afford, 4) - 1].x + 30;
  const figure = (
    <svg viewBox={`0 0 ${W} 270`} role="img" aria-label={`Cost of failing rises from a rough mock-up to a full launch; selected: ${s.prototype}; affordable up to ${RUNGS[afford - 1].id}`}>
      <rect x="30" y="30" width={bandRight - 30} height="184" fill="var(--paper-3)" opacity="0.7" />
      <text x="36" y="48" {...small}>shaded: affordable at this certainty</text>
      <text x="16" y="20" fontFamily="var(--font-ui)" fontSize="12" letterSpacing="1.2" fill="var(--ink-2)">COST OF FAILING</text>
      <line x1="30" y1="214" x2="344" y2="214" stroke="var(--ink-3)" strokeWidth="1.25" />
      <polyline points={CURVE} fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      {RUNGS.map((r) => {
        const on = r.id === s.prototype;
        return (
          <g key={r.id}>
            <line x1={r.x} y1="214" x2={r.x} y2={curveY(r.x)} stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="3 4" />
            <circle cx={r.x} cy={curveY(r.x)} r={on ? 8 : 5} fill="var(--paper)" stroke={on ? 'var(--accent)' : 'var(--ink-3)'} strokeWidth={on ? 2.5 : 1.5} />
            <text x={r.x} y="234" textAnchor="middle" {...small} fill={on ? 'var(--ink)' : 'var(--ink-2)'}>{r.a}</text>
            <text x={r.x} y="250" textAnchor="middle" {...small} fill={on ? 'var(--ink)' : 'var(--ink-2)'}>{r.b}</text>
          </g>
        );
      })}
      <text x="344" y="266" textAnchor="end" {...small} style={{ opacity: s.tested ? 0 : 1, transition: 'opacity 180ms var(--ease-out)' }}>no customer has tried it yet</text>
    </svg>
  );
  let verdict: string;
  let tone: SimView['tone'];
  if (!s.tested) {
    tone = s.prototype === 'launch' ? 'no' : 'open';
    verdict = s.prototype === 'launch'
      ? 'Launching with no customer test: if it fails, it fails at the most expensive point.'
      : 'Nobody outside the team has tried it. A prototype teaches only when customers try it: get feedback, iterate, take it back.';
  } else if (cost > afford) {
    tone = 'no';
    verdict = 'Too finished for this much uncertainty: you would spend heavily before learning whether it matters to the customer. Go rougher.';
  } else if (s.certainty === 'high' && cost < 3) {
    tone = 'open';
    verdict = 'Cheap, but you already know people want it: build something more finished and test feasibility and viability.';
  } else if (s.certainty === 'medium' && cost === 1) {
    tone = 'open';
    verdict = 'The first question is answered: a working prototype can now refine the idea with users’ feedback.';
  } else {
    tone = 'yes';
    verdict = s.prototype === 'rough' ? 'Right-sized: a rough prototype asks the first question — if we made it, would it matter to the customer?'
      : s.prototype === 'working' ? 'Right-sized: a working prototype refines the idea with feedback from end users.'
      : s.prototype === 'finished' ? 'Right-sized: people want it, so a more finished version can test feasibility and viability.'
      : 'Evidence first, then launch: people want it, and it was tested along the way.';
  }
  return { figure, verdict, tone };
}

function describe(a: S, b: S) {
  if (a.certainty !== b.certainty)
    return b.certainty === 'low' ? 'No evidence yet that people want it: only cheap, rough tests are worth it.'
      : b.certainty === 'medium' ? 'Some evidence that people want it: a working prototype is now worth building.'
      : 'Strong evidence that people want it: more finished, more expensive prototypes are justified.';
  if (a.prototype !== b.prototype) return `${RUNGS.find((r) => r.id === b.prototype)!.a} ${RUNGS.find((r) => r.id === b.prototype)!.b}: the more finished, the more a failure costs.`;
  if (a.tested !== b.tested) return b.tested ? 'Customers try it and give feedback: now it can teach the team something.' : 'Kept inside the team: nothing is learned about the customer.';
  return '';
}

export default function PrototypingAndExperimentation() {
  return (
    <Simulation<S>
      label="Matching the prototype to the uncertainty: the cost of failing rises towards launch"
      terms={[
        { term: 'Prototype', def: 'Anything that makes an idea tangible to test it: scrap materials, a mock-up, a storyboard.' },
        { term: 'Think with your hands', def: 'Build or try something, then talk about it — not the reverse.' },
        { term: 'Fail early', def: 'Failing early costs little; failing after a costly launch costs most.' },
      ]}
      initial={initial}
      controls={[
        { key: 'certainty', label: 'How sure are we that people want it?', type: 'select', options: [{ value: 'low', label: 'No evidence yet' }, { value: 'medium', label: 'Some feedback that they do' }, { value: 'high', label: 'Strong evidence that they do' }] },
        { key: 'prototype', label: 'What will we build to test it?', type: 'select', options: [{ value: 'rough', label: 'A storyboard or rough mock-up' }, { value: 'working', label: 'A working prototype' }, { value: 'finished', label: 'A finished prototype' }, { value: 'launch', label: 'The full product, launched' }] },
        { key: 'tested', label: 'Customers try it and give feedback', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'A team has a promising idea for a parcel-locker service but no evidence yet that anyone wants it. What should it build first?',
        options: [
          { text: 'A storyboard of a customer’s day with the service, shown to potential users', correct: true, why: 'With uncertainty high, a cheap, rough prototype answers the first question: if we made it, would it matter to the customer?' },
          { text: 'A fully engineered locker for a year-long public trial', why: 'That gives real data, but at high cost before anyone knows people want it — more finished prototypes come later.' },
          { text: 'A ten-year financial model of locker revenue', why: 'A model before any evidence of demand is the made-up business case the lecture warns about.' },
        ],
      }}
    />
  );
}
