/*
SCENE: Running a six hats session — the blue hat and the rules
LENGTH: 5 screens pinned (desktop, full motion); 5 paced beats otherwise (ScrollExplainer base)
BEATS: 5
INTENT: Show a session as a line that the blue hat opens, steers and closes, with short stretches under other hats in
  between, and that every person passes through every hat (hats are directions, not categories of people).
SUBJECT: the session line, revealed left → right (top → bottom on phones).
BEAT 1 (0–20%): blue opening node; caption: focus, what thinking is needed. Reveal: clip-path, ease none (scrubbed).
BEAT 2 (20–40%): short hat stretches (white, yellow, black, green) appear along the line; caption: any hat, as often
  as needed, not every hat, each short; sequence preset or evolving.
BEAT 3 (40–60%): the black stretch carries "risks only" — stay in the idiom; direction, not description.
BEAT 4 (60–80%): blue closing node; caption: achieved, outcome, conclusion, next steps.
BEAT 5 (80–100%): three people-lines run through every stretch; caption: not categories of people.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all five captions stacked (base).
BUDGET: < 8 KB gz, no WebGL. Wide (landscape) and tall (phone) drawings of the same scene.
Source: concept mgmt2094-w04-running-a-hats-session (Week 4 slides 8, 9, 30, 31, 32; Kivunja 2015; lecture).
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

interface Stop { key: string; label: string; note: string; at: number; blue?: boolean }

// In session order; `at` is the time (beats) at which each stop appears.
const STOPS: Stop[] = [
  { key: 'open', label: 'BLUE', note: 'open: focus? thinking needed?', at: 0.15, blue: true },
  { key: 'white', label: 'white', note: 'facts', at: 1.1 },
  { key: 'yellow', label: 'yellow', note: 'benefits', at: 1.35 },
  { key: 'black', label: 'black', note: 'risks only', at: 1.6 },
  { key: 'green', label: 'green', note: 'new ideas', at: 1.85 },
  { key: 'close', label: 'BLUE', note: 'close: outcome, next steps', at: 3.15, blue: true },
];

const fade = (on: boolean) => ({ opacity: on ? 1 : 0, transition: 'opacity 240ms var(--ease-out)' });
const ui = { fontFamily: 'var(--font-ui)' } as const;

function wide(t: number) {
  const reveal = Math.min(100, (Math.min(t, 4) / 4) * 100);
  const xs = [70, 230, 330, 430, 530, 680];
  const Y = 130;
  return (
    <svg className="x-wide" viewBox="0 0 760 300" role="img" aria-label="A session line: blue hat opens, short white, yellow, black and green stretches, blue hat closes; three people pass through every hat">
      <g style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}>
        <line x1={70} y1={Y} x2={680} y2={Y} stroke="var(--ink)" strokeWidth="2" />
      </g>
      {STOPS.map((s, i) => {
        const on = t >= s.at;
        const x = xs[i];
        return (
          <g key={s.key} style={fade(on)} data-stop={s.key}>
            {s.blue ? (
              <circle cx={x} cy={Y} r="26" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
            ) : (
              <rect x={x - 40} y={Y - 16} width="80" height="32" rx="8" fill="var(--paper)" stroke={s.key === 'black' && t >= 2 && t < 3 ? 'var(--ink)' : 'var(--ink-3)'} strokeWidth={s.key === 'black' && t >= 2 && t < 3 ? 2.5 : 1.5} />
            )}
            <text x={x} y={Y + 5} textAnchor="middle" fontSize={s.blue ? 13 : 14} letterSpacing={s.blue ? 1 : 0} fill="var(--ink)" {...ui}>{s.label}</text>
            <text x={s.key === 'close' ? x + 26 : s.key === 'open' ? x - 26 : x} y={s.blue ? Y - 40 : Y + 40} textAnchor={s.key === 'close' ? 'end' : s.key === 'open' ? 'start' : 'middle'} fontSize="13" fill="var(--ink-2)" {...ui}>{s.note}</text>
          </g>
        );
      })}
      <g style={fade(t >= 2.1)}>
        <text x={380} y={Y - 74} textAnchor="middle" fontSize="13" fill="var(--ink-2)" {...ui}>direction, not description: “let's have some black hat thinking…”</text>
      </g>
      <g style={fade(t >= 4.1)}>
        {[214, 232, 250].map((y, k) => (
          <g key={y}>
            <line x1={70} y1={y} x2={680} y2={y} stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="2 6" strokeLinecap="round" />
            <text x={60} y={y + 4} textAnchor="end" fontSize="12" fill="var(--ink-2)" {...ui}>{['Ana', 'Ben', 'Cy'][k]}</text>
          </g>
        ))}
        <text x={380} y={282} textAnchor="middle" fontSize="13" fill="var(--ink)" {...ui}>everyone wears every hat — not categories of people</text>
      </g>
    </svg>
  );
}

function tall(t: number) {
  const reveal = Math.min(100, (Math.min(t, 4) / 4) * 100);
  const ys = [48, 160, 225, 290, 355, 470];
  const X = 70;
  return (
    <svg className="x-tall" viewBox="0 0 360 600" role="img" aria-label="A session line from top to bottom: blue hat opens, short white, yellow, black and green stretches, blue hat closes; three people pass through every hat">
      <g style={{ clipPath: `inset(0 0 ${100 - reveal}% 0)` }}>
        <line x1={X} y1={48} x2={X} y2={470} stroke="var(--ink)" strokeWidth="2" />
      </g>
      {STOPS.map((s, i) => {
        const on = t >= s.at;
        const y = ys[i];
        return (
          <g key={s.key} style={fade(on)} data-stop={s.key}>
            {s.blue ? (
              <circle cx={X} cy={y} r="24" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
            ) : (
              <rect x={X - 34} y={y - 14} width="68" height="28" rx="8" fill="var(--paper)" stroke={s.key === 'black' && t >= 2 && t < 3 ? 'var(--ink)' : 'var(--ink-3)'} strokeWidth={s.key === 'black' && t >= 2 && t < 3 ? 2.5 : 1.5} />
            )}
            <text x={X} y={y + 5} textAnchor="middle" fontSize="13" fill="var(--ink)" {...ui}>{s.label}</text>
            <text x={X + 46} y={y + 5} fontSize="14" fill="var(--ink-2)" {...ui}>{s.note}</text>
          </g>
        );
      })}
      <g style={fade(t >= 2.1)}>
        <text x={X + 46} y={312} fontSize="12.5" fill="var(--ink-2)" {...ui}>stay in the idiom: direction,</text>
        <text x={X + 46} y={328} fontSize="12.5" fill="var(--ink-2)" {...ui}>not description</text>
      </g>
      <g style={fade(t >= 4.1)}>
        {[10, 18, 26].map((x) => (
          <line key={x} x1={x} y1={48} x2={x} y2={470} stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="2 6" strokeLinecap="round" />
        ))}
        <text x={8} y={500} textAnchor="start" fontSize="12" fill="var(--ink-2)" {...ui}>Ana · Ben · Cy</text>
        <text x={20} y={548} fontSize="14" fill="var(--ink)" {...ui}>everyone wears every hat —</text>
        <text x={20} y={570} fontSize="14" fill="var(--ink)" {...ui}>not categories of people</text>
      </g>
    </svg>
  );
}

function scene(t: number) {
  return <>{wide(t)}{tall(t)}</>;
}

export default function RunningAHatsSession() {
  return (
    <ScrollExplainer
      label="A six thinking hats session from blue opening to blue close"
      terms={[
        { term: 'Blue hat', def: "Manages the thinking process: the facilitator's, session leader's role." },
        { term: 'Stay in the idiom', def: "While wearing a hat, keep thinking in that hat's direction." },
        { term: 'Direction, not description', def: 'A hat names how to think now, not what kind of thinker someone is.' },
      ]}
      beats={[
        { caption: 'Begin with the blue hat. The facilitator — not necessarily the manager — asks: what is our focus, and what thinking is needed?' },
        { caption: 'Then short stretches under other hats. Use any hat as often as needed; not every hat is necessary; the sequence can be preset or evolving.' },
        { caption: 'Under each hat, stay in the idiom: in the black stretch, only risks. It is a direction — "let\'s have some black hat thinking" — not a description.' },
        { caption: 'End with the blue hat: what we have achieved, outcome, conclusion, design, solution, next steps.' },
        { caption: 'Hats are not categories of people. Everyone can and should use all the hats — the optimist takes a turn in black, the sceptic in yellow.' },
      ]}
      scene={scene}
      check={{
        question: 'Where does the blue hat belong in a six hats session?',
        options: [
          { text: 'Only at the end, to summarise what was said', why: 'Blue does close the session, but the slides say to begin with it too.' },
          { text: 'At the start and the end, steering the switches in between', correct: true, why: 'Begin and end with blue; Kivunja adds it is used in the middle too, to steer the thinking.' },
          { text: 'Nowhere, if the team manager is present', why: 'The facilitator need not be the manager, and the session is still opened and closed in blue.' },
        ],
      }}
    />
  );
}
