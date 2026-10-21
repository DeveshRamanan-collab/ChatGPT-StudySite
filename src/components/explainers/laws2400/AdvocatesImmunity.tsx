/*
SCENE: Immune defendants — the boundary of the advocates' immunity
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Show how narrow the immunity is: inside it, a barrister's conduct of a case in court and intimately connected
  pre-trial work; on its boundary, the three Giannarelli policy reasons; outside it, a solicitor's ordinary negligence
  and any lawyer's negligent advice (negligent misstatement, Topic 7).
SUBJECT: the dashed boundary line of the immunity.
STEPS: 1 the boundary + conduct in court · 2 intimately connected pre-trial matters · 3 the three policy reasons on
  the boundary · 4 outside: the solicitor's missed limitation period and negligent advice.
REDUCED MOTION: the finished diagram with all four captions stacked.
BUDGET: < 12 KB gz (DrawSVG is in the shared motion chunk). Narrow 360-unit canvas, vertical layout, ≥ 13px text.
Source: concept card laws2400-w08-advocates-immunity; case giannarelli-v-wraith (verify: true on the card; used only as
  the slide states it); Topic 8 Lecture 2 slide 10 and the lecture (solicitor and limitation period example; advice
  belongs to negligent misstatement).
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 15, fill: 'var(--ink-2)' } as const;

const figure = (
  <svg viewBox={`0 0 ${W} 600`} role="img" aria-label="The advocates' immunity as a dashed boundary: conduct in court and intimately connected pre-trial work inside; three policy reasons on the line; a solicitor's missed limitation period and negligent advice outside">
    <g data-step="1">
      <rect x="8" y="10" width={W - 16} height="236" rx="16" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="8 6" />
      <text x={W / 2} y="38" textAnchor="middle" {...ui} fontSize="13" letterSpacing="1.2" fill="var(--ink)" data-label="immunity">INSIDE THE IMMUNITY</text>
      <rect x="28" y="54" width={W - 56} height="64" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="80" textAnchor="middle" {...body}>a barrister’s conduct of</text>
      <text x={W / 2} y="102" textAnchor="middle" {...body}>a case in court</text>
    </g>
    <g data-step="2">
      <rect x="28" y="132" width={W - 56} height="86" rx="10" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y="158" textAnchor="middle" {...body}>pre-trial matters intimately</text>
      <text x={W / 2} y="180" textAnchor="middle" {...body}>connected with the case</text>
      <text x={W / 2} y="202" textAnchor="middle" {...body}>in court</text>
    </g>
    <g data-step="3">
      <text x={W / 2} y="276" textAnchor="middle" {...ui} fontSize="13" letterSpacing="1.2" fill="var(--ink)" data-label="reasons">ON THE BOUNDARY: WHY</text>
      <text x="20" y="302" {...ui} fontSize="13" fill="var(--ink-2)">1 · duty to the court v duty to the client</text>
      <text x="20" y="324" {...ui} fontSize="13" fill="var(--ink-2)">2 · court time lost to defensive arguments</text>
      <text x="20" y="346" {...ui} fontSize="13" fill="var(--ink-2)">3 · the finality of judgment</text>
      <line x1="20" y1="362" x2={W - 20} y2="362" stroke="var(--ink-3)" strokeWidth="1" />
    </g>
    <g data-step="4">
      <text x={W / 2} y="392" textAnchor="middle" {...ui} fontSize="13" letterSpacing="1.2" fill="var(--ink)" data-label="outside">OUTSIDE — CAN BE SUED</text>
      <rect x="8" y="406" width={W - 16} height="80" rx="10" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x={W / 2} y="432" textAnchor="middle" {...body}>a solicitor who misses a limitation</text>
      <text x={W / 2} y="454" textAnchor="middle" {...body}>period — the client sues for the</text>
      <text x={W / 2} y="476" textAnchor="middle" {...body}>lost claim</text>
      <rect x="8" y="500" width={W - 16} height="88" rx="10" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x={W / 2} y="526" textAnchor="middle" {...body}>negligent advice by any lawyer —</text>
      <text x={W / 2} y="548" textAnchor="middle" {...body}>pure economic loss by negligent</text>
      <text x={W / 2} y="570" textAnchor="middle" {...body}>misstatement (Topic 7)</text>
    </g>
  </svg>
);

export default function AdvocatesImmunity() {
  return (
    <Diagram
      label="The boundary of the advocates' immunity"
      terms={[
        { term: 'Advocate', def: 'A lawyer conducting a case in court — here, generally a barrister.' },
        { term: 'Intimately connected', def: 'Pre-trial work so closely tied to the case in court that it is covered.' },
        { term: 'Finality of judgment', def: 'A decided case should stay decided — the key reason in later cases.' },
        { term: 'Statute barred', def: 'Out of time: a claim brought after its limitation period has expired.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'As a matter of public policy, barristers are immune from negligence liability for the conduct of cases in court.' },
        { caption: 'The immunity also covers pre-trial matters intimately connected with the case in court — not legal work generally.' },
        { caption: 'Giannarelli v Wraith gives the reasons: the duty to the court may conflict with the duty to the client; defensive arguments would waste court time; and the finality of judgment — perhaps the most important.' },
        { caption: 'Outside the line, lawyers can be sued: a solicitor who misses a limitation period is liable for the lost claim, and negligent advice is pure economic loss caused by negligent misstatement.' },
      ]}
      check={{
        question: 'Months before any proceedings, a barrister gives written advice that turns out to be wrong. Where does the claim sit?',
        options: [
          { text: 'Inside the immunity, because the advice came from a barrister', why: 'The immunity attaches to the conduct of cases in court and intimately connected work, not to who the lawyer is.' },
          { text: 'Outside it: negligent advice, analysed as pure economic loss by negligent misstatement', correct: true, why: 'The lecturer sent advice to the Topic 7 misstatement rules; the immunity is about the courtroom.' },
          { text: 'Outside it, but only an intentional tort claim is available', why: 'Advice given deliberately is not an intentional wrong; the error is negligence.' },
        ],
      }}
    />
  );
}
