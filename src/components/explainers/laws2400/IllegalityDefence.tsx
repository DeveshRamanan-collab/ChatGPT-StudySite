/*
SCENE: Illegality — a fork on one question: can the court determine the standard of care?
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
BEATS: 4
INTENT: Show that the crime alone does not decide it: in a joint criminal enterprise the defence turns on whether, on
  the facts, an appropriate standard of care can be determined (Gala v Preston; Progress & Properties Ltd v Craft).
SUBJECT: the hinge box in the middle and its two exits.
BEAT 1 (0–25%): start box — plaintiff injured; plaintiff and defendant involved in the criminal enterprise. DrawSVG,
  ease none (scrubbed); text fades.
BEAT 2 (25–50%): the hinge — on the facts, can the court determine an appropriate standard of care?
BEAT 3 (50–75%): "no" exit — the defence of illegality is available (Gala v Preston).
BEAT 4 (75–100%): "yes" exit — the defence is not available (Progress & Properties Ltd v Craft).
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished fork with all four captions stacked (base).
BUDGET: < 6 KB gz; no WebGL. Narrow 360-unit canvas so the type stays legible on phones.
Source: Tort Law Principles 3e p 479 flowchart; concept laws2400-w12-illegality-defence.
*/
import { Diagram } from '../bases/Diagram';

const ui = { fontFamily: 'var(--font-ui)', fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fill: 'var(--ink-2)' } as const;

const figure = (
  <svg viewBox="0 0 360 430" role="img" aria-label="A fork: plaintiff and defendant in a criminal enterprise; can the court determine the standard of care? No: illegality available. Yes: not available.">
    <g data-step="1">
      <rect x="8" y="8" width="344" height="78" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="180" y="34" textAnchor="middle" {...ui} fontSize="12" letterSpacing="1.2" data-label="start">JOINT CRIMINAL ENTERPRISE</text>
      <text x="180" y="56" textAnchor="middle" {...body} fontSize="15">The plaintiff is injured; plaintiff and</text>
      <text x="180" y="75" textAnchor="middle" {...body} fontSize="15">defendant were in the criminal enterprise</text>
      <line x1="180" y1="86" x2="180" y2="118" stroke="var(--ink-3)" strokeWidth="1.5" />
    </g>
    <g data-step="2">
      <rect x="40" y="118" width="280" height="96" rx="14" fill="none" stroke="var(--ink)" strokeWidth="2" />
      <text x="180" y="144" textAnchor="middle" {...ui} fontSize="12" letterSpacing="1.2" data-label="hinge">THE HINGE</text>
      <text x="180" y="168" textAnchor="middle" {...body} fontSize="15" fill="var(--ink)">On the facts, can the court determine</text>
      <text x="180" y="188" textAnchor="middle" {...body} fontSize="15" fill="var(--ink)">an appropriate standard of care?</text>
      <path d="M110 214 V250 M250 214 V250" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
    </g>
    <g data-step="3">
      <text x="98" y="240" textAnchor="end" {...ui} fontSize="12" fill="var(--ink-2)">no</text>
      <rect x="8" y="250" width="166" height="168" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="20" y="276" {...ui} fontSize="12" letterSpacing="1.2" data-label="available">AVAILABLE</text>
      {['Courts have found a', 'defence of illegality', 'is available to the', 'defendant'].map((l, i) => (
        <text key={l} x="20" y={300 + i * 19} {...body} fontSize="14.5">{l}</text>
      ))}
      <text x="20" y="398" {...body} fontSize="14" fontStyle="italic" fill="var(--ink)">Gala v Preston</text>
    </g>
    <g data-step="4">
      <text x="262" y="240" {...ui} fontSize="12" fill="var(--ink-2)">yes</text>
      <rect x="186" y="250" width="166" height="168" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="198" y="276" {...ui} fontSize="12" letterSpacing="1.2" data-label="unavailable">NOT AVAILABLE</text>
      {['The defence will not', 'be available to the', 'defendant'].map((l, i) => (
        <text key={l} x="198" y={300 + i * 19} {...body} fontSize="14.5">{l}</text>
      ))}
      <text x="198" y="379" {...body} fontSize="14" fontStyle="italic" fill="var(--ink)">Progress &amp; Properties</text>
      <text x="198" y="398" {...body} fontSize="14" fontStyle="italic" fill="var(--ink)">Ltd v Craft</text>
    </g>
  </svg>
);

export default function IllegalityDefence() {
  return (
    <Diagram
      label="Illegality: a fork on whether the court can determine the standard of care"
      terms={[
        { term: 'Illegality', def: 'A defence available to the defendant in some joint criminal enterprise cases.' },
        { term: 'Criminal enterprise', def: 'The plaintiff and the defendant were involved in the crime together.' },
        { term: 'Standard of care', def: 'What the defendant owed the plaintiff — the question the defence turns on.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Start: the plaintiff has been injured, and the plaintiff and defendant were involved in the criminal enterprise.' },
        { caption: 'The hinge is not the crime itself: on the facts, is it possible or feasible to determine an appropriate standard of care?' },
        { caption: 'No: the courts have often found the standard cannot be set, and in such cases a defence of illegality is available (Gala v Preston).' },
        { caption: 'Yes: where, on the facts, the court is able to determine the relevant standard of care, the defence is not available (Progress & Properties Ltd v Craft).' },
      ]}
      check={{
        question: 'Two people steal a car together and the driver crashes, injuring the passenger. The court finds it can determine the standard of care the driver owed. Is illegality available?',
        options: [
          { text: 'Yes, because they were in a criminal enterprise', why: 'The enterprise is the starting point, not the answer: the standard of care question decides it.' },
          { text: 'No, because the standard of care can be determined', correct: true, why: 'Progress & Properties Ltd v Craft, as cited: not available where the court can determine the relevant standard of care.' },
          { text: 'Only to reduce the damages', why: 'Illegality is described as a defence that is available or not; reductions belong to contributory negligence.' },
        ],
      }}
    />
  );
}
