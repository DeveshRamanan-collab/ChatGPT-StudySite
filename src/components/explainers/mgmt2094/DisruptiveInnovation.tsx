/*
SCENE: Disruptive innovation — is it really disruptive?
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → set the answers to the class activity's questions → watch the entrant's path and the verdict → one check
INTENT: In Christensen's theory (as the Week 8 class activity summarises it) disruption usually begins with an
  overlooked, low-end or new-market segment and a simpler, cheaper or more accessible offer, then improves enough to
  challenge established firms; success or radicalness alone is not the test.
SUBJECT: the entrant's marker on a strip from "overlooked / low-end / non-consumers" to "mainstream"; it carries the
  one accent, and an arrow toward the incumbent appears only when the market-movement answer is yes.
BEAT 1 (0–100%): one toggle and three selects (incumbent, initial customer, value proposition, market movement). The
  marker and arrow cross-fade (opacity 180ms --ease-out; none when motion is off); the four question rows tick or
  cross; the verdict (disruptive / potentially disruptive / not disruptive) updates within 200ms.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: same controls and view; no positional movement (marker positions are swapped by opacity, not slid).
BUDGET: < 6 KB gz, no WebGL.
Source: concept mgmt2094-w08-disruptive-innovation; class activity "Is It Really Disruptive Innovation?" (Week 8);
  authority mgmt2094-class-activity-is-it-really-disruptive. The activity's own cases are left as open questions:
  the simulation uses generic answers, not verdicts on Netflix, Uber or the others.
*/
import { useMemo } from 'react';
import { Simulation, type SimView } from '../bases/Simulation';
import { useExplainer } from '../context';

interface S extends Record<string, unknown> {
  incumbent: boolean;
  customer: 'overlooked' | 'mainstream';
  offer: 'simpler' | 'premium';
  movement: 'not-yet' | 'moved';
}

const initial: S = { incumbent: true, customer: 'overlooked', offer: 'simpler', movement: 'not-yet' };

const W = 360;
const ui = { fontFamily: 'var(--font-ui)' } as const;
const serif = { fontFamily: 'var(--font-body)' } as const;

function rows(s: S) {
  const start = s.customer === 'overlooked' && s.offer === 'simpler';
  return [
    { q: 'INCUMBENT', a: s.incumbent ? 'an established firm or model at risk' : 'none named yet', ok: s.incumbent },
    { q: 'INITIAL CUSTOMER', a: s.customer === 'overlooked' ? 'overlooked, low-end or non-consumer' : "the incumbent's mainstream customers", ok: s.customer === 'overlooked' },
    { q: 'VALUE PROPOSITION', a: s.offer === 'simpler' ? 'cheaper, simpler, more accessible' : 'better and pricier', ok: s.offer === 'simpler' },
    { q: 'MARKET MOVEMENT', a: s.movement === 'moved' ? 'moved toward the mainstream' : 'not toward the mainstream yet', ok: s.movement === 'moved' && start },
  ];
}

function makeView(fade: string) {
  return (s: S): SimView => {
    const rs = rows(s);
    const atMargin = s.customer === 'overlooked';
    const moved = s.movement === 'moved';
    const figure = (
      <svg viewBox={`0 0 ${W} 300`} role="img" aria-label={`The entrant starts with ${atMargin ? 'overlooked or low-end customers' : 'mainstream customers'}${moved ? ' and has moved toward the mainstream' : ''}`}>
        {rs.map((r, i) => (
          <g key={r.q} data-question={r.q.toLowerCase().replace(/ /g, '-')} data-ok={r.ok || undefined}>
            <text x="16" y={26 + i * 42} {...ui} fontSize="11" letterSpacing="1.2" fill="var(--ink-2)">{r.q}</text>
            <text x="16" y={44 + i * 42} {...serif} fontSize="13" fill="var(--ink)">{r.a}</text>
            <text x={W - 16} y={36 + i * 42} textAnchor="end" {...ui} fontSize="14" fill={r.ok ? 'var(--ink)' : 'var(--ink-3)'}>{r.ok ? '✓' : '–'}</text>
          </g>
        ))}
        <line x1="16" y1="196" x2={W - 16} y2="196" stroke="var(--ink-3)" strokeWidth="1" />
        <rect x="16" y="228" width={W - 32} height="18" rx="9" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
        <text x="16" y="270" {...ui} fontSize="10" letterSpacing="1" fill="var(--ink-2)">OVERLOOKED · LOW-END</text>
        <text x={W - 16} y="270" textAnchor="end" {...ui} fontSize="10" letterSpacing="1" fill="var(--ink-2)">MAINSTREAM</text>
        <text x={W - 16} y="286" textAnchor="end" {...serif} fontSize="11" fill="var(--ink-3)">incumbent's best customers</text>
        <text x="16" y="286" {...serif} fontSize="11" fill="var(--ink-3)">non-consumers</text>
        <text x={W / 2} y="218" textAnchor="middle" {...ui} fontSize="10" letterSpacing="1" fill="var(--ink-3)">THE MARKET</text>
        <circle cx="40" cy="237" r="7" fill="var(--accent)" style={{ opacity: atMargin ? 1 : 0, transition: fade }} data-entrant="margin" />
        <circle cx={W - 40} cy="237" r="7" fill="var(--accent)" style={{ opacity: atMargin ? 0 : 1, transition: fade }} data-entrant="mainstream" />
        <g style={{ opacity: atMargin && moved ? 1 : 0, transition: fade }} data-arrow>
          <line x1="54" y1="237" x2={W - 60} y2="237" stroke="var(--ink)" strokeWidth="1.5" />
          <path d={`M${W - 52} 237 L${W - 62} 231 L${W - 62} 243 Z`} fill="var(--ink)" />
        </g>
      </svg>
    );
    const start = s.customer === 'overlooked' && s.offer === 'simpler';
    let verdict: string;
    let tone: SimView['tone'];
    if (!s.incumbent) { verdict = 'No verdict yet: name the established company, industry or business model that is potentially being disrupted.'; tone = 'open'; }
    else if (!start) {
      verdict = s.customer === 'mainstream'
        ? "Not disruptive on this definition: it starts with the incumbent's mainstream customers, not overlooked, low-end or new-market ones. It may still be successful or radical."
        : 'Not disruptive on this definition: the offer is better and pricier, not simpler, cheaper or more accessible. Not every radical innovation is disruptive.';
      tone = 'no';
    } else if (!moved) { verdict = 'Potentially disruptive: the right start (overlooked customers, a simpler, cheaper offer) but no move toward the mainstream yet.'; tone = 'open'; }
    else { verdict = 'Disruptive innovation: it began at the margin with a simpler, cheaper or more accessible offer and improved enough to challenge established firms.'; tone = 'yes'; }
    return { figure, verdict, tone };
  };
}

