/*
SCENE: Pure economic loss caused by an act — Perre v Apand (and Caltex Oil beside it)
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → pick whose claim → flip the answers to McHugh J's five questions → watch the ring and the chain of
  gates → compare Caltex → one check
INTENT: Show that in Australia a duty for PEL caused by an act can be found by working through salient features —
  in Perre, McHugh J's five questions — and that WA's 20 km rule is what made the class determinate.
SUBJECT: the Perres' farm inside the 20 km ring; its outline turns sage while the chain holds and clay where it stops.
BEAT 1 (0–100%): a select picks the claimant (the Perres, Sparnon, a grower beyond 20 km); five toggles record the
  answers to McHugh J's questions in order; the first failing question stops the chain and the verdict names it
  within 200ms. Making liability indeterminate fades the ring (no boundary). Ease: colour and opacity only,
  --dur-micro --ease-out. No positional movement.
CAMERA: none (schematic SVG map, not to scale, + HTML list). LIGHT: none. SOUND: none.
REDUCED MOTION: identical minus the fades (durations are tokens, zero in off).
BUDGET: < 7 KB gz, no WebGL.
Source: concept card laws2400-w07-pel-caused-by-acts-perre-and-caltex; week spec §4 (Sparnon won below: physical
  damage, contract and consumer law; Apand knew of the disease and the risk); cases caltex-oil-v-dredge-willemstad,
  caltex-refineries-pty-ltd-v-stavar, sullivan-v-moody. The perre-v-apand-pty-ltd case card is verify: true and
  states only that foreseeability is necessary but not sufficient; every Perre fact here comes from the week-7
  concept card and spec. The answers to Q1 and Q3 are set to fit the outcome (a duty was owed) on McHugh J's
  sequence; the materials stress that each judge weighed the features differently, so a stop reads "leans".
A grower beyond 20 km is shown only as outside WA's ban (no export loss to claim) — no holding is stated for it.
*/
import { Simulation, type SimView } from '../bases/Simulation';

type Claimant = 'perre' | 'sparnon' | 'outside';

interface S extends Record<string, unknown> {
  claimant: Claimant;
  foreseeable: boolean;
  indeterminate: boolean;
  autonomy: boolean;
  vulnerable: boolean;
  knowledge: boolean;
}

/** McHugh J's sequence set to the outcome in Perre: a duty was owed to the Perres. */
const initial: S = { claimant: 'perre', foreseeable: true, indeterminate: false, autonomy: false, vulnerable: true, knowledge: true };

type Q = { k: string; n: number; q: string; pass: boolean; answer: string };

function questions(s: S): Q[] {
  return [
    { k: 'q1', n: 1, q: 'Was the loss to the Perres or their group reasonably foreseeable?', pass: s.foreseeable, answer: s.foreseeable ? 'Yes' : 'No' },
    { k: 'q2', n: 2, q: 'Would a duty impose indeterminate liability?', pass: !s.indeterminate, answer: s.indeterminate ? 'Yes: no boundary to the class' : 'No: the 20 km rule defined the class' },
    { k: 'q3', n: 3, q: 'Would it unreasonably burden Apand’s autonomy?', pass: !s.autonomy, answer: s.autonomy ? 'Yes' : 'No' },
    { k: 'q4', n: 4, q: 'Were the Perres vulnerable to loss from Apand’s conduct?', pass: s.vulnerable, answer: s.vulnerable ? 'Yes: no control over their neighbours’ seed' : 'No' },
    { k: 'q5', n: 5, q: 'Did Apand know its conduct could harm people such as the Perres?', pass: s.knowledge, answer: s.knowledge ? 'Yes: it knew of the disease and the risk' : 'No' },
  ];
}

const STOP: Record<string, string> = {
  q1: 'without reasonably foreseeable loss there is nothing further to weigh',
  q2: 'a duty would impose indeterminate liability',
  q3: 'a duty would unreasonably burden Apand’s autonomy',
  q4: 'the Perres were not vulnerable to loss from Apand’s conduct',
  q5: 'Apand did not know its conduct could harm people such as the Perres',
};

