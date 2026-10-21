/*
SCENE: The gunman situation writ large — four dials turn a single threat into a model legal system
LENGTH: 5 screens pinned (desktop, full motion); 5 paced beats otherwise
BEATS: 5
INTENT: Hart builds Austin's model at its strongest: one gunman–clerk pair plus generality, enduring character,
  a general habit of obedience, and supremacy and independence — yet the clerk is only obliged, not under an obligation.
SUBJECT: the label under the pair, switching between 'obliged' and 'legal obligation?'.
BEAT 1 (0–20%): one gunman, one clerk; label "obliged — not an obligation".
BEAT 2 (20–40%): dial 1 generality — the clerk becomes a class of persons. BEAT 3: dial 2 enduring character.
BEAT 4: dial 3 general habit of obedience — return arrows. BEAT 5: dial 4 supremacy and independence; label "writ large".
  Dials turn by rotate (transform), scrubbed, ease none.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all five captions stacked (base).
BUDGET: < 6 KB gz. Transform and opacity only.
Source: concept laws2100-w02-gunman-situation; authority hart-the-concept-of-law.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const W = 360;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;
const DIALS = ['generality', 'enduring character', 'general habit of obedience', 'supremacy and independence'];
const CROWD = [60, 100, 140, 180, 220, 260, 300];

function scene(t: number) {
  const dial = (i: number) => clamp(t - 1 - i);
  const many = dial(0);
  const large = dial(3) > 0.5;
  return (
    <svg viewBox={`0 0 ${W} 440`} role="img" aria-label="A gunman and a clerk grow into a model legal system as four dials turn on">
      <circle cx="180" cy="36" r="10" fill="none" stroke="var(--ink)" strokeWidth="2" />
      <text x="200" y="40" {...head}>{large ? 'SOVEREIGN' : 'GUNMAN'}</text>
      {CROWD.map((x) => {
        const lone = x === 180;
        return (
          <g key={x} opacity={lone ? 1 : many}>
            <line x1="180" y1="46" x2={x} y2="118" stroke="var(--ink-3)" strokeWidth="1.2" />
            <line x1={x} y1="118" x2="180" y2="46" stroke="var(--ink)" strokeWidth="1.2" strokeDasharray="3 4" opacity={dial(2)} transform="translate(5 0)" />
            <circle cx={x} cy="126" r="7" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
          </g>
        );
      })}
      <text x="200" y="130" {...head} opacity={1 - many}>CLERK</text>
      <text x={W / 2} y="162" textAnchor="middle" {...body} fontSize={12} opacity={many}>a general class of persons</text>
      <g opacity={dial(1)}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => <line key={k} x1={40 + k * 40} y1="176" x2={40 + k * 40} y2="184" stroke="var(--ink-3)" strokeWidth="1.5" />)}
        <line x1="40" y1="180" x2="320" y2="180" stroke="var(--ink-3)" strokeWidth="1" />
      </g>
      <text x={W / 2} y="214" textAnchor="middle" {...body} fill="var(--ink)" opacity={large ? 0 : 1}>the clerk is obliged — has no obligation</text>
      <text x={W / 2} y="214" textAnchor="middle" {...body} fill="var(--ink)" opacity={large ? 1 : 0}>legal obligation: "this situation writ large"?</text>
      {DIALS.map((d, i) => {
        const y = 256 + i * 44;
        return (
          <g key={d} opacity={0.35 + 0.65 * dial(i)}>
            <circle cx="30" cy={y} r="13" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
            <line x1="30" y1={y} x2="30" y2={y - 10} stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" transform={`rotate(${-90 + dial(i) * 90} 30 ${y})`} />
            <circle cx="30" cy={y} r="3" fill="var(--ink)" opacity={dial(i)} />
            <text x="56" y={y + 5} {...body} fill="var(--ink)">{d}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function GunmanSituation() {
  return (
    <ScrollExplainer
      label="The gunman situation writ large: four dials turn one threat into Austin's model"
      terms={[
        { term: 'Obliged vs an obligation', def: 'The clerk is obliged to hand over the money, but has no obligation to.' },
        { term: 'Coercive orders', def: "Hart's term for orders backed by threats; he avoids Austin's 'command', which implies authority." },
        { term: 'Charitable interpretation', def: 'Stating a doctrine "in its strongest form" (CL 18) before attacking it.' },
      ]}
      beats={[
        { caption: '"The gunman orders his victim to hand over his purse and threatens to shoot if he refuses" (CL 6). If the clerk complies, he was obliged to — but he has no obligation.' },
        { caption: 'Generality: the order covers a general type of conduct and a general class of persons.' },
        { caption: 'Enduring character: the orders persist over time.' },
        { caption: 'A general habit of obedience: the bulk of those addressed habitually comply.' },
        { caption: 'Supremacy and independence (CL 24): the laws are general orders backed by threats issued by the sovereign or subordinates. Legal obligation is "this situation writ large" — the model Hart attacks in Chapters III and IV.' },
      ]}
      scene={scene}
      check={{
        question: 'Why does Hart avoid Austin\'s word "command" for the gunman\'s order?',
        options: [
          { text: 'Commanding is characteristically exercising authority, not power to inflict harm', correct: true, why: 'Hart\'s point (CL 20): the gunman has only power, so "orders backed by threats" fits better.' },
          { text: 'Commands must always be written', why: 'Austin allows expression by words or other signs; form is not the issue.' },
          { text: 'The gunman\'s order is too general to be a command', why: 'The reverse: the lone gunman\'s order is particular — generality is one of the elements Hart adds.' },
        ],
      }}
    />
  );
}
