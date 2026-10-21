/*
SCENE: Four seats at the team table — Clarifier, Ideator, Developer, Implementer
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → seat or unseat each preference → read what the team now misses (or the lone preference's risk) → check
INTENT: The four preferences are different paths to a solution; a team that mixes them gets complementary ideas,
  and each empty seat names what goes missing (no one checks the problem, stretches the imagination, makes the idea
  workable, or pushes it to fruition).
SUBJECT: the four seats; filled seats sit on paper-3 with a solid edge, empty seats fade and turn dashed.
BEAT 1 (0–100%): toggles seat and unseat preferences; seats fade 100% ↔ 55% (opacity only, 180ms ease-out); verdict
  within 200ms.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: same controls; changes are instant fades.
BUDGET: < 5 KB gz, no WebGL.
Source: concept mgmt2094-w05-four-creative-thinking-preferences (Week 5 lecture slides 23–25; lecture transcript);
  authority mgmt2094-example-creative-gadgets-tutorial (the group innovative project).
*/
import { Simulation, type SimView } from '../bases/Simulation';

type Key = 'clarifier' | 'ideator' | 'developer' | 'implementer';

interface S extends Record<string, unknown> {
  clarifier: boolean;
  ideator: boolean;
  developer: boolean;
  implementer: boolean;
}

const initial: S = { clarifier: false, ideator: true, developer: true, implementer: false };

const SEATS: { k: Key; name: string; lines: [string, string, string]; x: number; y: number; missing: string; joins: string }[] = [
  { k: 'clarifier', name: 'CLARIFIER', lines: ['are we solving the', 'right problem?', 'asks many questions'], x: 8, y: 8,
    missing: 'no one asks whether you are really solving the right problem', joins: 'someone who researches, attends to detail and asks whether this is the right problem' },
  { k: 'ideator', name: 'IDEATOR', lines: ['big picture; dreams', 'of possibilities', 'jumps from A to Z'], x: 184, y: 8,
    missing: 'no one stretches the imagination with out-of-the-box ideas', joins: 'someone who looks at the big picture and dreams of possibilities' },
  { k: 'developer', name: 'DEVELOPER', lines: ['tinkers with ideas;', 'weighs pros and cons', 'risk: gets stuck'], x: 8, y: 150,
    missing: 'no one tinkers ideas into workable solutions or weighs pros and cons', joins: 'someone who improves others’ ideas into workable solutions' },
  { k: 'implementer', name: 'IMPLEMENTER', lines: ['quick to action;', 'needs fruition', 'risk: leaps too soon'], x: 184, y: 150,
    missing: 'no one pushes ideas to fruition', joins: 'someone quick to action, decisive and determined' },
];
const NAME: Record<Key, string> = { clarifier: 'Clarifier', ideator: 'Ideator', developer: 'Developer', implementer: 'Implementer' };
const fade = { transition: 'opacity 180ms var(--ease-out)' } as const;

function view(s: S): SimView {
  const seated = SEATS.filter((x) => s[x.k]);
  const missing = SEATS.filter((x) => !s[x.k]);
  const figure = (
    <svg viewBox="0 0 360 296" role="img" aria-label={`Team seats: ${seated.map((x) => NAME[x.k]).join(', ') || 'none'} seated; ${missing.map((x) => NAME[x.k]).join(', ') || 'none'} missing`}>
      {SEATS.map((seat) => {
        const on = !!s[seat.k];
        return (
          <g key={seat.k} style={fade} opacity={on ? 1 : 0.55}>
            <rect x={seat.x} y={seat.y} width="168" height="132" rx="12" fill={on ? 'var(--paper-3)' : 'none'} stroke={on ? 'var(--ink)' : 'var(--ink-3)'} strokeWidth="1.5" strokeDasharray={on ? undefined : '6 6'} />
            <text x={seat.x + 14} y={seat.y + 26} fontFamily="var(--font-ui)" fontSize="12" letterSpacing="1.2" fill="var(--ink)">{seat.name}</text>
            {seat.lines.map((l, i) => (
              <text key={i} x={seat.x + 14} y={seat.y + 52 + i * 19} fontFamily="var(--font-body)" fontSize="12" fill={i === 2 ? 'var(--ink-2)' : 'var(--ink)'}>{l}</text>
            ))}
            <text x={seat.x + 14} y={seat.y + 118} fontFamily="var(--font-ui)" fontSize="11" letterSpacing="1" fill="var(--ink-2)">{on ? 'IN THE TEAM' : 'EMPTY SEAT'}</text>
          </g>
        );
      })}
    </svg>
  );
  if (seated.length === 0) return { figure, verdict: 'No one is seated yet: tick a preference to add someone to the team.', tone: 'open' };
  if (missing.length === 0)
    return { figure, verdict: 'All four preferences: different paths to the solution and complementary ideas — the slides say this should solve the problem more effectively.', tone: 'yes' };
  let verdict = `Missing — ${missing.map((x) => x.missing).join('; ')}.`;
  if (seated.length === 1 && s.developer) verdict += ' Developers alone can get stuck developing the perfect solution.';
  if (seated.length === 1 && s.implementer) verdict += ' Implementers alone can leap into action too soon and oversell.';
  return { figure, verdict, tone: missing.length === 1 ? 'open' : 'no' };
}

function describe(a: S, b: S) {
  const seat = SEATS.find((x) => a[x.k] !== b[x.k]);
  if (!seat) return '';
  return b[seat.k] ? `A ${NAME[seat.k]} joins: ${seat.joins}.` : `Without a ${NAME[seat.k]}, ${seat.missing}.`;
}

export default function FourCreativeThinkingPreferences() {
  return (
    <Simulation<S>
      label="Four preferences for thinking creatively, seated around a team"
      terms={[
        { term: 'Clarifier', def: 'Asks "are we really solving the right problem?"; researches, attends to detail, asks questions.' },
        { term: 'Ideator', def: 'Looks at the big picture and dreams of possibilities; stretches the imagination.' },
        { term: 'Developer', def: 'Tinkers with and improves ideas; weighs pros and cons; can get stuck perfecting.' },
        { term: 'Implementer', def: 'Quick to action, decisive; needs ideas to hit fruition; can leap too soon.' },
      ]}
      initial={initial}
      controls={[
        { key: 'clarifier', label: 'Seat a Clarifier', type: 'toggle' },
        { key: 'ideator', label: 'Seat an Ideator', type: 'toggle' },
        { key: 'developer', label: 'Seat a Developer', type: 'toggle' },
        { key: 'implementer', label: 'Seat an Implementer', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Which preference can get stuck developing the perfect solution, and be seen by others as a nit-picker?',
        options: [
          { text: 'The Implementer', why: 'Implementers have the opposite risk: they can leap into action too soon and oversell their idea.' },
          { text: 'The Developer', correct: true, why: 'Developers are perfectionists: the slide says they can get stuck developing the perfect solution and be seen as nit-pickers.' },
          { text: 'The Clarifier', why: 'Clarifiers are methodical and ask many questions, but the slide does not give them the perfectionist risk.' },
        ],
      }}
    />
  );
}
