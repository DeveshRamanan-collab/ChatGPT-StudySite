/*
SCENE: Assault — a chain from the defendant's act to imminent contact
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Assault needs no touching: the chain runs act or words → reasonable apprehension → imminent contact, with no
  lawful justification; each link is tested separately from any battery.
SUBJECT: the chain, one link drawing on at a time.
STEPS: 1 act or words (intention to cause apprehension, Rixon) · 2 reasonable apprehension (objective; fear not
  needed) · 3 imminent contact (no effective means of escape, Zanker v Vartzokas) · 4 no lawful justification.
  (The visual-brief's "present ability" link is not in the concept card or its cases, so it is left out.)
REDUCED MOTION: the finished chain with all four captions stacked.
BUDGET: < 6 KB gz. Narrow 360-unit canvas.
Source: concept laws2400-w02-assault; case cards rixon-v-star-city-pty-ltd, zanker-v-vartzokas.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)', fontSize: 13, letterSpacing: 1.5, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 15, fill: 'var(--ink-2)' } as const;

function Link({ y, n, title, lines, id }: { y: number; n: number; title: string; lines: string[]; id: string }) {
  const h = 44 + lines.length * 21;
  return (
    <>
      <rect x="8" y={y} width={W - 16} height={h} rx="22" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="28" y={y + 27} fontFamily="var(--font-mono)" fontSize="12" fill="var(--ink-2)">{n}</text>
      <text x="48" y={y + 27} {...ui} data-label={id}>{title}</text>
      {lines.map((l, i) => <text key={i} x="48" y={y + 52 + i * 21} {...body}>{l}</text>)}
    </>
  );
}

// Two short joining rings between links, so it reads as a chain.
const Join = ({ y }: { y: number }) => (
  <>
    <ellipse cx={W / 2 - 6} cy={y} rx="9" ry="14" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
    <ellipse cx={W / 2 + 6} cy={y} rx="9" ry="14" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
  </>
);

const figure = (
  <svg viewBox={`0 0 ${W} 590`} role="img" aria-label="A chain: the defendant's act or words, reasonable apprehension, imminent contact, no lawful justification">
    <g data-step="1">
      <Link id="act" n={1} y={10} title="D'S ACT OR WORDS" lines={['positive, direct, intentional — an', 'intention to cause apprehension, not', 'to commit the battery (Rixon)']} />
    </g>
    <g data-step="2">
      <Join y={143} />
      <Link id="apprehension" n={2} y={170} title="REASONABLE APPREHENSION" lines={["in P's mind, tested objectively;", 'fear is not necessary']} />
    </g>
    <g data-step="3">
      <Join y={282} />
      <Link id="imminent" n={3} y={309} title="OF IMMINENT CONTACT" lines={['imminent ≠ immediate: no effective', 'means of escape before it can be', 'carried out (Zanker v Vartzokas)']} />
    </g>
    <g data-step="4">
      <Join y={442} />
      <Link id="justification" n={4} y={469} title="NO LAWFUL JUSTIFICATION" lines={['no contact needed at all —', 'assault can exist without a battery']} />
    </g>
  </svg>
);

export default function Assault() {
  return (
    <Diagram
      label="Assault as a chain of four links"
      terms={[
        { term: 'Assault', def: 'A direct, intentional act creating a reasonable apprehension of imminent physical interference.' },
        { term: 'Apprehension', def: 'Expecting the contact — assessed from the plaintiff’s mind, but objectively. Not the same as fear.' },
        { term: 'Imminent', def: 'Not "immediate": no effective means of escape before the threat can be carried out.' },
      ]}
      figure={figure}
      steps={[
        { caption: "Link 1: a positive, direct, intentional act — mere words or a gesture will do. The intention is to cause apprehension, not to commit the battery (Rixon v Star City)." },
        { caption: 'Link 2: would a reasonable person in the plaintiff’s position have apprehended the threat? Fear is not necessary; words alone can be enough.' },
        { caption: 'Link 3: the contact must be imminent — which means no effective escape before it can happen, even if it would happen a little later (Zanker v Vartzokas, the moving van).' },
        { caption: 'Link 4: no lawful justification. No touching is required: check apprehension and imminence separately from any contact.' },
      ]}
      check={{
        question: 'In a moving van, D says he will take P to a mate’s house to "fix her up". Why is that imminent?',
        options: [
          { text: 'Because the harm was going to happen that instant', why: 'It was not: imminence does not mean immediate.' },
          { text: 'Because P had no effective means of escape before the threat could be carried out', correct: true, why: 'Zanker v Vartzokas: trapped in a moving van, the threat was imminent though the harm lay a little in the future.' },
          { text: 'Because P was afraid', why: 'Fear is not necessary for assault; imminence turns on the ability to escape.' },
        ],
      }}
    />
  );
}
