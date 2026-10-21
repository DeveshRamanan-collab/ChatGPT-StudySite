/*
SCENE: Value innovation and "What if" questions
LENGTH: 5 screens pinned (desktop, full motion); 5 paced beats otherwise (ScrollExplainer base)
BEATS: 5
INTENT: Value innovation rethinks the value of what is already there — superior buyer value in existing markets, a
  quantum leap to new ones — and a new technology only counts once it is cheap enough for mass buyers; "What if"
  questions are the starting points, answered only when a business model makes them work.
SUBJECT: the "rethought value" box (the one accent outline); everything above feeds it, everything below asks of it.
BEAT 1 (0–20%): the existing market: riders who need to get places, cars, drivers, the internet (the lecture's Uber).
  Fade in, opacity scrubbed, ease none. Caption: the pieces were already there.
BEAT 2 (20–40%): arrow down to the accent box "superior buyer value in existing markets → a quantum leap to new
  markets"; two faint struck-through lines beside it: layers of competitive advantage; segmenting the market.
BEAT 3 (40–60%): the mass-buyer line: a new technology sits above the price line ("not yet value innovation"); the
  label "cheap enough for mass buyers → value innovation" fades in at the line.
BEAT 4 (60–80%): "What if…?" — the status quo stifles imagination; newspapers going purely digital: issues, benefits,
  costs. Starting points, not answers.
BEAT 5 (80–100%): three answered what-ifs (Osterwalder and Pigneur, 2010): IKEA (1950s flat packs), Skype (2003; 400
  million users, 100 billion free calls), Grameenphone (a telephone for every villager; largest taxpayer).
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all five captions stacked (base, off); calm tweens beats quickly; opacity only.
BUDGET: < 6 KB gz, no WebGL. Single 360-unit canvas capped at 480 px wide.
Source: concept mgmt2094-w08-value-innovation-and-what-if (Week 8 slides 15–17; lecture recording on Uber and
  Airbnb); authorities mgmt2094-example-uber-and-airbnb, mgmt2094-example-ikea-flat-packs, mgmt2094-example-skype,
  mgmt2094-example-grameenphone.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)' } as const;
const serif = { fontFamily: 'var(--font-body)' } as const;
const op = (t: number, start: number) => Math.max(0, Math.min(1, (t - start) / 0.5));

const PIECES = ['riders', 'cars', 'drivers', 'internet'];
const ANSWERED = [
  { who: 'IKEA', when: '1950s', what: 'flat packs, DIY assembly' },
  { who: 'Skype', when: '2003', what: '400m users, 100bn free calls' },
  { who: 'Grameenphone', when: '', what: 'a phone for every villager' },
];

function scene(t: number) {
  return (
    <svg viewBox={`0 0 ${W} 460`} style={{ maxWidth: 480 }} role="img" aria-label="Value innovation: existing pieces, rethought value, the mass-buyer test, then what-if questions and three that got answered">
      <g style={{ opacity: op(t, 0) }}>
        <text x={W / 2} y="18" textAnchor="middle" {...ui} fontSize="10.5" letterSpacing="1.2" fill="var(--ink-2)">ALREADY THERE</text>
        {PIECES.map((p, k) => (
          <g key={p}>
            <rect x={16 + k * 84} y="30" width="76" height="34" rx="8" fill="none" stroke="var(--ink-3)" strokeWidth="1.2" />
            <text x={54 + k * 84} y="52" textAnchor="middle" {...serif} fontSize="12.5" fill="var(--ink)">{p}</text>
          </g>
        ))}
      </g>
      <g style={{ opacity: op(t, 1) }}>
        <line x1={W / 2} y1="70" x2={W / 2} y2="92" stroke="var(--ink)" strokeWidth="1.5" />
        <path d={`M${W / 2} 98 L${W / 2 - 6} 88 L${W / 2 + 6} 88 Z`} fill="var(--ink)" />
        <rect x="40" y="102" width={W - 80} height="58" rx="10" fill="none" stroke="var(--accent)" strokeWidth="2" />
        <text x={W / 2} y="124" textAnchor="middle" {...serif} fontSize="13" fill="var(--ink)">superior buyer value in existing markets</text>
        <text x={W / 2} y="146" textAnchor="middle" {...serif} fontSize="13" fill="var(--ink)">→ a quantum leap to new markets</text>
        <text x={W / 2} y="180" textAnchor="middle" {...serif} fontSize="11.5" fill="var(--ink-3)" textDecoration="line-through">layers of competitive advantage · segmenting the market</text>
      </g>
      <g style={{ opacity: op(t, 2) }}>
        <text x="16" y="208" {...ui} fontSize="10.5" letterSpacing="1.2" fill="var(--ink-2)">THE TECHNOLOGY TEST</text>
        <line x1="16" y1="250" x2={W - 16} y2="250" stroke="var(--ink)" strokeWidth="1.5" />
        <text x={W - 16} y="266" textAnchor="end" {...serif} fontSize="11.5" fill="var(--ink-2)">price mass buyers can pay</text>
        <circle cx="70" cy="226" r="6" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="84" y="230" {...serif} fontSize="12" fill="var(--ink)">new technology, too dear: not yet</text>
        <g style={{ opacity: op(t, 2.5) }}>
          <circle cx="70" cy="250" r="6" fill="var(--ink)" />
          <text x="16" y="284" {...serif} fontSize="12" fill="var(--ink)">cheap enough for mass buyers → value innovation</text>
        </g>
      </g>
      <g style={{ opacity: op(t, 3) }}>
        <line x1="16" y1="300" x2={W - 16} y2="300" stroke="var(--ink-3)" strokeWidth="1" />
        <text x="16" y="322" {...ui} fontSize="10.5" letterSpacing="1.2" fill="var(--ink-2)">WHAT IF…?</text>
        <text x="16" y="342" {...serif} fontSize="12.5" fill="var(--ink)">…newspapers went purely digital?</text>
        <text x="16" y="360" {...serif} fontSize="12" fill="var(--ink-2)">issues · benefits · costs: a starting point</text>
      </g>
      <g style={{ opacity: op(t, 4) }}>
        <text x="16" y="388" {...ui} fontSize="10.5" letterSpacing="1.2" fill="var(--ink-2)">ANSWERED (OSTERWALDER AND PIGNEUR, 2010)</text>
        {ANSWERED.map((a, k) => (
          <g key={a.who}>
            <text x="16" y={408 + k * 18} {...ui} fontSize="12" fill="var(--ink)">{a.who}{a.when ? ` · ${a.when}` : ''}</text>
            <text x={W - 16} y={408 + k * 18} textAnchor="end" {...serif} fontSize="12" fill="var(--ink-2)">{a.what}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function ValueInnovationAndWhatIf() {
  return (
    <ScrollExplainer
      label="Value innovation and what-if questions, built up in five beats"
      terms={[
        { term: 'Value innovation', def: 'Offering superior buyer value in existing markets, enabling a quantum leap to create new markets.' },
        { term: 'Mass buyers', def: 'The broad market; new technology must be cheap enough for them to count as value innovation.' },
        { term: '"What if" question', def: 'A provocative question about a conventional assumption — a starting point for a business model.' },
      ]}
      beats={[
        { caption: "Start with what is already there. In the lecture's Uber example, people needed to get places, and the cars, the drivers and the internet all existed." },
        { caption: 'Value innovation rethinks the value: superior buyer value in existing markets, enabling a quantum leap to new markets. It is not building layers of competitive advantage, and not segmenting the market.' },
        { caption: 'It also differs from technology innovation: a new technology does not become a value innovation unless it is cheap enough for mass buyers.' },
        { caption: 'The status quo stifles imagination, so ask "What if" of conventional assumptions — what if newspapers went purely digital? Weigh the issues, benefits and costs: it is a starting point, not an answer.' },
        { caption: 'What-ifs that got answered with a business model (Osterwalder and Pigneur, 2010): IKEA\'s flat packs in the 1950s; Skype\'s free calls from 2003 — 400 million users and 100 billion free calls in five years; Grameenphone, now Bangladesh\'s largest taxpayer.' },
      ]}
      scene={scene}
      check={{
        question: 'A firm builds a water-purifying membrane that works perfectly but costs ten times what households can pay. On the Week 8 slides, is it a value innovation?',
        options: [
          { text: 'Yes: it is a new technology that works', why: 'Working technology is not enough: the slide says new technology is not a value innovation unless it is cheap enough for mass buyers.' },
          { text: 'Not yet: it is not cheap enough for mass buyers', correct: true, why: 'Value innovation differs from technology innovation; until mass buyers can afford it, the membrane does not create superior buyer value for the market.' },
          { text: 'Yes, once it is patented', why: 'Patents play no part in the slide\'s test; the test is buyer value at a price mass buyers can pay.' },
        ],
      }}
    />
  );
}
