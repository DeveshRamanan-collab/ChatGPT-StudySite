/*
SCENE: Closed vs open models for innovation — when does implementation start?
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → switch closed/open and let the market respond → read the verdict → one check
INTENT: The two models differ only in timing: closed implements after the concept is frozen; open starts implementing
  mid-development, so the market's and users' response can still reshape the concept ("trial by fire").
SUBJECT: the implementation bar — where it starts relative to the concept-frozen marker.
BEAT 1 (0–100%): switching to open stretches concept development, moves the frozen marker right and extends
  implementation back so the two bars overlap; the feedback toggle draws the response arc (open) or a blocked arc
  (closed). Full motion: transform-only moves, 240ms --ease-inout. Verdict updates within 200ms.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: calm and off drop the moves; the new figure fades in (180ms opacity only).
BUDGET: < 5 KB gz, no WebGL.
Source: concept mgmt2094-w11-open-and-closed-innovation-models (Week 11 slide 6; Week 9 recording, "trial by fire");
  example guest-founder-mark. The "blocked" arc in the closed model is the slide's own logic: the concept is frozen
  before implementation starts.
*/
import { useMemo } from 'react';
import { Simulation, type SimView } from '../bases/Simulation';
import { useExplainer } from '../context';

interface S extends Record<string, unknown> {
  model: 'closed' | 'open';
  feedback: boolean;
}

const initial: S = { model: 'closed', feedback: false };
const W = 360;
const START = 20;
const MARKET = 320;
const ui = { fontFamily: 'var(--font-ui)' } as const;
// Closed geometry; open is reached by transforms only.
const CONCEPT_END = { closed: 150, open: 220 };
const IMPL_START = { closed: 150, open: 110 };

function makeView(motion: string) {
  const full = motion === 'full';
  const move = full ? 'transform 240ms var(--ease-inout)' : 'none';
  const fade = { animation: 'fade-in 180ms var(--ease-out) both' } as const;

  return function view(s: S): SimView {
    const open = s.model === 'open';
    const conceptScale = (CONCEPT_END[s.model] - START) / (CONCEPT_END.closed - START);
    const implScale = (MARKET - IMPL_START[s.model]) / (MARKET - IMPL_START.closed);
    const frozenDx = CONCEPT_END[s.model] - CONCEPT_END.closed;
    const implDx = IMPL_START[s.model] - IMPL_START.closed;
    const bars = (
      <g key={full ? 'bars' : `bars-${s.model}`} style={full ? undefined : fade}>
        <rect x={START} y="62" width={CONCEPT_END.closed - START} height="30" rx="4" fill="var(--paper-3)" stroke="var(--ink)" strokeWidth="1.5"
          style={{ transform: `scaleX(${conceptScale})`, transformBox: 'view-box', transformOrigin: `${START}px 0px`, transition: move }} vectorEffect="non-scaling-stroke" />
        <text x={START + 2} y="56" {...ui} fontSize="11" fill="var(--ink)">concept development</text>
        <rect x={IMPL_START.closed} y="118" width={MARKET - IMPL_START.closed} height="30" rx="4" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5"
          style={{ transform: `scaleX(${implScale})`, transformBox: 'view-box', transformOrigin: `${MARKET}px 0px`, transition: move }} vectorEffect="non-scaling-stroke" />
        <text x={IMPL_START.closed + 4} y="166" {...ui} fontSize="11" fill="var(--ink)" style={{ transform: `translateX(${implDx}px)`, transition: move }}>implementation</text>
        <g style={{ transform: `translateX(${frozenDx}px)`, transition: move }}>
          <line x1={CONCEPT_END.closed} y1="30" x2={CONCEPT_END.closed} y2="96" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x={CONCEPT_END.closed} y="24" textAnchor="middle" {...ui} fontSize="11" letterSpacing="1" fill="var(--ink)">CONCEPT FROZEN</text>
        </g>
      </g>
    );
    const arc = s.feedback && (
      <g key={`arc-${s.model}`} style={fade}>
        {open ? (
          <>
            <path d="M 150 118 C 172 110, 172 100, 150 94" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
            <polyline points="157,91 150,94 155,100" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
            <text x="178" y="110" {...ui} fontSize="11" fill="var(--ink)">reshapes the concept</text>
          </>
        ) : (
          <>
            <path d="M 236 118 C 214 104, 190 100, 160 98" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="156" y="102" textAnchor="end" {...ui} fontSize="14" fill="var(--ink-3)">×</text>
            <text x="244" y="110" {...ui} fontSize="11" fill="var(--ink-2)">too late: frozen</text>
          </>
        )}
      </g>
    );
    const figure = (
      <svg viewBox={`0 0 ${W} 200`} role="img" aria-label={open ? 'Open model: implementation starts midway through concept development, before the concept is frozen' : 'Closed model: implementation starts only after the concept is frozen'}>
        <line x1={START} y1="30" x2={START} y2="176" stroke="var(--ink-3)" strokeWidth="1" />
        <line x1={MARKET} y1="30" x2={MARKET} y2="176" stroke="var(--ink-3)" strokeWidth="1" />
        <text x={START} y="192" {...ui} fontSize="11" fill="var(--ink-2)">project start</text>
        <text x={MARKET} y="192" textAnchor="end" {...ui} fontSize="11" fill="var(--ink-2)">market introduction</text>
        {bars}
        {arc}
      </svg>
    );
    if (open)
      return s.feedback
        ? { figure, tone: 'yes', verdict: "Open: a trial by fire. Implementation is under way while the concept is still developing, so the market's and users' response feeds back into it." }
        : { figure, tone: 'open', verdict: 'Open: implementation starts somewhere in the middle of concept development, before the concept is frozen. The two overlap.' };
    return s.feedback
      ? { figure, tone: 'no', verdict: 'Closed: the concept was frozen before implementation began, so this response cannot feed back into concept development.' }
      : { figure, tone: 'open', verdict: 'Closed: develop the concept, freeze it, then implement and introduce it to the market — one step after another.' };
  };
}

