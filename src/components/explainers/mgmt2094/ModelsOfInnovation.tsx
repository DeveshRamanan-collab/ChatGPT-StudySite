/*
SCENE: Models of innovation — where does innovation start?
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → choose a model and change the facts → read where innovation starts → one check
INTENT: Distinguish the three models by their starting point: serendipity needs a chance discovery AND a prepared mind;
  the linear model starts with science and moves through four gates to the market; simultaneous coupling combines
  everything at once, so no start can be named.
SUBJECT: serendipity — the overlap of the two circles; linear — the current stage and its gate output; coupling — the
  unmarked centre of three circles.
BEAT 1 (0–100%): select the model; for serendipity toggle the chance event and previous knowledge; for linear pick the
  stage reached. The figure swaps by an opacity fade (180ms, ease-out) and the verdict updates within 200ms.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical controls; the figure swaps with an opacity fade only (no positional movement in any level).
BUDGET: < 5 KB gz, no WebGL.
Source: concept mgmt2094-w11-models-of-innovation (Week 11 slides 4–5, Fig 6.3 linear model; Week 9 recording);
  examples fleming-penicillin (verify), accidental-discoveries (Week 5), guest-founder-mark.
The serendipity rule is the slide's own: "to recognise the significance of your innovation, you would at first require
previous knowledge in the area". The stage → gate output pairs are read off Fig 6.3 and the lecturer's walk-through.
*/
import { Simulation, type SimView } from '../bases/Simulation';

type Stage = 'idea' | 'feasibility' | 'capability' | 'rampup' | 'launch';

interface S extends Record<string, unknown> {
  model: 'serendipity' | 'linear' | 'coupling';
  chance: boolean;
  knowledge: boolean;
  stage: Stage;
}

const initial: S = { model: 'serendipity', chance: true, knowledge: false, stage: 'idea' };
const W = 360;
const ui = { fontFamily: 'var(--font-ui)' } as const;
const serif = { fontFamily: 'var(--font-body)' } as const;
const fade = { animation: 'fade-in 180ms var(--ease-out) both' } as const;

const STAGES: { id: Stage; name: string; detail: string; gate: string }[] = [
  { id: 'idea', name: 'Idea generation', detail: '', gate: 'Gate 1 · project charter' },
  { id: 'feasibility', name: 'Concept feasibility', detail: 'financial, technical feasibility', gate: 'Gate 2 · business plan' },
  { id: 'capability', name: 'Capability development', detail: 'prototype development', gate: 'Gate 3 · launch and proposal' },
  { id: 'rampup', name: 'Ramp up', detail: 'test marketing', gate: 'Gate 4 · sanity check' },
  { id: 'launch', name: 'Launch', detail: 'commercialisation', gate: '' },
];

function serendipityFigure(s: S) {
  const on = (b: boolean) => ({ stroke: b ? 'var(--ink)' : 'var(--ink-3)', strokeDasharray: b ? undefined : '5 5', fill: b ? 'var(--paper-3)' : 'none', fillOpacity: 0.55 });
  const both = s.chance && s.knowledge;
  return (
    <g style={fade} key={`s-${s.chance}-${s.knowledge}`}>
      <circle cx="135" cy="130" r="88" strokeWidth="1.5" {...on(s.chance)} />
      <circle cx="225" cy="130" r="88" strokeWidth="1.5" {...on(s.knowledge)} />
      <text x="96" y="126" textAnchor="middle" {...ui} fontSize="13" fill={s.chance ? 'var(--ink)' : 'var(--ink-3)'}>unexpected</text>
      <text x="96" y="144" textAnchor="middle" {...ui} fontSize="13" fill={s.chance ? 'var(--ink)' : 'var(--ink-3)'}>discovery</text>
      <text x="264" y="126" textAnchor="middle" {...ui} fontSize="13" fill={s.knowledge ? 'var(--ink)' : 'var(--ink-3)'}>previous</text>
      <text x="264" y="144" textAnchor="middle" {...ui} fontSize="13" fill={s.knowledge ? 'var(--ink)' : 'var(--ink-3)'}>knowledge</text>
      <text x="180" y="136" textAnchor="middle" {...serif} fontSize="14" fontWeight="600" fill={both ? 'var(--ink)' : 'var(--ink-3)'}>{both ? 'recognised' : '—'}</text>
      <text x="180" y="248" textAnchor="middle" {...serif} fontSize="14" fontStyle="italic" fill="var(--ink-2)">“Chance favours the prepared mind” — Pasteur</text>
    </g>
  );
}

