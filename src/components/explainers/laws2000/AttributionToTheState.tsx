/*
SCENE: Attribution to the state (ARSIWA arts 4–7, 10, 11)
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → set who acted, in what capacity, and what the state did afterwards → watch the chain → one check
INTENT: Show attribution as a chain from the conduct to the state that closes only when one live pathway (art 4, 5, 6,
  7, 10 or 11) is complete; ultra vires conduct in an official capacity still closes it.
SUBJECT: the chain's three links — conduct, pathway, state; the middle link names the article that closes it.
BEAT 1 (0–100%): selects and toggles relight the links; the connectors turn sage when the chain closes, clay at the
  break; verdict within 200ms. Ease: CSS 180ms ease-out on colour only.
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (no motion beyond colour).
BUDGET: < 8 KB gz, no WebGL.
Source: concept card laws2000-w07-attribution-to-the-state; ARSIWA arts 4, 5, 6, 7, 10, 11 authority cards; Genocide
  (2007) paras 392–393; Velásquez Rodríguez (1988); Tehran. Art 8 (instructions, direction or control) is the separate
  concept laws2000-w07-effective-control-and-private-conduct and is only signposted here.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  actor: 'organ' | 'de-facto' | 'empowered' | 'lent' | 'insurgent' | 'private';
  capacity: boolean;
  ultraVires: boolean;
  insurgency: 'government' | 'new-state' | 'failed';
  adopted: boolean;
}

const initial: S = { actor: 'organ', capacity: true, ultraVires: true, insurgency: 'failed', adopted: false };

type Path = { closed: boolean; art: string; to: string; why: string };

function path(s: S): Path {
  const cap = s.capacity;
  const uv = s.ultraVires ? ' + art 7' : '';
  if ((s.actor === 'organ' || s.actor === 'de-facto') && cap) return { closed: true, art: `art 4${uv}`, to: 'the state', why: s.actor === 'de-facto' ? `Attributed (art 4${uv}): acting in complete dependence on the state, the entity is a de facto organ (Genocide, paras 392–393).` : `Attributed (art 4${uv}): the conduct of any organ, whatever its position, is the state’s.${s.ultraVires ? ' Exceeding authority does not break the chain (Velásquez Rodríguez).' : ''}` };
  if (s.actor === 'empowered' && cap) return { closed: true, art: `art 5${uv}`, to: 'the state', why: `Attributed (art 5${uv}): empowered by law to exercise governmental authority and acting in that capacity — a privatised prison, say.${s.ultraVires ? ' Contravening instructions does not break the chain.' : ''}` };
  if (s.actor === 'lent' && cap) return { closed: true, art: 'art 6', to: 'the receiving state', why: 'Attributed to the receiving state (art 6): an organ lent by another state, exercising the receiving state’s governmental authority.' };
  if (s.actor === 'insurgent' && s.insurgency === 'government') return { closed: true, art: 'art 10(1)', to: 'the state', why: 'Attributed (art 10(1)): the insurrectional movement became the new government.' };
  if (s.actor === 'insurgent' && s.insurgency === 'new-state') return { closed: true, art: 'art 10(2)', to: 'the new state', why: 'Attributed to the new state (art 10(2)): the movement established a new state in part of the territory.' };
  if (s.adopted) return { closed: true, art: 'art 11', to: 'the state', why: 'Attributed (art 11): the state acknowledged and adopted the conduct as its own, to that extent — as Iran’s decree endorsing the students in Tehran.' };
  if (s.actor === 'private') return { closed: false, art: 'none yet', to: 'the state', why: 'Not attributed on these pathways: a private person’s conduct is not the state’s. Test art 8 next (instructions, direction or control).' };
  if (s.actor === 'insurgent') return { closed: false, art: 'none', to: 'the state', why: 'Not attributed (art 10): the movement neither became the government nor founded a new state.' };
  return { closed: false, art: 'none', to: 'the state', why: 'Not attributed: the organ or entity was not acting in that capacity — art 7 covers ultra vires official conduct, not private conduct.' };
}

const ACTOR: Record<S['actor'], string> = {
  organ: 'State organ (de jure)', 'de-facto': 'De facto organ', empowered: 'Entity empowered by law', lent: 'Organ lent by another state', insurgent: 'Insurrectional movement', private: 'Private person',
};

const link = (top: string, main: string, state: 'on' | 'off' | 'break') => (
  <li style={{ minWidth: 0, padding: 'var(--s-3) var(--s-2)', background: 'var(--paper)', borderRadius: 'var(--r-md)', textAlign: 'center', border: `1.5px solid ${state === 'on' ? 'var(--sage)' : state === 'break' ? 'var(--clay)' : 'var(--ink-3)'}`, borderStyle: state === 'off' ? 'dashed' : 'solid', transition: 'border-color 180ms var(--ease-out)' }}>
    <span className="label" style={{ display: 'block' }}>{top}</span>
    <span className="mono" style={{ display: 'block', marginTop: 'var(--s-1)', fontSize: 'var(--t-sm)', overflowWrap: 'anywhere', color: state === 'off' ? 'var(--ink-3)' : 'var(--ink)' }}>{main}</span>
  </li>
);

const join = (on: boolean, key: string) => (
  <li key={key} aria-hidden="true" style={{ alignSelf: 'center', height: '3px', background: on ? 'var(--sage)' : 'var(--line)', transition: 'background-color 180ms var(--ease-out)' }} />
);

function view(s: S): SimView {
  const p = path(s);
  const figure = (
    <div className="xgates" role="group" aria-label={`Attribution chain: ${ACTOR[s.actor]}, pathway ${p.art}, ${p.closed ? 'attributed to' : 'not attributed to'} ${p.to}`}>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 16px minmax(0, 1fr) 16px minmax(0, 1fr)', gap: 'var(--s-1)', alignItems: 'stretch' }}>
        {link('Conduct by', ACTOR[s.actor], 'on')}
        {join(p.closed, 'j1')}
        {link('Pathway', p.art, p.closed ? 'on' : 'break')}
        {join(p.closed, 'j2')}
        {link('Attributed to', p.to, p.closed ? 'on' : 'off')}
      </ol>
      <div className="xgates__circ">
        <p className="xgates__circ-title">Pathways, tested in order:</p>
        <ul>
          {[
            ['art 4 · organ', p.art.startsWith('art 4')], ['art 5 · governmental authority', p.art.startsWith('art 5')], ['art 6 · lent organ', p.art === 'art 6'],
            ['art 7 · ultra vires still counts', p.art.includes('art 7')], ['art 10 · successful insurgency', p.art.startsWith('art 10')], ['art 11 · acknowledged and adopted', p.art === 'art 11'],
          ].map(([k, on]) => <li key={String(k)} data-on={on ? 'true' : undefined}>{on ? '● ' : '○ '}{k}</li>)}
        </ul>
      </div>
    </div>
  );
  return { figure, verdict: p.why, tone: p.closed ? 'yes' : 'no' };
}

function describe(a: S, b: S) {
  if (a.actor !== b.actor) return `${ACTOR[b.actor]}: ${b.actor === 'organ' ? 'art 4 — legislative, executive, judicial or other, central or territorial.' : b.actor === 'de-facto' ? 'exceptionally an organ under art 4 if in complete dependence on the state.' : b.actor === 'empowered' ? 'art 5, if empowered by law and acting in that capacity.' : b.actor === 'lent' ? 'art 6, attributed to the state it is placed at the disposal of.' : b.actor === 'insurgent' ? 'art 10, only if it succeeds.' : 'not the state’s conduct in principle.'}`;
  if (a.capacity !== b.capacity) return b.capacity ? 'Acting in that official capacity.' : 'Acting in a private capacity: the organ and art 5 pathways do not reach it.';
  if (a.ultraVires !== b.ultraVires) return b.ultraVires ? 'Exceeds authority or contravenes instructions: art 7 keeps it attributed, if done in that capacity.' : 'Within authority.';
  if (a.insurgency !== b.insurgency) return b.insurgency === 'government' ? 'The movement becomes the new government.' : b.insurgency === 'new-state' ? 'The movement establishes a new state.' : 'The insurgency fails.';
  if (a.adopted !== b.adopted) return b.adopted ? 'The state later acknowledges and adopts the conduct as its own.' : 'No acknowledgement or adoption.';
  return '';
}

export default function AttributionToTheState() {
  return (
    <Simulation<S>
      label="Attribution as a chain from conduct, through an ARSIWA pathway, to the state"
      terms={[
        { term: 'Attribution', def: 'Whether conduct counts as the state’s own act (ARSIWA chapter III).' },
        { term: 'Organ', def: 'Any part of the state, whatever its position; de facto if in complete dependence.' },
        { term: 'Ultra vires', def: 'Beyond authority or against instructions — still attributed if done in an official capacity (art 7).' },
        { term: 'Acknowledgement and adoption', def: 'The state makes others’ conduct its own after the event (art 11).' },
      ]}
      initial={initial}
      controls={[
        { key: 'actor', label: 'Who acted', type: 'select', options: (Object.keys(ACTOR) as S['actor'][]).map((k) => ({ value: k, label: ACTOR[k] })) },
        { key: 'capacity', label: 'Acting in that official capacity', type: 'toggle' },
        { key: 'ultraVires', label: 'Exceeded authority or contravened instructions', type: 'toggle' },
        { key: 'insurgency', label: 'If an insurrectional movement, it', type: 'select', options: [{ value: 'government', label: 'Became the new government' }, { value: 'new-state', label: 'Established a new state' }, { value: 'failed', label: 'Failed' }] },
        { key: 'adopted', label: 'State later acknowledged and adopted the conduct', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Police officers, on duty, torture a detainee against express orders. Is the conduct attributable to the state?',
        options: [
          { text: 'No — they contravened their instructions', why: 'Art 7: contravening instructions does not break attribution when the organ acts in that capacity.' },
          { text: 'Yes — an organ acting in that capacity, even ultra vires (arts 4 and 7)', correct: true, why: 'The police are a state organ acting in their official capacity, so their ultra vires conduct is still the state’s (Velásquez Rodríguez).' },
          { text: 'Only if the state later adopts it under art 11', why: 'Art 11 is for conduct not already attributable; arts 4 and 7 attribute this conduct already.' },
        ],
      }}
    />
  );
}
