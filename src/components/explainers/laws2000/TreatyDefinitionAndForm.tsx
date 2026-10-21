/*
SCENE: What counts as a treaty — a document passing the four gates of art 2(1)(a) VCLT
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: A document is a treaty if it clears four gates — between states, written, governed by international law, any
  label — and courts look past informal labels to substance (with Australia's MoU practice as the caveat).
SUBJECT: the spine the document travels down, through each gate in turn.
STEP 1–4: one gate each. STEP 5: substance over label — Aegean Sea, Qatar v Bahrain, Somalia v Kenya; DFAT MoU practice.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all five captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades.
Source: concept laws2000-w03-treaty-definition-and-form; VCLT art 2(1)(a); case cards aegean-sea-continental-shelf-greece-v-turkey,
  maritime-delimitation-and-territorial-questions-qatar-v-bahrain, maritime-delimitation-in-the-indian-ocean-somalia-v-kenya.
*/
import { Diagram } from '../bases/Diagram';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;

const GATES = [
  { id: 'states', t: 'BETWEEN STATES', n: ['state-to-state only (art 1)'] },
  { id: 'written', t: 'IN WRITTEN FORM', n: ['one document, resolutions,', 'or a treaty plus a protocol'] },
  { id: 'governed', t: 'INTERNATIONAL LAW', n: ['governs it — not any party’s', 'domestic law'] },
  { id: 'label', t: 'ANY DESIGNATION', n: ['treaty, convention, agreement,', 'protocol: all treaties'] },
];

const figure = (
  <svg viewBox="0 0 360 560" role="img" aria-label="Four gates of art 2(1)(a) VCLT: between states, in writing, governed by international law, whatever its designation">
    <rect x="58" y="8" width="34" height="42" rx="3" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
    <text x="104" y="34" {...note}>a document</text>
    {GATES.map((g, k) => {
      const y = 76 + k * 78;
      return (
        <g key={g.id} data-step={k + 1}>
          <line x1="75" y1={y - 26} x2="75" y2={y + 30} stroke="var(--ink-3)" strokeWidth="1.5" />
          <line x1="40" y1={y} x2="40" y2={y + 44} stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
          <line x1="110" y1={y} x2="110" y2={y + 44} stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
          <line x1="40" y1={y} x2="110" y2={y} stroke="var(--ink)" strokeWidth="2" />
          <text x="128" y={y + 12} {...ui} data-label={g.id}>{k + 1} · {g.t}</text>
          {g.n.map((l, i) => <text key={l} x="128" y={y + 32 + i * 17} {...note}>{l}</text>)}
        </g>
      );
    })}
    <g data-step="5">
      <line x1="75" y1="364" x2="75" y2="394" stroke="var(--ink-3)" strokeWidth="1.5" />
      <rect x="8" y="394" width="344" height="156" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="22" y="418" {...ui} data-label="substance">A TREATY · SUBSTANCE OVER LABEL</text>
      <text x="22" y="442" {...note}>Aegean Sea: a press communiqué could bind</text>
      <text x="22" y="462" {...note}>Qatar v Bahrain: agreed minutes were a treaty</text>
      <text x="22" y="482" {...note}>Somalia v Kenya: a signed, registered MoU</text>
      <text x="22" y="500" {...note}>was a treaty at international law</text>
      <text x="22" y="526" {...note} fill="var(--ink)">but DFAT practice treats an MoU as</text>
      <text x="22" y="542" {...note} fill="var(--ink)">“less than a treaty”</text>
    </g>
  </svg>
);

export default function TreatyDefinitionAndForm() {
  return (
    <Diagram
      label="What counts as a treaty: the four elements of art 2(1)(a) VCLT as gates"
      terms={[
        { term: 'Treaty (art 2(1)(a))', def: '“An international agreement concluded between States in written form and governed by international law … whatever its particular designation.”' },
        { term: 'Designation', def: 'The label the parties use: treaty, convention, agreement, protocol.' },
        { term: 'MoU', def: 'Memorandum of understanding; Australian DFAT practice treats one as less than a treaty.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Gate 1 — between states: the VCLT covers only state-to-state agreements (art 1).' },
        { caption: 'Gate 2 — in written form: one instrument or several related ones, such as a series of resolutions or a treaty plus a protocol.' },
        { caption: 'Gate 3 — governed by international law: disputes are resolved by international law, not any party’s domestic law.' },
        { caption: 'Gate 4 — whatever its designation: treaty, convention, agreement and protocol are all treaties in substance.' },
        { caption: 'Courts look past labels: a communiqué (Aegean Sea), minutes of agreed commitments (Qatar v Bahrain) and a registered MoU (Somalia v Kenya). Australia’s own practice can still give an MoU a different status.' },
      ]}
      check={{
        question: 'Two states sign and date a short MoU recording commitments and register it with the UN. Is it a treaty at international law?',
        options: [
          { text: 'No — it is called an MoU, not a treaty', why: 'The label does not matter (gate 4); courts look to substance.' },
          { text: 'It can be — Somalia v Kenya held such an MoU to be a treaty', correct: true, why: 'Run the four elements; a signed, dated, registered MoU was a treaty, even though DFAT treats MoUs as less than one.' },
          { text: 'No — treaties must be long, formal single documents', why: 'Written form can be informal or spread over several instruments.' },
        ],
      }}
    />
  );
}
