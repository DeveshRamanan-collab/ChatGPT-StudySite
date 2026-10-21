/*
SCENE: Four routes away from "normality" — the psychoanalytical, mental illness, addiction and psychoticism theories
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: These four theories share one shape: creativity comes from moving away from a stable, secure "normal" state;
  each names a different route (hardship, mild illness, substances, an anti-convention disposition) and the slides
  give each its proponents and its limit.
SUBJECT: the spine leaving the "normal" box; each route branches off it in turn.
STEPS: 1 the normal state · 2 psychoanalytical · 3 mental illness · 4 addiction · 5 psychoticism.
REDUCED MOTION: the finished diagram with all five captions stacked.
BUDGET: < 8 KB gz (DrawSVG is in the shared motion chunk). Vertical layout so text stays legible on phones.
Source: concept mgmt2094-w05-psychological-theories-of-creativity (Week 5 lecture slides 6–9; lecture transcript);
  authority mgmt2094-example-verhaeghen-reflective-mode.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const SPINE = 34;
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const names = { fontFamily: 'var(--font-ui)', fontSize: 11, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink)' } as const;

const ROUTES = [
  { id: 'psychoanalytical', title: 'PSYCHOANALYTICAL', who: 'Jung; Freud, Adler and Hammer', lines: ['a reaction to difficult circumstances', 'and repressed emotions; inferiority', '“unsatisfied wishes … fantasies”'] },
  { id: 'mental-illness', title: 'MENTAL ILLNESS', who: 'Briggs; Eisemann; Goodman', lines: ['some mental illness, not severe', 'severe impedes; bipolar, mood swings', 'reflection: creative, but depression'] },
  { id: 'addiction', title: 'ADDICTION', who: 'Lapp, Collins, Norlander and Wallas', lines: ['substances remove inhibiting stress', 'against: creative tendencies make', 'people more prone to addiction'] },
  { id: 'psychoticism', title: 'PSYCHOTICISM', who: 'Eysenck', lines: ['halfway between “normal” and', 'psychosis: rejects norms; risk', 'taking, impulsive, spontaneous'] },
] as const;

const TOP = 128;
const GAP = 128;
const BOX_H = 108;

const figure = (
  <svg viewBox={`0 0 ${W} ${TOP + GAP * 3 + BOX_H + 8}`} role="img" aria-label="A 'normal' state at the top, with four routes away from it: psychoanalytical, mental illness, addiction and psychoticism">
    <g data-step="1">
      <rect x="8" y="8" width={W - 16} height="88" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="34" textAnchor="middle" {...head} data-label="normal">THE “NORMAL” STATE</text>
      <text x={W / 2} y="58" textAnchor="middle" {...body} fill="var(--ink-2)">stable, secure, well fed, healthy</text>
      <text x={W / 2} y="80" textAnchor="middle" {...body} fill="var(--ink-2)">creativity means moving away from it</text>
    </g>
    {ROUTES.map((r, i) => {
      const y = TOP + i * GAP;
      const from = i === 0 ? 96 : y - GAP + BOX_H / 2;
      return (
        <g key={r.id} data-step={i + 2}>
          <line x1={SPINE} y1={from} x2={SPINE} y2={y + BOX_H / 2} stroke="var(--ink-3)" strokeWidth="1.5" />
          <line x1={SPINE} y1={y + BOX_H / 2} x2="56" y2={y + BOX_H / 2} stroke="var(--ink-3)" strokeWidth="1.5" />
          <polyline points={`50,${y + BOX_H / 2 - 5} 56,${y + BOX_H / 2} 50,${y + BOX_H / 2 + 5}`} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
          <rect x="60" y={y} width={W - 68} height={BOX_H} rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
          <text x="74" y={y + 22} {...head} data-label={r.id}>{r.title}</text>
          <text x="74" y={y + 39} {...names}>{r.who}</text>
          {r.lines.map((l, k) => (
            <text key={k} x="74" y={y + 62 + k * 18} {...body}>{l}</text>
          ))}
        </g>
      );
    })}
  </svg>
);

export default function PsychologicalTheoriesOfCreativity() {
  return (
    <Diagram
      label="Four theories that trace creativity to a departure from the normal state"
      terms={[
        { term: 'Normality', def: 'The lecture’s stable, secure, calm state — the place these theories say creativity moves away from.' },
        { term: 'Repressed emotions', def: 'Feelings held back after difficult events; the psychoanalytical theory sees creativity as their outlet.' },
        { term: 'Psychoticism', def: 'Eysenck’s disposition halfway between a “normal” person and psychosis.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'The lecture frames these theories around normality — a stable, secure, calm state. To be creative you have to move away from it in one way or another.' },
        { caption: 'Psychoanalytical (Jung; Freud, Adler and Hammer): people become more creative as a reaction to difficult circumstances and repressed emotions; a sense of inferiority can contribute.' },
        { caption: 'Mental illness (Briggs; Eisemann; Goodman): some form of mental illness, but not severe, which impedes. Verhaeghen and colleagues: a reflective mode makes people more creative but can lead to depression.' },
        { caption: 'Addiction (Lapp, Collins, Norlander and Wallas): substances remove the stress that inhibits creativity. Against it: addiction does not cause creativity; creative people are more prone to addiction.' },
        { caption: 'Psychoticism (Eysenck): creative people have a disposition halfway to psychosis — rejecting social, cultural or authoritarian norms; risk taking, impulsive, spontaneous.' },
      ]}
      check={{
        question: 'A songwriter’s most original album followed a painful year in which she withdrew from friends. Which theory explains this most directly?',
        options: [
          { text: 'Psychoticism', why: 'Psychoticism rests on an anti-convention, impulsive disposition; the story turns on hardship and withdrawal instead.' },
          { text: 'Psychoanalytical theory', correct: true, why: 'After a difficult event people pull back from their surroundings and rely on their creative side as an outlet — the psychoanalytical tenet.' },
          { text: 'Addiction theory', why: 'Nothing in the story involves substances removing stress, which is what the addiction theory turns on.' },
        ],
      }}
    />
  );
}
