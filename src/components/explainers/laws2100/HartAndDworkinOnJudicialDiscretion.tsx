/*
SCENE: Hart and Dworkin on judicial discretion — a strait between Scylla and Charybdis, a gap, three flags
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Hart steers between formalism and rule-scepticism into partly unregulated cases, where judges make law
  interstitially and conscientiously; Dworkin's three objections (one descriptive, two normative) each get a reply.
SUBJECT: Hart's boat line through the strait, then each objection row with its reply.
STEPS: 1 the strait: Scylla (formalism), Charybdis (rule-scepticism), Hart's middle course · 2 the gap: partly
  unregulated case, interstitial law-making · 3 objection 1 (descriptive) · 4 objection 2 (undemocratic) ·
  5 objection 3 (retrospective).
REDUCED MOTION: the finished diagram with all five captions stacked.
BUDGET: < 7 KB gz. Objection and reply columns of 164 units on a 360-unit canvas.
Source: concept laws2100-w07-hart-and-dworkin-on-judicial-discretion; authorities hart-the-concept-of-law,
  dworkin-taking-rights-seriously.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;
const ROWS = [
  { tag: 'DESCRIPTIVE', obj: ['false description of', 'hard cases'], rep: ['judges do not just', 'push away law books'] },
  { tag: 'NORMATIVE', obj: ['undemocratic:', 'judges not elected'], rep: ['a small, necessary', 'price; delegation', 'is familiar'] },
  { tag: 'NORMATIVE', obj: ['unjust: retrospective', 'legislation'], rep: ['no clear law exists', 'to justify', 'expectations'] },
];

const figure = (
  <svg viewBox={`0 0 ${W} 520`} role="img" aria-label="Hart's course between Scylla (formalism) and Charybdis (rule-scepticism) into partly unregulated cases; Dworkin's three objections and Hart's replies">
    <g data-step="1">
      <path d="M8 40 L60 24 L96 52 L84 104 L8 112 Z" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="16" y="132" {...head} data-label="scylla">SCYLLA</text>
      <text x="16" y="150" {...body} fontSize={12} fill="var(--ink-2)">formalism</text>
      <path d="M300 68 m-40 0 a40 36 0 1 0 80 0 a40 36 0 1 0 -80 0 M300 68 m-24 0 a24 20 0 1 0 48 0 a24 20 0 1 0 -48 0 M300 68 m-8 0 a8 6 0 1 0 16 0" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W - 16} y="132" textAnchor="end" {...head} data-label="charybdis">CHARYBDIS</text>
      <text x={W - 16} y="150" textAnchor="end" {...body} fontSize={12} fill="var(--ink-2)">rule-scepticism</text>
      <path d="M180 16 L180 150" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" strokeDasharray="4 5" />
      <path d="M168 96 L192 96 L186 106 L174 106 Z" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="180" y="86" textAnchor="middle" {...head} fontSize={10}>HART</text>
    </g>
    <g data-step="2">
      <path d="M40 176 L150 176 L150 200 L210 200 L210 176 L320 176" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <rect x="156" y="178" width="48" height="18" rx="3" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" strokeDasharray="3 3" />
      <text x="180" y="222" textAnchor="middle" {...body} fontSize={12}>partly unregulated case:</text>
      <text x="180" y="240" textAnchor="middle" {...body} fontSize={12} fill="var(--ink-2)">interstitial; justified by general reasons</text>
    </g>
    {ROWS.map((r, i) => {
      const y = 262 + i * 86;
      return (
        <g key={i} data-step={i + 3}>
          <line x1="8" y1={y} x2={W - 8} y2={y} stroke="var(--ink-3)" strokeWidth="1" />
          <path d={`M14 ${y + 14} L14 ${y + 34} M14 ${y + 14} L28 ${y + 19} L14 ${y + 24}`} fill="none" stroke="var(--ink)" strokeWidth="1.5" />
          <text x="34" y={y + 24} {...head} fontSize={10} fill="var(--ink-2)">{`${i + 1} · ${r.tag}`}</text>
          {r.obj.map((l, k) => <text key={k} x="14" y={y + 48 + k * 17} {...body}>{l}</text>)}
          <text x="176" y={y + 48} {...body} fill="var(--ink-3)">→</text>
          {r.rep.map((l, k) => <text key={k} x="194" y={y + 24 + k * 17} {...body} fill="var(--ink-2)">{l}</text>)}
        </g>
      );
    })}
  </svg>
);

export default function HartAndDworkinOnJudicialDiscretion() {
  return (
    <Diagram
      label="Hart and Dworkin on judicial discretion: Hart's middle course and three objections with replies"
      terms={[
        { term: 'Partly unregulated case', def: 'Where the law is "partly indeterminate or incomplete" (CL 272).' },
        { term: 'Interstitial', def: 'Law-making in the gaps, constrained — no large-scale reforms or new codes.' },
        { term: 'Scylla and Charybdis', def: 'Formalism and rule-scepticism: "the truth lies between them" (CL 147).' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Systems compromise between rules individuals can apply to themselves and issues settled only "when they arise in a concrete case" (CL 130). Hart takes the middle course.' },
        { caption: 'The "sharpest direct conflict": for Hart there will always be legally unregulated cases (CL 272). Judges then make law — constrained, interstitial, justified by general reasons, as a conscientious legislator.' },
        { caption: 'Dworkin 1 (descriptive): a false description of hard cases — for him the judge never steps outside the law. Hart: judges "do not just push away their law books"; even Dworkin\'s theory incorporates choices.' },
        { caption: 'Dworkin 2 (normative): undemocratic, as judges are not elected. Hart: a necessary, small price if judicial power is limited; delegated legislative power is familiar in modern democracies.' },
        { caption: 'Dworkin 3 (normative): unjust, as retrospective legislation. Hart: in hard cases, by definition, there is no clear established law to justify expectations.' },
      ]}
      check={{
        question: 'Hart replies to the retrospectivity objection by saying…',
        options: [
          { text: 'Retrospective legislation is always just', why: 'Hart makes no such general claim; his point is specific to hard cases.' },
          { text: 'In hard cases there is no clear established law to justify expectations', correct: true, why: 'Without settled law, no one had a legitimate expectation that the new rule defeats.' },
          { text: 'Judges are, in practice, elected', why: 'That would answer the democracy objection, and Hart\'s actual reply there is that it is a small, necessary price.' },
        ],
      }}
    />
  );
}
