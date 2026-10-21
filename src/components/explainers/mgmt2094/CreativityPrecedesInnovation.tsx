/*
SCENE: Creativity vs innovation — which follows which
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → set what is happening → watch the work sit at the creativity or the innovation station → one check
INTENT: Creativity (imagination, cannot be measured) precedes innovation (implementation, can be measured); innovation
  is the introduction of new or improved goods, services or processes.
SUBJECT: the two stations joined by a "precedes → follows" arrow; the station the work is at carries the one accent
  outline, and its three paired attributes read in ink while the other station's fall back to faint ink.
BEAT 1 (0–100%): three selects (what is happening; new or improved; good, service or process). The accent outline
  cross-fades between stations (opacity 180ms --ease-out; instant when motion is off); the verdict and the
  "what changed" line update within 200ms.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: same controls and view; no positional movement at all; off removes the opacity fade too.
BUDGET: < 6 KB gz, no WebGL.
Source: concept mgmt2094-w07-creativity-precedes-innovation (Week 7 tutorial, slide 3 chart); authority
  mgmt2094-example-iphone-tablet-flat-screen-tv.
*/
import { useMemo } from 'react';
import { Simulation, type SimView } from '../bases/Simulation';
import { useExplainer } from '../context';

interface S extends Record<string, unknown> {
  happening: 'imagining' | 'introducing';
  change: 'new' | 'improved';
  what: 'good' | 'service' | 'process';
}

const initial: S = { happening: 'imagining', change: 'new', what: 'service' };

const W = 360;
const BOX_W = 150;
const LX = 8;
const RX = W - 8 - BOX_W;
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2 } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13 } as const;

const STATIONS = [
  { key: 'imagining', x: LX, title: 'CREATIVITY', rows: ['imagination', 'cannot be measured', 'precedes innovation'] },
  { key: 'introducing', x: RX, title: 'INNOVATION', rows: ['implementation', 'can be measured', 'follows creativity'] },
] as const;

const thing = (s: S) => `${s.change === 'new' ? 'a new' : 'an improved'} ${s.what}`;

function makeView(fade: string) {
  return (s: S): SimView => {
    const atInnovation = s.happening === 'introducing';
    const figure = (
      <svg viewBox={`0 0 ${W} 250`} role="img" aria-label={`Creativity precedes innovation; the work is now at ${atInnovation ? 'innovation' : 'creativity'}`}>
        <line x1={LX + BOX_W + 4} y1="62" x2={RX - 10} y2="62" stroke="var(--ink-2)" strokeWidth="1.5" />
        <path d={`M${RX - 4} 62 L${RX - 14} 56 L${RX - 14} 68 Z`} fill="var(--ink-2)" />
        <text x={W / 2} y="50" textAnchor="middle" {...head} fontSize={10} fill="var(--ink-2)">THEN</text>
        {STATIONS.map((st) => {
          const on = st.key === s.happening;
          const ink = on ? 'var(--ink)' : 'var(--ink-3)';
          return (
            <g key={st.key} data-station={st.key} data-on={on || undefined}>
              <rect x={st.x} y="24" width={BOX_W} height="76" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
              <rect x={st.x} y="24" width={BOX_W} height="76" rx="12" fill="none" stroke="var(--accent)" strokeWidth="2" style={{ opacity: on ? 1 : 0, transition: fade }} />
              <text x={st.x + BOX_W / 2} y="58" textAnchor="middle" {...head} fill={ink}>{st.title}</text>
              <text x={st.x + BOX_W / 2} y="80" textAnchor="middle" {...body} fontSize={12} fill={ink}>{st.key === 'imagining' ? 'comes first' : 'comes second'}</text>
              {st.rows.map((r, k) => (
                <text key={r} x={st.x + BOX_W / 2} y={132 + k * 24} textAnchor="middle" {...body} fill={ink}>{r}</text>
              ))}
            </g>
          );
        })}
        <line x1="8" y1="206" x2={W - 8} y2="206" stroke="var(--ink-3)" strokeWidth="1" />
        <text x={W / 2} y="232" textAnchor="middle" {...body} fill="var(--ink-2)">
          {atInnovation ? `introducing ${thing(s)}` : `imagining original ideas for ${thing(s)}`}
        </text>
      </svg>
    );
    const verdict = atInnovation
      ? `Innovation: the introduction of ${thing(s)}. It is related to implementation, it can be measured, and it follows creativity.${s.change === 'improved' ? ' Improved counts: the chart says new or improved.' : ''}`
      : 'Creativity: the use of imagination or original ideas to create something. It is related to imagination, it cannot be measured, and it precedes innovation.';
    return { figure, verdict, tone: 'open' };
  };
}

function describe(a: S, b: S) {
  if (a.happening !== b.happening)
    return b.happening === 'introducing'
      ? 'Introducing it and putting it into practice moves the work to innovation, which follows creativity.'
      : 'Back to imagining original ideas: that is creativity, which comes first.';
  if (a.change !== b.change)
    return b.happening === 'imagining'
      ? 'While the ideas are only being imagined, it stays creativity, whatever they are for.'
      : b.change === 'improved'
        ? 'Improved still counts: the chart defines innovation as the introduction of new or improved goods, services, processes.'
        : 'A new one counts too: innovation covers new or improved goods, services, processes.';
  if (a.what !== b.what)
    return b.happening === 'imagining'
      ? 'Still creativity: nothing has been introduced yet.'
      : `${b.what === 'good' ? 'Goods' : b.what === 'service' ? 'Services' : 'Processes'} are on the chart's list: goods, services and processes can all be innovation.`;
  return '';
}

export default function CreativityPrecedesInnovation() {
  const { motion } = useExplainer();
  const fade = motion === 'off' ? 'none' : 'opacity 180ms var(--ease-out)';
  const view = useMemo(() => makeView(fade), [fade]);
  return (
    <Simulation<S>
      label="Creativity precedes innovation: set what is happening and see which station the work is at"
      terms={[
        { term: 'Creativity', def: 'The use of imagination or original ideas to create something.' },
        { term: 'Innovation', def: 'The introduction of new or improved goods, services, processes, etc.' },
        { term: 'Implementation', def: 'What the chart relates innovation to; creativity is related to imagination.' },
      ]}
      initial={initial}
      controls={[
        { key: 'happening', label: 'What is happening', type: 'select', options: [{ value: 'imagining', label: 'Staff imagine original ideas' }, { value: 'introducing', label: 'It is introduced and put into practice' }] },
        { key: 'change', label: 'New or improved', type: 'select', options: [{ value: 'new', label: 'New' }, { value: 'improved', label: 'Improved' }] },
        { key: 'what', label: 'Good, service or process', type: 'select', options: [{ value: 'good', label: 'A good' }, { value: 'service', label: 'A service' }, { value: 'process', label: 'A process' }] },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'On the Week 7 chart, which comes first, and which can be measured?',
        options: [
          { text: 'Innovation comes first; creativity can be measured', why: 'Both halves are reversed: creativity precedes innovation, and only innovation can be measured.' },
          { text: 'Creativity comes first; innovation can be measured', correct: true, why: 'The chart says creativity precedes innovation, innovation can be measured, and creativity cannot.' },
          { text: 'Creativity comes first; both can be measured', why: 'The order is right, but the chart says creativity cannot be measured; only innovation can.' },
        ],
      }}
    />
  );
}
