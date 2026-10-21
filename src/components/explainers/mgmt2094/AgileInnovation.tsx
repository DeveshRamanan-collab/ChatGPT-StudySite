/*
SCENE: Agile innovation — from the waterfall to the loop, then the four values
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: Show what agile replaced (waterfall: plans fixed up front, passed function to function), what it is (a
  self-managed team prototyping, testing and learning in a loop, with two key roles), and the four manifesto values
  as balances tipped toward their left-hand item.
SUBJECT: beats 1–3 the work's path (a one-way staircase, then a loop); beat 4 the four beams tipping.
BEAT 1 (0–25%): waterfall staircase draws box by box (opacity, ease none); caption: plans up front, passed on.
BEAT 2 (25–50%): the agile loop — prototype → test → learn around a self-managed team.
BEAT 3 (50–75%): the two key roles attach to the loop: team leader, process facilitator.
BEAT 4 (75–100%): staircase and loop fade back; four balances fade in and tip (transform: rotate, scrubbed, ease none).
CAMERA: none (2D SVG; wide and tall variants via .x-wide / .x-tall). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame (the four balances) with all four captions stacked.
BUDGET: < 6 KB gz.
Source: concept mgmt2094-w10-agile-innovation; slide 2 (definition, two key roles); Embracing Agile sidebar 'Agile
  Values and Principles' (waterfall, the four values); tutor slides (SW) 5 for the manifesto's own wording (Beck et al., 2001).
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ui = { fontFamily: 'var(--font-ui)' } as const;
const VALUES: [string, string][] = [
  ['people', 'processes and tools'],
  ['responding to change', 'following a plan'],
  ['working prototypes', 'excessive documentation'],
  ['customer collaboration', 'rigid contracts'],
];

function Step({ x, y, w, label, o }: { x: number; y: number; w: number; label: string; o: number }) {
  return (
    <g opacity={o}>
      <rect x={x} y={y} width={w} height="36" rx="6" fill="none" stroke="var(--ink)" strokeWidth="1.4" />
      <text x={x + w / 2} y={y + 23} textAnchor="middle" {...ui} fontSize="13" fill="var(--ink)">{label}</text>
    </g>
  );
}

function Waterfall({ t, x0, y0, dx, dy, w }: { t: number; x0: number; y0: number; dx: number; dy: number; w: number }) {
  const labels = ['requirements & plans', 'function', 'function', 'delivery'];
  return (
    <g>
      <text x={x0} y={y0 - 12} {...ui} fontSize="12" letterSpacing="1.5" fill="var(--ink-2)">WATERFALL</text>
      {labels.map((l, k) => {
        const o = clamp((t - k * 0.2) / 0.2);
        const x = x0 + k * dx, y = y0 + k * dy;
        return (
          <g key={k}>
            <Step x={x} y={y} w={w} label={l} o={o} />
            {k > 0 && <line x1={x + 35} y1={y - dy + 36} x2={x + 35} y2={y} stroke="var(--ink-3)" strokeWidth="1.3" opacity={o} />}
          </g>
        );
      })}
      <text x={x0 + 3 * dx + w / 2} y={y0 + 3 * dy + 58} textAnchor="middle" fontFamily="var(--font-body)" fontStyle="italic" fontSize="13" fill="var(--ink-2)" opacity={clamp((t - 0.8) / 0.2)}>specification out of date</text>
    </g>
  );
}

function Loop({ t, cx, cy, r }: { t: number; cx: number; cy: number; r: number }) {
  const o = clamp(t - 1);
  const nodes: [string, number][] = [['prototype', -90], ['test', 30], ['learn', 150]];
  const roles = clamp(t - 2);
  return (
    <g>
      <g opacity={o}>
        <text x={cx - r} y={cy - r - 18} {...ui} fontSize="12" letterSpacing="1.5" fill="var(--ink-2)">AGILE</text>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="10 7" />
        <text x={cx} y={cy - 4} textAnchor="middle" {...ui} fontSize="13" fill="var(--ink)">self-managed</text>
        <text x={cx} y={cy + 14} textAnchor="middle" {...ui} fontSize="13" fill="var(--ink)">team</text>
        {nodes.map(([l, a]) => {
          const rad = (a * Math.PI) / 180;
          const nx = cx + r * Math.cos(rad), ny = cy + r * Math.sin(rad);
          return (
            <g key={l}>
              <circle cx={nx} cy={ny} r="5" fill="var(--ink)" />
              <text x={nx + (a === 150 ? -10 : a === 30 ? 10 : 0)} y={ny + (a === -90 ? -12 : 20)} textAnchor={a === 150 ? 'end' : a === 30 ? 'start' : 'middle'} fontFamily="var(--font-body)" fontSize="14" fill="var(--ink)">{l}</text>
            </g>
          );
        })}
      </g>
      <g opacity={roles}>
        {(['team leader', 'process facilitator'] as const).map((l, k) => {
          const x = cx + (k === 0 ? -1 : 1) * (r * 0.9);
          const y = cy + r + 52;
          return (
            <g key={l}>
              <line x1={cx + (k === 0 ? -1 : 1) * r * 0.5} y1={cy + r * 0.87} x2={x} y2={y - 14} stroke="var(--ink-3)" strokeWidth="1.3" />
              <text x={x} y={y + 4} textAnchor="middle" {...ui} fontSize="13" fontWeight="600" fill="var(--ink)">{l}</text>
            </g>
          );
        })}
      </g>
    </g>
  );
}

function Balance({ cx, cy, half, heavy, light, tilt, o }: { cx: number; cy: number; half: number; heavy: string; light: string; tilt: number; o: number }) {
  const rad = (tilt * Math.PI) / 180;
  return (
    <g opacity={o}>
      <path d={`M${cx - 10} ${cy + 26} L${cx} ${cy + 4} L${cx + 10} ${cy + 26} Z`} fill="none" stroke="var(--ink-2)" strokeWidth="1.3" />
      <g transform={`rotate(${tilt} ${cx} ${cy})`}>
        <line x1={cx - half} y1={cy} x2={cx + half} y2={cy} stroke="var(--ink)" strokeWidth="2" />
        <circle cx={cx - half} cy={cy} r="4" fill="var(--ink)" />
        <circle cx={cx + half} cy={cy} r="4" fill="var(--paper)" stroke="var(--ink-2)" strokeWidth="1.3" />
      </g>
      <g transform={`translate(0 ${-half * Math.sin(rad)})`}><text x={cx - half} y={cy + 30} textAnchor="middle" {...ui} fontSize="13.5" fontWeight="600" fill="var(--ink)">{heavy}</text></g>
      <g transform={`translate(0 ${half * Math.sin(rad)})`}><text x={cx + half} y={cy + 30} textAnchor="middle" {...ui} fontSize="13" fill="var(--ink-2)">{light}</text></g>
      <text x={cx} y={cy - 12} textAnchor="middle" fontFamily="var(--font-body)" fontStyle="italic" fontSize="12.5" fill="var(--ink-2)">over</text>
    </g>
  );
}

function values(t: number, at: [number, number][], half: number) {
  const o = clamp((t - 3) / 0.4);
  const tilt = -10 * clamp((t - 3.2) / 0.8);
  return VALUES.map(([h, l], k) => <Balance key={h} cx={at[k][0]} cy={at[k][1]} half={half} heavy={h} light={l} tilt={tilt} o={o} />);
}

function wide(t: number) {
  const back = 1 - 0.88 * clamp((t - 3) / 0.4);
  return (
    <svg className="x-wide" viewBox="0 0 760 360" role="img" aria-label="Waterfall as a one-way staircase beside the agile loop; then the four agile values as balances">
      <g opacity={back}>
        <Waterfall t={t} x0={20} y0={40} dx={80} dy={62} w={150} />
        <Loop t={t} cx={590} cy={150} r={80} />
      </g>
      {values(t, [[200, 100], [585, 100], [200, 250], [585, 250]], 110)}
    </svg>
  );
}

function tall(t: number) {
  const back = 1 - 0.88 * clamp((t - 3) / 0.4);
  return (
    <svg className="x-tall" viewBox="0 0 360 600" role="img" aria-label="Waterfall as a one-way staircase above the agile loop; then the four agile values as balances">
      <g opacity={back}>
        <Waterfall t={t} x0={10} y0={34} dx={56} dy={50} w={150} />
        <Loop t={t} cx={180} cy={390} r={72} />
      </g>
      {values(t, [[185, 60], [185, 195], [185, 330], [185, 465]], 95)}
    </svg>
  );
}

export default function AgileInnovation() {
  return (
    <ScrollExplainer
      label="Agile innovation: from waterfall to the agile loop and its four values"
      terms={[
        { term: 'Waterfall', def: 'Detailed requirements and plans made up front, then passed from function to function.' },
        { term: 'Self-managed team', def: 'A high-intensity team (a scrum) that organises its own work.' },
        { term: 'Process facilitator', def: 'One of agile’s two key roles, with the team leader.' },
        { term: 'Agile Manifesto', def: 'The four values 17 software developers (Beck et al.) set out in 2001; the reading adapts their wording.' },
      ]}
      beats={[
        { caption: 'Waterfall: detailed requirements and plans are made up front and passed from function to function — fine in stable markets, but out of date by delivery when markets change fast.' },
        { caption: 'Agile innovation, from software development: high-intensity, self-managed team work, with rapid prototyping, testing and learning — more open-ended than traditional project management.' },
        { caption: 'The slides name two key roles within agile innovation: the team leader and the process facilitator.' },
        { caption: 'The four values, as the reading adapts the Agile Manifesto (2001): people over processes and tools; responding to change over following a plan; working prototypes over excessive documentation; customer collaboration over rigid contracts. The manifesto’s own words (Beck et al.): individuals and interactions, working software over comprehensive documentation, customer collaboration over contract negotiation.' },
      ]}
      scene={(t) => <>{wide(t)}{tall(t)}</>}
      check={{
        question: 'A team writes a 200-page specification instead of building anything customers could try. Which agile value does it break most clearly?',
        options: [
          { text: 'Working prototypes over excessive documentation', correct: true, why: 'It chose documents over a prototype customers could test — the value says the reverse.' },
          { text: 'Customer collaboration over rigid contracts', why: 'No contract is involved; the failure is building documents rather than something to test.' },
          { text: 'People over processes and tools', why: 'A specification is a process artefact, but the clearest breach is documentation in place of a prototype.' },
        ],
      }}
    />
  );
}
