/*
SCENE: Mind maps — build one to Buzan's guidelines
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → switch guidelines on and off → watch the map redraw and the count of guidelines met → one check
INTENT: Make the guidelines visible as changes to one map (the tutorial's Time Management theme): a central image,
  three or more colours, curved connected branches, one key word per line, lines thicker at the centre and thinner
  outward — and show the tutorial's critique point that too many branches distract.
SUBJECT: the map itself; each toggle changes one visible property of it.
BEAT 1 (0–100%): five guideline toggles and a branch-count select; the map and verdict redraw within 200ms.
  Ease: none needed (state swap); no layout animation.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical controls; no motion.
BUDGET: < 6 KB gz, no WebGL. 380-unit canvas so labels stay ≥ 11px at 390px width.
Source: concept mgmt2094-w02-mind-maps; Buzan (1960), Mind Map Guidelines handout; tutorial slides 3, 10–11
  (branch words taken from the Time Management map: clarity, delegation, choices, monitoring, SMART, supervise …).
Colour: the guideline is about colour itself, so branch strokes use token hues (one accent branch only).
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  image: boolean;
  colours: string;
  curved: boolean;
  keyword: boolean;
  taper: boolean;
  branches: string;
}

const initial: S = { image: false, colours: '1', curved: false, keyword: false, taper: false, branches: '4' };

interface Branch { word: string; phrase: [string, string]; subs?: [string, string] }
const MAIN: Branch[] = [
  { word: 'Faster', phrase: ['faster and', 'smarter'], subs: ['smarter', 'better'] },
  { word: 'Monitoring', phrase: ['monitor', 'progress'], subs: ['progress', 'balance'] },
  { word: 'Choices', phrase: ['make', 'decisions'], subs: ['big', 'small'] },
  { word: 'Delegation', phrase: ['delegate', 'with trust'], subs: ['guidance', 'trust'] },
];
const EXTRA: Branch[] = [
  { word: 'SMART', phrase: ['specific,', 'measurable'] },
  { word: 'Supervise', phrase: ['help and', 'encourage'] },
  { word: 'Clarity', phrase: ['clarity and', 'motivation'] },
  { word: 'Deadlines', phrase: ['key issues,', 'deadlines'] },
  { word: 'Fearless', phrase: ['let go,', 'fearless'] },
  { word: 'Balance', phrase: ['work–life', 'balance'] },
  { word: 'Mindtools', phrase: ['mind', 'tools'] },
  { word: 'Chunking', phrase: ['big picture,', 'chunking'] },
];

const CX = 190, CY = 150, OUT = 46;
const charW = (size: number) => size * 0.56;
const HUES = ['var(--ink)', 'var(--gold)', 'var(--ink-2)'];

function hue(s: S, i: number) {
  if (s.colours !== '3') return 'var(--ink)';
  return i === 0 ? 'var(--accent)' : HUES[i % 3];
}

function link(s: S, x1: number, y1: number, x2: number, y2: number) {
  if (!s.curved) return `M${x1} ${y1} L${x2} ${y2}`;
  const mx = (x1 + x2) / 2;
  return `M${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

function view(s: S): SimView {
  const many = s.branches === '12';
  const list = many ? [...MAIN, ...EXTRA] : MAIN;
  const perSide = list.length / 2;
  const ys = Array.from({ length: perSide }, (_, k) => (many ? 30 + k * 48 : 96 + k * 108));
  const w = (main: boolean) => (s.taper ? (main ? 4 : 1.6) : 1.6);
  const mainSize = 12.5, subSize = 11.5;

  const branches = list.map((b, i) => {
    const right = i % 2 === 0;
    const dir = right ? 1 : -1;
    const y = ys[Math.floor(i / 2)];
    const p1x = CX + dir * OUT;
    const label = s.keyword ? [b.word] : b.phrase;
    const len = Math.max(...label.map((l) => l.length)) * charW(mainSize) + 6;
    const p2x = p1x + dir * len;
    const colour = hue(s, i);
    const anchor = right ? 'start' : 'end';
    const subs = !many && b.subs ? b.subs : [];
    return (
      <g key={b.word} data-branch={b.word}>
        <path d={link(s, CX, CY, p1x, y)} fill="none" stroke={colour} strokeWidth={w(true)} strokeLinecap="round" />
        <line x1={p1x} y1={y} x2={p2x} y2={y} stroke={colour} strokeWidth={s.taper ? 2.4 : 1.6} strokeLinecap="round" />
        {label.map((l, k) => (
          <text key={l} x={p1x + dir * 3} y={y - 5 - (label.length - 1 - k) * 15} textAnchor={anchor} fontFamily="var(--font-ui)" fontSize={mainSize} fill="var(--ink)">{l}</text>
        ))}
        {subs.map((sub, k) => {
          const sy = y + (k === 0 ? -22 : 22);
          const sx = p2x + dir * 10;
          const end = sx + dir * (sub.length * charW(subSize) + 4);
          return (
            <g key={sub}>
              <path d={link(s, p2x, y, sx, sy)} fill="none" stroke={colour} strokeWidth={w(false)} strokeLinecap="round" />
              <line x1={sx} y1={sy} x2={end} y2={sy} stroke={colour} strokeWidth={w(false)} strokeLinecap="round" />
              <text x={sx + dir * 2} y={sy - 4} textAnchor={anchor} fontFamily="var(--font-ui)" fontSize={subSize} fill="var(--ink-2)">{sub}</text>
            </g>
          );
        })}
      </g>
    );
  });

  const centre = s.image ? (
    <g data-centre="image">
      <circle cx={CX} cy={CY} r="22" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
      <line x1={CX} y1={CY} x2={CX} y2={CY - 14} stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
      <line x1={CX} y1={CY} x2={CX + 10} y2={CY + 4} stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
      <text x={CX} y={CY + 40} textAnchor="middle" fontFamily="var(--font-ui)" fontSize="11" fill="var(--ink-2)">TIME</text>
    </g>
  ) : (
    <g data-centre="text">
      <rect x={CX - 40} y={CY - 22} width="80" height="44" rx="4" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
      {['Time', 'management'].map((l, k) => (
        <text key={l} x={CX} y={CY - 3 + k * 14} textAnchor="middle" fontFamily="var(--font-ui)" fontSize="11" fill="var(--ink)">{l}</text>
      ))}
    </g>
  );

  const figure = (
    <svg viewBox="0 0 380 300" role="img" style={{ maxWidth: 520, margin: '0 auto' }}
      aria-label={`A Time Management mind map with ${list.length} main branches; ${s.image ? 'a central image' : 'a text box at the centre'}; ${s.curved ? 'curved' : 'straight'} branches; ${s.colours === '3' ? 'several colours' : 'one colour'}; ${s.keyword ? 'one key word per line' : 'two-line phrases'}; ${s.taper ? 'lines thinning outward' : 'lines of equal weight'}`}>
      {branches}
      {centre}
    </svg>
  );

  const checks: [boolean, string][] = [
    [s.image, 'a central image'],
    [s.colours === '3', 'three or more colours'],
    [s.curved, 'curved branches'],
    [s.keyword, 'one key word per line'],
    [s.taper, 'lines thicker at the centre, thinner outward'],
  ];
  const met = checks.filter(([ok]) => ok).length;
  const missing = checks.filter(([ok]) => !ok).map(([, t]) => t);
  let verdict: string;
  let tone: SimView['tone'];
  if (many) {
    verdict = `${met} of 5 guidelines met — but twelve main branches. The tutorial’s critique: are there too many branches, is it distracting?`;
    tone = 'open';
  } else if (met === 5) {
    verdict = 'All five guidelines met: central image, three colours, curved connected branches, one key word per line, lines thinning outward.';
    tone = 'yes';
  } else {
    verdict = `${met} of 5 guidelines met. Still missing: ${missing.join('; ')}.`;
    tone = met >= 3 ? 'open' : 'no';
  }
  return { figure, verdict, tone };
}

function describe(a: S, b: S) {
  if (a.image !== b.image) return b.image ? 'Central image: "an image is worth a 1000 words" and keeps you focused.' : 'Text at the centre: the guidelines ask for an image or picture for the central idea.';
  if (a.colours !== b.colours) return b.colours === '3' ? 'Colours throughout, three at minimum: colours are as exciting to your brain as images.' : 'One colour: the guidelines ask for three at minimum.';
  if (a.curved !== b.curved) return b.curved ? 'Curved branches — "straight lines are boring to your brain".' : 'Straight branches: the guidelines ask for curved ones.';
  if (a.keyword !== b.keyword) return b.keyword ? 'One key word per line: a single word gives the map more power and flexibility.' : 'Phrases on the branches: more words per line, less flexibility.';
  if (a.taper !== b.taper) return b.taper ? 'Central lines thicker, thinning as they radiate out: the main themes stand out.' : 'Every line the same weight: nothing marks the main branches.';
  if (a.branches !== b.branches) return b.branches === '12' ? 'Twelve main branches: the tutorial asks whether too many branches distract.' : 'Four main branches, each with second-level branches connected to it.';
  return '';
}

export default function MindMaps() {
  return (
    <Simulation<S>
      label="A Time Management mind map, built to Buzan's guidelines"
      terms={[
        { term: 'Mind map', def: 'A visual way to organise notes, thoughts, ideas and conversations around one central word or image.' },
        { term: 'Radial associations', def: 'How we think: out from a centre by links, not down a list (the windows exercise).' },
        { term: 'Main branch', def: 'A first-level line from the centre; second- and third-level branches connect to it.' },
        { term: 'Key word', def: 'One word per line, upper and lower case.' },
      ]}
      initial={initial}
      controls={[
        { key: 'image', label: 'Image for the central idea', type: 'toggle' },
        { key: 'colours', label: 'Colours', type: 'select', options: [{ value: '1', label: 'One colour' }, { value: '3', label: 'Three or more colours' }] },
        { key: 'curved', label: 'Curved branches', type: 'toggle' },
        { key: 'keyword', label: 'One key word per line', type: 'toggle' },
        { key: 'taper', label: 'Lines thicker at the centre, thinner outward', type: 'toggle' },
        { key: 'branches', label: 'Main branches', type: 'select', options: [{ value: '4', label: 'Four' }, { value: '12', label: 'Twelve' }] },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Why does Buzan want branches curved rather than straight?',
        options: [
          { text: 'Curved lines leave room for longer sentences', why: 'The guidelines ask for one key word per line, not longer sentences.' },
          { text: 'Curves show which branch matters most', why: 'Importance is shown by line thickness — thicker at the centre — not by curves.' },
          { text: 'Straight lines are boring to your brain', correct: true, why: 'That is Buzan’s stated reason: "Because straight lines are boring to your brain."' },
        ],
      }}
    />
  );
}