function describe(a: S, b: S) {
  if (a.incumbent !== b.incumbent) return b.incumbent ? 'An incumbent is named: now there is something that could be disrupted.' : 'No incumbent: the first question is unanswered, so there is nothing to call disrupted.';
  if (a.customer !== b.customer) return b.customer === 'overlooked' ? 'It now starts with overlooked, low-end or non-consumer customers — where disruption usually begins.' : "It now starts with the incumbent's mainstream customers: that is competing head-on, not the disruptive path.";
  if (a.offer !== b.offer) return b.offer === 'simpler' ? 'The offer is cheaper, simpler or more accessible — the value proposition the definition looks for.' : 'A better, pricier offer: successful perhaps, but not the simpler, cheaper start disruption usually needs.';
  if (a.movement !== b.movement) return b.movement === 'moved' ? 'It has improved and moved toward mainstream customers, challenging the incumbent.' : 'Still outside the mainstream: the market-movement question is not yet answered yes.';
  return '';
}

export default function DisruptiveInnovation() {
  const { motion } = useExplainer();
  const fade = motion === 'off' ? 'none' : 'opacity 180ms var(--ease-out)';
  const view = useMemo(() => makeView(fade), [fade]);
  return (
    <Simulation<S>
      label="Is it really disruptive? Answer the class activity's questions and watch the entrant's path and the verdict"
      terms={[
        { term: 'Incumbent', def: 'The established company, industry or business model that is potentially being disrupted.' },
        { term: 'Non-consumer', def: 'Someone who did not buy the incumbent\'s product at all — one of the places disruption starts.' },
        { term: 'Disruptive innovation', def: "Christensen's theory: starts with overlooked, low-end or new-market customers and a simpler, cheaper offer, then improves enough to challenge established firms." },
      ]}
      initial={initial}
      controls={[
        { key: 'incumbent', label: 'An incumbent firm or model is at risk', type: 'toggle' },
        { key: 'customer', label: 'Initial customer', type: 'select', options: [{ value: 'overlooked', label: 'Overlooked, low-end or non-consumer' }, { value: 'mainstream', label: "The incumbent's mainstream customers" }] },
        { key: 'offer', label: 'Value proposition', type: 'select', options: [{ value: 'simpler', label: 'Cheaper, simpler, more accessible' }, { value: 'premium', label: 'Better and pricier' }] },
        { key: 'movement', label: 'Market movement', type: 'select', options: [{ value: 'not-yet', label: 'Still outside the mainstream' }, { value: 'moved', label: 'Moved toward mainstream customers' }] },
      ]}
      view={view}
      describe={describe}
      check={{
        question: "A group says: 'It is disruptive because it is radical and hugely successful.' On the class activity's terms, what is wrong?",
        options: [
          { text: 'Nothing: radical, successful innovations are disruptive by definition', why: 'The activity opens by warning the opposite: not every successful or radical innovation is disruptive.' },
          { text: 'Success is not the test; walk the questions about where it started and how it moved', correct: true, why: 'Disruption is a path — an overlooked or low-end start with a simpler, cheaper offer, then a move toward the mainstream — so the group must answer the activity\'s questions and defend a verdict.' },
          { text: 'Only physical products can be disruptive', why: "The activity's own cases include Netflix, Spotify, Canva and ChatGPT, which are services and software." },
        ],
      }}
    />
  );
}
