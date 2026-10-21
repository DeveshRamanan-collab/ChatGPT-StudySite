/*
SCENE: The flip mindset — zig when everyone else is zagging
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise (ScrollExplainer base)
BEATS: 4
INTENT: Show that the unit's mindset is not one contrary move but a repeated, on-demand movement between
  perspectives and paradigms, and ground it in Disney's 2005 iTunes deal.
SUBJECT: the single zig arrow, then the marker that flips between the two frames.
BEAT 1 (0–25%): a crowd of arrows all zagging (pointing one way); ease none (scrubbed); caption: the crowd. Each
  later beat's drawing arrives in the half-beat before its caption (paced mode plays it during the Next tween).
BEAT 2 (25–50%): one arrow zigs the other way; the crowd dims to ink-3; caption: a different mind set, counter-intuitive.
BEAT 3 (50–75%): two frames (one perspective/paradigm, another) and a marker flipping between them 1.5 times;
  caption: flip = repeatedly moving between perspectives and paradigms, in real time and on demand.
BEAT 4 (75–100%): the frames' labels cross-fade to Disney's tradition and the 2005 iTunes deal; Tim Cook's line
  appears beneath; caption: the example from the reading.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: off = final frame with the four captions stacked; calm = the marker steps between frames, no glide.
BUDGET: < 6 KB gz, no WebGL. Wide (760) and tall (360) drawings so text stays legible on phones.
Source: concept mgmt2094-w01-flip-mindset (Week 1 slide 2; lecture transcript; Lev-Ram 2015, Empire of Tech).
*/
import { useCallback } from 'react';
import { useExplainer } from '../context';
import { ScrollExplainer } from '../bases/ScrollExplainer';

const clamp = (v: number) => Math.max(0, Math.min(1, v));

interface Layout {
  w: number; h: number;
  crowd: { x: number; y: number }[];
  zig: { x: number; y: number };
  frameA: { x: number; y: number; w: number; h: number };
  frameB: { x: number; y: number; w: number; h: number };
  quoteY: number;
  labelX: number;
}

const WIDE: Layout = {
  w: 760, h: 320,
  crowd: [60, 120, 180].flatMap((y) => [40, 95, 150, 205].map((x) => ({ x, y }))),
  zig: { x: 290, y: 120 },
  frameA: { x: 400, y: 70, w: 160, h: 110 },
  frameB: { x: 590, y: 70, w: 160, h: 110 },
  quoteY: 250,
  labelX: 40,
};

const TALL: Layout = {
  w: 360, h: 560,
  crowd: [60, 115, 170].flatMap((y) => [24, 80, 136].map((x) => ({ x, y }))),
  zig: { x: 250, y: 115 },
  frameA: { x: 8, y: 300, w: 160, h: 120 },
  frameB: { x: 192, y: 300, w: 160, h: 120 },
  quoteY: 470,
  labelX: 24,
};

