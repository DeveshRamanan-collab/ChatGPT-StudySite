/*
SCENE: Why reflect? Learning from experience
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: Experience alone is not enough to learn: unreflected, it fades; poured into a container (the Pensieve;
  reflective writing) and examined, it shows patterns and links — reflection is mental processing with a purpose.
SUBJECT: nine dots (experiences, thoughts, memories) — first crowding the head, then fading, then moving into the basin
  where links appear between them.
BEAT 1 (0–25%): dots appear one by one inside the "head" circle; caption: having experience is not enough. Ease none
  (scrubbed); opacity only.
BEAT 2 (25–50%): the dots fade to faint ink; label "quickly forgotten · learning potential lost".
BEAT 3 (50–75%): the basin draws in; the dots move into it (transform: translate) and return to full ink; label "the
  container: reflective writing (the Pensieve)".
BEAT 4 (75–100%): links fade in between dots in the basin (patterns and links); Moon's definition labels the basin;
  the one accent element is the "patterns and links" label.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame (dots linked in the basin) with all four captions stacked.
BUDGET: < 8 KB gz, no WebGL. Wide (head left, basin right) and tall (head above, basin below) layouts.
Source: concept mgmt2094-w06-why-reflect; authorities mgmt2094-moon-1999, mgmt2094-dewey-reflecting-on-experience,
  mgmt2094-example-pensieve (Week 6 lecture slides 2–3; Week 9 transcript, reflective-writing segment).
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const clamp = (x: number) => Math.max(0, Math.min(1, x));

// Nine dots: offsets inside the head (around its centre) and inside the basin (around its centre).
const HEAD = [[-48, -38], [6, -58], [52, -30], [-60, 10], [-6, -8], [44, 18], [-34, 48], [16, 40], [58, 58]] as const;
const BASIN = [[-90, -20], [-30, -26], [30, -24], [90, -18], [-60, 10], [0, 4], [60, 8], [-24, 32], [28, 34]] as const;
// Links drawn in beat 4: three short chains — the patterns that show once the thoughts are laid out.
const LINKS = [[0, 4], [4, 7], [1, 5], [5, 8], [2, 6], [6, 3]] as const;

interface Geo { w: number; h: number; head: [number, number]; headR: number; basin: [number, number]; basinW: number; label: number }

const WIDE: Geo = { w: 720, h: 300, head: [150, 140], headR: 100, basin: [520, 150], basinW: 300, label: 13 };
const TALL: Geo = { w: 360, h: 520, head: [180, 130], headR: 100, basin: [180, 370], basinW: 300, label: 13 };

function draw(t: number, g: Geo, cls: string) {
  const [hx, hy] = g.head;
  const [bx, by] = g.basin;
  const fadeT = clamp(t - 1); // beat 2: fade
  const moveT = clamp(t - 2); // beat 3: move into basin
  const linkT = clamp(t - 3); // beat 4: links
  const half = g.basinW / 2;
  const bowl = `M${bx - half} ${by - 40} Q ${bx - half + 10} ${by + 70}, ${bx} ${by + 70} Q ${bx + half - 10} ${by + 70}, ${bx + half} ${by - 40}`;
  const ui = { fontFamily: 'var(--font-ui)', fontSize: g.label } as const;
  const pos = (i: number) => {
    const [mx, my] = HEAD[i];
    const [px, py] = BASIN[i];
    const sx = hx + mx, sy = hy + my;
    const ex = bx + px, ey = by + py;
    return { sx, sy, dx: (ex - sx) * moveT, dy: (ey - sy) * moveT, ex, ey };
  };
  return (
    <svg className={cls} viewBox={`0 0 ${g.w} ${g.h}`} role="img" aria-label="Experiences crowd the head and fade unless poured into a basin, where links between them appear">
      <circle cx={hx} cy={hy} r={g.headR} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <text x={hx} y={hy - g.headR - 10} textAnchor="middle" {...ui} fill="var(--ink-2)">YOUR HEAD: TOO MANY THOUGHTS</text>
      <text x={hx} y={hy + g.headR + 22} textAnchor="middle" {...ui} fill="var(--ink-2)" style={{ opacity: fadeT * (1 - moveT) }}>
        quickly forgotten · learning potential lost
      </text>
      <g style={{ opacity: moveT }}>
        <path d={bowl} fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <line x1={bx - half} y1={by - 40} x2={bx + half} y2={by - 40} stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="4 5" />
        <text x={bx} y={by + 92} textAnchor="middle" {...ui} fill="var(--ink-2)">the container: reflective writing (the Pensieve)</text>
      </g>
      <g style={{ opacity: linkT }}>
        {LINKS.map(([a, b]) => {
          const pa = pos(a), pb = pos(b);
          return <line key={`${a}-${b}`} x1={pa.ex} y1={pa.ey} x2={pb.ex} y2={pb.ey} stroke="var(--ink)" strokeWidth="1.25" />;
        })}
        <text x={bx} y={by - 58} textAnchor="middle" {...ui} fontSize={g.label + 1} fill="var(--accent)">patterns and links</text>
        <text x={bx} y={by + 112} textAnchor="middle" fontFamily="var(--font-body)" fontStyle="italic" fontSize={g.label} fill="var(--ink-2)">
          "a form of mental processing with a purpose" (Moon, 1999)
        </text>
      </g>
      {HEAD.map((_, i) => {
        const p = pos(i);
        const appear = clamp(t * 1.15 - i * 0.1);
        const op = appear * (1 - 0.75 * fadeT * (1 - moveT));
        return (
          <circle key={i} cx={p.sx} cy={p.sy} r="6" fill="var(--ink)"
            style={{ opacity: op, transform: `translate(${p.dx}px, ${p.dy}px)` }} />
        );
      })}
    </svg>
  );
}

function scene(t: number) {
  return <>{draw(t, WIDE, 'x-wide')}{draw(t, TALL, 'x-tall')}</>;
}

export default function WhyReflect() {
  return (
    <ScrollExplainer
      label="Why reflect: experiences fade unless you pour them out and look for patterns"
      terms={[
        { term: 'Reflection', def: '"A form of mental processing with a purpose" (Moon, 1999).' },
        { term: 'The Pensieve', def: "Dumbledore's stone basin: he pours excess thoughts into it and examines them at leisure." },
        { term: 'Learning potential', def: 'What an experience could teach you — lost if you never reflect on it.' },
      ]}
      beats={[
        { caption: 'Group meetings, decisions, frustrations: experience piles up. But it is not sufficient merely to have experience in order to learn.' },
        { caption: 'Without reflecting, an experience may be quickly forgotten, or its learning potential lost. The lecturer adds that constant distraction leaves little time to reflect.' },
        { caption: 'Like Dumbledore with the Pensieve, siphon the excess thoughts out of your head. For us, the container is reflective writing.' },
        { caption: 'Laid out and examined at leisure, it becomes easier to spot patterns and links. We learn from reflecting on experience: mental processing with a purpose.' },
      ]}
      scene={scene}
      check={{
        question: 'According to the "Why reflect?" slide, what happens to an experience you never reflect on?',
        options: [
          { text: 'It still teaches you, just more slowly', why: 'The slide says the opposite: merely having experience is not sufficient in order to learn.' },
          { text: 'It may be quickly forgotten, or its learning potential lost', correct: true, why: 'That is the slide\'s wording; reflection, "mental processing with a purpose", is what turns experience into learning.' },
          { text: 'It becomes theory once enough time has passed', why: 'Building theory from observation is a purpose of reflection; without reflecting, nothing is built.' },
        ],
      }}
    />
  );
}
