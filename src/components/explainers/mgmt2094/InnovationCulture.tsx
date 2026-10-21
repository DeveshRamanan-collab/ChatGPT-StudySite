/*
SCENE: Innovation culture — commitment or resistance
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → set what you observe in the workplace → watch the five characteristics light or go dark → one check
INTENT: An innovation culture shows five characteristics; the slides give observable signs for three of them
  (commitment, experimenting proactively, producing and cultivating innovators) and the learner reads the culture
  from those signs, without inventing signs the slides do not give for managing risk or implementing quickly.
SUBJECT: the column of five characteristics; each row's left rule turns sage (shown), clay (missing) or stays a
  dashed hairline (the slides give no sign for it here).
BEAT 1 (0–100%): toggles and one select for the behaviours on slides 3–5; rows and the verdict update within 200ms.
  Ease: CSS 180ms --ease-out on border colour only.
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (no motion beyond colour); off mode shows the same controls and view.
BUDGET: < 6 KB gz, no WebGL.
Source: concept mgmt2094-w12-innovation-culture (Week 12 slides 2–5); authorities
  mgmt2094-example-guest-shelley-simpson, mgmt2094-example-gilbert-tobin-legalvision.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  followThrough: boolean;
  engaged: boolean;
  talk: 'challenge' | 'aint-broke' | 'always' | 'customers';
  ideasHeard: boolean;
  spaceToTest: boolean;
  rewarded: boolean;
  failurePunished: boolean;
  topDown: boolean;
}

const initial: S = { followThrough: false, engaged: false, talk: 'always', ideasHeard: false, spaceToTest: false, rewarded: false, failurePunished: true, topDown: true };

const QUOTES: Record<S['talk'], string> = {
  challenge: '"Let\'s challenge the status quo and try something new."',
  'aint-broke': '"If it ain\'t broke, don\'t fix it."',
  always: '"We\'ve always done it this way."',
  customers: '"Customers like it this way."',
};

type State = 'shown' | 'missing' | 'partial' | 'unseen';
interface Row { n: number; name: string; state: State; note: string }

function rows(s: S): Row[] {
  const commit: State = s.followThrough && s.engaged ? 'shown' : !s.followThrough && !s.engaged ? 'missing' : 'partial';
  const experiments: State = s.talk === 'challenge' ? 'shown' : 'missing';
  const good = [s.ideasHeard, s.spaceToTest, s.rewarded].filter(Boolean).length;
  const bad = [s.failurePunished, s.topDown, !s.ideasHeard].filter(Boolean).length;
  const cultivates: State = good === 3 && !s.failurePunished && !s.topDown ? 'shown' : good === 0 && bad >= 2 ? 'missing' : 'partial';
  const resist = [!s.followThrough && 'lack of follow-through', !s.engaged && 'lack of engagement'].filter(Boolean).join(' and ');
  const doesnt = [s.failurePunished && 'failure is discouraged or punished', !s.ideasHeard && 'employees are reluctant to bring up ideas', s.topDown && 'innovation is top-down'].filter(Boolean).join('; ');
  return [
    { n: 1, name: 'Organisation-wide commitment to the business and to innovation', state: commit, note: commit === 'shown' ? 'People care about work, co-workers and company: a sustained organisation, an improved workplace.' : `Resistance: ${resist}.` },
    { n: 2, name: 'Experiments proactively', state: experiments, note: s.talk === 'challenge' ? 'Challenges the status quo, thinks outside the box, takes risks and tries new things.' : `${QUOTES[s.talk]} is a sign of a company that doesn't experiment.` },
    { n: 3, name: 'Manages risk', state: 'unseen', note: 'The slides give no workplace sign for this one: judge it from the scenario.' },
    { n: 4, name: 'Can implement ideas quickly', state: 'unseen', note: 'No sign for this on slides 3 to 5: look for speed in the scenario itself.' },
    { n: 5, name: 'Produces and cultivates innovators', state: cultivates, note: cultivates === 'shown' ? 'Ideas are heard, innovators have space to develop and test, innovation is rewarded.' : doesnt ? `A culture that doesn't produce innovators: ${doesnt}.` : `${good} of the three signs of cultivating innovators are present.` },
  ];
}

const RULE: Record<State, string> = { shown: 'var(--sage)', missing: 'var(--clay)', partial: 'var(--ink-3)', unseen: 'var(--line)' };
const MARK: Record<State, string> = { shown: 'shown', missing: 'missing', partial: 'partly', unseen: 'no sign given' };

function view(s: S): SimView {
  const rs = rows(s);
  const figure = (
    <div role="group" aria-label="The five characteristics of an innovation culture and whether the workplace shows them" style={{ fontFamily: 'var(--font-ui)' }}>
      <p className="label" style={{ margin: '0 0 var(--s-3)' }}>Innovation ∩ culture → innovation culture</p>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--s-2)' }}>
        {rs.map((r) => (
          <li key={r.n} data-row={r.n} data-state={r.state} style={{ padding: 'var(--s-2) var(--s-3)', background: 'var(--paper)', borderRadius: 'var(--r-sm)', borderLeft: `3px ${r.state === 'unseen' ? 'dashed' : 'solid'} ${RULE[r.state]}`, transition: 'border-color 180ms var(--ease-out)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--s-3)', alignItems: 'baseline' }}>
              <span style={{ fontSize: 'var(--t-sm)', color: 'var(--ink)', fontWeight: 600 }}><span className="mono" style={{ color: 'var(--ink-2)', fontWeight: 400 }}>{r.n} </span>{r.name}</span>
              <span style={{ fontSize: 'var(--t-xs)', color: 'var(--ink-2)', whiteSpace: 'nowrap' }}>{MARK[r.state]}</span>
            </div>
            <p style={{ margin: 'var(--s-1) 0 0', fontSize: 'var(--t-xs)', lineHeight: 1.4, color: 'var(--ink-2)' }}>{r.note}</p>
          </li>
        ))}
      </ol>
    </div>
  );
  const [commit, exp, , , cult] = rs.map((r) => r.state);
  const shownCount = [commit, exp, cult].filter((x) => x === 'shown').length;
  const verdict = commit === 'missing'
    ? 'Resistance to innovation: lack of follow-through and lack of engagement. The other signs cannot rescue a culture nobody is committed to.'
    : shownCount === 3
      ? 'Commitment: all three observable characteristics are shown. Managing risk and implementing quickly still need evidence of their own.'
      : `Mixed: ${shownCount} of the three observable characteristics are shown. Name the missing one and the sign that gives it away.`;
  return { figure, verdict, tone: commit === 'missing' ? 'no' : shownCount === 3 ? 'yes' : 'open' };
}

function describe(a: S, b: S) {
  if (a.followThrough !== b.followThrough) return b.followThrough ? 'Ideas are followed through: one sign of resistance goes.' : 'Ideas stall after the meeting: lack of follow-through, a sign of resistance.';
  if (a.engaged !== b.engaged) return b.engaged ? 'People care about their work, co-workers and company: commitment to innovation.' : 'People disengage: lack of engagement, a sign of resistance.';
  if (a.talk !== b.talk) return b.talk === 'challenge' ? 'Challenging the status quo is what companies that experiment proactively do.' : `${QUOTES[b.talk]} is one of the three remarks the slide gives for companies that don't experiment.`;
  if (a.ideasHeard !== b.ideasHeard) return b.ideasHeard ? 'Managers allow ideas to be heard: a sign of a culture that cultivates innovators.' : 'Ideas go unheard, so employees grow reluctant to bring them up.';
  if (a.spaceToTest !== b.spaceToTest) return b.spaceToTest ? 'Innovators get space to develop and test.' : 'No space to develop and test: innovators have nowhere to work.';
  if (a.rewarded !== b.rewarded) return b.rewarded ? 'Innovation is rewarded, as in Shelley Simpson\'s "lean in" expectation.' : 'Innovation goes unrewarded.';
  if (a.failurePunished !== b.failurePunished) return b.failurePunished ? 'Failure is discouraged or punished: a sign of a culture that doesn\'t produce innovators.' : 'Failure is tolerated: the conclusion asks for room for failure.';
  if (a.topDown !== b.topDown) return b.topDown ? 'Innovation is top-down: a sign of a culture that doesn\'t produce innovators.' : 'Innovation can start anywhere, not only at the top.';
  return '';
}

export default function InnovationCulture() {
  return (
    <Simulation<S>
      label="Reading a workplace against the five characteristics of an innovation culture"
      terms={[
        { term: 'Innovation culture', def: 'Where innovation and culture overlap; the slides give it five characteristics.' },
        { term: 'Commitment to innovation', def: 'People care about work, co-workers and company: a sustained organisation and an improved workplace.' },
        { term: 'Resistance to innovation', def: 'Lack of follow-through and lack of engagement.' },
        { term: 'Experimenting proactively', def: 'Challenging the status quo, thinking outside the box, taking risks and trying new things.' },
      ]}
      initial={initial}
      controls={[
        { key: 'followThrough', label: 'Ideas raised in meetings are followed through', type: 'toggle' },
        { key: 'engaged', label: 'People care about their work, co-workers and company', type: 'toggle' },
        { key: 'talk', label: 'What people say about change', type: 'select', options: [
          { value: 'challenge', label: 'Let\'s challenge the status quo' },
          { value: 'aint-broke', label: 'If it ain\'t broke, don\'t fix it' },
          { value: 'always', label: 'We\'ve always done it this way' },
          { value: 'customers', label: 'Customers like it this way' },
        ] },
        { key: 'ideasHeard', label: 'Managers allow ideas to be heard', type: 'toggle' },
        { key: 'spaceToTest', label: 'Innovators have space to develop and test', type: 'toggle' },
        { key: 'rewarded', label: 'Innovation is rewarded', type: 'toggle' },
        { key: 'failurePunished', label: 'Failure is discouraged or punished', type: 'toggle' },
        { key: 'topDown', label: 'Innovation is top-down', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'A manager answers every suggestion with "We\'ve always done it this way". Which characteristic of an innovation culture is missing?',
        options: [
          { text: 'Experimenting proactively', correct: true, why: 'The remark is one of the three the slide gives for companies that don\'t experiment proactively.' },
          { text: 'Managing risk', why: 'Refusing change can look cautious, but managing risk sits beside experimenting; the remark is a sign of not experimenting.' },
          { text: 'Implementing ideas quickly', why: 'Nothing is being implemented slowly here: no idea is tried at all, which is a failure to experiment.' },
        ],
      }}
    />
  );
}