function Arrow({ x, y, up, stroke, width }: { x: number; y: number; up: boolean; stroke: string; width: number }) {
  // A short diagonal arrow: zag points down-right, zig points up-right.
  const dy = up ? -16 : 16;
  const x2 = x + 36, y2 = y + dy;
  const head = up
    ? `${x2 - 11},${y2 + 1} ${x2},${y2} ${x2 - 3},${y2 + 11}`
    : `${x2 - 11},${y2 - 1} ${x2},${y2} ${x2 - 3},${y2 - 11}`;
  return (
    <>
      <line x1={x} y1={y - dy} x2={x2} y2={y2} stroke={stroke} strokeWidth={width} strokeLinecap="round" />
      <polyline points={head} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

function FrameText({ cx, y, lines, opacity }: { cx: number; y: number; lines: string[]; opacity: number }) {
  return (
    <text x={cx} y={y} textAnchor="middle" fontFamily="var(--font-ui)" fontSize="13" fill="var(--ink)" style={{ opacity }}>
      {lines.map((l, i) => <tspan key={i} x={cx} dy={i === 0 ? 0 : 17}>{l}</tspan>)}
    </text>
  );
}

function draw(L: Layout, t: number, calm: boolean) {
  // Each beat's content arrives in the half-beat before its caption, so that in paced mode (where Next tweens t
  // from one whole number to the next) it plays during the tween and is complete when its caption appears.
  const crowdIn = 1;
  const zigIn = clamp((t - 0.5) * 2);
  const crowdOpacity = crowdIn * (1 - 0.6 * zigIn);
  const framesIn = clamp((t - 1.5) * 4);
  const p = clamp((t - 1.6) / 0.4);
  // 1.5 flips, ending in frame B as caption 3 appears; calm steps instead of gliding.
  const f = calm ? (p < 0.34 ? 0 : p < 0.67 ? 1 : p < 0.99 ? 0 : 1) : 0.5 - 0.5 * Math.cos(3 * Math.PI * p);
  const disney = clamp((t - 2.5) * 2);
  const ax = L.frameA.x + L.frameA.w / 2, bx = L.frameB.x + L.frameB.w / 2;
  const fy = L.frameA.y + L.frameA.h / 2;
  const markerX = ax + (bx - ax) * f;
  const arcTop = L.frameA.y - 26;
  return (
    <svg className={L.w > 400 ? 'x-wide' : 'x-tall'} viewBox={`0 0 ${L.w} ${L.h}`} role="img"
      aria-label="A crowd of arrows zags one way, one arrow zigs, then a marker flips between two perspectives; finally the perspectives become Disney's tradition and its 2005 iTunes deal">
      <text x={L.labelX} y="24" fontFamily="var(--font-ui)" fontSize="12" letterSpacing="1" fill="var(--ink-2)" style={{ opacity: crowdIn }}>EVERYONE ELSE: ZAG</text>
      <g style={{ opacity: crowdOpacity }}>
        {L.crowd.map((c, i) => <Arrow key={i} x={c.x} y={c.y} up={false} stroke="var(--ink-2)" width={1.5} />)}
      </g>
      <g style={{ opacity: zigIn }} data-beat="zig">
        <Arrow x={L.zig.x} y={L.zig.y} up stroke="var(--ink)" width={3} />
        <text x={L.zig.x + 18} y={L.zig.y + 44} textAnchor="middle" fontFamily="var(--font-ui)" fontSize="12" letterSpacing="1" fill="var(--ink)">YOU: ZIG</text>
      </g>
      <g style={{ opacity: framesIn }} data-beat="flip">
        {[L.frameA, L.frameB].map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} rx="12" fill="var(--paper)" stroke="var(--ink-3)" strokeWidth="1.5" />
        ))}
        <path d={`M${ax} ${L.frameA.y - 4} C ${ax} ${arcTop - 18}, ${bx} ${arcTop - 18}, ${bx} ${L.frameB.y - 4}`} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 5" />
        <text x={(ax + bx) / 2} y={arcTop - 22} textAnchor="middle" fontFamily="var(--font-ui)" fontSize="12" fill="var(--ink-2)">flip · real time · on demand</text>
        <FrameText cx={ax} y={fy - 8} lines={['one perspective', 'or paradigm']} opacity={1 - disney} />
        <FrameText cx={bx} y={fy - 8} lines={['another perspective', 'or paradigm']} opacity={1 - disney} />
        <FrameText cx={ax} y={fy - 16} lines={["Disney's tradition", 'and business model', '(shows air on ABC)']} opacity={disney} />
        <FrameText cx={bx} y={fy - 16} lines={['2005: ABC shows', 'on iTunes, the first', 'deal of its kind']} opacity={disney} />
        <circle cx={0} cy={0} r="8" fill="var(--ink)" style={{ transform: `translate(${markerX}px, ${L.frameA.y + L.frameA.h - 14}px)` }} />
      </g>
      <text x={L.w / 2} y={L.quoteY} textAnchor="middle" fontFamily="var(--font-body)" fontStyle="italic" fontSize="15" fill="var(--ink)" style={{ opacity: disney }}>
        <tspan x={L.w / 2} dy="0">"He understands the tradition of Disney</tspan>
        <tspan x={L.w / 2} dy="20">but isn't wedded to it." — Tim Cook</tspan>
      </text>
    </svg>
  );
}

export default function FlipMindset() {
  const { motion } = useExplainer();
  const calm = motion === 'calm';
  const scene = useCallback((t: number) => <>{draw(WIDE, t, calm)}{draw(TALL, t, calm)}</>, [calm]);
  return (
    <ScrollExplainer
      label="The flip mindset: zig when everyone else is zagging"
      terms={[
        { term: 'Zig / zag', def: 'Going a different way from the crowd: zig when everyone else is zagging.' },
        { term: 'Flip', def: 'Repeatedly moving between different perspectives and paradigms, in real time and on demand.' },
        { term: 'Counter-intuitive approach', def: 'The opposite of the obvious move; the slides say it reflects where business is heading.' },
        { term: 'Flexible mindset', def: 'A way of thinking and an approach to life, not a one-off technique.' },
      ]}
      beats={[
        { caption: 'Everyone else is zagging: the usual, intuitive move in the market.' },
        { caption: 'Zig when everyone else is zagging: a different mind set and a more counter-intuitive approach, which the slides say is where business is heading.' },
        { caption: "The flip is not one contrary move: it is repeatedly moving between perspectives and paradigms, in 'real' time and on demand. In a fast-moving world, and with AI supplying technical knowledge, this is what sets you apart." },
        { caption: "Example: in 2005 Bob Iger put ABC's Lost and Desperate Housewives on iTunes, a deal 'seemingly at odds with the company's business model' (Lev-Ram 2015)." },
      ]}
      scene={scene}
      check={{
        question: 'Which statement best captures the flip described on the Week 1 slides?',
        options: [
          { text: 'Always taking the opposite view to the crowd', why: 'A fixed contrary stance is just one more perspective; the flip means moving between perspectives repeatedly.' },
          { text: 'Repeatedly moving between perspectives and paradigms, on demand', correct: true, why: "Slide 2: the flip is repeatedly moving between different perspectives and paradigms, now done in 'real' time and on demand." },
          { text: 'Abandoning tradition entirely for new technology', why: "Tim Cook says Iger understands Disney's tradition but isn't wedded to it: he moves between paradigms rather than discarding one." },
        ],
      }}
    />
  );
}
