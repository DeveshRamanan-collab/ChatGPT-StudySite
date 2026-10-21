/*
SCENE: Competencies for creativity — individual and team
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → switch competencies on and off → read what the lecture says is lost → one check
INTENT: Sort the eight competencies on slide 15 into their two columns and show, for each one switched off, the
  consequence the lecture gives (e.g. without psychological safety people hold back their ideas).
SUBJECT: the two columns; a missing competency turns to a clay hairline with its consequence beneath.
BEAT 1 (0–100%): eight toggles; each column's count and the verdict update within 200ms. Ease: CSS 180ms ease-out on
  colour only. Starts with psychological safety switched off, so the first view already shows a consequence.
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (no motion beyond colour).
BUDGET: < 6 KB gz, no WebGL.
Source: concept mgmt2094-w01-creative-competencies (Week 1 slide 15; lecture transcript; Lev-Ram 2015 on Disney's
  CTO for each business). The consequences are the lecture's own explanations; the simulation scores nothing.
*/
import { Simulation, type SimView } from '../bases/Simulation';

type Key = 'explore' | 'willpower' | 'aware' | 'failure' | 'support' | 'safety' | 'vision' | 'frontiers';
type S = Record<Key, boolean>;

const initial: S = { explore: true, willpower: true, aware: true, failure: true, support: true, safety: false, vision: true, frontiers: true };

interface Item { key: Key; name: string; side: 'individual' | 'team'; on: string; off: string }

const ITEMS: Item[] = [
  { key: 'explore', side: 'individual', name: 'Exploring problems', on: 'Problems are explored systematically.', off: 'Problems go unexplored; curiosity can be developed by exploring them systematically.' },
  { key: 'willpower', side: 'individual', name: 'Building up willpower', on: 'People keep looking for solutions.', off: 'Without willpower nobody keeps looking for solutions to the problems found.' },
  { key: 'aware', side: 'individual', name: 'Self-awareness', on: 'Strengths leveraged, weaknesses minimised.', off: 'Strengths are not leveraged and weaknesses are not minimised.' },
  { key: 'failure', side: 'individual', name: 'Open to failure and feedback', on: 'Failure is learnt from; feedback is used.', off: 'Failures are not learnt from and feedback goes unused.' },
  { key: 'support', side: 'team', name: 'Supporting ideas from team members', on: "Members champion each other's ideas.", off: "Nobody champions team members' ideas." },
  { key: 'safety', side: 'team', name: 'Practising psychological safety', on: 'Everyone feels safe to take risks.', off: 'People hold back ideas for fear of being seen as stupid or incompetent.' },
  { key: 'vision', side: 'team', name: 'Creating and sharing visions', on: "Members rely on each other's expertise.", off: 'Different expertise is not pooled into a shared vision.' },
  { key: 'frontiers', side: 'team', name: 'Pushing the frontiers', on: 'A supported team pushes the boundaries.', off: 'The team does not push the boundaries: no fuel for innovation.' },
];

function Column({ title, items, s }: { title: string; items: Item[]; s: S }) {
  const n = items.filter((i) => s[i.key]).length;
  return (
    <div style={{ padding: 'var(--s-4)', background: 'var(--paper)', borderRadius: 'var(--r-md)' }}>
      <p className="label" style={{ margin: '0 0 var(--s-3)' }}>{title} · {n} of {items.length}</p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--s-3)' }}>
        {items.map((i) => (
          <li key={i.key} data-on={s[i.key] || undefined}
            style={{ paddingLeft: 'var(--s-3)', borderLeft: `2px solid ${s[i.key] ? 'var(--ink-3)' : 'var(--clay)'}`, transition: 'border-color 180ms var(--ease-out)' }}>
            <span style={{ display: 'block', fontWeight: 600, fontSize: 'var(--t-sm)', color: s[i.key] ? 'var(--ink)' : 'var(--ink-2)' }}>{i.name}</span>
            <span style={{ display: 'block', fontSize: 'var(--t-xs)', lineHeight: 1.4, color: 'var(--ink-2)' }}>{s[i.key] ? i.on : i.off}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function view(s: S): SimView {
  const missing = ITEMS.filter((i) => !s[i.key]);
  const figure = (
    <div className="xgates" role="group" aria-label="Individual and team competencies for creativity">
      <div style={{ display: 'grid', gap: 'var(--s-4)', gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))' }}>
        <Column title="Individual" items={ITEMS.filter((i) => i.side === 'individual')} s={s} />
        <Column title="Team / group" items={ITEMS.filter((i) => i.side === 'team')} s={s} />
      </div>
    </div>
  );
  if (!missing.length)
    return { figure, tone: 'yes', verdict: 'All eight in place. A team that feels supported is empowered to push the frontiers: in the lecture’s words, the fuel for innovation.' };
  const names = missing.map((i) => `${i.name.toLowerCase()} (${i.side})`).join('; ');
  return { figure, tone: 'no', verdict: `Missing: ${names}. ${missing[0].off}` };
}

function describe(a: S, b: S) {
  const changed = ITEMS.find((i) => a[i.key] !== b[i.key]);
  if (!changed) return '';
  const where = changed.side === 'individual' ? 'an individual competency' : 'a team/group competency';
  return b[changed.key] ? `${changed.name} is ${where}: ${changed.on}` : `${changed.name} switched off (${where}): ${changed.off}`;
}

export default function CreativeCompetencies() {
  return (
    <Simulation<S>
      label="The eight competencies for creativity, in individual and team columns"
      terms={[
        { term: 'Individual competency', def: 'What a person brings: exploring problems, willpower, self-awareness, openness to failure and feedback.' },
        { term: 'Team competency', def: 'What a group practises: supporting ideas, psychological safety, shared visions, pushing the frontiers.' },
        { term: 'Psychological safety', def: 'Everyone feels safe, not to relax, but to take risks and share ideas.' },
      ]}
      initial={initial}
      controls={ITEMS.map((i) => ({ key: i.key, label: `${i.name} (${i.side})`, type: 'toggle' as const }))}
      view={view}
      describe={describe}
      check={{
        question: 'In a team, a suggestion is mocked and nobody offers another idea. Which competency is missing?',
        options: [
          { text: 'Building up willpower', why: 'Willpower is an individual competency; the problem here is the group climate after the mockery.' },
          { text: 'Practising psychological safety', correct: true, why: 'People hold back ideas when they fear looking stupid or incompetent; psychological safety lets them take risks.' },
          { text: 'Becoming an expert', why: 'That is the third stage of the creativity gym, not a competency on slide 15.' },
        ],
      }}
    />
  );
}
