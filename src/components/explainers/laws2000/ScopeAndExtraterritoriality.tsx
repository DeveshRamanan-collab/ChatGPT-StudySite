/*
SCENE: Scope of human rights obligations — territory, jurisdiction and extraterritoriality
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → set where it happens, the state's link to the place, the victim's status and other actors → watch which
  wires reach the lamp → one check
INTENT: Show that ICCPR obligations follow territory or jurisdiction (art 2(1)), reach occupied territory abroad (Wall,
  DRC v Uganda), may sometimes apply even without effective control (Lopez Burgos), and never turn on nationality.
SUBJECT: the lamp "Covenant obligations apply" and the three wires into it; the nationality wire is drawn cut.
BEAT 1 (0–100%): selects relight the wires; the lamp's border turns sage (applies), ink (possibly) or clay (not shown);
  verdict within 200ms. Ease: CSS 180ms ease-out on colour only.
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (no motion beyond colour).
BUDGET: < 6 KB gz, no WebGL.
Source: concept laws2000-w12-scope-and-extraterritoriality; authority iccpr-art-2-1; cases
  construction-of-a-wall-advisory-opinion (para 109), armed-activities-on-the-territory-of-the-congo-… (paras 179, 216),
  sergio-euben-lopez-burgos-v-uruguay (para 12.3, cited on the slides for the proposition only). The simulation does
  not decide when jurisdiction exists without occupation: the slides say only "even sometimes", so that setting reads
  "possibly".
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  place: 'inside' | 'outside';
  link: 'occupation' | 'agents' | 'none';
  victim: 'national' | 'foreign' | 'undocumented';
  others: boolean;
}

const initial: S = { place: 'outside', link: 'occupation', victim: 'foreign', others: false };

const PLACE: Record<S['place'], string> = { inside: 'Inside its own territory', outside: 'Outside its territory' };
const LINK: Record<S['link'], string> = {
  occupation: 'Occupies the area',
  agents: 'Acts there through its agents, without effective control',
  none: 'Exercises no jurisdiction there',
};
const VICTIM: Record<S['victim'], string> = { national: 'A national', foreign: 'A foreign national', undocumented: 'Without legal status' };

type Out = { tone: SimView['tone']; verdict: string; extra?: string };

function decide(s: S): Out {
  if (s.place === 'inside')
    return {
      tone: 'yes',
      verdict: 'Applies: the person is within the state’s territory (ICCPR art 2(1)) — irrespective of nationality or legal status.',
      extra: s.others ? 'Abuses by other actors: the state must protect people in its territory from private violations (its horizontal obligation).' : undefined,
    };
  if (s.link === 'occupation')
    return {
      tone: 'yes',
      verdict: 'Applies abroad: an occupying state exercises jurisdiction outside its territory, and the drafters did not let states escape their obligations there (Wall, para 109; DRC v Uganda, para 216).',
      extra: s.others ? 'As occupying Power it must also show vigilance in preventing violations by other actors, including rebel groups acting on their own account (DRC v Uganda, para 179).' : undefined,
    };
  if (s.link === 'agents')
    return {
      tone: 'open',
      verdict: 'Possibly: the slides cite Lopez Burgos v Uruguay (para 12.3) for obligations applying “even sometimes when the state has no effective control”. Argue it from the facts.',
      extra: s.others ? 'The vigilance duty over other actors in DRC v Uganda was stated for an occupying Power; the slides go no further.' : undefined,
    };
  return {
    tone: 'no',
    verdict: 'Not shown: the person is neither within the state’s territory nor subject to its jurisdiction, which art 2(1) requires.',
  };
}

const wire = (label: string, value: string, state: 'live' | 'cut' | 'idle') => (
  <li key={label} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 40px', gap: 'var(--s-2)', alignItems: 'center' }}>
    <span style={{ minWidth: 0, padding: 'var(--s-2) var(--s-3)', background: 'var(--paper)', borderRadius: 'var(--r-sm)', border: `1.5px ${state === 'cut' ? 'dashed' : 'solid'} ${state === 'live' ? 'var(--ink)' : 'var(--ink-3)'}` }}>
      <span className="label" style={{ display: 'block' }}>{label}</span>
      <span style={{ display: 'block', fontSize: 'var(--t-sm)', color: state === 'cut' ? 'var(--ink-2)' : 'var(--ink)', overflowWrap: 'anywhere' }}>{value}</span>
    </span>
    <span aria-hidden="true" style={{ height: '3px', background: state === 'live' ? 'var(--ink)' : 'transparent', borderTop: state === 'live' ? 'none' : '2px dashed var(--ink-3)', transition: 'background-color 180ms var(--ease-out)' }} />
  </li>
);

function view(s: S): SimView {
  const o = decide(s);
  const placeLive = s.place === 'inside' || s.link !== 'none';
  const lampBorder = o.tone === 'yes' ? 'var(--sage)' : o.tone === 'no' ? 'var(--clay)' : 'var(--ink)';
  const figure = (
    <div className="xgates" role="group" aria-label={`Scope: ${PLACE[s.place]}; ${s.place === 'outside' ? LINK[s.link] : 'territorial'}; victim ${VICTIM[s.victim]} — ${o.tone === 'yes' ? 'obligations apply' : o.tone === 'open' ? 'obligations possibly apply' : 'not shown to apply'}`}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: 0, alignItems: 'center' }}>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--s-3)' }}>
          {wire('Where', PLACE[s.place], 'live')}
          {wire('State’s link to the place', s.place === 'inside' ? 'Its own territory' : LINK[s.link], placeLive ? 'live' : 'cut')}
          {wire('Victim', `${VICTIM[s.victim]} — wired to nothing`, 'cut')}
        </ol>
        <div style={{ padding: 'var(--s-3)', borderRadius: 'var(--r-md)', background: 'var(--paper)', border: `2px solid ${lampBorder}`, textAlign: 'center', transition: 'border-color 180ms var(--ease-out)' }}>
          <span className="label" style={{ display: 'block' }}>ICCPR obligations</span>
          <span className="mono" style={{ display: 'block', marginTop: 'var(--s-1)', fontSize: 'var(--t-sm)' }}>{o.tone === 'yes' ? 'apply' : o.tone === 'open' ? 'possibly' : 'not shown'}</span>
        </div>
      </div>
      {o.extra && <p className="xgates__circ" style={{ margin: 'var(--s-4) 0 0', color: 'var(--ink-2)' }}>{o.extra}</p>}
    </div>
  );
  return { figure, verdict: o.verdict, tone: o.tone };
}

function describe(a: S, b: S) {
  if (a.place !== b.place) return b.place === 'inside' ? 'Inside the territory: art 2(1) covers everyone there.' : 'Outside the territory: now it depends on whether the state exercises jurisdiction there.';
  if (a.link !== b.link) {
    if (b.place === 'inside') return 'The link setting matters only for conduct abroad — inside the territory, art 2(1) already applies.';
    return b.link === 'occupation' ? 'Occupation: jurisdiction exercised abroad (Wall; DRC v Uganda).' : b.link === 'agents' ? 'Agents abroad without effective control: the slides cite Lopez Burgos for “even sometimes”.' : 'No jurisdiction there: the chain to the lamp is cut.';
  }
  if (a.victim !== b.victim) return 'Nationality and legal status change nothing: art 2(1) protects people irrespective of them.';
  if (a.others !== b.others) return b.others ? 'Another actor commits abuses: see what the state owes about them.' : 'No other actors involved.';
  return '';
}

export default function ScopeAndExtraterritoriality() {
  return (
    <Simulation<S>
      label="When do a state's ICCPR obligations apply: territory, jurisdiction abroad, and the victim's status"
      terms={[
        { term: 'Art 2(1) ICCPR', def: 'States respect the rights of people within their territory and those subject to their jurisdiction.' },
        { term: 'Jurisdiction', def: 'Primarily territorial, but it may sometimes be exercised outside the national territory (Wall, para 109).' },
        { term: 'Occupying Power', def: 'A state holding foreign territory — as Uganda did in Ituri — and so exercising jurisdiction there.' },
      ]}
      initial={initial}
      controls={[
        { key: 'place', label: 'Where the conduct happens', type: 'select', options: (Object.keys(PLACE) as S['place'][]).map((k) => ({ value: k, label: PLACE[k] })) },
        { key: 'link', label: 'If abroad, the state…', type: 'select', options: (Object.keys(LINK) as S['link'][]).map((k) => ({ value: k, label: LINK[k] })) },
        { key: 'victim', label: 'The victim is', type: 'select', options: (Object.keys(VICTIM) as S['victim'][]).map((k) => ({ value: k, label: VICTIM[k] })) },
        { key: 'others', label: 'Another actor (e.g. a rebel group acting on its own account) also commits abuses', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'State A’s soldiers detain civilians without trial in a district of State B that A occupies. A says the ICCPR stops at its border. Is A right?',
        options: [
          { text: 'Yes — jurisdiction is territorial, so the ICCPR stops at the border', why: 'Jurisdiction is primarily, not only, territorial; the Wall opinion holds states stay bound when they exercise it abroad.' },
          { text: 'No — as occupier A exercises jurisdiction there, so the ICCPR applies', correct: true, why: 'Wall (para 109) and DRC v Uganda (para 216): human rights instruments apply to jurisdiction exercised abroad, particularly in occupied territory.' },
          { text: 'Only for any detainees who are A’s own nationals', why: 'Protection applies irrespective of nationality; the test is territory or jurisdiction, not the victim’s passport.' },
        ],
      }}
    />
  );
}
