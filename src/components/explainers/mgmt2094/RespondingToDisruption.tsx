/*
SCENE: Responding to disruption — the value ladder and Gilbert + Tobin's options
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → move the disruptor up the ladder, pick a response → read what the reading says → one check
INTENT: Disruption moves up the market from lower-value, higher-volume work towards the incumbent's high-value core;
  of the responses the reading lists, G+T rejected launching its own version (incentives and culture) and chose a
  stake in a disruptor that is a law firm with quality control, not a marketplace.
SUBJECT: the disruptor marker on the three-rung ladder; the response panel beside it.
BEAT 1 (0–100%): three selects; the ladder rungs, the response panel and the verdict update within 200ms. Ease: CSS
  180ms --ease-out on colour only. Options the reading lists but does not evaluate say exactly that.
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (no motion beyond colour); off mode shows the same controls and view.
BUDGET: < 6 KB gz, no WebGL.
Source: concept mgmt2094-w12-responding-to-disruption; authorities mgmt2094-nickless-2017,
  mgmt2094-example-gilbert-tobin-legalvision (Nickless (2017), pp 28–29).
*/
import { Simulation, type SimView } from '../bases/Simulation';

type Stage = 'low' | 'rising' | 'core';
type Response = 'model' | 'niche' | 'platform' | 'outsource' | 'own' | 'partner';

interface S extends Record<string, unknown> {
  stage: Stage;
  response: Response;
  partner: 'law-firm' | 'marketplace';
}

const initial: S = { stage: 'low', response: 'own', partner: 'law-firm' };

const RUNGS: { id: Stage; title: string; note: string }[] = [
  { id: 'core', title: 'Higher-value, bespoke work', note: 'a major acquisition or divestment, a dispute, a regulatory issue: where the bulk of G+T\'s business lay' },
  { id: 'rising', title: 'More complex work', note: '"Why don\'t you give us a go at something a bit more complex?"' },
  { id: 'low', title: 'Lower-value, higher-volume work', note: 'wills, loan documents, first-round document review, done faster and cheaper with automation' },
];
const LEVEL: Record<Stage, number> = { low: 0, rising: 1, core: 2 };

const RESPONSES: Record<Response, string> = {
  model: 'Change the business model',
  niche: 'Retreat into a specialist niche',
  platform: 'Develop online platforms to automate simple activities',
  outsource: 'Outsource (perhaps to lower-cost labour overseas)',
  own: 'Launch our own version',
  partner: 'Partner with a disruptor',
};

function judge(s: S): { tone: 'yes' | 'no' | 'open'; text: string } {
  if (s.response === 'partner')
    return s.partner === 'law-firm'
      ? { tone: 'yes', text: 'G+T\'s choice: a 20 per cent stake in LegalVision for about A$4 million, after mystery shoppers and a review by its top lawyers. It gives exposure to the high-growth market and the ability to learn from disruption.' }
      : { tone: 'no', text: 'G+T would not partner with marketplaces that referred clients out to independent practitioners: there was no quality control. LegalVision owns its customer experience end to end.' };
  if (s.response === 'own')
    return { tone: 'no', text: 'Considered and rejected: getting the incentives right to motivate people and create the right culture would be very hard alongside a traditional legal model.' };
  return { tone: 'open', text: 'Listed in the reading as a possible response; the reading does not evaluate it further.' };
}