function describe(a: S, b: S) {
  if (a.model !== b.model)
    return b.model === 'open' ? 'Open: implementation now starts midway through concept development, and the concept is frozen later.' : 'Closed: implementation now waits until the concept is frozen.';
  if (a.feedback !== b.feedback) return b.feedback ? 'The market and users respond while implementation is under way.' : 'No response from the market yet.';
  return '';
}

export default function OpenAndClosedInnovationModels() {
  const { motion } = useExplainer();
  const view = useMemo(() => makeView(motion), [motion]);
  return (
    <Simulation<S>
      label="Closed and open models for innovation on one timeline"
      terms={[
        { term: 'Concept frozen', def: 'The point after which the concept stops changing.' },
        { term: 'Closed model', def: 'Steps run consecutively: develop the concept, freeze it, then implement.' },
        { term: 'Open model', def: 'Implementation starts in the middle of concept development, before the freeze.' },
        { term: 'Trial by fire', def: "The lecturer's phrase for implementing early and learning from the market's response." },
      ]}
      initial={initial}
      controls={[
        { key: 'model', label: 'Model', type: 'select', options: [{ value: 'closed', label: 'Closed model' }, { value: 'open', label: 'Open model' }] },
        { key: 'feedback', label: 'The market and users respond during implementation', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'An app team releases a basic version while still designing it, then reshapes the design from user reviews. Which model?',
        options: [
          { text: 'Closed model', why: 'Tempting because the app is eventually released, but the closed model freezes the concept before implementing anything.' },
          { text: 'Open model', correct: true, why: 'Implementation began before the concept was frozen, and users\' response is reshaping it — the open model\'s trial by fire.' },
          { text: 'Linear model', why: 'Tempting because there is a sequence, but the linear model is about science to market through gates, not overlapping development and implementation.' },
        ],
      }}
    />
  );
}