const T = 'stroke var(--dur-micro) var(--ease-out), opacity var(--dur-micro) var(--ease-out)';
const ui = { fontFamily: 'var(--font-ui)', fontSize: 11 } as const;

function MapFigure({ s, chain }: { s: S; chain: 'pass' | 'stop' | 'n/a' }) {
  const on = (c: Claimant) => s.claimant === c;
  const perreStroke = on('perre') ? (chain === 'pass' ? 'var(--sage)' : chain === 'stop' ? 'var(--clay)' : 'var(--ink)') : 'var(--ink-2)';
  const growers: [number, number][] = [[68, 94], [96, 174], [174, 72], [158, 186], [184, 170]];
  return (
    <svg viewBox="0 0 320 232" role="img" aria-label="Schematic map: Apand sells infected seed to Sparnon; WA bans potatoes grown within 20 km; the Perres farm 3 km away inside the ring; another grower lies beyond it">
      <circle cx="128" cy="118" r="86" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="5 5" style={{ opacity: s.indeterminate ? 0.2 : 1, transition: T }} />
      <text x="128" y="226" textAnchor="middle" {...ui} fill="var(--ink-2)">{s.indeterminate ? 'no boundary: the class is undefined' : '20 km: WA bans potatoes grown inside'}</text>
      {/* Apand and the seed sale */}
      <rect x="4" y="4" width="76" height="34" rx="5" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="42" y="19" textAnchor="middle" {...ui} fontSize="12" fill="var(--ink)">Apand</text>
      <text x="42" y="32" textAnchor="middle" {...ui} fontSize="10" fill="var(--ink-2)">infected seed</text>
      <path d="M62 38 L116 102" stroke="var(--ink)" strokeWidth="1.5" fill="none" />
      <path d="M107.8 98.5 L116 102 L113.9 93.3" stroke="var(--ink)" strokeWidth="1.5" fill="none" />
      {/* Other growers inside the ring: the ascertained class */}
      {growers.map(([x, y]) => <rect key={`${x}-${y}`} x={x - 4} y={y - 4} width="8" height="8" fill="none" stroke="var(--ink-3)" strokeWidth="1" style={{ opacity: s.indeterminate ? 0.3 : 1, transition: T }} />)}
      {/* Sparnon: the diseased farm at the centre */}
      <rect x="114" y="104" width="28" height="28" rx="3" fill="var(--paper)" stroke={on('sparnon') ? 'var(--ink)' : 'var(--ink-2)'} strokeWidth={on('sparnon') ? 2.5 : 1.5} style={{ transition: T }} />
      <path d="M118 128 L138 108 M118 118 L128 108 M128 128 L138 118" stroke="var(--ink-2)" strokeWidth="1" />
      <text x="108" y="116" textAnchor="end" {...ui} fill="var(--ink)">Sparnon</text>
      <text x="108" y="129" textAnchor="end" {...ui} fontSize="10" fill="var(--ink-2)">wilt</text>
      {/* The Perres: 3 km away, no disease */}
      <rect x="156" y="110" width="20" height="20" rx="3" fill="var(--paper)" stroke={perreStroke} strokeWidth={on('perre') ? 2.5 : 1.5} style={{ transition: T }} />
      <text x="166" y="146" textAnchor="middle" {...ui} fill="var(--ink)">Perres · 3 km</text>
      {/* A grower beyond the ring */}
      <rect x="252" y="40" width="20" height="20" rx="3" fill="var(--paper)" stroke={on('outside') ? 'var(--ink)' : 'var(--ink-3)'} strokeWidth={on('outside') ? 2.5 : 1.5} style={{ transition: T }} />
      <text x="262" y="76" textAnchor="middle" {...ui} fill="var(--ink-2)">beyond 20 km</text>
    </svg>
  );
}

