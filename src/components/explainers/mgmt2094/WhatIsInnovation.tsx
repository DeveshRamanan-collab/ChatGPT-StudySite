/*
SCENE: What innovation is — the three circles (desirable, possible, viable)
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → switch each circle on or off → watch the centre → one check
INTENT: Innovation is invention + commercialisation, and it sits only where what is desirable to users, what is
  possible with technology and what is viable in the marketplace overlap; missing any one circle leaves an idea, a
  wish or an invention, not an innovation.
SUBJECT: the centre of the Venn diagram; it carries the one accent outline only when all three circles are on.
BEAT 1 (0–100%): three toggles. Each circle's faint fill cross-fades (opacity 180ms --ease-out; none when motion is
  off); the centre label reads "innovation" or names the missing circle; the verdict and the "what changed" line
  update within 200ms, citing the jetpack (lecture) or Lego's brick (Reed, 2018) where that circle is the one missing.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: same controls and view; no positional movement at all; off removes the opacity fade too.
BUDGET: < 6 KB gz, no WebGL. 360-unit canvas so the circle labels stay legible on phones.
Source: concept mgmt2094-w08-what-is-innovation (Week 8 slides 3, 5 and 10; lecture recording on the jetpack);
  authorities mgmt2094-example-jetpack, mgmt2094-reed-2018-lego-plastic-free-brick.
*/
import { useMemo } from 'react';
import { Simulation, type SimView } from '../bases/Simulation';
import { useExplainer } from '../context';

interface S extends Record<string, unknown> {
  desirable: boolean;
  possible: boolean;
  viable: boolean;
}

const initial: S = { desirable: true, possible: false, viable: false };

const W = 360;
const H = 340;
const ui = { fontFamily: 'var(--font-ui)' } as const;
const serif = { fontFamily: 'var(--font-body)' } as const;

const CIRCLES = [
  { key: 'desirable', cx: 180, cy: 104, lines: ['DESIRABLE', 'to users'], tx: 180, ty: 62 },
  { key: 'possible', cx: 128, cy: 190, lines: ['POSSIBLE', 'with technology'], tx: 92, ty: 292 },
  { key: 'viable', cx: 232, cy: 190, lines: ['VIABLE', 'in the marketplace'], tx: 268, ty: 292 },
] as const;
const R = 80;

const missing = (s: S) => CIRCLES.filter((c) => !s[c.key]).map((c) => c.key);

