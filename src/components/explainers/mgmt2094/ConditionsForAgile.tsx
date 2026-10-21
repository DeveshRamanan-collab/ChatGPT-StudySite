/*
SCENE: Where agile does or does not work — five dials and a lamp
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → set each of the five conditions → watch the dials and the lamp → one check
INTENT: Show that whether agile fits is read off five conditions from the reading's exhibit, and name the rows that
  argue against it, rather than treating agile as a panacea.
SUBJECT: the marker on each dial (favourable ← → unfavourable) and the lamp below them.
BEAT 1 (0–100%): five selects, each offering the exhibit's favourable and unfavourable wording; the marker slides
  (transform only, 240ms ease-in-out, full motion only) and the lamp and verdict update within 200ms.
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: calm/off — markers jump to their final positions; verdict identical.
BUDGET: < 5 KB gz, no WebGL.
Source: concept mgmt2094-w10-conditions-for-agile; Embracing Agile exhibit 'The Right Conditions for Agile' (Bain &
  Company) and p 44; example card mgmt2094-example-openview-and-intronis. The reading gives no threshold, so a mixed
  setting is reported as mixed (weigh the payoff against the effort), not scored.
*/
import { Simulation, type SimView } from '../bases/Simulation';
import { useExplainer } from '../context';

type Side = 'fav' | 'unfav';
interface S extends Record<string, unknown> {
  market: Side;
  customers: Side;
  innovation: Side;
  modularity: Side;
  mistakes: Side;
}

const ROWS: { key: keyof S & string; name: string; fav: string; unfav: string }[] = [
  { key: 'market', name: 'Market environment', fav: 'Customer preferences and solution options change frequently', unfav: 'Market conditions are stable and predictable' },
  { key: 'customers', name: 'Customer involvement', fav: 'Close collaboration and rapid feedback are feasible', unfav: 'Requirements are clear at the outset; customers are unavailable' },
  { key: 'innovation', name: 'Innovation type', fav: 'Problems are complex, solutions unknown, scope unclear', unfav: 'Similar work has been done before; plans can be forecast with confidence' },
  { key: 'modularity', name: 'Modularity of work', fav: 'Work breaks into parts customers can use; late changes are manageable', unfav: 'Nothing can be tested until everything is complete; late changes are costly' },
  { key: 'mistakes', name: 'Impact of interim mistakes', fav: 'They provide valuable learning', unfav: 'They may be catastrophic' },
];

const initial: S = { market: 'fav', customers: 'fav', innovation: 'fav', modularity: 'fav', mistakes: 'unfav' };

function Dial({ name, side }: { name: string; side: Side }) {
  const { motion } = useExplainer();
  const tr = motion === 'full' ? 'transform 240ms var(--ease-inout)' : 'none';
  return (
    <div data-row={name} style={{ display: 'grid', gap: 'var(--s-1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--s-3)', fontSize: 'var(--t-sm)' }}>
        <span style={{ color: 'var(--ink)' }}>{name}</span>
        <span style={{ color: side === 'fav' ? 'var(--sage)' : 'var(--clay)', fontWeight: 600 }}>{side === 'fav' ? 'favourable' : 'unfavourable'}</span>
      </div>
      <div style={{ position: 'relative', height: '18px' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: '7px', height: '4px', borderRadius: 'var(--r-pill)', background: 'var(--paper-3)' }} />
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${side === 'fav' ? 8 : 92}%)`, transition: tr }}>
          <span style={{ position: 'absolute', left: '-8px', top: '1px', width: '16px', height: '16px', borderRadius: 'var(--r-pill)', background: 'var(--ink)' }} />
        </div>
      </div>
    </div>
  );
}

function view(s: S): SimView {
  const against = ROWS.filter((r) => s[r.key] === 'unfav');
  const n = against.length;
  const lamp = n === 0 ? 'var(--sage)' : n === ROWS.length ? 'var(--clay)' : 'var(--paper-3)';
  const figure = (
    <div role="group" aria-label="Five conditions, each set between favourable and unfavourable for agile, with a lamp" style={{ display: 'grid', gap: 'var(--s-4)', fontFamily: 'var(--font-ui)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>
        <span>favourable to agile</span><span>unfavourable</span>
      </div>
      {ROWS.map((r) => <Dial key={r.key} name={r.name} side={s[r.key] as Side} />)}
      <p style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', margin: 0, fontWeight: 600 }}>
        <span aria-hidden="true" style={{ width: '16px', height: '16px', borderRadius: 'var(--r-pill)', background: lamp, border: '1.5px solid var(--ink-3)', transition: 'background-color 180ms var(--ease-out)' }} />
        {n === 0 ? 'Agile fits' : n === ROWS.length ? 'Agile does not fit' : `${n} of 5 rows argue against agile`}
      </p>
    </div>
  );
  if (n === 0)
    return { figure, verdict: 'All five conditions favour agile, as in software innovation: a small self-managed team working in short cycles should pay off.', tone: 'yes' };
  if (n === ROWS.length)
    return { figure, verdict: 'Every row is unfavourable — routine, predictable work like plant maintenance or accounting. Specifications and work plans can be forecast and should be followed.', tone: 'no' };
  return {
    figure,
    verdict: `Mixed: ${against.map((r) => r.name.toLowerCase()).join(', ')} ${n === 1 ? 'argues' : 'argue'} against agile. Agile is not a panacea; weigh the payoff against the training and behavioural change it needs.`,
    tone: 'open',
  };
}

function describe(a: S, b: S) {
  const r = ROWS.find((x) => a[x.key] !== b[x.key]);
  if (!r) return '';
  return b[r.key] === 'fav' ? `${r.name}: ${r.fav.toLowerCase()} — favourable to agile.` : `${r.name}: ${r.unfav.toLowerCase()} — unfavourable to agile.`;
}

export default function ConditionsForAgile() {
  return (
    <Simulation<S>
      label="The right conditions for agile: five dials and a lamp"
      terms={[
        { term: 'Panacea', def: 'A cure for everything — which the reading says agile is not.' },
        { term: 'Modularity', def: 'Whether work can be broken into parts customers can use as each is finished.' },
        { term: 'Interim mistake', def: 'An error made part-way through: a lesson under agile, or a catastrophe.' },
        { term: 'Routine operations', def: 'Plant maintenance, purchasing, sales calls, accounting: where agile conditions are rarer.' },
      ]}
      initial={initial}
      controls={ROWS.map((r) => ({
        key: r.key,
        label: r.name,
        type: 'select' as const,
        options: [
          { value: 'fav', label: r.fav },
          { value: 'unfav', label: r.unfav },
        ],
      }))}
      view={view}
      describe={describe}
      check={{
        question: 'Which of these is a FAVOURABLE condition for agile, according to the reading’s exhibit?',
        options: [
          { text: 'Requirements are clear at the outset and will remain stable', why: 'Clear, stable requirements are the unfavourable side of customer involvement: a fixed plan suits them.' },
          { text: 'Interim mistakes provide valuable learning', correct: true, why: 'The exhibit sets “they provide valuable learning” (favourable) against “they may be catastrophic” (unfavourable).' },
          { text: 'Late changes are expensive or impossible', why: 'Costly late changes are the unfavourable side of modularity of work.' },
        ],
      }}
    />
  );
}
