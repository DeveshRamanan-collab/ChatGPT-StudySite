/*
SCENE: Open texture — "No vehicles in the park", a core and a penumbra, and three theories of how much is open
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → pick an object and a theory → read whether the rule decides or a choice must be made → check
INTENT: General language has a core of plain cases and a penumbra of unclear ones; Hart's middle way lets the rule
  decide the core and leaves the penumbra to judicial choice, between formalism (all core) and rule-scepticism
  (all penumbra).
SUBJECT: the object's dot, sitting in the core or the penumbra; the penumbra shading grows or shrinks with the theory.
BEAT 1 (0–100%): selects step the object (motor-car → bicycle → roller skates → aeroplane) and the theory
  (formalism → Hart → rule-scepticism); verdict within 200ms. CSS 180ms ease-out on opacity and transform only.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical controls; changes are instant fades.
BUDGET: < 6 KB gz, no WebGL.
Source: concept laws2100-w06-open-texture-and-harts-middle-way; authority hart-the-concept-of-law.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  thing: 'car' | 'bicycle' | 'skates' | 'aeroplane';
  theory: 'formalism' | 'hart' | 'scepticism';
}

const initial: S = { thing: 'car', theory: 'hart' };
const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;
const THINGS = { car: { label: 'motor-car', x: 180, y: 188, core: true }, bicycle: { label: 'bicycle', x: 180, y: 268, core: false }, skates: { label: 'roller skates', x: 100, y: 236, core: false }, aeroplane: { label: 'aeroplane', x: 262, y: 236, core: false } } as const;
const THEORY = { formalism: 'FORMALISM · ALL CORE', hart: 'HART · CORE AND PENUMBRA', scepticism: 'RULE-SCEPTICISM · ALL PENUMBRA' } as const;
const fade = { transition: 'opacity 180ms var(--ease-out)' } as const;

function view(s: S): SimView {
  const th = THINGS[s.thing];
  const coreScale = s.theory === 'formalism' ? 2.5 : s.theory === 'scepticism' ? 0.001 : 1;
  const decides = s.theory === 'formalism' || (s.theory === 'hart' && th.core);
  const figure = (
    <svg viewBox={`0 0 ${W} 330`} role="img" aria-label={`No vehicles in the park: ${th.label} under ${s.theory}`}>
      <rect x="100" y="8" width="160" height="44" rx="6" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="180" y="26" textAnchor="middle" {...head} fill="var(--ink)">NO VEHICLES</text>
      <text x="180" y="43" textAnchor="middle" {...head} fill="var(--ink)">IN THE PARK</text>
      <circle cx="180" cy="180" r="118" fill="var(--paper-3)" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="5 5" />
      <text x="180" y="82" textAnchor="middle" {...head}>PENUMBRA</text>
      <g style={{ transform: `scale(${coreScale})`, transformOrigin: '180px 180px', transition: 'transform 180ms var(--ease-out)' }}>
        <circle cx="180" cy="180" r="44" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
      </g>
      <text x="180" y="160" textAnchor="middle" {...head} style={fade} opacity={s.theory === 'scepticism' ? 0 : 1}>CORE</text>
      {Object.entries(THINGS).map(([k, t]) => (
        <g key={k} opacity={k === s.thing ? 1 : 0.35} style={fade}>
          <circle cx={t.x} cy={t.y} r={k === s.thing ? 6 : 4} fill={k === s.thing ? 'var(--ink)' : 'none'} stroke="var(--ink)" strokeWidth="1.5" />
          <text x={t.x} y={t.y + 20} textAnchor="middle" {...body} fontSize={12}>{t.label}</text>
        </g>
      ))}
      <text x="180" y="322" textAnchor="middle" {...head}>{THEORY[s.theory]}</text>
    </svg>
  );
  const verdict = s.theory === 'formalism'
    ? `Formalism treats every case as core: the rule mechanically decides the ${th.label} too. A great exaggeration (CL 147).`
    : s.theory === 'scepticism'
      ? `Rule-scepticism treats every case as open: even the ${th.label} becomes a fresh choice. A great exaggeration (CL 147).`
      : th.core
        ? 'Plain case: "If anything is a vehicle a motor-car is one" (CL 126). The rule applies.'
        : `Penumbra: reasons for and against counting the ${th.label}. A choice between open alternatives must be made — judicial discretion.`;
  return { figure, verdict, tone: decides ? 'yes' : 'open' };
}

function describe(a: S, b: S) {
  if (a.theory !== b.theory)
    return b.theory === 'hart' ? '"The truth lies between them" (CL 147): the rule decides the core; the penumbra is left for an official choice.' : b.theory === 'formalism' ? 'Formalism: the core swells to cover everything; no choice is ever needed.' : 'Rule-scepticism: the core vanishes; every case is open.';
  return THINGS[b.thing].core ? 'A motor-car: a plain case at the core.' : `${THINGS[b.thing].label[0].toUpperCase()}${THINGS[b.thing].label.slice(1)}: one of Hart's unclear cases — "bicycles, airplanes, roller skates?" (CL 126).`;
}

export default function OpenTextureAndHartsMiddleWay() {
  return (
    <Simulation<S>
      label="Open texture: no vehicles in the park, core and penumbra, and Hart's middle way"
      terms={[
        { term: 'Open texture', def: '"Uncertainty at the borderline is the price to be paid for the use of general classifying terms" (CL 128).' },
        { term: 'Core', def: 'Plain cases the general term clearly covers.' },
        { term: 'Penumbra', def: 'Unclear cases with reasons for and against, where a choice must be made.' },
      ]}
      initial={initial}
      controls={[
        { key: 'thing', label: 'What enters the park', type: 'select', options: [{ value: 'car', label: 'Motor-car' }, { value: 'bicycle', label: 'Bicycle' }, { value: 'skates', label: 'Roller skates' }, { value: 'aeroplane', label: 'Aeroplane' }] },
        { key: 'theory', label: 'Theory, one end to the other', type: 'select', options: [{ value: 'formalism', label: 'Formalism' }, { value: 'hart', label: "Hart's middle way" }, { value: 'scepticism', label: 'Rule-scepticism' }] },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Why, for Hart, is some indeterminacy unavoidable?',
        options: [
          { text: 'Because judges prefer to make law', why: 'That is closer to the realist Nightmare; Hart locates the source in language and our situation.' },
          { text: 'Because general language is open-textured and we are relatively ignorant of fact and of aim', correct: true, why: 'We are "human beings, not gods": general terms leave a penumbra, so not every case is plain — but not every case is hard either.' },
          { text: 'Because legislation is always vaguer than precedent', why: 'Hart says the contrast between their uncertainties is "far less firm than this naïve contrast suggests" (CL 126).' },
        ],
      }}
    />
  );
}
