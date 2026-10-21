/*
SCENE: Generations of rights, indivisibility and interdependence, and the universality debate
LENGTH: 4 steps, scroll-drawn when pinned (≈ 320vh); Next/Back otherwise (Diagram base)
BEATS: 1 three equal columns · 2 one level bar beneath them · 3 three linked nodes · 4 a level two-pan scale
INTENT: Show the three generations as categories of equal status (no ranking), linked so that denying one impedes the
  others, and set the relativist and universalist arguments side by side on a balance.
SUBJECT: the columns standing on one level bar — the visual claim that no generation sits higher than another.
BEAT 1 (0–25%): three columns draw on with their examples. BEAT 2 (25–50%): the level bar "equal status".
BEAT 3 (50–75%): the interdependence triangle — standard of living, health, education. BEAT 4 (75–100%): the scale.
  DrawSVG strokes, ease none (scrubbed); text fades in.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished diagram with all four captions stacked (base).
BUDGET: < 6 KB gz. Narrow 360-unit canvas; ≥ 12px labels.
Source: concept laws2000-w12-generations-and-principles-of-rights; Week 12 lecture slides 12–14. The scale is drawn
  level because the lecture presents both sides of the debate without declaring a winner.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)' } as const;

function Column({ x, title, sub, items, faint = [] }: { x: number; title: string; sub: string[]; items: string[]; faint?: string[] }) {
  const cx = x + 54;
  return (
    <>
      <rect x={x} y="10" width="108" height="240" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={cx} y="36" textAnchor="middle" {...ui} fontSize="13" letterSpacing="1.4" fill="var(--ink)" data-label={title.toLowerCase()}>{title}</text>
      {sub.map((l, i) => <text key={l} x={cx} y={58 + i * 17} textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">{l}</text>)}
      {items.map((l, i) => <text key={l} x={cx} y={124 + i * 21} textAnchor="middle" fontFamily="var(--font-body)" fontSize="13" fill="var(--ink)">{l}</text>)}
      {faint.map((l, i) => <text key={l} x={cx} y={124 + (items.length + i) * 21} textAnchor="middle" fontFamily="var(--font-body)" fontSize="13" fill="var(--ink-3)">{l}</text>)}
    </>
  );
}

function Pan({ x, title, lines }: { x: number; title: string; lines: string[] }) {
  return (
    <>
      <rect x={x} y="452" width="164" height="150" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={x + 82} y="476" textAnchor="middle" {...ui} fontSize="12" letterSpacing="1.2" fill="var(--ink)">{title}</text>
      {lines.map((l, i) => <text key={l} x={x + 82} y={500 + i * 18} textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">{l}</text>)}
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 612`} role="img" aria-label="Three generations of rights as equal columns on one level bar, linked by interdependence, above a level scale weighing the cultural relativist and universalist arguments">
    <g data-step="1">
      <Column x={8} title="FIRST" sub={['civil &', 'political']} items={['life', 'no torture', 'expression', 'fair trial', 'participation']} />
      <Column x={126} title="SECOND" sub={['economic,', 'social &', 'cultural']} items={['education', 'health', 'living standard', 'work', 'culture']} />
      <Column x={244} title="THIRD" sub={['collective']} items={['self-', 'determination']} faint={['potentially:', 'development,', 'environment']} />
    </g>
    <g data-step="2">
      {[62, 180, 298].map((x) => <line key={x} x1={x} y1="250" x2={x} y2="262" stroke="var(--ink-3)" strokeWidth="1.5" />)}
      <rect x="8" y="262" width={W - 16} height="34" rx="6" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="284" textAnchor="middle" {...ui} fontSize="12" letterSpacing="1.4" fill="var(--ink)" data-label="indivisibility">EQUAL STATUS · NO HIERARCHY</text>
    </g>
    <g data-step="3">
      <line x1="70" y1="328" x2="180" y2="328" stroke="var(--ink-3)" strokeWidth="1.5" />
      <line x1="180" y1="328" x2="290" y2="328" stroke="var(--ink-3)" strokeWidth="1.5" />
      {[70, 180, 290].map((x) => <circle key={x} cx={x} cy="328" r="6" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />)}
      <text x="70" y="354" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">living standard</text>
      <text x="180" y="354" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">health</text>
      <text x="290" y="354" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">education</text>
      <text x={W / 2} y="384" textAnchor="middle" fontFamily="var(--font-body)" fontSize="14" fill="var(--ink)">deny one, and the others are impeded</text>
    </g>
    <g data-step="4">
      <polygon points="180,418 168,438 192,438" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <line x1="92" y1="418" x2="268" y2="418" stroke="var(--ink)" strokeWidth="1.5" />
      <line x1="92" y1="418" x2="92" y2="452" stroke="var(--ink-3)" strokeWidth="1.5" />
      <line x1="268" y1="418" x2="268" y2="452" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x={W / 2} y="408" textAnchor="middle" {...ui} fontSize="12" letterSpacing="1.4" fill="var(--ink)" data-label="universality">UNIVERSALITY?</text>
      <Pan x={8} title="RELATIVISTS" lines={['values differ', 'between societies', 'universal rights =', 'cultural imperialism', 'read rights in context']} />
      <Pan x={188} title="UNIVERSALISTS" lines={['life, no torture:', 'not up to culture', 'relativism can mask', 'oppression', 'culture changes']} />
    </g>
  </svg>
);

export default function GenerationsAndPrinciplesOfRights() {
  return (
    <Diagram
      label="Generations of rights, indivisibility and interdependence, and the universality debate"
      terms={[
        { term: 'Generations of rights', def: 'Three categories: civil and political; economic, social and cultural; collective.' },
        { term: 'Indivisibility', def: 'All human rights have equal status and cannot be positioned in a hierarchical order.' },
        { term: 'Universality', def: 'Rights apply to all humans everywhere — challenged by cultural relativists.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Three generations: civil and political rights (life, freedom from torture, expression, fair trial, participation); economic, social and cultural rights (education, health, an adequate standard of living, work, culture); collective rights (self-determination; potentially development and a healthy environment).' },
        { caption: 'Indivisibility: all human rights have equal status and cannot be positioned in a hierarchical order. “First generation” is a category, not a rank.' },
        { caption: 'Interdependence: denial of one right invariably impedes the enjoyment of others — the right to an adequate standard of living cannot be compromised at the expense of health or education.' },
        { caption: 'Universality is contested. Relativists: values differ, universal rights are cultural imperialism, rights must be read in context. Universalists: life and freedom from torture cannot depend on culture, relativism often masks oppression of women and minorities, and culture changes and evolves.' },
      ]}
      check={{
        question: 'A government says it will secure civil and political rights before it turns to education, because they are “first generation”. Which principle answers this?',
        options: [
          { text: 'Universality', why: 'Universality is about rights applying to all humans everywhere; the government’s error is ranking the generations.' },
          { text: 'Indivisibility', correct: true, why: 'All rights have equal status and cannot be ranked; the generations are categories, and denying education impedes other rights.' },
          { text: 'Cultural relativism', why: 'Relativism concerns cultural context, and it would not answer a claimed hierarchy between generations of rights.' },
        ],
      }}
    />
  );
}
