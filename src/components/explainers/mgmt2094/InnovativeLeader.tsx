/*
SCENE: The innovative leader mirrors the innovation culture
LENGTH: 6 screens pinned (desktop, full motion); 6 paced beats otherwise
BEATS: 6
INTENT: Each characteristic of an innovation culture has a matching trait in its leader; risk is both taken
  (willing to experiment) and managed (realistic and informed).
SUBJECT: the arrow drawing from the current culture trait to its leader trait; one pair at a time.
BEAT 1 (0–17%): commitment → passionate about innovation. Arrow reveals by clip-path, leader text fades in. Ease none (scrubbed).
BEAT 2 (17–33%): experiments proactively → willing to experiment.
BEAT 3 (33–50%): manages risk → realistic and informed.
BEAT 4 (50–67%): can implement ideas quickly → capable of rapid project execution.
BEAT 5 (67–83%): produces and cultivates innovators → able to attract and nurture innovators.
BEAT 6 (83–100%): the Steve Jobs quote from "How to lead innovation" fades in beneath the pairs.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all six captions stacked.
BUDGET: < 8 KB gz, no WebGL. Wide two-column SVG; a stacked SVG under 640px so text stays legible on phones.
Source: concept mgmt2094-w12-innovative-leader (Week 12 slides 6–8); authority mgmt2094-example-steve-jobs.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const PAIRS: { culture: string[]; leader: string[] }[] = [
  { culture: ['Shows organisation-wide commitment', 'to the business and to innovation'], leader: ['Passionate about innovation'] },
  { culture: ['Experiments proactively'], leader: ['Willing to experiment'] },
  { culture: ['Manages risk'], leader: ['Realistic and informed'] },
  { culture: ['Can implement ideas quickly'], leader: ['Capable of rapid project execution'] },
  { culture: ['Produces and cultivates innovators'], leader: ['Able to attract and nurture innovators'] },
];

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ui = { fontFamily: 'var(--font-ui)' } as const;
const serif = { fontFamily: 'var(--font-body)' } as const;

function wide(t: number) {
  const ROW = 64, TOP = 56;
  return (
    <svg className="x-wide" viewBox="0 0 760 470" role="img" aria-label="Five culture characteristics on the left, each with an arrow to the matching leader trait on the right">
      <text x="290" y="20" textAnchor="end" {...ui} fontSize="12" letterSpacing="1.2" fill="var(--ink-2)">INNOVATION CULTURE</text>
      <text x="440" y="20" {...ui} fontSize="12" letterSpacing="1.2" fill="var(--ink-2)">INNOVATION LEADER</text>
      {PAIRS.map((p, i) => {
        const prog = clamp(t - i);
        const y = TOP + i * ROW;
        const active = t >= i && t < i + 1;
        return (
          <g key={i} data-pair={i + 1}>
            {p.culture.map((l, k) => (
              <text key={k} x="290" y={y + k * 18 - (p.culture.length - 1) * 9} textAnchor="end" {...serif} fontSize="15" fill={prog > 0 ? 'var(--ink)' : 'var(--ink-2)'}>{l}</text>
            ))}
            <g style={{ clipPath: `inset(0 ${100 - prog * 100}% 0 0)` }}>
              <line x1="304" y1={y - 5} x2="424" y2={y - 5} stroke={active ? 'var(--accent)' : 'var(--ink-3)'} strokeWidth="1.5" />
              <path d={`M416 ${y - 10} L426 ${y - 5} L416 ${y}`} fill="none" stroke={active ? 'var(--accent)' : 'var(--ink-3)'} strokeWidth="1.5" />
            </g>
            <text x="440" y={y} {...serif} fontSize="15" fontWeight="600" fill="var(--ink)" style={{ opacity: clamp((prog - 0.4) / 0.6) }}>{p.leader[0]}</text>
          </g>
        );
      })}
      <g style={{ opacity: clamp(t - 5) }} data-quote>
        <line x1="40" y1="388" x2="720" y2="388" stroke="var(--line)" strokeWidth="1" />
        <text x="380" y="420" textAnchor="middle" {...serif} fontStyle="italic" fontSize="17" fill="var(--ink)">"Innovation distinguishes between a leader and a follower."</text>
        <text x="380" y="446" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">Steve Jobs, quoted on "How to lead innovation"</text>
      </g>
    </svg>
  );
}

// Narrow: each pair stacked (culture lines, a short down-arrow, the leader trait), one column, full width for text.
const LINE = 19, GAP = 30;
const TALL_Y = PAIRS.reduce<number[]>((ys, _p, i) => {
  const prev = i === 0 ? 40 : ys[i - 1] + PAIRS[i - 1].culture.length * LINE + 34 + GAP;
  return [...ys, prev];
}, []);

function tall(t: number) {
  const last = PAIRS.length - 1;
  const H = TALL_Y[last] + PAIRS[last].culture.length * LINE + 34 + 100;
  return (
    <svg className="x-tall" viewBox={`0 0 360 ${H}`} role="img" aria-label="Each culture characteristic above its matching leader trait, five pairs in a column">
      <text x="12" y="16" {...ui} fontSize="11" letterSpacing="1" fill="var(--ink-2)">CULTURE ↓ LEADER</text>
      {PAIRS.map((p, i) => {
        const prog = clamp(t - i);
        const y = TALL_Y[i];
        const below = y + (p.culture.length - 1) * LINE;
        const active = t >= i && t < i + 1;
        return (
          <g key={i} data-pair={i + 1}>
            {p.culture.map((l, k) => (
              <text key={k} x="12" y={y + k * LINE} {...serif} fontSize="15" fill={prog > 0 ? 'var(--ink)' : 'var(--ink-2)'}>{l}</text>
            ))}
            <g style={{ clipPath: `inset(0 0 ${100 - prog * 100}% 0)` }}>
              <line x1="20" y1={below + 8} x2="20" y2={below + 24} stroke={active ? 'var(--accent)' : 'var(--ink-3)'} strokeWidth="1.5" />
              <path d={`M15 ${below + 18} L20 ${below + 25} L25 ${below + 18}`} fill="none" stroke={active ? 'var(--accent)' : 'var(--ink-3)'} strokeWidth="1.5" />
            </g>
            <text x="12" y={below + 44} {...serif} fontSize="15" fontWeight="600" fill="var(--ink)" style={{ opacity: clamp((prog - 0.4) / 0.6) }}>{p.leader[0]}</text>
          </g>
        );
      })}
      <g style={{ opacity: clamp(t - 5) }} data-quote>
        <text x="180" y={H - 60} textAnchor="middle" {...serif} fontStyle="italic" fontSize="15" fill="var(--ink)">"Innovation distinguishes between</text>
        <text x="180" y={H - 40} textAnchor="middle" {...serif} fontStyle="italic" fontSize="15" fill="var(--ink)">a leader and a follower."</text>
        <text x="180" y={H - 16} textAnchor="middle" {...ui} fontSize="12" fill="var(--ink-2)">Steve Jobs</text>
      </g>
    </svg>
  );
}

function scene(t: number) {
  return <>{wide(t)}{tall(t)}</>;
}

export default function InnovativeLeader() {
  return (
    <ScrollExplainer
      label="Characteristics of an innovative leader, matched to the innovation culture"
      terms={[
        { term: 'Innovation culture', def: 'Five characteristics: commitment, proactive experiments, managed risk, quick implementation, cultivated innovators.' },
        { term: 'Innovative leader', def: 'Passionate about the company, obsessed with restoring innovation, willing to take and able to manage risks, quick to start projects.' },
        { term: 'Realistic and informed', def: 'The leader trait that matches the culture\'s "manages risk".' },
        { term: 'Rapid project execution', def: 'The leader trait that matches the culture\'s "can implement ideas quickly".' },
      ]}
      beats={[
        { caption: 'Organisation-wide commitment to the business and to innovation needs a leader who is passionate about innovation.' },
        { caption: 'A culture that experiments proactively needs a leader who is willing to experiment.' },
        { caption: 'A culture that manages risk needs a leader who is realistic and informed: risk is taken, and managed.' },
        { caption: 'A culture that can implement ideas quickly needs a leader capable of rapid project execution.' },
        { caption: 'A culture that produces and cultivates innovators needs a leader able to attract and nurture them.' },
        { caption: 'How to lead innovation, in Steve Jobs\'s words: innovation distinguishes between a leader and a follower.' },
      ]}
      scene={scene}
      check={{
        question: 'Which leader trait matches the culture characteristic "manages risk"?',
        options: [
          { text: 'Willing to experiment', why: 'That matches "experiments proactively"; the risk-managing match is being realistic and informed.' },
          { text: 'Realistic and informed', correct: true, why: 'The characteristics slide pairs the culture\'s "manages risk" with a leader who is realistic and informed.' },
          { text: 'Capable of rapid project execution', why: 'That matches "can implement ideas quickly", not managing risk.' },
        ],
      }}
    />
  );
}
