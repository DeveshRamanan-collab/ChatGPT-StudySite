/*
SCENE: Judicial decisions and scholarly writings — two towers, precedent that binds v decisions that only persuade
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Art 59 means an ICJ decision binds only the parties in that case, yet later cases still read and follow it;
  publicists and the ILC feed the same interpretive role.
SUBJECT: the arrows between cases — solid in the common-law tower, dotted in the ICJ tower.
STEP 1: common-law tower, solid "binds" arrows. STEP 2: ICJ decision ringed "these parties, this case" (art 59).
STEP 3: dotted influence to later cases; why (legitimacy, predictability, settlement). STEP 4: publicists and ILC.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished figure with all four captions stacked (base).
BUDGET: < 8 KB gz. Strokes draw (DrawSVG), text fades.
Source: concept laws2000-w02-judicial-decisions-and-scholarly-writings; ICJ Statute art 59, art 38(1)(d).
*/
import { Diagram } from '../bases/Diagram';

const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.1, fill: 'var(--ink)' } as const;
const note = { fontFamily: 'var(--font-body)', fontSize: 13.5, fill: 'var(--ink-2)' } as const;
const YS = [40, 116, 192];

function Tower() {
  return (
    <>
      {YS.map((y, k) => (
        <g key={y}>
          <rect x="20" y={y} width="140" height="44" rx="8" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
          <text x="90" y={y + 27} textAnchor="middle" {...note} fill="var(--ink)">{k === 0 ? 'earlier case' : 'later case'}</text>
          {k > 0 && <line x1="90" y1={y - 30} x2="90" y2={y - 2} stroke="var(--ink)" strokeWidth="2.5" />}
          {k > 0 && <text x="98" y={y - 12} {...note} fontSize="12">binds</text>}
        </g>
      ))}
    </>
  );
}

const figure = (
  <svg viewBox="0 0 360 500" role="img" aria-label="Two towers: common-law precedent binds later cases; an ICJ decision binds only its parties but later cases still follow it">
    <g data-step="1">
      <text x="90" y="24" textAnchor="middle" {...ui} data-label="common-law">COMMON LAW</text>
      <Tower />
      <text x="90" y="262" textAnchor="middle" {...note}>precedent binds</text>
      <text x="90" y="280" textAnchor="middle" {...note}>later cases</text>
    </g>
    <g data-step="2">
      <text x="270" y="24" textAnchor="middle" {...ui} data-label="icj">ICJ</text>
      <rect x="196" y="40" width="148" height="44" rx="8" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="270" y="67" textAnchor="middle" {...note} fill="var(--ink)">decision: A v B</text>
      <text x="270" y="262" textAnchor="middle" {...note}>binds only these parties,</text>
      <text x="270" y="280" textAnchor="middle" {...note}>in this case (art 59)</text>
    </g>
    <g data-step="3">
      {YS.slice(1).map((y) => (
        <g key={y}>
          <rect x="200" y={y} width="140" height="44" rx="8" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
          <text x="270" y={y + 27} textAnchor="middle" {...note} fill="var(--ink)">later case</text>
          <line x1="270" y1={y - 30} x2="270" y2={y - 2} stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="3 4" />
          <text x="278" y={y - 12} {...note} fontSize="12">read, followed</text>
        </g>
      ))}
      <text x="8" y="318" {...ui}>WHY FOLLOW WHAT DOES NOT BIND?</text>
      <text x="8" y="340" {...note}>legitimacy · predictability · peaceful settlement;</text>
      <text x="8" y="358" {...note}>the ICJ rarely departs from its own jurisprudence</text>
    </g>
    <g data-step="4">
      <rect x="8" y="384" width="344" height="104" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x="22" y="408" {...ui} data-label="subsidiary">SUBSIDIARY MEANS · ART 38(1)(d)</text>
      <text x="22" y="430" {...note}>publicists’ teachings · ILC draft articles</text>
      <text x="22" y="450" {...note}>clarify ambiguous law; do not create it</text>
      <text x="22" y="470" {...note}>ILC drafts can, over time, become treaties</text>
    </g>
  </svg>
);

export default function JudicialDecisionsAndScholarlyWritings() {
  return (
    <Diagram
      label="Judicial decisions and scholarly writings: binding precedent contrasted with art 59"
      terms={[
        { term: 'Precedent', def: 'The common-law doctrine that an earlier decision binds later cases.' },
        { term: 'Article 59', def: '“The decision of the Court has no binding force except between the parties and in respect of that particular case.”' },
        { term: 'Publicists', def: 'Art 38(1)(d)’s “most highly qualified” scholars, whose teachings help interpret the law.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'In the common law, precedent binds: an earlier decision controls later cases.' },
        { caption: 'At the ICJ, art 59: a decision binds only the parties, in that case — not later cases, even between the same parties on similar facts. This respects consent-based, non-compulsory jurisdiction.' },
        { caption: 'Yet judges and practitioners constantly rely on earlier decisions, and the ICJ rarely departs from its own jurisprudence: consistency serves legitimacy, predictability and peaceful settlement.' },
        { caption: 'Scholarly writings and the ILC play the same subsidiary role: they clarify the law but do not create it. ILC draft articles (e.g. on state responsibility) can become treaties over time.' },
      ]}
      check={{
        question: 'How should an exam answer use an earlier ICJ decision?',
        options: [
          { text: 'As a binding precedent that decides the new case', why: 'Art 59: a decision binds only its parties in that case; there is no doctrine of precedent.' },
          { text: 'As persuasive support for how a primary source should be interpreted', correct: true, why: 'Decisions carry substantial interpretive weight but are never a freestanding source of the obligation.' },
          { text: 'Not at all, because it does not bind', why: 'Decisions are constantly relied on and the Court rarely departs from them; ignoring them wastes strong support.' },
        ],
      }}
    />
  );
}