function linearFigure(s: S) {
  const k = STAGES.findIndex((x) => x.id === s.stage);
  return (
    <g style={fade} key={`l-${s.stage}`}>
      <text x="8" y="16" {...ui} fontSize="11" letterSpacing="1.2" fill="var(--ink-2)">SCIENCE & TECHNOLOGY → DEVELOPMENTS → MARKET</text>
      {STAGES.map((st, i) => {
        const y = 38 + i * 46;
        const done = i <= k;
        return (
          <g key={st.id}>
            {i > 0 && <line x1="22" y1={y - 34} x2="22" y2={y - 8} stroke={i <= k ? 'var(--ink)' : 'var(--ink-3)'} strokeWidth="1.5" />}
            <circle cx="22" cy={y} r={i === k ? 7 : 5} fill={i === k ? 'var(--ink)' : done ? 'var(--ink-2)' : 'var(--paper)'} stroke={done ? 'var(--ink)' : 'var(--ink-3)'} strokeWidth="1.5" />
            <text x="40" y={y + 5} {...serif} fontSize="15" fontWeight={i === k ? 600 : 400} fill={done ? 'var(--ink)' : 'var(--ink-3)'}>{st.name}</text>
            {st.detail && <text x="40" y={y + 22} {...ui} fontSize="12" fill={done ? 'var(--ink-2)' : 'var(--ink-3)'}>{st.detail}</text>}
            {st.gate && (
              <>
                <polygon points={`212,${y + 14} 220,${y + 6} 228,${y + 14} 220,${y + 22}`} fill={i < k ? 'var(--ink)' : 'none'} stroke={i < k ? 'var(--ink)' : 'var(--ink-3)'} strokeWidth="1.2" />
                <text x="236" y={y + 12} {...ui} fontSize="11" fill={i < k ? 'var(--ink)' : 'var(--ink-3)'}>{st.gate.split(' · ')[0]}</text>
                <text x="236" y={y + 26} {...ui} fontSize="11" fill={i < k ? 'var(--ink-2)' : 'var(--ink-3)'}>{st.gate.split(' · ')[1]}</text>
              </>
            )}
          </g>
        );
      })}
    </g>
  );
}

function couplingFigure() {
  return (
    <g style={fade} key="c">
      <circle cx="140" cy="100" r="70" fill="var(--paper-3)" fillOpacity="0.5" stroke="var(--ink)" strokeWidth="1.5" />
      <circle cx="220" cy="100" r="70" fill="var(--paper-3)" fillOpacity="0.5" stroke="var(--ink)" strokeWidth="1.5" />
      <circle cx="180" cy="166" r="70" fill="var(--paper-3)" fillOpacity="0.5" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="112" y="84" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink)">science &</text>
      <text x="112" y="100" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink)">technology</text>
      <text x="248" y="84" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink)">technological</text>
      <text x="248" y="100" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink)">developments</text>
      <text x="180" y="204" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink)">market needs</text>
      <text x="180" y="140" textAnchor="middle" {...serif} fontSize="22" fill="var(--ink)">?</text>
      <text x="180" y="262" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">all coupled at once: no known starting point</text>
    </g>
  );
}

