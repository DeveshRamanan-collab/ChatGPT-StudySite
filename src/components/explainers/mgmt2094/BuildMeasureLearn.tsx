/*
SCENE: Build–measure–learn — run one experiment round the loop
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → set the hypothesis, what is built and what the measure shows → watch the loop decide → one check
INTENT: Show that a lean start-up experiment only teaches something if its hypothesis is falsifiable (quantified,
  timeboxed); that the result is documented as validated, invalidated or inconclusive; that Learn ends in persevere
  or pivot; and that building the MVP rather than everything keeps the time through the loop short.
SUBJECT: the Learn node and the exit it lights (persevere or pivot); the loop-time bar beneath.
BEAT 1 (0–100%): three selects; the outcome word, the lit exit and the loop-time bar (transform: scaleX, 240ms
  ease-in-out, full motion only) update within 200ms with a verdict line.
CAMERA: none (SVG + HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: calm/off — the bar jumps; verdict identical.
BUDGET: < 6 KB gz, no WebGL.
Source: concept mgmt2094-w10-build-measure-learn; slides 7, 9–14 and 21 (core elements, validated learning,
  innovation accounting report, pivot or persevere). The laundry pick-up hypothesis is the spec's own illustrative
  scenario (short answer q793), not a source example.
*/
import { Simulation, type SimView } from '../bases/Simulation';
import { useExplainer } from '../context';

interface S extends Record<string, unknown> {
  hypothesis: 'quantified' | 'vague';
  build: 'mvp' | 'full';
  result: 'beats' | 'short' | 'close';
}

const initial: S = { hypothesis: 'quantified', build: 'mvp', result: 'short' };

const HYP = {
  quantified: '“If 300 students in one residence see the sign-up page for three weeks, at least 40 will subscribe.”',
  vague: '“Students will like a laundry pick-up service.”',
};

type Outcome = 'validated' | 'invalidated' | 'inconclusive' | 'not testable';

function outcome(s: S): Outcome {
  if (s.hypothesis === 'vague') return 'not testable';
  return s.result === 'beats' ? 'validated' : s.result === 'short' ? 'invalidated' : 'inconclusive';
}

