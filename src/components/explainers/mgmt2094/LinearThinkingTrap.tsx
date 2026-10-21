/*
SCENE: Linear thinking in a nonlinear world — the fleet problem
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → set two upgrades (from/to MPG) → read the gallons saved off the curve → one check
INTENT: Show that fuel used per 10,000 miles falls steeply, then flattens, as MPG rises, so the upgrade with the
  bigger MPG gain can save less fuel — the straight-line guess is wrong.
SUBJECT: the two vertical drops on the curve (gallons saved); the verdict compares them with the MPG gains.
BEAT 1 (0–100%): selects move the two drops along the curve; verdict updates within 200ms. Markers fade in
  (opacity 180ms ease-out); no positional tweening.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (no motion); off mode shows the same controls.
BUDGET: < 6 KB gz, no WebGL.
Source: concept mgmt2094-w04-linear-thinking-trap; de Langhe, Puntoni and Larrick (2017): gallons per 10,000 miles =
  10,000 ÷ MPG; 10→20 saves 500, 20→50 saves 300, 20→100 saves less than 10→20.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> { aFrom: string; aTo: string; bFrom: string; bTo: string }

const initial: S = { aFrom: '10', aTo: '20', bFrom: '20', bTo: '50' };

const gal = (mpg: number) => 10000 / mpg;
const X = (mpg: number) => 70 + mpg * 4.2;
const Y = (g: number) => 250 - g * 0.2;
const fmt = (n: number) => Math.round(n).toLocaleString('en-AU');
const ui = { fontFamily: 'var(--font-ui)' } as const;

const CURVE = Array.from({ length: 91 }, (_, i) => 10 + i).map((m, i) => `${i ? 'L' : 'M'}${X(m).toFixed(1)} ${Y(gal(m)).toFixed(1)}`).join(' ');

function Drop({ from, to, name, dashed }: { from: number; to: number; name: string; dashed?: boolean }) {
  if (!(to > from)) return null;
  const x1 = X(from), y1 = Y(gal(from)), x2 = X(to), y2 = Y(gal(to));
  const saved = gal(from) - gal(to);
  return (
    <g data-upgrade={name} style={{ animation: 'fade-in 180ms var(--ease-out) both' }}>
      <circle cx={x1} cy={y1} r="5" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
      <line x1={x1} y1={y1} x2={x2} y2={y1} stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1={x2} y1={y1} x2={x2} y2={y2} stroke="var(--ink)" strokeWidth="3" strokeDasharray={dashed ? '7 4' : undefined} />
      <circle cx={x2} cy={y2} r="5" fill="var(--ink)" />
      <text x={x2 + 8} y={(y1 + y2) / 2 + 5} fontSize="14" fill="var(--ink)" {...ui}>{name}: −{fmt(saved)} gal</text>
    </g>
  );
}

function view(s: S): SimView {
  const a = { f: +s.aFrom, t: +s.aTo }, b = { f: +s.bFrom, t: +s.bTo };
  const figure = (
    <svg viewBox="0 0 520 300" role="img" aria-label={`Fuel used per 10,000 miles against MPG, a curve that falls steeply then flattens; upgrade A from ${a.f} to ${a.t} MPG, upgrade B from ${b.f} to ${b.t} MPG`}>
      <text x={70} y={34} fontSize="13" fill="var(--ink-2)" {...ui}>gallons per 10,000 miles</text>
      <line x1={70} y1={50} x2={70} y2={250} stroke="var(--ink-3)" strokeWidth="1.5" />
      <line x1={70} y1={250} x2={494} y2={250} stroke="var(--ink-3)" strokeWidth="1.5" />
      {[0, 500, 1000].map((g) => (
        <text key={g} x={62} y={Y(g) + 4} textAnchor="end" fontSize="12" fill="var(--ink-2)" {...ui}>{fmt(g)}</text>
      ))}
      {[10, 20, 30, 50, 100].map((m) => (
        <g key={m}>
          <line x1={X(m)} y1={250} x2={X(m)} y2={256} stroke="var(--ink-3)" strokeWidth="1.5" />
          <text x={X(m)} y={272} textAnchor="middle" fontSize="12" fill="var(--ink-2)" {...ui}>{m}</text>
        </g>
      ))}
      <text x={494} y={292} textAnchor="end" fontSize="13" fill="var(--ink-2)" {...ui}>miles per gallon</text>
      <path d={CURVE} fill="none" stroke="var(--ink-2)" strokeWidth="2" />
      <Drop key={`a${a.f}-${a.t}`} from={a.f} to={a.t} name="A" />
      <Drop key={`b${b.f}-${b.t}`} from={b.f} to={b.t} name="B" dashed />
    </svg>
  );
  if (!(a.t > a.f) || !(b.t > b.f))
    return { figure, verdict: `Pick a higher "to" MPG than "from" MPG for upgrade ${!(a.t > a.f) ? 'A' : 'B'}.`, tone: 'open' };
  const gA = a.t - a.f, gB = b.t - b.f;
  const sA = gal(a.f) - gal(a.t), sB = gal(b.f) - gal(b.t);
  let verdict: string;
  let tone: SimView['tone'];
  if (gA === gB) {
    verdict = Math.round(sA) === Math.round(sB)
      ? `Both add ${gA} MPG and save the same ${fmt(sA)} gallons.`
      : `Both add ${gA} MPG, but A saves ${fmt(sA)} gallons and B ${fmt(sB)}: the same gain is worth far more at low MPG.`;
    tone = Math.round(sA) === Math.round(sB) ? 'open' : 'no';
  } else {
    const [big, small] = gA > gB ? [['A', gA, sA], ['B', gB, sB]] as const : [['B', gB, sB], ['A', gA, sA]] as const;
    if (Math.round(big[2]) < Math.round(small[2])) {
      verdict = `Upgrade ${big[0]} adds ${big[1]} MPG against ${small[1]}, yet saves only ${fmt(big[2])} gallons to ${fmt(small[2])}. The bigger MPG gain is not the bigger saving: fuel use is not a straight line.`;
      tone = 'no';
    } else if (Math.round(big[2]) > Math.round(small[2])) {
      verdict = `Here the bigger MPG gain (${big[0]}, +${big[1]}) also saves more: ${fmt(big[2])} gallons against ${fmt(small[2])}. Not always — the curve flattens as MPG rises.`;
      tone = 'yes';
    } else {
      verdict = `Different MPG gains, the same saving of ${fmt(sA)} gallons: only the curve can tell you that.`;
      tone = 'open';
    }
  }
  return { figure, verdict, tone };
}

function describe(p: S, n: S) {
  const which = p.aFrom !== n.aFrom || p.aTo !== n.aTo ? 'A' : 'B';
  const f = +(which === 'A' ? n.aFrom : n.bFrom), t = +(which === 'A' ? n.aTo : n.bTo);
  if (!(t > f)) return `Upgrade ${which} would not raise MPG.`;
  return `Upgrade ${which} now runs ${f} → ${t} MPG: ${fmt(gal(f))} → ${fmt(gal(t))} gallons per 10,000 miles.`;
}

const FROM = ['10', '20', '30', '50'].map((v) => ({ value: v, label: `${v} MPG` }));
const TO = ['20', '30', '50', '100'].map((v) => ({ value: v, label: `${v} MPG` }));

export default function LinearThinkingTrap() {
  return (
    <Simulation<S>
      label="The fleet problem: gallons used per 10,000 miles against miles per gallon, with two upgrades marked"
      terms={[
        { term: 'Linear bias', def: 'Our tendency to assume relationships are straight lines when they curve.' },
        { term: 'MPG', def: 'Miles per gallon; fuel used over 10,000 miles is 10,000 ÷ MPG.' },
        { term: 'Gallons saved', def: 'The drop on the curve between the old and the new MPG — the outcome, not the indicator.' },
      ]}
      initial={initial}
      controls={[
        { key: 'aFrom', label: 'Upgrade A — from', type: 'select', options: FROM },
        { key: 'aTo', label: 'Upgrade A — to', type: 'select', options: TO },
        { key: 'bFrom', label: 'Upgrade B — from', type: 'select', options: FROM },
        { key: 'bTo', label: 'Upgrade B — to', type: 'select', options: TO },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'Per 10,000 miles, which saves more fuel: upgrading a car from 10 to 20 MPG, or from 20 to 100 MPG?',
        options: [
          { text: '20 to 100 MPG — it adds 80 MPG', why: 'It saves 500 − 100 = 400 gallons; the big MPG gain sits on the flat end of the curve.' },
          { text: '10 to 20 MPG', correct: true, why: 'It saves 1,000 − 500 = 500 gallons, more than the 400 saved by 20 to 100 MPG, as the article says.' },
          { text: 'They save the same amount of fuel', why: 'They do not: 500 gallons against 400, because fuel use is not a linear function of MPG.' },
        ],
      }}
    />
  );
}
