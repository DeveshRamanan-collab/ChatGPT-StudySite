/*
SCENE: The Security Council — fifteen seats above a chain of three articles
LENGTH: 4 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
BEATS: 1 five permanent seats with the veto · 2 ten elected seats by region · 3 art 24 primary responsibility ·
  4 art 25 binding decisions → art 103 priority over other treaties
INTENT: Fix who sits on the Council (art 23; veto art 27(3)) and why its decisions matter: members confer primary
  responsibility (art 24), agree to carry out its decisions (art 25), and those obligations prevail over any other
  agreement (art 103).
SUBJECT: the chain of article boxes beneath the seats; each link draws on in turn.
BEAT 1 (0–25%): five circles labelled with the P-5. BEAT 2 (25–50%): ten dots in regional rows (3·2·2·2·1).
  BEAT 3 (50–75%): the art 24 box. BEAT 4 (75–100%): art 25 and art 103 boxes with connectors. Scrubbed, ease: none.
CAMERA: none (SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished diagram with all four captions stacked (base).
BUDGET: < 8 KB gz, no WebGL. Narrow 360-unit canvas for phone legibility.
Source: concept laws2000-w10-security-council-composition-and-powers; Week 10 slides 8–10; UN Charter arts 23, 24,
  25, 27(3), 103.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const P5 = [
  { x: 44, name: 'US' }, { x: 112, name: 'China' }, { x: 180, name: 'Russia' }, { x: 248, name: 'UK' }, { x: 316, name: 'France' },
];
const REGIONS = [
  { name: 'Africa', n: 3 }, { name: 'Asia', n: 2 }, { name: 'Latin America & Caribbean', n: 2 },
  { name: 'Western Europe & Others', n: 2 }, { name: 'Eastern Europe', n: 1 },
];

function Box({ y, h, title, lines, id }: { y: number; h: number; title: string; lines: string[]; id: string }) {
  return (
    <>
      <rect x="8" y={y} width={W - 16} height={h} rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={W / 2} y={y + 26} textAnchor="middle" fontFamily="var(--font-ui)" fontSize="13" letterSpacing="1.5" fill="var(--ink)" data-label={id}>{title}</text>
      {lines.map((l, i) => (
        <text key={i} x={W / 2} y={y + 50 + i * 20} textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">{l}</text>
      ))}
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 650`} role="img" aria-label="Fifteen Council seats: five permanent members with a veto and ten elected members by region; beneath, a chain from art 24 to art 25 to art 103">
    <g data-step="1">
      <text x={W / 2} y="20" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="13" letterSpacing="1.5" fill="var(--ink)" data-label="p5">FIVE PERMANENT MEMBERS (P-5)</text>
      {P5.map((p) => (
        <g key={p.name}>
          <circle cx={p.x} cy="62" r="25" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
          <text x={p.x} y="67" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="12" fill="var(--ink)">{p.name}</text>
        </g>
      ))}
      <text x={W / 2} y="112" textAnchor="middle" fontFamily="var(--font-body)" fontSize="15" fill="var(--ink-2)">each holds a veto · art 27(3)</text>
    </g>
    <g data-step="2">
      <text x={W / 2} y="152" textAnchor="middle" fontFamily="var(--font-ui)" fontSize="13" letterSpacing="1.5" fill="var(--ink)" data-label="elected">TEN ELECTED MEMBERS</text>
      <text x={W / 2} y="174" textAnchor="middle" fontFamily="var(--font-body)" fontSize="13" fill="var(--ink-2)">two-year terms · five elected each year by the GA</text>
      {REGIONS.map((r, i) => (
        <g key={r.name}>
          <text x="14" y={206 + i * 26} fontFamily="var(--font-ui)" fontSize="14" fill="var(--ink)">{r.name}</text>
          {Array.from({ length: r.n }, (_, k) => <circle key={k} cx={290 + k * 24} cy={201 + i * 26} r="8" fill="none" stroke="var(--ink)" strokeWidth="1.5" />)}
        </g>
      ))}
    </g>
    <g data-step="3">
      <Box id="art-24" y={340} h={92} title="ART 24 · PRIMARY RESPONSIBILITY" lines={['members confer it on the Council,', 'which acts on their behalf']} />
    </g>
    <g data-step="4">
      <line x1={W / 2} y1="432" x2={W / 2} y2="458" stroke="var(--ink-3)" strokeWidth="1.5" />
      <Box id="art-25" y={458} h={72} title="ART 25 · BINDING" lines={['decisions bind all members']} />
      <line x1={W / 2} y1="530" x2={W / 2} y2="556" stroke="var(--ink-3)" strokeWidth="1.5" />
      <Box id="art-103" y={556} h={88} title="ART 103 · PRIORITY" lines={['Charter obligations prevail over', 'any other international agreement']} />
    </g>
  </svg>
);

export default function SecurityCouncilCompositionAndPowers() {
  return (
    <Diagram
      label="The Security Council: fifteen seats, primary responsibility, binding decisions and priority over other treaties"
      terms={[
        { term: 'P-5', def: 'The five permanent members — the US, China, Russia, the UK and France — each with a veto.' },
        { term: 'Primary responsibility', def: 'What members confer on the Council for international peace and security (art 24).' },
        { term: 'Binding decision', def: 'A Council decision members have agreed to accept and carry out (art 25).' },
        { term: 'Art 103', def: 'Where obligations conflict, Charter obligations prevail over any other international agreement.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'Fifteen members (art 23). Five are permanent — the US, China, Russia, the UK and France — and each holds a veto (art 27(3)).' },
        { caption: 'Ten are non-permanent, elected by the General Assembly for two-year terms, five each year, along regional lines: 3 Africa, 2 Asia, 2 Latin America and the Caribbean, 2 Western Europe and Others, 1 Eastern Europe.' },
        { caption: 'Art 24: members confer on the Council primary responsibility for international peace and security and agree it acts on their behalf; its specific powers are in Chapters VI, VII, VIII and XII.' },
        { caption: 'Art 25: members agree to accept and carry out its decisions, so they bind all members. Read with art 103: Charter obligations prevail over obligations under any other international agreement.' },
      ]}
      check={{
        question: 'State X’s treaty with Y obliges it to sell Y arms. Acting under Chapter VII, the Council decides all members must embargo arms to Y. Which obligation prevails?',
        options: [
          { text: 'The treaty, because X agreed to it first', why: 'Timing does not matter: art 103 makes Charter obligations prevail over any other international agreement.' },
          { text: 'The Council’s decision, under arts 25 and 103', correct: true, why: 'The decision binds X under art 25, and art 103 gives that Charter obligation priority over the treaty.' },
          { text: 'Neither, unless X voted for the decision', why: 'Art 25 binds all members, whether or not they sit on the Council or voted for the decision.' },
        ],
      }}
    />
  );
}
