/*
SCENE: Single hats and sequences — build a sequence, see what it is for
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → choose a first, second and (optional) third hat → read the purpose → one check
INTENT: Show that the slides' two- and three-hat sequences each serve a named purpose, that order matters (yellow
  before black; black before green; red before white), and that other orders are allowed but carry no slide purpose.
SUBJECT: the three slots and the verdict line beneath them; a matched sequence is outlined in sage, a reversed slide
  sequence in clay.
BEAT 1 (0–100%): selects fill the slots; the verdict names the slide purpose within 200ms. Colour change only
  (CSS 180ms ease-out on stroke); no positional motion.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (no motion beyond colour); off mode shows the same controls.
BUDGET: < 6 KB gz, no WebGL.
Source: concept mgmt2094-w04-hat-sequences (Week 4 slides 33–34; Kivunja 2015: no set sequence; lecture's
  air-freight illustration of red then white).
*/
import { Simulation, type SimView } from '../bases/Simulation';

type Hat = 'blue' | 'white' | 'yellow' | 'green' | 'red' | 'black';
interface S extends Record<string, unknown> { first: Hat; second: Hat; third: Hat | 'none' }

const initial: S = { first: 'yellow', second: 'black', third: 'none' };

const DIRECTION: Record<Hat, string> = {
  blue: 'control', white: 'facts', yellow: 'benefits', green: 'new ideas', red: 'feelings', black: 'risks',
};

interface Rule { seq: string; purpose: string }
// Sequences named on the slides (slides 33–34), most specific first.
const RULES: Rule[] = [
  { seq: 'yellow black green', purpose: 'Assess an idea, then follow up with new ideas — the slide adds red (feelings and emotions) after green.' },
  { seq: 'black yellow green', purpose: 'Comparing and synthesising: coming up with new ideas from the known.' },
  { seq: 'blue green red', purpose: 'A design sequence: new ideas, products or improvements to existing designs.' },
  { seq: 'yellow black', purpose: 'Assess an idea: its positive aspects first, then its negative aspects.' },
  { seq: 'black green', purpose: 'Improve a design — the slide\'s example is an All Weather bike: find the faults, then create fixes.' },
  { seq: 'red white', purpose: 'Compares fact with opinion: air the feeling, then test it against the information.' },
  { seq: 'white blue', purpose: 'What do we know in facts, and where do we plan to go.' },
];
// Slide sequences run backwards: the order is the point.
const REVERSED: Record<string, string> = {
  'black yellow': 'Reversed: to assess an idea the slides put yellow before black, so the good points are up front before criticism.',
  'green black': 'Reversed: black then green improves a design — find the faults first, then generate fixes aimed at them.',
  'white red': 'Reversed: red then white compares fact with opinion — the feeling has to be aired before the facts can test it.',
  'blue white': 'Reversed: white then blue goes from what we know in facts to where we plan to go.',
};

function analyse(s: S) {
  const hats = [s.first, s.second, ...(s.third === 'none' ? [] : [s.third])] as Hat[];
  const key = hats.join(' ');
  if (new Set(hats).size < hats.length)
    return { tone: 'open' as const, matched: false, reversed: false, text: 'The same hat twice in a row: any hat can be used as often as needed, but a sequence switches direction.' };
  const rule = RULES.find((r) => r.seq === key);
  if (rule) return { tone: 'yes' as const, matched: true, reversed: false, text: rule.purpose };
  if (hats.length === 3 && hats[0] === 'black' && hats[1] === 'yellow')
    return { tone: 'open' as const, matched: false, reversed: false, text: 'Black then yellow opens the slides\' comparing-and-synthesising sequence, which ends in green: new ideas from the known.' };
  const rev = REVERSED[key] ?? (hats.length === 3 ? REVERSED[hats.slice(0, 2).join(' ')] : undefined);
  if (rev) return { tone: 'no' as const, matched: false, reversed: true, text: rev };
  const head = hats.length === 3 ? RULES.find((r) => r.seq === hats.slice(0, 2).join(' ')) : undefined;
  if (head) return { tone: 'open' as const, matched: false, reversed: false, text: `Starts with a slide sequence — ${head.purpose.charAt(0).toLowerCase()}${head.purpose.slice(1)} The third hat is your own addition: allowed, as there is no set sequence.` };
  return { tone: 'open' as const, matched: false, reversed: false, text: 'Not a sequence on the slides. Kivunja (2015): there is no set sequence — it can still serve a purpose you name.' };
}

