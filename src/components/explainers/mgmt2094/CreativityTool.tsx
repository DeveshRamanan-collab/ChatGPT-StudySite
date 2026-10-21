/*
SCENE: The creativity tool — applying a prompt to a floor covering
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → pick a prompt (or just add an adjective) → see it applied to the product → one check
INTENT: The tool's four columns (Try to, Make it, Add or subtract, Imagine that you) each push a change in the product
  itself; just adding an adjective like "soft" or "blue" leaves the product unchanged, which the exercise rules out.
SUBJECT: the floor covering box in the middle; the active column carries the one accent outline, and the line below
  shows what the prompt makes of the product.
BEAT 1 (0–100%): one select (16 prompts, four per column) and one toggle; the column highlight, the applied prompt and
  the verdict update within 200ms. No movement: states swap instantly.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (no motion at all).
BUDGET: < 7 KB gz, no WebGL.
Source: concept mgmt2094-w06-creativity-tool (Week 6 tutorial slides 2–4); authority
  mgmt2094-example-floor-company-exercise. Worked ideas only where the week spec gives one (q707 inflate it, q708
  springs, q714 can make yourself smaller); every other prompt is shown as a question, not as an invented idea.
*/
import { Simulation, type SimView } from '../bases/Simulation';

type Col = 'try' | 'make' | 'add' | 'imagine';
const COLS: { key: Col; title: string }[] = [
  { key: 'try', title: 'TRY TO' },
  { key: 'make', title: 'MAKE IT' },
  { key: 'add', title: 'ADD OR SUBTRACT' },
  { key: 'imagine', title: 'IMAGINE THAT YOU' },
];

interface Prompt { id: string; col: Col; word: string; apply: string; idea?: string }
const PROMPTS: Prompt[] = [
  { id: 'roll', col: 'try', word: 'roll it', apply: 'What if you could roll the floor covering?' },
  { id: 'inflate', col: 'try', word: 'inflate it', apply: 'What if the floor covering could inflate?', idea: 'a floor covering that inflates into a guest mattress' },
  { id: 'stack', col: 'try', word: 'stack it', apply: 'What if floor coverings could be stacked?' },
  { id: 'melt', col: 'try', word: 'melt it', apply: 'What if the floor covering could melt?' },
  { id: 'transparent', col: 'make', word: 'transparent', apply: 'What if the floor covering were transparent?' },
  { id: 'sticky', col: 'make', word: 'sticky', apply: 'What if the floor covering were sticky?' },
  { id: 'popup', col: 'make', word: 'pop up', apply: 'What if the floor covering could pop up?' },
  { id: 'flicker', col: 'make', word: 'flicker', apply: 'What if the floor covering could flicker?' },
  { id: 'springs', col: 'add', word: 'springs', apply: 'What if you added springs to the floor covering?', idea: 'a floor covering with built-in springs that cushion each step' },
  { id: 'nets', col: 'add', word: 'nets', apply: 'What if you added nets to the floor covering?' },
  { id: 'gears', col: 'add', word: 'gears', apply: 'What if you added gears to the floor covering?' },
  { id: 'time', col: 'add', word: 'time', apply: 'What if you added, or subtracted, time?' },
  { id: 'smaller', col: 'imagine', word: 'can make yourself smaller', apply: 'Imagine that you can make yourself smaller.', idea: 'a floor covering showing tiny paths and landscapes seen from above' },
  { id: 'problem', col: 'imagine', word: 'are the problem', apply: 'Imagine that you are the problem. What floor covering follows?' },
  { id: 'minds', col: 'imagine', word: 'can read minds', apply: 'Imagine that you can read minds. What floor covering would people want?' },
  { id: 'money', col: 'imagine', word: 'have unlimited money', apply: 'Imagine that you have unlimited money. What would you make?' },
];
const byId = (id: string) => PROMPTS.find((p) => p.id === id) ?? PROMPTS[0];
const colTitle = (c: Col) => COLS.find((x) => x.key === c)!.title.toLowerCase().replace(/^./, (m) => m.toUpperCase());

interface S extends Record<string, unknown> { prompt: string; adjective: boolean }
const initial: S = { prompt: 'inflate', adjective: false };

function wrap(s: string, max: number) {
  const out: string[] = [];
  let line = '';
  for (const w of s.split(' ')) {
    if ((line + ' ' + w).trim().length > max) { out.push(line); line = w; } else line = (line + ' ' + w).trim();
  }
  if (line) out.push(line);
  return out;
}

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11.5, letterSpacing: 1 } as const;
const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5 } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14 } as const;

