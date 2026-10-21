/*
SCENE: Natural law and positivism — two columns, a fork into procedural and substantive, and two readings of the NCLM
LENGTH: 5 steps, scroll-drawn when pinned; Next/Back otherwise (Diagram base)
INTENT: Positivism says law is a matter of social facts; natural law adds conformity to moral standards of form
  (Fuller) or content (Finnis); Hart reads the necessary connection in two versions — Thomist and moral obligation.
SUBJECT: the natural-law column, forking downward.
STEPS: 1 positivism: social facts · 2 natural law: social facts + moral standards · 3 procedural vs substantive ·
  4 the NCLM: Thomist vs moral-obligation reading · 5 Finnis: not conceived in opposition to positivism.
REDUCED MOTION: the finished diagram with all five captions stacked.
BUDGET: < 7 KB gz. 164-unit columns on a 360-unit canvas; ≤ 18 characters a line inside columns.
Source: concept laws2100-w04-natural-law-and-positivism; authorities finnis-natural-law-theories-sep, hart-the-concept-of-law.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const head = { fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: 1.2, fill: 'var(--ink)' } as const;
const body = { fontFamily: 'var(--font-body)', fontSize: 13, fill: 'var(--ink)' } as const;

function Box({ x, y, h, title, ls, dashed, id }: { x: number; y: number; h: number; title: string; ls: string[]; dashed?: boolean; id: string }) {
  return (
    <>
      <rect x={x} y={y} width="164" height={h} rx="10" fill="none" stroke={dashed ? 'var(--ink-3)' : 'var(--ink)'} strokeWidth="1.5" strokeDasharray={dashed ? '6 6' : undefined} />
      <text x={x + 12} y={y + 22} {...head} fontSize={11} data-label={id}>{title}</text>
      {ls.map((l, i) => <text key={i} x={x + 12} y={y + 44 + i * 18} {...body}>{l}</text>)}
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 540`} role="img" aria-label="Positivism: law is social facts. Natural law: social facts plus moral standards, procedural or substantive. Hart's two readings of the necessary connection.">
    <g data-step="1"><Box id="positivism" x={8} y={8} h={96} title="POSITIVISM" ls={['law = social facts', 'and practices']} /></g>
    <g data-step="2"><Box id="natural" x={188} y={8} h={96} title="NATURAL LAW" ls={['social facts +', 'moral standards of', 'form and/or content']} /></g>
    <g data-step="3">
      <path d="M270 104 L270 124 M90 124 L270 124 M90 124 L90 136 M270 124 L270 136" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <Box id="procedural" x={8} y={136} h={78} title="PROCEDURAL" ls={['Fuller: form']} />
      <Box id="substantive" x={188} y={136} h={78} title="SUBSTANTIVE" ls={['Finnis: content']} />
    </g>
    <g data-step="4">
      <line x1="8" y1="240" x2={W - 8} y2="240" stroke="var(--ink-3)" strokeWidth="1" />
      <text x={W / 2} y="264" textAnchor="middle" {...head}>HART'S READING: THE NCLM</text>
      <Box id="thomist" x={8} y={280} h={150} title="THOMIST" ls={['principles of', 'justice found by', 'reason, AND laws', 'conflicting with', 'them are not valid']} />
      <Box id="obligation" x={188} y={280} h={150} title="MORAL OBLIGATION" ls={['a legal system', 'needs a widely', 'diffused sense of', 'moral obligation', 'to obey the law']} />
    </g>
    <g data-step="5">
      <rect x="8" y="450" width={W - 16} height="80" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x="22" y="474" {...head} fill="var(--ink-2)">FINNIS</text>
      <text x="22" y="496" {...body}>law is both a sheer social fact and a set</text>
      <text x="22" y="515" {...body}>of often sound reasons for action</text>
    </g>
  </svg>
);

export default function NaturalLawAndPositivism() {
  return (
    <Diagram
      label="Positivism and natural law side by side, with Hart's two readings of the necessary connection"
      terms={[
        { term: 'Legal positivism', def: '"It is in no sense a necessary truth that laws reproduce or satisfy certain demands of morality" (CL 185–186).' },
        { term: 'NCLM', def: 'The necessary connection between law and morality that natural law asserts.' },
        { term: 'Lex iniusta non est lex', def: 'An unjust law is not a law — the second half of the Thomist version.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'For legal positivists the existence of law is simply a matter of social facts and practices — "though in fact [laws] have often" satisfied morality (CL 185–186).' },
        { caption: 'Natural law theories dispute that law and morality are conceptually separable: law is social facts plus conformity to moral standards of form and/or content.' },
        { caption: 'Procedural natural law (Fuller) or substantive natural law (Finnis).' },
        { caption: 'Hart reads natural law as a "necessary" connection (CL 155), in two versions: the Thomist pair, or a widely diffused, though not necessarily universal, recognition of a moral obligation to obey.' },
        { caption: 'Finnis: natural law theorists did not conceive their theories in opposition to positivism.' },
      ]}
      check={{
        question: 'A writer argues that a legal system can exist even where most people feel no moral duty to obey. Which version of the NCLM is under attack?',
        options: [
          { text: 'The Thomist version', why: 'That version is about principles found by reason and the invalidity of conflicting laws, not about popular attitudes.' },
          { text: 'The moral-obligation version', correct: true, why: 'It holds that a legal system needs a widely diffused recognition of a moral obligation to obey the law.' },
          { text: "Fuller's procedural theory", why: "Fuller's theory concerns law's form — the principles of legality — not subjects' moral attitudes." },
        ],
      }}
    />
  );
}
