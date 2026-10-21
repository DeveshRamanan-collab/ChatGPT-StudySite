/*
SCENE: Factual causation — the 'but for' and necessary condition questions as mirror images
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → set the court's finding and the column → watch both questions answer → s 5D(3) evidence → one check
INTENT: Show that the common law 'but for' question and the statutory necessary condition question (s 5D(1)(a)) reach
  the same result from opposite answers ('No' satisfies one, 'Yes' the other), that a cause that cannot be shown
  answers neither (the s 5D(2) route), and that s 5D(3) decides hypothetical conduct subjectively while excluding
  self-serving statements made after the harm.
SUBJECT: the two answer pills, which flip in opposite directions when the finding changes.
BEAT 1 (0–100%): controls for the finding, the column, and s 5D(3); both question rows re-answer, the chosen column
  is outlined in ink, the verdict line updates within 200ms. Colour/opacity only, --dur-micro, --ease-out.
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (duration tokens are 0 in off); no positional movement anywhere.
BUDGET: < 6 KB gz, no WebGL.
Source: concept laws2400-w10-factual-causation-necessary-condition; Topic 10 flowchart p 434 (Causation 2);
  Civil Liability Act 2002 (NSW) s 5D(1)(a), (2), (3) (authority civil-liability-act-2002-nsw-s5d). The flowchart's
  note that the provision "is the 'but for' test of causation at common law" names "Section 5C(1)" (verify).
The simulation does not decide the facts: the court's finding about what would have happened is a control.
*/
import type { CSSProperties } from 'react';
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  finding: 'depended' | 'anyway' | 'unknown';
  column: 'cla' | 'common';
  hypothetical: boolean;
  statement: 'none' | 'helps' | 'against';
}

const initial: S = { finding: 'depended', column: 'cla', hypothetical: false, statement: 'none' };

type Result = 'satisfied' | 'not' | 'gap';
const RESULT_TEXT: Record<Result, string> = { satisfied: 'factual causation satisfied', not: 'factual causation not satisfied', gap: 'cannot be answered — gap case' };

const fadeColour: CSSProperties = { transition: 'border-color var(--dur-micro) var(--ease-out), opacity var(--dur-micro) var(--ease-out), color var(--dur-micro) var(--ease-out)' };

function answers(f: S['finding']) {
  // Common law asks "would the injuries have been suffered but for the negligence?" (would they happen anyway?);
  // the Act asks "was the fault a necessary condition of the harm?". Mirror images.
  if (f === 'depended') return { common: 'No', cla: 'Yes', result: 'satisfied' as Result };
  if (f === 'anyway') return { common: 'Yes', cla: 'No', result: 'not' as Result };
  return { common: '?', cla: '?', result: 'gap' as Result };
}

function Row({ active, label, question, answer, result }: { active: boolean; label: string; question: string; answer: string; result: Result }) {
  const bar = result === 'satisfied' ? 'var(--sage)' : result === 'not' ? 'var(--clay)' : 'var(--ink-3)';
  return (
    <div data-row={label} style={{ ...fadeColour, border: '2px solid', borderColor: active ? 'var(--ink)' : 'var(--line)', borderRadius: 'var(--r-md)', padding: 'var(--s-3) var(--s-4)', background: 'var(--paper)', opacity: active ? 1 : 0.7, display: 'grid', gap: 'var(--s-2)' }}>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--t-xs)', letterSpacing: '0.08em', color: 'var(--ink-2)' }}>{label}</span>
      <span style={{ fontSize: 'var(--t-sm)', lineHeight: 1.4, color: 'var(--ink)' }}>{question}</span>
      <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--s-3)' }}>
        <span className="mono" data-answer style={{ minWidth: '3.5em', textAlign: 'center', padding: '2px var(--s-3)', border: '1.5px solid var(--ink)', borderRadius: 'var(--r-pill)', fontSize: 'var(--t-sm)' }}>{answer}</span>
        <span style={{ ...fadeColour, fontFamily: 'var(--font-ui)', fontSize: 'var(--t-sm)', color: 'var(--ink)', borderLeft: `3px solid ${bar}`, paddingLeft: 'var(--s-2)' }}>→ {RESULT_TEXT[result]}</span>
      </span>
    </div>
  );
}

