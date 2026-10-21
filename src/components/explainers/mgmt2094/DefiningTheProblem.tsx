/*
SCENE: How you define the problem — the problem statement as a cue to memory (Markman 2017)
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → switch the everyday cue, then the problem statement → watch which knowledge lights up → check
INTENT: A cue retrieves related things without effort; the statement of a problem is such a cue, so a specific
  statement (the vacuum bag) retrieves close knowledge, an abstract one (separate dirt from air) reaches distant
  knowledge (industrial cyclones), and several statements reach both.
SUBJECT: the statement box (the one accent stroke) and the arrows from it into the near and far columns of memory.
BEAT 1 (0–100%): selects change the cue and the statement; arrows and items fade between 100% and 30% (opacity only,
  180ms ease-out); verdict within 200ms.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: same controls; changes are instant fades.
BUDGET: < 6 KB gz, no WebGL.
Source: concept mgmt2094-w05-defining-the-problem; authorities mgmt2094-markman-2017-how-you-define-the-problem,
  mgmt2094-example-dyson-bagless-vacuum.
*/
import { Simulation, type SimView } from '../bases/Simulation';

type Statement = 'bag' | 'separate' | 'many';
type Cue = 'party' | 'salad';

interface S extends Record<string, unknown> {
  cue: Cue;
  statement: Statement;
}

const initial: S = { cue: 'party', statement: 'bag' };

const CUE: Record<Cue, { word: string; items: string }> = {
  party: { word: 'birthday party', items: 'hats · cake · singing' },
  salad: { word: 'salad', items: 'lettuce · tomatoes · dressing' },
};
const STATEMENT: Record<Statement, string> = {
  bag: '“Design a better vacuum bag”',
  separate: '“Separate the dirt from the air”',
  many: 'Several descriptions, specific and abstract',
};
const OUTCOME: Record<Statement, string> = {
  bag: '→ better bags: the long patent lists',
  separate: '→ a cyclone with no bag: Dyson',
  many: '→ close and distant knowledge together',
};
const NEAR = ['types of vacuum bags', 'bags as filters', 'patents on bags'];
const FAR = ['industrial cyclones', 'centrifugal force', 'many other ways'];

const ui = { fontFamily: 'var(--font-ui)', fill: 'var(--ink)' } as const;
const fade = { transition: 'opacity 180ms var(--ease-out)' } as const;

function Column({ x, title, sub, items, on }: { x: number; title: string; sub: string; items: string[]; on: boolean }) {
  return (
    <g style={fade} opacity={on ? 1 : 0.3}>
      <rect x={x} y="156" width="168" height="152" rx="10" fill={on ? 'var(--paper-3)' : 'none'} stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x={x + 12} y="178" {...ui} fontSize="11" letterSpacing="1">{title}</text>
      <text x={x + 12} y="195" {...ui} fontSize="11" fill="var(--ink-2)">{sub}</text>
      {items.map((it, k) => (
        <g key={it}>
          <circle cx={x + 18} cy={224 + k * 28} r="4" fill={on ? 'var(--ink)' : 'none'} stroke="var(--ink)" strokeWidth="1.5" />
          <text x={x + 30} y={228 + k * 28} fontFamily="var(--font-body)" fontSize="12" fill="var(--ink)">{it}</text>
        </g>
      ))}
    </g>
  );
}

