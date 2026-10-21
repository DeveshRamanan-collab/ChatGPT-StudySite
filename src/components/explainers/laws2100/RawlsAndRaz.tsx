/*
SCENE: Rawls's neutrality and Raz's liberal perfectionism — a two-question map
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Two questions sort the positions: may the state promote a view of the good life, and may it use the criminal
  law to do so? Rawls answers no to the first; Raz yes to the first and no to the second; Devlin and George yes to
  both; Mill stands apart, limiting coercion to harm to others.
SUBJECT: the four quadrants and who sits where.
STEPS: 1 the axes · 2 Rawls: right v good, the neutral state · 3 Raz: promote worthy lives, non-coercive means only ·
  4 Devlin and George: the criminal law against vice · 5 Mill: harm to others only.
REDUCED MOTION: the finished map with all five captions stacked.
BUDGET: < 5 KB gz.
Source: concept laws2100-w10-rawls-and-raz (slides 28–29), with Devlin, George and Mill from the week's concepts.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 12, fill: 'var(--ink)' } as const;

const figure = (
  <svg viewBox={`0 0 ${W} 400`} role="img" aria-label="A map: promote the good life (no or yes) against use the criminal law to do so (no or yes); Rawls neutral, Raz promotes without criminal law, Devlin and George with it, Mill on harm only">
    <g data-step="1">
      <line x1="60" y1="40" x2="60" y2="320" stroke="var(--ink)" strokeWidth="1.5" />
      <line x1="60" y1="320" x2="344" y2="320" stroke="var(--ink)" strokeWidth="1.5" />
      <line x1="202" y1="40" x2="202" y2="320" stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="60" y1="180" x2="344" y2="180" stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="4 4" />
      <text x="202" y="346" textAnchor="middle" {...head}>MAY THE STATE PROMOTE THE GOOD LIFE?</text>
      <text x="131" y="366" textAnchor="middle" {...body} fill="var(--ink-2)">no: neutral</text>
      <text x="273" y="366" textAnchor="middle" {...body} fill="var(--ink-2)">yes</text>
      <text x="14" y="110" {...head}>BY</text>
      <text x="14" y="124" {...head}>CRIME?</text>
      <text x="40" y="250" textAnchor="end" {...body} fill="var(--ink-2)">no</text>
      <text x="40" y="110" textAnchor="end" {...body} fill="var(--ink-2)">yes</text>
    </g>
    <g data-step="2">
      <circle cx="131" cy="236" r="7" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="131" y="216" textAnchor="middle" {...body}>Rawls</text>
      <text x="131" y="262" textAnchor="middle" {...body} fontSize={11} fill="var(--ink-2)">right ≠ good;</text>
      <text x="131" y="278" textAnchor="middle" {...body} fontSize={11} fill="var(--ink-2)">act only on rights</text>
    </g>
    <g data-step="3">
      <circle cx="273" cy="236" r="7" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="273" y="216" textAnchor="middle" {...body}>Raz</text>
      <text x="273" y="262" textAnchor="middle" {...body} fontSize={11} fill="var(--ink-2)">worthy lives, by tax</text>
      <text x="273" y="278" textAnchor="middle" {...body} fontSize={11} fill="var(--ink-2)">not criminal law</text>
    </g>
    <g data-step="4">
      <circle cx="273" cy="100" r="7" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="273" y="80" textAnchor="middle" {...body}>Devlin · George</text>
      <text x="273" y="126" textAnchor="middle" {...body} fontSize={11} fill="var(--ink-2)">prohibit vice,</text>
      <text x="273" y="142" textAnchor="middle" {...body} fontSize={11} fill="var(--ink-2)">even if harmless</text>
    </g>
    <g data-step="5">
      <rect x="76" y="60" width="110" height="60" rx="6" fill="none" stroke="var(--ink-2)" strokeWidth="1" strokeDasharray="4 4" />
      <text x="131" y="82" textAnchor="middle" {...body}>Mill</text>
      <text x="131" y="100" textAnchor="middle" {...body} fontSize={11} fill="var(--ink-2)">crime only for</text>
      <text x="131" y="114" textAnchor="middle" {...body} fontSize={11} fill="var(--ink-2)">harm to others</text>
    </g>
  </svg>
);

export default function RawlsAndRaz() {
  return (
    <Diagram
      label="Rawls, Raz and the legal moralists on a map of two questions"
      terms={[
        { term: 'The right and the good', def: 'Rawls: the right is the sphere of principles of justice, including rights; the good is the sphere of value.' },
        { term: 'Neutrality', def: 'Rawls: the state should be neutral on all matters of the good life.' },
        { term: 'Liberal perfectionism', def: 'Raz: the state should promote worthy ways of life, but not through the criminal law.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Two questions sort the views: may the state promote a view of the good life? And may it use the criminal law to do so?' },
        { caption: 'Rawls (1921–2002) separates the right from the good. The state should be "neutral" on the good life; the only justification for interference is to prevent rights violations and punish those who violate others\' rights.' },
        { caption: 'Raz (1939–2022) rejects neutrality: the state should promote intrinsically worthy ways of life and discourage unworthy ones. But not by criminal law; non-coercive means, such as taxing activities the majority disapproves of, are fine.' },
        { caption: 'The legal moralists answer yes to both: Devlin (popular morality) and George (critical morality) would prohibit vice by law, even if the conduct is harmless.' },
        { caption: 'Mill stands apart: our own good, physical or moral, never justifies compulsion; the criminal law may be used only to prevent harm to others.' },
      ]}
      check={{
        question: 'What separates Raz from Devlin and George?',
        options: [
          { text: 'Raz will not use the criminal law to promote the good', correct: true, why: 'All three think the state may care about the good life; Raz alone limits it to non-coercive means.' },
          { text: 'Raz thinks the state should be neutral', why: 'That is Rawls; Raz rejects Rawls\'s idea of state neutrality.' },
          { text: 'Raz enforces critical morality', why: 'Enforcing critical morality is George\'s position; Raz does not enforce morality by criminal law at all.' },
        ],
      }}
    />
  );
}
