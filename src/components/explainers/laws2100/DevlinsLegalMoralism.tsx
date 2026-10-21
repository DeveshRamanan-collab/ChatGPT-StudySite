/*
SCENE: Legal moralism — Devlin's three gates, the jury box test, and George's fork
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Devlin builds his case through three questions (two of right, one of practice), fills morality's content from
  the feelings of the man in the jury box, and sees no limit on legislating against immorality; George keeps the
  conclusion but swaps popular for critical morality.
SUBJECT: the path from "immoral by common standard" through the three gates to the criminal law.
STEPS: 1 the trigger: Wolfenden (1957) and Devlin's central claim · 2 questions (1) and (2), passed because shared
  morality is necessary to society · 3 question (3): practical limits (adultery vs bigamy) · 4 the jury box test:
  intolerance, indignation, disgust; the treason analogy · 5 the fork: popular (Devlin) v critical (George).
REDUCED MOTION: the finished diagram with all five captions stacked.
BUDGET: < 5 KB gz.
Source: concept laws2100-w10-devlins-legal-moralism; authorities wolfenden-report-1957,
  devlin-morals-and-the-criminal-law, george-making-men-moral (slides 16, 19–23, 27).
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 1.2, fill: 'var(--ink-2)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 12, fill: 'var(--ink)' } as const;

const gate = (y: number, n: string, a: string, b: string) => (
  <>
    <rect x="70" y={y} width="220" height="44" rx="6" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
    <text x="84" y={y + 18} {...head}>{n}</text>
    <text x="110" y={y + 18} {...body}>{a}</text>
    <text x="110" y={y + 34} {...body} fill="var(--ink-2)">{b}</text>
  </>
);

const figure = (
  <svg viewBox={`0 0 ${W} 470`} role="img" aria-label="Devlin's three questions as gates leading to the criminal law, the jury box test of morality's content, and a fork between popular and critical morality">
    <g data-step="1">
      <text x="180" y="22" textAnchor="middle" {...head}>WOLFENDEN REPORT · 1957</text>
      <text x="180" y="42" textAnchor="middle" {...body}>immoral "by common standard"</text>
      <path d="M180 50 L180 76" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
    </g>
    <g data-step="2">
      {gate(78, '(1)', 'right to pass moral judgement?', 'yes: shared morality is necessary')}
      <path d="M180 122 L180 138" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      {gate(138, '(2)', 'right to use the law?', 'yes: or social order breaks down')}
      <path d="M180 182 L180 198" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
    </g>
    <g data-step="3">
      {gate(198, '(3)', 'all cases, or only some?', 'practical: adultery v bigamy')}
      <path d="M180 242 L180 262 M174 254 L180 264 L186 254" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="180" y="282" textAnchor="middle" {...head}>CRIMINAL LAW</text>
    </g>
    <g data-step="4">
      <rect x="8" y="300" width="168" height="66" rx="6" fill="none" stroke="var(--ink-2)" strokeWidth="1" strokeDasharray="4 4" />
      <text x="92" y="318" textAnchor="middle" {...head}>MAN IN THE JURY BOX</text>
      <text x="92" y="336" textAnchor="middle" {...body}>intolerance, indignation</text>
      <text x="92" y="352" textAnchor="middle" {...body}>and disgust</text>
      <rect x="184" y="300" width="168" height="66" rx="6" fill="none" stroke="var(--ink-2)" strokeWidth="1" strokeDasharray="4 4" />
      <text x="268" y="318" textAnchor="middle" {...head}>NO LIMITS</text>
      <text x="268" y="336" textAnchor="middle" {...body}>as against treason</text>
      <text x="268" y="352" textAnchor="middle" {...body}>and sedition</text>
    </g>
    <g data-step="5">
      <path d="M180 384 L90 420 M180 384 L270 420" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="90" y="440" textAnchor="middle" {...head}>POPULAR · DEVLIN</text>
      <text x="90" y="458" textAnchor="middle" {...body} fontSize={11}>majority's conventions</text>
      <text x="270" y="440" textAnchor="middle" {...head}>CRITICAL · GEORGE</text>
      <text x="270" y="458" textAnchor="middle" {...body} fontSize={11}>true, objective morality</text>
    </g>
  </svg>
);

export default function DevlinsLegalMoralism() {
  return (
    <Diagram
      label="Devlin's legal moralism: three questions, the jury box test, and George's critical version"
      terms={[
        { term: 'Legal moralism', def: 'The fact that behaviour is immoral is a legitimate reason to criminalise it, even without harm or offence.' },
        { term: 'Popular morality', def: 'What society conventionally regards as morally right (Devlin\'s standard).' },
        { term: 'Critical morality', def: 'What is objectively right (George\'s standard).' },
      ]}
      figure={figure}
      steps={[
        { caption: 'The Wolfenden report (1957) recommended that homosexual behaviour between consenting adults in private no longer be a crime. Devlin\'s Maccabean Lecture (1959) replied: if behaviour is immoral by common standard, the law-maker has a prima facie right to prohibit it.' },
        { caption: 'Questions (1) and (2), society\'s right to judge and to use the weapon of the law, pass for one reason: shared moral beliefs are necessary to society; without them the social order would break down. Contra Mill, there is no principled line between private and public.' },
        { caption: 'Question (3) is practical: enforcing morality can be impractical. Adultery and bigamy are both wrong on Devlin\'s view, but only bigamy can feasibly be enforced. Practical limits do not touch the moral justification.' },
        { caption: 'Content comes from the man in the street, in the jury box, on the Clapham omnibus: common sense and feelings of intolerance, indignation and disgust. There are no limits to legislation against immorality, as none against treason and sedition.' },
        { caption: 'Robert George (Making Men Moral, 1993) agrees the law should prohibit vice even if harmless, but enforces critical morality, since the majority\'s beliefs may not be sound.' },
      ]}
      check={{
        question: 'Why, for Devlin, may society use the law to enforce its moral judgements?',
        options: [
          { text: 'Without a shared morality, social order would break down', correct: true, why: 'This is Devlin\'s answer to questions (1) and (2): shared morality is necessary to society, so society may protect it by law.' },
          { text: 'Immoral conduct always harms others', why: 'Devlin claims the opposite: the law may punish immoral conduct even if it causes no harm or offence.' },
          { text: 'Objective morality can be known by reason', why: 'That is George\'s ground; Devlin relies on popular morality and the jury box\'s feelings.' },
        ],
      }}
    />
  );
}