function view(s: S): SimView {
  const near = s.statement !== 'separate';
  const far = s.statement !== 'bag';
  const figure = (
    <svg viewBox="0 0 360 352" role="img" aria-label={`Cue ${CUE[s.cue].word}; problem statement ${STATEMENT[s.statement]}; ${near ? 'close' : ''}${near && far ? ' and ' : ''}${far ? 'distant' : ''} knowledge retrieved`}>
      <text x="8" y="16" {...ui} fontSize="11" letterSpacing="1" fill="var(--ink-2)">A CUE RETRIEVES RELATED THINGS</text>
      <rect x="8" y="24" width="344" height="40" rx="8" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x="20" y="49" {...ui} fontSize="13">{CUE[s.cue].word}:</text>
      <text x="340" y="49" textAnchor="end" fontFamily="var(--font-body)" fontSize="13" fill="var(--ink-2)">{CUE[s.cue].items}</text>
      <text x="8" y="92" {...ui} fontSize="11" letterSpacing="1" fill="var(--ink-2)">THE PROBLEM STATEMENT IS THE CUE</text>
      <rect x="8" y="100" width="344" height="34" rx="8" fill="none" stroke="var(--accent)" strokeWidth="2" />
      <text x="180" y="122" textAnchor="middle" fontFamily="var(--font-body)" fontSize="14" fill="var(--ink)">{STATEMENT[s.statement]}</text>
      <g style={fade} opacity={near ? 1 : 0.15}>
        <line x1="150" y1="134" x2="92" y2="154" stroke="var(--ink)" strokeWidth="1.5" />
      </g>
      <g style={fade} opacity={far ? 1 : 0.15}>
        <line x1="210" y1="134" x2="268" y2="154" stroke="var(--ink)" strokeWidth="1.5" />
      </g>
      <Column x={8} title="CLOSE KNOWLEDGE" sub="vacuums and their bags" items={NEAR} on={near} />
      <Column x={184} title="DISTANT KNOWLEDGE" sub="separating particles" items={FAR} on={far} />
      <text x="180" y="336" textAnchor="middle" {...ui} fontSize="12">{OUTCOME[s.statement]}</text>
    </svg>
  );
  const verdict =
    s.statement === 'bag'
      ? 'A specific statement about the object: it retrieves closely related knowledge — bags, filters, patents. A radically new solution needs a new problem statement.'
      : s.statement === 'separate'
        ? 'An abstract statement of the goal: the bag drops out, and memory reaches distant knowledge — industrial cyclones that spin particles out of the air.'
        : 'Several descriptions, specific and abstract — what the most consistently creative people and groups do. Not "think outside the box": find more descriptions of the box.';
  return { figure, verdict, tone: s.statement === 'bag' ? 'open' : 'yes' };
}

function describe(a: S, b: S) {
  if (a.cue !== b.cue) return `New cue, new memories: "${CUE[b.cue].word}" brings ${CUE[b.cue].items.replace(/ · /g, ', ')} to mind without effort.`;
  if (b.statement === 'bag') return 'Focus on the bag and you are reminded of bags — which is why so many vacuum bags carry long lists of patent numbers.';
  if (b.statement === 'separate') return '"Separating dirt from air" does not mention the bag at all: the specific component is removed, so other ways of separating come to mind.';
  return 'There is no ideal problem statement: write specific ones for close knowledge and abstract ones for distant knowledge.';
}

export default function DefiningTheProblem() {
  return (
    <Simulation<S>
      label="How the problem statement cues memory: specific, abstract and several descriptions of the vacuum cleaner problem"
      terms={[
        { term: 'Cue', def: 'A piece of information that brings related things out of memory without effort.' },
        { term: 'Specific statement', def: 'Describes the objects being acted on (the vacuum bag); retrieves closely related knowledge.' },
        { term: 'Abstract statement', def: 'Describes the relationships or the goal (separate dirt from air); retrieves distantly related knowledge.' },
      ]}
      initial={initial}
      controls={[
        { key: 'cue', label: 'An everyday cue', type: 'select', options: [{ value: 'party', label: 'Birthday party' }, { value: 'salad', label: 'Salad' }] },
        { key: 'statement', label: 'How the vacuum problem is described', type: 'select', options: [
          { value: 'bag', label: 'Design a better vacuum bag (specific)' },
          { value: 'separate', label: 'Separate the dirt from the air (abstract)' },
          { value: 'many', label: 'Several descriptions, both kinds' },
        ] },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'A bank asks staff, "How do we make our branch queues shorter?" Which redescription is most likely to cue distant knowledge?',
        options: [
          { text: 'How do we add two more tellers to each branch?', why: 'This names more specific objects (tellers, branches), so it retrieves closely related knowledge.' },
          { text: 'How do customers get what they came for without waiting?', correct: true, why: 'It states the goal and drops the queue, as "separate dirt from air" dropped the bag, so it can cue distant knowledge.' },
          { text: 'How do we make the queue barriers more comfortable?', why: 'It still focuses on the queue itself, like focusing on the vacuum bag, so memory stays close to queues.' },
        ],
      }}
    />
  );
}
