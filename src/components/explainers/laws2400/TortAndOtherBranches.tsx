/*
SCENE: Where tort sits — against crime, contract and human rights law
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Tort is not a watertight compartment: contrast it with crime and contract on the axes the lecture uses,
  and show the overlaps (assault; product liability and services) and its limited human-rights role.
SUBJECT: the tort box at the centre; each neighbour draws on in turn with its connector and overlap note.
STEPS: 1 tort · 2 crime + overlap · 3 contract + overlap · 4 human rights (dashed: a limited role).
REDUCED MOTION: the finished diagram with all four captions stacked.
BUDGET: < 12 KB gz (DrawSVG is in the shared motion chunk). Vertical layout so text stays legible on phones.
Source: week 1 notes, concept laws2400-w01-tort-law-and-other-branches.
*/
import { Diagram } from '../bases/Diagram';

// Drawn on a narrow 360-unit canvas with large type so it stays legible at phone width (≈ 13px body text).
const W = 360;

function Box({ y, h, title, lines, id }: { y: number; h: number; title: string; lines: string[]; id: string }) {
  return (
    <>
      <rect x="8" y={y} width={W - 16} height={h} rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y={y + 28} textAnchor="middle" fontFamily="var(--font-ui)" fontSize="14" letterSpacing="1.5" fill="var(--ink)" data-label={id}>{title}</text>
      {lines.map((l, i) => (
        <text key={i} x={W / 2} y={y + 54 + i * 22} textAnchor="middle" fontFamily="var(--font-body)" fontSize="16" fill="var(--ink-2)">{l}</text>
      ))}
    </>
  );
}

function Link({ y1, y2, lines }: { y1: number; y2: number; lines: string[] }) {
  const mid = (y1 + y2) / 2 - ((lines.length - 1) * 18) / 2 + 5;
  return (
    <>
      <line x1="36" y1={y1} x2="36" y2={y2} stroke="var(--ink-3)" strokeWidth="1.5" />
      {lines.map((l, i) => (
        <text key={i} x="52" y={mid + i * 18} fontFamily="var(--font-ui)" fontSize="13" fill="var(--ink-2)">{l}</text>
      ))}
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 690`} role="img" aria-label="Tort at the centre, with criminal law above, contract below and human rights law as a dashed, limited overlap">
    <g data-step="1">
      <Box id="tort" y={220} h={130} title="TORT" lines={['private wrongs · aim: compensation', 'the individual sues', 'balance of probabilities', 'unliquidated damages']} />
    </g>
    <g data-step="2">
      <Box id="crime" y={10} h={110} title="CRIMINAL LAW" lines={['public wrongs (offences)', 'aim: punishment · the State prosecutes', 'beyond reasonable doubt']} />
      <Link y1={120} y2={220} lines={['Overlap — the same conduct (e.g. assault)', 'can be both a tort and a crime']} />
    </g>
    <g data-step="3">
      <Box id="contract" y={450} h={110} title="CONTRACT" lines={["duties from the parties' agreement", 'bind only the parties (privity)', 'liquidated damages · motive irrelevant']} />
      <Link y1={350} y2={450} lines={['Overlap — both are civil wrongs; the same', 'facts can found both (product liability)']} />
    </g>
    <g data-step="4">
      <rect x="8" y="590" width={W - 16} height="92" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x={W / 2} y="618" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="14" letterSpacing="1.5" fill="var(--ink)" data-label="human-rights">HUMAN RIGHTS LAW</text>
      <text x={W / 2} y="644" textAnchor="middle" fontFamily="var(--font-body)" fontSize="16" fill="var(--ink-2)">bodily integrity, reputation, property</text>
      <text x={W / 2} y="666" textAnchor="middle" fontFamily="var(--font-body)" fontSize="16" fill="var(--ink-2)">— a limited role</text>
    </g>
  </svg>
);

export default function TortAndOtherBranches() {
  return (
    <Diagram
      label="Tort law and other branches of law"
      terms={[
        { term: 'Private wrong', def: 'A wrong against an individual, who sues for redress.' },
        { term: 'Public wrong', def: 'An offence against the community, prosecuted by the State.' },
        { term: 'Privity', def: 'Contractual duties bind only the parties to the contract.' },
        { term: 'Unliquidated damages', def: 'Damages assessed by the court, not fixed in advance — the tort position.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Tort deals with private wrongs: the individual sues for compensation, proved on the balance of probabilities.' },
        { caption: 'Criminal law deals with public wrongs: the State prosecutes, aiming at punishment, proved beyond reasonable doubt. The line is not sharp — assault can be both.' },
        { caption: "Contract duties come from the parties' agreement and bind only them; tort duties come from the general law (the neighbour principle) and bind everyone." },
        { caption: 'Tort also protects bodily integrity, reputation and property, but with no comprehensive federal human rights statute its role there is limited.' },
      ]}
      check={{
        question: 'Which contrast between tort and contract is right?',
        options: [
          { text: 'Tort duties bind only the parties; contract duties bind everyone', why: 'This reverses it: privity confines contract duties to the parties, while tort duties arise from the general law.' },
          { text: "Tort duties arise from the general law; contract duties from the parties' agreement", correct: true, why: "Tort duties come from the general law (the neighbour principle) and bind everyone; contract duties come from agreement." },
          { text: 'Tort damages are liquidated; contract damages are unliquidated', why: 'The lecture puts it the other way: tort damages are unliquidated, contract damages liquidated.' },
        ],
      }}
    />
  );
}
