/*
SCENE: Professionals — s 5O as a defence applied before s 5B (Peterkin v Tadros)
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → is s 5O pleaded? → the three s 5O gates (profession; widely accepted peer opinion; not irrational) →
  either "s 5O supplants s 5B: no breach" or the fall-through to ss 5B and 5C → one check
INTENT: Show the order for a professional defendant: s 5O is a defence with the onus on the defendant; if pleaded it is
  applied first; if made out it supplants s 5B; if it fails (or is not pleaded), the plaintiff must still satisfy
  ss 5B and 5C.
SUBJECT: the path through the s 5O gates and which of the two exits it reaches.
BEAT 1 (0–100%): toggles re-light the gates (border colour only, 180ms ease-out, shared .xgate styles); the fall-through
  box appears by opacity (180ms ease-out); the verdict names the route within 200ms.
CAMERA: none (HTML). LIGHT: none. SOUND: none.
REDUCED MOTION: identical end states (colour and text only).
BUDGET: < 4 KB gz, no WebGL.
Source: concept laws2400-w09-professional-standard-s5o; CLA (NSW) s 5O(1)–(4); Topic 9 Lecture 2 slides 31–34 (Rogers v
  Whitaker; s 5O a modified Bolam; Peterkin v Tadros [2026] NSWSC 1185 [151]–[154], citing Gould).
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  pleaded: boolean;
  profession: boolean;
  widely: boolean;
  rational: boolean;
  s5b: boolean;
}

const initial: S = { pleaded: true, profession: true, widely: true, rational: true, s5b: true };

function view(s: S): SimView {
  const gs = [
    { id: 'p', label: 'profession', sub: 'D was practising a profession (onus on D)', ok: s.profession },
    { id: 'w', label: 'widely accepted', sub: 'in Australia, by peer professional opinion, as competent practice — wide, not universal (s 5O(4))', ok: s.widely },
    { id: 'r', label: 'not irrational', sub: 'the court does not consider the opinion irrational (s 5O(2))', ok: s.rational },
  ];
  const made = s.pleaded && gs.every((g) => g.ok);
  const stop = s.pleaded ? gs.find((g) => !g.ok) : undefined;
  let reached = s.pleaded;
  const figure = (
    <div role="group" aria-label="The section 5O defence gates, then the fall-through to sections 5B and 5C">
      <div className="xgates">
        <p className="xgates__circ-title">{s.pleaded ? 'Step 1 · s 5O, pleaded by the defendant — applied first' : 'Step 1 · s 5O not pleaded — skip to s 5B'}</p>
        <ol className="xgates__row">
          {gs.map((g) => {
            const lit = reached;
            const blocked = s.pleaded && !g.ok && reached;
            if (blocked) reached = false;
            const state = !s.pleaded ? 'skip' : blocked ? 'stop' : lit ? 'pass' : 'idle';
            return (
              <li key={g.id} className="xgate" data-gate={g.id} data-state={state} data-lit={lit && s.pleaded ? 'true' : undefined}>
                <span className="xgate__box">
                  <span className="xgate__label mono">s 5O</span>
                  <span className="xgate__status">{!s.pleaded ? 'not pleaded' : blocked ? 'not made out' : lit ? 'made out' : '—'}</span>
                </span>
                <span className="xgate__sub"><strong style={{ fontWeight: 600, color: 'var(--ink)' }}>{g.label}</strong> — {g.sub}</span>
              </li>
            );
          })}
        </ol>
        <p className="xgates__end" data-state={made ? 'pass' : 'stop'}>{made ? 's 5O made out → supplants s 5B: no breach' : 'go to step 2'}</p>
      </div>
      <div data-fallthrough style={{ marginTop: 'var(--s-4)', border: `1.5px ${made ? 'dashed' : 'solid'} var(--ink-3)`, borderRadius: 'var(--r-md)', padding: 'var(--s-3) var(--s-4)', opacity: made ? 0.45 : 1, transition: 'opacity var(--dur-micro) var(--ease-out)' }}>
        <p className="label" style={{ margin: 0, color: 'var(--ink-2)' }}>Step 2 · ss 5B and 5C — only if s 5O is not made out</p>
        <p style={{ margin: 'var(--s-2) 0 0', fontSize: 'var(--t-sm)', color: 'var(--ink)' }}>
          {made ? 'Not reached: no reason to judge the conduct against two separate standards.' : s.s5b ? 'The plaintiff satisfies s 5B(1)(a)–(c): breach.' : 'The plaintiff does not satisfy s 5B: no breach.'}
        </p>
      </div>
    </div>
  );
  let verdict: string;
  let tone: SimView['tone'];
  if (made) {
    verdict = 'Section 5O is made out: it supplants the s 5B analysis, and the professional has not breached their duty (Peterkin v Tadros, citing Gould).';
    tone = 'no';
  } else {
    const why = !s.pleaded ? 'Section 5O was not pleaded, so' : stop?.id === 'r' ? 'The court considers the peer opinion irrational, so it cannot be relied on and' : 'A precondition the defendant had to prove is missing, so';
    verdict = `${why} the plaintiff must still establish breach under ss 5B and 5C — ${s.s5b ? 'and does: breach.' : 'and does not: no breach.'}`;
    tone = s.s5b ? 'yes' : 'no';
  }
  return { figure, verdict, tone };
}

function describe(a: S, b: S) {
  if (a.pleaded !== b.pleaded) return b.pleaded ? 'Pleaded: the court applies s 5O first, and the defendant carries the onus.' : 'Not pleaded: s 5O plays no part; the ordinary s 5B analysis applies.';
  if (a.profession !== b.profession) return b.profession ? 'Practising a profession: the first precondition is met.' : 'Not shown to be practising a profession: s 5O cannot apply.';
  if (a.widely !== b.widely) return b.widely ? 'Widely accepted in Australia by peer opinion — even if the experts disagree, wide is enough (s 5O(4)).' : 'Not widely accepted by peer professional opinion: the defence fails.';
  if (a.rational !== b.rational) return b.rational ? 'Not irrational: the peer opinion can be relied on.' : 'Irrational: s 5O(2) bars reliance on the opinion, so the defence fails.';
  if (a.s5b !== b.s5b) return b.s5b ? 'On s 5B the plaintiff proves (a), (b) and (c).' : 'On s 5B the plaintiff fails at least one element.';
  return '';
}

export default function ProfessionalStandardS5o() {
  return (
    <Simulation<S>
      label="Section 5O as a defence for professionals, applied before section 5B"
      terms={[
        { term: 'Bolam principle', def: 'The standard set by professional practice — rejected in Rogers v Whitaker; a modified version is now s 5O.' },
        { term: 'Peer professional opinion', def: 'What s 5O looks to: practice widely (not universally) accepted in Australia as competent.' },
        { term: 'Supplants', def: 'If s 5O is made out, it replaces the s 5B analysis entirely (Peterkin v Tadros).' },
      ]}
      initial={initial}
      controls={[
        { key: 'pleaded', label: 'The defendant pleads s 5O', type: 'toggle' },
        { key: 'profession', label: 'D was practising a profession', type: 'toggle' },
        { key: 'widely', label: 'The practice was widely accepted in Australia by peer professional opinion as competent', type: 'toggle' },
        { key: 'rational', label: 'The court does not consider that opinion irrational', type: 'toggle' },
        { key: 's5b', label: 'If it comes to s 5B, the plaintiff proves (a), (b) and (c)', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'A surgeon pleads s 5O and fails to establish it. What follows?',
        options: [
          { text: 'The plaintiff must still satisfy ss 5B and 5C to establish breach', correct: true, why: 'Peterkin v Tadros: if the s 5O preconditions are not established, ss 5B and 5C are to be applied.' },
          { text: 'The surgeon is in breach, because the defence failed', why: 'Tempting because the defence is gone, but failing a defence does not prove breach; the plaintiff still has to satisfy s 5B.' },
          { text: 'The court sets the standard itself under the Bolam principle', why: 'Tempting because s 5O is a modified Bolam, but Bolam was rejected in Rogers; the fall-back is ss 5B and 5C.' },
        ],
      }}
    />
  );
}