function view(s: S): SimView {
  const at = LEVEL[s.stage];
  const j = judge(s);
  const figure = (
    <div role="group" aria-label="A three-rung value ladder with the disruptor's position, and the chosen response" style={{ fontFamily: 'var(--font-ui)', display: 'grid', gap: 'var(--s-4)', gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))' }}>
      <div>
        <p className="label" style={{ margin: '0 0 var(--s-2)' }}>The value ladder</p>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--s-2)' }}>
          {RUNGS.map((r) => {
            const lvl = LEVEL[r.id];
            const here = lvl === at;
            const reached = lvl <= at;
            return (
              <li key={r.id} data-rung={r.id} data-here={here ? 'true' : undefined} style={{ padding: 'var(--s-2) var(--s-3)', borderRadius: 'var(--r-sm)', background: 'var(--paper)', border: `1px ${reached ? 'solid' : 'dashed'} ${here ? 'var(--ink)' : 'var(--line)'}`, transition: 'border-color 180ms var(--ease-out)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--s-2)', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 'var(--t-sm)', fontWeight: 600, color: reached ? 'var(--ink)' : 'var(--ink-2)' }}>{r.title}</span>
                  <span style={{ fontSize: 'var(--t-xs)', color: 'var(--ink-2)', whiteSpace: 'nowrap' }}>{here ? '● disruptor here' : reached ? 'reached' : ''}</span>
                </div>
                <p style={{ margin: 'var(--s-1) 0 0', fontSize: 'var(--t-xs)', lineHeight: 1.4, color: 'var(--ink-2)' }}>{r.note}</p>
              </li>
            );
          })}
        </ol>
      </div>
      <div style={{ padding: 'var(--s-3) var(--s-4)', background: 'var(--paper)', borderRadius: 'var(--r-md)', borderLeft: `3px solid ${j.tone === 'yes' ? 'var(--sage)' : j.tone === 'no' ? 'var(--clay)' : 'var(--ink-3)'}`, transition: 'border-color 180ms var(--ease-out)', alignSelf: 'start' }} data-response={s.response}>
        <p className="label" style={{ margin: 0 }}>Response</p>
        <p style={{ margin: 'var(--s-2) 0', fontWeight: 600, fontSize: 'var(--t-body)', color: 'var(--ink)' }}>{RESPONSES[s.response]}</p>
        <p style={{ margin: 0, fontSize: 'var(--t-sm)', lineHeight: 1.45, color: 'var(--ink-2)' }}>{j.text}</p>
      </div>
    </div>
  );
  const threat = at === 0
    ? 'The disruptor is on lower-value work, outside G+T\'s focus, but disruption tends to move up the market.'
    : at === 1
      ? 'Competent at the lower-value work, the disruptor now asks for something more complex.'
      : 'Disruption has reached the higher-value work where the bulk of the business lies.';
  return { figure, verdict: `${threat} ${j.tone === 'yes' ? 'This is the response G+T chose.' : j.tone === 'no' ? 'The reading gives a reason against this.' : 'The reading lists this option without weighing it.'}`, tone: j.tone };
}

function describe(a: S, b: S) {
  if (a.stage !== b.stage) return LEVEL[b.stage] > LEVEL[a.stage] ? 'The disruptor moves up the market: simple document review could turn into running the A$5 million bolt-on acquisition.' : 'Back down the ladder: the lower-value work is where disruptors start.';
  if (a.response !== b.response) return `Response: ${RESPONSES[b.response].toLowerCase()}. ${b.response === 'partner' ? 'Now check what kind of partner it is.' : b.response === 'own' ? 'G+T went through the process of deciding on this before rejecting it.' : 'One of the options in the reading.'}`;
  if (a.partner !== b.partner) return b.partner === 'law-firm' ? 'A law firm that owns its customer experience end to end: quality can be checked.' : 'A marketplace that refers clients out: no quality control.';
  return '';
}

export default function RespondingToDisruption() {
  return (
    <Simulation<S>
      label="Gilbert + Tobin's response to disruption moving up the legal market"
      terms={[
        { term: 'NewLaw disruptor', def: 'A new player, such as LegalVision, doing lower-value, high-volume legal work faster and cheaper.' },
        { term: 'Moving up the market', def: 'Disruption starts on lower-value work, then moves towards the higher-value work at the incumbent\'s core.' },
        { term: 'Partnering with a disruptor', def: 'Taking a stake in a disruptor rather than competing alone: G+T\'s 20 per cent stake in LegalVision.' },
      ]}
      initial={initial}
      controls={[
        { key: 'stage', label: 'Where the disruptor is now', type: 'select', options: [
          { value: 'low', label: 'Lower-value, higher-volume work' },
          { value: 'rising', label: 'Asking for more complex work' },
          { value: 'core', label: 'Higher-value, bespoke work' },
        ] },
        { key: 'response', label: 'Response', type: 'select', options: (Object.keys(RESPONSES) as Response[]).map((k) => ({ value: k, label: RESPONSES[k] })) },
        { key: 'partner', label: 'If partnering, the partner is', type: 'select', options: [
          { value: 'law-firm', label: 'A law firm owning its customer experience' },
          { value: 'marketplace', label: 'A marketplace that refers clients out' },
        ] },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Why did G+T decide against launching its own low-cost version?',
        options: [
          { text: 'The low-cost market was shrinking', why: 'The reading says LegalVision was growing at around 5 or 6 per cent a month, so the market was not shrinking.' },
          { text: 'Incentives and culture would be very hard to get right beside a traditional legal model', correct: true, why: 'Nickless says getting the incentives right to motivate people and create the right culture would be very hard alongside the traditional model.' },
          { text: 'Law firms would never be disrupted', why: 'G+T acted because it expected disruption to move up the market; Nickless says disruption of law is only just starting.' },
        ],
      }}
    />
  );
}
