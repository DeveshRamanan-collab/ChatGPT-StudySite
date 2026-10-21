/*
SCENE: Landlords, occupiers and trespassers — duty, content, discharge
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → pick the defendant and the entrant → toggle the defect and the landlord's reasonable steps → watch the
  three rows (duty / what it requires / discharged?) and the verdict → one check
INTENT: Show that a landlord's duty now exists (Cavalier v Pope rejected) and the argument is about its content and
  reasonable steps (Jones v Bartlett); that an occupier's duty depends on relationship, purpose and premises; and
  that a trespasser enters at their own risk (Cardy), with the position unresolved.
SUBJECT: the third row — "discharged?" — which turns on the landlord's two reasonable steps.
BEAT 1 (0–100%): two selects and three toggles; the rows mark met / not met / open within 200ms. Colour only
  (--dur-micro --ease-out).
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (colour only).
BUDGET: < 6 KB gz, no WebGL.
Source: concept card laws2400-w08-landlords-occupiers-and-trespassers; cases cavalier-v-pope,
  northern-sandblasting-pty-ltd-v-harris, jones-v-bartlett, commissioner-for-railways-v-cardy (Topic 8 Lecture 2
  slides 3–9). The materials give no landlord-to-trespasser rule, so that pairing says so rather than inventing one.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  role: 'landlord' | 'occupier';
  entrant: 'tenant' | 'lawful' | 'trespasser';
  dangerous: boolean;
  ascertained: boolean;
  fixed: boolean;
}

/** Jones v Bartlett: the tenant's son and a glass door not held to be a dangerous defect. */
const initial: S = { role: 'landlord', entrant: 'tenant', dangerous: false, ascertained: false, fixed: false };

type Mark = 'met' | 'fail' | 'open';
interface Row { title: string; mark: Mark; text: string }

function rows(s: S): Row[] {
  if (s.role === 'landlord') {
    if (s.entrant === 'trespasser') {
      return [
        { title: 'Duty?', mark: 'open', text: 'The materials state the trespasser rule for occupiers (Cardy), not for landlords — switch the defendant to the occupier.' },
        { title: 'What it requires', mark: 'open', text: 'Not addressed in this week’s materials.' },
        { title: 'Discharged?', mark: 'open', text: 'Not addressed in this week’s materials.' },
      ];
    }
    const other = s.entrant === 'lawful';
    const discharged: Row = !s.dangerous
      ? { title: 'Discharged?', mark: 'met', text: 'No dangerous defect — like the glass door in Jones v Bartlett, so no breach.' }
      : s.ascertained && s.fixed
        ? { title: 'Discharged?', mark: 'met', text: 'Yes: reasonable steps to ascertain the defect and to remove it or make the premises safe.' }
        : { title: 'Discharged?', mark: 'fail', text: `Not yet: missing reasonable steps to ${!s.ascertained ? 'ascertain defects' : 'remove the defect or make the premises safe'}.` };
    return [
      { title: 'Duty?', mark: 'met', text: other ? 'Yes, to other entrants too — but narrower than an occupier’s duty (Gummow and Hayne JJ).' : 'Yes — the old no-duty rule (Cavalier v Pope) was rejected in Northern Sandblasting.' },
      { title: 'What it requires', mark: 'met', text: 'Premises reasonably fit for habitation as a domestic residence; do not let premises with defects you know or ought to know make them unsafe.' },
      discharged,
    ];
  }
  if (s.entrant === 'tenant') {
    return [
      { title: 'Duty?', mark: 'open', text: 'The tenant is usually the occupier — the one in control. Pick a visitor, or switch the defendant to the landlord.' },
      { title: 'What it requires', mark: 'open', text: 'An occupier is whoever controls the relevant land.' },
      { title: 'Discharged?', mark: 'open', text: 'The reasonable-steps toggles describe the landlord’s duty (Jones v Bartlett).' },
    ];
  }
  if (s.entrant === 'lawful') {
    return [
      { title: 'Duty?', mark: 'met', text: 'Yes — occupiers owe a duty to people who enter lawfully.' },
      { title: 'What it requires', mark: 'met', text: 'Its extent depends on the relationship, the purpose of entry and the type of premises (a supermarket, a hotel, a reserve as in Romeo).' },
      { title: 'Discharged?', mark: 'open', text: 'Measured on the facts; the reasonable-steps toggles are the landlord’s Jones v Bartlett duty.' },
    ];
  }
  return [
    { title: 'Duty?', mark: 'fail', text: '“A person trespasses at their own risk” — the occupier’s only duty is to refrain from intentional or wanton harm (Cardy).' },
    { title: 'What it requires', mark: 'open', text: 'Unresolved at common law, but the trend places more responsibility on the trespasser.' },
    { title: 'Discharged?', mark: 'open', text: 'Only intentional or wanton harm is in play under Cardy.' },
  ];
}