function view(s: S): SimView {
  const a = answers(s.finding);
  const stmt =
    s.statement === 'helps'
      ? 'Their own statement after the harm that helps them (“I would have…”) is inadmissible — s 5D(3)(b).'
      : s.statement === 'against'
        ? 'A statement after the harm that is against their interest is admissible to that extent — s 5D(3)(b).'
        : 'No post-harm statement relied on: the court weighs all the relevant circumstances.';
  const figure = (
    <div style={{ display: 'grid', gap: 'var(--s-3)', fontFamily: 'var(--font-ui)' }} role="group" aria-label="The two factual causation questions and their answers">
      <p style={{ margin: 0, fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>Must find a connection between the breach and the injury (Adeels Palace; Strong v Woolworths).</p>
      <Row active={s.column === 'common'} label="COMMON LAW · ‘BUT FOR’" question="Would the plaintiff’s injuries have been suffered but for the defendant’s negligence?" answer={a.common} result={a.result} />
      <Row active={s.column === 'cla'} label="CLA · s 5D(1)(a) · NECESSARY CONDITION" question="Was the defendant’s fault a necessary condition of the occurrence of the harm?" answer={a.cla} result={a.result} />
      {a.result === 'gap' && (
        <p data-gap style={{ margin: 0, fontSize: 'var(--t-sm)', color: 'var(--ink)', borderLeft: '3px solid var(--ink-3)', paddingLeft: 'var(--s-3)', animation: 'fade-in var(--dur-ui) var(--ease-out) both' }}>
          Multiple sufficient causes or material contribution to harm? The flowchart turns to s 5D(2): an exceptional case, with a clear breach and an evidentiary gap.
        </p>
      )}
      {s.hypothetical && (
        <div data-s5d3 style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-md)', padding: 'var(--s-3) var(--s-4)', background: 'var(--paper-2)', display: 'grid', gap: 'var(--s-1)', animation: 'fade-in var(--dur-ui) var(--ease-out) both' }}>
          <span style={{ fontSize: 'var(--t-xs)', letterSpacing: '0.08em', color: 'var(--ink-2)' }}>s 5D(3) · WHAT WOULD THEY HAVE DONE?</span>
          <span style={{ fontSize: 'var(--t-sm)', color: 'var(--ink)' }}>Decided subjectively — this person, not a reasonable person — in the light of all relevant circumstances.</span>
          <span style={{ fontSize: 'var(--t-sm)', color: 'var(--ink)' }} data-statement>{stmt}</span>
        </div>
      )}
    </div>
  );
  const verdict =
    a.result === 'satisfied'
      ? s.column === 'cla'
        ? 'Satisfied: ‘Yes’ — the fault was a necessary condition (s 5D(1)(a)). The ‘but for’ answer is ‘No’: same result.'
        : 'Satisfied: ‘No’ — the injuries would not have been suffered but for the negligence. The s 5D(1)(a) answer is ‘Yes’.'
      : a.result === 'not'
        ? s.column === 'cla'
          ? 'Not satisfied: ‘No’ — the fault was not a necessary condition; the harm would have happened anyway.'
          : 'Not satisfied: ‘Yes’ — the injuries would have been suffered anyway. The s 5D(1)(a) answer is ‘No’.'
        : 'Neither question can be answered: only the s 5D(2) route remains, in an exceptional case.';
  return { figure, verdict, tone: a.result === 'satisfied' ? 'yes' : a.result === 'not' ? 'no' : 'open' };
}

function describe(a: S, b: S) {
  if (a.finding !== b.finding)
    return b.finding === 'depended'
      ? 'The harm depended on the fault: the ‘but for’ answer becomes No and the necessary condition answer Yes — both satisfied.'
      : b.finding === 'anyway'
        ? 'The harm would have happened anyway: the ‘but for’ answer flips to Yes and the necessary condition answer to No — both fail.'
        : 'The cause cannot be shown: neither question gets an answer, so the flowchart looks to s 5D(2).';
  if (a.column !== b.column) return b.column === 'cla' ? 'Now asked under the Act (s 5D(1)(a)): same facts, opposite answer word, same result.' : 'Now asked at common law (‘but for’): same facts, opposite answer word, same result.';
  if (a.hypothetical !== b.hypothetical) return b.hypothetical ? 'The finding turns on what the plaintiff would have done: s 5D(3) governs how it is made.' : 's 5D(3) set aside: the finding does not depend on what the plaintiff would have done.';
  if (a.statement !== b.statement)
    return b.statement === 'helps' ? 'A self-serving statement made after the harm: excluded by s 5D(3)(b).' : b.statement === 'against' ? 'A statement against interest: admissible to that extent under s 5D(3)(b).' : 'No statement relied on.';
  return '';
}

export default function FactualCausationNecessaryCondition() {
  return (
    <Simulation<S>
      label="Factual causation: the 'but for' and necessary condition questions"
      terms={[
        { term: 'Necessary condition', def: 'The statutory test (s 5D(1)(a)): without the fault, the harm would not have occurred.' },
        { term: '‘But for’ test', def: 'The common law question: would the injuries have been suffered but for the negligence?' },
        { term: 'Subjectively', def: 's 5D(3)(a): what this injured person would have done, not a reasonable person.' },
        { term: 'Against interest', def: 'A post-harm statement that hurts the speaker’s own case — the only kind s 5D(3)(b) admits.' },
      ]}
      initial={initial}
      controls={[
        { key: 'finding', label: 'Court’s finding on the evidence', type: 'select', options: [
          { value: 'depended', label: 'The harm depended on the fault' },
          { value: 'anyway', label: 'The harm would have happened anyway' },
          { value: 'unknown', label: 'The cause cannot be shown' },
        ] },
        { key: 'column', label: 'Ask the question', type: 'select', options: [
          { value: 'cla', label: 'Under the CLA — s 5D(1)(a)' },
          { value: 'common', label: 'At common law — ‘but for’' },
        ] },
        { key: 'hypothetical', label: 'It turns on what the plaintiff would have done (s 5D(3))', type: 'toggle' },
        { key: 'statement', label: 'Plaintiff’s statement after the harm', type: 'select', options: [
          { value: 'none', label: 'None relied on' },
          { value: 'helps', label: 'Helps them: “I would have…”' },
          { value: 'against', label: 'Against their interest' },
        ] },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'On the same facts, the s 5D(1)(a) answer is ‘Yes’. What is the common law ‘but for’ answer, and the result?',
        options: [
          { text: '‘No’ — and both mean factual causation is satisfied', correct: true, why: 'The questions are mirror images: the injuries would not have been suffered but for the negligence (No), and the fault was a necessary condition (Yes) — both satisfied.' },
          { text: '‘Yes’ — the two questions always give the same answer word', why: 'They give the same result, not the same word: ‘Yes’ to ‘but for’ means the injuries would have happened anyway, which fails.' },
          { text: 'There is no common law question once the CLA applies', why: 'The flowchart keeps both columns and its note says the statutory provision is the common law ‘but for’ test; both can be asked.' },
        ],
      }}
    />
  );
}