function Loop({ s }: { s: S }) {
  const { motion } = useExplainer();
  const o = outcome(s);
  const exit = o === 'validated' ? 'persevere' : o === 'invalidated' ? 'pivot' : null;
  const node = (x: number, y: number, label: string, sub: string) => (
    <g>
      <circle cx={x} cy={y} r="34" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={x} y={y + 5} textAnchor="middle" fontFamily="var(--font-ui)" fontSize="14" fontWeight="600" fill="var(--ink)">{label}</text>
      <text x={x} y={y + 54} textAnchor="middle" fontFamily="var(--font-ui)" fontSize="12.5" fill="var(--ink-2)">{sub}</text>
    </g>
  );
  const tag = (x: number, label: string, on: boolean, tone: string) => (
    <g data-exit={label} data-on={on || undefined}>
      <rect x={x} y="300" width="104" height="30" rx="15" fill="var(--paper)" stroke={on ? tone : 'var(--ink-3)'} strokeWidth={on ? 2.5 : 1.2} style={{ transition: 'stroke 180ms var(--ease-out)' }} />
      <text x={x + 52} y="320" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="13" fill={on ? 'var(--ink)' : 'var(--ink-2)'}>{label}</text>
    </g>
  );
  return (
    <div style={{ display: 'grid', gap: 'var(--s-3)', fontFamily: 'var(--font-ui)' }}>
      <p style={{ margin: 0, fontSize: 'var(--t-sm)', color: 'var(--ink)' }}>
        <span style={{ color: 'var(--ink-2)' }}>Hypothesis: </span>{HYP[s.hypothesis]}
      </p>
      <svg viewBox="0 0 360 340" role="img" aria-label={`Build, measure, learn loop. Outcome: ${o}${exit ? `; exit: ${exit}` : ''}.`}>
        <defs>
          <marker id="bml-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="var(--ink-3)" />
          </marker>
        </defs>
        <line x1="208" y1="58" x2="276" y2="176" stroke="var(--ink-3)" strokeWidth="1.5" markerEnd="url(#bml-arrow)" />
        <text x="262" y="110" fontFamily="var(--font-ui)" fontSize="12" fill="var(--ink-2)">baseline</text>
        <line x1="262" y1="214" x2="98" y2="214" stroke="var(--ink-3)" strokeWidth="1.5" markerEnd="url(#bml-arrow)" />
        <text x="180" y="206" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="12" fill="var(--ink-2)">analyse</text>
        <line x1="84" y1="176" x2="152" y2="58" stroke="var(--ink-3)" strokeWidth="1.5" markerEnd="url(#bml-arrow)" />
        <text x="44" y="110" fontFamily="var(--font-ui)" fontSize="12" fill="var(--ink-2)">hypothesis</text>
        {node(180, 36, 'Build', s.build === 'mvp' ? 'the MVP' : 'everything')}
        {node(290, 214, 'Measure', 'results = data')}
        {node(70, 214, 'Learn', o)}
        {tag(20, 'persevere', exit === 'persevere', 'var(--sage)')}
        {tag(236, 'pivot', exit === 'pivot', 'var(--clay)')}
      </svg>
      <div>
        <p style={{ margin: '0 0 var(--s-1)', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>time through the loop</p>
        <div style={{ height: '8px', borderRadius: 'var(--r-pill)', background: 'var(--paper-3)', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--ink-2)', transformOrigin: 'left center', transform: `scaleX(${s.build === 'mvp' ? 0.3 : 1})`, transition: motion === 'full' ? 'transform 240ms var(--ease-inout)' : 'none' }} />
        </div>
      </div>
    </div>
  );
}

function view(s: S): SimView {
  const o = outcome(s);
  const slow = s.build === 'full' ? ' Building everything first stretches the time through the loop; the slides say minimise it.' : '';
  const figure = <Loop s={s} />;
  if (o === 'not testable')
    return { figure, verdict: `Not falsifiable: with no number or timebox, no result can validate or invalidate it. Quantify the goal and set a scope/timebox, then test.${slow}`, tone: 'open' };
  if (o === 'validated')
    return { figure, verdict: `Validated: persevere — document the learning and move to the next experiment.${slow}`, tone: 'yes' };
  if (o === 'invalidated')
    return { figure, verdict: `Invalidated: document it and consider a pivot — a course correction to the hypotheses, based on market learnings.${slow}`, tone: 'no' };
  return { figure, verdict: `Inconclusive: document it as inconclusive; the next action is another experiment.${slow}`, tone: 'open' };
}

function describe(a: S, b: S) {
  if (a.hypothesis !== b.hypothesis) return b.hypothesis === 'quantified' ? 'A falsifiable hypothesis: a number and a timebox, so a result can disprove it.' : 'A vague hypothesis: nothing the market does could disprove it.';
  if (a.build !== b.build) return b.build === 'mvp' ? 'Build the simplest thing that measures it — the MVP is a “build faster” tactic.' : 'Build the whole service first: more to build before anything can be measured.';
  if (a.result !== b.result) return b.result === 'beats' ? 'The data beat the target set in advance.' : b.result === 'short' ? 'The data fell well short of the target set in advance.' : 'The data are too close or too thin to call.';
  return '';
}

export default function BuildMeasureLearn() {
  return (
    <Simulation<S>
      label="One experiment run round the build, measure, learn loop"
      terms={[
        { term: 'Falsifiable hypothesis', def: 'A prediction a result could disprove: quantified goal, set scope and timebox.' },
        { term: 'Minimum viable product', def: 'The simplest thing to build to measure what you need to learn.' },
        { term: 'Validated learning', def: 'What do we need to learn? How can we measure it? What is the simplest thing to build?' },
        { term: 'Pivot', def: 'A course correction to the proposed set of hypotheses, based on market learnings.' },
      ]}
      initial={initial}
      controls={[
        { key: 'hypothesis', label: 'Hypothesis', type: 'select', options: [{ value: 'quantified', label: 'Falsifiable: a number and a timebox' }, { value: 'vague', label: 'Vague: “students will like it”' }] },
        { key: 'build', label: 'What we build', type: 'select', options: [{ value: 'mvp', label: 'The simplest thing that measures it (MVP)' }, { value: 'full', label: 'The full service, every feature' }] },
        { key: 'result', label: 'What the measure shows', type: 'select', options: [{ value: 'beats', label: 'Beats the target' }, { value: 'short', label: 'Falls well short of the target' }, { value: 'close', label: 'Too close, or too few users, to tell' }] },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'An MVP falls well short of a quantified, timeboxed target. What does the loop suggest?',
        options: [
          { text: 'Persevere unchanged: one experiment never tells you anything', why: 'The target was set in advance and missed, so the learning is invalidated; persevering ignores it.' },
          { text: 'Record it as invalidated and consider a pivot', correct: true, why: 'Learning is documented as validated, invalidated or inconclusive; an invalidated hypothesis calls for a course correction — a pivot.' },
          { text: 'Add features and launch the final product', why: 'More features without a new hypothesis skips Learn; the slides build through MVPs, not past them.' },
        ],
      }}
    />
  );
}