function view(s: S): SimView {
  const p = byId(s.prompt);
  const active = s.adjective ? null : p.col;
  const out = s.adjective ? ['a soft, blue floor covering'] : wrap(p.idea ? `→ ${p.idea}` : p.apply, 40);
  const figure = (
    <svg viewBox={`0 0 ${W} 360`} role="img" aria-label={s.adjective ? 'Just adding an adjective: the floor covering is unchanged' : `Prompt ${p.word} from the ${colTitle(p.col)} column applied to a floor covering`}>
      {COLS.map((c, i) => {
        const x = 8 + (i % 2) * 176;
        const y = 8 + Math.floor(i / 2) * 96;
        const on = c.key === active;
        const words = PROMPTS.filter((q) => q.col === c.key);
        return (
          <g key={c.key} data-col={c.key} data-on={on || undefined}>
            <rect x={x} y={y} width="168" height="86" rx="12" fill="none" stroke={on ? 'var(--accent)' : 'var(--ink-3)'} strokeWidth={on ? 2 : 1.25} />
            <text x={x + 12} y={y + 22} {...head} fill={on ? 'var(--ink)' : 'var(--ink-2)'}>{c.title}</text>
            {words.map((q, k) => (
              <text key={q.id} x={x + 12} y={y + 41 + k * 13.5} fontFamily="var(--font-ui)" fontSize="11.5"
                fontWeight={on && q.id === p.id ? 600 : 400} fill={on && q.id === p.id ? 'var(--ink)' : 'var(--ink-3)'}>
                {q.word}
              </text>
            ))}
          </g>
        );
      })}
      <line x1={W / 2} y1="198" x2={W / 2} y2="222" stroke="var(--ink-2)" strokeWidth="1.5" />
      <path d={`M${W / 2 - 5} 216 L${W / 2} 224 L${W / 2 + 5} 216`} fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <rect x="70" y="226" width={W - 140} height="40" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="251" textAnchor="middle" {...head} fontSize={12.5} fill="var(--ink)">A FLOOR COVERING</text>
      <text x={W / 2} y="290" textAnchor="middle" {...ui} fill="var(--ink-2)">
        {s.adjective ? 'just add an adjective:' : `${colTitle(p.col)}: ${p.word}`}
      </text>
      {out.map((l, k) => (
        <text key={k} x={W / 2} y={312 + k * 19} textAnchor="middle" {...body} fill="var(--ink)">{l}</text>
      ))}
      {s.adjective && <line x1="88" y1="308" x2={W - 88} y2="308" stroke="var(--clay)" strokeWidth="1.5" />}
    </svg>
  );
  const verdict = s.adjective
    ? 'Just adding an adjective — "soft", "blue" — is what the exercise says to avoid: the product itself does not change.'
    : p.idea
      ? `"${p.word}" (${colTitle(p.col)}) changes the product itself: ${p.idea}. One idea towards 100 in 10 minutes; judging comes later.`
      : `"${p.word}" (${colTitle(p.col)}) becomes a question about the product. Write down whatever it suggests; judging waits until you pick your top 3.`;
  return { figure, verdict, tone: s.adjective ? 'no' : p.idea ? 'yes' : 'open' };
}

function describe(a: S, b: S) {
  if (a.adjective !== b.adjective)
    return b.adjective ? 'Back to an adjective: the floor covering stays the same product, only softer or bluer.' : 'Back to the tool: a prompt is applied to the product.';
  const pa = byId(a.prompt), pb = byId(b.prompt);
  if (pa.id !== pb.id) return pa.col === pb.col ? `Same column (${colTitle(pb.col)}), a new prompt: "${pb.word}".` : `New column: ${colTitle(pb.col)} — a different kind of push, "${pb.word}".`;
  return '';
}

export default function CreativityTool() {
  return (
    <Simulation<S>
      label="The creativity tool: pick a prompt and apply it to a floor covering"
      terms={[
        { term: 'Creativity tool', def: 'Four columns of prompts — Try to, Make it, Add or subtract, Imagine that you.' },
        { term: 'Just adding an adjective', def: '"Soft" or "blue": what the Floor Company Exercise tells you to avoid.' },
        { term: 'Diverging', def: 'Generating lots of ideas with judgement deferred — the job the tool does.' },
      ]}
      initial={initial}
      controls={[
        {
          key: 'prompt', label: 'Prompt from the tool', type: 'select',
          options: PROMPTS.map((p) => ({ value: p.id, label: `${colTitle(p.col)}: ${p.word}` })),
        },
        { key: 'adjective', label: 'Just add an adjective ("soft" or "blue") instead', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Which idea follows the Floor Company brief rather than "just adding an adjective"?',
        options: [
          { text: 'An extra-soft rug', why: 'It only adds "soft", one of the adjectives the slide names as the thing to avoid.' },
          { text: 'A floor covering that inflates into a guest mattress', correct: true, why: '"Inflate it" (Try to) changes what the product does, rather than just adding an adjective.' },
          { text: 'A softer, bluer version of the current tile', why: 'Both changes are adjectives ("soft", "blue"), the very thing to avoid.' },
        ],
      }}
    />
  );
}
