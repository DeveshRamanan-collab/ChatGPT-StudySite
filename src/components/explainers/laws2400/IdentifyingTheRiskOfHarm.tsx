/*
SCENE: Benic step 1 — identifying the risk of harm, tested on the Dederer bridge
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → choose how the risk is framed → see whether it lines up with the precautions in issue → open Benic step 2
  (the three s 5B(1) gates) → one check
INTENT: Show that the breach question starts by naming the risk of harm as a class of injury tied to its true source —
  not the particular injury, and not so broad that it covers scenarios needing different responses — because
  s 5B(1) is about "precautions against a risk of harm".
SUBJECT: the "risk as framed" card and its match line to the precautions in issue.
BEAT 1 (0–60%): the framing select swaps the card text (opacity only, 180ms ease-out) and sets the match status.
BEAT 2 (60–100%): the step 2 toggle lights the three gates with what the High Court found in Dederer (border colour only,
  180ms ease-out, shared .xgate styles); locked (dashed) until the framing is right.
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical end states (colour and text only).
BUDGET: < 4 KB gz, no WebGL.
Source: concept laws2400-w09-identifying-the-risk-of-harm; Topic 9 Lecture 1 slides 11–13 (Benic v NSW, Garling J: a
  class of injury; Dederer: Court of Appeal framing, Gummow J [60], held 3:2, the rule on specificity); Lecture 2 slides
  5–8 (the plaintiff's suggested precautions: signs warning of shifting sands; vertical railings).
*/
import { Simulation, type SimView } from '../bases/Simulation';

type Framing = 'broad' | 'class' | 'narrow';

interface S extends Record<string, unknown> {
  framing: Framing;
  step2: boolean;
}

const initial: S = { framing: 'broad', step2: false };

const CARD: Record<Framing, { text: string; who: string; match: string; ok: boolean }> = {
  broad: {
    text: '“Serious spinal injury flowing from the act of diving off the bridge”',
    who: 'The Court of Appeal’s framing',
    match: 'Does not line up: it obscures the true source of injury (Gummow J [60]), so it no longer points to any particular precaution.',
    ok: false,
  },
  class: {
    text: 'Injury from impact on jumping into potentially shallow water over the shifting sands of the estuary',
    who: 'Gummow J’s framing — a class of injury with its source',
    match: 'Lines up: shallow water over shifting sands is exactly what the signs and railings in issue were said to address.',
    ok: true,
  },
  narrow: {
    text: 'Dederer’s partial paraplegia from his particular dive',
    who: 'The particular injury suffered',
    match: 'Narrower than needed: Benic says a class of injury, as distinct from the particular injury, is sufficient.',
    ok: false,
  },
};

