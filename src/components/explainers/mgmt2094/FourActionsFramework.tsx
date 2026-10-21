/*
SCENE: The four actions framework — redrawing Yellow Tail's strategy canvas
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → toggle eliminate / reduce / raise / create → watch Yellow Tail's curve leave both groups → one check
INTENT: Each of the four actions moves specific factors on the strategy canvas; together they take Yellow Tail off the
  budget curve and onto a value curve unlike premium or budget wine, with three factors the industry never offered.
SUBJECT: Yellow Tail's curve (the heavy ink line) against the premium (thin) and budget (dashed) curves.
BEAT 1 (0–100%): four toggles; each redraws Yellow Tail's curve, which fades in (180ms opacity, ease-out); the
  verdict updates within 200ms.
CAMERA: none (2D SVG; the canvas is turned sideways — factors as rows, level left to right — so labels stay legible on
  phones). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (the only motion is an opacity fade).
BUDGET: < 5 KB gz, no WebGL.
Source: concept mgmt2094-w11-four-actions-framework (Week 11 slides 9–14: the pre-entry and post-entry canvases, the
  four action questions and the eliminate/reduce/raise/create grid); example yellow-tail. Levels are read approximately
  off the slide charts (no numbers are given there). The starting curve treats Yellow Tail as a budget wine, as the
  lecture describes it. Retail store involvement (raised) is not one of the factors plotted on the slide's canvas.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  eliminate: boolean;
  reduce: boolean;
  raise: boolean;
  create: boolean;
}

const initial: S = { eliminate: false, reduce: false, raise: false, create: false };
const W = 360;
const ui = { fontFamily: 'var(--font-ui)' } as const;
const FACTORS = ['Price', 'Terminology', 'Marketing', 'Ageing', 'Vineyard prestige', 'Wine complexity', 'Wine range'];
const NEW = ['Easy drinking', 'Ease of selection', 'Fun and adventure'];
const PREMIUM = [3.5, 3.1, 3.5, 3.4, 3.6, 3.4, 3.7];
const BUDGET = [0.8, 2.0, 1.2, 1.1, 1.2, 1.4, 1.7];
const X0 = 140;
const px = (level: number) => X0 + level * 50;
const rowY = (i: number) => 48 + i * 26 + (i >= 7 ? 16 : 0);
const ACTIONS = ['eliminate', 'reduce', 'raise', 'create'] as const;

function yellowTail(s: S) {
  const v = [...BUDGET];
  if (s.eliminate) [1, 2, 3].forEach((i) => { v[i] = 0.25; });
  if (s.reduce) { v[4] = 0.8; v[5] = 0.8; v[6] = 1.2; }
  if (s.raise) v[0] = 1.8;
  return s.create ? [...v, 2.9, 3.1, 3.2] : v;
}

const line = (vals: number[]) => vals.map((l, i) => `${px(l)},${rowY(i)}`).join(' ');

function view(s: S): SimView {
  const yt = yellowTail(s);
  const figure = (
    <svg viewBox={`0 0 ${W} 360`} role="img" aria-label={`Strategy canvas turned sideways: factors as rows, level from low to high. Premium wine high on every factor, budget wine low; Yellow Tail's curve with ${ACTIONS.filter((a) => s[a]).join(', ') || 'no actions'} applied`}>
      <text x={X0} y="26" {...ui} fontSize="11" fill="var(--ink-2)">low</text>
      <text x={px(4)} y="26" textAnchor="end" {...ui} fontSize="11" fill="var(--ink-2)">high</text>
      <line x1={X0} y1="34" x2={X0} y2={rowY(9) + 8} stroke="var(--line)" strokeWidth="1" />
      {[...FACTORS, ...NEW].map((f, i) => {
        const created = i < 7 || s.create;
        return (
          <g key={f}>
            <line x1={X0} y1={rowY(i)} x2={px(4)} y2={rowY(i)} stroke="var(--line)" strokeWidth="1" />
            <text x="128" y={rowY(i) + 4} textAnchor="end" {...ui} fontSize="13" fill={created ? 'var(--ink)' : 'var(--ink-3)'}>{f}</text>
          </g>
        );
      })}
      <line x1="8" y1={rowY(7) - 24} x2={px(4)} y2={rowY(7) - 24} stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="4 4" />
      <text x="8" y={rowY(7) - 11} {...ui} fontSize="10" letterSpacing="1" fill="var(--ink-2)">NEVER OFFERED BY THE INDUSTRY</text>
      <polyline points={line(PREMIUM)} fill="none" stroke="var(--ink-2)" strokeWidth="1.2" />
      {PREMIUM.map((l, i) => <circle key={`p${i}`} cx={px(l)} cy={rowY(i)} r="2.5" fill="var(--ink-2)" />)}
      <g key={ACTIONS.map((a) => (s[a] ? 1 : 0)).join('')} style={{ animation: 'fade-in 180ms var(--ease-out) both' }}>
        <polyline points={line(yt)} fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
        {yt.map((l, i) => {
          const gone = s.eliminate && i >= 1 && i <= 3;
          return <circle key={`y${i}`} cx={px(l)} cy={rowY(i)} r="4.5" fill={gone ? 'var(--paper)' : 'var(--ink)'} stroke="var(--ink)" strokeWidth="1.5" />;
        })}
      </g>
      {/* Budget drawn over Yellow Tail so it stays visible where the two curves coincide. */}
      <polyline points={line(BUDGET)} fill="none" stroke="var(--ink-3)" strokeWidth="1.4" strokeDasharray="5 4" />
      {BUDGET.map((l, i) => <circle key={`b${i}`} cx={px(l)} cy={rowY(i)} r="2.5" fill="var(--ink-3)" />)}
      <g transform={`translate(8 ${rowY(9) + 34})`}>
        <line x1="0" y1="0" x2="22" y2="0" stroke="var(--ink-2)" strokeWidth="1.2" />
        <text x="28" y="4" {...ui} fontSize="11" fill="var(--ink-2)">premium</text>
        <line x1="96" y1="0" x2="118" y2="0" stroke="var(--ink-3)" strokeWidth="1.2" strokeDasharray="5 4" />
        <text x="124" y="4" {...ui} fontSize="11" fill="var(--ink-2)">budget</text>
        <line x1="184" y1="0" x2="206" y2="0" stroke="var(--ink)" strokeWidth="2.5" />
        <text x="212" y="4" {...ui} fontSize="11" fill="var(--ink)">Yellow Tail</text>
      </g>
    </svg>
  );
  const done = ACTIONS.filter((a) => s[a]);
  const todo = ACTIONS.filter((a) => !s[a]);
  if (!done.length)
    return { figure, tone: 'open', verdict: "Yellow Tail starts on the budget curve: competing on the industry's own factors, it is just another budget wine." };
  if (!todo.length)
    return { figure, tone: 'yes', verdict: "All four actions: Yellow Tail's curve breaks away from both premium and budget wine — the curve it entered the US market with." };
  const list = (xs: readonly string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}` : xs[0]);
  const applied = list(done);
  return { figure, tone: 'open', verdict: `${applied[0].toUpperCase()}${applied.slice(1)} applied. Yellow Tail used all four actions; ${list(todo)} still to go.` };
}

function describe(a: S, b: S) {
  if (a.eliminate !== b.eliminate)
    return b.eliminate ? 'Eliminate: enological terminology, ageing qualities and above-the-line marketing — factors the industry took for granted — drop to the floor.' : 'Terminology, ageing and marketing are back at the budget level.';
  if (a.reduce !== b.reduce)
    return b.reduce ? "Reduce: vineyard prestige, wine complexity and wine range fall well below the industry's standards." : 'Vineyard prestige, complexity and range are back at the budget level.';
  if (a.raise !== b.raise)
    return b.raise ? 'Raise: price lifts above budget wine (not to premium). Retail store involvement, also raised, is not plotted on the slide\'s canvas.' : 'Price is back at the budget level.';
  if (a.create !== b.create)
    return b.create ? 'Create: easy drinking, ease of selection, and fun and adventure — factors the industry had never offered — appear high on the curve.' : 'The three created factors disappear: the industry never offered them.';
  return '';
}

export default function FourActionsFramework() {
  return (
    <Simulation<S>
      label="Yellow Tail's strategy canvas and the four actions"
      terms={[
        { term: 'Strategy canvas', def: 'A chart of how high each competitor sits on each factor the industry competes on.' },
        { term: 'Value curve', def: "One competitor's line across those factors." },
        { term: 'Four actions', def: 'Eliminate, reduce, raise, create: what to drop, cut back, lift and add.' },
        { term: 'Non-customers', def: 'People outside the market now; Kim and Mauborgne say to shift focus to them and to alternatives.' },
      ]}
      initial={initial}
      controls={[
        { key: 'eliminate', label: 'Eliminate: terminology, ageing, above-the-line marketing', type: 'toggle' },
        { key: 'reduce', label: 'Reduce: vineyard prestige, complexity, range', type: 'toggle' },
        { key: 'raise', label: 'Raise: price versus budget wine, retail involvement', type: 'toggle' },
        { key: 'create', label: 'Create: easy drinking, ease of selection, fun and adventure', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Which of the four actions gave Yellow Tail "fun and adventure"?',
        options: [
          { text: 'Raise', why: 'Tempting because the factor scores high, but raise lifts a factor the industry already offers; fun and adventure was new.' },
          { text: 'Create', correct: true, why: 'Create adds factors the industry has never offered: easy drinking, ease of selection, and fun and adventure.' },
          { text: 'Reduce', why: 'Reduce cut vineyard prestige, complexity and range well below the standard; it never adds anything.' },
        ],
      }}
    />
  );
}
