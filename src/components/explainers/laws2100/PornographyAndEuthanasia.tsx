/*
SCENE: Two case studies — run each principle against adult pornography and euthanasia
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → choose a case (and, for euthanasia, voluntary/non-voluntary and passive/active) → choose a principle
  → the principle's lamp lights on the five-principle strip and the panel states what it says about prohibition,
  with the strongest counterpoint from the slides → check
INTENT: The week's principles are tools: each gives a different answer to the same case, and the euthanasia
  distinctions track situations that may make a moral difference.
SUBJECT: the lit principle on the strip and its answer.
BEAT 1 (0–100%): changing a control re-lights one lamp (opacity 180ms) and re-writes the panel; verdict within 200ms.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical controls; fades are the only motion.
BUDGET: < 5 KB gz, no WebGL.
Source: concept laws2100-w10-pornography-and-euthanasia (slides 30–31), with each principle as stated in the week's
  concepts (Mill, Feinberg, paternalism, Devlin).
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  topic: string;
  principle: string;
  voluntary: boolean;
  active: boolean;
}

const initial: S = { topic: 'porn', principle: 'harm', voluntary: true, active: false };
const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 12, fill: 'var(--ink)' } as const;
const fade = { transition: 'opacity 180ms var(--ease-out)' } as const;
const PRINCIPLES = [
  { key: 'harm', label: 'harm' },
  { key: 'offence', label: 'offence' },
  { key: 'paternalism', label: 'self' },
  { key: 'moralism', label: 'morals' },
];

function kind(s: S) {
  return `${s.voluntary ? 'voluntary' : 'non-voluntary'}, ${s.active ? 'active' : 'passive'} euthanasia`;
}

function answer(s: S): { verdict: string; tone: SimView['tone'] } {
  if (s.topic === 'porn') {
    if (s.principle === 'harm') return { tone: 'open', verdict: 'Harm principle: on the liberal view, enjoying sexually explicit material is a private matter that harms no one, so no ban. Counterpoint (MacKinnon and Dworkin): pornography harms women and infringes their right to equality, so the harm principle is engaged after all.' };
    if (s.principle === 'offence') return { tone: 'no', verdict: 'Offence: the traditional ground was offensiveness to the community\'s moral standards. On Feinberg\'s tests, private material that no one need encounter fails reasonable avoidability, so the offence principle gives little support for a ban.' };
    if (s.principle === 'paternalism') return { tone: 'no', verdict: 'Harm to self: protecting adults from their own choices would be paternalism. The lecture: if it is personal choice and others are not harmed, we may criticise bad choices morally, but should not intervene with public force.' };
    return { tone: 'no', verdict: 'Legal moralism: the traditional grounds (offensiveness to moral standards; a tendency to deprave and corrupt) are moralistic. Devlin could accept them; from the liberal perspective they fail because they do not aim to prevent harm.' };
  }
  const k = kind(s);
  if (s.principle === 'harm')
    return s.voluntary
      ? { tone: 'open', verdict: `Harm principle, ${k}: requested by an adult of sound mind, it harms only the actor, with consent, so Mill would not coerce. The slides ask: is the choice harmful? Does it violate the rights of others?` }
      : { tone: 'open', verdict: `Harm principle, ${k}: the person cannot understand the choice, so there is no consent, and Mill's principle is meant only for those in the maturity of their faculties. The autonomy argument does not carry over.` };
  if (s.principle === 'offence') return { tone: 'no', verdict: `Offence, ${k}: a private medical decision is something others can reasonably avoid, so Feinberg's tests are unlikely to be met. The real debate lies elsewhere.` };
  if (s.principle === 'paternalism') return { tone: 'open', verdict: `Harm to self, ${k}: the harm risked, death, is the most serious, which strengthens a paternalist case; but its rationale also weighs the value of the person's goal and whether a less risky way exists.` };
  return { tone: 'open', verdict: `Legal moralism, ${k}: Devlin cites the prohibition of voluntary euthanasia as the criminal law enforcing a moral principle, the sanctity of human life, without harm to others.` };
}

function view(s: S): SimView {
  const { verdict, tone } = answer(s);
  const porn = s.topic === 'porn';
  const permitted = !porn && s.voluntary && !s.active;
  const figure = (
    <svg viewBox={`0 0 ${W} 200`} role="img" aria-label={`${porn ? 'Adult pornography' : kind(s)}, tested by the ${s.principle} principle`}>
      <text x="16" y="26" {...head}>CASE</text>
      <text x="16" y="48" {...body} fontSize={14}>{porn ? 'Adult pornography' : kind(s)}</text>
      {!porn && (
        <text x="16" y="68" {...body} fill="var(--ink-2)">{permitted ? 'adults may refuse life-sustaining treatment' : s.voluntary ? 'adults cannot ask to be actively killed' : 'no request: not capable of the choice'}</text>
      )}
      <text x="16" y="104" {...head}>PRINCIPLE</text>
      {PRINCIPLES.map((p, i) => {
        const on = p.key === s.principle;
        return (
          <g key={p.key} style={{ ...fade, opacity: on ? 1 : 0.3 }}>
            <circle cx={40 + i * 88} cy="140" r="14" fill={on ? 'var(--accent-soft)' : 'none'} stroke="var(--ink)" strokeWidth="1.5" />
            <text x={40 + i * 88} y="178" textAnchor="middle" {...body}>{p.label}</text>
          </g>
        );
      })}
    </svg>
  );
  return { figure, verdict, tone };
}

function describe(a: S, b: S) {
  if (a.topic !== b.topic) return b.topic === 'porn' ? 'Case 1: adult pornography. The voluntary and active switches do not apply here.' : 'Case 2: euthanasia. Use the two switches to set which kind.';
  if (a.principle !== b.principle) return `Now testing the ${b.principle === 'paternalism' ? 'harm-to-self (paternalism)' : b.principle} principle against the same case.`;
  if (b.topic === 'porn') return 'These switches only matter for the euthanasia case.';
  if (a.voluntary !== b.voluntary) return b.voluntary ? 'Voluntary: at the request of an adult person of sound mind.' : 'Non-voluntary: performed on someone not capable of understanding the choice between life and death.';
  return b.active ? 'Active: a positive act of killing.' : 'Passive: intentionally letting someone die.';
}

export default function PornographyAndEuthanasia() {
  return (
    <Simulation<S>
      label="Two case studies tested against four principles"
      terms={[
        { term: 'Voluntary / non-voluntary', def: 'At the request of an adult of sound mind / on someone not capable of understanding the choice between life and death.' },
        { term: 'Passive / active', def: 'Intentionally letting someone die / a positive act of killing.' },
        { term: 'Erotica v pornography', def: 'MacKinnon and Dworkin\'s distinction: the issue is harm to women, not a harmless immorality.' },
      ]}
      initial={initial}
      controls={[
        { key: 'topic', label: 'Case', type: 'select', options: [{ value: 'porn', label: 'Adult pornography' }, { value: 'euth', label: 'Euthanasia' }] },
        { key: 'principle', label: 'Principle', type: 'select', options: [{ value: 'harm', label: 'Harm to others (Mill)' }, { value: 'offence', label: 'Offence (Feinberg)' }, { value: 'paternalism', label: 'Harm to self (paternalism)' }, { value: 'moralism', label: 'Immorality (legal moralism)' }] },
        { key: 'voluntary', label: 'Euthanasia: voluntary (requested by an adult of sound mind)', type: 'toggle' },
        { key: 'active', label: 'Euthanasia: active (a positive act of killing)', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'How do MacKinnon and Dworkin change the pornography debate?',
        options: [
          { text: 'They move it from moralism to harm', correct: true, why: 'The issue, they say, is not an immoral yet harmless action: pornography harms women and infringes their right to equality.' },
          { text: 'They move it from harm to offence', why: 'They do not rely on offence or Feinberg\'s tests; their claim is harm and the infringement of equality.' },
          { text: 'They defend it as a private matter', why: 'That is the liberal objection to the traditional bans; MacKinnon and Dworkin reject treating it as private and harmless.' },
        ],
      }}
    />
  );
}
