/*
SCENE: Valid consent — three gates, then a scope check
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Consent (express or implied) protects only if it was voluntary, given by a competent person and related to
  the specific act — and only for conduct inside what was actually agreed.
SUBJECT: the column of gates, one drawing on at a time; the fourth is dashed because it tests the conduct, not
  the consent.
STEPS: 1 voluntary/free (knowledge; no force, fraud, threat; "nature and character") · 2 competent person ·
  3 the specific act · 4 scope (McNamara v Duncan; Dean v Phung).
REDUCED MOTION: the finished figure with all four captions stacked.
BUDGET: < 6 KB gz. Narrow 360-unit canvas.
Source: concept laws2400-w04-consent-validity-and-scope; case cards mcnamara-v-duncan, dean-v-phung.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 13, letterSpacing: 1.5, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 15, fill: 'var(--ink-2)' } as const;

function Gate({ y, n, title, lines, id, dashed }: { y: number; n: number; title: string; lines: string[]; id: string; dashed?: boolean }) {
  const h = 44 + lines.length * 21;
  return (
    <>
      <rect x="8" y={y} width={W - 16} height={h} rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray={dashed ? '6 6' : undefined} />
      <text x="28" y={y + 27} fontFamily="var(--font-mono)" fontSize="12" fill="var(--ink-2)">{n}</text>
      <text x="48" y={y + 27} {...head} data-label={id}>{title}</text>
      {lines.map((l, i) => <text key={i} x="48" y={y + 52 + i * 21} {...body}>{l}</text>)}
    </>
  );
}

const Arrow = ({ y }: { y: number }) => <path d={`M${W / 2} ${y} v22 M${W / 2 - 6} ${y + 16} l6 6 l6 -6`} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />;

const figure = (
  <svg viewBox={`0 0 ${W} 502`} role="img" aria-label="Three gates for valid consent — voluntary, competent person, the specific act — then a check that conduct stayed within scope">
    <g data-step="1"><Gate id="voluntary" n={1} y={8} title="VOLUNTARY / FREE" lines={['sufficient knowledge; no force, fraud,', 'threat or intimidation — a collateral', 'lie leaves "nature and character" intact']} /></g>
    <g data-step="2"><Arrow y={120} /><Gate id="competent" n={2} y={148} title="A COMPETENT PERSON" lines={['sufficient understanding of the act', 'and its consequences']} /></g>
    <g data-step="3"><Arrow y={239} /><Gate id="specific" n={3} y={267} title="THE SPECIFIC ACT" lines={['consent relates to the very act', 'complained of']} /></g>
    <g data-step="4"><Arrow y={358} /><Gate id="scope" n={4} y={386} dashed title="DID THE CONDUCT STAY INSIDE?" lines={['a deliberate blow is not play within', 'the rules (McNamara v Duncan); 53+', 'needless visits exceed it (Dean v Phung)']} /></g>
  </svg>
);

export default function ConsentValidityAndScope() {
  return (
    <Diagram
      label="Valid consent: three gates and a scope check"
      terms={[
        { term: 'Express or implied', def: 'Consent may be spoken or written, or shown by conduct.' },
        { term: 'Vitiate', def: 'To destroy consent: force, fraud, threat or intimidation do.' },
        { term: 'Nature and character', def: 'What the interference actually is. If P understands it, a false inducement does not destroy consent.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Gate 1: voluntary. P needs sufficient knowledge, and there must be no force, fraud, threat or intimidation. A false inducement about a collateral matter — a false promise of marriage — leaves consent valid if P understood the nature and character of the act.' },
        { caption: 'Gate 2: given by a competent person, with sufficient understanding of the act and its consequences.' },
        { caption: 'Gate 3: the consent must relate to the specific act complained of.' },
        { caption: 'Then check scope. Playing Australian Rules is not consent to a deliberate blow that fractures a skull (McNamara v Duncan); consent to dental care did not cover 53+ consultations of needless treatment costing $73,640 (Dean v Phung).' },
      ]}
      check={{
        question: 'P joins a rugby match and is deliberately punched off the ball. D says P consented by playing. Does consent protect D?',
        options: [
          { text: 'Yes — P accepted contact by playing a contact sport', why: 'Consent covers forcible contact within the rules, not deliberately inflicted injury.' },
          { text: 'No — the blow falls outside the scope of what P agreed to', correct: true, why: 'As in McNamara v Duncan, conduct exceeding what was consented to is not protected.' },
          { text: 'No — consent to sport is never valid', why: 'Consent to play is valid; it simply does not extend to deliberate injury.' },
        ],
      }}
    />
  );
}
