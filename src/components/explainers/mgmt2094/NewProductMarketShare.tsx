/*
SCENE: The commercialisation problem — New Product Market Share (NPS) at Dow Corning
LENGTH: not pinned — a Simulation (learner-paced)
BEATS: terms → change the revenue figures → read NPS against Dow Corning's markers → one check
INTENT: Show that NPS is a ratio of revenue from newly commercialised products to total revenue, read against Dow
  Corning's 25% (1970s–80s) and 13% (1995), and that R&D spend (10% of revenue) is not part of the measure.
SUBJECT: the filled share of the revenue bar, and where its end sits against the 13% and 25% markers.
BEAT 1 (0–100%): selects set total and new-product revenue (illustrative figures); the bar fill, the % readout and the
  verdict update within 200ms. The optional R&D bar appears beneath at a fixed 10%. Ease: none (state swap).
CAMERA: none (2D SVG). LIGHT: none. SOUND: none.
REDUCED MOTION: identical (no motion); off mode shows the same controls.
BUDGET: < 6 KB gz, no WebGL.
Source: Week 9 slides 8–9 (10% of revenue on R&D; NPS = % of revenue from newly commercialised products; ~25% in the
1970s–80s, 13% by 1995); concept mgmt2094-w09-new-product-market-share. Revenue figures are illustrative inputs only.
*/
import { Simulation, type SimView } from '../bases/Simulation';

interface S extends Record<string, unknown> {
  total: '500' | '800' | '1000';
  fresh: '50' | '104' | '130' | '200' | '250';
  showRd: boolean;
}

const initial: S = { total: '800', fresh: '200', showRd: false };

const W = 360;
const X0 = 16;
const BW = W - 32;

function nps(s: S) {
  return (Number(s.fresh) / Number(s.total)) * 100;
}

function view(s: S): SimView {
  const p = nps(s);
  const pct = Math.round(p * 10) / 10;
  const fill = (Math.min(p, 100) / 100) * BW;
  const at = (v: number) => X0 + (v / 100) * BW;
  const rd = Number(s.total) * 0.1;
  const figure = (
    <svg viewBox={`0 0 ${W} ${s.showRd ? 284 : 196}`} role="img" aria-label={`New Product Market Share ${pct}% of revenue, against Dow Corning's 25% and 13% markers`}>
      <text x={X0} y="22" fontFamily="var(--font-ui)" fontSize="13" letterSpacing="1" fill="var(--ink-2)">TOTAL REVENUE · ${s.total}m</text>
      <rect x={X0} y="34" width={BW} height="40" rx="6" fill="var(--paper-3)" stroke="var(--line)" />
      <rect x={X0} y="34" width={fill} height="40" rx="6" fill="var(--ink)" data-fill />
      {[{ v: 13, l: '1995 · 13%' }, { v: 25, l: '1970s–80s · ~25%' }].map((m, i) => (
        <g key={m.v}>
          <line x1={at(m.v)} y1="28" x2={at(m.v)} y2="82" stroke="var(--ink-2)" strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1={at(m.v)} y1="82" x2={at(m.v)} y2={i ? 112 : 96} stroke="var(--ink-3)" strokeWidth="1" />
          <text x={at(m.v) + 5} y={i ? 116 : 100} fontFamily="var(--font-mono)" fontSize="12" fill="var(--ink-2)">{m.l}</text>
        </g>
      ))}
      <text x={X0} y="150" fontFamily="var(--font-body)" fontSize="16" fill="var(--ink)">
        NPS = ${s.fresh}m ÷ ${s.total}m = <tspan fontWeight="600">{pct}%</tspan>
      </text>
      <text x={X0} y="174" fontFamily="var(--font-ui)" fontSize="13" fill="var(--ink-2)">share of revenue from newly commercialised products</text>
      {s.showRd && (
        <g data-rd>
          <text x={X0} y="218" fontFamily="var(--font-ui)" fontSize="13" letterSpacing="1" fill="var(--ink-2)">R&amp;D SPEND · 10% OF REVENUE · ${rd}m</text>
          <rect x={X0} y="228" width={BW} height="16" rx="4" fill="none" stroke="var(--line)" />
          <rect x={X0} y="228" width={BW * 0.1} height="16" rx="4" fill="var(--ink-2)" />
          <text x={X0} y="268" fontFamily="var(--font-ui)" fontSize="13" fill="var(--ink-2)">An input: it does not appear in the NPS formula.</text>
        </g>
      )}
    </svg>
  );
  const verdict =
    p >= 25
      ? `NPS ${pct}%: at or above Dow Corning's level in the 1970s and 80s (around 25%).`
      : p > 13
        ? `NPS ${pct}%: below the old 25%, but above Dow Corning's 1995 low of 13%.`
        : `NPS ${pct}%: at or below Dow Corning's 1995 figure of 13%, the decline that made leadership redesign commercialisation.`;
  return { figure, verdict, tone: p >= 25 ? 'yes' : p > 13 ? 'open' : 'no' };
}

function describe(a: S, b: S) {
  if (a.total !== b.total) return `Total revenue now $${b.total}m: the same new-product revenue is a ${Number(b.total) > Number(a.total) ? 'smaller' : 'larger'} share, so NPS ${Number(b.total) > Number(a.total) ? 'falls' : 'rises'}.`;
  if (a.fresh !== b.fresh) return `Revenue from newly commercialised products now $${b.fresh}m: NPS ${Number(b.fresh) > Number(a.fresh) ? 'rises' : 'falls'}, because it is that revenue's share of the total.`;
  if (a.showRd !== b.showRd) return b.showRd ? 'R&D at 10% of revenue shown. Dow Corning spent this throughout, yet NPS fell from about 25% to 13%: spending is not commercialisation.' : 'R&D bar hidden.';
  return '';
}

const money = (vals: string[]) => vals.map((v) => ({ value: v, label: `$${v}m` }));

export default function NewProductMarketShare() {
  return (
    <Simulation<S>
      label="New Product Market Share: revenue from new products as a share of total revenue"
      terms={[
        { term: 'Commercialisation', def: 'Carrying an idea through testing and scale-up to a product that sells.' },
        { term: 'KPI', def: 'Key Performance Indicator: a number a company uses to track how it is doing.' },
        { term: 'New Product Market Share (NPS)', def: "Dow Corning's KPI: the % of revenue from newly commercialised products." },
        { term: 'R&D intensity', def: 'R&D spending as a share of revenue; about 10% at Dow Corning.' },
      ]}
      initial={initial}
      controls={[
        { key: 'total', label: 'Total revenue (illustrative)', type: 'select', options: money(['500', '800', '1000']) },
        { key: 'fresh', label: 'Revenue from newly commercialised products', type: 'select', options: money(['50', '104', '130', '200', '250']) },
        { key: 'showRd', label: 'Show the R&D spend (10% of revenue)', type: 'toggle' },
      ]}
      view={view}
      describe={describe}
      check={{
        question: 'A firm earns $1,000m, of which $130m comes from newly commercialised products. What is its NPS?',
        options: [
          { text: '13%, the same as Dow Corning in 1995', correct: true, why: 'NPS is new-product revenue divided by total revenue: 130 ÷ 1,000 = 13%, the level Dow Corning had fallen to by 1995.' },
          { text: "10%, the same as Dow Corning's R&D spend", why: '10% was the share of revenue Dow Corning spent on R&D; R&D spending is not part of the NPS calculation.' },
          { text: '87%, the share from its other products', why: '87% is the share earned by existing products; NPS counts only revenue from newly commercialised ones.' },
        ],
      }}
    />
  );
}
