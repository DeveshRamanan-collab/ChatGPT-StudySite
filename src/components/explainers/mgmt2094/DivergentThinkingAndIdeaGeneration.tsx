/*
SCENE: Divergent thinking and idea generation — a diamond that opens into many ideas and closes onto a shortlist
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → set the session's habits and phase → watch the ideas multiply or narrow → one check
INTENT: Generating and choosing follow different rules: while diverging, judging or debating kills ideas (step 3 of the
  reading's process; the creativity exercises); while converging, judgement is required but consensus and ownership
  are not (step 5). "Diverging, before converging."
SUBJECT: the number of idea dots in the upper half of the diamond, and the shortlist at its lower point.
BEAT 1 (0–100%): the phase select and four habit toggles; the dots and verdict update within 200ms. Dots fade by
  opacity only (CSS 180ms ease-out).
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical apart from the opacity fade; off mode shows the same controls.
BUDGET: < 6 KB gz, no WebGL.
Source: concept mgmt2094-w03-divergent-thinking-and-idea-generation (Week 3 creativity exercises, slides 2–13; reading
  p 12 steps 3 and 5; Deloitte, p 18).
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  phase: 'diverge' | 'converge';
  judging: boolean;
  oneConversation: boolean;
  consensus: boolean;
  ownership: boolean;
}

const initial: S = { phase: 'diverge', judging: true, oneConversation: true, consensus: false, ownership: false };

const W = 360;
const TOP = 16, MID = 150, BOT = 284;
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2 } as const;

// Dot positions inside the upper (diverging) half of the diamond, filled row by row from the top.
const SPOTS: [number, number][] = [];
for (let y = 46; y <= 136; y += 18) {
  const half = ((y - TOP) / (MID - TOP)) * 150 - 14;
  for (let x = 180 - half; x <= 180 + half + 0.1; x += 20) SPOTS.push([Math.round(x), y]);
}

function generated(s: S) {
  if (s.judging) return 3;
  return s.oneConversation ? SPOTS.length : Math.round(SPOTS.length * 0.45);
}

function view(s: S): SimView {
  const n = generated(s);
  const conv = s.phase === 'converge';
  const choseWell = conv && s.judging && !s.consensus && !s.ownership;
  const figure = (
    <svg viewBox={`0 0 ${W} 300`} role="img" aria-label={`${conv ? 'Converging' : 'Diverging'}: ${n} ideas generated${conv ? ', narrowing to a shortlist of three' : ''}`}>
      <path d={`M180 ${TOP} L16 ${MID} L344 ${MID} Z`} fill="none" stroke={conv ? 'var(--ink-3)' : 'var(--ink)'} strokeWidth="1.5" />
      <path d={`M16 ${MID} L180 ${BOT} L344 ${MID}`} fill="none" stroke={conv ? 'var(--ink)' : 'var(--ink-3)'} strokeWidth="1.5" strokeDasharray={conv ? undefined : '6 6'} />
      <text x="16" y="34" {...head} fill={conv ? 'var(--ink-3)' : 'var(--ink)'}>DIVERGE</text>
      <text x="16" y="276" {...head} fill={conv ? 'var(--ink)' : 'var(--ink-3)'}>CONVERGE</text>
      {SPOTS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill="none" stroke="var(--ink-2)" strokeWidth="1.5"
          style={{ opacity: i < n ? (conv ? 0.35 : 1) : 0, transition: 'opacity 180ms var(--ease-out)' }} />
      ))}
      <text x="344" y="34" textAnchor="end" fontFamily="var(--font-ui)" fontSize="13" fill="var(--ink-2)">{n} ideas</text>
      {[160, 180, 200].map((x, i) => (
        <circle key={x} cx={x} cy="206" r="6" fill="none" stroke="var(--ink)" strokeWidth="1.5"
          style={{ opacity: conv ? 1 : 0, transition: 'opacity 180ms var(--ease-out)' }} data-shortlist={i} />
      ))}
      <circle cx="180" cy="252" r="8" fill="none" stroke="var(--accent)" strokeWidth="2.5"
        style={{ opacity: choseWell ? 1 : 0, transition: 'opacity 180ms var(--ease-out)' }} />
    </svg>
  );
  let verdict: string;
  let tone: SimView['tone'];
  if (!conv) {
    if (s.judging) { tone = 'no'; verdict = 'Judging while generating: ideas die as they appear. The reading says do not judge or debate ideas (step 3).'; }
    else if (!s.oneConversation) { tone = 'open'; verdict = 'Several conversations at once: ideas get lost. Hold one conversation at a time and log the session.'; }
    else { tone = 'yes'; verdict = 'Diverging well: as many ideas as possible, no judging, one conversation at a time.'; }
  } else if (!s.judging) {
    tone = 'open'; verdict = 'Converging needs judgement: review the objective and select the powerful ideas (step 5).';
  } else if (s.consensus) {
    tone = 'no'; verdict = 'Choosing the idea most people like is consensus thinking — step 5 says avoid it; the most practical idea isn’t always the best.';
  } else if (s.ownership) {
    tone = 'no'; verdict = 'Ideas defended by their owners: set aside emotion and ownership of ideas when choosing.';
  } else {
    tone = 'yes'; verdict = 'Diverging, before converging: many ideas first, then a rational choice against the objective.';
  }
  return { figure, verdict, tone };
}

function describe(a: S, b: S) {
  if (a.phase !== b.phase) return b.phase === 'converge' ? 'Converging: narrow the ideas to a shortlist and choose rationally.' : 'Diverging: generate many different ideas in a short time.';
  if (a.judging !== b.judging) return b.judging ? 'Judging switched on: fatal while generating, essential while choosing.' : 'Judgement deferred: right while generating, missing while choosing.';
  if (a.oneConversation !== b.oneConversation) return b.oneConversation ? 'One conversation at a time: every idea is heard and logged.' : 'Several conversations at once: ideas are lost in the noise.';
  if (a.consensus !== b.consensus) return b.consensus ? 'Picking the crowd favourite: consensus thinking (matters when converging).' : 'No consensus vote: the objective decides.';
  if (a.ownership !== b.ownership) return b.ownership ? 'Each person defends their own idea: ownership clouds the choice (matters when converging).' : 'Ownership set aside: ideas are judged on their merits.';
  return '';
}

export default function DivergentThinkingAndIdeaGeneration() {
  return (
    <Simulation<S>
      label="Diverging into many ideas, then converging onto a shortlist"
      terms={[
        { term: 'Divergent thinking', def: 'Generating many different ideas about a topic in a short period of time.' },
        { term: 'Converging', def: 'Narrowing the ideas down and choosing — rationally, against the objective.' },
        { term: 'Consensus thinking', def: 'Choosing what most people agree on; the reading says avoid it when choosing.' },
      ]}
      initial={initial}
      controls={[
        { key: 'phase', label: 'Phase', type: 'select', options: [{ value: 'diverge', label: 'Diverging: generating ideas' }, { value: 'converge', label: 'Converging: choosing' }] },
        { key: 'judging', label: 'Judge or debate ideas', type: 'toggle' },
        { key: 'oneConversation', label: 'One conversation at a time', type: 'toggle' },
        { key: 'consensus', label: 'Pick the idea most people like', type: 'toggle' },
        { key: 'ownership', label: 'People defend their own ideas', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'After a 120-second idea burst, the team spends 120 seconds listing why the ideas will NOT work. Is that allowed?',
        options: [
          { text: 'No — the reading says ideas must never be judged', why: 'Step 3 bans judging while generating, but step 5 requires rational judgement when choosing; the rule is about timing.' },
          { text: 'Yes — as a separate round, after the ideas are generated', correct: true, why: 'The exercises run the “won’t work” round after the idea round on the same problem: generating and judging are kept apart.' },
          { text: 'Yes — judging is how divergent thinking produces variety', why: 'Judging is convergent work; divergent thinking defers it so that many ideas survive.' },
        ],
      }}
    />
  );
}