function view(s: S): SimView {
  const r = rows(s);
  const figure = (
    <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--s-3)' }} aria-label="Duty, what it requires, and whether it was discharged">
      {r.map((row) => {
        const c = row.mark === 'met' ? 'var(--sage)' : row.mark === 'fail' ? 'var(--clay)' : 'var(--ink-2)';
        return (
          <li key={row.title} data-state={row.mark} style={{ display: 'grid', gridTemplateColumns: '1.25rem 1fr', gap: 'var(--s-2)', fontSize: 'var(--t-sm)', lineHeight: 1.35 }}>
            <span aria-hidden="true" style={{ color: c, transition: 'color var(--dur-micro) var(--ease-out)' }}>{row.mark === 'met' ? '●' : row.mark === 'fail' ? '✕' : '?'}</span>
            <span>
              <span style={{ display: 'block', fontWeight: 600, color: 'var(--ink)' }}>{row.title}<span className="visually-hidden">: {row.mark === 'met' ? 'yes' : row.mark === 'fail' ? 'no' : 'open'}</span></span>
              <span style={{ display: 'block', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>{row.text}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
  let verdict: string;
  let tone: SimView['tone'];
  if (s.role === 'landlord' && s.entrant !== 'trespasser') {
    const ok = r[2].mark === 'met';
    verdict = ok
      ? `Duty owed${s.entrant === 'lawful' ? ' (narrower, to another entrant)' : ''}, but no breach: ${s.dangerous ? 'reasonable steps were taken' : 'no dangerous defect'}.`
      : 'Duty owed and likely breached: the landlord did not take the reasonable steps Jones v Bartlett requires.';
    tone = ok ? 'yes' : 'no';
  } else if (s.role === 'occupier' && s.entrant === 'trespasser') {
    verdict = 'Cardy: the trespasser enters at their own risk; only intentional or wanton harm is actionable. The modern position is unresolved.';
    tone = 'no';
  } else if (s.role === 'occupier' && s.entrant === 'lawful') {
    verdict = 'Duty owed to a lawful entrant; argue its extent from the relationship, the purpose of entry and the premises.';
    tone = 'yes';
  } else {
    verdict = 'Open — this pairing is not answered by this week’s materials as set up; change the defendant or the entrant.';
    tone = 'open';
  }
  return { figure, verdict, tone };
}

function describe(a: S, b: S) {
  if (a.role !== b.role) return b.role === 'landlord' ? 'Defendant: the landlord, who has let the premises to a tenant.' : 'Defendant: the occupier — whoever controls the land.';
  if (a.entrant !== b.entrant) return b.entrant === 'tenant' ? 'Entrant: the tenant (and their household).' : b.entrant === 'lawful' ? 'Entrant: someone on the land lawfully — a guest, a customer.' : 'Entrant: a trespasser.';
  if (a.dangerous !== b.dangerous) return b.dangerous ? 'A defect the landlord knows or ought to know makes the premises unsafe.' : 'No dangerous defect — like the glass door in Jones v Bartlett.';
  if (a.ascertained !== b.ascertained) return b.ascertained ? 'Reasonable steps to ascertain defects (think of the condition report at the start of a lease).' : 'No reasonable steps to find defects.';
  if (a.fixed !== b.fixed) return b.fixed ? 'Reasonable steps to remove the defect or make the premises safe.' : 'The defect was not removed or made safe.';
  return '';
}

export default function LandlordsOccupiersTrespassers() {
  return (
    <Simulation<S>
      label="Landlords, occupiers and trespassers: whether a duty is owed and what discharges it"
      terms={[
        { term: 'Occupier', def: 'A person or entity who controls the relevant land.' },
        { term: 'Lawful entrant', def: 'Someone on the land with permission — owed a duty by the occupier.' },
        { term: 'Reasonable steps', def: 'Jones v Bartlett: steps to ascertain defects, and to remove them or make the premises safe.' },
        { term: 'Trespasser', def: 'An entrant without permission — at their own risk (Cardy).' },
      ]}
      initial={initial}
      controls={[
        { key: 'role', label: 'Defendant', type: 'select', options: [{ value: 'landlord', label: 'Landlord' }, { value: 'occupier', label: 'Occupier (in control of the land)' }] },
        { key: 'entrant', label: 'Who was injured', type: 'select', options: [{ value: 'tenant', label: 'The tenant or their household' }, { value: 'lawful', label: 'Another lawful entrant (a guest)' }, { value: 'trespasser', label: 'A trespasser' }] },
        { key: 'dangerous', label: 'A defect the landlord knew or ought to have known made the premises unsafe', type: 'toggle' },
        { key: 'ascertained', label: 'Landlord took reasonable steps to ascertain defects', type: 'toggle' },
        { key: 'fixed', label: 'Landlord took reasonable steps to remove them or make the premises safe', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'According to Jones v Bartlett, how does a landlord discharge the duty owed to a tenant?',
        options: [
          { text: 'By guaranteeing the premises are free of every defect throughout the lease', why: 'The duty is to take reasonable steps, not to guarantee perfection.' },
          { text: 'By reasonable steps to ascertain defects, and to remove them or make the premises safe', correct: true, why: 'Gummow and Hayne JJ: the duty is discharged by reasonable steps to find defects and to remove them or make the premises safe.' },
          { text: 'By handing control of the premises to the tenant under the lease', why: 'That was the reasoning behind the old Cavalier v Pope rule, which Northern Sandblasting rejected.' },
        ],
      }}
    />
  );
}