function view(s: S): SimView {
  const c = CARD[s.framing];
  const open = c.ok && s.step2;
  const gates = [
    { id: 'a', label: 's 5B(1)(a)', status: 'foreseeable', sub: 'the High Court accepted the risk was foreseeable' },
    { id: 'b', label: 's 5B(1)(b)', status: 'probability low', sub: 'addressed separately: no one hurt in years of jumping' },
    { id: 'c', label: 's 5B(1)(c)', status: 'signs enough', sub: 'existing “no diving” signs a reasonable response' },
  ];
  const figure = (
    <div role="group" aria-label="The risk as framed, the precautions in issue, and Benic step 2">
      <div style={{ display: 'grid', gap: 'var(--s-3)', gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))', marginBottom: 'var(--s-5)' }}>
        <div data-card="risk" style={{ border: '1.5px solid var(--ink-3)', borderRadius: 'var(--r-md)', padding: 'var(--s-3) var(--s-4)', background: 'var(--paper)' }}>
          <p className="label" style={{ margin: 0, color: 'var(--ink-2)' }}>Step 1 · the risk as framed</p>
          <p key={s.framing} style={{ margin: 'var(--s-2) 0 0', fontSize: 'var(--t-sm)', color: 'var(--ink)' }}>{c.text}</p>
          <p style={{ margin: 'var(--s-2) 0 0', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>{c.who}</p>
        </div>
        <div data-card="precautions" style={{ border: `1.5px ${c.ok ? 'solid' : 'dashed'} ${c.ok ? 'var(--sage)' : 'var(--ink-3)'}`, borderRadius: 'var(--r-md)', padding: 'var(--s-3) var(--s-4)', background: 'var(--paper)', transition: 'border-color var(--dur-micro) var(--ease-out)' }}>
          <p className="label" style={{ margin: 0, color: 'var(--ink-2)' }}>The precautions in issue</p>
          <p style={{ margin: 'var(--s-2) 0 0', fontSize: 'var(--t-sm)', color: 'var(--ink)' }}>Signs warning of the shifting sands; vertical railings (the plaintiff) — or the existing “no diving” signs (the RTA)</p>
          <p data-match style={{ margin: 'var(--s-2) 0 0', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>{c.match}</p>
        </div>
      </div>
      <div className="xgates">
        <p className="xgates__circ-title">Step 2 · the three elements, each separately addressed</p>
        <ol className="xgates__row">
          {gates.map((g) => (
            <li key={g.id} className="xgate" data-gate={g.id} data-state={open ? 'pass' : 'skip'} data-lit={open ? 'true' : undefined}>
              <span className="xgate__box">
                <span className="xgate__label mono">{g.label}</span>
                <span className="xgate__status">{open ? g.status : c.ok ? 'not yet' : 'locked'}</span>
              </span>
              <span className="xgate__sub">{open ? g.sub : 'needs a risk to test'}</span>
            </li>
          ))}
        </ol>
        <p className="xgates__end" data-state={open ? 'pass' : 'stop'}>{open ? 'Held 3:2: no breach' : 'step 2 waits for step 1'}</p>
      </div>
    </div>
  );
  let verdict: string;
  let tone: SimView['tone'];
  if (!c.ok) {
    verdict = s.framing === 'broad'
      ? 'Too broad. You cannot frame the risk so broadly that it covers fundamentally different scenarios needing fundamentally different responses. Step 2 cannot usefully start.'
      : 'Too narrow. The particular injury is more than Benic asks for: describe a class of injury, tied to its source, so that it matches the precautions.';
    tone = 'no';
  } else if (!s.step2) {
    verdict = 'Step 1 done: a class of injury tied to its true source, specific enough to match the precautions in issue. Now open step 2.';
    tone = 'open';
  } else {
    verdict = 'Step 2 on the right risk: foreseeable, but the probability was low, and the existing signs were a reasonable response. The obligation was to take reasonable care, not to prevent harm — no breach (3:2).';
    tone = 'no';
  }
  return { figure, verdict, tone };
}

function describe(a: S, b: S) {
  if (a.framing !== b.framing)
    return b.framing === 'class'
      ? 'Gummow J’s framing: the source of injury is the shallow water and shifting sands — the thing the precautions are about.'
      : b.framing === 'broad'
        ? 'The Court of Appeal’s framing: diving off the bridge as such. It hides where the danger actually came from.'
        : 'The particular injury: precise, but Benic says a class of injury is enough — and the class is what links to precautions.';
  if (a.step2 !== b.step2)
    return b.step2 ? 'Step 2: now each of (a), (b) and (c) can be addressed separately against the identified risk.' : 'Back to step 1 only.';
  return '';
}

export default function IdentifyingTheRiskOfHarm() {
  return (
    <Simulation<S>
      label="Benic step 1 on the Dederer facts: frame the risk of harm, then apply step 2"
      terms={[
        { term: 'Risk of harm', def: 'What s 5B(1) asks precautions to be taken against — so it must be named first (Benic step 1).' },
        { term: 'Class of injury', def: 'Enough for step 1: a kind of injury with its source, not the particular injury suffered.' },
        { term: 'Too broad', def: 'A framing that covers fundamentally different scenarios needing fundamentally different responses.' },
      ]}
      initial={initial}
      controls={[
        {
          key: 'framing', label: 'Frame the risk of harm as…', type: 'select', options: [
            { value: 'broad', label: 'Spinal injury from diving off the bridge' },
            { value: 'class', label: 'Impact in shallow water over shifting sands' },
            { value: 'narrow', label: 'Dederer’s particular injury' },
          ],
        },
        { key: 'step2', label: 'Apply Benic step 2: the three s 5B(1) elements', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'A guest is burnt by a faulty hotel kettle. Which is the best Benic step 1 description of the risk of harm?',
        options: [
          { text: 'Burns from a faulty electrical appliance supplied in the room', correct: true, why: 'A class of injury tied to its source, matching the precaution in issue — checking or replacing appliances.' },
          { text: 'A second-degree burn to the guest’s left hand', why: 'Tempting because it is precise, but it is the particular injury; Benic says a class of injury is sufficient.' },
          { text: 'Any injury to any guest anywhere in the hotel', why: 'Tempting because it is surely foreseeable, but it covers scenarios needing quite different precautions — too broad.' },
        ],
      }}
    />
  );
}
