/*
SCENE: Leadership, knowledge sharing and creative problem-solving capacity — a chain
LENGTH: 4 steps, scroll-drawn when pinned (≈ 320vh); Next/Back otherwise (Diagram base)
BEATS: 4
INTENT: Show Carmeli, Gelbard and Reiter-Palmon's (2013) chain from leader supportive behaviours, through internal
  and external knowledge sharing, to creative problem-solving capacity and creative performance — with the direct
  leader link, and the external link that was not significant in Study 2.
SUBJECT: the chain of arrows from the leader box down to fluency and originality.
BEAT 1 (0–25%): leader supportive behaviours box.
BEAT 2 (25–50%): internal and external knowledge-sharing boxes with arrows from the leader.
BEAT 3 (50–75%): creative problem-solving capacity; solid arrow from internal, dashed from external ("not
  significant in Study 2"), and the direct line from the leader.
BEAT 4 (75–100%): fluency and originality; note: internal sharing → capacity → originality (full mediation).
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: the finished diagram with all four captions stacked (base handles calm/off).
BUDGET: < 6 KB gz, no WebGL. Narrow 360-unit canvas so text stays legible on phones.
Source: concept mgmt2094-w04-leadership-and-knowledge-sharing; Carmeli, Gelbard and Reiter-Palmon (2013), Studies 1–2.
*/
import { Diagram } from '../bases/Diagram';

const W = 360;
const ui = { fontFamily: 'var(--font-ui)' } as const;

function Box({ x, y, w, h, title, lines, id, dashed }: { x: number; y: number; w: number; h: number; title: string; lines: string[]; id: string; dashed?: boolean }) {
  const cx = x + w / 2;
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx="12" fill="none" stroke={dashed ? 'var(--ink-3)' : 'var(--ink)'} strokeWidth="1.5" strokeDasharray={dashed ? '6 5' : undefined} />
      <text x={cx} y={y + 24} textAnchor="middle" fontSize="13" letterSpacing="1.2" fill="var(--ink)" {...ui} data-label={id}>{title}</text>
      {lines.map((l, i) => (
        <text key={i} x={cx} y={y + 46 + i * 19} textAnchor="middle" fontSize="13.5" fill="var(--ink-2)" {...ui}>{l}</text>
      ))}
    </>
  );
}

function Arrow({ x1, y1, x2, y2, dashed, faint }: { x1: number; y1: number; x2: number; y2: number; dashed?: boolean; faint?: boolean }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const p1 = [x2 - 9 * Math.cos(a - 0.45), y2 - 9 * Math.sin(a - 0.45)];
  const p2 = [x2 - 9 * Math.cos(a + 0.45), y2 - 9 * Math.sin(a + 0.45)];
  const stroke = faint ? 'var(--ink-3)' : 'var(--ink)';
  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth="1.8" strokeDasharray={dashed ? '6 5' : undefined} />
      <polyline points={`${p1[0]},${p1[1]} ${x2},${y2} ${p2[0]},${p2[1]}`} fill="none" stroke={stroke} strokeWidth="1.8" />
    </>
  );
}

const figure = (
  <svg viewBox={`0 0 ${W} 640`} role="img" aria-label="Leader supportive behaviours lead to internal and external knowledge sharing, then to creative problem-solving capacity, then to fluency and originality; external sharing's link is dashed">
    <g data-step="1">
      <Box id="leader" x={8} y={8} w={W - 16} h={92} title="LEADER SUPPORTIVE BEHAVIOURS" lines={['models collaboration and knowledge sharing', 'encourages exchange, openness, idea sharing']} />
    </g>
    <g data-step="2">
      <Arrow x1={120} y1={100} x2={90} y2={150} />
      <Arrow x1={240} y1={100} x2={270} y2={150} />
      <Box id="internal" x={8} y={150} w={164} h={76} title="INTERNAL" lines={['knowledge sharing', 'with colleagues']} />
      <Box id="external" x={188} y={150} w={164} h={76} title="EXTERNAL" lines={['knowledge sharing', 'with outsiders']} />
    </g>
    <g data-step="3">
      <Arrow x1={90} y1={226} x2={130} y2={300} />
      <Arrow x1={270} y1={226} x2={230} y2={300} dashed faint />
      <text x={W - 10} y={276} textAnchor="end" fontSize="12.5" fill="var(--ink-2)" {...ui}>not significant</text>
      <text x={W - 10} y={292} textAnchor="end" fontSize="12.5" fill="var(--ink-2)" {...ui}>in Study 2</text>
      <line x1={180} y1={100} x2={180} y2={300} stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x={186} y={140} fontSize="12" fill="var(--ink-2)" {...ui}>direct</text>
      <Box id="capacity" x={8} y={300} w={W - 16} h={98} title="CREATIVE PROBLEM-SOLVING CAPACITY" lines={['generate: construct, search, ideate', 'implement: evaluate, select, plan']} />
    </g>
    <g data-step="4">
      <Arrow x1={110} y1={398} x2={90} y2={450} />
      <Arrow x1={250} y1={398} x2={270} y2={450} />
      <Box id="fluency" x={8} y={450} w={164} h={76} title="FLUENCY" lines={['number of ideas']} />
      <Box id="originality" x={188} y={450} w={164} h={76} title="ORIGINALITY" lines={['ideas fewer than 1%', 'of the sample gave']} />
      <text x={W / 2} y={566} textAnchor="middle" fontSize="14" fill="var(--ink)" {...ui}>Study 2: internal sharing → capacity</text>
      <text x={W / 2} y={588} textAnchor="middle" fontSize="14" fill="var(--ink)" {...ui}>→ originality (full mediation)</text>
    </g>
  </svg>
);

export default function LeadershipAndKnowledgeSharing() {
  return (
    <Diagram
      label="From leader supportive behaviours to creative performance, through knowledge sharing"
      terms={[
        { term: 'Knowledge sharing', def: 'Activities that transfer or disseminate knowledge from one person or group to another.' },
        { term: 'Creative problem-solving capacity', def: 'The capability, which can be cultivated, to generate ideas and carry them through to implementation.' },
        { term: 'Fluency / originality', def: 'Number of ideas / ideas so rare fewer than 1% of the sample gave them.' },
      ]}
      figure={figure}
      steps={[
        { caption: 'It starts with leaders who model collaboration and knowledge sharing and encourage information exchange, openness and idea sharing.' },
        { caption: 'Those behaviours relate to knowledge sharing inside the organisation (with colleagues) and outside it (with other people).' },
        { caption: 'Both kinds of sharing, and the leader directly, relate to creative problem-solving capacity — though in Study 2 external sharing was not significant.' },
        { caption: 'Capacity relates to fluency and originality; in Study 2 it fully mediated the link from internal sharing to originality.' },
      ]}
      check={{
        question: 'In Study 2, which route to originality did the mediation test support?',
        options: [
          { text: 'External sharing → creative problem solving → originality', why: 'In Study 2 external sharing was not significantly related to creative problem solving.' },
          { text: 'Internal sharing → creative problem solving → originality', correct: true, why: 'Creative problem solving fully mediated the link between internal knowledge sharing and originality.' },
          { text: 'Leader → originality, with nothing in between', why: 'The tested chain runs through knowledge sharing and creative problem-solving capacity.' },
        ],
      }}
    />
  );
}
