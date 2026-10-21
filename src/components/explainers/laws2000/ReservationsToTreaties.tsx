/*
SCENE: Reservations to treaties (VCLT arts 2(1)(d), 19, 20)
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → change the facts → watch the reservation run art 19's three gates → then art 20's responses → one check
INTENT: Show that a reservation must pass all three art 19 gates before art 20's accept/object machinery is reached,
  and that a failing reservation goes to the three unresolved solutions instead.
SUBJECT: the path through the three gates; it turns clay at the first gate that stops the reservation.
BEAT 1 (0–100%): toggles for the three conditions light the gates; a select for the other party's response lights one
  art 20 outcome once the gates are passed; verdict within 200ms. Ease: CSS 180ms ease-out on colour only.
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (no motion beyond colour).
BUDGET: < 8 KB gz, no WebGL.
Source: concept card laws2000-w03-reservations-to-treaties; VCLT arts 2(1)(d), 19, 20 authority cards (art 20 as the
  materials state it: objection means the treaty does not enter into force between the two).
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  kind: 'reservation' | 'declaration';
  banned: boolean;
  notListed: boolean;
  incompatible: boolean;
  authorised: boolean;
  response: 'accept' | 'object' | 'none';
}

const initial: S = { kind: 'reservation', banned: false, notListed: false, incompatible: true, authorised: false, response: 'accept' };

type Gate = { id: 'ban' | 'list' | 'op'; label: string; sub: string; pass: boolean };

const gates = (s: S): Gate[] => [
  { id: 'ban', label: 'art 19(a)', sub: 'treaty does not ban reservations', pass: !s.banned },
  { id: 'list', label: 'art 19(b)', sub: 'not outside a list of permitted ones', pass: !s.notListed },
  { id: 'op', label: 'art 19(c)', sub: 'compatible with object and purpose', pass: !s.incompatible },
];

function view(s: S): SimView {
  if (s.kind === 'declaration') {
    return {
      figure: (
        <div className="xgates">
          <div className="xgates__circ">
            <p className="xgates__circ-title">An interpretative declaration:</p>
            <ul><li data-on="true">● explains the state’s view of a provision</li><li>○ does not exclude or modify legal effect</li><li>○ does not condition consent — art 19 and art 20 are not engaged</li></ul>
          </div>
        </div>
      ),
      verdict: 'Not a reservation (art 2(1)(d)): the gates do not apply. Check the substance, though — a statement “however phrased or named” that modifies legal effect is a reservation.',
      tone: 'open',
    };
  }
  const gs = gates(s);
  const stop = gs.find((g) => !g.pass);
  let reached = true;
  const responses = [
    { k: 'accept', t: 'Accepted: both are parties on the modified terms (art 20(4))' },
    { k: 'object', t: 'Objected: the treaty does not enter into force between the two (art 20(4))' },
    { k: 'none', t: 'No acceptance yet: the reservation takes effect once one state accepts it' },
  ];
  const figure = (
    <div className="xgates" role="group" aria-label="Three art 19 gates, then art 20">
      <ol className="xgates__row">
        {gs.map((g) => {
          const lit = reached;
          const blocked = !g.pass && reached;
          if (blocked) reached = false;
          const state = blocked ? 'stop' : lit ? 'pass' : 'idle';
          return (
            <li key={g.id} className="xgate" data-state={state} data-lit={lit ? 'true' : undefined}>
              <span className="xgate__box">
                <span className="xgate__label mono">{g.label}</span>
                <span className="xgate__status">{blocked ? 'stops here' : lit ? 'passed' : '—'}</span>
              </span>
              <span className="xgate__sub">{g.sub}</span>
            </li>
          );
        })}
      </ol>
      <p className="xgates__end" data-state={stop ? 'stop' : 'pass'}>{stop ? 'impermissible: void from the start' : 'on to art 20'}</p>
      <div className="xgates__circ">
        {stop ? (
          <>
            <p className="xgates__circ-title">Unresolved: three possible solutions</p>
            <ul>
              <li data-on="true">● the state does not become a party at all</li>
              <li data-on="true">● reservation severed; state bound in full, reserved provision included</li>
              <li data-on="true">● bound without the reservation’s benefit, unless consent was expressly conditioned on it</li>
            </ul>
          </>
        ) : (
          <>
            <p className="xgates__circ-title">{s.authorised ? 'Expressly authorised by the treaty: no acceptance needed (art 20(1))' : 'Art 20: the other state’s response'}</p>
            <ul>{responses.map((r) => { const on = !s.authorised && r.k === s.response; return <li key={r.k} data-on={on ? 'true' : undefined}>{on ? '● ' : '○ '}{r.t}</li>; })}</ul>
          </>
        )}
      </div>
    </div>
  );
  let verdict: string;
  let tone: SimView['tone'];
  if (stop) {
    verdict = stop.id === 'ban'
      ? 'Impermissible (art 19(a)): the treaty prohibits reservations. Void from the start; the consequence is unresolved.'
      : stop.id === 'list'
        ? 'Impermissible (art 19(b)): only specified reservations may be made, and this is not one. Void from the start.'
        : 'Impermissible (art 19(c)): incompatible with the treaty’s object and purpose. Void from the start.';
    tone = 'no';
  } else if (s.authorised) {
    verdict = 'Permissible and expressly authorised: effective without any acceptance (art 20(1)).';
    tone = 'yes';
  } else if (s.response === 'accept') {
    verdict = 'Permissible and accepted: the reservation is effective, and both states are parties on the modified terms.';
    tone = 'yes';
  } else if (s.response === 'object') {
    verdict = 'Permissible but objected to: as between the reserving and objecting states, the treaty does not enter into force.';
    tone = 'no';
  } else {
    verdict = 'Permissible, but not yet effective: it takes effect once at least one other contracting state accepts it.';
    tone = 'open';
  }
  return { figure, verdict, tone };
}

function describe(a: S, b: S) {
  if (a.kind !== b.kind) return b.kind === 'declaration' ? 'An interpretative declaration only explains a view; it does not condition consent.' : 'A reservation purports to exclude or modify legal effect: art 19’s gates apply.';
  if (a.banned !== b.banned) return b.banned ? 'The treaty bans reservations altogether: stopped at the first gate.' : 'No treaty-wide ban: the first gate opens.';
  if (a.notListed !== b.notListed) return b.notListed ? 'The treaty permits only specified reservations, and this is not one of them.' : 'No list excludes this reservation: the second gate opens.';
  if (a.incompatible !== b.incompatible) return b.incompatible ? 'Incompatible with object and purpose — like reserving against the core emissions duty in an ozone treaty.' : 'Compatible with the treaty’s object and purpose: the third gate opens.';
  if (a.authorised !== b.authorised) return b.authorised ? 'Expressly authorised by the treaty: no acceptance required.' : 'Not expressly authorised: the other states’ responses matter.';
  if (a.response !== b.response) return b.response === 'accept' ? 'The other state accepts.' : b.response === 'object' ? 'The other state objects.' : 'No state has yet accepted.';
  return '';
}

export default function ReservationsToTreaties() {
  return (
    <Simulation<S>
      label="A reservation tested against art 19’s three gates, then art 20’s responses"
      terms={[
        { term: 'Reservation', def: 'A unilateral statement on consent that purports to exclude or modify a provision’s legal effect for that state (art 2(1)(d)).' },
        { term: 'Interpretative declaration', def: 'Explains a state’s view of a provision without conditioning its consent.' },
        { term: 'Object and purpose', def: 'The treaty’s core aim; a reservation against it is impermissible (art 19(c)).' },
      ]}
      initial={initial}
      controls={[
        { key: 'kind', label: 'The statement is', type: 'select', options: [{ value: 'reservation', label: 'A reservation' }, { value: 'declaration', label: 'An interpretative declaration' }] },
        { key: 'banned', label: 'Treaty prohibits reservations', type: 'toggle' },
        { key: 'notListed', label: 'Treaty allows only specified reservations, not this one', type: 'toggle' },
        { key: 'incompatible', label: 'Incompatible with the object and purpose', type: 'toggle' },
        { key: 'authorised', label: 'Expressly authorised by the treaty', type: 'toggle' },
        { key: 'response', label: 'Another contracting state', type: 'select', options: [{ value: 'accept', label: 'Accepts' }, { value: 'object', label: 'Objects' }, { value: 'none', label: 'Has not responded' }] },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'A reservation is incompatible with the treaty’s object and purpose, but another state accepts it. What follows?',
        options: [
          { text: 'It is effective, because one acceptance is enough', why: 'The one-acceptance rule is art 20 machinery, and only a permissible reservation reaches art 20.' },
          { text: 'It is impermissible under art 19(c); acceptance does not save it', correct: true, why: 'Art 19’s gates are run first; a failing reservation is void from the start and goes to the three unresolved solutions.' },
          { text: 'The treaty does not enter into force between the two states', why: 'That is the consequence of an objection to a permissible reservation, not of an impermissible one.' },
        ],
      }}
    />
  );
}
