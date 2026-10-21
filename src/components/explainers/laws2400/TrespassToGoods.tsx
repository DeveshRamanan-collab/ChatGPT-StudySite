/*
SCENE: Trespass to goods — one gate, three locks
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: The single gate opens only for a direct interference with a chattel actually possessed by the plaintiff at
  the time — possession, not ownership — and then with no damage to prove.
SUBJECT: the three locks above the gate, filling one by one.
BEAT 1 (0–25%): lock 1 — a chattel (tangible, moveable; not fixtures). Row fades in, lock fills. Ease none (scrubbed).
BEAT 2 (25–50%): lock 2 — in the plaintiff's possession at the time (intention + actual control; bailee, finder).
BEAT 3 (50–75%): lock 3 — a direct interference.
BEAT 4 (75–100%): the gate slides open (scaleX from the posts): no proof of damage; an owner without possession
  is turned to conversion.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked (base).
BUDGET: < 6 KB gz. Transform and opacity only.
Source: concept laws2400-w02-trespass-to-goods; case cards penfolds-wines-pty-ltd-v-elliott,
  national-crime-authority-v-flack.
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const W = 360;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const head = { fontFamily: 'var(--font-ui)', fontSize: 12.5, letterSpacing: 1.5, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 14, fill: 'var(--ink-2)' } as const;

const LOCKS = [
  { title: 'A CHATTEL', lines: ['tangible, moveable goods —', 'not fixtures; intangibles in doubt'] },
  { title: "IN P'S POSSESSION AT THE TIME", lines: ['intention to control + actual control;', 'possession, not ownership'] },
  { title: 'A DIRECT INTERFERENCE', lines: ['by the defendant'] },
];

function scene(t: number) {
  const open = clamp((t - 3.1) / 0.4);
  const s = 1 - open * 0.85;
  return (
    <svg viewBox={`0 0 ${W} 440`} role="img" aria-label="A gate with three locks: a chattel, in the plaintiff's possession, a direct interference">
      {LOCKS.map((l, i) => {
        const y = 30 + i * 84;
        return (
          <g key={l.title} opacity={clamp((t - i) * 3 + 0.25)}>
            <circle cx="22" cy={y} r="9" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
            <circle cx="22" cy={y} r="5" fill="var(--ink)" opacity={clamp((t - i - 0.4) * 4)} />
            <text x="44" y={y + 4.5} {...head}>{l.title}</text>
            {l.lines.map((line, k) => <text key={k} x="44" y={y + 26 + k * 19} {...body}>{line}</text>)}
            <line x1="22" y1={y + 9} x2="22" y2={i === 2 ? 290 : y + 75} stroke="var(--ink-3)" strokeWidth="1.5" />
          </g>
        );
      })}
      <text x="8" y="278" fontFamily="var(--font-ui)" fontSize="12" letterSpacing="1.5" fill="var(--ink-2)" dx="30">THE GATE: TRESPASS TO GOODS</text>
      <line x1="8" y1="290" x2="8" y2="290" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" />
      <line x1={W - 8} y1="290" x2={W - 8} y2="290" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" />
      <line x1="0" y1="0" x2={W / 2 - 8} y2="0" stroke="var(--ink)" strokeWidth="2" transform={`translate(8 290) scale(${s} 1)`} />
      <line x1="0" y1="0" x2={-(W / 2 - 8)} y2="0" stroke="var(--ink)" strokeWidth="2" transform={`translate(${W - 8} 290) scale(${s} 1)`} />
      <g opacity={open}>
        <text x={W / 2} y="318" textAnchor="middle" {...body}>opens with no proof of damage</text>
        <rect x="8" y="340" width={W - 16} height="90" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
        <text x="24" y="364" {...head}>OWNER WITHOUT POSSESSION?</text>
        <text x="24" y="388" {...body}>cannot sue in trespass — though</text>
        <text x="24" y="408" {...body}>may still be able to sue in conversion</text>
      </g>
    </svg>
  );
}

export default function TrespassToGoods() {
  return (
    <ScrollExplainer
      label="Trespass to goods: one gate with three locks"
      terms={[
        { term: 'Chattel', def: 'Tangible, moveable, visible goods transferable by delivery — not fixtures.' },
        { term: 'Possession', def: 'An intention to control and exclude others, plus actual control. Not ownership.' },
        { term: 'Bailee', def: 'A person with physical custody of goods, who has possession even against the owner in most respects.' },
      ]}
      beats={[
        { caption: 'Lock 1: a chattel — pets, vehicles, phones, artwork; not fixtures attached to land. Intangibles like bitcoin or digital files sit in doubt.' },
        { caption: 'Lock 2: the plaintiff must possess the chattel at the moment of interference. A bailee has possession; a finder can sue everyone but the true owner (NCA v Flack).' },
        { caption: 'Lock 3: a direct interference with that chattel by the defendant.' },
        { caption: 'The gate opens with no proof of actual damage. An owner without possession cannot sue in trespass, but may sue in conversion.' },
      ]}
      scene={scene}
      check={{
        question: 'O owns a bike lent to B. While B has it, D directly damages it. Who can sue D in trespass to goods?',
        options: [
          { text: 'O, because O owns the bike', why: 'Trespass to goods turns on possession, not ownership; O was not in possession at the time.' },
          { text: 'B, because B had possession at the time of the interference', correct: true, why: 'A bailee with physical custody has possession — the threshold question for this tort.' },
          { text: 'Neither, unless the bike was destroyed', why: 'Damage need not be proved in trespass; destruction matters only for the bailor suing the bailee (Penfolds).' },
        ],
      }}
    />
  );
}
