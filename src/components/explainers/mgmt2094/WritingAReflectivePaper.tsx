/*
SCENE: How to write a reflective paper — the paper as a chain
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: A reflective paper may use "I", but it is not a diary: each feeling or opinion is anchored to specific
  evidence, written in focused, complete sentences of varied length grouped in paragraphs, and linked to a conclusion
  by transitional phrases — all related to the group project with theoretical underpinnings.
SUBJECT: the chain from an "I" statement down to a conclusion; the transitional-phrase arrow is the one accent element.
STEPS: 1 "I" feeling + specific evidence · 2 paragraphs of focused sentences · 3 transitional phrases link an
  experience to a conclusion · 4 the frame: group project and theory; not a diary, no slang, proofread.
REDUCED MOTION: the finished diagram with all four captions stacked.
BUDGET: < 8 KB gz (DrawSVG is in the shared motion chunk). Vertical 360-unit canvas so text stays legible on phones.
Source: concept mgmt2094-w06-writing-a-reflective-paper (Week 6 lecture slides 6–7; Week 9 transcript); the example
  sentence is the week spec's q415.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2 } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14 } as const;
const small = { fontFamily: 'var(--font-ui)', fontSize: 12.5 } as const;

const figure = (
  <svg viewBox={`0 0 ${W} 648`} role="img" aria-label="A reflective paper as a chain: an I statement anchored to evidence, focused sentences in paragraphs, transitional phrases linking an experience to a conclusion, all related to the group project and theory">
    <g data-step="1">
      <rect x="8" y="10" width={W - 16} height="62" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="22" y="32" {...head} fill="var(--ink-2)" data-label="feeling">FEELING OR OPINION — "I" IS FINE</text>
      <text x="22" y="56" {...body} fill="var(--ink)">"I think our pitch was weak…"</text>
      <line x1="40" y1="72" x2="40" y2="98" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="54" y="90" {...small} fill="var(--ink-2)">explained by</text>
      <rect x="8" y="98" width={W - 16} height="80" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="22" y="120" {...head} fill="var(--ink-2)" data-label="evidence">SPECIFIC EVIDENCE</text>
      <text x="22" y="144" {...body} fill="var(--ink)">"…the panel asked three questions</text>
      <text x="22" y="164" {...body} fill="var(--ink)">about cost that we could not answer."</text>
    </g>
    <g data-step="2">
      <text x="8" y="210" {...head} fill="var(--ink-2)" data-label="paragraphs">A PARAGRAPH OF FOCUSED SENTENCES</text>
      <line x1="14" y1="222" x2="14" y2="288" stroke="var(--ink-3)" strokeWidth="1.5" />
      <rect x="26" y="224" width="250" height="12" rx="6" fill="none" stroke="var(--ink)" strokeWidth="1.25" />
      <rect x="26" y="248" width="150" height="12" rx="6" fill="none" stroke="var(--ink)" strokeWidth="1.25" />
      <rect x="26" y="272" width="300" height="12" rx="6" fill="none" stroke="var(--ink)" strokeWidth="1.25" />
      <text x="8" y="312" {...small} fill="var(--ink-2)">one idea per sentence · no fragments · no rambling</text>
      <text x="8" y="331" {...small} fill="var(--ink-2)">vary the length, but not too long</text>
    </g>
    <g data-step="3">
      <rect x="8" y="352" width={W - 16} height="40" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="377" textAnchor="middle" {...head} fill="var(--ink)" data-label="experience">AN EXPERIENCE OR DETAIL</text>
      <line x1="40" y1="392" x2="40" y2="482" stroke="var(--accent)" strokeWidth="2" />
      <path d="M34 472 L40 484 L46 472" fill="none" stroke="var(--accent)" strokeWidth="2" />
      <text x="56" y="410" {...small} fill="var(--ink)">for example · for instance</text>
      <text x="56" y="428" {...small} fill="var(--ink)">as a result</text>
      <text x="56" y="446" {...small} fill="var(--ink)">an opposite view is</text>
      <text x="56" y="464" {...small} fill="var(--ink)">a different perspective is</text>
      <rect x="8" y="486" width={W - 16} height="40" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="511" textAnchor="middle" {...head} fill="var(--ink)" data-label="conclusion">A CONCLUSION OR UNDERSTANDING</text>
    </g>
    <g data-step="4">
      <rect x="8" y="548" width={W - 16} height="92" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x={W / 2} y="572" textAnchor="middle" {...head} fill="var(--ink-2)" data-label="frame">RELATE IT ALL TO</text>
      <text x={W / 2} y="594" textAnchor="middle" {...body} fill="var(--ink)">your group project and experiences,</text>
      <text x={W / 2} y="613" textAnchor="middle" {...body} fill="var(--ink)">with theoretical underpinnings</text>
      <text x={W / 2} y="632" textAnchor="middle" {...small} fill="var(--ink-2)">NOT a diary · no slang or jargon · proofread</text>
    </g>
  </svg>
);

export default function WritingAReflectivePaper() {
  return (
    <Diagram
      label="How to write a reflective paper: a chain from an I statement to a conclusion"
      terms={[
        { term: 'Specific evidence', def: 'What explains a subjective feeling or opinion — feelings should not come out of the blue.' },
        { term: 'Sentence fragment', def: 'An incomplete sentence, such as "Because the deadline moved." Avoid it.' },
        { term: 'Transitional phrase', def: 'Shifts the argument and introduces specific details: for example, as a result…' },
      ]}
      figure={figure}
      steps={[
        { caption: 'It is one of the few academic papers where you can use "I" — but relate each subjective feeling or opinion using specific evidence to explain it.' },
        { caption: 'Keep sentences focused and complete: one idea each, no rambling, no fragments. Vary the length, but not too long, and use paragraphs.' },
        { caption: 'Transitional phrases shift the argument and introduce specific details, showing how one experience or detail links directly to a conclusion or understanding.' },
        { caption: 'Relate it all to your group project and experiences, with theoretical underpinnings. It is NOT a personal journal: no slang or jargon, and always proofread.' },
      ]}
      check={{
        question: 'A draft says: "I felt the team worked really well together." What does it most need?',
        options: [
          { text: 'To drop "I", since academic writing should be impersonal', why: 'The slide says a reflective paper is one of the few academic papers where you can use "I".' },
          { text: 'Specific evidence explaining why the writer felt that way', correct: true, why: 'The slide: relate your subjective feelings and opinions using specific evidence to explain them.' },
          { text: 'A longer sentence, to vary the sentence length', why: 'Variety helps, but the slide says not too long; the gap here is evidence.' },
        ],
      }}
    />
  );
}
