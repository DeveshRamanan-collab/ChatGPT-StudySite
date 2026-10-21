/*
SCENE: Chapter VII as four gates in order — art 39 determination, art 40 provisional measures, art 41, art 42
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → change the facts → watch each gate light as passed, optional, not reached or blocked → one check
INTENT: Show that nothing in Chapter VII opens without the Council's art 39 determination; that art 40 measures are
  optional and without prejudice; and that force (art 42) is reached only when the Council considers art 41
  measures would be or have proved inadequate — with the P-5 veto able to stop the whole path.
SUBJECT: the four gate cards; the first card that is not passed decides the verdict.
BEAT 1 (0–100%): selects and toggles re-light the cards (sage passed · dashed optional or not reached · clay
  blocked); the verdict updates within 200ms. Ease: CSS 180ms ease-out on border colour only — no movement.
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (colour only); off mode shows the same controls.
BUDGET: < 8 KB gz, no WebGL.
Source: concept laws2000-w10-article-39-determination-and-provisional-measures; Week 10 slides 15–18, 24, 44; UN
  Charter arts 39–42, 27(3). The simulation does NOT decide whether a situation is a threat to the peace: that is
  the Council's own determination, so the learner records it as a toggle; the situation select only shows what
  practice has treated as within art 39.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  situation: 'interstate' | 'internal' | 'proliferation' | 'epidemic' | 'dispute';
  veto: boolean;
  determined: boolean;
  provisional: 'none' | 'complied' | 'ignored';
  art41: 'not-yet' | 'adequate' | 'would' | 'proved';
}

const initial: S = { situation: 'internal', veto: false, determined: false, provisional: 'none', art41: 'not-yet' };

const SITUATION: Record<S['situation'], { label: string; note: string }> = {
  interstate: { label: 'One state invades another', note: 'a classic breach of the peace or act of aggression' },
  internal: { label: 'Civil war with serious human rights and IHL violations', note: 'practice treats internal armed conflicts and serious violations as threats' },
  proliferation: { label: 'A state develops nuclear weapons', note: 'practice treats proliferation of nuclear, chemical or biological weapons as a threat' },
  epidemic: { label: 'A fast-spreading epidemic (cf. Ebola 2014)', note: 'the slides list the 2014 Ebola outbreak in Africa' },
  dispute: { label: 'A border dispute, no fighting yet', note: 'a dispute likely to endanger peace is Chapter VI’s threshold (art 33)' },
};

type Status = 'passed' | 'optional' | 'blocked' | 'idle' | 'open';
type Gate = { key: string; art: string; text: string; status: Status; note: string };

function gates(s: S): Gate[] {
  const open39 = s.determined && !s.veto;
  const g39: Gate = s.veto
    ? { key: 'g39', art: 'art 39', text: 'Determine a threat to the peace, breach of the peace or act of aggression', status: 'blocked', note: 'a permanent member’s veto (art 27(3)) stops the decision' }
    : s.determined
      ? { key: 'g39', art: 'art 39', text: 'Determine a threat to the peace, breach of the peace or act of aggression', status: 'passed', note: `determined — ${SITUATION[s.situation].note}` }
      : { key: 'g39', art: 'art 39', text: 'Determine a threat to the peace, breach of the peace or act of aggression', status: 'blocked', note: 'no determination yet: Chapter VII stays closed' };
  const g40: Gate = !open39
    ? { key: 'g40', art: 'art 40', text: 'Provisional measures to prevent an aggravation', status: 'idle', note: 'not reached' }
    : s.provisional === 'none'
      ? { key: 'g40', art: 'art 40', text: 'Provisional measures to prevent an aggravation', status: 'optional', note: 'optional — none called for' }
      : s.provisional === 'complied'
        ? { key: 'g40', art: 'art 40', text: 'Provisional measures to prevent an aggravation', status: 'passed', note: 'complied with — without prejudice to the parties’ claims' }
        : { key: 'g40', art: 'art 40', text: 'Provisional measures to prevent an aggravation', status: 'passed', note: 'ignored — the Council “shall duly take account” of the failure' };
  const g41: Gate = !open39
    ? { key: 'g41', art: 'art 41', text: 'Measures not involving the use of armed force', status: 'idle', note: 'not reached' }
    : s.art41 === 'not-yet'
      ? { key: 'g41', art: 'art 41', text: 'Measures not involving the use of armed force', status: 'open', note: 'available — sanctions, embargoes, tribunals, ICC referral' }
      : { key: 'g41', art: 'art 41', text: 'Measures not involving the use of armed force', status: 'passed', note: s.art41 === 'would' ? 'judged in advance to be inadequate' : s.art41 === 'proved' ? 'imposed, and proved inadequate' : 'imposed and judged adequate' };
  const forceOpen = open39 && (s.art41 === 'would' || s.art41 === 'proved');
  const g42: Gate = forceOpen
    ? { key: 'g42', art: 'art 42', text: 'Action by air, sea or land forces', status: 'passed', note: 'open — a last resort, delivered by member states' }
    : { key: 'g42', art: 'art 42', text: 'Action by air, sea or land forces', status: open39 && s.art41 === 'adequate' ? 'blocked' : 'idle', note: open39 && s.art41 === 'adequate' ? 'closed while art 41 measures are adequate' : 'not reached' };
  return [g39, g40, g41, g42];
}

const BORDER: Record<Status, string> = { passed: 'var(--sage)', blocked: 'var(--clay)', optional: 'var(--ink-3)', open: 'var(--ink-3)', idle: 'var(--line)' };
const WORD: Record<Status, string> = { passed: 'passed', blocked: 'blocked', optional: 'optional', open: 'available', idle: '—' };

function view(s: S): SimView {
  const gs = gates(s);
  const figure = (
    <div className="xgates" role="group" aria-label={`Chapter VII in order: ${gs.map((g) => `${g.art} ${WORD[g.status]}`).join('; ')}`}>
      <p className="label" style={{ margin: '0 0 var(--s-2)' }}>Situation: {SITUATION[s.situation].label}</p>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--s-2)' }}>
        {gs.map((g) => (
          <li key={g.key} data-gate={g.key} data-state={g.status} style={{ padding: 'var(--s-2) var(--s-3)', borderRadius: 'var(--r-md)', background: 'var(--paper)', border: `1.5px ${g.status === 'passed' || g.status === 'blocked' ? 'solid' : 'dashed'} ${BORDER[g.status]}`, transition: 'border-color 180ms var(--ease-out)' }}>
            <span className="mono" style={{ display: 'block', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>{g.art}</span>
            <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--t-sm)', color: g.status === 'idle' ? 'var(--ink-3)' : 'var(--ink)' }}>{g.text}</span>
            <span className="mono" style={{ display: 'block', marginTop: '2px', fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}>{WORD[g.status]} · {g.note}</span>
          </li>
        ))}
      </ol>
    </div>
  );
  if (s.veto)
    return { figure, verdict: 'Blocked: a P-5 veto stops the Council acting. The General Assembly may then only recommend (Uniting for Peace).', tone: 'no' };
  if (!s.determined)
    return {
      figure,
      verdict: s.situation === 'dispute'
        ? 'Chapter VI only: without an art 39 determination the Council can investigate (art 34), call on the parties (art 33(2)) and recommend (art 36).'
        : 'Chapter VII is closed until the Council determines a threat to the peace, breach of the peace or act of aggression (art 39).',
      tone: 'open',
    };
  if (s.art41 === 'not-yet')
    return { figure, verdict: 'Art 39 met: the Council may now recommend, or decide measures under art 41 — and art 42 if it considers art 41 measures would be inadequate.', tone: 'yes' };
  if (s.art41 === 'adequate')
    return { figure, verdict: 'Art 41 measures in place and adequate: force under art 42 is not available — it is a last resort.', tone: 'yes' };
  return {
    figure,
    verdict: `Art 42 open: art 41 measures ${s.art41 === 'would' ? '“would be inadequate”' : '“have proved to be inadequate”'}, so the Council may authorise force — carried out by member states, as art 43 was never implemented.`,
    tone: 'yes',
  };
}

function describe(a: S, b: S) {
  if (a.situation !== b.situation) return `${SITUATION[b.situation].label}: ${SITUATION[b.situation].note}.`;
  if (a.veto !== b.veto) return b.veto ? 'A permanent member votes against: the veto (art 27(3)) stops any decision.' : 'No veto: the Council can decide.';
  if (a.determined !== b.determined) return b.determined ? 'The Council determines a threat to the peace, breach of the peace or act of aggression: Chapter VII opens.' : 'No art 39 determination: no Chapter VII measures.';
  if (a.provisional !== b.provisional)
    return b.provisional === 'none' ? 'No provisional measures: art 40 is optional.' : b.provisional === 'complied' ? 'The parties comply with the provisional measures; their rights and claims are untouched.' : 'A party ignores the provisional measures: the Council takes that into account — nothing follows automatically.';
  if (a.art41 !== b.art41)
    return b.art41 === 'not-yet' ? 'No measures decided yet.' : b.art41 === 'adequate' ? 'Art 41 measures are judged adequate: no need for force.' : b.art41 === 'would' ? 'The Council considers art 41 measures would be inadequate — it need not try them first.' : 'Art 41 measures were tried and proved inadequate.';
  return '';
}

export default function Article39DeterminationAndProvisionalMeasures() {
  return (
    <Simulation<S>
      label="Chapter VII in order: art 39 determination, art 40 provisional measures, art 41, then art 42"
      terms={[
        { term: 'Art 39 determination', def: 'The Council’s finding of a threat to the peace, breach of the peace or act of aggression — the step that opens Chapter VII.' },
        { term: 'Provisional measures', def: 'Art 40 steps to prevent an aggravation, without prejudice to the parties’ rights, claims or position.' },
        { term: 'Art 41 / art 42', def: 'Measures without armed force; then action by air, sea or land forces if art 41 would be or has proved inadequate.' },
        { term: 'Veto', def: 'A permanent member’s power to stop a decision (art 27(3)).' },
      ]}
      initial={initial}
      controls={[
        { key: 'situation', label: 'The situation', type: 'select', options: (Object.keys(SITUATION) as S['situation'][]).map((k) => ({ value: k, label: SITUATION[k].label })) },
        { key: 'veto', label: 'A permanent member vetoes the draft resolution', type: 'toggle' },
        { key: 'determined', label: 'The Council determines a threat to the peace, breach or aggression (art 39)', type: 'toggle' },
        { key: 'provisional', label: 'Provisional measures (art 40)', type: 'select', options: [{ value: 'none', label: 'None called for' }, { value: 'complied', label: 'Called for and complied with' }, { value: 'ignored', label: 'Called for and ignored' }] },
        { key: 'art41', label: 'Measures without armed force (art 41)', type: 'select', options: [{ value: 'not-yet', label: 'Not yet decided' }, { value: 'adequate', label: 'Imposed and adequate' }, { value: 'would', label: 'Council considers they would be inadequate' }, { value: 'proved', label: 'Imposed and proved inadequate' }] },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Must the Council have tried sanctions before it can authorise force under art 42?',
        options: [
          { text: 'Yes — art 42 applies only after art 41 measures have failed', why: 'Too strict: art 42 also applies where the Council considers art 41 measures “would be inadequate”.' },
          { text: 'No — it is enough that the Council considers art 41 measures would be inadequate', correct: true, why: 'Art 42 covers measures that “would be inadequate or have proved to be inadequate”; force remains a last resort.' },
          { text: 'No — art 42 needs no link to art 41 at all', why: 'Art 42 is expressly conditioned on art 41 measures being inadequate, actually or prospectively.' },
        ],
      }}
    />
  );
}
