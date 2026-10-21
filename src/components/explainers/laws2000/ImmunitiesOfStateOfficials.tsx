/*
SCENE: Immunity ratione personae and ratione materiae
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → set rank, act, time and forum → watch which shield lights → one check
INTENT: Show that personal immunity attaches to the office (troika, in office, any act) and functional immunity to
  the act (official acts, surviving departure from office), and that neither applies in the official's own courts.
SUBJECT: the two shields; the lit one is what protects the person before the foreign court.
BEAT 1 (0–100%): selects for rank, act and time and a toggle for forum; each shield's hairline turns sage when it
  applies; verdict within 200ms. Ease: CSS 180ms ease-out on colour only.
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (no motion beyond colour).
BUDGET: < 6 KB gz, no WebGL.
Source: concept card laws2000-w06-immunities-of-state-officials (Arrest Warrant (DRC v Belgium) 2002; Djibouti v
  France 2008; soldier and Greek president examples from the card). Serious international crimes are a separate
  concept (laws2000-w06-immunity-and-serious-international-crimes) and are not modelled here.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  rank: 'troika' | 'other';
  act: 'official' | 'private';
  time: 'in-office' | 'left';
  ownCourts: boolean;
}

const initial: S = { rank: 'troika', act: 'private', time: 'in-office', ownCourts: false };

function applies(s: S) {
  if (s.ownCourts) return { personae: false, materiae: false };
  return { personae: s.rank === 'troika' && s.time === 'in-office', materiae: s.act === 'official' };
}

const shield = (title: string, rule: string, on: boolean) => (
  <div style={{ padding: 'var(--s-4)', background: 'var(--paper)', borderRadius: 'var(--r-md)', border: `1.5px solid ${on ? 'var(--sage)' : 'var(--line)'}`, transition: 'border-color 180ms var(--ease-out)' }} data-on={on ? 'true' : undefined}>
    <p className="label" style={{ margin: 0, color: on ? 'var(--ink)' : 'var(--ink-3)' }}>{title}</p>
    <p style={{ margin: 'var(--s-2) 0 var(--s-1)', fontWeight: 600, fontSize: 'var(--t-lg)', color: on ? 'var(--ink)' : 'var(--ink-3)' }}>{on ? 'Shields' : 'Does not apply'}</p>
    <p style={{ margin: 0, fontSize: 'var(--t-sm)', lineHeight: 1.4, color: 'var(--ink-2)' }}>{rule}</p>
  </div>
);

function view(s: S): SimView {
  const a = applies(s);
  const figure = (
    <div className="xgates" role="group" aria-label="Two immunities: ratione personae and ratione materiae">
      <div style={{ display: 'grid', gap: 'var(--s-4)', gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))' }}>
        {shield('Ratione personae · the office', 'Head of state, head of government or foreign minister; complete, even for private acts; only while in office.', a.personae)}
        {shield('Ratione materiae · the act', 'Official acts done under the colour of authority while in office; survives leaving office.', a.materiae)}
      </div>
    </div>
  );
  let verdict: string;
  let tone: SimView['tone'];
  if (s.ownCourts) { verdict = 'No immunity: neither immunity applies in the official’s own state’s courts.'; tone = 'no'; }
  else if (a.personae) { verdict = s.act === 'private' ? 'Immune (ratione personae): a sitting troika member is immune even for a private act — the drunk-driving president.' : 'Immune (ratione personae): complete immunity while in office; the official act is also covered ratione materiae.'; tone = 'yes'; }
  else if (a.materiae) { verdict = s.time === 'left' ? 'Immune (ratione materiae): functional immunity for an official act continues after leaving office.' : 'Immune (ratione materiae): an official act, like the soldier on the battlefield, is the state’s act.'; tone = 'yes'; }
  else { verdict = s.rank === 'troika' ? 'Not immune: out of office, personal immunity has ended and a private act has no functional cover.' : 'Not immune: below the troika there is no personal immunity, and a private act has no functional cover.'; tone = 'no'; }
  return { figure, verdict, tone };
}

function describe(a: S, b: S) {
  if (a.rank !== b.rank) return b.rank === 'troika' ? 'Head of state, head of government or foreign minister: personal immunity is available (Djibouti v France).' : 'Another official: only functional immunity is available.';
  if (a.act !== b.act) return b.act === 'official' ? 'An official act done with official authority: functional immunity attaches to it.' : 'A private act: only personal immunity can cover it.';
  if (a.time !== b.time) return b.time === 'left' ? 'Left office: personal immunity ends; functional immunity for official acts remains.' : 'In office: personal immunity is live for the troika.';
  if (a.ownCourts !== b.ownCourts) return b.ownCourts ? 'Sued in their own state’s courts: neither immunity applies there.' : 'Before a foreign court: the immunities are back in play.';
  return '';
}

export default function ImmunitiesOfStateOfficials() {
  return (
    <Simulation<S>
      label="Which immunity, if any, shields a state official before a foreign court"
      terms={[
        { term: 'Ratione personae', def: 'Personal immunity attached to high office: complete, but only while in office.' },
        { term: 'Ratione materiae', def: 'Functional immunity attached to official acts: survives leaving office.' },
        { term: 'Troika', def: 'Head of state, head of government and foreign minister.' },
        { term: 'The state’s immunity', def: 'Granted for the state’s functions, not the person’s benefit — so only the state can waive it.' },
      ]}
      initial={initial}
      controls={[
        { key: 'rank', label: 'Rank', type: 'select', options: [{ value: 'troika', label: 'Troika member' }, { value: 'other', label: 'Other official' }] },
        { key: 'act', label: 'The act', type: 'select', options: [{ value: 'official', label: 'Official act, with official authority' }, { value: 'private', label: 'Private act' }] },
        { key: 'time', label: 'At the time of proceedings', type: 'select', options: [{ value: 'in-office', label: 'Still in office' }, { value: 'left', label: 'Has left office' }] },
        { key: 'ownCourts', label: 'Proceedings are in the official’s own state’s courts', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'A former foreign minister is sued abroad over a private act done while in office. Which immunity applies?',
        options: [
          { text: 'Ratione personae, because the act was done while in office', why: 'Personal immunity lasts only while the person holds office; it ended when they left.' },
          { text: 'Ratione materiae, because they were a minister at the time', why: 'Functional immunity covers only official acts, not private ones.' },
          { text: 'Neither: personal immunity has ended and the act was private', correct: true, why: 'Once out of office only functional immunity remains, and it does not cover a private act.' },
        ],
      }}
    />
  );
}
