/*
SCENE: Art 2(4) parsed phrase by phrase — four switches and a verdict line
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → change the facts → watch each phrase of art 2(4) light as met, not met or contested → one check
INTENT: Show that a breach of art 2(4) needs every phrase to be met — international relations, a threat or use,
  force, against territorial integrity or political independence — and where each phrase is settled or contested.
SUBJECT: the four phrase cards; the first card that is not met (or is contested) decides the verdict.
BEAT 1 (0–100%): selects and toggles re-light the cards (sage met · clay not met · dashed contested); the verdict
  updates within 200ms. Ease: CSS 180ms ease-out on border colour only — no positional movement.
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (colour only); off mode shows the same controls.
BUDGET: < 8 KB gz, no WebGL.
Source: concept laws2000-w09-prohibition-on-the-use-of-force; Week 9 slides 6–7, 9–13; Nicaragua para 34; Nuclear
  Weapons Advisory Opinion paras 47–48; ILA 2018 report; Corfu Channel (as the lecturer used it). Consent is only
  signposted here — it is the subject of laws2000-w09-exceptions-to-the-prohibition.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  where: 'international' | 'internal';
  form: 'use' | 'threat';
  credible: boolean;
  threatenedLawful: boolean;
  kind: 'armed' | 'cyber-kinetic' | 'cyber-minor' | 'economic';
  aim: 'territory' | 'limited';
  consent: boolean;
}

const initial: S = { where: 'international', form: 'use', credible: true, threatenedLawful: false, kind: 'armed', aim: 'limited', consent: false };

type Status = 'met' | 'not' | 'open' | 'idle';
type Phrase = { key: string; text: string; status: Status; note: string };

function phrases(s: S): Phrase[] {
  const ir: Phrase = s.where === 'international'
    ? { key: 'ir', text: '“in their international relations”', status: 'met', note: 'force between states' }
    : { key: 'ir', text: '“in their international relations”', status: 'not', note: 'internal force: human rights law and IHL apply instead' };
  const tu: Phrase = s.form === 'use'
    ? { key: 'tu', text: '“the threat or use”', status: 'met', note: 'an actual use' }
    : !s.credible
      ? { key: 'tu', text: '“the threat or use”', status: 'not', note: 'mere rhetoric: not specific or credible' }
      : s.threatenedLawful
        ? { key: 'tu', text: '“the threat or use”', status: 'not', note: 'threat of lawful force is not unlawful (Nuclear Weapons, para 47)' }
        : { key: 'tu', text: '“the threat or use”', status: 'met', note: 'a specific, credible threat of unlawful force' };
  const f: Phrase = s.kind === 'armed'
    ? { key: 'f', text: '“of force”', status: 'met', note: 'military or armed force' }
    : s.kind === 'cyber-kinetic'
      ? { key: 'f', text: '“of force”', status: 'met', note: 'cyber with kinetic-like scale and effects (ILA 2018)' }
      : s.kind === 'cyber-minor'
        ? { key: 'f', text: '“of force”', status: 'not', note: 'cyber without kinetic-like effects: unlikely to be force' }
        : { key: 'f', text: '“of force”', status: 'open', note: 'economic coercion: states are divided' };
  const ti: Phrase = s.aim === 'territory'
    ? { key: 'ti', text: '“against the territorial integrity or political independence”', status: 'met', note: 'aimed at territory or government' }
    : { key: 'ti', text: '“against the territorial integrity or political independence”', status: 'met', note: 'limited, temporary force still counts — restrictive reading rejected' };
  return [ir, tu, f, ti];
}

const BORDER: Record<Status, string> = { met: 'var(--sage)', not: 'var(--clay)', open: 'var(--ink-3)', idle: 'var(--line)' };
const WORD: Record<Status, string> = { met: 'met', not: 'not met', open: 'contested', idle: '—' };

function view(s: S): SimView {
  const ps = phrases(s);
  const stop = ps.findIndex((p) => p.status !== 'met');
  const shown = ps.map((p, i) => (stop >= 0 && i > stop ? { ...p, status: 'idle' as Status } : p));
  const figure = (
    <div className="xgates" role="group" aria-label={`Art 2(4), phrase by phrase: ${shown.map((p) => `${p.text} ${WORD[p.status]}`).join('; ')}`}>
      <p className="label" style={{ margin: '0 0 var(--s-2)' }}>All Members shall refrain…</p>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--s-2)' }}>
        {shown.map((p) => (
          <li key={p.key} data-phrase={p.key} data-state={p.status} style={{ padding: 'var(--s-2) var(--s-3)', borderRadius: 'var(--r-md)', background: 'var(--paper)', border: `1.5px ${p.status === 'open' || p.status === 'idle' ? 'dashed' : 'solid'} ${BORDER[p.status]}`, transition: 'border-color 180ms var(--ease-out)' }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--t-sm)', color: p.status === 'idle' ? 'var(--ink-3)' : 'var(--ink)' }}>{p.text}</span>
            <span className="mono" style={{ display: 'block', marginTop: '2px', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>{p.status === 'idle' ? 'not reached' : `${WORD[p.status]} · ${p.note}`}</span>
          </li>
        ))}
      </ol>
      <div className="xgates__circ">
        <p className="xgates__circ-title">Status of the prohibition:</p>
        <ul>
          <li data-on="true">● treaty: UN Charter art 2(4)</li>
          <li data-on="true">● custom (Nicaragua, para 34)</li>
          <li data-on="true">● jus cogens</li>
        </ul>
      </div>
    </div>
  );
  if (s.consent && s.where === 'international' && s.form === 'use')
    return { figure, verdict: 'No violation: the territorial state’s government consented, so there is nothing to excuse (see the exceptions concept).', tone: 'yes' };
  if (stop < 0)
    return { figure, verdict: `Within the prohibition: a ${s.form === 'threat' ? 'threat' : 'use'} of force contrary to art 2(4), unless an exception applies (art 42 or art 51).`, tone: 'no' };
  const p = ps[stop];
  if (p.status === 'open')
    return { figure, verdict: 'Contested: force traditionally means armed force, and states are divided on economic coercion — it is not, as of now, treated as force.', tone: 'open' };
  const why = p.key === 'ir'
    ? 'Outside art 2(4): force used internally on a state’s own territory is not covered in principle — human rights law and IHL apply instead.'
    : p.key === 'tu'
      ? s.credible
        ? 'Not an unlawful threat: the force threatened would itself be lawful, so the threat is lawful too (Nuclear Weapons, para 47).'
        : 'Not a threat under art 2(4): political rhetoric that is not reasonably specific or credible does not count.'
      : 'Unlikely to be force: a cyber operation without effects similar to kinetic force falls short of the ILA 2018 test.';
  return { figure, verdict: why, tone: 'yes' };
}

const KIND: Record<S['kind'], string> = {
  armed: 'Armed force (troops, missiles)', 'cyber-kinetic': 'Cyber operation destroying infrastructure or causing deaths', 'cyber-minor': 'Cyber operation with no physical effects', economic: 'Economic coercion (sanctions, embargo)',
};

function describe(a: S, b: S) {
  if (a.where !== b.where) return b.where === 'internal' ? 'Inside its own territory: art 2(4) covers force “in their international relations” only.' : 'Between states: within “international relations”.';
  if (a.form !== b.form) return b.form === 'threat' ? 'A threat: unlawful if the force threatened would be unlawful, and if specific and credible.' : 'An actual use of force.';
  if (a.credible !== b.credible) return b.credible ? 'Specific and credible: force will be used if certain events occur, and the state has the means.' : 'Vague or frivolous: mere political rhetoric.';
  if (a.threatenedLawful !== b.threatenedLawful) return b.threatenedLawful ? 'The threatened force would be lawful (e.g. self-defence), so the threat is lawful too.' : 'The threatened force would itself be unlawful.';
  if (a.kind !== b.kind) return `${KIND[b.kind]}.`;
  if (a.aim !== b.aim) return b.aim === 'territory' ? 'Aimed at taking territory or changing the government.' : 'Limited and temporary: the restrictive reading of art 2(4) is generally rejected (Corfu Channel, Nicaragua, ILA 2018).';
  if (a.consent !== b.consent) return b.consent ? 'The territorial state’s government consents: no violation at all.' : 'No consent from the territorial state.';
  return '';
}

export default function ProhibitionOnTheUseOfForce() {
  return (
    <Simulation<S>
      label="Art 2(4) of the UN Charter, tested phrase by phrase"
      terms={[
        { term: 'Art 2(4)', def: 'Members shall refrain in their international relations from the threat or use of force against any state.' },
        { term: 'Threat', def: 'A specific, credible declared readiness to use force — unlawful if that force would be unlawful.' },
        { term: 'Jus cogens', def: 'A peremptory norm; the prohibition on force is a leading example.' },
        { term: 'Restrictive reading', def: 'The rejected claim that limited, temporary force is outside art 2(4).' },
      ]}
      initial={initial}
      controls={[
        { key: 'where', label: 'Where is the force used?', type: 'select', options: [{ value: 'international', label: 'Against another state' }, { value: 'internal', label: 'Inside the state’s own territory' }] },
        { key: 'form', label: 'Threat or use?', type: 'select', options: [{ value: 'use', label: 'Actual use of force' }, { value: 'threat', label: 'Threat of force' }] },
        { key: 'credible', label: 'If a threat: specific and credible', type: 'toggle' },
        { key: 'threatenedLawful', label: 'If a threat: the force threatened would be lawful', type: 'toggle' },
        { key: 'kind', label: 'What kind of measure?', type: 'select', options: (Object.keys(KIND) as S['kind'][]).map((k) => ({ value: k, label: KIND[k] })) },
        { key: 'aim', label: 'Its aim', type: 'select', options: [{ value: 'limited', label: 'A limited, temporary operation' }, { value: 'territory', label: 'Taking territory or toppling the government' }] },
        { key: 'consent', label: 'The territorial state’s government consented', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'State A, which has the forces to do it, declares it will seize State B’s border province unless B changes its trade policy. Has A breached art 2(4)?',
        options: [
          { text: 'No — art 2(4) bans only the actual use of force', why: 'Art 2(4) prohibits the “threat or use” of force.' },
          { text: 'Yes — a specific, credible threat of force that would itself be unlawful', correct: true, why: 'Seizing B’s territory would be unlawful force, so the threat to do it is unlawful too (Nuclear Weapons, para 47).' },
          { text: 'No — political statements are never threats under art 2(4)', why: 'Mere rhetoric is not, but a reasonably specific, credible declared readiness to use force is.' },
        ],
      }}
    />
  );
}
