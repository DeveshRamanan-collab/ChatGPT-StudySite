/*
SCENE: ICC jurisdiction — four gates in order: the crime (art 5), time (art 11), the trigger (art 13) and the
  preconditions (art 12)
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → change the crime, timing, trigger and the states' status → watch each gate pass, stop or stand aside
  → one check
INTENT: Jurisdiction needs an art 5 crime committed after entry into force and one of three triggers; for a State
  Party referral or a proprio motu investigation the territorial (or flag) state or the nationality state must be a
  Party or a declarant, but a Security Council referral needs no such link.
SUBJECT: the column of four gates; the first one in clay is why the Court cannot act.
BEAT 1 (0–100%): one toggle and four selects drive the gates; each gate's border turns sage (passes), clay (stops) or
  dashed (not needed); verdict within 200ms. Ease: CSS 180ms ease-out on border colour only.
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (no motion beyond colour).
BUDGET: < 7 KB gz, no WebGL.
Source: concept laws2000-w11-icc-jurisdiction; rome-statute-art-5, -11, -12, -13 (Week 11 Lecture Slides, slides
  39–45; Libya 2011 is the slides' Security Council referral); Tutorial Tasks question 4(a)–(c). Starting state is
  tutorial 4(b) (Valeron, Giskar).
*/
import { Simulation, type SimView } from '../bases/Simulation';

type Status = 'party' | 'declarant' | 'non';

interface S extends Record<string, unknown> {
  crime: 'genocide' | 'cah' | 'war' | 'aggression' | 'piracy';
  inForce: boolean;
  trigger: 'party' | 'unsc' | 'proprio';
  territorial: Status | 'joined';
  nationality: Status;
}

const initial: S = { crime: 'cah', inForce: true, trigger: 'unsc', territorial: 'non', nationality: 'non' };

const CRIME: Record<S['crime'], string> = {
  genocide: 'genocide (art 6)',
  cah: 'crimes against humanity (art 7)',
  war: 'war crimes (art 8)',
  aggression: 'the crime of aggression (art 8 bis)',
  piracy: 'piracy',
};
const TRIGGER: Record<S['trigger'], string> = {
  party: 'a State Party referral (art 13(a), art 14)',
  unsc: 'a Security Council referral under Chapter VII (art 13(b))',
  proprio: 'the Prosecutor acting proprio motu (art 13(c), art 15)',
};

type GateState = 'pass' | 'stop' | 'aside';
interface Gate { art: string; title: string; state: GateState; why: string }

const linked = (x: string) => x === 'party' || x === 'declarant';

function gates(s: S): Gate[] {
  const g5: Gate = s.crime === 'piracy'
    ? { art: 'art 5', title: 'An art 5 crime?', state: 'stop', why: 'Piracy is not one of the four crimes.' }
    : { art: 'art 5', title: 'An art 5 crime?', state: 'pass', why: `Yes — ${CRIME[s.crime]}.` };
  const g11: Gate = s.inForce
    ? { art: 'art 11', title: 'After entry into force?', state: 'pass', why: 'Committed after the Statute entered into force.' }
    : { art: 'art 11', title: 'After entry into force?', state: 'stop', why: 'Only crimes after the Statute’s entry into force (art 11(1)).' };
  const g13: Gate = { art: 'art 13', title: 'A trigger?', state: 'pass', why: `Yes — ${TRIGGER[s.trigger]}.` };
  let g12: Gate;
  if (s.trigger === 'unsc') g12 = { art: 'art 12', title: 'Territorial or nationality link?', state: 'aside', why: 'Not needed: art 12(2) applies only to art 13(a) and (c).' };
  else if (linked(s.territorial)) g12 = { art: 'art 12', title: 'Territorial or nationality link?', state: 'pass', why: s.territorial === 'party' ? 'The territorial (or flag) state is a Party (art 12(2)(a)).' : 'The territorial state accepted jurisdiction by art 12(3) declaration.' };
  else if (linked(s.nationality)) g12 = { art: 'art 12', title: 'Territorial or nationality link?', state: 'pass', why: s.nationality === 'party' ? 'The accused’s nationality state is a Party (art 12(2)(b)).' : 'The nationality state accepted jurisdiction by art 12(3) declaration.' };
  else g12 = { art: 'art 12', title: 'Territorial or nationality link?', state: 'stop', why: s.territorial === 'joined' ? 'The territorial state joined after the acts: art 11(2) limits it to later crimes unless it lodges an art 12(3) declaration — and the nationality state is no Party.' : 'Neither the territorial (or flag) state nor the nationality state is a Party or a declarant.' };
  return [g5, g11, g13, g12];
}

const BORDER: Record<GateState, string> = {
  pass: '1.5px solid var(--sage)',
  stop: '2.5px solid var(--clay)',
  aside: '1.5px dashed var(--ink-3)',
};
const LABEL: Record<GateState, string> = { pass: 'passes', stop: 'stops here', aside: 'not needed' };