function makeView(fade: string) {
  return (s: S): SimView => {
    const miss = missing(s);
    const all = miss.length === 0;
    const figure = (
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Three circles: desirable ${s.desirable ? 'on' : 'off'}, possible ${s.possible ? 'on' : 'off'}, viable ${s.viable ? 'on' : 'off'}; the centre is ${all ? 'innovation' : 'not yet innovation'}`}>
        {CIRCLES.map((c) => (
          <g key={c.key} data-circle={c.key} data-on={s[c.key] || undefined}>
            <circle cx={c.cx} cy={c.cy} r={R} fill="var(--ink)" style={{ opacity: s[c.key] ? 0.08 : 0, transition: fade }} />
            <circle cx={c.cx} cy={c.cy} r={R} fill="none" stroke={s[c.key] ? 'var(--ink)' : 'var(--ink-3)'} strokeWidth="1.5" strokeDasharray={s[c.key] ? undefined : '5 5'} />
            <text x={c.tx} y={c.ty} textAnchor="middle" {...ui} fontSize="11" letterSpacing="1.2" fill={s[c.key] ? 'var(--ink)' : 'var(--ink-3)'}>{c.lines[0]}</text>
            <text x={c.tx} y={c.ty + 16} textAnchor="middle" {...serif} fontSize="12" fill={s[c.key] ? 'var(--ink-2)' : 'var(--ink-3)'}>{c.lines[1]}</text>
          </g>
        ))}
        <circle cx="180" cy="162" r="26" fill="none" stroke="var(--accent)" strokeWidth="2" style={{ opacity: all ? 1 : 0, transition: fade }} />
        <text x="180" y="166" textAnchor="middle" {...ui} fontSize="10" letterSpacing="1" fill={all ? 'var(--ink)' : 'var(--ink-3)'} data-centre={all ? 'innovation' : 'missing'}>
          {all ? 'INNOVATION' : '?'}
        </text>
        <text x={W / 2} y={H - 6} textAnchor="middle" {...serif} fontSize="12" fill="var(--ink-2)">
          {all ? 'all three overlap: it can be commercialised' : `missing: ${miss.join(', ')}`}
        </text>
      </svg>
    );
    let verdict: string;
    if (all) verdict = 'Innovation: desirable to users, possible with technology and viable in the marketplace — it can be commercialised. Invention + commercialisation.';
    else if (miss.length === 3) verdict = 'Nothing yet: no one wants it, it cannot be built and it cannot be sold.';
    else if (miss.length === 1 && miss[0] === 'viable') verdict = 'Not yet an innovation: wanted and buildable, but not viable in the marketplace, so it cannot be commercialised — at most an invention. The jetpack: long desirable, technology only now arriving, extremely expensive.';
    else if (miss.length === 1 && miss[0] === 'possible') verdict = "Not yet an innovation: wanted, and a market is there, but the technology cannot deliver it yet. Lego's plastic-free brick (Reed, 2018): around 200 materials tried, most have fallen short.";
    else if (miss.length === 1) verdict = 'Not an innovation: it could be built and sold, but it is not desirable to users, so there is nothing for anyone to adopt.';
    else verdict = `Not an innovation: only ${CIRCLES.find((c) => s[c.key])?.key} so far. Innovation needs all three circles to overlap.`;
    return { figure, verdict, tone: all ? 'yes' : miss.length === 3 ? 'open' : 'no' };
  };
}

function describe(a: S, b: S) {
  const k = (['desirable', 'possible', 'viable'] as const).find((key) => a[key] !== b[key]);
  if (!k) return '';
  const on = b[k];
  if (k === 'desirable') return on ? 'Users now want it: the first circle — what is desirable to users — is in.' : 'No longer desirable to users: without people who want it, there is nothing to commercialise.';
  if (k === 'possible') return on ? 'The technology can now deliver it: the second circle is in.' : 'The technology cannot deliver it yet — the circle that has held up Lego\'s plastic-free brick.';
  return on ? 'It can now be sold at a price that sustains it: viable in the marketplace.' : 'It cannot be sold at a price that sustains it: not viable, so it cannot be commercialised.';
}

export default function WhatIsInnovation() {
  const { motion } = useExplainer();
  const fade = motion === 'off' ? 'none' : 'opacity 180ms var(--ease-out)';
  const view = useMemo(() => makeView(fade), [fade]);
  return (
    <Simulation<S>
      label="What innovation is: switch the three circles of the Venn diagram on and off and watch the centre"
      terms={[
        { term: 'Innovation', def: 'An idea, practice or object perceived as new by a unit of adoption: invention + commercialisation.' },
        { term: 'Invention', def: 'The creation of a new product, service or process; it may not be commercialised.' },
        { term: 'Viable', def: 'Able to be introduced to the marketplace and sustained there — sold at a price that works.' },
      ]}
      initial={initial}
      controls={[
        { key: 'desirable', label: 'Desirable to users', type: 'toggle' },
        { key: 'possible', label: 'Possible with technology', type: 'toggle' },
        { key: 'viable', label: 'Viable in the marketplace', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'A prototype works and users love it in trials, but no price customers would pay covers its cost. On the Week 8 materials, what is it?',
        options: [
          { text: 'An innovation, because it is new and wanted', why: 'New and wanted is only one circle (plus a working prototype); without marketplace viability it cannot be commercialised, so it is not yet an innovation.' },
          { text: 'Not yet an innovation: it fails the viable circle', correct: true, why: 'It is desirable and possible, but not viable in the marketplace, so it cannot be commercialised — at most an invention.' },
          { text: 'Not an innovation, because it fails the possible circle', why: 'The prototype works, so it is possible with technology; the circle it fails is viability.' },
        ],
      }}
    />
  );
}