const ui = { fontFamily: 'var(--font-ui)' } as const;

function Slot({ x, hat, n, stroke }: { x: number; hat: Hat | 'none'; n: number; stroke: string }) {
  const empty = hat === 'none';
  return (
    <g data-slot={n}>
      <rect x={x - 70} y={40} width="140" height="76" rx="14" fill="var(--paper)" stroke={empty ? 'var(--ink-3)' : stroke} strokeWidth={empty ? 1.5 : 2} strokeDasharray={empty ? '6 6' : undefined} style={{ transition: 'stroke 180ms var(--ease-out)' }} />
      <text x={x} y={28} textAnchor="middle" fontSize="13" fill="var(--ink-2)" {...ui}>{n}</text>
      <text x={x} y={76} textAnchor="middle" fontSize="20" fill={empty ? 'var(--ink-3)' : 'var(--ink)'} {...ui}>{empty ? '—' : hat}</text>
      <text x={x} y={100} textAnchor="middle" fontSize="14" fill="var(--ink-2)" {...ui}>{empty ? 'optional' : DIRECTION[hat]}</text>
    </g>
  );
}

function view(s: S): SimView {
  const a = analyse(s);
  const stroke = a.matched ? 'var(--sage)' : a.reversed ? 'var(--clay)' : 'var(--ink)';
  const figure = (
    <svg viewBox="0 0 520 140" role="img" aria-label={`Sequence: ${s.first}, then ${s.second}${s.third === 'none' ? '' : `, then ${s.third}`}`}>
      <Slot x={90} hat={s.first} n={1} stroke={stroke} />
      <Slot x={260} hat={s.second} n={2} stroke={stroke} />
      <Slot x={430} hat={s.third} n={3} stroke={stroke} />
      {[160, 330].map((x) => (
        <g key={x}>
          <line x1={x + 2} y1={78} x2={x + 24} y2={78} stroke="var(--ink-3)" strokeWidth="2" />
          <polyline points={`${x + 18},72 ${x + 25},78 ${x + 18},84`} fill="none" stroke="var(--ink-3)" strokeWidth="2" />
        </g>
      ))}
    </svg>
  );
  return { figure, verdict: a.text, tone: a.tone };
}

const HATS: { value: Hat; label: string }[] = [
  { value: 'blue', label: 'Blue — control' },
  { value: 'white', label: 'White — facts' },
  { value: 'yellow', label: 'Yellow — benefits' },
  { value: 'green', label: 'Green — new ideas' },
  { value: 'red', label: 'Red — feelings' },
  { value: 'black', label: 'Black — risks' },
];

function describe(a: S, b: S) {
  const slot = a.first !== b.first ? ['First', b.first] : a.second !== b.second ? ['Second', b.second] : ['Third', b.third];
  if (slot[1] === 'none') return 'Third hat removed: a two-hat sequence.';
  return `${slot[0]} hat is now ${slot[1]}: ${DIRECTION[slot[1] as Hat]}. ${analyse(b).tone === 'yes' ? 'That order matches a slide sequence.' : 'Check the purpose below.'}`;
}

export default function HatSequences() {
  return (
    <Simulation<S>
      label="Three slots for a sequence of thinking hats, with the purpose the slides give for that order"
      terms={[
        { term: 'Single use', def: 'One hat at any point in thinking — in general, the major use.' },
        { term: 'Sequence', def: 'Two or three hats used together, in order, for a particular purpose.' },
        { term: 'Evaluation sequence', def: 'Yellow before black, to see an idea\'s positive and negative aspects.' },
      ]}
      initial={initial}
      controls={[
        { key: 'first', label: 'First hat', type: 'select', options: HATS },
        { key: 'second', label: 'Second hat', type: 'select', options: HATS },
        { key: 'third', label: 'Third hat', type: 'select', options: [{ value: 'none', label: 'None (two hats)' }, ...HATS] },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'A manager wants staff fears about a new system aired, then tested against the evidence. Which sequence fits?',
        options: [
          { text: 'Yellow, then black', why: 'That assesses an idea\'s good and bad points; it does not test feelings against facts.' },
          { text: 'Red, then white', correct: true, why: 'Red then white compares fact with opinion: the fears are aired (red), then checked against the data (white).' },
          { text: 'White, then red', why: 'Reversed: the feeling has to be aired first for the facts to test it.' },
        ],
      }}
    />
  );
}
