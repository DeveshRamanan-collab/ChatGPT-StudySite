/*
SCENE: Trespass — voluntary act, then actionable per se: two gates
LENGTH: 4 screens pinned (desktop, full motion); 4 paced beats otherwise
BEATS: 4
INTENT: Only a positive, voluntary act gets through the first gate; once through, the second gate opens with no
  proof of damage — unlike an action on the case.
SUBJECT: the conduct token moving down through the gates.
BEAT 1 (0–25%): three non-acts (epileptic fit, third-party force, omission) press at gate 1 and bounce off; crossed.
  Motion: translateY, scrubbed (ease none), sine bounce.
BEAT 2 (25–50%): "a positive act" — gate 1's halves slide back to their posts (scaleX), the token passes through.
BEAT 3 (50–75%): gate 2 "actionable per se" slides open without any damage token; the token passes.
BEAT 4 (75–100%): the contrast fades in — in case, damage is part of the cause of action.
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: final frame with all four captions stacked (base).
BUDGET: < 6 KB gz. Transform and opacity only.
Source: concept laws2400-w01-trespass-voluntary-act-and-damage (no cases or authorities linked).
*/
import { ScrollExplainer } from '../bases/ScrollExplainer';

const W = 360;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ui = { fontFamily: 'var(--font-ui)', fontSize: 12.5, fill: 'var(--ink)' } as const;

function Token({ x, y, label, dim }: { x: number; y: number; label: string; dim?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={dim ? 0.55 : 1}>
      <rect x="-62" y="-14" width="124" height="28" rx="14" fill="var(--paper)" stroke={dim ? 'var(--ink-3)' : 'var(--ink)'} strokeWidth="1.5" />
      <text textAnchor="middle" y="4.5" {...ui}>{label}</text>
    </g>
  );
}

// A gate whose two halves slide back to their posts (0 = shut, 1 = open), via scaleX from each hinge.
function Gate({ y, open, title }: { y: number; open: number; title: string }) {
  const s = 1 - open * 0.85;
  return (
    <g>
      <text x="8" y={y - 12} fontFamily="var(--font-ui)" fontSize="12" letterSpacing="1.5" fill="var(--ink-2)">{title}</text>
      <line x1="8" y1={y} x2="8" y2={y} stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" />
      <line x1={W - 8} y1={y} x2={W - 8} y2={y} stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" />
      <line x1="0" y1="0" x2={W / 2 - 8} y2="0" stroke="var(--ink)" strokeWidth="2" transform={`translate(8 ${y}) scale(${s} 1)`} />
      <line x1="0" y1="0" x2={-(W / 2 - 8)} y2="0" stroke="var(--ink)" strokeWidth="2" transform={`translate(${W - 8} ${y}) scale(${s} 1)`} />
    </g>
  );
}

function scene(t: number) {
  const p1 = clamp(t), p2 = clamp(t - 1), p3 = clamp(t - 2), p4 = clamp(t - 3);
  const bounce = Math.sin(Math.PI * clamp(p1 * 1.25)) * 30;
  const crossed = p1 > 0.6;
  const tokenY = 60 + p2 * 170 + p3 * 170;
  return (
    <svg viewBox={`0 0 ${W} 480`} role="img" aria-label="Two gates: a positive voluntary act, then actionable per se">
      {['epileptic fit', 'third-party force', 'omission'].map((l, i) => (
        <g key={l} transform={`translate(0 ${bounce})`}>
          <Token x={96} y={30 + i * 36} label={l} dim={crossed} />
          {crossed && <line x1="10" y1={38 + i * 36} x2="22" y2={22 + i * 36} stroke="var(--clay)" strokeWidth="2" />}
        </g>
      ))}
      <Gate y={170} open={clamp((p2 - 0.2) / 0.3)} title="GATE 1 · POSITIVE, VOLUNTARY ACT" />
      <Gate y={340} open={clamp((p3 - 0.1) / 0.3)} title="GATE 2 · ACTIONABLE PER SE" />
      <text x={W / 2} y="366" textAnchor="middle" fontFamily="var(--font-body)" fontSize="14" fill="var(--ink-2)" opacity={clamp(p3 * 3)}>opens with no proof of damage</text>
      <g opacity={clamp(t * 4 - 3.2)}><Token x={270} y={tokenY} label="a positive act" /></g>
      <g opacity={p4}>
        <rect x="8" y="400" width="190" height="72" rx="12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="6 6" />
        <text x="22" y="424" fontFamily="var(--font-ui)" fontSize="12" letterSpacing="1.5" fill="var(--ink)">ACTION ON THE CASE</text>
        <text x="22" y="446" fontFamily="var(--font-body)" fontSize="14" fill="var(--ink-2)">damage must be proved</text>
        <text x="22" y="464" fontFamily="var(--font-body)" fontSize="14" fill="var(--ink-2)">as part of the action</text>
      </g>
    </svg>
  );
}

export default function TrespassVoluntaryActAndDamage() {
  return (
    <ScrollExplainer
      label="Two gates of trespass: a positive voluntary act, then actionable per se"
      terms={[
        { term: 'Positive act', def: 'Voluntary conduct by the defendant — a merely passive act will not do.' },
        { term: 'Omission', def: 'A failure to act; not a positive act.' },
        { term: 'Actionable per se', def: 'Actionable without proof that any damage resulted.' },
      ]}
      beats={[
        { caption: 'Gate 1 only opens for a positive act. An act during an epileptic fit, an act caused by a third party’s force, and a mere omission bounce off.' },
        { caption: 'A positive, voluntary act gets through. Without it, trespass fails however directly the harm followed — so check this first.' },
        { caption: 'Gate 2: trespass is actionable per se. The interference itself founds the action — no damage needs to be proved.' },
        { caption: 'Why: trespass protects bodily integrity, liberty and property from direct interference. In an action on the case, damage must be proved.' },
      ]}
      scene={scene}
      check={{
        question: 'P proves a direct, voluntary interference but no measurable loss. Does her trespass claim fail?',
        options: [
          { text: 'Yes — without damage there is no cause of action', why: 'That is the rule for actions on the case, not trespass.' },
          { text: 'No — trespass is actionable per se', correct: true, why: 'The interference itself is enough; trespass protects bodily integrity, liberty and property regardless of loss.' },
          { text: 'Only if the act was an omission', why: 'An omission is not a positive act, so it would fail at the first gate, not rescue the claim.' },
        ],
      }}
    />
  );
}
