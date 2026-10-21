/*
SCENE: Creativity within discipline — structure versus freedom
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → move along the structure–freedom spectrum and switch the creative supports → read the zone → one check
INTENT: Show the host lecturer's balance (creativity alone is chaos; structure alone gives nothing new) and the guest
  lecturer's point that a disciplined organisation stays creative through protected play time, diversity and reuse.
SUBJECT: the marker on the spectrum and the zone it sits in; the three supports light when switched on.
BEAT 1 (0–100%): one select places the marker in five positions; three toggles light the supports; the verdict names
  the zone and the Dow Corning evidence for it within 200ms. Ease: none (state swap).
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (no motion); off mode shows the same controls.
BUDGET: < 6 KB gz, no WebGL.
Source: Week 10 recording of the Week 9 guest lecture (Dr Vik Kortian; host lecturer's remarks): sterile central R&D
building vs the local lab's free Friday afternoons; diversity; TRIZ and reuse; "you can still be disciplined and still
be creative". Concept mgmt2094-w09-creativity-within-discipline (verify: true for TRIZ, Blacktown, Atlassian).
*/
import { Simulation, type SimView } from '../bases/Simulation';

type Pos = 'p0' | 'p1' | 'p2' | 'p3' | 'p4';

interface S extends Record<string, unknown> {
  pos: Pos;
  play: boolean;
  diversity: boolean;
  reuse: boolean;
}

const initial: S = { pos: 'p2', play: false, diversity: false, reuse: false };

const POS: { value: Pos; label: string }[] = [
  { value: 'p0', label: 'All structure, no freedom' },
  { value: 'p1', label: 'Mostly structure' },
  { value: 'p2', label: 'Disciplined process with room to create' },
  { value: 'p3', label: 'Mostly freedom' },
  { value: 'p4', label: 'All freedom, no structure' },
];

const SUPPORTS = [
  { key: 'play' as const, label: 'Protected time to play', note: 'free Friday afternoons in the local lab' },
  { key: 'diversity' as const, label: 'People who think differently', note: 'brought into headquarters' },
  { key: 'reuse' as const, label: 'Reuse of known solutions', note: 'TRIZ; applying a known technique anew' },
];

const W = 360;

function view(s: S): SimView {
  const k = POS.findIndex((p) => p.value === s.pos);
  const x = 30 + k * 75;
  const on = SUPPORTS.filter((t) => s[t.key]);
  const zone = k <= 0 ? 'structure' : k >= 4 ? 'chaos' : 'balance';
  const figure = (
    <svg viewBox={`0 0 ${W} 276`} role="img" aria-label={`Marker at: ${POS[k].label}. Supports on: ${on.length} of 3.`}>
      <text x="16" y="22" fontFamily="var(--font-ui)" fontSize="13" letterSpacing="1" fill="var(--ink-2)">STRUCTURE</text>
      <text x={W - 16} y="22" textAnchor="end" fontFamily="var(--font-ui)" fontSize="13" letterSpacing="1" fill="var(--ink-2)">FREEDOM</text>
      <line x1="30" y1="52" x2="330" y2="52" stroke="var(--ink-3)" strokeWidth="3" strokeLinecap="round" />
      <rect x="66" y="40" width="228" height="24" rx="12" fill="none" stroke="var(--ink-2)" strokeDasharray="5 4" />
      {POS.map((p, i) => <circle key={p.value} cx={30 + i * 75} cy="52" r="4" fill="var(--ink-3)" />)}
      <circle cx={x} cy="52" r="11" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" data-marker />
      <text x="30" y="88" textAnchor="start" fontFamily="var(--font-ui)" fontSize="12" fill="var(--ink-2)">nothing new</text>
      <text x="180" y="88" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="12" fill="var(--ink-2)">disciplined creativity</text>
      <text x="330" y="88" textAnchor="end" fontFamily="var(--font-ui)" fontSize="12" fill="var(--ink-2)">chaos</text>
      <text x="16" y="126" fontFamily="var(--font-ui)" fontSize="13" letterSpacing="1" fill="var(--ink-2)">CREATIVE SUPPORTS</text>
      {SUPPORTS.map((t, i) => {
        const lit = !!s[t.key];
        return (
          <g key={t.key} data-support={t.key} data-on={lit || undefined}>
            <rect x="16" y={140 + i * 44} width="22" height="22" rx="6" fill={lit ? 'var(--ink)' : 'none'} stroke="var(--ink)" strokeWidth="1.5" />
            <text x="48" y={152 + i * 44} fontFamily="var(--font-body)" fontSize="15" fill={lit ? 'var(--ink)' : 'var(--ink-3)'}>{t.label}</text>
            <text x="48" y={169 + i * 44} fontFamily="var(--font-ui)" fontSize="12" fill="var(--ink-2)">{t.note}</text>
          </g>
        );
      })}
    </svg>
  );
  if (zone === 'structure')
    return { figure, tone: 'no', verdict: 'Nothing new comes out: like the sterile central R&D building — lab coats, no noise — where the creativity was missing.' };
  if (zone === 'chaos')
    return { figure, tone: 'no', verdict: 'Chaos: the host lecturer said that if you are only creative, nothing useful comes up. Structure is needed too.' };
  const missing = SUPPORTS.filter((t) => !s[t.key]).map((t) => t.label.toLowerCase());
  if (k === 2 && !missing.length)
    return { figure, tone: 'yes', verdict: 'Disciplined and creative: a structured process with play time, diversity and reuse of known solutions.' };
  const lean = k === 1 ? 'Leaning to structure' : k === 3 ? 'Leaning to freedom' : 'Balanced';
  return { figure, tone: 'open', verdict: `${lean}. ${missing.length ? `Still missing: ${missing.join(', ')}.` : 'All three supports are in place; move to the middle for the balance.'}` };
}

