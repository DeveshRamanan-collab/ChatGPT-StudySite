/*
SCENE: Reveal information wisely — a disclosure gate for one reflection
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → change the facts about one reflection → watch it pass or stop at four gates → one check
INTENT: Before a personal detail goes into a reflective paper it passes four checks from the slide: is it appropriate;
  if you are uncomfortable, did it change the final outcome (then state your concerns); are others described with
  detachment; is the tone professional and organised.
SUBJECT: the path through the four gates; the gate that stops the reflection turns clay, and the outcome box below
  (the one accent element) reads leave it out / rewrite first / include / include and state your concerns.
BEAT 1 (0–100%): toggles and selects; gate states and the verdict update within 200ms. States swap instantly:
  colour and dash only, no movement.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (no motion at all).
BUDGET: < 7 KB gz, no WebGL.
Source: concept mgmt2094-w06-revealing-information-wisely (Week 6 lecture slide 5; Week 9 transcript, reflective-writing
  segment). The order of the gates restructures the slide's four bullets; it adds no rule.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  appropriate: boolean;
  comfortable: boolean;
  changed: boolean;
  others: 'none' | 'detached' | 'blaming';
  tone: 'organised' | 'venting';
}

const initial: S = { appropriate: true, comfortable: false, changed: true, others: 'none', tone: 'organised' };

type State = 'pass' | 'stop' | 'skip' | 'idle';
interface Gate { id: string; title: string; sub: string; state: State; note: string }

function gates(s: S): { list: Gate[]; outcome: 'leave' | 'rewrite' | 'concerns' | 'include' } {
  let open = true;
  const step = (applies: boolean, pass: boolean): State => {
    if (!open) return 'idle';
    if (!applies) return 'skip';
    if (!pass) { open = false; return 'stop'; }
    return 'pass';
  };
  const g1 = step(true, s.appropriate);
  const g2 = step(true, s.comfortable || s.changed);
  const g3 = step(s.others !== 'none', s.others === 'detached');
  const g4 = step(true, s.tone === 'organised');
  const list: Gate[] = [
    { id: 'appropriate', title: 'Is it appropriate?', sub: 'ask before including it', state: g1, note: '' },
    { id: 'comfort', title: 'Comfortable, or changed the outcome?', sub: 'if not, only if it changed the outcome', state: g2, note: g2 === 'pass' && !s.comfortable ? 'state your concerns' : '' },
    { id: 'others', title: 'Others described with detachment?', sub: "don't drag someone else down", state: g3, note: '' },
    { id: 'tone', title: 'Professional, organised tone?', sub: 'personal, but academic and sensible', state: g4, note: '' },
  ];
  const outcome = g1 === 'stop' || g2 === 'stop' ? 'leave' : g3 === 'stop' || g4 === 'stop' ? 'rewrite' : !s.comfortable ? 'concerns' : 'include';
  return { list, outcome };
}

const OUTCOME = {
  leave: 'LEAVE IT OUT',
  rewrite: 'REWRITE BEFORE INCLUDING',
  concerns: 'INCLUDE + STATE YOUR CONCERNS',
  include: 'INCLUDE IT',
} as const;

const W = 360;
const ui = { fontFamily: 'var(--font-ui)' } as const;
const STROKE: Record<State, string> = { pass: 'var(--ink)', stop: 'var(--clay)', skip: 'var(--ink-3)', idle: 'var(--ink-3)' };
const STATUS: Record<State, string> = { pass: 'passes', stop: 'stops here', skip: 'not needed', idle: '—' };

function view(s: S): SimView {
  const { list, outcome } = gates(s);
  const figure = (
    <svg viewBox={`0 0 ${W} 470`} role="img" aria-label={`Four disclosure gates; outcome: ${OUTCOME[outcome].toLowerCase()}`}>
      <line x1="24" y1="20" x2="24" y2="400" stroke="var(--ink-3)" strokeWidth="1.5" />
      {list.map((g, i) => {
        const y = 14 + i * 92;
        const ink = g.state === 'idle' || g.state === 'skip' ? 'var(--ink-3)' : 'var(--ink)';
        return (
          <g key={g.id} data-gate={g.id} data-state={g.state}>
            <circle cx="24" cy={y + 30} r="7" fill={g.state === 'pass' ? 'var(--ink)' : 'var(--paper)'} stroke={STROKE[g.state]} strokeWidth="2" />
            <rect x="44" y={y} width={W - 52} height="74" rx="12" fill="none" stroke={STROKE[g.state]} strokeWidth={g.state === 'stop' ? 2 : 1.25} strokeDasharray={g.state === 'skip' ? '5 5' : undefined} />
            <text x="58" y={y + 24} {...ui} fontSize="14" fill={ink}>{g.title}</text>
            <text x="58" y={y + 44} fontFamily="var(--font-body)" fontSize="13" fill="var(--ink-2)">{g.sub}</text>
            <text x="58" y={y + 63} {...ui} fontSize="12" letterSpacing="0.6" fill={g.state === 'stop' ? 'var(--clay)' : 'var(--ink-2)'}>
              {STATUS[g.state].toUpperCase()}{g.note ? ` · ${g.note}` : ''}
            </text>
          </g>
        );
      })}
      <rect x="8" y="396" width={W - 16} height="62" rx="12" fill="none" stroke="var(--accent)" strokeWidth="2" />
      <text x={W / 2} y="433" textAnchor="middle" {...ui} fontSize="14" letterSpacing="1" fill="var(--ink)" data-outcome={outcome}>{OUTCOME[outcome]}</text>
    </svg>
  );
  const verdict =
    outcome === 'leave'
      ? !s.appropriate
        ? 'Leave it out. Before including something about yourself, ask whether it is appropriate: you need not reveal everything.'
        : 'Leave it out. You are uncomfortable and it did not change the final outcome of your experience, so it is fine not to share it.'
      : outcome === 'rewrite'
        ? s.others === 'blaming' && list[2].state === 'stop'
          ? 'Rewrite first. Avoid dragging someone else down: keep a level of detachment as you describe their influence.'
          : 'Rewrite first. It is personal and subjective, but keep a professional, academic tone with your thoughts organised so they appear sensible.'
        : outcome === 'concerns'
          ? 'Include it, because it changed the final outcome of your experience — and indicate in your writing the concerns you have about revealing it.'
          : 'Include it: it is appropriate, you are comfortable sharing it, and it is written with detachment in a professional tone.';
  return { figure, verdict, tone: outcome === 'include' ? 'yes' : outcome === 'concerns' ? 'open' : 'no' };
}

function describe(a: S, b: S) {
  if (a.appropriate !== b.appropriate) return b.appropriate ? 'Appropriate to include: on to the comfort test.' : 'Not appropriate: the slide says ask this first, so it stays out whatever else is true.';
  if (a.comfortable !== b.comfortable) return b.comfortable ? 'Comfortable sharing it: no need to state concerns.' : 'Uncomfortable: now it may go in only if it changed the final outcome of your experience.';
  if (a.changed !== b.changed) return b.changed ? 'It changed the final outcome: an uncomfortable reflection may go in, with your concerns stated.' : 'It did not change the outcome: if you are uncomfortable, leave it out.';
  if (a.others !== b.others)
    return b.others === 'none' ? 'No one else is described: the detachment gate is not needed.' : b.others === 'detached' ? 'Their influence is described with detachment: that passes.' : 'Dragging a teammate down fails, however difficult they made life for you.';
  if (a.tone !== b.tone) return b.tone === 'organised' ? 'Professional and organised: it reads as sensible.' : 'Venting in disordered bursts breaks the professional, academic tone the slide asks for.';
  return '';
}

export default function RevealingInformationWisely() {
  return (
    <Simulation<S>
      label="Reveal information wisely: four gates a personal reflection passes before it goes into the paper"
      terms={[
        { term: 'Somewhat personal', def: 'A reflective paper includes your subjective feelings and opinions.' },
        { term: 'Changed the final outcome', def: 'The test for including a reflection you feel uncomfortable about.' },
        { term: 'Detachment', def: 'Describing a teammate\'s influence without dragging them down.' },
      ]}
      initial={initial}
      controls={[
        { key: 'appropriate', label: 'It is appropriate to include', type: 'toggle' },
        { key: 'comfortable', label: 'I am comfortable sharing it', type: 'toggle' },
        { key: 'changed', label: 'It changed the final outcome of my experience', type: 'toggle' },
        { key: 'others', label: 'Other people in it', type: 'select', options: [{ value: 'none', label: 'Only about me' }, { value: 'detached', label: 'A teammate, described with detachment' }, { value: 'blaming', label: 'A teammate, blamed and criticised' }] },
        { key: 'tone', label: 'How it is written', type: 'select', options: [{ value: 'organised', label: 'Professional and organised' }, { value: 'venting', label: 'Angry, disordered bursts' }] },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Hana is uncomfortable about the anxiety that made her miss two meetings; the team changed its concept without her as a result. What should she do?',
        options: [
          { text: 'Leave it out: uncomfortable reflections never belong in the paper', why: 'The slide adds an exception: unless it changed the final outcome of your experience — and this one did.' },
          { text: 'Include it, and indicate her concerns about revealing it', correct: true, why: 'It changed the outcome, so it may go in, and the slide says to indicate the concerns you have about such reveals.' },
          { text: 'Include it in full, because a reflective paper is a personal journal', why: 'The slides say it is NOT a diary entry; even included material keeps a professional tone.' },
        ],
      }}
    />
  );
}
