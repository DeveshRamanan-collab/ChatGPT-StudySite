/*
SCENE: Recognition and contested statehood
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → change the entity's facts → read the two theories side by side → one check
INTENT: Show that the declaratory and constitutive theories can give different answers on the same facts, and that
  illegality can block statehood under either.
SUBJECT: the two verdict panels; the one whose answer changes is the one the eye follows.
BEAT 1 (0–100%): toggles for Montevideo criteria and lawful creation, a select for recognitions; each panel's hairline
  turns sage (state) or clay (not a state) within 200ms. Ease: CSS 180ms ease-out on colour only.
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (no motion beyond colour).
BUDGET: < 6 KB gz, no WebGL.
Source: concept card laws2000-w04-recognition-of-states (Friendly Relations Declaration 1970; Kosovo Advisory Opinion
  2010; UNSC resolutions 541 and 550 on the TRNC; UN admission).
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  criteria: boolean;
  lawful: boolean;
  recognitions: 'none' | 'one' | 'many';
  un: boolean;
}

const initial: S = { criteria: true, lawful: true, recognitions: 'none', un: false };

type Out = { tone: 'yes' | 'no' | 'open'; head: string; body: string };

function declaratory(s: S): Out {
  if (!s.criteria) return { tone: 'no', head: 'Not a state', body: 'Statehood is a question of fact: without the Montevideo criteria, recognition has nothing to acknowledge.' };
  if (!s.lawful) return { tone: 'no', head: 'Blocked by illegality', body: 'Criteria met, but achieved unlawfully: non-recognition may prevent statehood (Friendly Relations; Kosovo AO).' };
  return { tone: 'yes', head: 'A state', body: s.recognitions === 'none' && !s.un ? 'Criteria met lawfully: it is a state already. Recognition, when it comes, is only symbolic.' : 'Recognition acknowledges a statehood that already existed; it adds nothing legally.' };
}

function constitutive(s: S): Out {
  const recognised = s.recognitions !== 'none' || s.un;
  if (!s.lawful) return { tone: 'no', head: 'Blocked by illegality', body: 'Non-recognition may prevent statehood where the criteria were achieved illegally — and here recognition is what creates the state (cf TRNC: SC res 541 and 550 called its declaration legally invalid).' };
  if (!recognised) return { tone: 'no', head: 'Not a state', body: 'No recognition, no existence — whatever the facts on the ground.' };
  if (s.un) return { tone: 'yes', head: 'A state', body: 'Collective recognition by UN admission (Security Council recommendation, two-thirds of the General Assembly) confers personality.' };
  if (s.recognitions === 'one') return { tone: 'open', head: 'Contested', body: 'Recognised by a single state — like the TRNC, recognised only by Turkey.' };
  return { tone: 'open', head: 'Contested', body: 'Widely but not universally recognised — like Kosovo (100+) or Palestine (150+). Its statehood remains contested.' };
}

const panel = (title: string, o: Out) => (
  <div style={{ padding: 'var(--s-4)', background: 'var(--paper)', borderRadius: 'var(--r-md)', borderLeft: `3px solid ${o.tone === 'yes' ? 'var(--sage)' : o.tone === 'no' ? 'var(--clay)' : 'var(--ink-3)'}`, transition: 'border-color 180ms var(--ease-out)' }}>
    <p className="label" style={{ margin: 0 }}>{title}</p>
    <p style={{ margin: 'var(--s-2) 0 var(--s-1)', fontWeight: 600, fontSize: 'var(--t-lg)', color: 'var(--ink)' }}>{o.head}</p>
    <p style={{ margin: 0, fontSize: 'var(--t-sm)', lineHeight: 1.4, color: 'var(--ink-2)' }}>{o.body}</p>
  </div>
);

function view(s: S): SimView {
  const d = declaratory(s), c = constitutive(s);
  const figure = (
    <div className="xgates" role="group" aria-label="The declaratory and constitutive theories side by side">
      <div style={{ display: 'grid', gap: 'var(--s-4)', gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))' }}>
        {panel('Declaratory theory', d)}
        {panel('Constitutive theory', c)}
      </div>
    </div>
  );
  const same = d.head === c.head;
  const verdict = same
    ? `Both theories agree: ${d.head.toLowerCase()}.`
    : `The theories part ways: declaratory says “${d.head.toLowerCase()}”, constitutive says “${c.head.toLowerCase()}”.`;
  return { figure, verdict, tone: same ? d.tone : 'open' };
}

function describe(a: S, b: S) {
  if (a.criteria !== b.criteria) return b.criteria ? 'Montevideo criteria met: the declaratory theory now sees a state.' : 'Criteria not met: the declaratory theory has no state to acknowledge; the constitutive theory looks only at recognition.';
  if (a.lawful !== b.lawful) return b.lawful ? 'Achieved lawfully: illegality no longer blocks recognition.' : 'Achieved by unlawful force or another egregious violation: non-recognition may prevent statehood.';
  if (a.recognitions !== b.recognitions) return b.recognitions === 'none' ? 'No recognitions: fatal under the constitutive theory, irrelevant under the declaratory.' : b.recognitions === 'one' ? 'Recognised by one state only — the TRNC pattern.' : 'Recognised by many states, but not all — the Kosovo and Palestine pattern.';
  if (a.un !== b.un) return b.un ? 'Admitted to the UN: collective recognition through an international organisation.' : 'Not a UN member: no collective recognition.';
  return '';
}

export default function RecognitionOfStates() {
  return (
    <Simulation<S>
      label="The declaratory and constitutive theories of recognition applied to the same entity"
      terms={[
        { term: 'Recognition', def: 'A state’s official acknowledgement that another state or government exists.' },
        { term: 'Declaratory theory', def: 'Recognition only acknowledges pre-existing statehood; it is symbolic. The majority view.' },
        { term: 'Constitutive theory', def: 'Recognition creates the state and its legal personality: no recognition, no existence.' },
        { term: 'Collective recognition', def: 'Recognition through an international organisation, such as UN admission.' },
      ]}
      initial={initial}
      controls={[
        { key: 'criteria', label: 'Montevideo criteria met', type: 'toggle' },
        { key: 'lawful', label: 'Achieved without unlawful force or other egregious violations', type: 'toggle' },
        { key: 'recognitions', label: 'Recognised by', type: 'select', options: [{ value: 'none', label: 'No state' }, { value: 'one', label: 'One state' }, { value: 'many', label: 'Many states, not all' }] },
        { key: 'un', label: 'Admitted to the UN', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'An entity lawfully meets every Montevideo criterion, but no state recognises it. Under the declaratory theory it is:',
        options: [
          { text: 'Not a state until at least one state recognises it', why: 'That is the constitutive theory: no recognition, no existence.' },
          { text: 'A state; recognition would only acknowledge it', correct: true, why: 'On the declaratory theory statehood pre-exists recognition, which is symbolic.' },
          { text: 'A state only once admitted to the UN', why: 'UN admission is collective recognition, not a condition of statehood on the declaratory view.' },
        ],
      }}
    />
  );
}