function describe(a: S, b: S) {
  if (a.pos !== b.pos) return `Marker moved to "${POS.find((p) => p.value === b.pos)!.label}".`;
  const t = SUPPORTS.find((x) => a[x.key] !== b[x.key]);
  if (!t) return '';
  if (t.key === 'play') return b.play ? 'Play time on: the local lab let staff try anything on Friday afternoons. Most ideas go to waste; a few may be a goldmine.' : 'Play time off: the central building had no such space.';
  if (t.key === 'diversity') return b.diversity ? 'Diversity on: "with creativity you really need diversity" — people who think differently.' : 'Diversity off: everyone thinks alike.';
  return b.reuse ? 'Reuse on: many problems have been solved before; TRIZ and Kortian\'s patent both adapt known solutions.' : 'Reuse off: every problem is attacked from scratch.';
}

export default function CreativityWithinDiscipline() {
  return (
    <Simulation<S>
      label="Creativity within discipline: a spectrum from structure to freedom"
      terms={[
        { term: 'Discipline', def: 'In Six Sigma: disciplined people, processes and actions.' },
        { term: 'Play time', def: 'Protected time to try your own ideas, like the local lab\'s free Friday afternoons.' },
        { term: 'TRIZ', def: 'The theory of inventive problem solving: reuse principles that have resolved similar contradictions.' },
      ]}
      initial={initial}
      controls={[
        { key: 'pos', label: 'How the organisation works', type: 'select', options: POS },
        { key: 'play', label: 'Protected time to experiment', type: 'toggle' },
        { key: 'diversity', label: 'Bring in people who think differently', type: 'toggle' },
        { key: 'reuse', label: 'Reuse known solutions (eg TRIZ)', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'What was the guest lecturer\'s view of Six Sigma and creativity?',
        options: [
          { text: 'Its discipline rules creativity out, so keep it away from R&D', why: 'He argued the opposite: discipline and creativity can coexist.' },
          { text: 'You can be disciplined and still be creative', correct: true, why: 'He said Six Sigma is about discipline, but you can still be disciplined and still be creative.' },
          { text: 'Creativity matters only before the process starts', why: 'Creativity tools sit inside the design process (the Explore step), not only before it.' },
        ],
      }}
    />
  );
}
