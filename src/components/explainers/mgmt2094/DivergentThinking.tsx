/*
SCENE: Divergent thinking and the quota method
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → change how many ideas are on the table → watch the fan of options and the verdict → one check
INTENT: Show the quota rule as a threshold: below three ideas a decision is "linear thinking" (settling for the
  first idea) unless you refuse to decide; at three or more, many more generally follow — unless ideas are judged
  as they are said, which brings convergent evaluation into the divergent step.
SUBJECT: the fan of idea lines leaving the problem node; faint extra ideas appear once the quota is met.
BEAT 1 (0–100%): a select for the number of ideas (1–6) and two toggles; the fan and verdict redraw within 200ms.
  Ease: CSS 180ms ease-out on opacity only.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical controls; no motion beyond opacity.
BUDGET: < 5 KB gz, no WebGL.
Source: concept mgmt2094-w02-divergent-thinking; week 2 lecture slide 5 (quota method) and slide 10 (brainstorming,
  Alex Osborne, BBDO) via content-src/mgmt2094-w02.yaml. "Many more" is drawn as unnumbered faint dots: the slide
  gives no count.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  ideas: string;
  refuse: boolean;
  judge: boolean;
}

const initial: S = { ideas: '1', refuse: false, judge: false };
const soft = { transition: 'opacity 180ms var(--ease-out)' };

function view(s: S): SimView {
  const n = Number(s.ideas);
  const met = n >= 3;
  const ys = Array.from({ length: n }, (_, k) => 112 + (k - (n - 1) / 2) * 30);
  const more = met && !s.judge;
  const figure = (
    <svg viewBox="0 0 360 250" role="img" style={{ maxWidth: 520, margin: '0 auto' }}
      aria-label={`A problem with ${n} idea${n === 1 ? '' : 's'} branching from it${s.judge ? ', all but the first cut on the spot' : ''}${more ? ', and more ideas following' : ''}`}>
      <circle cx="44" cy="112" r="15" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="44" y="146" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="12.5" fill="var(--ink-2)">problem</text>
      {ys.map((y, k) => {
        const cut = s.judge && k > 0;
        return (
          <g key={k} data-idea={k + 1} data-cut={cut || undefined}>
            <path d={`M59 112 C 110 112, 130 ${y}, 186 ${y}`} fill="none" stroke={cut ? 'var(--ink-3)' : 'var(--ink)'} strokeWidth="1.5" strokeDasharray={cut ? '4 4' : undefined} />
            <circle cx="192" cy={y} r="6" fill={cut ? 'var(--paper)' : 'var(--ink)'} stroke={cut ? 'var(--ink-3)' : 'var(--ink)'} strokeWidth="1.5" />
            <text x="206" y={y + 4} fontFamily="var(--font-ui)" fontSize="12.5" fill={cut ? 'var(--ink-3)' : 'var(--ink-2)'}>{cut ? 'cut on the spot' : `idea ${k + 1}`}</text>
          </g>
        );
      })}
      <g style={{ ...soft, opacity: more ? 1 : 0 }} data-part="many-more" aria-hidden={!more}>
        {[0, 1, 2, 3, 4].map((k) => (
          <circle key={k} cx={300 + (k % 2) * 16} cy={70 + k * 20} r="4" fill="none" stroke="var(--ink-3)" strokeWidth="1.2" />
        ))}
        <text x="308" y="186" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="12" fill="var(--ink-2)">many more</text>
      </g>
      <line x1="20" y1="214" x2="340" y2="214" stroke="var(--line)" strokeWidth="1" />
      <text x="20" y="238" fontFamily="var(--font-ui)" fontSize="13" fill="var(--ink)">
        {met ? 'Quota met: at least three ideas' : s.refuse ? `Quota not met — decision held (${n} of 3)` : `Decision taken on ${n} idea${n === 1 ? '' : 's'}`}
      </text>
    </svg>
  );
  let verdict: string;
  let tone: SimView['tone'];
  if (!met && !s.refuse) {
    verdict = `Linear thinking: deciding on ${n === 1 ? 'the first idea' : 'two ideas'} settles too early. The quota asks for at least three ideas — or refuse to decide.`;
    tone = 'no';
  } else if (!met) {
    verdict = 'Right move: with fewer than three ideas, refuse to decide and keep diverging — different options, alternate solutions.';
    tone = 'open';
  } else if (s.judge) {
    verdict = 'Three or more ideas, but judging each as it is said is censorship: evaluation belongs to convergent thinking, afterwards.';
    tone = 'no';
  } else {
    verdict = 'Quota met. When at least three good ideas have been found, many more are generally found — then hand over to convergent thinking.';
    tone = 'yes';
  }
  return { figure, verdict, tone };
}

function describe(a: S, b: S) {
  if (a.ideas !== b.ideas) {
    const n = Number(b.ideas);
    return n >= 3 ? `${n} ideas on the table: the quota of three is met.` : `${n} idea${n === 1 ? '' : 's'} on the table: below the quota of three.`;
  }
  if (a.refuse !== b.refuse) return b.refuse ? 'Refusing to decide: the slide’s answer when alternatives are missing.' : 'No longer refusing: a decision can now be taken on whatever is on the table.';
  if (a.judge !== b.judge) return b.judge ? 'Ideas are now judged as they are said — the opposite of brainstorming without censorship.' : 'Judgement deferred: ideas are analysed and prioritised afterwards.';
  return '';
}

export default function DivergentThinking() {
  return (
    <Simulation<S>
      label="Divergent thinking: how many ideas before deciding?"
      terms={[
        { term: 'Divergent thinking', def: 'The second step of creative problem solving: find solutions.' },
        { term: 'Linear thinking', def: 'Settling for the first idea; logical reasoning that locks you in the first solution.' },
        { term: 'Quota method', def: 'Always ask at least three ideas from your team (& yourself!) — or refuse to decide.' },
        { term: 'Without censorship', def: 'The brainstorming rule: generate first, analyse and prioritise afterwards.' },
      ]}
      initial={initial}
      controls={[
        { key: 'ideas', label: 'Ideas on the table before deciding', type: 'select', options: ['1', '2', '3', '4', '5', '6'].map((v) => ({ value: v, label: v === '1' ? '1 idea' : `${v} ideas` })) },
        { key: 'refuse', label: 'Refuse to decide until there are at least three', type: 'toggle' },
        { key: 'judge', label: 'Judge each idea as soon as it is said', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Only one idea is on the table and the client wants an answer today. What does the quota method say?',
        options: [
          { text: 'Decide now: logic has already shown the first idea is best', why: 'That is the logical reasoning that locks you in the first solution — the linear thinking the quota breaks.' },
          { text: 'Ask for at least three ideas — or refuse to decide', correct: true, why: 'The quota slide: always ask at least three ideas from your team (& yourself!), or refuse to decide.' },
          { text: 'Score the one idea on benefits and risks, then decide', why: 'That is convergent thinking, and with a single idea there is nothing to choose between.' },
        ],
      }}
    />
  );
}