function view(s: S): SimView {
  const gs = gates(s);
  const stop = gs.find((g) => g.state === 'stop');
  const figure = (
    <ol className="xgates" aria-label="Four jurisdiction gates in order" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--s-3)' }}>
      {gs.map((g) => (
        <li key={g.art} data-state={g.state} style={{ padding: 'var(--s-3) var(--s-4)', background: 'var(--paper)', borderRadius: 'var(--r-md)', border: BORDER[g.state], transition: 'border-color 180ms var(--ease-out)' }}>
          <p style={{ margin: 0, display: 'flex', gap: 'var(--s-3)', alignItems: 'baseline', flexWrap: 'wrap' }}>
            <span className="mono" style={{ fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>{g.art}</span>
            <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{g.title}</span>
            <span style={{ fontSize: 'var(--t-xs)', color: g.state === 'aside' ? 'var(--ink-3)' : 'var(--ink-2)' }}>{LABEL[g.state]}</span>
          </p>
          <p style={{ margin: 'var(--s-1) 0 0', fontSize: 'var(--t-sm)', lineHeight: 1.4, color: 'var(--ink-2)' }}>{g.why}</p>
        </li>
      ))}
    </ol>
  );
  if (stop) {
    const verdict =
      stop.art === 'art 5' ? 'No jurisdiction: the Court is limited to genocide, crimes against humanity, war crimes and aggression — whatever the links to States Parties.'
      : stop.art === 'art 11' ? 'No jurisdiction: the crime predates the Statute’s entry into force (art 11(1)).'
      : 'No jurisdiction on this trigger: for a State Party referral or a proprio motu investigation, the territorial (or flag) state or the nationality state must be a Party or a declarant (art 12(2)–(3)).';
    return { figure, verdict, tone: 'no' };
  }
  return { figure, verdict: 'The Court may exercise jurisdiction. Next question: is the case admissible (art 17)?', tone: 'yes' };
}

function describe(a: S, b: S) {
  if (a.crime !== b.crime) return b.crime === 'piracy' ? 'Piracy is a universal-jurisdiction crime for states (Week 5), but it is not in art 5 — the first gate closes.' : `The conduct is ${CRIME[b.crime]}, one of the four art 5 crimes.`;
  if (a.inForce !== b.inForce) return b.inForce ? 'After entry into force: the temporal gate opens.' : 'Before the Statute entered into force: art 11(1) closes the temporal gate.';
  if (a.trigger !== b.trigger) return b.trigger === 'unsc' ? 'A Security Council referral under Chapter VII (like Libya, 2011): the art 12(2) links are no longer needed.' : `Triggered by ${TRIGGER[b.trigger]}: now art 12(2) needs a territorial or nationality link.`;
  if (a.territorial !== b.territorial) return b.territorial === 'joined' ? 'The territorial state joined only after the acts: under art 11(2) its acceptance reaches only later crimes, unless it lodges an art 12(3) declaration.' : b.territorial === 'declarant' ? 'The territorial state lodged an art 12(3) declaration with the Registrar — and must now cooperate without delay or exception.' : b.territorial === 'party' ? 'The territorial (or flag) state is a Party: art 12(2)(a) is met.' : 'The territorial state is not a Party and has made no declaration.';
  if (a.nationality !== b.nationality) return b.nationality === 'non' ? 'The accused’s state of nationality is not a Party.' : b.nationality === 'party' ? 'The accused’s state of nationality is a Party: art 12(2)(b) is met.' : 'The nationality state accepted jurisdiction by art 12(3) declaration.';
  return '';
}

export default function IccJurisdiction() {
  return (
    <Simulation<S>
      label="Whether the ICC can exercise jurisdiction: four gates"
      terms={[
        { term: 'Art 5 crimes', def: 'Genocide, crimes against humanity, war crimes and the crime of aggression — nothing else.' },
        { term: 'Ratione temporis', def: 'Jurisdiction in time: only crimes after entry into force (art 11).' },
        { term: 'Proprio motu', def: 'On the Prosecutor’s own initiative (art 15).' },
        { term: 'Art 12(3) declaration', def: 'A non-party’s acceptance of jurisdiction over a crime, lodged with the Registrar.' },
      ]}
      initial={initial}
      controls={[
        { key: 'crime', label: 'The alleged crime', type: 'select', options: [{ value: 'genocide', label: 'Genocide' }, { value: 'cah', label: 'Crimes against humanity' }, { value: 'war', label: 'War crimes' }, { value: 'aggression', label: 'Crime of aggression' }, { value: 'piracy', label: 'Piracy' }] },
        { key: 'inForce', label: 'Committed after the Statute entered into force', type: 'toggle' },
        { key: 'trigger', label: 'Trigger (art 13)', type: 'select', options: [{ value: 'party', label: 'State Party referral' }, { value: 'unsc', label: 'Security Council referral (Chapter VII)' }, { value: 'proprio', label: 'Prosecutor proprio motu' }] },
        { key: 'territorial', label: 'Territorial (or flag) state at the time', type: 'select', options: [{ value: 'party', label: 'A Party' }, { value: 'joined', label: 'Joined only after the acts' }, { value: 'declarant', label: 'Lodged an art 12(3) declaration' }, { value: 'non', label: 'Not a Party' }] },
        { key: 'nationality', label: 'Accused’s state of nationality', type: 'select', options: [{ value: 'party', label: 'A Party' }, { value: 'declarant', label: 'Lodged an art 12(3) declaration' }, { value: 'non', label: 'Not a Party' }] },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'A national of State Party Sirax commits piracy on a ship registered to Sirax. Does the ICC have jurisdiction?',
        options: [
          { text: 'Yes — the flag state and the nationality state are both Parties', why: 'Those links satisfy art 12(2), but preconditions matter only for an art 5 crime.' },
          { text: 'No — piracy is not one of the four art 5 crimes', correct: true, why: 'Art 5 limits the Court to genocide, crimes against humanity, war crimes and aggression; piracy is outside it.' },
          { text: 'Yes — piracy is a crime of universal jurisdiction', why: 'Universality (Week 5) concerns states’ jurisdiction; it does not add crimes to art 5.' },
        ],
      }}
    />
  );
}
