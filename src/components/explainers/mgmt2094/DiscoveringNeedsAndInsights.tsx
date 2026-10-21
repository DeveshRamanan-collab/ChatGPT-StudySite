/*
SCENE: Discover and distil — building a customer narrative (customer + need + insight) for the Nepal infant-warmer brief
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → rewrite the narrative → watch the three slots → one check
INTENT: A customer narrative is ready to ideate from only when the customer is descriptive, the need is written as a
  verb (a noun is usually a solution in disguise) and the insight reaches the root cause, not just the reason.
SUBJECT: the three slots of the narrative; the first weak slot is marked, and the sentence below reassembles live.
BEAT 1 (0–100%): selects for each slot; the verdict names the weakest slot within 200ms. Ease: CSS 180ms ease-out on
  colour only (base styles).
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (no motion beyond colour); off mode shows the same controls.
BUDGET: < 6 KB gz, no WebGL.
Source: concept mgmt2094-w03-discovering-needs-and-insights and example mgmt2094-example-nepal-infant-warmer — both
  from the guest-lecture transcript only (verify: true on the concept); the slot wordings paraphrase the lecture's own
  good and weak versions of the Nepal narrative.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  customer: 'generic' | 'descriptive';
  need: 'noun' | 'verb';
  insight: 'none' | 'shallow' | 'root';
}

const initial: S = { customer: 'generic', need: 'noun', insight: 'none' };

/** The narrative as written, with agreement for a single customer or a group. */
function narrative(s: S) {
  const one = s.customer === 'descriptive';
  const who = one ? 'A desperate Nepali mother' : 'Parents in Nepal';
  const need = s.need === 'noun'
    ? `${one ? 'needs' : 'need'} a low-cost incubator`
    : one ? 'needs to keep her premature baby warm' : 'need to keep their premature babies warm';
  const why = s.insight === 'root'
    ? one ? 'because she has no means to get the baby to hospital' : 'because they have no means to get their babies to hospital'
    : s.insight === 'shallow' ? (one ? 'so that it survives' : 'so that they survive') : '';
  return `${[who, need, why].filter(Boolean).join(' ')}.`;
}

type Slot = { id: 'customer' | 'need' | 'insight'; label: string; sub: string; state: 'pass' | 'stop' | 'skip' };

function slots(s: S): Slot[] {
  return [
    { id: 'customer', label: 'Customer', sub: s.customer === 'descriptive' ? 'descriptive: one person who stands for many' : 'generic: a group, not a person', state: s.customer === 'descriptive' ? 'pass' : 'stop' },
    { id: 'need', label: 'Need', sub: s.need === 'verb' ? 'a verb: what she must do' : 'a noun: a solution in disguise', state: s.need === 'verb' ? 'pass' : 'stop' },
    { id: 'insight', label: 'Insight', sub: s.insight === 'root' ? 'the root cause' : s.insight === 'shallow' ? 'only the reason behind the need' : 'missing', state: s.insight === 'root' ? 'pass' : s.insight === 'shallow' ? 'stop' : 'skip' },
  ];
}

function view(s: S): SimView {
  const ss = slots(s);
  let reached = true;
  const sentence = narrative(s);
  const figure = (
    <div className="xgates" role="group" aria-label="Customer narrative: customer, need, insight">
      <ol className="xgates__row">
        {ss.map((sl) => {
          const lit = reached;
          if (sl.state !== 'pass') reached = false;
          return (
            <li key={sl.id} className="xgate" data-gate={sl.id} data-state={sl.state} data-lit={lit ? 'true' : undefined}>
              <span className="xgate__box">
                <span className="xgate__label">{sl.label}</span>
                <span className="xgate__status">{sl.state === 'pass' ? 'ready' : sl.state === 'skip' ? 'empty' : 'rewrite'}</span>
              </span>
              <span className="xgate__sub">{sl.sub}</span>
            </li>
          );
        })}
      </ol>
      <div className="xgates__circ">
        <p className="xgates__circ-title">The narrative as written:</p>
        <p data-narrative>“{sentence}”</p>
      </div>
    </div>
  );
  let verdict: string;
  let tone: SimView['tone'];
  if (s.need === 'noun') {
    tone = 'no';
    verdict = 'The need is a noun — an incubator is a solution, and the lecture’s team found the incubators empty. Write the need as a verb.';
  } else if (s.insight === 'none') {
    tone = 'open';
    verdict = 'A need, but no insight yet: add why — then push past the obvious reason to the root cause.';
  } else if (s.insight === 'shallow') {
    tone = 'no';
    verdict = '“So that it survives” is only the reason behind the need; it doesn’t take you anywhere new. Find the root cause.';
  } else if (s.customer === 'generic') {
    tone = 'open';
    verdict = 'Root cause reached. Now make the customer descriptive: one person, who stands for many others.';
  } else {
    tone = 'yes';
    verdict = 'Ready to ideate from: a descriptive customer, a need as a verb, and an insight at the root cause — transport, not incubators.';
  }
  return { figure, verdict, tone };
}

function describe(a: S, b: S) {
  if (a.customer !== b.customer) return b.customer === 'descriptive' ? 'One descriptive person, standing for many: easier to design for.' : 'A generic group: harder to picture, harder to design for.';
  if (a.need !== b.need) return b.need === 'verb' ? 'Need as a verb: it states the problem and leaves the solution open.' : 'Need as a noun: the solution (an incubator) has crept into the narrative.';
  if (a.insight !== b.insight)
    return b.insight === 'root' ? 'Root cause: she cannot get the baby to hospital — a transport problem, not an incubator problem.'
      : b.insight === 'shallow' ? 'The obvious reason: true, but it points nowhere new.' : 'No insight: the narrative stops at the need.';
  return '';
}

export default function DiscoveringNeedsAndInsights() {
  return (
    <Simulation<S>
      label="Building a customer narrative: customer, need, insight"
      terms={[
        { term: 'Customer narrative', def: 'A descriptive customer + a need + an insight, distilled from customer research.' },
        { term: 'Need as a verb', def: 'What the customer must do; nouns are often solutions.' },
        { term: 'Insight', def: 'Deeper than the reason behind the need: the root cause.' },
        { term: 'Empathy map', def: 'What customers say and do, think and feel — from real research, not made up.' },
      ]}
      initial={initial}
      controls={[
        { key: 'customer', label: 'Customer', type: 'select', options: [{ value: 'generic', label: 'Parents in Nepal' }, { value: 'descriptive', label: 'A desperate Nepali mother' }] },
        { key: 'need', label: 'Need', type: 'select', options: [{ value: 'noun', label: '… needs a low-cost incubator' }, { value: 'verb', label: '… needs to keep her premature baby warm' }] },
        { key: 'insight', label: 'Insight', type: 'select', options: [{ value: 'none', label: '(none)' }, { value: 'shallow', label: '… so that it survives' }, { value: 'root', label: '… because she has no means to get the baby to hospital' }] },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Night-shift cleaners need to get home safely after work. Which insight would the guest lecture accept?',
        options: [
          { text: '… so that they are not stranded', why: 'That is only the reason behind the need — like “so that it survives”, it doesn’t take you anywhere new.' },
          { text: '… because a faster bus would fix it', why: 'A faster bus is a solution; the narrative should keep solutions out until the problem is clear.' },
          { text: '… because the last connecting bus leaves before their shift ends', correct: true, why: 'It names a root cause the team can design around, as the Nepal team found transport — not incubators — was the real problem.' },
        ],
      }}
    />
  );
}
