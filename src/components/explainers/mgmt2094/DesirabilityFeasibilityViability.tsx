/*
SCENE: The innovation sweet spot — desirable, feasible, viable — as three gates, in the order the team checks them
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → change the facts → watch the three gates → one check
INTENT: An idea is in the sweet spot only when it is desirable, feasible and viable at once; and the order matters —
  starting from what we can make leaves the customer to see the idea first at launch.
SUBJECT: the path through the three gates; it stops at the first lens that fails, and the last gate is relabelled
  "launch" when the team started from feasibility.
BEAT 1 (0–100%): toggles for the evidence on each lens, the sector, and which lens was checked first; the verdict
  names the missing lens within 200ms. Ease: CSS 180ms ease-out on colour only (base styles).
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (no motion beyond colour); off mode shows the same controls.
BUDGET: < 6 KB gz, no WebGL.
Source: concept mgmt2094-w03-desirability-feasibility-viability (guest lecture; Tim Brown's definition in the Week 3
  reading). The Segway/Dyson pair is named only in the check's whys, from the transcript (verify on the example card).
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  desirable: boolean;
  feasible: boolean;
  viable: boolean;
  sector: 'business' | 'public';
  start: 'desirability' | 'feasibility';
}

const initial: S = { desirable: false, feasible: true, viable: true, sector: 'business', start: 'feasibility' };

type Lens = { id: 'd' | 'f' | 'v'; label: string; sub: string; pass: boolean };

function lenses(s: S): Lens[] {
  const d: Lens = { id: 'd', label: 'Desirable', sub: s.start === 'feasibility' ? 'first tested at launch' : 'people want it', pass: s.desirable };
  const f: Lens = { id: 'f', label: 'Feasible', sub: 'we can make it, technically and organisationally', pass: s.feasible };
  const v: Lens = { id: 'v', label: 'Viable', sub: s.sector === 'public' ? 'a big impact for citizens' : 'we can make money from it', pass: s.viable };
  return s.start === 'feasibility' ? [f, v, d] : [d, f, v];
}

function view(s: S): SimView {
  const ls = lenses(s);
  const stop = ls.find((l) => !l.pass);
  let reached = true;
  const figure = (
    <div className="xgates" role="group" aria-label={`Three lenses in the order checked: ${ls.map((l) => l.label).join(', ')}`}>
      <ol className="xgates__row">
        {ls.map((l) => {
          const lit = reached;
          const blocked = !l.pass && reached;
          if (blocked) reached = false;
          const state = blocked ? 'stop' : lit ? 'pass' : 'idle';
          return (
            <li key={l.id} className="xgate" data-gate={l.id} data-state={state} data-lit={lit ? 'true' : undefined}>
              <span className="xgate__box">
                <span className="xgate__label">{l.label}</span>
                <span className="xgate__status">{blocked ? 'fails here' : lit ? 'holds' : '—'}</span>
              </span>
              <span className="xgate__sub">{l.sub}</span>
            </li>
          );
        })}
      </ol>
      <p className="xgates__end" data-state={stop ? 'stop' : 'pass'}>{stop ? 'outside the sweet spot' : 'the sweet spot'}</p>
      <div className="xgates__circ">
        <p className="xgates__circ-title">Order of checking:</p>
        <ul>
          <li data-on={s.start === 'desirability' ? 'true' : undefined}>{s.start === 'desirability' ? '● ' : '○ '}desirability first, then feasibility and viability</li>
          <li data-on={s.start === 'feasibility' ? 'true' : undefined}>{s.start === 'feasibility' ? '● ' : '○ '}what we can make → a business case → launch</li>
        </ul>
      </div>
    </div>
  );
  const viableWord = s.sector === 'public' ? 'it would have little impact for citizens' : 'it would not make money';
  let verdict: string;
  let tone: SimView['tone'];
  if (!stop) {
    tone = s.start === 'desirability' ? 'yes' : 'open';
    verdict = s.start === 'desirability'
      ? 'The sweet spot: desirable, feasible and viable — and desirability was tested first, while it was cheap.'
      : 'All three hold, but only by luck: the customer first saw the idea at launch, after the money was spent.';
  } else if (stop.id === 'd') {
    tone = 'no';
    verdict = s.start === 'feasibility'
      ? 'It works and the numbers were written — but nobody wants it, found out at launch: the most expensive moment.'
      : 'Stopped early and cheaply: people do not want it yet. Rethink the idea before building anything more.';
  } else if (stop.id === 'f') {
    tone = 'no';
    verdict = 'Not feasible: it cannot be made, technically or organisationally, as things stand.';
  } else {
    tone = 'no';
    verdict = `Not viable: ${viableWord}.`;
  }
  return { figure, verdict, tone };
}

function describe(a: S, b: S) {
  if (a.desirable !== b.desirable) return b.desirable ? 'Evidence that people want it: desirability holds.' : 'No evidence anyone wants it — the commonest reason ideas fail.';
  if (a.feasible !== b.feasible) return b.feasible ? 'It can be made, technically and organisationally: feasibility holds.' : 'It cannot be made as things stand: feasibility fails.';
  if (a.viable !== b.viable) return b.viable ? 'It makes money, or has impact: viability holds.' : 'No money and no impact: viability fails.';
  if (a.sector !== b.sector) return b.sector === 'public' ? 'Government or not-for-profit: viable now means a big impact for citizens.' : 'A business: viable means you can make money from it.';
  if (a.start !== b.start) return b.start === 'desirability' ? 'Desirability first: customers see the idea early, when changing it is cheap.' : 'Feasibility first: build, write a business case on made-up numbers, then launch.';
  return '';
}

export default function DesirabilityFeasibilityViability() {
  return (
    <Simulation<S>
      label="The innovation sweet spot: desirable, feasible and viable"
      terms={[
        { term: 'Desirable', def: 'People — customers, consumers or users — want it.' },
        { term: 'Feasible', def: 'We can make it, technically and organisationally.' },
        { term: 'Viable', def: 'We can make money from it; for government or a not-for-profit, it has a big impact for citizens.' },
        { term: 'Sweet spot', def: 'Where an idea is all three at once.' },
      ]}
      initial={initial}
      controls={[
        { key: 'desirable', label: 'Evidence that people want it', type: 'toggle' },
        { key: 'feasible', label: 'We can make it, technically and organisationally', type: 'toggle' },
        { key: 'viable', label: 'It makes money (or has a big impact for citizens)', type: 'toggle' },
        { key: 'sector', label: 'Organisation', type: 'select', options: [{ value: 'business', label: 'A business' }, { value: 'public', label: 'Government or not-for-profit' }] },
        { key: 'start', label: 'Which lens did the team check first?', type: 'select', options: [{ value: 'feasibility', label: 'Feasibility: what we can make' }, { value: 'desirability', label: 'Desirability: what people want' }] },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Engineers have built a working coffee-delivery drone and the founder has a profit forecast. No customer has seen it. Which lens is untested?',
        options: [
          { text: 'Feasibility', why: 'A working drone is already evidence that it can be made; feasibility is the lens best supported here.' },
          { text: 'Viability', why: 'The forecast is only a paper case (the lecture calls such early numbers made up), but at least someone has looked at it; no one has asked customers anything.' },
          { text: 'Desirability', correct: true, why: 'Nobody knows whether people want it — the Segway path the lecture warns about. Test desirability first, cheaply, before launch.' },
        ],
      }}
    />
  );
}
