/*
SCENE: Threat, breach or aggression — the art 39 findings in practice
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
BEATS: 1 art 39: any one of three findings opens Chapter VII · 2 act of aggression: never or very rarely ·
  3 breach of the peace: a very few invasions · 4 threat to the peace: the usual, widening finding ·
  5 the Cold War deadlock and the busier Council since
INTENT: Show that the three art 39 findings are used very unequally, so the threat to the peace — flexible and
  widening — is the Council's real route into Chapter VII, and that politics (the Cold War, the veto) limits it.
SUBJECT: the usage bar in each finding's box; it grows from a stub (aggression) to the full width (threat).
BEAT 1 (0–20%): the art 39 gateway box. BEAT 2 (20–40%): aggression box, its bar a stub. BEAT 3 (40–60%): breach
  box, a short bar. BEAT 4 (60–80%): threat box, a full-width bar (heavier stroke). BEAT 5 (80–100%): the Cold War
  band. Each bar is a stroked line drawn on by the base, so its growth is the comparison. Scrubbed, ease: none.
CAMERA: none (SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished diagram with all five captions stacked (base).
BUDGET: < 6 KB gz, no WebGL. Narrow 360-unit canvas for phone legibility.
Source: concept laws2000-w10-article-39-findings-in-practice; Week 10 slides 15–16, 25, 44; Week 10 live lecture
  transcript, Part A.1; UN Charter arts 27(3), 39. Bar lengths are qualitative (the lecture's "never or very
  rarely", "a very few", "much more common"), not counts.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;

function Finding({ y, h, title, lines, id, bar, heavy }: { y: number; h: number; title: string; lines: string[]; id: string; bar: number; heavy?: boolean }) {
  return (
    <>
      <rect x="8" y={y} width={W - 16} height={h} rx="12" fill="none" stroke="var(--ink)" strokeWidth={heavy ? 3 : 1.5} />
      <text x={W / 2} y={y + 26} textAnchor="middle" fontFamily="var(--font-ui)" fontSize="13" letterSpacing="1.5" fill="var(--ink)" data-label={id}>{title}</text>
      <line x1="28" y1={y + 42} x2={28 + bar} y2={y + 42} stroke="var(--ink-2)" strokeWidth="6" strokeLinecap="round" />
      {lines.map((l, i) => (
        <text key={i} x={W / 2} y={y + 68 + i * 20} textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">{l}</text>
      ))}
    </>
  );
}

const Join = ({ y1, y2 }: { y1: number; y2: number }) => <line x1={W / 2} y1={y1} x2={W / 2} y2={y2} stroke="var(--ink-3)" strokeWidth="1.5" />;

const FULL = W - 56;

const figure = (
  <svg viewBox={`0 0 ${W} 742`} role="img" aria-label="Art 39's three findings by use: act of aggression never or very rarely, breach of the peace a very few invasions, threat to the peace the usual and widening finding; Cold War deadlock limited all three">
    <g data-step="1">
      <rect x="8" y="8" width={W - 16} height="112" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="34" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="13" letterSpacing="1.5" fill="var(--ink)" data-label="art-39">ART 39 · ANY ONE FINDING</text>
      <text x={W / 2} y="58" textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">threat · breach · aggression</text>
      <text x={W / 2} y="78" textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">→ Chapter VII opens (arts 41, 42)</text>
      <text x={W / 2} y="98" textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">no finding → Chapter VI only</text>
    </g>
    <g data-step="2">
      <Join y1={120} y2={140} />
      <Finding id="aggression" y={140} h={108} bar={6} title="ACT OF AGGRESSION" lines={['never or very rarely found', 'overlaps with breach']} />
    </g>
    <g data-step="3">
      <Join y1={248} y2={268} />
      <Finding id="breach" y={268} h={108} bar={60} title="BREACH OF THE PEACE" lines={['a very few invasions of territory', 'e.g. Iraq–Kuwait 1990']} />
    </g>
    <g data-step="4">
      <Join y1={376} y2={396} />
      <Finding id="threat" heavy y={396} h={168} bar={FULL} title="THREAT TO THE PEACE" lines={['the usual finding — and widening:', 'proliferation · terrorism', 'internal armed conflict', 'serious human rights or IHL', 'violations · Ebola 2014']} />
    </g>
    <g data-step="5">
      <rect x="8" y="594" width={W - 16} height="140" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 5" />
      <text x={W / 2} y="620" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="13" letterSpacing="1.5" fill="var(--ink)" data-label="cold-war">COLD WAR · AND AFTER</text>
      <text x={W / 2} y="646" textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">US–Russia tension, proxy wars:</text>
      <text x={W / 2} y="666" textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">few determinations agreed</text>
      <text x={W / 2} y="686" textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">since: a far more active Council</text>
      <text x={W / 2} y="706" textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">the veto (art 27(3)) still limits it</text>
    </g>
  </svg>
);

export default function Article39FindingsInPractice() {
  return (
    <Diagram
      label="The three art 39 findings in practice: aggression rarely, breach a few times, threat to the peace usually"
      terms={[
        { term: 'Threat to the peace', def: 'The flexible art 39 finding: the Council’s usual route into Chapter VII.' },
        { term: 'Breach of the peace', def: 'A finding made only a very few times, each for an invasion of territory.' },
        { term: 'Act of aggression', def: 'The third art 39 finding — never, or only very rarely, made by the Council.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Art 39: the Council must determine a threat to the peace, a breach of the peace or an act of aggression. Any one opens arts 41 and 42; without one, only Chapter VI.' },
        { caption: 'Act of aggression: the lecture explained that the Council has never, or only very rarely, made this finding. It overlaps with a breach — an invasion can be both.' },
        { caption: 'Breach of the peace: found on a very few occasions, each an invasion of territory — Iraq’s invasion of Kuwait in 1990 is the example.' },
        { caption: 'Threat to the peace: by far the most common finding, widened since 1945 from inter-state invasion to proliferation, terrorism, internal conflict, serious violations and the 2014 Ebola outbreak.' },
        { caption: 'During the Cold War, US–Russia tension (often through proxies) made determinations hard to agree; the Council has been far more active since, though the P-5 veto still limits it.' },
      ]}
      check={{
        question: 'A civil war is producing refugee flows into neighbouring states. Which art 39 finding should you argue the Council would make?',
        options: [
          { text: 'An act of aggression', why: 'The Council has never or very rarely found aggression, and a civil war is not one state invading another.' },
          { text: 'A threat to the peace', correct: true, why: 'The usual, flexible finding: practice covers internal armed conflicts and serious violations, and refugee flows add a cross-border dimension.' },
          { text: 'A breach of the peace', why: 'Breach findings have been made only a very few times, each for an invasion of territory such as Iraq–Kuwait 1990.' },
        ],
      }}
    />
  );
}