function view(s: S): SimView {
  const qs = questions(s);
  const stopAt = qs.findIndex((q) => !q.pass);
  const perre = s.claimant === 'perre';
  const chain: 'pass' | 'stop' | 'n/a' = !perre ? 'n/a' : stopAt === -1 ? 'pass' : 'stop';
  const figure = (
    <div className="xgates" role="group" aria-label="Map of the 20 km ring and McHugh J's five questions in order">
      <MapFigure s={s} chain={chain} />
      <p className="label" style={{ margin: 'var(--s-3) 0 var(--s-2)' }}>McHugh J’s questions, in order</p>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--s-2)' }}>
        {qs.map((q, i) => {
          const state = !perre ? 'idle' : stopAt === -1 || i < stopAt ? 'pass' : i === stopAt ? 'stop' : 'idle';
          return (
            <li key={q.k} data-gate={q.k} data-state={state} style={{ display: 'grid', gridTemplateColumns: '1.25rem 1fr', gap: 'var(--s-2)', fontSize: 'var(--t-sm)', lineHeight: 1.35, color: state === 'idle' ? 'var(--ink-3)' : 'var(--ink)', transition: 'color var(--dur-micro) var(--ease-out)' }}>
              <span aria-hidden="true" style={{ color: state === 'pass' ? 'var(--sage)' : state === 'stop' ? 'var(--clay)' : 'var(--ink-3)', transition: 'color var(--dur-micro) var(--ease-out)' }}>
                {state === 'pass' ? '●' : state === 'stop' ? '✕' : '○'}
              </span>
              <span>
                <span style={{ display: 'block' }}>{q.n} · {q.q}</span>
                {perre && <span style={{ display: 'block', fontSize: 'var(--t-xs)', color: state === 'idle' ? 'var(--ink-3)' : 'var(--ink-2)' }}>{q.answer}</span>}
              </span>
            </li>
          );
        })}
      </ol>
      {!perre && <p style={{ margin: 'var(--s-2) 0 0', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>{s.claimant === 'sparnon' ? 'Not the pure-economic-loss question: Sparnon’s potatoes were diseased.' : 'No question to ask: WA’s ban does not reach this grower.'}</p>}
      <div style={{ marginTop: 'var(--s-4)', padding: 'var(--s-3)', background: 'var(--paper-2)', borderRadius: 'var(--r-md)' }}>
        <p className="label" style={{ margin: '0 0 var(--s-1)' }}>Compare · Caltex Oil v Dredge ‘Willemstad’ (1976)</p>
        <p style={{ margin: 0, fontSize: 'var(--t-sm)', lineHeight: 1.4, color: 'var(--ink)' }}>A dredge negligently damaged an oil pipeline. Caltex claimed only the cost of trucking oil around the bay, not the minor property damage — and was owed a duty, before the salient features approach was settled.</p>
      </div>
    </div>
  );

  let verdict: string;
  let tone: SimView['tone'];
  if (s.claimant === 'sparnon') {
    verdict = 'Sparnon’s claim was the clearer one: its potatoes were diseased (physical damage), and it could also sue in contract and consumer law. It won in the lower courts.';
    tone = 'open';
  } else if (s.claimant === 'outside') {
    verdict = 'Beyond 20 km, WA’s ban does not reach the grower, so there is no export loss to claim. The ring is what makes the Perres’ class determinate.';
    tone = 'open';
  } else if (stopAt === -1) {
    verdict = 'A duty was owed to the Perres (High Court, 1999): loss foreseeable, a class defined by the 20 km rule, no unreasonable burden on autonomy, vulnerable, and Apand knew the risk.';
    tone = 'yes';
  } else {
    verdict = `McHugh J’s sequence stops at question ${stopAt + 1}: ${STOP[qs[stopAt].k]}. Leans to no duty.`;
    tone = 'no';
  }
  return { figure, verdict, tone };
}

function describe(a: S, b: S) {
  if (a.claimant !== b.claimant) {
    if (b.claimant === 'perre') return 'The Perres: no disease, no physical damage and no contract with Apand — pure economic loss. They lost below.';
    if (b.claimant === 'sparnon') return 'Sparnon bought the infected seed: physical damage to its crop, plus contract and consumer law claims.';
    return 'A grower beyond 20 km: outside WA’s ban, so it can still export.';
  }
  if (a.foreseeable !== b.foreseeable) return b.foreseeable ? 'Q1: loss to the Perres or their group was reasonably foreseeable — necessary, but not enough.' : 'Q1 fails: no reasonably foreseeable loss, so the inquiry ends.';
  if (a.indeterminate !== b.indeterminate) return b.indeterminate ? 'Q2: with no boundary to the class, liability would be indeterminate — the ring fades.' : 'Q2: the 20 km rule defines the class, so liability is not indeterminate.';
  if (a.autonomy !== b.autonomy) return b.autonomy ? 'Q3: a duty that would unreasonably burden Apand’s autonomy stops the sequence.' : 'Q3: no unreasonable burden on Apand’s autonomy.';
  if (a.vulnerable !== b.vulnerable) return b.vulnerable ? 'Q4: vulnerable — the Perres had no control over who in the radius grew which seed.' : 'Q4 fails: if the Perres could protect themselves, they are not vulnerable.';
  if (a.knowledge !== b.knowledge) return b.knowledge ? 'Q5: Apand, in the potato industry, knew of the disease and the risk.' : 'Q5 fails: Apand did not know its conduct could harm people such as the Perres.';
  return '';
}

export default function PelCausedByActsPerreAndCaltex() {
  return (
    <Simulation<S>
      label="Perre v Apand: the 20 km ring and McHugh J's five questions"
      terms={[
        { term: 'Pure economic loss', def: 'Economic loss that does not result from physical injury to the person or property.' },
        { term: 'Indeterminate liability', def: 'Liability with no boundaries — to a class that cannot be defined.' },
        { term: 'Ascertained class', def: 'A defined group the conduct could affect: here, growers within WA’s 20 km limit.' },
        { term: 'Vulnerability', def: 'Inability to protect yourself from the defendant’s conduct: the Perres had no control over their neighbours’ seed.' },
      ]}
      initial={initial}
      controls={[
        { key: 'claimant', label: 'Whose claim', type: 'select', options: [{ value: 'perre', label: 'The Perres (3 km away, no disease)' }, { value: 'sparnon', label: 'Sparnon (bought the infected seed)' }, { value: 'outside', label: 'A grower beyond 20 km' }] },
        { key: 'foreseeable', label: 'Q1 · Loss to the Perres or their group was reasonably foreseeable', type: 'toggle' },
        { key: 'indeterminate', label: 'Q2 · A duty would impose indeterminate liability', type: 'toggle' },
        { key: 'autonomy', label: 'Q3 · A duty would unreasonably burden Apand’s autonomy', type: 'toggle' },
        { key: 'vulnerable', label: 'Q4 · The Perres were vulnerable to loss from Apand’s conduct', type: 'toggle' },
        { key: 'knowledge', label: 'Q5 · Apand knew its conduct could harm people such as the Perres', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'In Perre v Apand, why would a duty to the Perres not impose indeterminate liability?',
        options: [
          { text: 'WA’s 20 km rule defined the class of growers who could suffer the loss', correct: true, why: 'The regulation fixed who could be affected, so the class was defined — a large class is not the problem; an undefinable one is.' },
          { text: 'The Perres had a contract with Apand', why: 'Tempting, since a contract would fix the parties, but the Perres had no contract with Apand — Sparnon was the buyer.' },
          { text: 'The Perres’ own potatoes were infected with bacterial wilt', why: 'Tempting, since disease would be physical damage, but the Perres had none; that is why their loss was pure.' },
        ],
      }}
    />
  );
}
