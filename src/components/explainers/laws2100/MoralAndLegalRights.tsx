/*
SCENE: Moral rights, legal rights and positivisation — two layers and two gaps
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Human rights may be moral rights, legal rights or both; positivisation carries a moral right down through
  recognition (constitution, statute, treaty) into a legal right; a moral right can exist where the law refuses it
  (slavery); and a recognised right still has to cross a second gap into practice, or it stays a paper right.
SUBJECT: the moral right's arrow descending, and where it stops.
STEPS: 1 the two layers (morality above, positive law below) · 2 positivisation: recognition into a legal right ·
  3 slavery: a moral right with no legal counterpart · 4 implementation: law in action, or a paper right.
REDUCED MOTION: the finished diagram with all four captions stacked.
BUDGET: < 5 KB gz.
Source: concept laws2100-w09-moral-and-legal-rights; authorities constitution-of-the-republic-of-south-africa-s39-1,
  besson-human-rights-and-constitutional-law.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;

const figure = (
  <svg viewBox={`0 0 ${W} 400`} role="img" aria-label="Morality above, positive law below: a moral right recognised into a legal right, a slavery-era moral right with no legal counterpart, and a legal right either implemented or left as a paper right">
    <g data-step="1">
      <text x="16" y="28" {...head} data-label="morality">MORALITY</text>
      <line x1="8" y1="168" x2={W - 8} y2="168" stroke="var(--ink-2)" strokeWidth="1.5" strokeDasharray="5 5" />
      <text x="16" y="190" {...head} data-label="positive-law">POSITIVE LAW</text>
      <text x={W - 16} y="160" textAnchor="end" {...body} fontSize={11} fill="var(--ink-2)">moral, legal, or both?</text>
    </g>
    <g data-step="2">
      <circle cx="96" cy="88" r="8" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="96" y="68" textAnchor="middle" {...body}>moral right</text>
      <line x1="96" y1="96" x2="96" y2="206" stroke="var(--ink)" strokeWidth="1.5" />
      <rect x="24" y="206" width="144" height="42" rx="6" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="96" y="223" textAnchor="middle" {...body} fontSize={12}>recognition</text>
      <text x="96" y="239" textAnchor="middle" {...body} fontSize={10} fill="var(--ink-2)">constitution · statute · treaty</text>
      <path d="M96 248 L96 282 M90 274 L96 284 L102 274" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <circle cx="96" cy="294" r="8" fill="none" stroke="var(--ink)" strokeWidth="2" />
      <text x="112" y="298" {...body}>legal right</text>
    </g>
    <g data-step="3">
      <circle cx="268" cy="88" r="8" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="268" y="68" textAnchor="middle" {...body}>not to be enslaved</text>
      <text x="268" y="118" textAnchor="middle" {...body} fontSize={11} fill="var(--ink-2)">(where slavery was legal)</text>
      <line x1="268" y1="128" x2="268" y2="152" stroke="var(--ink-2)" strokeWidth="1.5" strokeDasharray="3 4" />
      <path d="M258 158 L278 178 M278 158 L258 178" fill="none" stroke="var(--ink)" strokeWidth="2" />
      <text x="268" y="204" textAnchor="middle" {...body} fontSize={12} fill="var(--ink-2)">no legal right</text>
    </g>
    <g data-step="4">
      <path d="M96 302 L96 344 M90 336 L96 346 L102 336" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <circle cx="96" cy="358" r="6" fill="var(--ink)" />
      <text x="110" y="362" {...body} fontSize={12}>implemented: law in action</text>
      <path d="M104 300 L196 300" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" strokeDasharray="3 4" />
      <text x="204" y="296" {...body} fontSize={12} fill="var(--ink-2)">paper right:</text>
      <text x="204" y="312" {...body} fontSize={12} fill="var(--ink-2)">law in books</text>
    </g>
  </svg>
);

export default function MoralAndLegalRights() {
  return (
    <Diagram
      label="Moral rights, legal rights and positivisation: two layers and two gaps"
      terms={[
        { term: 'Moral v legal right', def: 'Are human rights moral rights, legal rights, or both? And what are their authoritative sources?' },
        { term: 'Positivisation', def: 'Translating rights from natural law and morality into positive law, domestic and international.' },
        { term: 'Paper rights', def: 'Rights recognised but never implemented: law in books, not law in action.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'The authority issue: are human rights moral rights, legal rights, or both? For legal rights the answer is easier: there are authoritative legal sources.' },
        { caption: 'Positivisation: from natural law to positive law, from moral rights to legal rights. A constitutional Bill of Rights sits high in the hierarchy of sources (eg South Africa s 39(1); Germany\'s Basic Law arts 1–19); Australia\'s Federal Constitution has none.' },
        { caption: 'Where slavery was legal there was no legal right not to be enslaved — but one could say there was a moral right. Positive law\'s silence does not mean the moral requirement does not exist; the claim then needs a moral justification.' },
        { caption: 'Recognition is not enough. A recognised right must be implemented; otherwise it is a paper right, law in books rather than law in action.' },
      ]}
      check={{
        question: 'Where slavery was legal and regulated, what does the lecture say about a right not to be enslaved?',
        options: [
          { text: 'No legal right, but arguably a moral one that needs justifying', correct: true, why: 'Positive law did not recognise it, yet the moral requirement need not cease to exist; the moral claim must be justified.' },
          { text: 'A legal right all along', why: 'The legal system accepted and regulated slavery, so there was no legal right.' },
          { text: 'No right of any kind', why: 'That is the Bentham-style view that only legal rights exist; the lecture keeps the moral-right answer open.' },
        ],
      }}
    />
  );
}