function view(s: S): SimView {
  const figure = (
    <svg viewBox={`0 0 ${W} 270`} role="img" aria-label={s.model === 'serendipity' ? `Two circles, unexpected discovery ${s.chance ? 'present' : 'absent'} and previous knowledge ${s.knowledge ? 'present' : 'absent'}` : s.model === 'linear' ? `The linear model's five stages and four gates, reached as far as ${STAGES.find((x) => x.id === s.stage)!.name}` : 'Three overlapping circles with a question mark where innovation begins'}>
      {s.model === 'serendipity' ? serendipityFigure(s) : s.model === 'linear' ? linearFigure(s) : couplingFigure()}
    </svg>
  );
  if (s.model === 'linear') {
    const st = STAGES.find((x) => x.id === s.stage)!;
    const verdicts: Record<Stage, string> = {
      idea: 'Linear: idea generation, then Gate 1 — a project charter. The chain runs from science and technology towards the needs of the market.',
      feasibility: 'Linear: concept feasibility tests financial and technical feasibility, then Gate 2 — a business plan.',
      capability: 'Linear: capability development builds and tests a prototype, then Gate 3 — launch and proposal.',
      rampup: 'Linear: ramp up runs test marketing, then Gate 4 — a sanity check, with feedback and corrective measures.',
      launch: 'Linear: launch and commercialisation. Science and technology have been linked, in order, to the needs of the market.',
    };
    return { figure, verdict: verdicts[st.id], tone: s.stage === 'launch' ? 'yes' : 'open' };
  }
  if (s.model === 'coupling')
    return { figure, verdict: 'Simultaneous coupling: all the knowledge in the key components is combined at once, so the point where innovation begins is not known.', tone: 'open' };
  if (s.chance && s.knowledge)
    return { figure, verdict: 'Serendipity: an unexpected discovery meets a prepared mind with previous knowledge in the area, so its significance is recognised.', tone: 'yes' };
  if (s.chance)
    return { figure, verdict: 'The discovery happens, but without previous knowledge in the area its significance goes unrecognised. No serendipity yet.', tone: 'no' };
  if (s.knowledge)
    return { figure, verdict: 'A prepared mind, but nothing unexpected has happened: serendipity also needs the chance discovery.', tone: 'open' };
  return { figure, verdict: 'Neither a chance discovery nor previous knowledge: nothing here for serendipity to work with.', tone: 'no' };
}

function describe(a: S, b: S) {
  if (a.model !== b.model)
    return b.model === 'serendipity' ? 'Serendipity: innovation starts with chance — but only a prepared mind recognises it.'
      : b.model === 'linear' ? 'Linear: innovation starts with science and technology and moves in order, gate by gate, to the market.'
        : 'Simultaneous coupling: science, technology and market knowledge combine at once — no single start.';
  const only = b.model !== 'serendipity' ? ' (This control matters only under serendipity.)' : '';
  if (a.chance !== b.chance) return (b.chance ? 'An unexpected discovery happens.' : 'No unexpected discovery.') + only;
  if (a.knowledge !== b.knowledge) return (b.knowledge ? 'The person has previous knowledge in the area: a prepared mind.' : 'No previous knowledge in the area.') + only;
  if (a.stage !== b.stage) {
    const st = STAGES.find((x) => x.id === b.stage)!;
    return `Stage reached: ${st.name.toLowerCase()}${st.detail ? ` (${st.detail})` : ''}.` + (b.model !== 'linear' ? ' (This control matters only under the linear model.)' : '');
  }
  return '';
}

export default function ModelsOfInnovation() {
  return (
    <Simulation<S>
      label="Models of innovation: serendipity, linear and simultaneous coupling"
      terms={[
        { term: 'Serendipity', def: 'Unexpected discovery — it can look like luck — whose significance needs previous knowledge to recognise.' },
        { term: 'Linear model', def: 'Science and technology → technological developments → the needs of the market, through stage gates.' },
        { term: 'Simultaneous coupling', def: 'All the knowledge in the key components combined at once; where innovation begins is not known.' },
        { term: 'Gate', def: 'A checkpoint between stages of the linear model, each with an output such as a business plan.' },
      ]}
      initial={initial}
      controls={[
        { key: 'model', label: 'Model', type: 'select', options: [{ value: 'serendipity', label: 'Serendipity' }, { value: 'linear', label: 'Linear model' }, { value: 'coupling', label: 'Simultaneous coupling' }] },
        { key: 'chance', label: 'Serendipity: an unexpected discovery happens', type: 'toggle' },
        { key: 'knowledge', label: 'Serendipity: the person has previous knowledge in the area', type: 'toggle' },
        { key: 'stage', label: 'Linear model: stage reached', type: 'select', options: STAGES.map((x) => ({ value: x.id, label: x.name })) },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'In which model is the point where innovation begins not known?',
        options: [
          { text: 'Serendipity', why: 'Tempting because chance is unplanned, but we know where a serendipitous innovation began: the unexpected discovery.' },
          { text: 'The linear model', why: 'The linear model has a clear start — science and technology — and moves in order to the market.' },
          { text: 'Simultaneous coupling', correct: true, why: 'Coupling combines all the knowledge in the key components at once, so the slides say the starting point is not known.' },
        ],
      }}
    />
  );
}
