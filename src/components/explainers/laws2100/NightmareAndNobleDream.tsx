/*
SCENE: The Nightmare and the Noble Dream — one axis, realism and Dworkin at the ends, Hart between
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: American jurisprudence swings between the Nightmare (judges always make law) and the Noble Dream (judges
  never do); Hart treats both as exaggerations and sits between them at the easy/hard case line.
SUBJECT: the axis and the three markers placed on it.
STEPS: 1 the US obsession with the judicial process · 2 Nightmare end (realism) · 3 Noble Dream end (Dworkin) ·
  4 Hart in the middle, easy/hard case line.
REDUCED MOTION: the finished diagram with all four captions stacked.
BUDGET: < 6 KB gz. A 320-unit axis and two 164-unit text columns on a 360-unit canvas.
Source: concept laws2100-w06-nightmare-and-noble-dream; authority hart-the-nightmare-and-the-noble-dream.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;
const txt = (x: number, y: number, ls: string[], anchor: 'start' | 'end' | 'middle' = 'start') =>
  ls.map((l, i) => <text key={i} x={x} y={y + i * 18} textAnchor={anchor} {...body}>{l}</text>);

const figure = (
  <svg viewBox={`0 0 ${W} 420`} role="img" aria-label="An axis from the Nightmare (judges always make law, realism) to the Noble Dream (judges never make law, Dworkin), with Hart between">
    <g data-step="1">
      <rect x="8" y="8" width={W - 16} height="64" rx="10" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x="22" y="30" {...head} fill="var(--ink-2)">AMERICAN JURISPRUDENCE</text>
      <text x="22" y="54" {...body}>obsessed with the judicial process</text>
    </g>
    <g data-step="2">
      <line x1="20" y1="150" x2="180" y2="150" stroke="var(--ink)" strokeWidth="1.5" />
      <circle cx="20" cy="150" r="6" fill="var(--ink)" stroke="var(--ink)" strokeWidth="1" />
      <text x="12" y="126" {...head} data-label="nightmare">NIGHTMARE</text>
      <text x="12" y="180" {...body} fill="var(--ink-2)">realism</text>
      {txt(12, 226, ['judges always make', 'law: the judge–', 'legislator line is', 'an illusion'])}
    </g>
    <g data-step="3">
      <line x1="180" y1="150" x2="340" y2="150" stroke="var(--ink)" strokeWidth="1.5" />
      <circle cx="340" cy="150" r="6" fill="var(--ink)" stroke="var(--ink)" strokeWidth="1" />
      <text x={W - 12} y="126" textAnchor="end" {...head} data-label="dream">NOBLE DREAM</text>
      <text x={W - 12} y="180" textAnchor="end" {...body} fill="var(--ink-2)">Dworkin</text>
      {txt(W - 12, 226, ['judges never make', 'law: an existing', 'answer always', 'waits'], 'end')}
    </g>
    <g data-step="4">
      <line x1="180" y1="100" x2="180" y2="200" stroke="var(--ink-2)" strokeWidth="1.5" strokeDasharray="4 4" />
      <circle cx="180" cy="150" r="8" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
      <text x="180" y="92" textAnchor="middle" {...head} data-label="hart">HART</text>
      <text x="170" y="218" textAnchor="end" {...body} fontSize={12} fill="var(--ink-2)">easy</text>
      <text x="190" y="218" {...body} fontSize={12} fill="var(--ink-2)">hard</text>
      <rect x="8" y="320" width={W - 16} height="88" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x={W / 2} y="350" textAnchor="middle" {...body}>both are exaggerations — read them</text>
      <text x={W / 2} y="370" textAnchor="middle" {...body}>with the distinction between</text>
      <text x={W / 2} y="390" textAnchor="middle" {...body}>easy and hard cases</text>
    </g>
  </svg>
);

export default function NightmareAndNobleDream() {
  return (
    <Diagram
      label="The Nightmare and the Noble Dream: an axis with realism, Dworkin and Hart placed on it"
      terms={[
        { term: 'The Nightmare', def: 'The image of judges applying, not making, law is an illusion.' },
        { term: 'The Noble Dream', def: 'Judges never make new law; an existing law is always there to apply.' },
        { term: 'Easy and hard cases', def: 'The distinction Hart uses to temper both extremes.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Hart notes "a concentration, almost to the point of obsession, on the judicial process" in American jurisprudence, partly explained by the "quite extraordinary" role of US courts and judicial review.' },
        { caption: 'The Nightmare: litigants expect existing law, not new law made for them — and that image is an illusion. Realism presented this as an essential feature of law and adjudication, not just of hard cases.' },
        { caption: 'The Noble Dream: even where the materials offer no determinate guide, there is an existing law somewhere to apply — not universal natural law. Dworkin is "the noblest dreamer of all".' },
        { caption: 'Hart treats both as exaggerations, to be read with the distinction between easy and hard cases. The dream links to the one right answer thesis and legal positions determined ex ante.' },
      ]}
      check={{
        question: 'Why does Hart place himself between the Nightmare and the Noble Dream?',
        options: [
          { text: 'Because judges make law in easy cases and apply it in hard ones', why: 'Reversed: easy cases are governed by existing law; it is in hard cases that the judge may make law.' },
          { text: 'Because both are exaggerations once easy and hard cases are distinguished', correct: true, why: 'Judges apply existing law in easy cases, while hard cases leave room for judicial law-making.' },
          { text: 'Because he agrees with Dworkin that judges never make law', why: 'That is the Noble Dream, and Hart calls Dworkin its noblest dreamer — he does not share it.' },
        ],
      }}
    />
  );
}
