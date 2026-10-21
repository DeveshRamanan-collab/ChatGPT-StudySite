/*
SCENE: Identifying an interesting problem — the question does the work
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise (ScrollExplainer base)
BEATS: 4
INTENT: Show that the first step of creative problem solving is a question, not an answer: most of the hour goes on
  defining the problem, and each of the lecture's three breakthroughs began with an important question.
SUBJECT: the hour bar, then each question's arrow drawing across to what it led to.
BEAT 1 (0–25%): an hour as 60 cells fills — 59 "defining the problem", 1 "solving it" (the slide's Einstein line).
  Reveal: clip-path, ease none (scrubbed).
BEAT 2 (25–50%): "Why is the speed of light the same everywhere?" → the discovery of relativity by Einstein.
BEAT 3 (50–75%): "How to use colours differently?" → impressionism.
BEAT 4 (75–100%): "How to make bus stop shelters viable?" → the worldwide success of Decaux; the two related
  qualities appear beneath: listen to the unusual; identify consequences that make the subject essential.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked (base).
BUDGET: < 6 KB gz, no WebGL. Wide and tall variants so text stays legible at 390px.
Source: concept mgmt2094-w02-problem-identification; week 2 lecture slides 3–4; example cards
  mgmt2094-example-einstein-relativity, mgmt2094-example-impressionism, mgmt2094-example-decaux.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const QUESTIONS = [
  { q: 'Why is the speed of light the same everywhere?', led: 'the discovery of relativity by Einstein', at: 1 },
  { q: 'How to use colours differently?', led: 'impressionism', at: 2 },
  { q: 'How to make bus stop shelters viable?', led: 'the worldwide success of Decaux', at: 3 },
];

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const fade = (on: boolean) => ({ opacity: on ? 1 : 0, transition: 'opacity 240ms var(--ease-out)' });

function HourBar({ x, y, w, t, small }: { x: number; y: number; w: number; t: number; small?: boolean }) {
  const cell = w / 60;
  const fill = clamp(t) * 100;
  return (
    <g data-part="hour">
      <g style={{ clipPath: `inset(0 ${100 - fill}% 0 0)` }}>
        {Array.from({ length: 60 }, (_, k) => (
          <rect key={k} x={x + k * cell + 0.5} y={y} width={cell - 1} height={small ? 18 : 24} rx="1.5"
            fill={k < 59 ? 'var(--ink)' : 'none'} stroke="var(--ink)" strokeWidth="1" opacity={k < 59 ? 0.75 : 1} />
        ))}
      </g>
      <text x={x} y={y + (small ? 38 : 46)} fontFamily="var(--font-ui)" fontSize={small ? 12.5 : 13} fill="var(--ink-2)" style={fade(t > 0.5)}>
        59 minutes defining the problem
      </text>
      <text x={x + w} y={y + (small ? 38 : 46)} textAnchor="end" fontFamily="var(--font-ui)" fontSize={small ? 12.5 : 13} fill="var(--ink-2)" style={fade(t > 0.9)}>
        1 to solve it
      </text>
    </g>
  );
}

function wide(t: number) {
  return (
    <svg className="x-wide" viewBox="0 0 760 360" role="img" aria-label="An hour bar of 59 minutes defining the problem and one minute solving it, then three questions with arrows to what each led to">
      <text x="40" y="22" fontFamily="var(--font-ui)" fontSize="12" letterSpacing="1" fill="var(--ink-2)">ONE HOUR TO SAVE THE WORLD (attributed to Einstein)</text>
      <HourBar x={40} y={36} w={680} t={t} />
      {QUESTIONS.map((r, i) => {
        const y = 140 + i * 62;
        const draw = clamp(t - r.at);
        return (
          <g key={r.q} style={fade(t >= r.at)} data-question={i + 1}>
            <text x="40" y={y} fontFamily="var(--font-body)" fontSize="15" fill="var(--ink)">{r.q}</text>
            <g style={{ clipPath: `inset(0 ${100 - draw * 100}% 0 0)` }}>
              <line x1="396" y1={y - 5} x2="446" y2={y - 5} stroke="var(--ink-3)" strokeWidth="1.5" />
              <path d={`M440 ${y - 10} L448 ${y - 5} L440 ${y}`} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
            </g>
            <text x="458" y={y} fontFamily="var(--font-ui)" fontSize="13.5" fill="var(--ink-2)" style={fade(draw > 0.6)}>{r.led}</text>
          </g>
        );
      })}
      <g style={fade(t >= 3.6)} data-part="qualities">
        <line x1="40" y1="318" x2="720" y2="318" stroke="var(--line)" strokeWidth="1" />
        <text x="40" y="344" fontFamily="var(--font-ui)" fontSize="13" fill="var(--ink-2)">Related qualities: listen to the unusual · identify consequences that make the subject essential</text>
      </g>
    </svg>
  );
}

function tall(t: number) {
  return (
    <svg className="x-tall" viewBox="0 0 360 560" role="img" aria-label="An hour bar of 59 minutes defining the problem and one minute solving it, then three questions, each above what it led to">
      <text x="20" y="18" fontFamily="var(--font-ui)" fontSize="11.5" letterSpacing="1" fill="var(--ink-2)">ONE HOUR TO SAVE THE WORLD</text>
      <HourBar x={20} y={30} w={320} t={t} small />
      {QUESTIONS.map((r, i) => {
        const y = 128 + i * 120;
        const draw = clamp(t - r.at);
        return (
          <g key={r.q} style={fade(t >= r.at)} data-question={i + 1}>
            <text x="20" y={y} fontFamily="var(--font-body)" fontSize="14" fill="var(--ink)">{r.q}</text>
            <g style={{ clipPath: `inset(0 0 ${100 - draw * 100}% 0)` }}>
              <line x1="30" y1={y + 12} x2="30" y2={y + 50} stroke="var(--ink-3)" strokeWidth="1.5" />
              <path d={`M25 ${y + 44} L30 ${y + 52} L35 ${y + 44}`} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
            </g>
            <text x="44" y={y + 46} fontFamily="var(--font-ui)" fontSize="14" fill="var(--ink-2)" style={fade(draw > 0.6)}>{r.led}</text>
          </g>
        );
      })}
      <g style={fade(t >= 3.6)} data-part="qualities">
        <line x1="20" y1="492" x2="340" y2="492" stroke="var(--line)" strokeWidth="1" />
        <text x="20" y="516" fontFamily="var(--font-ui)" fontSize="13" fill="var(--ink-2)">Related qualities: listen to the unusual;</text>
        <text x="20" y="536" fontFamily="var(--font-ui)" fontSize="13" fill="var(--ink-2)">identify consequences that make the subject essential</text>
      </g>
    </svg>
  );
}

function scene(t: number) {
  return <>{wide(t)}{tall(t)}</>;
}

export default function ProblemIdentification() {
  return (
    <ScrollExplainer
      label="Identifying an interesting problem: the question comes first"
      terms={[
        { term: 'Interesting problem', def: 'The first step of creative problem solving: find problems, identify needs.' },
        { term: 'Listen to the unusual', def: 'A related quality: notice what does not fit.' },
        { term: 'Consequences', def: 'A related quality: identify the consequences that make the subject essential.' },
      ]}
      beats={[
        { caption: '"If I had one hour to save the world, I would spend 59 minutes defining the problem and one minute solving it" — the slide attributes it to Einstein.' },
        { caption: 'Why is the speed of light the same everywhere? … led to the discovery of relativity by Einstein.' },
        { caption: 'How to use colours differently? … one of the essential questions that led to impressionism.' },
        { caption: 'How to make bus stop shelters viable? … led to the worldwide success of Decaux. Listen to the unusual; identify consequences that make the subject essential.' },
      ]}
      scene={scene}
      check={{
        question: 'Which question does the lecture say led to the worldwide success of Decaux?',
        options: [
          { text: 'How to use colours differently?', why: 'That question is linked to impressionism, not to a business.' },
          { text: 'How to make bus stop shelters viable?', correct: true, why: 'The slide traces Decaux’s worldwide success to asking how to make bus stop shelters viable.' },
          { text: 'Why is the speed of light the same everywhere?', why: 'That question led to the discovery of relativity by Einstein.' },
        ],
      }}
    />
  );
}
